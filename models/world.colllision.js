/**
 * sets visible to true when the character is close enough to the endboss
 */
function checkEndbossActivation() {
    let endboss = world.level.enemies.find(
        enemy => enemy instanceof Endboss);
    if (endboss && world.character.x > endboss.x - 500) {
        world.endbossBar.visible = true;
    }
}

/**
 * Checks if the character collects a coin.
 * Updates the coin counter and UI when collected.
 * 
 * @param {CollectableObject} coin - The coin to check.
 * @returns {boolean} True if the coin should remain in the level.
 */
    function checkCoinCollect(coin) {
        if (
            world.character.isNearCoin(coin, 52)
        ) {
            world.audio.onCoinCollect();
            world.coinCount++;
            world.coinBar.setValueCoins(world.coinCount, world.maxCoins);
            return false;
        }
        return true;
    }

/**
 * Checks if the character collects a bottle.
 * Updates the bottle counter and UI when collected.
 * 
 * @param {CollectableObject} bottle - The bottle to check.
 * @returns {boolean} True if the bottle should remain in the level.
 */
    function checkBottleCollect(bottle) {
        if (
            world.character.isNearBottle(bottle)
        ) {
            world.audio.onBottleCollect();
            world.bottleCount++;
            world.bottleBar.setValueBottles(
                world.bottleCount,
                world.maxBottles
            );
            return false;
        }
        return true;
    }

/**
 * Checks if coins or bottles have been collected
 * and removes collected items from the level.
 */
    function checkCollectables() {
        if (!world.level) return;
        world.level.coins =
            world.level.coins.filter(
                coin => checkCoinCollect(coin)
            );
        world.level.bottles =
            world.level.bottles.filter(
                bottle => checkBottleCollect(bottle)
            );
    }

/**
 * Removes enemies that are fully defeated and no longer needed.
 * Chickens are removed after falling out of the screen,
 * while the endboss is removed after its death animation finishes.
 */
    function removeDeadEnemies() {
    world.level.enemies = world.level.enemies.filter(enemy => {
        if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
            return !((enemy.state === "dead" || enemy.state === "falling") && enemy.y > 600);
        }
        if (enemy instanceof Endboss) {
            return !enemy.isDeadAnimationFinished;
        }
        return true;
    });
}

/**
 * Returns collision type between character and enemy.
 * @param {Object} enemy
 * @returns {"stomp"|"damage"|"none"}
 */
function getCollisionType(enemy) {
    if (world.character.isStomping(enemy)) {
        return "stomp";
    }
    if (world.character.isColliding(enemy)) {
        return "damage";
    }
    return "none";
}

/**
 * Main collision loop for all enemies.
 */
function checkCollisions() {
    world.level.enemies.forEach((enemy) => {
        let type = getCollisionType(enemy);
        if (type === "stomp") {
            handleStompCollision(enemy);
        }
        if (type === "damage") {
            handleDamageCollision(enemy);
        }
        resetEnemyCollision(enemy, type);
    });
}

/**
 * Handles stomp collision (enemy gets hit, player bounces).
 */
function handleStompCollision(enemy) {
    if (enemy.stomped) return;
    enemy.stomped = true;
    enemy.stompedTime = Date.now();
    enemy.hit?.();
    world.character.speedY = -10;
    enemy.canDealDamage = false;
    enemy.isTouching = true;
}

/**
 * Handles damage collision (player gets hit by enemy).
 */
function handleDamageCollision(enemy) {
    if (enemy.stomped) return;
    if (!enemy.stompedTime) {
        enemy.stompedTime = 0;
    }
    let recentlyStomped =
        enemy.stompedTime > 0 &&
        Date.now() - enemy.stompedTime < 400;
    if (recentlyStomped) return;
    enemy.isTouching = true;
    world.character.hit(enemy.damage);
    world.healthBar.setPercentage(world.character.energy);
    enemy.canDealDamage = false;
}

/**
 * Resets collision state when no contact exists.
 */
function resetEnemyCollision(enemy, type) {
    if (type !== "none") return;
    enemy.isTouching = false;
    enemy.canDealDamage = true;
    if (Date.now() - enemy.stompedTime > 800) {
        enemy.stomped = false;
        enemy.stompedTime = 0;
    }
}

/**
 * Handles bottle throwing input and creates
 * a throwable bottle if possible.
 */
    function throwObjects() {
     if (world.character.isDead()) return;
    let now = Date.now();
    if (now - world.throwCooldown < 1000) {
        return;}
    if (!world.keyboard.D || world.character.isThrowing) {
        return;}
    if (world.character.isSleeping()) {
        world.character.wakeUp();
    }
    world.character.isThrowing = true;
    if (world.bottleCount <= 0) {
        resetThrowState();
        return;}
    createThrowableBottle();
    updateBottleUI();
    world.audio.onThrow();
    world.throwCooldown = now;
    resetThrowState();
}

/**
 * Creates a throwable bottle object
 * based on the character direction.
 */
 function createThrowableBottle() {
        let direction =
            world.character.otherDirection
                ? -1
                : 1;
        let bottle =
            new ThrowableObject(world.character.x + (direction === 1 ? 100 : -20), world.character.y + 100, 8 * direction);
        world.throwableObject.push(bottle);
        world.bottleCount--;
    }

/**
 * Updates the bottle status bar UI.
 */
  function updateBottleUI() {
        world.bottleBar.setValueBottles(world.bottleCount, world.maxBottles);
    }

/**
 * Resets the throwing state and keyboard input.
 */
  function resetThrowState() {
        world.keyboard.D = false;
        world.character.isThrowing = false;
    }

/**
 * Prevents the character from moving through the endboss.
 */
    function checkBossBlock() {
        if (!world?.level?.enemies) return;
        world.level.enemies.forEach(enemy => {
            if (!(enemy instanceof Endboss)) return;
            if (enemy.state === "dead") return;
            if (world.character.isColliding(enemy) && !world.character.isStomping(enemy)) {
                if (world.character.x < enemy.x) {
                    world.character.x = enemy.x - world.character.width + 20;
                }
                else { world.character.x = enemy.x + enemy.width - 20; }
            }
        });
    }   
    
/**
 * Checks whether throwable bottles hit enemies.
 * Triggers enemy damage and splash animations.
 */
    function checkEnemyHits() {
        if (!world?.level?.enemies) return;
        if (world.character.isDead()) return;
        world.throwableObject =
            world.throwableObject.filter((bottle) => {
                let hit = false;
                world.level.enemies.forEach((enemy) => {
                    if (bottle.state !== "splash" && bottle.isColliding(enemy)) {
                        enemy.hit();
                        bottle.splash();
                        hit = true;
                    }
                });
                return !bottle.splashAnimationFinished;
            });
    }  
    
/**
 * Checks whether the character stomps enemies from above.
 * Applies bounce-back movement after a successful stomp.
 */
    function checkStompEnemies() {
        if (!world || !world.level || !world.level.enemies) return;
        world.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Chicken || enemy instanceof SmallChicken)) return;
            if (world.character.isColliding(enemy)) {
                let characterBottom = world.character.y + world.character.height;
                let enemyTop = enemy.y;
                let fallingDown = world.character.speedY > 0;
                let isAboveEnemy = characterBottom <= enemyTop + 30;
                if (fallingDown && isAboveEnemy) {
                    enemy.hit();
                    world.character.speedY = -10;
                }
            }
        });
    }