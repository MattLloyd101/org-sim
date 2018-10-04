define(["app/utils/RenderObject",
        "app/utils/math3d/Vector3",
        "app/utils/math3d/Quaternion",
        "app/renderable/rooms/Room",
        "app/renderable/items/Desk",
        "app/utils/Astar",
        "app/utils/EventBus"],
    function (RenderObject,
              Vector3,
              Quaternion,
              Room,
              Desk,
              AStar,
              EventBus) {

        const constructor = function (workstationCount, canPair, doorDirection, colour) {

            const desk = Desk.new.apply(this, [workstationCount, canPair, colour]);

            const leftMargin = 100;
            const rightMargin = 20;
            const topMargin = 100;
            const bottomMargin = 100;

            const width = leftMargin + desk.width + rightMargin;
            const height = topMargin + desk.height + bottomMargin;

            const room = Room.new.apply(this, [width, height, doorDirection, colour, "DEVELOPMENT"]);

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

            This.update = function (dt) {

            };

            This.seatPositionInRoom = function (workstation, seatPosition) {

                workstation.transformToContainer(seatPosition);
                desk.transformToContainer(seatPosition);

                return seatPosition;
            };

            This.findWorkstation = function (person) {
                const room = This;
                const desk = room.desk;

                const freeWorkstation = desk.findFreeWorkstation();
                if (freeWorkstation != null) {

                    const seatPosition = freeWorkstation.findFreeSeat();
                    if (seatPosition !== null) {
                        freeWorkstation.takeSeat(person, seatPosition);

                        const seatPositionInRoom = room.seatPositionInRoom(freeWorkstation, seatPosition);

                        const seatPositionOnMap = room.pathMap.findClosestPoint(seatPositionInRoom);
                        const map = room.pathMap.calculatedMap;
                        const path = AStar.pathBetween(map, room.pathMap.entrancePoint, seatPositionOnMap);

                        const initial = {x: person.x, y: person.y};
                        path.unshift(initial);
                        path.push(seatPositionInRoom);

                        room.pathMap.path = path;

                        const facePosition = {x: 0, y: 0, z: 0};
                        freeWorkstation.transformToContainer(facePosition);
                        desk.transformToContainer(facePosition);

                        const dX = facePosition.x - seatPositionInRoom.x;
                        const dY = facePosition.y - seatPositionInRoom.y;
                        const angle = Math.atan2(dY, dX) + Math.PI / 2;
                        person.walkPath(path,
                            {rotationX: 0, rotationY: 0, rotationZ: angle},
                            function () {
                                freeWorkstation.users.push(person);

                                person.eventBus.emitEvent("ARRIVED_AT_WORKSTATION", {
                                    workstation: freeWorkstation,
                                    canBeginWork: freeWorkstation.isFull()
                                });
                            });
                    }
                }
            };

            return This;
        };

        return {
            new: constructor
        }
    });