define([
    "app/utils/RenderObject",
    "app/renderable/Items/Workstation",
    "app/renderable/Items/TablePlane"], function (RenderObject, Workstation, TablePlane) {

    const constructor = function (peopleCount, deskColour) {

        const personWidth = 60;
        const tableRadius = (peopleCount * personWidth) / (Math.PI * 2);
        const width = (tableRadius + personWidth) * 2;
        const height = width;

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

        This.findFreeWorkstation = function() {
            return This.workstations.find(function(workstation) {
                return workstation.hasSpace();
            });
        };

        This.update = function() {
        };

        const standColour = this.color(deskColour, 0x33, 0x88);

        This.render = function () {

            this.fill(standColour);
            // for(let i = 0; i < This.userPositions.length; i++) {
            //     const {x, y} = This.userPositions[i];
            //     this.ellipse(x, y, 50, 50);
            // }
            for (let i = 0; i < This.seats.length; i++) {
                const {x, y} = This.seats[i];
                this.ellipse(x, y, 50, 50);
            }
        };

        return This;
    };

    return {
        new: constructor
    }
});