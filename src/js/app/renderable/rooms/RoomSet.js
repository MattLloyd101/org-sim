define(["app/utils/RenderObject",
        "app/renderable/rooms/Room"],

    function (RenderObject,
              Room) {

        const constructor = function (rooms, colour) {

            const width = 260;
            const roomSpacing = 0;

            const topRooms = rooms.filter(function (room) {
                return room.doorDirection === "BOTTOM";
            });
            const topRoomsHeight = topRooms.reduce(function (height, room) {
                return height + room.width;
            }, 0) + (rooms.length - 1) * roomSpacing;

            const bottomRooms = rooms.filter(function (room) {
                return room.doorDirection === "TOP";
            });
            const bottomRoomsHeight = bottomRooms.reduce(function (height, room) {
                return height + room.width;
            }, 0) + (rooms.length - 1) * roomSpacing;


            const height = Math.max(topRoomsHeight, bottomRoomsHeight);

            const type = "CORRIDOOR";
            const corridoor = Room.new.apply(this, [height, width, "LEFT", colour, type]);

            // const pathMap = PathMap.new(-width / 2, -height / 2, width, height, 15, 25);

            const parent = RenderObject.new();
            const This = Object.assign(parent, {
                rooms,
                corridoor
            });

            topRooms.reduce(function (offset, room) {
                room.x = offset + room.width / 2;
                This.addChild(room);
                room.y = -width / 2 - room.height / 2;
                return room.x + room.width / 2;
            }, -height / 2);

            bottomRooms.reduce(function (offset, room) {
                room.x = offset + room.width / 2;
                This.addChild(room);
                room.y = width / 2 + room.height / 2;
                return room.x + room.width / 2;
            }, -height / 2);

            This.addChild(corridoor);

            This.update = function (dt) {
                // topRooms.map(function(room) { room.y++; });
                // This.rotationZ += ((Math.PI / 60) / 10) * dt;
            };

            This.renderDebug = function () {
            };

            This.render = function () {
            };

            return This;
        };

        return {
            new: constructor
        }
    }
)
;