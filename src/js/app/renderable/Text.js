define(["app/utils/RenderObject"], function (RenderObject) {

    const constructor = function (text, colour, fontSize) {

        // These metrics totally lie in a WebGL context.
        // I think P5.Font is capable of returning real metrics however.
        const width = this.textWidth(text);
        const height = fontSize;

        const This = Object.assign(RenderObject.new(), {
            width,
            height
        });

        This.render = function () {
            this.textSize(fontSize);
            this.fill(colour);
            // textAlign doesn't compress for the the actual text
            // e.g. Ascenders and Decenders will still be added even if the string doesn't use any.
            // Means there's probably some constant offset vertical we need to add.
            // Doing this external to Text for simplicity and control.
            this.textAlign(this.CENTER, this.CENTER);
            this.text(text, 0, 0);
        };

        return This;
    };

    return {
        new: constructor
    }
});