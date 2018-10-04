define(["app/utils/RenderObject"], function (RenderObject) {

    const constructor = function (width, height, colour, strokeType) {

        const spacing = 5;
        const bkgColour = this.color(colour, 0x00, 0xFF);
        this.push();

        this.colorMode(this.RGB, 0xFF);

        let edgeColour;
        if(strokeType === "UNKNOWN") {
            edgeColour = this.color(0xFF, 0x00, 0x00);
        } else if (strokeType === "ANSWER") {
            edgeColour = this.color(0x00, 0xFF, 0x00);
        } else {
            edgeColour = this.color(0xFF, 0xA5, 0x00);
        }

        this.pop();
        const render = function () {
            this.strokeWeight(1);
            this.stroke(edgeColour);
            this.fill(bkgColour);
            this.rectMode(this.CENTER);
            this.rect(0, 0, width + spacing * 2, height + spacing * 2);
        };

        const This = Object.assign(RenderObject.new(), {
            width,
            height,
            render,
            rotationX: Math.PI/2
        });

        This.fadeOut = function () {

        };

        return This;
    };

    return {
        new: constructor
    }
});