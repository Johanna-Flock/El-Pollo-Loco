class Chicken extends MovableObject {
    width = 100;
    height = 100;
    y = 320;
    damage = 5;
    currentImage = 0;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

/**
 * Creates a new Chicken enemy instance.
 * Initializes position, animations, state, and movement speed.
 * Starts the enemy animation loop automatically.
 *
 * @param {number} x - Optional spawn position on the X axis.
 *                     If not provided, a random offset is used.
 */
    constructor(x = 600 + Math.random() * 500) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = x;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);   
        this.state = "walking";
        this.startFalling = false;
        this.speed = 0.15 + Math.random() * 0.5;
        this.soundPlayed = false;
        this.animate()
    }

/**
 * Starts the animation system of the enemy.
 * Splits logic into movement and animation loops.
 */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

/**
 * Handles enemy movement logic (60 FPS loop).
 * Includes falling behavior, death state, and walking movement.
 */
    startMovementLoop() {
        this.movementInterval = setInterval(() => {
            if (!this.active) return;
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
    }

/**
 * Handles enemy animation loop (state-based rendering).
 * Plays death/falling or walking animation depending on state.
 */
    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
            if (!this.active) return;
            if (
                this.state === "dead" ||
                this.state === "falling"
            ) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

/**
 * Handles enemy hit logic.
 * Sets enemy into dead state and triggers death/fall transition.
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
 * Stops all enemy intervals and updates.
 */
    stop() {
        this.active = false;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }

/**
 * Triggers big chicken sound effect when player is close enough.
 * Ensures the sound is only played once.
 */
    checkSoundTrigger() {
        let distance = Math.abs(this.world.character.x - this.x);
        if (distance < 400 && !this.soundPlayed) {
            this.soundPlayed = true;
            this.world.audio.onBigChicken();
        }
    }
}