class CollectableObject extends DrawableObject {
    width = 100     
    height = 100;

    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}