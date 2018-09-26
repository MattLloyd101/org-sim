define([], function () {

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
        const children = [];
        const debug = false;
        const rotationX = 0;
        const rotationY = 0;
        const rotationZ = 0;
        const performRender = true;

        const This = {
            id,
            x, y, z,
            scaleX, scaleY,
            rotationX, rotationY, rotationZ,
            performRender,
            debug
        };


        This.addChild = function(child) {

            if(child === This)
                throw new Error("Attempted to A.addChild(A)");
            const z = children.length;
            children[z] = child;
            child.parent = This;
            return child;
        };

        This.removeChild = function(child) {
            const index = children.indexOf(child);
            if(index !== -1) {
                delete children[index];
                delete child.parent;
                return true;
            }
            return false;
        };

        This.updateAll = function() {
            if(This.update) This.update();
            children.map(function(child) {
                child.updateAll();
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

        This.transform = function(context) {
            context.translate(This.x, This.y, This.z);
            context.rotateX(This.rotationX);
            context.rotateY(This.rotationY);
            context.rotateZ(This.rotationZ);
            context.scale(This.scaleX, This.scaleY);
        };

        // TODO: If we need a click buffer re-use This.render if This.cbRender is not defined.
        // Override .fill() with object id.
        This.cbRenderAll = function () {

        };

        This.renderAll = function() {
            This.transform(context);
            context.push();
            if(This.render) This.render.apply(context);
            context.pop();
            children.map(function(child) {
                context.push();
                child.renderAll();
                context.pop();
            });

            if(This.debug) This.renderDebug.apply(context);
        };

        return This;
    };

    const setRootContext = function (_context) {
        context = _context;
    };

    const setClickBufferContext = function (_cbContext) {
        cbContext = _cbContext;
    };

    return {
        new: constructor,
        setRootContext,
        setClickBufferContext
    }
});