define(["app/utils/RenderObject"], function (RenderObject) {

    const constructor = function (radius, colour) {

        const planeColour = this.color(colour, 0x33, 0xDD);
        const edgeColour = this.color(colour, 0x44, 0xFF);

        const depth = 10;
        const width = radius * 2;
        const height = radius * 2;

        const This = Object.assign(RenderObject.new(), {
            width, height
        });

        This.rotationX = Math.PI / 2;

        This.render = function () {
            this.stroke(edgeColour);
            this.fill(planeColour);
            this.cylinder(radius, depth);
        };

        return This;
    };

    return {
        new: constructor
    }
});