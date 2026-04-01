class Character extends MovableObject {
    width=150; 
    height=280;
    y=140; 
    speed=10;
    speedY = 0;
    canJump = true;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png', 
        'img/2_character_pepe/2_walk/W-22.png', 
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png', 
        'img/2_character_pepe/3_jump/J-32.png', 
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png', 
        'img/2_character_pepe/5_dead/D-52.png', 
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png', 
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ]

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png', 
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ]   

    currentImage = 0;
    world; 

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(
            this.IMAGES_WALKING 
        );
        this.loadImages(
            this.IMAGES_JUMPING 
        );
        this.loadImages(
            this.IMAGES_DEAD
        );
        this.loadImages(
            this.IMAGES_HURT
        );

        this.applyGravity();
        this.animate(); 
    }

    animate()   {  
        setInterval(() => {

            if(this.world.keyboard.RIGHT && this.world.level.level_end_x > this.x) {
            this.moveRight(); 
            this.otherDirection = false;
            }
            
            if(this.world.keyboard.LEFT && this.x > 0 ) {
            this.moveLeft(); 
            this.otherDirection = true; 
            }

            if(this.world.keyboard.SPACE && !this.isAboveGround() && this.canJump) {
                this.jump();
                this.canJump = false;
            }

            this.world.camera_x = -this.x + 100; //„Verschiebe die Welt so, dass der Charakter immer bei x = 100 bleibt“
            // console.log("Person in x: ", this.x);
            // test collision
            // let distanceToEnemie1 = this.x - this.world.enemies[0].x;
            // console.log("Distance to Enemie 1: ", distanceToEnemie1);
            
        }, 1000/60); 

        setInterval(() => {
            if(this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else

            if(this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else

            if(this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else

            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            //walkanmition
            this.playAnimation(this.IMAGES_WALKING);
            }}, 100);

    }

    jump() {
      this.speedY = -20;
    }
}