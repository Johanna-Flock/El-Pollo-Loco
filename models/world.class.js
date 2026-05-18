class World {

    character = new Character();
    level = null;
    canvas; 
    ctx;
    keyboard; 
    camera_x = 0;
    throwableObject = [];
    gameState = "start";
    // "playing"
    // "paused"
    // "gameover"

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; //Hier schreiben wir den Parameter canvas in die Eigenschaft this.canvas, damit wir ihn später in der draw-Methode verwenden können
        this.keyboard = keyboard;
        this.startScreen = new Screen("img/9_intro_outro_screens/start/startscreen_1.png");
        this.gameOverScreen = new Screen("img/You won, you lost/You lost.png");
        this.winScreen = new Screen("img/You won, you lost/You won A.png");
        this.pauseScreen = new Screen("icons/Pause_Screen_Version3.png");
        this.audio = new AudioManager();
        this.draw(); // 👉 EINZIGER LOOP
        this.run();  // 👉 Logik-Loop
        this.gameOverTriggered = false;
        this.deathSoundPlayed = false;
       
    }

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
    //draw wird immer wieder aufgerufen, damit die Bewegungen sichtbar werden
    requestAnimationFrame(() => this.draw());
}


    drawGame() {
     if (!this.level || !this.character) {
        return;
    }
     //mit dieser Methode clearen wir den Canvas, damit die Bilder nicht übereinander liegen
    this.ctx.translate(this.camera_x, 0); 
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
     //space for fixed objects
    this.ctx.translate(-this.camera_x, 0); 
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(
    this.throwableObject.filter(
        bottle => bottle.state !== "splash"
    )
);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(
    this.throwableObject.filter(
        bottle => bottle.state === "splash"
    )
    );
    

    this.ctx.translate(-this.camera_x, 0); 
    }



run() {
    setInterval(() => {

        this.handleInput();

        if (this.gameState !== "playing") {
            return;
        }
        this.update();
    }, 1000 / 60);
}

update() {
    this.checkCollectables();
    this.checkCollisions();
    this.checkEnemyHits();
    this.checkStompEnemies()
    this.throwObjects();
    this.checkWinCondition();
    this.removeDeadEnemies();
    this.checkGameOver();
}

 handleInput() {

    // START
    if (this.keyboard.S && this.gameState === "start") {
        this.keyboard.S = false;
        this.startGame();
    }
    // RESTART GAMEOVER
    if (this.keyboard.S && this.gameState === "gameover") {
        this.keyboard.S = false;
        this.startGame();
    }
    // RESTART WINNING
    if (this.keyboard.S && this.gameState === "winning") {
        this.keyboard.S = false;
        this.startGame();
    }
    // PAUSE
    if (this.keyboard.P && this.gameState === "playing") {
        this.keyboard.P = false;
        this.gameState = "paused";
        this.audio.onPause();
        return;
    }
    if (this.keyboard.P && this.gameState === "paused") {
        this.keyboard.P = false;
        this.gameState = "playing";
        return;
    }
    if (
    this.keyboard.ESC &&
    (this.gameState === "playing" ||
     this.gameState === "gameover" ||
     this.gameState === "winning")
    ) {
    this.keyboard.ESC = false;
    this.audio.onEscape()
    setTimeout(() => {
        this.goToStart();
    }, 500);
    }
    }


    startGame() {
    if (this.character) {
    this.stopCharacterAndEnemies();
    }
    initLevel1();
    this.level = level1;
    this.maxCoins = this.level.coins.length;
    this.maxBottles = this.level.bottles.length;
    this.coinCount = 0;
    this.bottleCount = 0;
    this.character = new Character();
    this.healthBar = new StatusBar(20, 0, "health");
    this.coinBar = new StatusBar(20, 60, "coins");
    this.bottleBar = new StatusBar(20, 120, "bottles");
    this.throwableObject = [];
    this.setWorld();
    this.gameState = "playing";
    this.keyboard.S = false;
    this.audio.stopMusic();
    this.audio.playMusic(this.audio.GameMusicLevel1);
    }
    

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


