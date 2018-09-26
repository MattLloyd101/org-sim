define(["app/utils/RenderObject",
        "app/renderable/rooms/Room",
        "app/renderable/Items/Desk"],
    function (RenderObject,
              Room,
              Desk) {

        const constructor = function (workstationCount, colour) {

            const desk = Desk.new.apply(this, [5, colour]);

            const leftMargin = 100;
            const rightMargin = 20;
            const topMargin = 100;
            const bottomMargin = 100;

            const width = leftMargin + desk.width + rightMargin;
            const height = topMargin + desk.height + bottomMargin;

            const room = Room.new.apply(this, [width, height, "BOTTOM", colour, "DEVELOPMENT"]);

            desk.x = -(desk.width / 2) + (leftMargin - rightMargin) / 2;
            desk.y = -(desk.height / 2) + (topMargin - bottomMargin) / 2;
            desk.z = room.depth / 3;

            const This = Object.assign(room, {
                width,
                height,
                desk
            });

            This.pathMap.addObstacle(desk.x, desk.y, desk.width, desk.height);

            This.addChild(desk);

            This.update = function() {
                // This.rotationX += (Math.PI / 60)/5;
                This.rotationZ += (Math.PI / 60)/10;
            };

            return This;
        };

        return {
            new: constructor
        }
    });