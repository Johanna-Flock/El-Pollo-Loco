class World {
    character = new Character();
    level = null;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObject = [];
    gameState = "start";

/**
 * Creates a new game world instance and initializes
 * all core game systems and screens.
 * 
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 * @param {Object} keyboard - The keyboard input controller.
 */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; //Hier schreiben wir den Parameter canvas in die Eigenschaft this.canvas, damit wir ihn später in der draw-Methode verwenden können
        this.keyboard = keyboard;
        this.startScreen = new Screen("img/9_intro_outro_screens/start/startscreen_1.png");
        this.gameOverScreen = new Screen("img/You won, you lost/You lost.png");
        this.winScreen = new Screen("img/You won, you lost/You won A.png");
        this.pauseScreen = new Screen("icons/Pause_Screen_Version3.png");
        this.audio = new AudioManager();
        this.draw(); 
        this.run();  
        this.gameOverTriggered = false;
        this.deathSoundPlayed = false;
    }

/**
 * Main render loop of the game.
 * Clears the canvas and draws the current game state.
 */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.gameState === "start") {
            this.startScreen.draw(this.ctx);
        }
        if (this.gameState === "playing") {
            this.drawGame();
        }
        if (this.gameState === "gameover") {
            this.gameOverScreen.draw(this.ctx);
        }
        if (this.gameState === "winning") {
            this.winScreen.draw(this.ctx);
        }
        if (this.gameState === "paused") {
            this.pauseScreen.draw(this.ctx);
        }
        requestAnimationFrame(() => this.draw());
    }

/**
 * Draws all game elements during gameplay.
 */
    drawGame() {
        if (!this.level || !this.character) {
            return;
        }
        this.enterWorldView();
        this.drawBackground();
        this.drawFixedUI();
        this.drawWorldObjects();
        this.exitWorldView();
    }

/**
 * Applies the camera translation to the canvas.
 */
    enterWorldView() {
        this.ctx.translate(this.camera_x, 0);
    }

/**
 * Resets the camera translation of the canvas.
 */
    exitWorldView() {
        this.ctx.translate(-this.camera_x, 0);
    }

/**
 * Draws all background elements and clouds.
 */
    drawBackground() {
        this.addObjectsToMap(
            this.level.backgroundObjects
        );

        this.addObjectsToMap(
            this.level.clouds
        );
    }

/**
 * Draws all fixed UI elements such as status bars.
 */
    drawFixedUI() {
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.ctx.translate(this.camera_x, 0);
    }

/**
 * Draws all interactive world objects.
 */
    drawWorldObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.drawFlyingBottles();
        this.addObjectsToMap(this.level.enemies);
        this.drawBottleSplashes();
    }

/**
 * Draws all flying throwable bottles.
 */
    drawFlyingBottles() {
        this.addObjectsToMap(
            this.throwableObject.filter(
                bottle => bottle.state !== "splash"
            )
        );
    }

/**
 * Draws all bottle splash animations.
 */
    drawBottleSplashes() {
        this.addObjectsToMap(
            this.throwableObject.filter(
                bottle => bottle.state === "splash"
            )
        );
    }

/**
 * Pauses the game and disables all active entities.
 */
    pauseGame() {
        this.gameState = "paused";
        this.character.active = false;
        this.level.enemies.forEach(e => e.active = false);
        this.audio.pauseMusic();
        this.audio.onPause();
    }

/**
 * Resumes the game after being paused.
 */
    resumeGame() {
        this.gameState = "playing";
        this.character.active = true;
        this.level.enemies.forEach(e => e.active = true);
        this.audio.resumeMusic();
    }

/**
 * Starts the main game logic loop.
 */
    run() {
        setInterval(() => {
            this.handleInput();
            if (this.gameState !== "playing") {
                return;
            }
            this.update();
        }, 1000 / 60);
    }

/**
 * Updates all gameplay systems each frame.
 */
    update() {
        this.checkCollectables();
        this.checkCollisions();
        this.checkBossBlock();
        this.checkEnemyHits();
        this.checkStompEnemies()
        this.throwObjects();
        this.checkWinCondition();
        this.removeDeadEnemies();
        this.checkGameOver();
    }

/**
 * Handles all keyboard input logic.
 */
    handleInput() {
        this.handleStartInput();
        this.handlePauseInput();
        this.handleEscapeInput();
    }

