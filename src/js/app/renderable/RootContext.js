define(["app/utils/RenderObject",
        "app/utils/Keyboard"],
    function (RenderObject,
              K) {

        const constructor = function () {

            const moveSpeed = 5;
            const This = Object.assign(RenderObject.new(), {
                xDirection: 0,
                yDirection: 0
            });

            const updateMovement = function (keys) {
                const left = K.keyMapping["LEFT"] in keys;
                const right = K.keyMapping["RIGHT"] in keys;
                const up = K.keyMapping["UP"] in keys;
                const down = K.keyMapping["DOWN"] in keys;

                This.xDirection = left && right ? 0 : (left ? 1 : (right ? -1 : 0));
                This.yDirection = up && down ? 0 : (up ? 1 : (down ? -1 : 0));
            };


            K.addEventListener(updateMovement);

            This.update = function (dt) {
                const speed = moveSpeed*dt;
                This.x += This.xDirection * speed;
                This.y += This.yDirection * speed;
            };

            return This;
        };

        return {
            new: constructor
        }
    });