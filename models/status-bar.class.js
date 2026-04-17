class StatusBar extends DrawableObject {
    width = 200;
    height = 60;
    x;
    y;         
    percentage = 100;
    value = 0;
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

 constructor(x, y, type) {
        super();
        this.x = x;
        this.y = y;
        console.log("TYPE RAW:", JSON.stringify(type));

         if (!type) {
         console.warn("⚠️ StatusBar ohne type erstellt!");
         type = "health";
    }
         if (type === "health") {
           this.loadImages(this.IMAGES_HEALTH);
            this.setPercentage(100);

        } else if (type === "coins") {
            this.loadImages(this.IMAGES_COINS);
            this.setValueCoins(0);

        } else if (type === "bottles") {
            this.loadImages(this.IMAGES_BOTTLES);
            this.setValueBottles(0);
        }
        else {
        console.error("❌ Unknown type:", type);
        this.IMAGES = [];
    }

    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let index = this.resolveImageIndex();
        let path = this.IMAGES_HEALTH[index];
        this.img = this.ImageCache[path];
        console.log("cache entry:", this.ImageCache[path]);
    }

    setValueCoins(value) {
        this.value = value;
        let index = Math.floor(value / 20);
        let path = this.IMAGES_COINS[index];
        this.img = this.ImageCache[path];
        console.log("cache entry:", this.ImageCache[path]);
    }

       setValueBottles(value) {
        this.value = value;

        let index = Math.floor(value / 20);
        let path = this.IMAGES_BOTTLES[index];

        this.img = this.ImageCache[path];
        console.log("cache entry:", this.ImageCache[path]);
    }

    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        else if (this.percentage > 80) return 4;
        else if (this.percentage > 60) return 3;
        else if (this.percentage > 40) return 2;
        else if (this.percentage > 20) return 1;
        else return 0;
    }
}

