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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
var lodash_1 = require("lodash");
var stream_replace_1 = __importDefault(require("stream-replace"));
var utils_1 = require("../../utils");
var a_file_action_1 = require("../a-file-action");
var AMoveFile = /** @class */ (function (_super) {
    __extends(AMoveFile, _super);
    function AMoveFile(inFile, hash, options, filters) {
        if (filters === void 0) { filters = []; }
        var _this = _super.call(this, options, utils_1.resolveNewFilename(inFile, hash, options), filters
            .map(function (filter) { return filter === AMoveFile.generateFilenameReplaceFilter ?
            (function () { return filter(_this); }) :
            filter; })) || this;
        _this.inFile = inFile;
        _this.hash = hash;
        return _this;
    }
    AMoveFile.generateFilenameReplaceFilter = function (file, _outFile) {
        var _a = lodash_1.isString(file) ? { inFile: file, outFile: _outFile } : file, inFile = _a.inFile, outFile = _a.outFile;
        if (lodash_1.isNil(inFile) || lodash_1.isNil(outFile)) {
            throw new Error();
        }
        var originalSegments = path_1.dirname(inFile).split('/');
        var pathRegex = originalSegments
            .map(function (s) { return escape_string_regexp_1.default(s); })
            .reduce(function (acc, s) { return acc ?
            "(?:" + acc + "\\/)?" + s :
            s; });
        var replaceFileRegex = new RegExp("(\\W|^)(" + pathRegex + "\\/)?(" + escape_string_regexp_1.default(path_1.basename(inFile)) + ")(\\W|$)", 'g');
        return stream_replace_1.default(replaceFileRegex, function (fullmatch, prefix, path, filename, suffix) {
            return fullmatch.replace(filename, path_1.basename(outFile));
        });
    };
    AMoveFile.prototype.run = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.passThroughFilters(fs_1.createReadStream(this.inFile), filters)];
            });
        });
    };
    return AMoveFile;
}(a_file_action_1.AFileAction));
exports.AMoveFile = AMoveFile;
//# sourceMappingURL=a-move-file.js.map