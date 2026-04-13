class World {

    character = new Character();
    level = null;
    canvas; 
    ctx;
    keyboard; 
    camera_x = 0;
    statusBar = new StatusBar(); 
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
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObject);
    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0); 
    }

run() {
    setInterval(() => {

        this.handleInput();

        if (this.gameState !== "playing") {
            return; // ❗ nur Logik stoppen
        }

        this.checkCollisions();
        this.throwObjects();

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
    this.character = new Character();
    this.statusBar = new StatusBar();
    this.throwableObject = [];
    this.setWorld();
    this.gameState = "playing";
    this.keyboard.S = false;
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
        enemy.world = this; 
        this.throwableObject.forEach(obj => {
        obj.world = this;
    });
    });
    
    } 
    
    checkCollisions() {
    this.level.enemies.forEach((enemy) => {   
        if (this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);

            if (this.character.isDead()) {
                this.gameState = "gameover";
            }
        }
    });
    }

    throwObjects() {
        if(this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x +100 , this.character.y + 100);
            this.throwableObject.push(bottle);
            this.keyboard.D = false; //Damit wird verhindert, dass bei gedrückter D-Taste unendlich viele Objekte geworfen werden
        }
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
