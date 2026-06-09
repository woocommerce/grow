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
import toAnnotations from './to-annotations.js';

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
