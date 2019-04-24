import { basename, dirname, sep } from 'path';

import { AnySchema, SchemaMap, UriOptions, ValidationResult } from 'joi';
import { isFunction } from 'lodash';

import { alternatives, isArray, isBoolean, isFunc, isObject, isRegex, isString, ref } from './joi-extend';

export type TFilter = Array<string | RegExp> | string | RegExp | null | undefined;
export type TFilenameGenerator = ( filename: string, hash: string ) => string;
export interface IFilter {
	include?: TFilter;
	exclude?: TFilter;
}
export interface IOptions {
	/**
	 * Input directory. If not provided, defaults to the `outDir`, so that it simply renames files without moving them.
	 */
	inDir?: string;
	/**
	 * Output directory. It typically is the base directory where rollup outputs its files.
	 */
	outDir?: string;
	/**
	 * Relative path and filename of the manifest file.
	 */
	manifest?: string;
	filename?: string | TFilenameGenerator;
	sourcemapExts?: string[];
	delete?: boolean;

	/**
	 * Filter describing the assets to handle. Assets are non-js files.
	 */
	assetsFilter?: IFilter;
	/**
	 * Filter describing the bundles to handle.
	 */
	bundlesFilter?: IFilter;
}
export interface IOptionsDefaulted extends IOptions {
	manifest: string;
	filename: TFilenameGenerator;
	sourcemapExts: string[];
	delete: boolean;
	assetsFilter: IFilter;
	bundlesFilter: IFilter;
}
export interface IOptionsPostProcessed extends IOptionsDefaulted {
	inDir: string;
	outDir: string;
	existingManifest: IManifest;
}
export interface IManifest {
	[key: string]: string;
}

const schemaFor = <T extends {}>( schema: SchemaMap & {[key in keyof T]: AnySchema} ) => isObject().keys( schema );
const pathValidationOptions: UriOptions = { relativeOnly: true };
const filterCriterionSchema = alternatives()
	.try(
		isString(),
		isRegex(),
		isArray().items( isString() ),
		isArray().items( isRegex() ),
	);
const filterSchema = schemaFor<IFilter>( {
	exclude: filterCriterionSchema
		.default( [] )
		.description( 'Exclude filter to reject bundles or assets. It is resolved relative to the `inDir` option. Defaults to exclude nothing.' ),
	include: filterCriterionSchema
		.default( [] )
		.description( 'Include filter to match bundles or assets. It is resolved relative to the `inDir` option. Defaults to include everything.' ),
} );

const optionsSchema = schemaFor<IOptions>( {
		inDir: isString()
			.description( 'Input directory. If not provided, defaults to the `outDir`, so that it simply renames files without moving them.' ),
		outDir: isString()
			.default( ref( 'inDir' ) )
			.description( 'Output directory. It typically is the base directory where rollup outputs its files.' ),

		delete: isBoolean()
			.default( true ),
		manifest: isString()
			.default( 'manifest.json' )
			.description( 'Relative path and filename of the manifest file.' ),
		sourcemapExts: isArray()
			.items( isString() )
			.default( ['css', 'js'] ),

		filename: alternatives()
			.try(
				isString()
					.uri( pathValidationOptions )
					.description( 'The file name pattern' ),
				isFunc()
					.arity( 2 )
					.description( 'A function returning the filename as a string. Takes 2 parameters: the base file path. and the hash.' ) )
					.default( '[bundle]-[hash].[ext]' ),

		assetsFilter: filterSchema.default(),
		bundlesFilter: filterSchema.default(),
	} ).required();

type TOmit<T, K extends keyof T> =
	Pick<T, Exclude<keyof T, K>>;

export const transformOptions = ( options: IOptions | undefined ): IOptionsDefaulted => {
			const validation = optionsSchema.validate( options ) as ValidationResult<
				TOmit<IOptionsDefaulted, 'filename'> & {filename: string | TFilenameGenerator}
			>;
			if ( validation.error ) {
				// tslint:disable-next-line: no-console
				console.error( validation.error );
				throw new Error( validation.error.message );
			} else {
				// Joi did everything, so returm it as amy¸ which will be casted to IOptionsDefaulted.
				return {
					...validation.value,

					filename: isFunction( validation.value.filename ) ?
						validation.value.filename :
						makeFilenameGenerator( validation.value.filename ),
				};
			}
		};

const makeFilenameGenerator = ( pattern: string ): TFilenameGenerator => ( filename: string, hash: string ): string => {
	const ext = filename.replace( /^.*(\.(?:\w+)(?:\.map)?)$/, '$1' );
	const bundle = dirname( filename ) + sep + basename( filename, ext );
	return pattern
		.replace( '[bundle]', bundle )
		.replace( '[ext]', ext.replace( /^\./, '' ) )
		.replace( '[hash]', hash );
};
