"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
exports.isIFileAction = function (action) {
    return lodash_1.isString(action.inFile) && lodash_1.isString(action.outFile);
};
//# sourceMappingURL=i-file-action.js.map