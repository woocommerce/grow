/**
 * External dependencies
 */
import stylelint from 'stylelint'; // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved

/**
 * Internal dependencies
 */
import annotateByWorkflowCommand from '../../../utils/annotate-by-workflow-command.js';
import toAnnotations from './to-annotations.js';
import toReport from './to-report.js';

// Ref: https://stylelint.io/developer-guide/formatters/
export default function ( results, returnValue ) {
	const failedFiles = results.filter( ( { warnings } ) => warnings.length );
	const annotations = toAnnotations( failedFiles );
	annotateByWorkflowCommand( annotations );

	// stylelint >= 16 turned `formatters.string` into a lazy async getter that returns
	// a Promise, whereas <= 15 exposed the formatter function directly. Use it only
	// while it is still a sync function, and otherwise build the report ourselves.
	const builtInStringFormatter = stylelint.formatters.string;
	if ( typeof builtInStringFormatter === 'function' ) {
		return builtInStringFormatter( results, returnValue );
	}

	return toReport( annotations );
}
