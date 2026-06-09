class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;

    /**
     * Creates a background object positioned at a specific x coordinate.
     * Sets the image and aligns the object to the bottom of the canvas.
     *
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the background tile.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x
    }
}