goToStart() {
    this.gameState = "start";
    this.stopCharacterAndEnemies();
    this.audio.stopAllSounds();
    this.audio.playMusic(this.audio.startScreenMusic);
    this.keyboard.S = false;
    this.keyboard.D = false;
    this.keyboard.LEFT = false;
    this.keyboard.RIGHT = false;
    this.keyboard.SPACE = false;
    this.keyboard.P = false;
    this.keyboard.ESC = false;
    if (this.onExitToMenu) {
        this.onExitToMenu();
    }
}


checkCollectables() {
    this.level.coins = this.level.coins.filter((coin) => {
        if (this.character.isNearItem(coin, 65)) {
            this.audio.onCoinCollect();
            this.coinCount++;
            this.coinBar.setValueCoins(this.coinCount, this.maxCoins);
            return false;
        }
        return true; 
    });
    this.level.bottles = this.level.bottles.filter((bottle) => {
        if (this.character.isNearItem(bottle, 80)) {
            this.audio.onBottleCollect();
            this.bottleCount++;
            this.bottleBar.setValueBottles(this.bottleCount, this.maxBottles);
            return false;
        }
        return true;
    });
}

checkCollisions() {
    this.level.enemies.forEach((enemy) => {
        let colliding = this.character.isColliding(enemy);
        //Stomp
        if (colliding && this.character.isStomping(enemy)) {
            enemy.hit?.();
            this.character.speedY = -10;
            enemy.canDealDamage = false;
            enemy.isTouching = true;
            return;
        }
        //Damage
        if (colliding && enemy.canDealDamage) {
            enemy.isTouching = true;
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
            enemy.canDealDamage = false;
        }
        //Reset
        let dx = this.character.x - enemy.x;
        if (!colliding || Math.abs(dx) > 80) {
        enemy.isTouching = false;
        enemy.canDealDamage = true;
        }
        // if (!colliding) 
        //     { enemy.isTouching = false; } 
        // let dx = this.character.x - enemy.x; 
        // if (Math.abs(dx) > 80) 
        //     { enemy.canDealDamage = true; }
    });
}

checkGameOver() {
    if (this.gameState !== "playing") return;
    if (this.character.isDead() && !this.gameOverTriggered) {
        this.gameOverTriggered = true;
        setTimeout(() => {
            this.setGameOver();
        }, 1200); // nur Delay für Animation
    }
}

setGameOver() {
    this.gameState = "gameover";
    this.stopCharacterAndEnemies();
    this.audio.stopAllSounds();
    this.audio.playSound(this.audio.gameOverSound);
    if (this.onGameOverUI) {
        this.onGameOverUI();
    }
    setTimeout(() => {
        this.gameState = "start";
        this.audio.playMusic(this.audio.startScreenMusic);

        this.gameOverTriggered = false;
        this.deathSoundPlayed = false;
    }, 3000);
}

  throwObjects() {
    if (this.keyboard.D) {
        if (this.bottleCount <= 0) {
            this.keyboard.D = false;
            return;
        }
        let direction = this.character.otherDirection ? -1 : 1;
        let bottle = new ThrowableObject(
            this.character.x + (direction === 1 ? 100 : -20),
            this.character.y + 100, 8 * direction
        );
        this.throwableObject.push(bottle);
        this.audio.onThrow();
        this.bottleCount--;
        this.bottleBar.setValueBottles(this.bottleCount, this.maxBottles);
        this.keyboard.D = false;
    }
}

  
checkEnemyHits() {

    this.throwableObject =
        this.throwableObject.filter((bottle) => {
        let hit = false;
        this.level.enemies.forEach((enemy) => {
            if (
                bottle.state !== "splash" &&
                bottle.isColliding(enemy)
            ) {
                enemy.hit();
                bottle.splash();
                hit = true;
            }
        });
        return !bottle.splashAnimationFinished;
    });
}

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
                this.character.speedY = -10; // bounce
            }
        }
    });
}
    addObjectsToMap(objects) {
        objects.forEach(object => {
        this.addToMap(object);
        }); 
    }
       
    addToMap(mo) {
        if (!mo.img) {
        console.error("Kein Bild:", mo);
        }
        if (mo.isDeadAnimationFinished) {
        return;
        }
        if (mo.otherDirection) {
        this.ctx.save();
        this.ctx.translate(mo.x + mo.width, 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height); //hier benötigt man die x-Koordinate 0, da das Bild bereits durch die translate-Methode verschoben wurde  
        this.ctx.restore();

        } else {
        mo.draw(this.ctx);
        }
    } 

}
