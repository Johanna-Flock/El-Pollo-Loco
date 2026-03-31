class Endboss extends MovableObject {
    width=250; 
    height=400;
    y=50; 
    x; 
    currentImage = 0;
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

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(
            this.IMAGES_WALKING 
        );
        // this.speed = 0.15 + Math.random() * 0.5;  
        this.animate();
        this.x = 2500;
    }

       animate()   {  
         setInterval(() => {
           this.moveLeft(); 
        }, 1000/60);
        setInterval(() => { 
          this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}