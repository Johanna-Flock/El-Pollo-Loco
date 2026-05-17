class Chicken extends MovableObject {
    width=100; 
    height=100;
    y=320; 
   

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png', 
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png', 
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
    'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
];


currentImage = 0;

    constructor(x = 600 + Math.random() * 500) {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.x = x;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);   // 👈 WICHTIG
    this.state = "walking";
    this.startFalling = false;
    this.speed = 0.15 + Math.random() * 0.5;
    this.soundPlayed = false;
    this.animate()
    
}
    
animate() {
    this.movementInterval = setInterval(() => {
        this.checkSoundTrigger();
        if (this.state === "falling") {
            this.y += 5;
            return;
        }
        if (this.state === "dead") {
            // nur Animation, KEINE Bewegung
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
        this.world.audio.onBigChicken();
    }
}
}