/**
 * External dependencies
 */
import stylelint from 'stylelint'; // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved

/**
 * Internal dependencies
 */
import annotateByWorkflowCommand from '../../../utils/annotate-by-workflow-command.js';
import toAnnotations from './to-annotations.js';

// Ref: https://stylelint.io/developer-guide/formatters/
export default function ( results, returnValue ) {
	const failedFiles = results.filter( ( { warnings } ) => warnings.length );
	const annotations = toAnnotations( failedFiles );
	annotateByWorkflowCommand( annotations );

	// Try to still output the original CLI logs by default format.
	try {
		return stylelint.formatters.string( results, returnValue );
	} catch ( e ) {
		// No-op.
	}
}
