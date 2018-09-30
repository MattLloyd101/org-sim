define([], function () {

    const constructor = function (context, ident, imgPath, rotation = 0, probability = 1, features = []) {

        const up = ident.substr(0, 1);
        const right = ident.substr(1, 1);
        const down = ident.substr(2, 1);
        const left = ident.substr(3, 1);

        const img = context.loadImage(imgPath);

        const This = {
            ident,
            up,
            right,
            down,
            left,
            imgPath,
            rotation,
            probability,
            features,
            img
        };

        This.rotate = function (n) {
            let newIdent = ident + "";
            for (let i = 0; i < n; i++)
                newIdent = newIdent.substr(3, 1) + newIdent.substr(0, 3);
            return constructor(context, newIdent, imgPath, (rotation + n) % 4, probability, features);
        };

        This.render = function () {
            const rotationString = rotation > 0 ? "class=\"rot" + rotation + "\"" : "";
            return "<img " + rotationString + "src=\"" + imgPath + " \" />";
        };

        return This;
    };

    return {
        new: constructor
    };
});