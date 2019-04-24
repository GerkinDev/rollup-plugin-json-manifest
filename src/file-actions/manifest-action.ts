import { join, relative } from 'path';
import { Readable } from 'stream';

import streamToPromise from 'stream-to-promise';

import { IOptionsPostProcessed } from '../options';
import { AFileAction } from './a-file-action';
import { AssetAction, FileBundleAction } from './move-file';

const filterInstanceof = <TIn, TOut extends TIn>( list: TIn[], type: new ( ...args: any[] ) => TOut ): TOut[] =>
	list.filter( item => item instanceof type ) as any[];
export class ManifestAction extends AFileAction {
	protected readonly bundles: FileBundleAction[];
	protected readonly assets: AssetAction[];

	public constructor( options: IOptionsPostProcessed, actions: AFileAction[] ) {
		super( options, join( options.outDir, options.manifest ) );
		this.bundles = filterInstanceof( actions, FileBundleAction );
		this.assets = filterInstanceof( actions, AssetAction );
	}

	public async run( filters: Array<() => NodeJS.ReadWriteStream> ): Promise<void> {
		const content = this.bundles.concat( this.assets )
			.reduce( ( acc, bundle ) => {
				const inRel = relative( this.options.inDir, bundle.inFile );
				const outRel = relative( this.options.outDir, bundle.outFile );
				acc[inRel] = outRel;
				return acc;
			},       this.options.existingManifest );

		const manifestStream = new Readable();
		manifestStream.push( JSON.stringify( content, null, 4 ) );
		manifestStream.push( null );
		return this.passThroughFilters( manifestStream, [] );
	}
}
