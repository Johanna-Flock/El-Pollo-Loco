class CollectableObject extends DrawableObject {
    width = 100
    height = 100;
    hitboxColor = "blue";

     offset = {
        top: 33,
        right: 33,
        bottom: 33,
        left: 33
    };

    /**
     * Creates a basic game object with a position and image.
     * Used as a base for static or collectible objects.
     *
     * @param {string} imagePath - Path to the object's image.
     * @param {number} x - X position in the world.
     * @param {number} y - Y position in the world.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
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