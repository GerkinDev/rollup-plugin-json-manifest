"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var rollup_pluginutils_1 = require("rollup-pluginutils");
var fs_1 = require("fs");
var path_1 = require("path");
var escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
var lodash_1 = require("lodash");
var file_actions_1 = require("./file-actions");
var options_1 = require("./options/options");
var guessBundleOutputDir = function (outputOptions, filename) {
    if (outputOptions.dir) {
        return outputOptions.dir;
    }
    if (outputOptions.file) {
        var determinedOutDir = outputOptions.file.replace(new RegExp("[\\/]" + escape_string_regexp_1.default("" + filename) + "$"), '');
        if (determinedOutDir === outputOptions.file) {
            throw new Error('Oops, we should have replaced something here');
        }
        return determinedOutDir;
    }
    throw new Error("Can't guess the bundle output directory.");
};
var getExistingManifest = function (manifestPath) { return __awaiter(_this, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new Promise(function (res, rej) { return fs_1.readFile("./" + manifestPath, 'utf-8', function (err, content) {
                        if (err) {
                            return rej(err);
                        }
                        else {
                            try {
                                return res(JSON.parse(content));
                            }
                            catch (e) {
                                return rej(err);
                            }
                        }
                    }); })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, {}];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.jsonManifest = function (_options) {
    var options = options_1.transformOptions(_options);
    var bundlesFilter = rollup_pluginutils_1.createFilter(options.bundlesFilter.include, options.bundlesFilter.exclude);
    var bundlesRegistry = {};
    var rawFilesOutDir;
    return {
        name: 'rollup-plugin-json-manifest',
        generateBundle: function (bundleOptions, bundle) {
            Object.entries(bundle)
                // Filter out assets (like CSS)
                .filter(function (_a) {
                var _b = __read(_a, 2), bundleOutput = _b[1];
                return !bundleOutput.isAsset;
            })
                .forEach(function (_a) {
                var _b = __read(_a, 2), bundleName = _b[0], bundleOutput = _b[1];
                if (bundleName !== bundleOutput.fileName) {
                    throw new Error('Unknown situation');
                }
                var bundleOutputDirGuessed = guessBundleOutputDir(bundleOptions, bundleName);
                var bundleRelativePath = path_1.join(bundleOutputDirGuessed, bundleName);
                if (!bundlesFilter(bundleRelativePath)) {
                    return;
                }
                if (!lodash_1.isNil(options.inDir) && options.inDir !== bundleOutputDirGuessed) {
                    throw new Error('Matched a bundle that spawned outside the input directory');
                }
                if (!lodash_1.isNil(rawFilesOutDir) && rawFilesOutDir !== bundleOutputDirGuessed) {
                    throw new Error('Incoherent conditions for input directory guessing.');
                }
                rawFilesOutDir = bundleOutputDirGuessed;
                bundlesRegistry[bundleName] = bundleRelativePath;
            });
        },
        writeBundle: function () {
            return __awaiter(this, void 0, void 0, function () {
                var inDir, outDir, postProcessedOpts, _a, _b, outDirFiles, missingBundles, bundlesActions, assetsActions, actions, actionsWithManifest, allFilters;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            inDir = lodash_1.isNil(options.inDir) ? rawFilesOutDir : options.inDir;
                            outDir = lodash_1.isNil(options.outDir) ? rawFilesOutDir : options.outDir;
                            _a = [{}, options];
                            _b = {};
                            return [4 /*yield*/, getExistingManifest(path_1.join(outDir, options.manifest))];
                        case 1:
                            postProcessedOpts = __assign.apply(void 0, _a.concat([(_b.existingManifest = _c.sent(), _b.inDir = inDir, _b.outDir = outDir, _b)]));
                            outDirFiles = fs_1.readdirSync(rawFilesOutDir);
                            missingBundles = lodash_1.difference(lodash_1.keys(bundlesRegistry), outDirFiles);
                            if (missingBundles.length !== 0) {
                                throw new Error("Missing expected files " + JSON.stringify(missingBundles));
                            }
                            return [4 /*yield*/, file_actions_1.ABundleAction.gather(postProcessedOpts, outDirFiles, bundlesRegistry)];
                        case 2:
                            bundlesActions = _c.sent();
                            return [4 /*yield*/, file_actions_1.AssetAction.gather(postProcessedOpts, outDirFiles, bundlesActions)];
                        case 3:
                            assetsActions = _c.sent();
                            actions = __spread(bundlesActions, assetsActions);
                            actionsWithManifest = __spread(actions, file_actions_1.ManifestAction.gather(postProcessedOpts, actions));
                            allFilters = lodash_1.flatMap(actionsWithManifest, function (action) { return action.filters; });
                            return [4 /*yield*/, Promise.all(actionsWithManifest.map(function (action) { return action.run(allFilters); }))];
                        case 4:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    };
};
//# sourceMappingURL=index.js.map