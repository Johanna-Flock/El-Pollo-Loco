class Screen extends DrawableObject {

    constructor(path) {
        super();
        this.loadImage(path);
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}