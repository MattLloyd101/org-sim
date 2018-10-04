define([], function () {

    let id = 0;

    const constructor = function () {

        const This = {id: ++id};
        const db = {};

        This.emitEvent = function (binding, data) {
            const listeners = db[binding];
            if (listeners) {
                for (let i = 0; i < listeners.length; i++) {
                    const fn = listeners[i];

                    fn.apply(null, [data]);
                }
            }
        };

        This.bindListener = function (binding, fn) {
            const listeners = db[binding] || [];
            db[binding] = listeners.concat(fn);
        };

        This.removeListener = function (binding, fn) {
            const listeners = db[binding];
            const index = listeners.indexOf(fn);
            if (index === -1) {
                throw new Error("Function is not bound to binding(" + binding + ")");
            }
            listeners.splice(index, 1);
        };

        return This;
    };

    return {
        new: constructor
    }
});