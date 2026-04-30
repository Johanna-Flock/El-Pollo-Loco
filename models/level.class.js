class Level {
    enemies;
    clouds;
    backgroundObjects;
    character;
    level_end_x;
    constructor(backgroundObjects, enemies, clouds, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;         
        this.bottles = bottles; 
    }
}