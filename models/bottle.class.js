class Bottle extends CollectableObject {
    width = 90;
    height = 110;

    offset = {
        top: 15,
        right: 35,
        bottom: 15,
        left: 35
     };

    /**
     * Creates a bottle object positioned at specific x and y coordinates.
     * Sets the image and aligns the object to the bottom of the canvas.
     *
     * @param {number} x - Horizontal position of the bottle.
     * @param {number} y - Vertical position of the bottle.
     */
    constructor(x, y) {
        super(
            'img/6_salsa_bottle/salsa_bottle.png',
            x,
            y
        );
    }
}