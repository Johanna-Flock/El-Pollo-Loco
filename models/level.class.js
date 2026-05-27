class Level {
    enemies;
    clouds;
    backgroundObjects;
    character;
    level_end_x;

/**
 * Creates a new level instance containing all game objects.
 *
 * @param {Array} backgroundObjects - All background layer objects.
 * @param {Array} enemies - All enemy instances in the level.
 * @param {Array} clouds - All cloud objects.
 * @param {Array} coins - All collectible coin objects.
 * @param {Array} bottles - All collectible bottle objects.
 */
    constructor(backgroundObjects, enemies, clouds, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;         
        this.bottles = bottles; 
    }
}