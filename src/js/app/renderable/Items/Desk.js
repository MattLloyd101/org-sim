define([
    "app/utils/RenderObject",
    "app/renderable/items/Workstation",
    "app/renderable/items/DeskPlane"], function (RenderObject, Workstation, DeskPlane) {

    const constructor = function (workstationNum, isPairing, deskColour) {

        const workstationNumWidth = Math.ceil(workstationNum / 2);
        const workstationWidth = 125;
        const workstationSpacing = 25;
        const deskDepth = 80;

        const width = (workstationWidth / 2) + (workstationWidth + workstationSpacing) * (workstationNumWidth);
        const height = deskDepth * 2;

        const This = Object.assign(RenderObject.new(), {
            workstationNum,
            width, height,
            workstations: []
        });

        const deskPlane = DeskPlane.new.apply(this, [width, height, deskColour]);
        This.addChild(deskPlane);
        deskPlane.x = width/2;
        deskPlane.y = height/2;

        for(let i = 0; i < workstationNum; i++) {
            const workstation = Workstation.new.apply(this, [deskColour, isPairing]);
            const isEven = (i % 2) === 0;
            workstation.x = workstationSpacing + (workstationWidth / 2) + Math.floor(i / 2) * (workstationWidth + workstationSpacing);
            workstation.y = deskDepth;
            workstation.z = 0;
            if (isEven) {
                workstation.rotationZ = Math.PI;
                workstation.y -= deskDepth/3;
            } else {
                workstation.rotationZ = 0;
                workstation.y += deskDepth/3;
            }

            This.workstations.push(workstation);
            This.addChild(workstation);
        }

        This.findFreeWorkstation = function() {
            return This.workstations.find(function(workstation) {
                return workstation.hasSpace();
            });
        };

        This.update = function() {
        };

        return This;
    };

    return {
        new: constructor
    }
});