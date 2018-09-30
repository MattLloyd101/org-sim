define([], function () {

    const listeners = [];
    const activeKeys = {};
    const codeMapping = {
        37: "LEFT",
        38: "UP",
        39: "RIGHT",
        40: "DOWN"
    };
    const keyMapping = Object.keys(codeMapping).reduce(function (obj, code) {
        const key = codeMapping[code];
        obj[key] = code;
        return obj;
    }, {});

    const addEventListener = function (fn) {
        listeners.push(fn);
    };

    const setup = function (context) {
        context.keyPressed = function () {
            const code = context.keyCode;
            const mapping = codeMapping[code];
            activeKeys[code] = mapping || "UNKNOWN(" + code + ")";
            listeners.map(function (fn) {
                fn(activeKeys);
            });
        };

        context.keyReleased = function () {
            const code = context.keyCode;
            delete activeKeys[code];
            listeners.map(function (fn) {
                fn(activeKeys);
            });
        };
    };

    return {
        codeMapping,
        keyMapping,
        addEventListener,
        setup
    }
});