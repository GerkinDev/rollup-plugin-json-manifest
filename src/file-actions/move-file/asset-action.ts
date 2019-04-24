import { join } from 'path';

import hasha from 'hasha';
import { isString, reject, some } from 'lodash';

import { AMoveFile } from '.';
import { IOptionsPostProcessed } from '../../options';
import { IMoveFile } from '../i-move-file';

export class AssetAction extends AMoveFile {
	public constructor(
		public readonly inFile: string,
		protected readonly hash: string,
		options: IOptionsPostProcessed,
	) {
		super( inFile, hash, options, [ AssetAction.generateFilenameReplaceFilter ] );
	}

	public static async gather(
		options: IOptionsPostProcessed,
		files: string[],
		existingActions: IMoveFile[],
	) {
		const manifestExistingFiles = Object.keys( options.existingManifest );
		const assetsFiles = reject(
			files.filter( file => !file.endsWith( '.map' ) ),
			file => some( existingActions, action => join( options.inDir, file ) === action.inFile ||
				some( manifestExistingFiles, manifestFile => file.endsWith( manifestFile ) ) ) );
		return Promise.all( assetsFiles.map( async filepath => {
			const sourcePath = join( options.inDir, filepath );
			const hash = await hasha.fromFile(
				sourcePath,
				{ algorithm: 'md5' } );
			if ( !isString( hash ) ) {
				throw new Error( `Could not get a hash for file "${filepath}"` );
			}

			return new AssetAction( sourcePath, hash, options );
		} ) );
	}
}
