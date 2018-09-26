define([], function () {

    // Dumb singleton implementation for this purpose.
    const db = {};

    const emitEvent = function (binding, source, data) {
        const listeners = db[binding];
        if(listeners) {
            for (let i = 0; i < listeners.length; i++) {
                const fn = listeners[i];

                setTimeout(function () {
                    fn.apply(null, [source, data]);
                }, 0);
            }
        }
    };

    const bindListener = function (binding, fn) {
        const listeners = db[binding] || [];
        db[binding] = listeners.concat(fn);
    };

    const removeListener = function(binding, fn) {
        const listeners = db[binding];
        const index = listeners.indexOf(fn);
        if(index === -1) {
            throw new Error("Function is not bound to binding(" + binding + ")");
        }
        listeners.splice(index, 1);
    };

    return {
        emitEvent,
        bindListener,
        removeListener
    }
});