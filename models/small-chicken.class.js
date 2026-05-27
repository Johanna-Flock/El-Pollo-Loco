class SmallChicken extends MovableObject {
    height = 50;
    width = 50
    y = 140;
    damage = 10;
    currentImage = 0;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

/**
 * Creates a small chicken enemy with randomized spawn position and speed.
 * Loads all required animations, enables gravity, and starts movement/animation loops.
 *
 * @param {number} [x] - Initial X position of the enemy
 */
    constructor(x = 800 + Math.random() * 1200) {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
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

/**
 * Makes the small chicken jump if it is currently on the ground.
 */
    jump() {
        if (this.isAboveGround()) return;
        this.speedY = -15;
    }

/**
 * Starts random bouncing behavior while the chicken is walking.
 * The enemy has a chance to jump every 400ms.
 */
    startBouncing() {
        this.bounceInterval = setInterval(() => {
            if (this.state !== "walking") return;
            if (this.isAboveGround()) return;
            if (Math.random() < 0.6) {
                this.jump();
            }
        }, 400);
    }

/**
 * Starts movement and animation loops.
 */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

/**
 * Starts the movement update loop.
 */
    startMovementLoop() {
        this.movementInterval = setInterval(() => {
            if (!this.active) return;
            this.handleMovementState();
        }, 1000 / 60);
    }

/**
 * Handles movement logic depending on the current state.
 */
    handleMovementState() {
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
    }

/**
 * Starts the animation update loop.
 */
    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
            if (!this.active) return;
            this.handleAnimationState();
        }, 200);
    }

/**
 * Handles animation playback depending on the current state.
 */
    handleAnimationState() {
        if (
            this.state === "dead" ||
            this.state === "falling"
        ) {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

/**
 * Handles enemy death behavior and starts falling animation.
 */
    hit() {
        if (this.state === "dead") return;
        this.energy = 0;
        this.state = "dead";
        this.world.audio.onChickenDead();
        setTimeout(() => {
            this.state = "falling";
        }, 200);
    }

/**
 * Stops all active movement and animation intervals.
 */
    stop() {
        this.active = false;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }

/**
 * Triggers the chicken sound once when the player gets close enough.
 */
    checkSoundTrigger() {
        let distance = Math.abs(this.world.character.x - this.x);
        if (distance < 400 && !this.soundPlayed) {
            this.soundPlayed = true;
            this.world.audio.onSmallChicken();
        }
    }
}