class World {

    character = new Character();
    level = null;
    canvas; 
    ctx;
    keyboard; 
    camera_x = 0;
    statusBar = new StatusBar(); 
    throwableObject = [];
   
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; //Hier schreiben wir den Parameter canvas in die Eigenschaft this.canvas, damit wir ihn später in der draw-Methode verwenden können
        this.keyboard = keyboard;
        this.run();
    }



    setWorld() {
        this.character.world = this;} 
    
    checkCollisions() {
            this.level.enemies.forEach((enemy) => {   
                if(this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy)
                    console.log("Character Energy: ", this.character.energy);
                    if (this.character.isDead()) {
                        console.log("Game Over");
                    }
                }
            });
    }
    
//GameLoop
    run() {
        setInterval(() => {
            this.startGame();
            if(this.level) {
                this.checkCollisions();
                this.throwObjects();
            }
        }, 25);
    }

 startGame() {
    if (this.keyboard.S && !this.level) {
        initLevel1();
        this.level = level1;
        this.character = new Character();
        this.statusBar = new StatusBar();
        this.throwableObject = [];
        this.setWorld();
        this.draw();
        this.keyboard.S = false;
    }
}

    throwObjects() {
        if(this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x +100 , this.character.y + 100);
            this.throwableObject.push(bottle);
            this.keyboard.D = false; //Damit wird verhindert, dass bei gedrückter D-Taste unendlich viele Objekte geworfen werden
        }
    }


    draw() {
        //mit dieser Methode clearen wir den Canvas, damit die Bilder nicht übereinander liegen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        
        //draw wird immer wieder aufgerufen, damit die Bewegungen sichtbar werden
        requestAnimationFrame(() => this.draw());             
    }; 
  

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
