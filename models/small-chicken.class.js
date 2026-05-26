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

    jump() {
        if (this.isAboveGround()) return;
        this.speedY = -15;
    }

    startBouncing() {
        this.bounceInterval = setInterval(() => {
            if (this.state !== "walking") return;
            if (this.isAboveGround()) return;
            if (Math.random() < 0.6) {
                this.jump();
            }
        }, 400);
    }

    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    startMovementLoop() {
        this.movementInterval = setInterval(() => {
            if (!this.active) return;
            this.handleMovementState();
        }, 1000 / 60);
    }

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

    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
            if (!this.active) return;
            this.handleAnimationState();
        }, 200);
    }

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

    hit() {
        if (this.state === "dead") return;
        this.energy = 0;
        this.state = "dead";
        this.world.audio.onChickenDead();
        setTimeout(() => {
            this.state = "falling";
        }, 200);
    }

    stop() {
        this.active = false;
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }

    checkSoundTrigger() {
        let distance = Math.abs(this.world.character.x - this.x);
        if (distance < 400 && !this.soundPlayed) {
            this.soundPlayed = true;
            this.world.audio.onSmallChicken();
        }
    }
}