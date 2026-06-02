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
        if (this.endbossBar.visible) {
        this.addToMap(this.endbossBar);
        }
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
        checkCollectables();
        checkCollisions();
        checkBossBlock();
        checkEnemyHits();
        checkStompEnemies()
        throwObjects();
        checkWinCondition();
        removeDeadEnemies();
        checkGameOver();
        checkEndbossActivation();
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
        this.endbossBar =
        new StatusBar(300, 0, "endboss");
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
