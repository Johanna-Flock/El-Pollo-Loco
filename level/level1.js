let level1;
function initLevel1() {
    level1 = new Level ( 
         generateBackground(),
    [
        ...spawnGroup(Chicken, 300, 3, 200),
        ...spawnGroup(Chicken, 1200, 2, 300),
        ...spawnGroup(SmallChicken, 2000, 4, 150),
        ...spawnGroup(SmallChicken, 2500, 3, 120),
        ...spawnGroup(Chicken, 3000, 2, 300),
        ...spawnGroup(SmallChicken, 5000, 3, 120),
        ...spawnGroup(Chicken, 6000, 2, 300),
    new Endboss(7000),
    ],
    [
    new Cloud(),
    ],
    
    [
            ...generateCoins(10),
            ...generateCoinLine(500, 150, 5),
            ...generateCoinDiagonal(900, 200, 5),
            ...generateCoinArc(1300, 200, 6),
            ...generateCoinArc(2000, 200, 6)
    ],
    [
            ...generateBottles(30),
    ]
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
     let tiles = 10;
    for (let i = -1; i < tiles; i++) {
        backgrounds.push(
            new BackgroundObject('img/5_background/layers/air.png', 720 * i),
            new BackgroundObject('img/5_background/layers/3_third_layer/' + (i % 2 ? '1.png' : '2.png'), 720 * i),
            new BackgroundObject('img/5_background/layers/2_second_layer/' + (i % 2 ? '1.png' : '2.png'), 720 * i),
            new BackgroundObject('img/5_background/layers/1_first_layer/' + (i % 2 ? '1.png' : '2.png'), 720 * i),
        );
    }
    level1EndX = tiles * 720;
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


function generateBottles(amount) {
    let bottles = [];
    const groundY = 350;
    for (let i = 0; i < amount; i++) {
        let x = 200 + Math.random() * 2000;
        // 3 feste Höhenstufen + leichte Variation
        let baseHeights = [260, 290, 320];
        let baseY = baseHeights[Math.floor(Math.random() * baseHeights.length)];
        let y = baseY + (Math.random() * 20 - 10); // kleine Streuung
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


}