/**
 * Starts the game when the start key is pressed.
 */
    handleStartInput() {
        if (
            this.keyboard.S &&
            this.gameState === "start"
        ) {
            this.keyboard.S = false;
            this.startGame();
        }
    }

/**
 * Handles pause and resume input depending on the current game state.
 * Pauses the game when the P key is pressed during gameplay
 * and resumes the game when pressed again while paused.
 */
    handlePauseInput() {
        if (this.keyboard.P && this.gameState === "playing"
        ) {
            this.pauseGame();
            this.keyboard.P = false;
            return;
        }
        if (this.keyboard.P && this.gameState === "paused"
        ) {
            this.resumeGame();
            this.keyboard.P = false;
            return;
        }
    }

/**
 * Handles escape input and returns the player to the start screen.
 * Plays an escape sound and delays the transition slightly.
 */
    handleEscapeInput() {
        if (
            this.keyboard.ESC &&
            (
                this.gameState === "playing" ||
                this.gameState === "gameover" ||
                this.gameState === "winning"
            )
        ) {
            this.keyboard.ESC = false;
            this.audio.onEscape();
            setTimeout(() => {
                this.goToStart();
            }, 500);
        }
    }

/**
 * Starts a new game by initializing all game objects,
 * resetting values, setting the world reference,
 * and starting the level music.
 */
    startGame() {
        if (this.character) {
            this.stopCharacterAndEnemies();
        }
        this.initGameObjects();
        this.initStatusBars();
        this.resetGameValues();
        this.setWorld();
        this.startLevelMusic();
        this.gameState = "playing";
        this.keyboard.S = false;
    }

/**
 * Initializes all status bars used in the game UI.
 */
    initStatusBars() {
        this.healthBar =
            new StatusBar(20, 0, "health");
        this.coinBar =
            new StatusBar(20, 60, "coins");
        this.bottleBar =
            new StatusBar(20, 120, "bottles");
    }

/**
 * Resets collectible counters and stores
 * the maximum amount of coins and bottles in the level.
 */
    resetGameValues() {
        this.maxCoins =
            this.level.coins.length;
        this.maxBottles =
            this.level.bottles.length;
        this.coinCount = 0;
        this.bottleCount = 0;
    }

/**
 * Stops currently playing music and starts the level music.
 */
    startLevelMusic() {
        this.audio.stopMusic();
        this.audio.playMusic(
            this.audio.GameMusicLevel1
        );
    }

/**
 * Initializes all game objects required for a new level.
 */
    initGameObjects() {
        initLevel1();
        this.level = level1;
        this.character = new Character();
        this.throwableObject = [];
    }

/**
 * Assigns the world reference to all relevant objects
 * and starts character and enemy animations.
 */
    setWorld() {
        this.character.world = this;
        this.character.animate(); // 👈 HIER starten!
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            enemy.animate();
        });
        this.throwableObject.forEach(obj => {
            obj.world = this;
        });
    }

/**
 * Removes enemies that are fully defeated and no longer needed.
 * Chickens are removed after falling out of the screen,
 * while the endboss is removed after its death animation finishes.
 */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => {
            if (enemy instanceof Chicken) {
                return !(enemy.state === "dead" && enemy.y > 600);
            }
            if (enemy instanceof Endboss) {
                return !enemy.isDeadAnimationFinished;
            }
            return true;
        });
    }

/**
 * Checks if the player has defeated the endboss
 * and triggers the winning state.
 */
    checkWinCondition() {
        let boss = this.level.enemies.find(e => e instanceof Endboss);
        if (!boss) return;
        if (boss.isDeadAnimationFinished && this.gameState !== "winning") {
            setTimeout(() => {
                this.audio.stopBossSound();
                this.setWinning();
                if (this.onGameOverUI) {
                    this.onGameOverUI();
                }
            }, 200);
        }
    }

/**
 * Triggers the winning state, stops gameplay,
 * plays the winning sound, and returns to the start screen after a delay.
 */
    setWinning() {
        this.gameState = "winning";
        this.audio.stopMusic();
        this.audio.playSound(this.audio.winningSound);
        this.stopCharacterAndEnemies();
        setTimeout(() => {
            this.gameState = "start";
            this.audio.playMusic(this.audio.startScreenMusic);
        }, 4000);
    }

