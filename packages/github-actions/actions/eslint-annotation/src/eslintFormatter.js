/**
 * External dependencies
 */
import { ESLint } from 'eslint'; // eslint-disable-line import/no-extraneous-dependencies

/**
 * Internal dependencies
 */
import annotateByWorkflowCommand from '../../../utils/annotate-by-workflow-command.js';
import toAnnotations from './to-annotations.js';

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
