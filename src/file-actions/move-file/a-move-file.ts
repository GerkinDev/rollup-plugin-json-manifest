import { createReadStream, ReadStream } from 'fs';
import { basename, dirname } from 'path';

import escapeStringRegexp from 'escape-string-regexp';
import { isNil, isString } from 'lodash';
import streamReplace from 'stream-replace';
import streamToPromise from 'stream-to-promise';

import { IOptionsPostProcessed } from '../../options';
import { resolveNewFilename } from '../../utils';
import { AFileAction, TFileFilterFactory } from '../a-file-action';
import { IMoveFile } from '../i-move-file';

export abstract class AMoveFile extends AFileAction implements IMoveFile {
	public constructor(
		public readonly inFile: string,
		protected readonly hash: string,
		options: IOptionsPostProcessed,
		filters: Array<TFileFilterFactory | typeof AMoveFile.generateFilenameReplaceFilter> = [],
	) {
		super(
			options,
			resolveNewFilename( inFile, hash, options ),
			filters
				.map( filter => filter === AMoveFile.generateFilenameReplaceFilter ?
					( () => filter( this ) ) :
					filter as TFileFilterFactory ) );
	}

	public static generateFilenameReplaceFilter( file: IMoveFile ): NodeJS.ReadWriteStream;
	public static generateFilenameReplaceFilter( inFile: string, outFile: string ): NodeJS.ReadWriteStream;
	public static generateFilenameReplaceFilter( file: IMoveFile | string, _outFile?: string ): NodeJS.ReadWriteStream {
			const { inFile, outFile } = isString( file ) ? { inFile: file, outFile: _outFile } : file;
			if ( isNil( inFile ) || isNil( outFile ) ) {
				throw new Error();
			}
			const originalSegments = dirname( inFile ).split( '/' );
			const pathRegex = originalSegments
				.map( s => escapeStringRegexp( s ) )
				.reduce( ( acc, s ) => acc ?
					`(?:${acc}\\/)?${s}` :
					s );
			const replaceFileRegex = new RegExp( `(\\W|^)(${pathRegex}\\/)?(${escapeStringRegexp( basename( inFile ) )})(\\W|$)`, 'g' );
			return streamReplace(
				replaceFileRegex,
				( fullmatch: string, prefix: string, path: string, filename: string, suffix: string ) =>
					fullmatch.replace( filename, basename( outFile ) ),
			);
	}

	public async run( filters: Array<() => NodeJS.ReadWriteStream> ) {
		return this.passThroughFilters( createReadStream( this.inFile ), filters );
	}
}
