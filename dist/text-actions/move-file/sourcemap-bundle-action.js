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
var SourcemapBundleAction = /** @class */ (function (_super) {
    __extends(SourcemapBundleAction, _super);
    function SourcemapBundleAction(inFile, hash, options) {
        return _super.call(this, inFile, hash, options, []) || this;
    }
    return SourcemapBundleAction;
}(_1.ABundleAction));
exports.SourcemapBundleAction = SourcemapBundleAction;
//# sourceMappingURL=sourcemap-bundle-action.js.map