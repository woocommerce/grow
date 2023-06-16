/**
 * External dependencies
 */
import stylelint from 'stylelint';

/**
 * Internal dependencies
 */
import annotateByWorkflowCommand from '../../../utils/annotate-by-workflow-command.js';

function toAnnotations( failedFiles ) {
	const truncationPath = process.cwd();
	const annotations = [];

	failedFiles.forEach( ( file ) => {
		const filePath = file.source.replace( truncationPath, '.' );

		file.warnings.forEach( ( lintError ) => {
			const { severity, line, column, text } = lintError;

			annotations.push( {
				command: severity,
				filePath,
				line,
				column,
				message: text,
			} );
		} );
	} );

	return annotations;
}

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
