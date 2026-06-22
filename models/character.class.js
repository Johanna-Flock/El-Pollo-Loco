class Character extends MovableObject {
    width = 150;
    height = 280;
    y = 140;
    speed = 10;
    speedY = 0;
    energy = 100;
    canJump = true;
    lastAction = Date.now();
    movementInterval;
    animationInterval;
    isThrowing = false;
    jumpFrameIndex = 0;
    jumpPeakReached = false;
    jumpFrameDelay = 0;
    jumpAnimationFinished = false;
    throwCooldown = 0;
    hitboxColor = "red";


    offset = {
        top: 110,
        right: 43,
        bottom: 15,
        left: 35
    };

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

    /**
    * Initializes the character.
    * Loads all animation assets and sets up physics + animation state tracking.
    */
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

    /**
     * Starts the main animation system of the character.
    * Splits logic into movement and animation loops.
    */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
    * Handles the movement loop (60 FPS).
    * Updates movement, jumping, and camera position.
    */
    startMovementLoop() {
        this.movementInterval = setInterval(() => {
            if (!this.active) return;
            this.handleMovement();
            this.handleJump();
            this.world.camera_x = Math.round(-this.x + 50);
        }, 1000 / 60);
    }

    /**
     * Handles the animation loop (state-based rendering).
    * Determines current animation state and triggers sound changes.
    */
    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
            if (!this.active) return;
            let currentState = this.getAnimationState();
            this.playStateAnimation(currentState);
            if (currentState !== this.lastAnimationState) {
                this.handleStateSound(currentState);
                this.lastAnimationState = currentState;
            }
        }, 100);
    }

    /**
    * Plays the death animation frame by frame.
    * Stops when the animation has reached the final frame.
    */
    playDeadAnimation() {
        if (this.deathAnimationDone) return;
        let index = this.deathFrameIndex;
        this.img =
            this.ImageCache[this.IMAGES_DEAD[index]];
        this.deathFrameIndex++;
        if (
            this.deathFrameIndex >=
            this.IMAGES_DEAD.length - 1
        ) {
            this.deathAnimationDone = true;
        }
    }

    /**
    * Plays the correct animation based on the current state.
    *
    * @param {string} state - Current animation state (e.g. "dead", "walking", "hurt").
    */
    playStateAnimation(state) {
        switch (state) {
            case "dead":
                this.playDeadAnimation();
                break;
            case "hurt":
                this.playAnimation(this.IMAGES_HURT);
                break;
            case "jumping":
                this.playJumpAnimation();
                break;
            case "walking":
                this.playAnimation(this.IMAGES_WALKING);
                break;
            case "sleeping":
                this.playAnimation(this.IMAGES_LONG_IDLE);
                break;
            default:
                this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
    * Determines the current animation state of the character.
    * Priority: dead > hurt > jumping > walking > sleeping > idle.
    *
    * @returns {string} The current animation state.
    */
    getAnimationState() {
        if (this.isDead()) {
            return "dead";
        }
        if (this.isHurt()) {
            return "hurt";
        }
        if (this.isAboveGround()) {
            return "jumping";
        }
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            return "walking";
        }
        if (this.isSleeping()) {
            return "sleeping";
        }
        return "idle";
    }

    /**
    * Handles jump input and triggers jump if conditions are met.
    * Prevents jumping while dead or mid-air.
    */
    handleJump() {
        if (this.isDead()) {
            return;
        }
        if (
            this.world.keyboard.SPACE &&
            !this.isAboveGround() &&
            this.canJump
        ) {
            this.jump();
            this.canJump = false;
            this.lastAction = Date.now();
        }
    }

    /**
    * Handles horizontal movement input (left/right).
    * Movement is disabled when the character is dead.
    */
    handleMovement() {
        if (this.isDead()) {
            return;
        }
        if (this.world.keyboard.RIGHT && this.world.level.level_end_x > this.x) {
            this.moveRight();
            this.otherDirection = false;
            this.lastAction = Date.now();
        }
        if (this.world.keyboard.LEFT && this.x > -600) {
            this.moveLeft();
            this.otherDirection = true;
            this.lastAction = Date.now();
        }
    }

    /**
    * Controls the death animation frame progression.
    * Stops once the last frame is reached.
    */
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

    /**
    * Triggers sound effects based on the current character state.
    *
    * @param {string} state - Current animation/state of the character.
    */
    handleStateSound(state) {
        switch (state) {
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

    /**
    * Stops character updates and clears all intervals.
    */
    stop() {
        this.active = false;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }

    /**
    * Makes the character jump by applying upward velocity.
    */
    jump() {
        this.speedY = -20;
        this.jumpFrameIndex = 0;
        this.jumpPeakReached = false;
        this.jumpAnimationFinished = false;
    }

    /**
    * Plays jump animation with frame control and peak frame handling.
    */
    playJumpAnimation() {
        let path = this.IMAGES_JUMPING[this.jumpFrameIndex];
        this.img = this.ImageCache[path];
        this.jumpFrameDelay++;
        if (this.jumpFrameDelay % 2 === 0 && !this.jumpAnimationFinished) {
            this.jumpFrameIndex++;
            if (this.jumpFrameIndex >= this.IMAGES_JUMPING.length) {
                this.jumpFrameIndex =
                    this.IMAGES_JUMPING.length - 1;
                this.jumpAnimationFinished = true;
            }
        }
    }

    /**
     * Applies damage to the character if not currently invulnerable.
     *
     * @param {number} damage - Amount of damage to apply.
     */
    hit(damage) {
        if (this.isHurt()) {
            return;
        }
        const now = Date.now();
        this.lastHit = now;
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Checks if the character stomps an enemy.
     * Requires downward movement and foot overlap with enemy top area.
     */
    isStomping(enemy) {
    let char = this;
    let footLeft = char.x + char.width * 0.4;
    let footRight = char.x + char.width * 0.7;
    let footBottom = char.y +char.height -char.offset.bottom;
    let enemyLeft = enemy.x + enemy.offset.left;
    let enemyRight = enemy.x + enemy.width - enemy.offset.right;
    let enemyTop = enemy.y + enemy.offset.top;
    let isFalling = char.speedY > 0.5;
    let xOverlap = footRight > enemyLeft && footLeft < enemyRight;
    let verticalOverlap = footBottom >= enemyTop - 5 && footBottom <= enemyTop + enemy.height * 0.3;
    let cameFromAbove = char.y + char.height * 0.7 <= enemyTop + 10;
    return (isFalling && xOverlap && verticalOverlap && cameFromAbove);
    }

    /**
     * Wakes the character up from sleeping state by updating the last action time.
     */
    wakeUp() {
        this.lastAction = Date.now();
    }
}