import { ABundleAction } from '.';
import { IOptionsPostProcessed } from '../../options';

export class FileBundleAction extends ABundleAction {
	public constructor(
		inFile: string,
		hash: string,
		options: IOptionsPostProcessed,
	) {
		super(
			inFile,
			hash,
			options,
			[ FileBundleAction.generateFilenameReplaceFilter ],
		);
	}
}
