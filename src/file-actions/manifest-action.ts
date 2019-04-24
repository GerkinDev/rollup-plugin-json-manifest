import { join, relative, resolve } from 'path';

import { isTextSync } from 'istextorbinary';
import { toPairs, values } from 'lodash';

import { IOptionsPostProcessed } from '../options';
import { AFileAction, TFileFilterFactory } from './a-file-action';
import { isIMoveFile } from './i-move-file';
import { AMoveFile, AssetAction, FileBundleAction } from './move-file';
import { ReplaceAction } from './replace-action';

const filterInstanceof = <TIn, TOut extends TIn>( list: TIn[], type: new ( ...args: any[] ) => TOut ): TOut[] =>
	list.filter( item => item instanceof type ) as any[];
export class ManifestAction extends AFileAction {
	protected readonly bundles: FileBundleAction[];
	protected readonly assets: AssetAction[];

	public constructor( options: IOptionsPostProcessed, actions: AFileAction[], filters: TFileFilterFactory[] ) {
		super( options, join( options.outDir, options.manifest ), filters );
		this.bundles = filterInstanceof( actions, FileBundleAction );
		this.assets = filterInstanceof( actions, AssetAction );
	}

	public static gather(
		options: IOptionsPostProcessed,
		actions: AFileAction[],
	) {
		// Omit currently rewriting assets
		const assetsToKeep = toPairs( options.existingManifest )
			.filter( ( [identifier] ) =>
				!actions.some( action =>
					isIMoveFile( action ) && action.inFile.endsWith( identifier ) ) );

		// Recreate filters
		const filtersFromExistingFiles: TFileFilterFactory[] = assetsToKeep.map( ( [identifier, name] ) =>
			() => AMoveFile.generateFilenameReplaceFilter( identifier, name ) );

		const existingFilesToReFilter = assetsToKeep
			.map( ( [, filename] ) => filename )
			// Resolve the file relative to the output directory
			.map( file => resolve( options.outDir, file ) )
			// Performe replace only in text files (to avoid useless rewrite)
			.filter( file => isTextSync( file ) )
			.map( file => new ReplaceAction( options, file ) );
		return [
			...existingFilesToReFilter,
			new this( options, actions, filtersFromExistingFiles ),
		];
	}

	public async run( filters: TFileFilterFactory[] ): Promise<void> {
		const content = this.bundles.concat( this.assets )
			.reduce( ( acc, bundle ) => {
				const inRel = relative( this.options.inDir, bundle.inFile );
				const outRel = relative( this.options.outDir, bundle.outFile );
				acc[inRel] = outRel;
				return acc;
			},       this.options.existingManifest );

		return this.passThroughFilters(
			ManifestAction.createReadStreamFromString( JSON.stringify( content, null, 4 ) ),
			[] );
	}
}
