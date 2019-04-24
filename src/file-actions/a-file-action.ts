import { createWriteStream } from 'fs';
import { dirname } from 'path';

import { isTextSync } from 'istextorbinary';
import mkdirp from 'mkdirp';
import streamToPromise from 'stream-to-promise';

import { IOptionsPostProcessed } from '../options';

export type TFileFilterFactory = () => NodeJS.ReadWriteStream;
export abstract class AFileAction {
	public get outFile() {
		return this._outFile;
	}
	public get filters() {
		return this._filters.slice();
	}

	public constructor(
		protected readonly options: IOptionsPostProcessed,
		protected readonly _outFile: string,
		protected readonly _filters: TFileFilterFactory[] = [],
	) {}

	protected async prepareOutput() {
		return AFileAction.prepareWriteStream( this._outFile );
	}
	protected static async prepareWriteStream( path: string ) {
		await new Promise<void>( ( res, rej ) => mkdirp( dirname( path ), err => err ? rej( err ) : res() ) );
		return createWriteStream( path );
	}

	public abstract run( filters: Array<() => NodeJS.ReadWriteStream> ): Promise<void>;

	public async passThroughFilters( inputSource: NodeJS.ReadableStream, filters: Array<() => NodeJS.ReadWriteStream> ) {
		const streamFiltered = isTextSync( this.outFile ) ?
			filters.reduce(
				( stream: NodeJS.ReadableStream | NodeJS.ReadWriteStream, filter ) => stream.pipe( filter() ),
				inputSource,
			) :
			inputSource;
		return streamToPromise( streamFiltered.pipe( await this.prepareOutput() ) );
	}
}
