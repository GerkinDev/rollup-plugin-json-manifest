"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var regexJoiExt = function (localJoi) {
    return ({
        base: localJoi.object(),
        language: {
            datetime: 'must be a valid regex instance',
        },
        name: 'regex',
        rules: [{
                name: 'regex',
                validate: function (params, value, state, options) {
                    if (value instanceof RegExp) {
                        return value;
                    }
                    else {
                        return this.createError('object.regex', { value: value }, state, options);
                    }
                },
            }],
    });
};
var joi = joi_1.default.extend(regexJoiExt);
exports.alternatives = joi.alternatives, exports.isArray = joi.array, exports.isFunc = joi.func, exports.isObject = joi.object, exports.ref = joi.ref, exports.isRegex = joi.regex, exports.isString = joi.string, exports.isBoolean = joi.boolean;
exports.schemaFor = function (schema) { return exports.isObject().keys(schema); };
//# sourceMappingURL=joi-extend.js.map