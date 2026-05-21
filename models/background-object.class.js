class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.y = 480 - this.height; //80 aktuell; Höhe von unserem canvas ist 480; 
        this.x = x
    }
}