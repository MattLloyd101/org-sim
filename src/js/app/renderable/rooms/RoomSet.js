define(["app/utils/RenderObject",
        "app/renderable/rooms/Room",
        "app/utils/AStar"],

    function (RenderObject,
              Room,
              AStar) {

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

            const type = "CORRIDOR";
            const corridor = Room.new.apply(this, [height, width, "LEFT", colour, type]);

            // const pathMap = PathMap.new(-width / 2, -height / 2, width, height, 15, 25);

            const parent = RenderObject.new();
            const This = Object.assign(parent, {
                rooms,
                type: "ROOM_SET",
                corridor,
                debug: true
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

            This.addChild(corridor);

            This.update = function (dt) {
                // topRooms.map(function(room) { room.y++; });
                // This.rotationZ += ((Math.PI / 60) / 10) * dt;
            };

            This.renderDebug = function () {
                if (This.targetPoint) {
                    this.colorMode(this.RGB, 0xFF);
                    this.stroke(0xFF, 0, 0);
                    this.line(This.targetPoint.x, This.targetPoint.y, 0, This.targetPoint.x, This.targetPoint.y, 200);
                }
            };

            This.render = function () {
            };

            This.travelTo = function (person, targetRoomType) {
                const room = rooms.find(function (room) {
                    return room.type === targetRoomType;
                });

                const targetPoint = {
                    x: room.x + room.entranceX,
                    y: room.y + room.entranceY
                };
                const map = corridor.pathMap;
                const doorPositionOnMap = map.findClosestPoint(targetPoint);
                const path = AStar.pathBetween(map.calculatedMap, map.entrancePoint, doorPositionOnMap);

                person.walkPath(path, null, function () {
                    person.enterRoom(room);
                })
            };

            return This;
        };

        return {
            new: constructor
        }
    }
)
;