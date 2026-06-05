class ThrowableObject extends MovableObject {
    /**
     * Creates a throwable bottle object and initializes
     * movement, animations, and state handling.
     *
     * @param {number} x - Initial X position of the bottle
     * @param {number} y - Initial Y position of the bottle
     * @param {number} speedX - Horizontal throw speed
     */
    constructor(x, y, speedX) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.currentImage = 0;
        this.speedX = speedX;
        this.throw(this.x, this.y);
        this.height = 60;
        this.width = 60;
        this.loadImages(this.IMAGES_BOTTLEROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.state = "flying";
        this.splashAnimationFinished = false;
        this.throw();
        this.animate();
    }

    IMAGES_BOTTLEROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    animate() {
        setInterval(() => {
            if (this.state === "flying") {
                this.playAnimation(this.IMAGES_BOTTLEROTATION);
            }
        }, 100);
    }

    /**
     * Throws the bottle by applying horizontal movement
     * and upward velocity combined with gravity.
     */
    throw() {
        this.speedY = -15;
        setInterval(() => {
            this.x += this.speedX;
        }, 25);
        this.applyGravityBottle();
    }

    /**
     * Starts the splash animation after the bottle hits something.
     * Prevents the splash animation from playing multiple times.
     */
    splash() {
        if (this.state === "splash") return;
        this.state = "splash";
        let frame = 0;
        let splashInterval = setInterval(() => {
            this.img =
                this.ImageCache[this.IMAGES_BOTTLE_SPLASH[frame]];
            frame++;
            if (frame >= this.IMAGES_BOTTLE_SPLASH.length) {
                clearInterval(splashInterval);
                this.splashAnimationFinished = true;
            }
        }, 80);
    }

    /**
     *Applies gravity to the bottle and updates its vertical position.
     *Triggers the splash animation when the bottle hits the ground.
     */
    applyGravityBottle() {
        setInterval(() => {
            this.speedY += this.acceleration;
            this.y += this.speedY;
            const groundLevel = this.groundY - this.height;
            if (this.y >= groundLevel) {
                this.y = groundLevel;
                this.speedY = 0;
                this.onGroundHit();
            }
        }, 1000 / 25);
    }

    /**
     * Handles the event when the bottle hits the ground.
     * If the bottle is still flying, it triggers the splash animation.
     */
    onGroundHit() {
        if (this.state === "splash") return;
        this.splash();
    }

}