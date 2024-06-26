"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deep_copy(obj, refs = new Set()) {
    let copy;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        copy = obj.map((i) => deep_copy(i, refs));
        return copy;
    }
    // Handle Set
    if (obj instanceof Set) {
        copy = new Set(obj);
        return copy;
    }
    // Handle Map
    if (obj instanceof Map) {
        copy = new Map(obj);
        return copy;
    }
    // Handle Buffer
    if (obj instanceof Buffer) {
        copy = Buffer.from(obj);
        return copy;
    }
    // Handle Uint8Array
    if (obj instanceof Uint8Array) {
        copy = new Uint8Array(obj);
        return copy;
    }
    if (obj instanceof Function) {
        // This is not technically correct, but required for unit test purposes. We currently have a unit test that passes in a function where it shouldn't. So in order to handle this case we need to do something here. Ideally we would clone the function somehow to create a copy of it. But that is lower priority for now.
        return obj;
    }
    // Handle Object
    if (obj instanceof Object) {
        refs.add(obj)
        if (obj.constructor !== Object) {
            copy = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
        }
        else {
            copy = {};
        }
        for (const attr in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                const val = obj[attr]
                const isObjectVal = typeof val === 'object' && !Array.isArray(val) && val !== null
                
                if (isObjectVal) {
                    const isCircular = refs.has(val)
                    if (isCircular) continue;

                    refs.add(val)
                }

                copy[attr] = deep_copy(val, refs);
            }
        }
        return copy;
    }
    return obj;
}
exports.default = deep_copy;