/**
 * Stops the character and all enemies by clearing
 * their active intervals and animations.
 */
    stopCharacterAndEnemies() {
        this.character.stop();
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                if (enemy.stop) {
                    enemy.stop();
                }
            });
        }
    }

/**
 * Returns the game to the start screen,
 * resets audio and keyboard input,
 * and triggers the exit menu callback if available.
 */
    goToStart() {
        this.gameState = "start";
        this.stopCharacterAndEnemies();
        this.audio.stopAllSounds();
        this.audio.playMusic(
            this.audio.startScreenMusic
        );
        this.resetKeyboard();
        if (this.onExitToMenu) {
            this.onExitToMenu();
        }
    }

/**
 * Resets all keyboard input states.
 */
    resetKeyboard() {
        this.keyboard.S = false;
        this.keyboard.D = false;
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.SPACE = false;
        this.keyboard.P = false;
        this.keyboard.ESC = false;
    }

/**
 * Checks if coins or bottles have been collected
 * and removes collected items from the level.
 */
    checkCollectables() {
        if (!this.level) return;
        this.level.coins =
            this.level.coins.filter(
                coin => this.checkCoinCollect(coin)
            );
        this.level.bottles =
            this.level.bottles.filter(
                bottle => this.checkBottleCollect(bottle)
            );
    }

/**
 * Checks if the character collects a coin.
 * Updates the coin counter and UI when collected.
 * 
 * @param {CollectableObject} coin - The coin to check.
 * @returns {boolean} True if the coin should remain in the level.
 */
    checkCoinCollect(coin) {
        if (
            this.character.isNearItem(coin, 65)
        ) {
            this.audio.onCoinCollect();
            this.coinCount++;
            this.coinBar.setValueCoins(this.coinCount, this.maxCoins);
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
    checkBottleCollect(bottle) {
        if (
            this.character.isNearItem(bottle, 80)
        ) {
            this.audio.onBottleCollect();
            this.bottleCount++;
            this.bottleBar.setValueBottles(
                this.bottleCount,
                this.maxBottles
            );
            return false;
        }
        return true;
    }

/**
 * Checks collisions between the character and enemies.
 * Handles stomp damage, regular damage,
 * and collision reset logic.
 */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            let colliding =
                this.character.isColliding(enemy);
            if (this.handleStompCollision(enemy, colliding)
            ) {
                return;
            }
            this.handleDamageCollision(enemy, colliding);
            this.resetEnemyCollision(enemy, colliding);
        });
    }

/**
 * Handles stomp collisions where the character jumps on an enemy.
 * 
 * @param {MovableObject} enemy - The collided enemy.
 * @param {boolean} colliding - Whether the character is colliding.
 * @returns {boolean} True if a stomp collision occurred.
 */
    handleStompCollision(enemy, colliding) {
        if (colliding && this.character.isStomping(enemy)) {
            enemy.hit?.();
            this.character.speedY = -10;
            enemy.canDealDamage = false;
            enemy.isTouching = true;
            return true;
        }
        return false;
    }

/**
 * Handles damage collisions between the character and enemies.
 * 
 * @param {MovableObject} enemy - The collided enemy.
 * @param {boolean} colliding - Whether the character is colliding.
 */
    handleDamageCollision(enemy, colliding) {
        if (this.character.isStomping(enemy)) {
        return;
    }
        if (colliding && enemy.canDealDamage) {
            enemy.isTouching = true;
            this.character.hit(enemy.damage);
            this.healthBar.setPercentage(
                this.character.energy
            );
            enemy.canDealDamage = false;
        }
    }

/**
 * Resets enemy collision states when the character
 * moves away from the enemy.
 * 
 * @param {MovableObject} enemy - The enemy to reset.
 * @param {boolean} colliding - Whether the character is colliding.
 */
    resetEnemyCollision(enemy, colliding) {
        let dx = this.character.x - enemy.x;
        if (!colliding || Math.abs(dx) > 50) {
            enemy.isTouching = false;
            enemy.canDealDamage = true;
        }
    }

/**
 * Checks whether the player has died
 * and triggers the game over sequence after a delay of 3 seconds.
 */
    checkGameOver() {
        if (this.gameState !== "playing") return;
        if (this.character.isDead() && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            setTimeout(() => {
                this.setGameOver();
            }, 3000); 
        }
    }

