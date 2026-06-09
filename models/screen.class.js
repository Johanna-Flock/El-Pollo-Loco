class Screen extends DrawableObject {

    /**
     * Creates a new status bar object with the given image.
     * Initializes position and default dimensions.
     * 
     * @param {string} path - Path to the status bar image.
     */
    constructor(path) {
        super();
        this.loadImage(path);
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}