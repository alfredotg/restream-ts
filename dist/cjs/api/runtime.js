"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapValues = mapValues;
function mapValues(data, fn) {
    return Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: fn(data[key]) }), {});
}
//# sourceMappingURL=runtime.js.map