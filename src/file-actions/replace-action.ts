import { promises as fs } from 'fs';

import { AFileAction, TFileFilterFactory } from './a-file-action';

export class ReplaceAction extends AFileAction {
	/**
	 * This action bufferize the file, so that rewrite operation won't cause any trouble.
	 */
	public async run( filters: TFileFilterFactory[] ): Promise<void> {
		const content = await fs.readFile( this.outFile, 'utf-8' );
		return this.passThroughFilters(
			ReplaceAction.createReadStreamFromString( content ),
			filters );
	}
}
