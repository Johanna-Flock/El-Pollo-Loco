class Cloud extends MovableObject {
    height = 250;
    y = 20;
    width = 500;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500; //Hiermit wird die x-Position der Wolken zufällig zwischen 200 und 700 festgelegt, damit sie nicht alle an der gleichen Stelle erscheinen
        this.animate()
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 30);
    }

}