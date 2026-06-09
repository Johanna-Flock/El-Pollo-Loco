class CollectableObject extends DrawableObject {
    width = 100
    height = 100;

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
}