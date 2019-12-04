"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
exports.isIMoveFile = function (action) {
    return lodash_1.isString(action.inFile) && lodash_1.isString(action.outFile);
};
//# sourceMappingURL=i-move-file.js.map