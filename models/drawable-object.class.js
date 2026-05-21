class DrawableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 150;
    img;
    ImageCache = {};

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        if (!arr) {
            console.error("❌ arr ist undefined!");
            return;
        }
        arr.forEach(path => {
            let img = new Image();
            img.src = path; //Hier wird das Bild geladen, indem ein neues Image-Objekt erstellt und die src-Eigenschaft auf den Pfad des Bildes gesetzt wird
            this.ImageCache[path] = img; //Hier wird das geladene Bild im ImageCache-Objekt gespeichert, wobei der Pfad des Bildes als Schlüssel und das geladene Bild als Wert verwendet wird
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}