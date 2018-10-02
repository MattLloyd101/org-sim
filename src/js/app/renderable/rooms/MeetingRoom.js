define(["app/utils/RenderObject",
        "app/utils/math3d/Vector3",
        "app/utils/math3d/Quaternion",
        "app/utils/AStar",
        "app/renderable/rooms/Room",
        "app/renderable/items/Table"],
    function (RenderObject,
              Vector3,
              Quaternion,
              AStar,
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

            This.seatPositionInRoom = function (seatPosition) {

                table.transformToContainer(seatPosition);

                return seatPosition;
            };

            This.sitAtTable = function (person) {
                const room = This;

                const seatPosition = table.findFreeSeat();
                if (seatPosition !== null) {
                    table.takeSeat(person, seatPosition);

                    const seatPositionInRoom = room.seatPositionInRoom(seatPosition);

                    const seatPositionOnMap = room.pathMap.findClosestPoint(seatPositionInRoom);
                    const map = room.pathMap.calculatedMap;
                    const path = AStar.pathBetween(map, room.pathMap.entrancePoint, seatPositionOnMap);

                    const initial = {x: person.x, y: person.y};
                    path.unshift(initial);
                    path.push(seatPositionInRoom);

                    room.pathMap.path = path;

                    const facePosition = {x: 0, y: 0, z: 0};

                    const dX = facePosition.x - seatPositionInRoom.x;
                    const dY = facePosition.y - seatPositionInRoom.y;
                    const angle = Math.atan2(dY, dX) + Math.PI / 2;
                    person.walkPath(path, {rotationX: 0, rotationY: 0, rotationZ: angle});

                }
            };

            return This;
        };

        return {
            new: constructor
        }
    });