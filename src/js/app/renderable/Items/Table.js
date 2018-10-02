define([
    "app/utils/RenderObject",
    "app/renderable/items/Workstation",
    "app/renderable/items/TablePlane",
    "app/utils/Random"],
    function (RenderObject,
              Workstation,
              TablePlane,
              Random) {

    const constructor = function (peopleCount, deskColour) {

        const personWidth = 60;
        const tableRadius = (peopleCount * personWidth) / (Math.PI * 2);
        const width = (tableRadius + personWidth) * 2;
        const height = width;

        const standColour = this.color(deskColour, 0x33, 0x88);

        const This = Object.assign(RenderObject.new(), {
            peopleCount,
            width, height,
            radius: tableRadius,
            seats: []
        });

        const tablePlane = TablePlane.new.apply(this, [tableRadius, deskColour]);
        This.addChild(tablePlane);

        const angleIncrement = Math.PI * 2 / peopleCount;
        for(let i = 0; i < peopleCount; i++) {
            const angle = angleIncrement * i;
            const r = tableRadius + (personWidth / 2);
            const seat = {x: Math.cos(angle) * r, y: Math.sin(angle) * r};

            This.seats.push(seat);
        }

        Random.shuffle(This.seats);

        This.takeSeat = function (person, seat) {
            seat.isTaken = true;
            seat.takenBy = person;
        };

        This.findFreeSeat = function () {
            return This.seats.find(function (seat) {
                return !seat.isTaken;
            });
        };

        This.render = function () {

            this.fill(standColour);
            this.push();
            this.translate(0, 0, -25);
            for (let i = 0; i < This.seats.length; i++) {
                const {x, y} = This.seats[i];

                this.ellipse(x, y, 50, 50);
            }
            this.pop();
        };

        return This;
    };

    return {
        new: constructor
    }
});