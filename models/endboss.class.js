class Endboss extends MovableObject {
    width = 250;
    height = 400;
    y = 50;
    x;
    currentImage = 0;
    isDead = false;
    energy = 400;
    damage = 20;
    deadFrameIndex = 0;
    isDeadAnimationFinished = false;

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

    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.state = "walking";
        this.previousState = null;
        this.alertPlayed = false;
    }

    start() {
        this.animate();
    }

    animate() {
        this.stateInterval = setInterval(() => {
            if (!this.active) return;
            this.handleState();
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            if (!this.active) return;
            this.handleAnimation();
        }, 200);
    }


    handleAnimation() {
        let state = this.getCurrentState();
        if (state === "alert") {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (state === "chase") {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (state === "hurt") {
            this.playAnimation(this.IMAGES_HURT);
        } else if (state === "dead") {
            this.playDeadAnimation();
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    playDeadAnimation() {
        if (this.isDeadAnimationFinished) return;
        let totalFrames = this.IMAGES_DEAD.length * 2;
        let index =
            this.deadFrameIndex %
            this.IMAGES_DEAD.length;
        this.img =
            this.ImageCache[this.IMAGES_DEAD[index]];
        this.deadFrameIndex++;
        if (this.deadFrameIndex >= totalFrames) {
            this.isDeadAnimationFinished = true;
        }
    }

    getCurrentState() {
        if (this.state === "dead") return "dead";
        if (this.state === "alert") return "alert";
        if (Date.now() - this.lastHitTime < 500) return "hurt";
        if (this.state === "chase") return "chase";
        return "walking";
    }

    handleState() {
        let distance =
            Math.abs(this.world.character.x - this.x);
        if (this.handleDeadState()) return;
        if (this.handleHurtState()) return;
        this.handleWalkingState(distance);
        this.handleChaseState(distance);
        this.updateStateSound();
    }

    handleDeadState() {
        if (this.state !== "dead") return false;
        this.y += 5;
        return true;
    }

    handleHurtState() {
        if (this.state !== "hurt") return false;
        return true;
    }

    handleWalkingState(distance) {
        if (this.state !== "walking") return;
        this.moveLeft();
        if (distance < 500) {
            this.state = "alert";
            this.handleStateSound("alert");
            setTimeout(() => {
                this.state = "chase";
            }, 3000);
        }
    }

    handleChaseState(distance) {
        if (this.state !== "chase") return;
        this.speed = 2;
        if (this.world.character.x < this.x) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
        if (distance > 600) {
            this.state = "walking";
        }
    }

    updateStateSound() {
        let currentState = this.getCurrentState();
        if (currentState !== this.previousState) {
            this.handleStateSound(currentState);
            this.previousState = currentState;
        }
    }

    handleStateSound(state) {
        this.world.audio.stopBossSound(this.world.audio.endbossWalkingSound);
        this.world.audio.stopBossSound(this.world.audio.endbossAlert);
        this.world.audio.stopBossSound(this.world.audio.endbossChasingSound);
        this.world.audio.stopBossSound(this.world.audio.endbossHurt);
        this.world.audio.stopBossSound(this.world.audio.endbossDead);
        switch (state) {
            case "walking":
                this.world.audio.onEndbossWalking();
                break;
            case "alert":
                this.world.audio.onEndbossAlert();
                break;
            case "chase":
                this.world.audio.onEndbossChasing();
                break;
            case "hurt":
                this.world.audio.onEndbossHurt();
                break;
            case "dead":
                this.world.audio.onEndbossDead();
                break;
        }
    }

    hit() {
        this.energy = Math.max(0, this.energy - 20);
        if (this.energy <= 0) {
            this.state = "dead";
            return;
        }
        this.lastHitTime = Date.now();
    }

    stop() {
        this.active = false;
        clearInterval(this.stateInterval);
        clearInterval(this.animationInterval);
    }
}