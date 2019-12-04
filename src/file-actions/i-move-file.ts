import { isString } from 'lodash';

export interface IMoveFile {
	readonly inFile: string;
	readonly outFile: string;
}

export const isIMoveFile = ( action: any ): action is IMoveFile =>
	isString( action.inFile ) && isString( action.outFile );
