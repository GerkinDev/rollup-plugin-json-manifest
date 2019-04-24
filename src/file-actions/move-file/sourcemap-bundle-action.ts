import { ABundleAction } from '.';
import { IOptionsPostProcessed } from '../../options';

export class SourcemapBundleAction extends ABundleAction {
	public constructor(
		inFile: string,
		hash: string,
		options: IOptionsPostProcessed,
	) {
		super( inFile, hash, options, [] );
	}
}
