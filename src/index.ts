import { OutputOptions, PluginImpl } from 'rollup';
import { createFilter } from 'rollup-pluginutils';

import { readdirSync, readFile } from 'fs';
import { join } from 'path';

import escapeStringRegexp from 'escape-string-regexp';
import { Dictionary, difference, flatMap, isNil, keys } from 'lodash';

import { ABundleAction, AssetAction, ManifestAction } from './file-actions';
import { AFileAction } from './file-actions/a-file-action';
import { IManifest, IOptions, IOptionsPostProcessed, transformOptions } from './options/options';

const guessBundleOutputDir = ( outputOptions: OutputOptions, filename: string ): string => {
	if ( outputOptions.dir ) {
		return outputOptions.dir;
	}
	if ( outputOptions.file ) {
		const determinedOutDir = outputOptions.file.replace( new RegExp( `[\\/]${escapeStringRegexp( `${filename}` )}$` ), '' );
		if ( determinedOutDir === outputOptions.file ) {
			throw new Error( 'Oops, we should have replaced something here' );
		}
		return determinedOutDir;
	}
	throw new Error( "Can't guess the bundle output directory." );
};

const getExistingManifest = async ( manifestPath: string ): Promise<IManifest> => {
	try {
		return await new Promise<IManifest>(
			( res, rej ) => readFile( `./${manifestPath}`, 'utf-8', ( err, content ) => {
				if ( err ) {
					return rej( err );
				} else {
					try {
						return res( JSON.parse( content ) );
					} catch ( e ) {
						return rej( err );
					}
				}
			} ) );
	} catch ( e ) {
		return {};
	}
};

export const jsonManifest: PluginImpl<IOptions> = _options => {
	const options = transformOptions( _options );
	const bundlesFilter = createFilter( options.bundlesFilter.include, options.bundlesFilter.exclude );
	const bundlesRegistry: Dictionary<string> = {};
	let rawFilesOutDir: string;

	return {
		name: 'rollup-plugin-json-manifest',
		generateBundle( bundleOptions, bundle ) {
			Object.entries( bundle )
				// Filter out assets (like CSS)
				.filter( ( [, bundleOutput] ) => !( bundleOutput as any ).isAsset )
				.forEach( ( [bundleName, bundleOutput] ) => {
					if ( bundleName !== bundleOutput.fileName ) {
						throw new Error( 'Unknown situation' );
					}
					const bundleOutputDirGuessed = guessBundleOutputDir( bundleOptions, bundleName );
					const bundleRelativePath = join( bundleOutputDirGuessed, bundleName );
					if ( !bundlesFilter( bundleRelativePath ) ) {
						return;
					}
					if ( !isNil( options.inDir ) && options.inDir !== bundleOutputDirGuessed ) {
						throw new Error( 'Matched a bundle that spawned outside the input directory' );
					}
					if ( !isNil( rawFilesOutDir ) && rawFilesOutDir !== bundleOutputDirGuessed ) {
						throw new Error( 'Incoherent conditions for input directory guessing.' );
					}
					rawFilesOutDir = bundleOutputDirGuessed;
					bundlesRegistry[bundleName] = bundleRelativePath;
				} );
		},
		async writeBundle( ) {
			// If no explicit output is specified, use the same as the input directory and simply rename files.
			const inDir = isNil( options.inDir ) ? rawFilesOutDir : options.inDir;
			const outDir = isNil( options.outDir ) ? rawFilesOutDir : options.outDir;
			const postProcessedOpts: IOptionsPostProcessed = {
				...options,

				existingManifest: await getExistingManifest( join( outDir, options.manifest ) ),
				inDir,
				outDir,
			};
			const outDirFiles = readdirSync( rawFilesOutDir );

			// Check if the outDir contains all bundle files
			const missingBundles = difference( keys( bundlesRegistry ), outDirFiles );
			if ( missingBundles.length !== 0 ) {
				throw new Error( `Missing expected files ${JSON.stringify( missingBundles )}` );
			}

			const bundlesActions = await ABundleAction.gather( postProcessedOpts, outDirFiles, bundlesRegistry );
			const assetsActions = await AssetAction.gather( postProcessedOpts, outDirFiles, bundlesActions );

			const actions: AFileAction[] = [
				...bundlesActions,
				...assetsActions,
			];
			const actionsWithManifest = [
				...actions,
				...ManifestAction.gather( postProcessedOpts, actions ),
			];

			const allFilters = flatMap( actionsWithManifest, action => action.filters );
			await Promise.all( actionsWithManifest.map( action => action.run( allFilters ) ) );
		},
	};
};
