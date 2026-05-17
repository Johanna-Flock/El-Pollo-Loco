class SmallChicken extends MovableObject {
    height = 50;
    width = 50      
    y = 140;

    

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];  

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    currentImage = 0;

    constructor(x =800 + Math.random() * 1200) {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.x = x;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);  
    this.state = "walking";
    this.startFalling = false;
    this.speed = 0.3 + Math.random() * 1.2;
    this.jumpInterval = null;
    this.isJumping = false;
    this.applyGravity()
    this.soundPlayed = false;
    this.animate();
    this.startBouncing();

}


jump() {
    if (this.isAboveGround()) return;
    this.speedY = -12; 
}

startBouncing() {
    const bounce = () => {
        if (this.state === "walking") {
            if (Math.random() < 0.4) {
                this.jump();
            }
        }
        const delay = 1200 + Math.random() * 2000;
        setTimeout(bounce, delay);
    };
    bounce();
}


animate() {
    this.movementInterval = setInterval(() => {
        this.checkSoundTrigger();
        if (this.state === "falling") {
            this.y += 5;
            return;
        }
        if (this.state === "dead") {
            return;
        }
        if (this.state === "walking") {
            this.moveLeft();
        }
    }, 1000 / 60);
    this.animationInterval = setInterval(() => {

        if (this.state === "dead" || this.state === "falling") {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 200);
}

hit() {
    if (this.state === "dead") return;
    this.energy = 0;
    this.state = "dead";
    this.world.audio.onChickenDead();
    setTimeout(() => {
        this.state = "falling";
    }, 200); 
}

stop() {
    clearInterval(this.movementInterval);
    clearInterval(this.animationInterval);
}

checkSoundTrigger() {
    let distance = Math.abs(this.world.character.x - this.x);
    if (distance < 400 && !this.soundPlayed) {
        this.soundPlayed = true;
        this.world.audio.onSmallChicken();
    }
}


}