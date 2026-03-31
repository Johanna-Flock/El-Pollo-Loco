class Chicken extends MovableObject {
    width=100; 
    height=100;
    y=320; 
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png', 
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png', 
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

currentImage = 0;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500; //Hiermit wird die x-Position der Hühner zufällig zwischen 200 und 700 festgelegt, damit sie nicht alle an der gleichen Stelle erscheinen
        this.loadImages(
            this.IMAGES_WALKING 
        );
        this.speed = 0.15 + Math.random() * 0.5;  
        this.animate();
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