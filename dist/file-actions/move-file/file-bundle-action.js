"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var FileBundleAction = /** @class */ (function (_super) {
    __extends(FileBundleAction, _super);
    function FileBundleAction(inFile, hash, options) {
        return _super.call(this, inFile, hash, options, [FileBundleAction.generateFilenameReplaceFilter]) || this;
    }
    return FileBundleAction;
}(_1.ABundleAction));
exports.FileBundleAction = FileBundleAction;
//# sourceMappingURL=file-bundle-action.js.map