class World {

    character =new Character();
    level = level1;
    canvas; 
    ctx;
    keyboard; 
    camera_x = 0;
   
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; //Hier schreiben wir den Parameter canvas in die Eigenschaft this.canvas, damit wir ihn später in der draw-Methode verwenden können
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.checkCollisions();
     }


    setWorld() {
        this.character.world = this;} 
    


    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {   
                if(this.character.isColliding(enemy)) {
                    console.log("Collision with Enemy", enemy);
                    this.character.hit();
                    if (this.character.isDead) {
                        console.log("Game Over");
                    }
                }
            });
        }, 200);
    }


    draw() {
        //mit dieser Methode clearen wir den Canvas, damit die Bilder nicht übereinander liegen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0); 
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
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
    // console.log(mo.img);
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
