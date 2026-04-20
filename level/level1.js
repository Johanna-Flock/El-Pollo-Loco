let level1;
function initLevel1() {
    level1 = new Level ( 
    [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss(),
    ],
    [
    new Cloud(),
    ] ,
    [
    new BackgroundObject('img/5_background/layers/air.png', -720),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720), 
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),
    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),    
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/air.png', 720),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720), 
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
    new BackgroundObject('img/5_background/layers/air.png', 720*2),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2), 
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2),
    new BackgroundObject('img/5_background/layers/air.png', 720*3),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*3), 
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*3),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*3),
    ]
    ,
    [
            ...generateCoins(10),
            ...generateCoinLine(500, 150, 5),
            ...generateCoinDiagonal(900, 200, 5),
            ...generateCoinArc(1300, 200, 6)
    ],
    [
            ...generateBottles(30),
    ]
);

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