class MovableObject {
    x=100;
    y=280;
    img; 
    width=100; 
    height=150;
    speed=0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    ImageCache = {};
    energy = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path; //Hier wird das Bild geladen, indem ein neues Image-Objekt erstellt und die src-Eigenschaft auf den Pfad des Bildes gesetzt wird
            this.ImageCache[path] = img; //Hier wird das geladene Bild im ImageCache-Objekt gespeichert, wobei der Pfad des Bildes als Schlüssel und das geladene Bild als Wert verwendet wird
        });

    }

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
            if(this.isAboveGround() || this.speedY < 0 ) {
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
        return this.y < 140;
    }

    draw(ctx) { 
       ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
        ctx.beginPath();
        ctx.lineWidth = '1';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x + mo.width &&
               this.y < mo.y + mo.height;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    isDead() {
        return this.energy == 0;
    }



}