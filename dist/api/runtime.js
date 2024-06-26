"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapValues = void 0;
function mapValues(data, fn) {
    return Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: fn(data[key]) }), {});
}
exports.mapValues = mapValues;
//# sourceMappingURL=runtime.js.map