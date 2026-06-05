class Endboss extends MovableObject {
    width = 250;
    height = 400;
    y = 50;
    x;
    currentImage = 0;
    isDead = false;
    energy = 100;
    damage = 20;
    deadFrameIndex = 0;
    isDeadAnimationFinished = false;
    alertStartTime = 0;
    alertStage = 0;

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

    /**
     * Creates an enemy instance at a given X position.
     * Loads all animation frames and initializes default state values.
     *
     * @param {number} x - Initial X position of the enemy.
     */
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

    /**
     * Starts the enemy AI and animation loops.
     */
    start() {
        this.animate();
    }

    /**
     * Starts movement and animation intervals for the enemy.
     */
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

    /**
     * Handles animation based on current enemy state.
     */
    handleAnimation() {
        if (this.world.character.isDead()) {
            this.img = this.ImageCache[this.IMAGES_ALERT[0]];
            return;
        }
        let state = this.getCurrentState();
        if (state === "alert") {
            if (this.alertStage === 0) { this.playAnimation(this.IMAGES_ALERT); }
            else if (this.alertStage === 1) { this.playAnimation(this.IMAGES_ATTACK); }
            else { this.playAnimation(this.IMAGES_ATTACK); }
        }
        else if (state === "chase") { this.playAnimation(this.IMAGES_WALKING); }
        else if (state === "hurt") { this.playAnimation(this.IMAGES_HURT); }
        else if (state === "dead") { this.playDeadAnimation(); }
        else { this.playAnimation(this.IMAGES_WALKING); }
    }

    /**
     * Plays the death animation frame by frame until completion.
     */
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

    /**
     * Determines the current animation state of the enemy.
     *
     * @returns {string} Current state ("walking", "alert", "chase", "hurt", "dead")
     */
    getCurrentState() {
        if (this.state === "dead") return "dead";
        if (this.state === "alert") return "alert";
        if (Date.now() - this.lastHitTime < 500) return "hurt";
        if (this.state === "chase") return "chase";
        return "walking";
    }

    /**
     * Main state update logic for enemy behavior.
     */
    handleState() {
        if (this.world.character.isDead()) {
            return;
        }
        let distance =
            Math.abs(this.world.character.x - this.x);
        if (this.handleDeadState()) return;
        if (this.handleHurtState()) return;
        if (this.state === "alert") {
            this.handleAlertState();
        }
        this.handleWalkingState(distance);
        this.handleChaseState(distance);
        this.updateStateSound();
    }

    /**
     * Handles the alert state timing and animation stage transitions.
     * The alert stage changes based on how long the enemy has been in the alert state.
     * After 3 seconds, it transitions to the chase state.
     */
    handleAlertState() {
        let elapsed = Date.now() - this.alertStartTime;
        if (elapsed > 2000) {
            this.alertStage = 2;
        } else if (elapsed > 1000) {
            this.alertStage = 1;
        } else {
            this.alertStage = 0;
        }
    }

    /**
     * Handles behavior when enemy is dead.
     *
     * @returns {boolean} true if state is dead
     */
    handleDeadState() {
        if (this.state !== "dead") return false;
        this.y += 5;
        return true;
    }

    /**
     * Handles behavior when enemy is hurt.
     *
     * @returns {boolean} true if in hurt state
     */
    handleHurtState() {
        if (this.state !== "hurt") return false;
        return true;
    }

    /**
     * Handles walking behavior and alert trigger.
     *
     * @param {number} distance - Distance to the player character
     */
    handleWalkingState(distance) {
        if (this.state !== "walking") return;
        this.moveLeft();
        if (distance < 500) {
            this.state = "alert";
            this.alertStartTime = Date.now();
            this.alertStage = 0;
            setTimeout(() => {
                this.state = "chase";
            }, 3000);
        }
    }

    /**
     * Handles chase behavior when the enemy is in "chase" state.
     *
     * The enemy increases speed and moves toward the player character.
     * If the player gets too far away, the enemy returns to "walking" state.
     *
     * @param {number} distance - Distance between enemy and player character
     */
    handleChaseState(distance) {
        if (this.state !== "chase") return;
        this.speed = this.calculateChaseSpeed(distance);
        if (this.world.character.x < this.x) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
        if (distance > 600) {
            this.state = "walking";
        }
    }

    /**
    * calculates the speed of the boss when chasing the player based on the distance to the player.
    * The closer the player, the faster the boss moves, with a maximum speed cap.
    * @param {*} distance 
    * @returns 
    */
    calculateChaseSpeed(distance) {
        let maxSpeed = distance < 200 ? 7.5 : 7.0;
        let minSpeed = 4.0;
        let factor = Math.max(0, 1 - distance / 600);
        return minSpeed + (maxSpeed - minSpeed) * factor;
    }

    /**
     * Updates and triggers state-based sound effects when the state changes.
     *
     * Ensures sounds are only played once per state transition.
     */
    updateStateSound() {
        let currentState = this.getCurrentState();
        if (currentState !== this.previousState) {
            this.handleStateSound(currentState);
            this.previousState = currentState;
        }
    }

    /**
     * Handles boss sound transitions based on the current state.
     * Stops all previous boss sounds before playing the new one.
     *
     * @param {string} state - Current boss state ("walking", "alert", "chase", "hurt", "dead")
     */
    handleStateSound(state) {
        this.stopAllBossSounds();
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

    /**
     * Stops all currently playing boss-related sounds.
     */
    stopAllBossSounds() {
        this.world.audio.stopBossSound(
            this.world.audio.endbossWalkingSound
        );
        this.world.audio.stopBossSound(
            this.world.audio.endbossAlert
        );
        this.world.audio.stopBossSound(
            this.world.audio.endbossChasingSound
        );
        this.world.audio.stopBossSound(
            this.world.audio.endbossHurt
        );
        this.world.audio.stopBossSound(
            this.world.audio.endbossDead
        );
    }

    /**
     * Applies damage to the boss and updates its state.
     * If energy reaches zero, the boss enters the "dead" state.
     */
    hit() {
        this.energy = Math.max(0, this.energy - 20);
        if (this.world && this.world.endbossBar) {
            this.world.endbossBar.setPercentageEndbossBar(this.energy);
        }
        if (this.energy <= 0) {
            this.state = "dead";
            this.world.audio.stopAllSounds();
            this.world.audio.onEndbossDead();
            return;
        }
        this.lastHitTime = Date.now();
    }

    /**
     * Stops all boss logic and clears running intervals.
     */
    stop() {
        this.active = false;
        clearInterval(this.stateInterval);
        clearInterval(this.animationInterval);
    }
}