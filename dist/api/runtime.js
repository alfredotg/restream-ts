/* tslint:disable */
/* eslint-disable */
export function mapValues(data, fn) {
    return Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: fn(data[key]) }), {});
}
//# sourceMappingURL=runtime.js.map