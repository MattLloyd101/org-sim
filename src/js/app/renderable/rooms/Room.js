define(["app/utils/RenderObject",
        "app/utils/PathMap"],
    function (RenderObject,
              PathMap) {

        const constructor = function (width, height, doorDirection, colour, type) {

            const roomColour = this.color(colour, 0xFF, 0x88, 0x05);
            const edgeColour = this.color(colour, 0xFF, 0x33);
            const doorWidth = 80;
            const doorHeight = 160;
            const doorDepth = 0;
            const depth = 200;

            const pathMap = PathMap.new(-width / 2, -height / 2, width, height, 15, 25);

            const parent = RenderObject.new();
            const This = Object.assign(parent, {
                width,
                height,
                depth,
                type,
                pathMap,
                debug: true
            });

            This.entranceZ = -(depth - doorHeight) / 2;
            if (doorDirection === "TOP") {
                This.entranceX = 0;
                This.entranceY = -height / 2;
            }
            else if (doorDirection === "BOTTOM") {
                This.entranceX = 0;
                This.entranceY = height / 2;
            }
            pathMap.setDoorway(This.entranceX, This.entranceY);

            const renderDoor = function () {
                this.translate(This.entranceX, This.entranceY, This.entranceZ);
                this.box(doorWidth, doorDepth, doorHeight);
            };

            This.renderDebug = function () {
                This.pathMap.renderDebug.apply(this);
            };

            This.render = function () {
                this.strokeWeight(1);
                this.stroke(edgeColour);
                this.fill(roomColour);
                this.translate(0, 0, depth / 2);
                this.box(width, height, depth);
                renderDoor.apply(this);
            };

            return This;
        };

        return {
            new: constructor
        }
    });