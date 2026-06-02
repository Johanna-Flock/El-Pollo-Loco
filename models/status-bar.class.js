class StatusBar extends DrawableObject {
    width = 200;
    height = 60;
    x;
    y;
    percentage = 100;
    img;

    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    IMAGES_COINS = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    IMAGES_BOTTLES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    IMAGES_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

/**
 * Creates a new status bar instance.
 * Depending on the given type, the correct image set is loaded.
 *
 * @param {number} x - X position of the status bar
 * @param {number} y - Y position of the status bar
 * @param {string} type - Type of status bar ("health", "coins", or "bottles")
 */
    constructor(x, y, type) {
        super();
        this.x = x;
        this.y = y;
        if (!type) {
            console.warn("StatusBar without type created!");
            type = "health";
        }
        if (type === "health") {
            this.loadImages(this.IMAGES_HEALTH);
            this.setPercentage(100);

        } else if (type === "coins") {
            this.loadImages(this.IMAGES_COINS);
            this.img = this.ImageCache[this.IMAGES_COINS[0]];
        } else if (type === "bottles") {
            this.loadImages(this.IMAGES_BOTTLES);
            this.img = this.ImageCache[this.IMAGES_BOTTLES[0]];
        } else if (type === "endboss") {
            this.loadImages(this.IMAGES_ENDBOSS);
            this.img = this.ImageCache[this.IMAGES_ENDBOSS[0]];
        }
        else {
            console.error("Unknown type:", type);
        }
    }

/**
 * Updates the health bar image based on the current percentage.
 *
 * @param {number} percentage - Current health percentage
 */
    setPercentage(percentage) {
        this.percentage = percentage;
        let index = this.resolveImageIndex();
        let path = this.IMAGES_HEALTH[index];
        this.img = this.ImageCache[path];
    }

/**
 * Updates the endboss bar image based on the current percentage.
 *
 * @param {number} percentage - Current health percentage
 */
    setPercentageEndbossBar(percentage) {
        this.percentage = percentage;
        let index = this.resolveImageIndex();
        let path = this.IMAGES_ENDBOSS[index];
        this.img = this.ImageCache[path];
    }

/**
 * Updates the coin status bar based on collected coins.
 *
 * @param {number} valueCoins - Current collected coins
 * @param {number} maxCoins - Maximum number of coins in the level
 */
    setValueCoins(valueCoins, maxCoins) {
        this.value = valueCoins;
        if (!maxCoins || maxCoins <= 0) return;
        let ratio = valueCoins / maxCoins;
        ratio = Math.min(Math.max(ratio, 0), 1); 
        let index = Math.floor(ratio * (this.IMAGES_COINS.length - 1));
        let path = this.IMAGES_COINS[index];
        if (!this.ImageCache[path]) {
            console.warn("Missing image:", path);
            return;
        }
        this.img = this.ImageCache[path];
    }

/**
 * Updates the bottle status bar based on collected bottles.
 *
 * @param {number} valueBottles - Current collected bottles
 * @param {number} maxBottles - Maximum number of bottles in the level
 */
    setValueBottles(valueBottles, maxBottles) {
        this.value = valueBottles;
        if (!maxBottles || maxBottles <= 0) return;
        let ratio = valueBottles / maxBottles;   // 0 → 1
        let index = Math.floor(ratio * (this.IMAGES_BOTTLES.length - 1));
        let path = this.IMAGES_BOTTLES[index];
        if (!this.ImageCache[path]) {
            console.warn("Missing image:", path);
            return;
        }
        this.img = this.ImageCache[path];
    }

/**
 * Resolves the correct image index for the health bar
 * based on the current health percentage.
 *
 * @returns {number} Image index
 */
 resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
}
}

