class MovableObject extends DrawableObject {
    x = 100;
    y = 280;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 300;
    lastHit = 0;
    groundY = 420;
    active = true;
    canDealDamage = true;
    isTouching = false;
    stomped = false;
    stompedTime = 0;

    /**
     * Moves the object to the right based on its speed value.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left based on its speed value.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Plays an animation by cycling through a list of images.
     *
     * @param {string[]} images - Array containing image paths for the animation
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.ImageCache[path];
        this.currentImage++;
    };

    /**
     * Applies gravity and updates vertical position.
     * Resets position and jump state when ground is reached.
     */
    applyGravity() {
        setInterval(() => {
            this.speedY += this.acceleration;
            this.y += this.speedY;
            const groundLevel = this.groundY - this.height;
            if (this.state === "falling") {
                return;
            }
            if (this.y >= groundLevel) {
                this.y = groundLevel;
                this.speedY = 0;
                this.canJump = true;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is currently above the ground.
     *
     * Throwable objects are always considered above ground
     * so gravity continues affecting them.
     *
     * @returns {boolean} True if the object is above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < this.groundY - this.height;
    }

    /**
     * Checks whether this object collides with another movable object.
     *
     * Includes special jump tolerance handling for stomp attacks.
     *
     * @param {MovableObject} mo - The object to check collision against
     * @returns {boolean} True if both objects overlap
     */
    isColliding(mo) {
        return (
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width -mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
        );
    }

    /**
     * Checks whether the object has no remaining energy.
     *
     * @returns {boolean} True if the object is dead
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Checks whether the object was recently hit.
     *
     * @returns {boolean} True if the object is currently hurt
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * Checks whether the object has been inactive long enough
     * to enter the idle state. 3 seconds of inactivity is required.
     *
     * @returns {boolean} True if the object is idle
     */
    isIdle() {
        let timePassed = Date.now() - this.lastAction;
        timePassed = timePassed / 1000;
        return timePassed > 3;
    }

    /**
     * Checks whether the object should enter the sleeping state.
     * Sleeping is triggered after 10 seconds of inactivity.
     *
     * Sleeping is only possible while the game is running.
     *
     * @returns {boolean} True if the object is sleeping
     */
    isSleeping() {
        if (this.world.gameState !== "playing") return false;
        let timePassed = Date.now() - this.lastAction;
        timePassed = timePassed / 1000;
        return timePassed > 10;
    }

    drawHitbox(ctx) {
    if (!this.offset) return;
    ctx.strokeStyle = this.hitboxColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
    );
    }
}