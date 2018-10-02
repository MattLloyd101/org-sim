define(["app/utils/RenderObject",
        "app/utils/math3d/Vector3",
        "app/utils/math3d/Quaternion",
        "app/utils/AStar",
        "app/renderable/rooms/Room",
        "app/renderable/items/DeskPlane"],
    function (RenderObject,
              Vector3,
              Quaternion,
              AStar,
              Room,
              DeskPlane) {

        const constructor = function (doorDirection, colour) {

            const seatWidth = 50;
            const leftMargin = 10;
            const rightMargin = 100;
            const topMargin = 100;
            const bottomMargin = 150;

            const desk = DeskPlane.new.apply(this, [250, 100, colour]);
            const standColour = this.color(colour, 0x33, 0x88);

            const width = leftMargin + desk.width + rightMargin;
            const height = topMargin + desk.height + bottomMargin;

            desk.x = (-width / 2) + (desk.width / 2) + leftMargin;
            desk.y = (-height / 2) + (desk.height / 2) + bottomMargin;
            desk.z = 50;


            const room = Room.new.apply(this, [width, height, doorDirection, colour, "OFFICE"]);

            const This = Object.assign(room, {
                width,
                height,
                desk,
                debug: true
            });

            This.ownerSeat = {x: desk.x, y: desk.y + desk.height / 2 + seatWidth / 2};
            This.guestSeats = [
                {x: desk.x - seatWidth, y: desk.y - desk.height / 2 - seatWidth / 2},
                {x: desk.x + seatWidth, y: desk.y - desk.height / 2 - seatWidth / 2}
            ];

            This.pathMap.addObstacle(desk.x - desk.width / 2,
                desk.y - desk.height / 2,
                desk.width,
                desk.height);

            This.addChild(desk);

            This.setOwner = function (owner) {
                This.owner = owner;
            };

            This.renderDebug = function () {
                this.fill(standColour);
                this.push();
                this.translate(0, 0, 25);

                this.ellipse(This.ownerSeat.x, This.ownerSeat.y, 50, 50);
                for (let i = 0; i < This.guestSeats.length; i++) {
                    const {x, y} = This.guestSeats[i];

                    this.ellipse(x, y, 50, 50);
                }
                this.pop();
            };

            This.takeSeat = function (person, seat) {
                seat.isTaken = true;
                seat.takenBy = person;
            };

            This.findFreeSeat = function () {
                return This.guestSeats.find(function (seat) {
                    return !seat.isTaken;
                });
            };

            This.sitAtDesk = function (person) {
                const room = This;

                const isOwner = person === This.owner;

                const seatPosition = isOwner ? This.ownerSeat : This.findFreeSeat();
                if (seatPosition !== null) {
                    This.takeSeat(person, seatPosition);

                    const seatPositionInRoom = seatPosition;

                    const seatPositionOnMap = room.pathMap.findClosestPoint(seatPositionInRoom);
                    const map = room.pathMap.calculatedMap;
                    const path = AStar.pathBetween(map, room.pathMap.entrancePoint, seatPositionOnMap);

                    const initial = {x: person.x, y: person.y};
                    path.unshift(initial);
                    path.push(seatPositionInRoom);

                    room.pathMap.path = path;

                    const facePosition = {x: desk.x, y: desk.y, z: 0};

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