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
        this.draw(); // 👉 EINZIGER LOOP
        this.run();  // 👉 Logik-Loop
       
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
    //draw wird immer wieder aufgerufen, damit die Bewegungen sichtbar werden
    requestAnimationFrame(() => this.draw());
}


    drawGame() {
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
    this.addObjectsToMap(this.throwableObject);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0); 
    }

run() {
    setInterval(() => {

        this.handleInput();

        if (this.gameState !== "playing") {
            return; // ❗ nur Logik stoppen
        }
        this.checkCollectables();
        this.checkCollisions();
        this.checkEnemyHits();
        this.throwObjects();
        this.checkWinCondition();
        this.removeDeadEnemies();

    }, 1000 / 60);
}

    handleInput() {
    // START
    if (this.keyboard.S && this.gameState === "start") {
        this.startGame();
    }
    // RESTART
    if (this.keyboard.S && this.gameState === "gameover") {
        this.startGame();
    }
    if (this.keyboard.S && this.gameState === "winning") {
    this.startGame();
    }
       if (this.keyboard.P && this.gameState === "playing") {
        this.gameState = "paused";
        this.keyboard.P = false;
        return;
    }
    if (this.keyboard.P && this.gameState === "paused") {
        this.gameState = "playing";
        this.keyboard.P = false;
        return;
    }
    }

    startGame() {
    if (this.character) {
        this.character.stop(); // 👈 ALTE INTERVALLE STOPPEN
    }
    initLevel1();
    this.level = level1;
    console.log(this.level.coins);
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
    }
    

    setWorld() {
    this.character.world = this;
    this.character.animate(); // 👈 HIER starten!

    this.level.enemies.forEach(enemy => {
        enemy.world = this;
        enemy.animate(); // 👈 auch hier!
    });

    this.throwableObject.forEach(obj => {
        obj.world = this;
    });
}

removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter(enemy => {
        if (enemy instanceof Endboss) {
            return !enemy.isDeadAnimationFinished;
        }
        return true;
    });
}

checkWinCondition() {
    let boss = this.level.enemies.find(e => e instanceof Endboss);
    if (!boss) return;
    if (boss.isDeadAnimationFinished) {
        this.gameState = "winning";
    }
}

checkCollectables() {
    this.level.coins = this.level.coins.filter((coin) => {
        if (this.character.isColliding(coin)) {
            this.coinCount++;
            this.coinBar.setValueCoins(this.coinCount, this.maxCoins);
            return false;
        }
        return true; 
    });
    this.level.bottles = this.level.bottles.filter((bottle) => {
        if (this.character.isColliding(bottle)) {
            this.bottleCount++;
            this.bottleBar.setValueBottles(this.bottleCount, this.maxBottles);
            return false;
        }
        return true;
    });
}
    
    checkCollisions() {
    this.level.enemies.forEach((enemy) => {   
        if (this.character.isColliding(enemy)) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);

            if (this.character.isDead()) {
                this.gameState = "gameover";
            }
        }
    });
    }

  throwObjects() {
    if (this.keyboard.D) {
        if (this.bottleCount <= 0) {
            console.log("Keine Bottles mehr!");
            // später: sound abspielen
            this.keyboard.D = false;
            return;
        }
        let bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100
        );
        this.throwableObject.push(bottle);
        this.bottleCount--;
        this.bottleBar.setValueBottles(this.bottleCount, this.maxBottles);
        this.keyboard.D = false;
    }
    }

    checkEnemyHits() {
    let endboss = this.level.enemies.find(e => e instanceof Endboss);
    if (!endboss) return;

    this.throwableObject.forEach((bottle, bottleIndex) => {
        if (bottle.isColliding(endboss)) {
            endboss.hit();
            this.throwableObject.splice(bottleIndex, 1);
        }
    });
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
        this.addToMap(object);
        }); 
    }
       
    addToMap(mo) {
        console.log("DRAW OBJECT:", mo);
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
        mo.drawFrame(this.ctx);
        this.ctx.restore();

        } else {
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        }
    } 
}
