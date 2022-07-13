/**
 * External dependencies
 */
import { ESLint } from 'eslint';

/**
 * Internal dependencies
 */
import annotateByWorkflowCommand from '../../../utils/annotate-by-workflow-command.js';

function toAnnotations( failedFiles ) {
	const truncationPath = process.cwd();
	const annotations = [];

	failedFiles.forEach( ( file ) => {
		const filePath = file.filePath.replace( truncationPath, '.' );

		file.messages.forEach( ( lintError ) => {
			const { severity, ruleId, message } = lintError;

			// About the `severity` value: https://eslint.org/docs/user-guide/formatters/#json
			annotations.push( {
				...lintError,
				command: severity === 2 ? 'error' : 'warning',
				filePath,
				message: `[${ ruleId }] ${ message }`,
			} );
		} );
	} );

	return annotations;
}

// Ref: https://eslint.org/docs/developer-guide/working-with-custom-formatters
export default function ( results, context ) {
	const failedFiles = results.filter(
		( { errorCount, warningCount } ) => errorCount || warningCount
	);
	const annotations = toAnnotations( failedFiles );
	annotateByWorkflowCommand( annotations );

	// Try to still output the original CLI logs by default format.
	try {
		const major = Number( ESLint.version.split( '.', 1 ).pop() );
		const promise = new ESLint().loadFormatter().then( ( formatter ) => {
			return formatter.format( results, context );
		} );

		// The eslint version less than 8 doesn't support running formatter in async.
		if ( major < 8 ) {
			promise.then( ( report ) => console.log( report ) ); // eslint-disable-line no-console
			return '';
		}
		return promise;
	} catch ( e ) {
		// No-op.
	}
}
