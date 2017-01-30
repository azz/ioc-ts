"use strict";
const thingsSymbol = Symbol('things');
function container(things) {
    let _things = Object.assign({}, things);
    const methods = {
        define(moreThings) {
            return container(Object.assign({}, _things, moreThings));
        },
        combine(otherContainer) {
            return methods.define(otherContainer[thingsSymbol]);
        },
        inject: function (input) {
            return input.bind(null, _things);
        },
        [thingsSymbol]: _things
    };
    return methods;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = container;
