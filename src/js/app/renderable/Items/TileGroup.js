define(["app/utils/RenderObject",
        "app/utils/EventBus",
        "app/renderable/Text"],
    function (RenderObject,
              EventBus,
              Text) {

        const cache = {};

        const constructor = function (tiles, index, width, height) {

            let canvas;
            let text;

            const This = Object.assign(RenderObject.new(), {
                width,
                height,
                index
            });

            This.drawBlackImage = function () {
                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        canvas.set(x, y, [0, 0, 0, 255]);
                    }
                }
            };

            This.redrawImg = function (tiles) {
                tiles.sort(function (a, b) {
                    const n = a.imgPath.localeCompare(b.imgPath);
                    if (n === 0) {
                        return a.rotation - b.rotation;
                    }
                    return n;
                });

                const id = tiles.length === 0 ? "EMPTY" : tiles.reduce(function (out, tile) {
                    return out + tile.imgPath + tile.rotation;
                }, "");


                canvas = (id in cache) ? cache[id] : this.createImage(width, height);
                const pixels = [];

                if (!(id in cache)) {
                    canvas.loadPixels();

                    if (id === "EMPTY") {
                        This.drawBlackImage();
                    } else {
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
                    }
                    canvas.updatePixels();
                    cache[id] = canvas;
                }
            };

            This.redrawImg.apply(this, [tiles]);

            This.render = function () {
                this.texture(canvas);
                this.plane(width, height);
            };

            This.registerClickHandler(function () {
                This.eventBus.emitEvent("MAP_CLICKED", This);
            });

            return This;
        };

        return {
            new: constructor
        }
    });