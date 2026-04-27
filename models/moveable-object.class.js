class MovableObject extends DrawableObject {
    x=100;
    y=280;
    speed=0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 300;
    lastHit = 0;

  
    moveRight() {
        this.x += this.speed;
        
    }

    moveLeft() {
       this.x -= this.speed;
    }

    playAnimation(images) {
           let i = this.currentImage % images.length; 
            //modulo ist immer der Rest beim Geteilt; i= 0, 1, 2, 3, 4, 5; wenn i=6 ist, dann ist i=0; unendliche Reihe
            let path = images[i];
            this.img = this.ImageCache[path]; 
            this.currentImage++; }; 


    applyGravity() {
        setInterval(() => {
            // if(this.isAboveGround() || this.speedY < 0 )
            if(this.isAboveGround() || this.speedY <= 0 ) {
               this.speedY += this.acceleration;
               this.y += this.speedY;
            } 
        
            if (!this.isAboveGround()) {
            this.canJump = true;
        }
        }
        , 1000/25);
    }


    isAboveGround() {
        if(this instanceof ThrowableObject) { //throwable objects should always fall
            return true;
        }
        return this.y < 140;
    }

    // isColliding(mo) {
    //     return this.x + this.width > mo.x &&
    //            this.y + this.height > mo.y &&
    //            this.x < mo.x + mo.width &&
    //            this.y < mo.y + mo.height;
    // }

    isColliding(mo) {
    return this.x + this.width - 20 > mo.x &&
           this.x + 20 < mo.x + mo.width &&
           this.y + this.height - 10 > mo.y &&
           this.y + 10 < mo.y + mo.height;
    }

    isDead() {
        return this.energy === 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Different in ms
        timepassed = timepassed / 1000; //Different in s
        return timepassed < 1; //getroffen in den letzten 1 Sekunde
    }

    isIdle() {
    let timePassed = Date.now() - this.lastAction;
    timePassed = timePassed / 1000; // Sekunden
    return timePassed > 3; // 👉 nach 3 Sekunden idle
    }

    isSleeping() {
    let timePassed = Date.now() - this.lastAction;
    timePassed = timePassed / 1000;
    return timePassed > 10; // 👉 nach 10 Sekunden schlafen
    }

}