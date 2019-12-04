"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
var lodash_1 = require("lodash");
var mkdirp_1 = __importDefault(require("mkdirp"));
exports.mapObjectPromise = function (obj, callback) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = lodash_1.fromPairs;
                return [4 /*yield*/, Promise.all(lodash_1.toPairs(obj)
                        .map(function (_a) {
                        var _b = __read(_a, 2), key = _b[0], value = _b[1];
                        return __awaiter(_this, void 0, void 0, function () { var _c; return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _c = [key];
                                    return [4 /*yield*/, callback(value, key, obj)];
                                case 1: return [2 /*return*/, _c.concat([_d.sent()])];
                            }
                        }); });
                    }))];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    });
}); };
exports.prepareWriteStream = function (path) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (res, rej) { return mkdirp_1.default(path_1.dirname(path), function (err) { return err ? rej(err) : res(); }); })];
            case 1:
                _a.sent();
                return [2 /*return*/, fs_1.createWriteStream(path)];
        }
    });
}); };
exports.resolveNewFilename = lodash_1.memoize(function (filename, hash, options) {
    return options
        .filename(filename
        .replace(new RegExp("^" + escape_string_regexp_1.default(options.inDir)), options.outDir), hash);
});
//# sourceMappingURL=utils.js.map