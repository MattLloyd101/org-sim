define(["app/utils/RenderObject",
        "app/utils/math3d/Vector3",
        "app/utils/math3d/Quaternion",
        "app/renderable/rooms/Room",
        "app/renderable/Items/Table"],
    function (RenderObject,
              Vector3,
              Quaternion,
              Room,
              Table) {

        const constructor = function (peopleCount, doorDirection, colour) {

            const table = Table.new.apply(this, [peopleCount, colour]);
            table.z = 50;

            const leftMargin = 100;
            const rightMargin = 100;
            const topMargin = 100;
            const bottomMargin = 100;

            const width = leftMargin + table.width + rightMargin;
            const height = topMargin + table.height + bottomMargin;

            const room = Room.new.apply(this, [width, height, doorDirection, colour, "MEETING"]);

            const This = Object.assign(room, {
                width,
                height,
                table
            });

            This.pathMap.addObstacle(table.x - table.width / 2,
                table.y - table.height / 2,
                table.width,
                table.height);

            This.addChild(table);

            This.update = function (dt) {
            };

            This.sitAtTable = function (person) {

            };

            return This;
        };

        return {
            new: constructor
        }
    });