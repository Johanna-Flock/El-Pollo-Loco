let level1;

/**
* Initializes Level 1 by creating all game objects such as:
 * background layers, enemies, clouds, coins, bottles, and the endboss.
* This function defines the full level layout and difficulty progression.
*/
function initLevel1() {
level1 = new Level(
    generateBackground(),
    [
        ...spawnGroup(Chicken, 500, 2, 200),
        ...spawnGroup(Chicken, 1200, 2, 300),
        ...spawnGroup(SmallChicken, 2000, 2, 150),
        ...spawnGroup(Chicken, 3000, 2, 300),
        ...spawnGroup(SmallChicken, 5000, 3, 120),
        ...spawnGroup(Chicken, 5500, 2, 300),
        ...spawnGroup(Chicken, 6000, 2, 300),
        ...spawnGroup(SmallChicken, 7200, 1, 120),
        new Endboss(7300),
    ],
    [
        new Cloud(),
    ],
    [
        ...generateCoins(),
    ],
    [
        ...generateBottles(1, 1500, 1200),
        ...generateBottles(2, 2800, 1200),
        ...generateBottles(2, 3500, 1200),
        ...generateBottles(2, 4600, 1200),
        ...generateHighBossBottles(),

    ],
);
level1.level_end_x = level1EndX;
}

/**
 * Spawns a group of enemies of the same type.
 *
 * @param {Function} type - Enemy class constructor (e.g. Chicken, SmallChicken).
 * @param {number} startX - Starting X position of the first enemy.
 * @param {number} count - Number of enemies to spawn.
 * @param {number} spacing - Distance between each enemy.
 * @returns {Array} Array of enemy instances.
 */
function spawnGroup(type, startX, count, spacing) {
    let enemies = [];
    for (let i = 0; i < count; i++) {
        enemies.push(new type(startX + i * spacing));
    }
    return enemies;
}

/**
 * Generates the background tile map for the level.
 *
 * @returns {Array} Array of BackgroundObject instances.
*/
function generateBackground() {
    let backgrounds = [];
    let tiles = 12;
    for (let i = -1; i < tiles; i++) {
        let x = 719 * i;
        backgrounds.push(
            new BackgroundObject('img/5_background/layers/air.png', x),
            new BackgroundObject('img/5_background/layers/3_third_layer/' + (i % 2 ? '1.png' : '2.png'), x),
            new BackgroundObject('img/5_background/layers/2_second_layer/' + (i % 2 ? '1.png' : '2.png'), x),
            new BackgroundObject('img/5_background/layers/1_first_layer/' + (i % 2 ? '1.png' : '2.png'), x),
        );
    }
    level1EndX = tiles * 719;
    return backgrounds;
}

/**
 * Generates randomly placed coins within a defined range.
 *
 * @param {number} amount - Number of coins to generate.
 * @returns {Array} Array of coin objects.
 */
 function generateCoins() {
    const positions = [
        { x: 500, y: 250 },
        { x: 1500, y: 120 },
        { x: 2800, y: 200 },
        { x: 4300, y: 100 },
        { x: 6000, y: 180 },
    ];
    return positions.map(pos =>
        new CollectableObject(
            'img/8_coin/coin_2.png',
            pos.x + (Math.random() * 100 - 50),
            pos.y + (Math.random() * 40 - 20)
        )
    );
}

/**
 * Generates randomly distributed bottles within a range.
 *
 * @param {number} amount - Number of bottles.
 * @param {number} startX - Minimum X offset.
 * @param {number} rangeX - Spread range on X axis.
 */
function generateBottles(amount, startX = 200, rangeX = 6000) {
    let bottles = [];
    for (let i = 0; i < amount; i++) {
        let x = startX + Math.random() * rangeX;
        let baseHeights = [240, 270, 300];
        let baseY = baseHeights[Math.floor(Math.random() * baseHeights.length)];
        let y = baseY + (Math.random() * 20 - 10);
        bottles.push(new Bottle(x, y));
    }
    return bottles;
}

/**
 * Generates a fixed set of high-position bottles (boss area placement).
 *
 * @returns {Array} Array of CollectableObject bottles.
 */
function generateHighBossBottles() {
    return [
        new Bottle(6200, 120),
        new Bottle(6000, 100),
        new Bottle(6450, 110),  
    ];
}
