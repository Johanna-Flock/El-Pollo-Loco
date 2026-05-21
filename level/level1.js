let level1;
function initLevel1() {
    level1 = new Level ( 
         generateBackground(),
    [
        ...spawnGroup(Chicken, 500, 2, 200),
        ...spawnGroup(Chicken, 1200, 2, 300),
        ...spawnGroup(SmallChicken, 2000, 2, 150),
        ...spawnGroup(Chicken, 3000, 2, 300),
        ...spawnGroup(SmallChicken, 5000, 3, 120),
        ...spawnGroup(Chicken, 5500, 2, 300),
        ...spawnGroup(Chicken, 6000, 2, 300),
    new Endboss(7300),
    ],
    [
    new Cloud(),
    ],
    
    [
            ...generateCoins(10),
            ...generateCoinLine(500, 150, 5),
            ...generateCoinDiagonal(900, 200, 5),
            ...generateCoinDiagonalDown(1100, 200, 5),
            ...generateCoinArc(1300, 200, 6),
            ...generateCoinArc(2000, 200, 6),
            ...generateCoinDiagonal(3000, 200, 5),
            ...generateCoinDiagonalDown(5000, 200, 5),
            ...generateCoinDiagonalDown(6000, 200, 5),
    ],
   [
    ...generateBottles(2, 200, 1200), //12
    ...generateBottles(2, 1400, 1200),
    ...generateBottles(2, 2800, 1200),
    ...generateBottles(2, 4200, 1200),
    ...generateBottles(2, 5600, 1200),
    ...generateBottles(2, 6500, 300),
    ...generateHighBossBottles(),//5
    ...generateBottleLine(3200, 220, 3, 70), //3
    ...generateBottleDiagonal(3000, 300, 4), //4
    ...generateBottleLine(4600, 100, 3, 90), //3
    ...generateBottleDiagonal(6000, 200, 3), //4
], 
);

level1.level_end_x = level1EndX;


function spawnGroup(type, startX, count, spacing) {
    let enemies = [];
    for (let i = 0; i < count; i++) {
        enemies.push(new type(startX + i * spacing));
    }
    return enemies;
}

function generateBackground() {
    let backgrounds = [];
     let tiles = 12;
    for (let i = -1; i < tiles; i++) {
        backgrounds.push(
            new BackgroundObject('img/5_background/layers/air.png', 719 * i),
            new BackgroundObject('img/5_background/layers/3_third_layer/' + (i % 2 ? '1.png' : '2.png'), 719 * i),
            new BackgroundObject('img/5_background/layers/2_second_layer/' + (i % 2 ? '1.png' : '2.png'), 719 * i),
            new BackgroundObject('img/5_background/layers/1_first_layer/' + (i % 2 ? '1.png' : '2.png'), 719 * i),
        );
    }
    level1EndX = tiles * 719;
    return backgrounds;
}

function generateCoins(amount) {
    let coins = [];

    for (let i = 0; i < amount; i++) {
        let x = 200 + Math.random() * 2000;
        let y = 50 + Math.random() * 200;

        coins.push(
            new CollectableObject('img/8_coin/coin_2.png', x, y)
        );
    }

    return coins;
}

function generateCoinLine(startX, startY, amount) {
    let coins = [];
    for (let i = 0; i < amount; i++) {
        coins.push(
            new CollectableObject(
                'img/8_coin/coin_2.png',
                startX + i * 60,
                startY
            )
        );
    }
    return coins;
}

function generateCoinDiagonal(startX, startY, amount) {
    let coins = [];
    for (let i = 0; i < amount; i++) {
        coins.push(
            new CollectableObject(
                'img/8_coin/coin_2.png',
                startX + i * 60,
                startY - i * 30
            )
        );
    }
    return coins;
}

function generateCoinDiagonalDown(startX, startY, amount) {
    let coins = [];
    for (let i = 0; i < amount; i++) {
        coins.push(
            new CollectableObject(
                'img/8_coin/coin_2.png',
                startX + i * 60,
                startY + i * 30
            )
        );
    }
    return coins;
}

function generateCoinArc(centerX, baseY, amount) {
    let coins = [];
    for (let i = 0; i < amount; i++) {
        let x = centerX + i * 50;
        let y = baseY - Math.sin(i / amount * Math.PI) * 100;

        coins.push(
            new CollectableObject('img/8_coin/coin_2.png', x, y)
        );
    }
    return coins;
}


function generateBottles(amount, startX = 200, rangeX = 6000) {
    let bottles = [];
    for (let i = 0; i < amount; i++) {
        let x = startX + Math.random() * rangeX;
        let baseHeights = [260, 290, 320];
        let baseY = baseHeights[Math.floor(Math.random() * baseHeights.length)];
        let y = baseY + (Math.random() * 20 - 10);
        bottles.push(
            new CollectableObject(
                'img/6_salsa_bottle/salsa_bottle.png',
                x,
                y
            )
        );
    }
    return bottles;
}

function generateBottleLine(startX, startY, amount, spacing = 80) {
    let bottles = [];
    for (let i = 0; i < amount; i++) {
        bottles.push(
            new CollectableObject(
                'img/6_salsa_bottle/salsa_bottle.png',
                startX + i * spacing,
                startY
            )
        );
    }
    return bottles;
}

function generateBottleDiagonal(startX, startY, amount) {
    let bottles = [];
    for (let i = 0; i < amount; i++) {
        bottles.push(
            new CollectableObject(
                'img/6_salsa_bottle/salsa_bottle.png',
                startX + i * 60,
                startY - i * 30
            )
        );
    }
    return bottles;
}

function generateHighBossBottles() {
    return [
        new CollectableObject(
            'img/6_salsa_bottle/salsa_bottle.png',
            6400,
            120
        ),
        new CollectableObject(
            'img/6_salsa_bottle/salsa_bottle.png',
            6550,
            100
        ),
        new CollectableObject(
            'img/6_salsa_bottle/salsa_bottle.png',
            6700,
            140
        ),
        new CollectableObject(
            'img/6_salsa_bottle/salsa_bottle.png',
            6850,
            110
        ),
        new CollectableObject(
            'img/6_salsa_bottle/salsa_bottle.png',
            7000,
            130
        )
    ];
}




}