class Endboss extends MovableObject {
    width=250; 
    height=400;
    y=50; 
    x; 
    currentImage = 0;
    isDead = false;
    alertPlayed = false;
    state = "walking";

// "alert" 
// "chase" --> "attack" (wenn zu nah dran) + moveLeft() oder moveRight() je nachdem, wo der Character ist
// "walking" (wenn zu weit weg)



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
        'img/4_enemie_boss_chicken/1_walk/G1.png', 
        'img/4_enemie_boss_chicken/1_walk/G2.png', 
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
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

        // this.animate();
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
        this.playAnimation(this.IMAGES_ATTACK);

    } else {
        this.playAnimation(this.IMAGES_WALKING);
    }
}

handleState() {

   let distance = Math.abs(this.world.character.x - this.x);

    if (this.state === "walking") {
        this.moveLeft();
    }

    if (this.state === "walking" && distance < 500){
        this.state = "alert";
        this.alertPlayed = false;
    }

    if (this.state === "alert") {

        if (!this.alertPlayed) {
            this.alertPlayed = true;

            setTimeout(() => {
                this.state = "chase";
            }, 1000);
        }
        return; // ❗️ Logik für "alert" stoppen, bis der Timer abgelaufen ist
    }

    if (this.state === "chase") {
        this.speed = 2;
        if (this.world.character.x < this.x) {
            this.moveLeft();
        } else {
            this.moveRight();
        }

        if (Math.abs(distance) > 600) {
            this.state = "walking";
        }
    }
}



}