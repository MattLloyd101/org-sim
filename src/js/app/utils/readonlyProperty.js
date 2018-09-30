/*
Copyright (c) 2016, Alihan Livdumlu.  All rights reserved.
Copyrights licensed under MIT License. See the accompanying LICENSE file for terms.
*/

define([], function () {

    return function (obj, name, val) {
        let prop = {
            configurable: false,
            enumerable: true
        };
        if (typeof val === 'function')
            prop.get = val;
        else {
            prop.writable = false;
            prop.value = val;
        }

        Object.defineProperty(obj, name, prop);
    };

});