class Cloud extends MovableObject {
    height = 250;
    y = 20;
    width = 500;

/**
 * Creates a cloud object with a random initial position.
 * Starts a continuous left-moving animation loop.
 */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500; 
        this.animate()
    }

/**
 * Animates the cloud by continuously moving it to the left.
 * Runs at ~30 FPS using setInterval.
 */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 30);
    }

}