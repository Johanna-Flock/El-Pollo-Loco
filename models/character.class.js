class Character extends MovableObject {
    width=150; 
    height=280;
    y=140; 
    speed=10;
    speedY = 0;
    energy = 100;
    canJump = true;
    lastAction = Date.now();
    movementInterval;
    animationInterval;

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

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ]   

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
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
        this.loadImages(
            this.IMAGES_HURT
        );
        this.loadImages(
            this.IMAGES_IDLE
        );
        this.loadImages(
            this.IMAGES_LONG_IDLE
        );
        this.applyGravity();
        this.lastAnimationState = null;
        this.deathFrameIndex = 0;
        this.deathAnimationDone = false;
    }


    animate() {  

    this.movementInterval = setInterval(() => {
        if (!this.active) return;
        if(this.world.keyboard.RIGHT && this.world.level.level_end_x > this.x) {
            this.moveRight(); 
            this.otherDirection = false;
            this.lastAction = Date.now();
        }
        if(this.world.keyboard.LEFT && this.x > -600 ) {
            this.moveLeft(); 
            this.otherDirection = true; 
            this.lastAction = Date.now();
        }
        if(this.world.keyboard.SPACE && !this.isAboveGround() && this.canJump) {
            this.jump();
            this.canJump = false;
            this.lastAction = Date.now();
        }
        this.world.camera_x = -this.x + 50; 
            //„Verschiebe die Welt so, dass der Charakter immer bei x = 100 bleibt“

    }, 1000/60); 

   this.animationInterval = setInterval(() => {
    if (!this.active) return;
    let currentState = null;
    if (this.isDead()) {
        currentState = "dead";
        if (!this.deathAnimationDone) {
            let index = this.deathFrameIndex;
            this.img = this.ImageCache[this.IMAGES_DEAD[index]];
            this.deathFrameIndex++;
            if (this.deathFrameIndex >= this.IMAGES_DEAD.length - 1) {
                this.deathAnimationDone = true;
            }
        }
    } else if (this.isHurt()) {
        currentState = "hurt";
        this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
        currentState = "jumping";
        this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        currentState = "walking";
        this.playAnimation(this.IMAGES_WALKING);
    } else if (this.isSleeping()) {
        currentState = "sleeping";
        this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
        currentState = "idle";
        this.playAnimation(this.IMAGES_IDLE);
    }
    if (currentState !== this.lastAnimationState) {
        this.handleStateSound(currentState);
        this.lastAnimationState = currentState;
    }
}, 100);
    }

    controlDeathAnimation() {
         if (!this.deathAnimationDone) {
        let totalFrames = this.IMAGES_DEAD.length;
        let index = this.deathFrameIndex;
        this.img = this.ImageCache[this.IMAGES_DEAD[index]];
        this.deathFrameIndex++;
        if (this.deathFrameIndex >= totalFrames - 1) {
            this.deathAnimationDone = true;
        }
    }
    }

    handleStateSound(state) {
    switch(state) {
        case "hurt":
            this.world.audio.onCharacterHurt();
            break;
        case "dead":
            this.deathSoundPlayed = true;
            this.world.audio.onCharacterDeath();
            break;
        case "sleeping":
            this.world.audio.onSleep();
            break;
        case "jumping":
            this.world.audio.onJump();
            break;
    }
    }

    stop() {
    this.active = false;
    clearInterval(this.movementInterval);
    clearInterval(this.animationInterval);
    }

   jump() {
    this.speedY = -20;
    }

   hit(damage) {
    const now = Date.now();
    this.lastHit = now;
    this.energy -= damage;
    if (this.energy < 0) {
        this.energy = 0;
    }
    }

    isStomping(enemy) {
    let charBottom = this.y + this.height;
    let enemyTop = enemy.y;
    let isFalling = this.speedY > 0;
    return isFalling && charBottom <= enemyTop + 20;
}

}