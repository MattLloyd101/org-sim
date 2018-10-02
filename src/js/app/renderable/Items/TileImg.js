define(["app/utils/RenderObject"], function (RenderObject) {

    const constructor = function (tile, width, height) {

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