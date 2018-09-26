define([
    "app/utils/RenderObject",
    "app/renderable/Items/Workstation",
    "app/renderable/Items/DeskPlane"], function (RenderObject, Workstation, DeskPlane) {

    const constructor = function (workstationNum, deskColour) {

        const workstationNumWidth = Math.ceil(workstationNum / 2);
        const workstationWidth = 100;
        const workstationSpacing = 20;
        const deskDepth = 80;

        const width = workstationNumWidth * workstationWidth + workstationSpacing * (workstationNumWidth);
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
            const workstation = Workstation.new.apply(this, [deskColour]);
            const isEven = (i % 2) === 0;
            workstation.x = workstationSpacing + Math.floor(i / 2) * (workstationWidth + workstationSpacing);
            workstation.y = deskDepth * 3 / 4;
            workstation.z = workstation.height;
            if (isEven) {
                workstation.rotationZ = Math.PI;
                workstation.x += workstation.width;
            } else {
                workstation.rotationZ = 0;
                workstation.y += deskDepth/4;
            }

            This.workstations.push(workstation);
            This.addChild(workstation);
        }

        This.update = function() {
        };

        return This;
    };

    return {
        new: constructor
    }
});