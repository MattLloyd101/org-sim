define([], function () {

    const constructor = function (context, ident, imgPath, rotation = 0, features = []) {

        const up = ident.substr(0, 1);
        const right = ident.substr(1, 1);
        const down = ident.substr(2, 1);
        const left = ident.substr(3, 1);

        const This = {
            ident,
            up,
            right,
            down,
            left,
            imgPath,
            rotation,
            features
        };

        const transposeMatrix = function (src, out, width, height, density) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcOff = (x * height + y) * (density * 2);
                    const targetOff = (y * width + x) * (density * 2);
                    out[targetOff] = src[srcOff];
                    out[targetOff + 1] = src[srcOff + 1];
                    out[targetOff + 2] = src[srcOff + 2];
                    out[targetOff + 3] = src[srcOff + 3];
                }
            }
        };

        const reverseRows = function (out, width, height, density) {
            for (let y = 0; y < height; y++) {
                for (let x = 0, w = width - 1; x < w; x++, w--) {
                    const srcOff = (y * width + x) * (density * 2);
                    const targetOff = (y * width + w) * (density * 2);

                    const t0 = out[srcOff];
                    const t1 = out[srcOff + 1];
                    const t2 = out[srcOff + 2];
                    const t3 = out[srcOff + 3];

                    out[srcOff] = out[targetOff];
                    out[srcOff + 1] = out[targetOff + 1];
                    out[srcOff + 2] = out[targetOff + 2];
                    out[srcOff + 3] = out[targetOff + 3];

                    out[targetOff] = t0;
                    out[targetOff + 1] = t1;
                    out[targetOff + 2] = t2;
                    out[targetOff + 3] = t3;
                }
            }
        };

        const reverseCols = function (out, width, height, density) {
            for (let x = 0; x < width; x++) {
                for (let y = 0, w = height - 1; y < w; y++, w--) {
                    const srcOff = (y * width + x) * (density * 2);
                    const targetOff = (w * width + x) * (density * 2);

                    const t0 = out[srcOff];
                    const t1 = out[srcOff + 1];
                    const t2 = out[srcOff + 2];
                    const t3 = out[srcOff + 3];

                    out[srcOff] = out[targetOff];
                    out[srcOff + 1] = out[targetOff + 1];
                    out[srcOff + 2] = out[targetOff + 2];
                    out[srcOff + 3] = out[targetOff + 3];

                    out[targetOff] = t0;
                    out[targetOff + 1] = t1;
                    out[targetOff + 2] = t2;
                    out[targetOff + 3] = t3;
                }
            }
        };

        const resize = function (srcImg) {
            let img;
            if (rotation > 0) {
                const density = context.pixelDensity();

                const w = srcImg.width;//rotation === 1 || rotation === 3 ? srcImg.width : srcImg.height;
                const h = srcImg.height;//rotation === 1 || rotation === 3 ? srcImg.height : srcImg.width;
                img = context.createImage(w, h);
                img.loadPixels();
                srcImg.loadPixels();

                if (rotation === 1) {
                    transposeMatrix(srcImg.pixels, img.pixels, srcImg.width, srcImg.height, density);
                    reverseRows(img.pixels, srcImg.width, srcImg.height, density);
                } else if (rotation === 2) {
                    img.pixels = srcImg.pixels;
                    reverseCols(img.pixels, srcImg.width, srcImg.height, density);
                    reverseRows(img.pixels, srcImg.width, srcImg.height, density);
                } else if (rotation === 3) {
                    transposeMatrix(srcImg.pixels, img.pixels, srcImg.width, srcImg.height, density);
                    reverseCols(img.pixels, srcImg.width, srcImg.height, density);
                }

                img.updatePixels();
            } else {
                img = srcImg;
            }

            This.img = img;
        };

        context.loadImage(imgPath, resize);

        This.rotate = function (n) {
            let newIdent = ident + "";
            for (let i = 0; i < n; i++)
                newIdent = newIdent.substr(3, 1) + newIdent.substr(0, 3);
            return constructor(context, newIdent, imgPath, (rotation + n) % 4, features);
        };

        This.render = function () {
            const rotationString = rotation > 0 ? "class=\"rot" + rotation + "\"" : "";
            return "<img " + rotationString + "src=\"" + imgPath + " \" />";
        };

        This.containsFeature = features.indexOf("castle") !== -1 ||
            features.indexOf("church") !== -1 ||
            features.indexOf("lake") !== -1 ||
            features.indexOf("shrine") !== -1;

        This.probability = This.containsFeature ? 0 : 1;

        return This;
    };

    return {
        new: constructor
    };
});