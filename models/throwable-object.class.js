class ThrowableObject extends MovableObject {


    constructor(x, y, speedX) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.throw(this.x, this.y);
        this.height = 60;
        this.width = 60;
        this.loadImages(this.IMAGES_BOTTLEROTATION);
    }

    IMAGES_BOTTLEROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    ];

   throw() {
    this.speedY = -15;

    setInterval(() => { 
        this.x += this.speedX; // 👈 statt 7
    }, 25);

    this.applyGravity();
}

}