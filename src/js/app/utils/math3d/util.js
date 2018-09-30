/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

define([], function () {

    const _inherits = typeof Object.setPrototypeOf === 'function'
        ? function (ctor, superCtor) {
            ctor.super_ = superCtor;
            Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
        }

        : typeof Object.create === 'function'
            ? function (ctor, superCtor) {
                ctor.super_ = superCtor;
                ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                })
            }

            : function (ctor, superCtor) {
                ctor.super_ = superCtor;

                function F() {
                }

                F.prototype = superCtor.prototype;
                ctor.prototype = new F;
                ctor.prototype.constructor = ctor
            };


    function inherits(ctor, superCtor) {

        if (ctor === undefined || ctor === null) {
            throw new TypeError('The constructor to "inherits" must not be ' +
                'null or undefined')
        }

        if (superCtor === undefined || superCtor === null) {
            throw new TypeError('The super constructor to "inherits" must not ' +
                'be null or undefined')
        }

        if (superCtor.prototype === undefined) {
            throw new TypeError('The super constructor to "inherits" must ' +
                'have a prototype')
        }

        _inherits(ctor, superCtor)
    }

    function isNumber(o) {
        return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
    }

    function isNumberArray(arr) {
        return Array.isArray(arr) && arr.every(isNumber);
    }

    function doublesEqual(d1, d2) {
        var preciseness = 1e-13;
        return Math.abs(d1 - d2) < preciseness;
    }

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (isNumber(a[i]) && isNumber(b[i])) {
                if (!doublesEqual(a[i], b[i]))
                    return false;
            } else if (a[i] !== b[i])
                return false;
        }
        return true;
    }


    return {
        isNumber,
        isNumberArray,
        doublesEqual,
        arraysEqual,
        inherits
    };

});