/**
 * Triggers the game over state,
 * stops gameplay and sounds,
 * and returns to the start screen after a delay.
 */
    setGameOver() {
        this.gameState = "gameover";
        this.stopCharacterAndEnemies();
        this.audio.stopAllSounds();
        this.audio.playSound(this.audio.gameOverSound);
        if (this.onGameOverUI) {
            this.onGameOverUI();
        }
        setTimeout(() => { //
            this.gameState = "start";
            this.audio.playMusic(this.audio.startScreenMusic);
            this.gameOverTriggered = false;
            this.deathSoundPlayed = false;
        }, 3000);
    }

/**
 * Handles bottle throwing input and creates
 * a throwable bottle if possible.
 */
    throwObjects() {
        if (!this.keyboard.D || this.character.isThrowing) {
            return;
        }
        if (this.character.isSleeping()) {
            this.character.wakeUp();
        }
        this.character.isThrowing = true;
        if (this.bottleCount <= 0) {
            this.resetThrowState();
            return;
        }
        this.createThrowableBottle();
        this.updateBottleUI();
        this.audio.onThrow();
        this.resetThrowState();
    }

/**
 * Creates a throwable bottle object
 * based on the character direction.
 */
    createThrowableBottle() {
        let direction =
            this.character.otherDirection
                ? -1
                : 1;
        let bottle =
            new ThrowableObject(this.character.x + (direction === 1 ? 100 : -20), this.character.y + 100, 8 * direction);
        this.throwableObject.push(bottle);
        this.bottleCount--;
    }

/**
 * Updates the bottle status bar UI.
 */
    updateBottleUI() {
        this.bottleBar.setValueBottles(this.bottleCount, this.maxBottles);
    }

/**
 * Resets the throwing state and keyboard input.
 */
    resetThrowState() {
        this.keyboard.D = false;
        this.character.isThrowing = false;
    }

/**
 * Prevents the character from moving through the endboss.
 */
    checkBossBlock() {
        this.level.enemies.forEach(enemy => {
            if (!(enemy instanceof Endboss)) return;
            if (enemy.state === "dead") return;
            if (this.character.isColliding(enemy) && !this.character.isStomping(enemy)) {
                if (this.character.x < enemy.x) {
                    this.character.x = enemy.x - this.character.width + 20;
                }
                else { this.character.x = enemy.x + enemy.width - 20; }
            }
        });
    }

/**
 * Checks whether throwable bottles hit enemies.
 * Triggers enemy damage and splash animations.
 */
    checkEnemyHits() {
        this.throwableObject =
            this.throwableObject.filter((bottle) => {
                let hit = false;
                this.level.enemies.forEach((enemy) => {
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
    checkStompEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Chicken || enemy instanceof SmallChicken)) return;
            if (this.character.isColliding(enemy)) {
                let characterBottom = this.character.y + this.character.height;
                let enemyTop = enemy.y;
                let fallingDown = this.character.speedY > 0;
                let isAboveEnemy = characterBottom <= enemyTop + 30;
                if (fallingDown && isAboveEnemy) {
                    enemy.hit();
                    this.character.speedY = -10;
                }
            }
        });
    }

/**
 * Draws multiple objects onto the canvas.
 * 
 * @param {Array} objects - The objects to render.
 */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

/**
 * Draws a single object onto the canvas.
 * Handles flipped rendering for objects facing the opposite direction
 * and skips finished death animations.
 * 
 * @param {MovableObject} mo - The object to render.
 */
    addToMap(mo) {
        if (!mo.img) {
            console.error("Kein Bild:", mo);
        }
        if (mo.isDeadAnimationFinished) {
            return;
        }
        if (mo.otherDirection) {
            this.drawFlipped(mo);
        } else {
            mo.draw(this.ctx);
        }
    }

/**
 * Draws an object mirrored horizontally.
 * Used for characters or enemies facing left.
 * 
 * @param {MovableObject} mo - The object to draw flipped.
 */
    drawFlipped(mo) {
        this.ctx.save();
        this.ctx.translate(mo.x + mo.width,0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage( mo.img,0,mo.y,mo.width,mo.height);
        this.ctx.restore();
    }

}
