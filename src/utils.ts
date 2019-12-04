import { createWriteStream } from 'fs';
import { dirname } from 'path';

import escapeStringRegexp from 'escape-string-regexp';
import { Dictionary, fromPairs, memoize, toPairs } from 'lodash';
import mkdirp from 'mkdirp';

import { IOptionsPostProcessed } from './options';

export const mapObjectPromise = async <T, T2>(
	obj: Dictionary<T>,
	callback: ( value: T, key: string, obj: Dictionary<T> ) => Promise<T2>,
): Promise<Dictionary<T2>> =>
	fromPairs(
		await Promise.all(
			toPairs( obj )
				.map( async ( [key, value] ) => [key, await callback( value, key, obj )] ) ) );

export const prepareWriteStream = async ( path: string ) => {
	await new Promise<void>( ( res, rej ) => mkdirp( dirname( path ), err => err ? rej( err ) : res() ) );
	return createWriteStream( path );
};

export const resolveNewFilename = memoize( ( filename: string, hash: string, options: IOptionsPostProcessed ) =>
	options
		.filename(
			filename
				.replace(
					new RegExp( `^${escapeStringRegexp( options.inDir )}` ),
					options.outDir,
				),
			hash ) );
