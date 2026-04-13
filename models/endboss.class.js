class Endboss extends MovableObject {
    width=250; 
    height=400;
    y=50; 
    x; 
    currentImage = 0;
    isDead = false;

    state
// "idle"
// "alert"
// "chase"
// "attack"

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png', 
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png', 
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png', 
        'img/4_enemie_boss_chicken/2_alert/G6.png', 
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];  

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ]; 
    
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png', 
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];



    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.state = "idle";

        this.animate();
        this.x = 2500;
    }

    animate() {
    setInterval(() => {
        this.handleState();   // 👈 Bewegung / Logik
    }, 1000 / 60);

    setInterval(() => {
        this.handleAnimation(); // 👈 nur Animation
    }, 200);
    }


 handleAnimation() {

    if (this.state === "alert") {
        this.playAnimation(this.IMAGES_ALERT);

    } else if (this.state === "attack") {
        this.playAnimation(this.IMAGES_ATTACK);

    } else if (this.state === "chase") {
        this.playAnimation(this.IMAGES_WALKING);

    } else {
        this.playAnimation(this.IMAGES_WALKING);
    }
}

handleState() {

   let distance = this.world.character.x - this.x;

    // -------------------
    // 💤 IDLE / WALK
    // -------------------
    if (this.state === "idle") {
        this.moveLeft();
    }

    // -------------------
    // 👀 ALERT TRIGGER
    // -------------------
    if (this.state === "idle" && distance > -500) {
        this.state = "alert";

        this.alertPlayed = false; // wichtig
    }

    // -------------------
    // 🔥 ALERT einmal spielen
    // -------------------
    if (this.state === "alert") {

        if (!this.alertPlayed) {
            this.playAnimation(this.IMAGES_ALERT);
            this.alertPlayed = true;

            setTimeout(() => {
                this.state = "chase";
            }, 1000);
        }
    }

    // -------------------
    // 🏃 CHASE
    // -------------------
    if (this.state === "chase") {

        if (world.character.x < this.x) {
            this.moveLeft();
        } else {
            this.moveRight();
        }

        // wenn sehr nah → attack
        if (Math.abs(distance) < 150) {
            this.state = "attack";
        }
    }

    // -------------------
    // 💥 ATTACK
    // -------------------
    if (this.state === "attack") {
        // bleibt erstmal im attack state
        // (Animation läuft separat)
    }
}



}