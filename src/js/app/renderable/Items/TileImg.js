define(["app/utils/RenderObject"], function (RenderObject) {

    const constructor = function (tile, width, height) {
        
        canvas.loadPixels();
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            tile.img.loadPixels();
            for (let x = 0; x < canvas.width; x++) {
                for (let y = 0; y < canvas.height; y++) {
                    const n = x + (y * canvas.height);
                    let [r, g, b] = pixels[n] || [0, 0, 0];

                    const tx = x * (tile.img.width / width);
                    const ty = y * (tile.img.height / height);
                    const c = tile.img.get(tx, ty);
                    r += c[0];
                    g += c[1];
                    b += c[2];

                    pixels[n] = [r, g, b];
                    canvas.set(x, y, [r / tiles.length, g / tiles.length, b / tiles.length, 255]);
                }
            }
        }
        canvas.updatePixels();

        const render = function () {
            this.texture(tile.img);
            this.plane(width, height);
        };

        return Object.assign(RenderObject.new(), {
            width,
            height,
            render
        });
    };

    return {
        new: constructor
    }
});