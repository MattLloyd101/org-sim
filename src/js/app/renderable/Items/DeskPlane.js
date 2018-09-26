define(["app/utils/RenderObject"], function (RenderObject) {

    const constructor = function (width, height, colour) {

        const planeColour = this.color(colour, 0x33, 0xFF);
        const edgeColour = this.color(colour, 0xFF, 0x33);

        const depth = 10;

        const render = function () {
            this.strokeWeight(1);
            this.stroke(edgeColour);
            this.fill(planeColour);
            this.box(width, height, depth);
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