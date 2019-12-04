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
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = require("joi");
var lodash_1 = require("lodash");
var path_1 = require("path");
var joi_extend_1 = require("./joi-extend");
var schemaFor = function (schema) { return joi_extend_1.isObject().keys(schema); };
var pathValidationOptions = { relativeOnly: true };
var filterCriterionSchema = joi_extend_1.alternatives()
    .try(joi_extend_1.isString(), joi_extend_1.isRegex(), joi_extend_1.isArray().items(joi_extend_1.isString()), joi_extend_1.isArray().items(joi_extend_1.isRegex()));
var filterSchema = schemaFor({
    exclude: filterCriterionSchema
        .default([])
        .description('Exclude filter to reject bundles or assets. It is resolved relative to the `inDir` option. Defaults to exclude nothing.'),
    include: filterCriterionSchema
        .default([])
        .description('Include filter to match bundles or assets. It is resolved relative to the `inDir` option. Defaults to include everything.'),
});
var optionsSchema = schemaFor({
    inDir: joi_extend_1.isString()
        .description('Input directory. If not provided, defaults to the `outDir`, so that it simply renames files without moving them.'),
    outDir: joi_extend_1.isString()
        .default(joi_extend_1.ref('inDir'))
        .description('Output directory. It typically is the base directory where rollup outputs its files.'),
    delete: joi_1.boolean()
        .default(true),
    manifest: joi_extend_1.isString()
        .default('manifest.json')
        .description('Relative path and filename of the manifest file.'),
    sourcemapExts: joi_extend_1.isArray()
        .items(joi_extend_1.isString())
        .default(['css', 'js']),
    filename: joi_extend_1.alternatives()
        .try(joi_extend_1.isString()
        .uri(pathValidationOptions)
        .description('The file name pattern'), joi_extend_1.isFunc()
        .arity(2)
        .description('A function returning the filename as a string. Takes 2 parameters: the base file path. and the hash.'))
        .default('[bundle]-[hash].[ext]'),
    assetsFilter: filterSchema.default(),
    bundlesFilter: filterSchema.default(),
}).required();
exports.transformOptions = function (options) {
    var validation = optionsSchema.validate(options);
    if (validation.error) {
        // tslint:disable-next-line: no-console
        console.error(validation.error);
        throw new Error(validation.error.message);
    }
    else {
        // Joi did everything, so returm it as amy¸ which will be casted to IOptionsDefaulted.
        return __assign({}, validation.value, { filename: lodash_1.isFunction(validation.value.filename) ?
                validation.value.filename :
                makeFilenameGenerator(validation.value.filename) });
    }
};
var makeFilenameGenerator = function (pattern) { return function (filename, hash) {
    var ext = filename.replace(/^.*(\.(?:\w+)(?:\.map)?)$/, '$1');
    var bundle = path_1.dirname(filename) + path_1.sep + path_1.basename(filename, ext);
    console.log({ ext: ext, bundle: bundle });
    console.log({ pattern: pattern, ext: ext, bundle: bundle });
    return pattern
        .replace('[bundle]', bundle)
        .replace('[ext]', ext.replace(/^\./, ''))
        .replace('[hash]', hash);
}; };
//# sourceMappingURL=options.js.map