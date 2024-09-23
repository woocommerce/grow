/**
 * External dependencies
 */
import fs from 'node:fs';
import { argv } from 'node:process';

/**
 * Internal dependencies
 */
import annotateByWorkflowCommand from '../../../utils/annotate-by-workflow-command.js';
import handleActionErrors from '../../../utils/handle-action-errors.js';

function toAnnotations( reportFiles ) {
	const entries = Object.entries( reportFiles );
	const annotations = [];

	entries.forEach( ( [ filePath, metadata ] ) => {
		metadata.messages.forEach( ( { line, message } ) => {
			// The `coverageChecker` package doesn't output warnings by default,
			// and warnings are treated as errors in its strict mode.
			// So all messages can only be transformed as error annotations here.
			annotations.push( {
				command: 'error',
				filePath: `./${ filePath }`,
				line,
				message,
			} );
		} );
	} );

	return annotations;
}

/**
 * Sets errors in the PHPCS as annotations onto GitHub Actions.
 * Pass the PHPCS report in JSON format with the first argument:
 * `node annotate-phpcs-report.js path-to-report.json`.
 */
async function annotatePhpcsReport() {
	const reportFilePath = argv[ 2 ];
	const jsonReport = fs.readFileSync( reportFilePath, 'utf8' );
	const report = JSON.parse( jsonReport );
	const annotations = toAnnotations( report.files );

	annotateByWorkflowCommand( annotations );
}

// Start running this action.
annotatePhpcsReport().catch( handleActionErrors );
