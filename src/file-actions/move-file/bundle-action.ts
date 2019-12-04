import { dirname, join } from 'path';

import hasha from 'hasha';
import { compact, Dictionary, flatten, isString, toPairs } from 'lodash';

import { AMoveFile, FileBundleAction, SourcemapBundleAction } from '.';
import { IOptionsPostProcessed } from '../../options';

export abstract class ABundleAction extends AMoveFile {
	public static async gather(
		options: IOptionsPostProcessed,
		files: string[],
		bundles: Dictionary<string>,
	) {
		return flatten( await Promise.all( toPairs( bundles ).map( async ( [filename, filepath] ) => {
			const sourcemapFile = files.find( file => file === `${filename}.map` );

			const sourcemapPath = isString( sourcemapFile ) ? join( dirname( filepath ), sourcemapFile ) : undefined;

			const hash = await hasha.fromFile( filepath, { algorithm: 'md5' } );
			if ( !isString( hash ) ) {
				throw new Error( `Could not get a hash for file "${filepath}"` );
			}

			return compact( [
				new FileBundleAction( filepath, hash, options ),
				isString( sourcemapPath ) ? new SourcemapBundleAction( sourcemapPath, hash, options ) : undefined,
			] );
		} ) ) );
	}
}
