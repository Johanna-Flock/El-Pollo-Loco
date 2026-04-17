class collectableObjects extends DrawableObject {
    width = 50      
    height = 50;
        

    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];  

     IMAGE_BOTTLE = [
        'img/6_salsa_bottle/salsa_bottle.png',
    ];  

    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}