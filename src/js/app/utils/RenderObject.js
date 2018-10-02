define(["app/utils/math3d/Vector3",
        "app/utils/math3d/Quaternion",
        "app/utils/math3d/Matrix4x4"],
    function (Vector3,
              Quaternion,
              Matrix4x4) {

        const clickRegister = {};
        let context;
        let cbContext;
        let _id = 0;

        const constructor = function () {
            const id = ++_id;
            const x = 0;
            const y = 0;
            const z = 0;
            const scaleX = 1;
            const scaleY = 1;
            const scaleZ = 1;
            const children = [];
            const debug = false;
            const rotationX = 0;
            const rotationY = 0;
            const rotationZ = 0;
            const performRender = true;

            const This = {
                id,
                x, y, z,
                scaleX, scaleY, scaleZ,
                rotationX, rotationY, rotationZ,
                performRender,
                debug,
                context, cbContext
            };

            This.addChildAt = function (child, z) {
                if (child === This)
                    throw new Error("Attempted to A.addChild(A) ");

                children[z] = child;
                child.parent = This;
                return child;
            };

            This.addChild = function (child) {
                if (child === This)
                    throw new Error("Attempted to A.addChild(A) ");
                const z = children.length;
                children[z] = child;
                child.parent = This;
                return child;
            };

            This.removeChild = function (child) {
                const index = children.indexOf(child);
                if (index !== -1) {
                    delete children[index];
                    delete child.parent;
                    return true;
                }
                return false;
            };

            This.updateAll = function (dt) {
                if (This.update) This.update(dt);
                children.map(function (child) {
                    child.updateAll(dt);
                });
            };

            This.renderDebug = function () {
                this.push();
                this.translate(0, 0, 0);
                this.colorMode(this.RGB, 0xFF);
                this.stroke(0xFF, 0, 0);
                this.strokeWeight(2);
                this.line(0, 0, 0, 100, 0, 0);

                this.stroke(0, 0xFF, 0);
                this.line(0, 0, 0, 0, 100, 0);

                this.stroke(0, 0, 0xFF);
                this.line(0, 0, 0, 0, 0, 100);
                this.pop();
            };

            This.transform = function (context) {
                context.translate(This.x, This.y, This.z);
                context.rotateX(This.rotationX);
                context.rotateY(This.rotationY);
                context.rotateZ(This.rotationZ);
                context.scale(This.scaleX, This.scaleY, This.scaleZ);
            };

            This.transformToContainer = function (renderObject) {
                const vec = new Vector3(renderObject.x, renderObject.y, renderObject.z);
                const position = new Vector3(This.x, This.y, This.z);
                const rotation = Quaternion.Euler(This.rotationX, This.rotationY, This.rotationZ);

                // TODO: need to account for scale.

                const vec1 = rotation.mulVector3(vec);
                const vec2 = vec1.add(position);

                renderObject.x = vec2.x;
                renderObject.y = vec2.y;
                renderObject.z = vec2.z;

                renderObject.rotationX = renderObject.rotationX + This.rotationX;
                renderObject.rotationY = renderObject.rotationY + This.rotationY;
                renderObject.rotationZ = renderObject.rotationZ + This.rotationZ;

                return renderObject;
            };

            This.globalToLocalMatrix = function () {
                const position = new Vector3(This.x, This.y, This.z);
                const rotation = Quaternion.Euler(This.rotationX, This.rotationY, This.rotationZ);
                const scale = new Vector3(This.scaleX, This.scaleY, This.scaleZ);
                return Matrix4x4.WorldToLocalMatrix(position, rotation, scale);
            };

            This.registerClickHandler = function (fn) {
                clickRegister[This.id] = clickRegister[This.id] || [fn];
            };

            This.performClick = function (id, mouseX, mouseY) {
                if (id in clickRegister) {
                    clickRegister[id].map(function (fn) {
                        fn.apply(context, [mouseX, mouseY]);
                    });
                }
            };

            This.renderAll = function (context, cbPass) {

                if (cbPass) {
                    context.fill = function () {
                        context.__fill('#' + id.toString(16).padStart(4, '0') + 'FFFF');
                    };
                    context.texture = function () {
                        context.__fill('#' + id.toString(16).padStart(4, '0') + 'FFFF');
                    };
                }
                This.transform(context);

                if (!cbPass || This.id in clickRegister) {
                    context.push();
                    if (This.render) This.render.apply(context);
                    context.pop();
                }

                children.map(function (child) {
                    context.push();
                    child.renderAll(context, cbPass);
                    context.pop();
                });

                if (This.debug) This.renderDebug.apply(context);
            };

            return This;
        };

        const setRootContext = function (_context) {
            context = _context;
        };

        const setClickBufferContext = function (_cbContext) {
            cbContext = _cbContext;
            cbContext.__fill = cbContext.fill;
        };

        return {
            new: constructor,
            setRootContext,
            setClickBufferContext
        }
    });