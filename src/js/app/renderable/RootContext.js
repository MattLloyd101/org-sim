define(["app/utils/RenderObject",
        "app/utils/Keyboard"],
    function (RenderObject,
              K) {

        const constructor = function () {

            const rotationSpeed = Math.PI / 60;
            const scaleSpeed = 0.01;
            const moveSpeed = 25;
            const This = Object.assign(RenderObject.new(), {
                xDirection: 0,
                yDirection: 0,
                scaleDirection: 0,
                rotXDirection: 0,
                rotYDirection: 0,
                rotZDirection: 0
            });

            const updateMovement = function (keys) {
                const left = K.keyMapping["LEFT"] in keys;
                const right = K.keyMapping["RIGHT"] in keys;
                const up = K.keyMapping["UP"] in keys;
                const down = K.keyMapping["DOWN"] in keys;
                const grow = K.keyMapping["PLUS"] in keys;
                const shrink = K.keyMapping["MINUS"] in keys;
                const rotXUp = K.keyMapping["W"] in keys;
                const rotXDown = K.keyMapping["S"] in keys;
                // const rotYUp = K.keyMapping["Q"] in keys;
                // const rotYDown = K.keyMapping["E"] in keys;
                const rotZUp = K.keyMapping["A"] in keys;
                const rotZDown = K.keyMapping["D"] in keys;

                const shouldReset = K.keyMapping["R"] in keys;

                This.xDirection = left && right ? 0 : (left ? 1 : (right ? -1 : 0));
                This.yDirection = up && down ? 0 : (up ? 1 : (down ? -1 : 0));
                This.scaleDirection = grow && shrink ? 0 : (grow ? 1 : (shrink ? -1 : 0));
                This.rotXDirection = rotXUp && rotXDown ? 0 : (rotXUp ? 1 : (rotXDown ? -1 : 0));
                // This.rotYDirection = rotYUp && rotYDown ? 0 : (rotYUp ? 1 : (rotYDown ? -1 : 0));
                This.rotZDirection = rotZUp && rotZDown ? 0 : (rotZUp ? 1 : (rotZDown ? -1 : 0));

                if(shouldReset) This.resetTransformation();
            };


            K.addEventListener(updateMovement);

            This.update = function (dt) {
                const speed = moveSpeed * dt;
                This.x += This.xDirection * speed;
                This.y += This.yDirection * speed;

                This.scaleX = This.scaleY = This.scaleZ += This.scaleDirection * (scaleSpeed * dt);

                This.rotationX += This.rotXDirection * rotationSpeed;
                This.rotationY += This.rotYDirection * rotationSpeed;
                This.rotationZ += This.rotZDirection * rotationSpeed;
            };

            This.resetTransformation = function () {
                This.x = This.y = 0;
                This.scaleX = This.scaleY = This.scaleZ = 1;

                This.rotationX = Math.PI / 4;
                This.rotationY = 0;
                This.rotationZ = Math.PI / 8;
            };

            return This;
        };

        return {
            new: constructor
        }
    });