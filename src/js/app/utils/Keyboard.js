define([], function () {

    const listeners = [];
    const activeKeys = {};
    const codeMapping = {
        16: "SHIFT",
        17: "CONTROL",
        18: "OPTION",
        91: "CMD",
        37: "LEFT",
        38: "UP",
        39: "RIGHT",
        40: "DOWN",
        189: "MINUS",
        187: "PLUS"
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
            console.log(code, mapping);
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