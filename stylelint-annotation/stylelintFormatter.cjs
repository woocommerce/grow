'use strict';

var stylelint = require('stylelint');

/**
 * @typedef {Object} Annotation
 * @property {string} command     Annotation command name.
 * @property {string} [message]   Annotation message.
 * @property {string} [filePath]  Path to the associated file.
 * @property {string} [line]      Line number of the associated file, starting at 1.
 * @property {string} [endLine]   End line number of the associated file.
 * @property {string} [column]    Column number of the associated file, starting at 1.
 * @property {string} [endColumn] End column number of the associated file.
 */

function toAnnotationCommand( annotation ) {
	const regex = /([ ,]?\w+=)?\{(\w+)\}/g;
	const template =
		'::{command} file={filePath},line={line},endLine={endLine},col={column},endColumn={endColumn}::{message}';

	return template.replace( regex, ( _, paramGroup = '', key ) => {
		if ( annotation.hasOwnProperty( key ) ) {
			return paramGroup + annotation[ key ];
		}
		return '';
	} );
}

/**
 * Sets annotations onto GitHub Actions by workflow commands.
 *
 * Commonly used workflow commands:
 * - https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
 * - https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-a-warning-message
 * - https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#grouping-log-lines
 *
 * @param {Array<Annotation>} annotations Annotations to be handled.
 */
function annotateByWorkflowCommand( annotations ) {
	if ( annotations.length === 0 ) {
		return;
	}

	// Wrap the command outputs into an expandable group in the GitHub Actions.
	const groupingAnnotations = [
		{ command: 'group', message: 'Annotation commands' },
		...annotations,
		{ command: 'endgroup' },
	];

	groupingAnnotations
		.map( toAnnotationCommand )
		.forEach( ( command ) => console.log( command ) ); // eslint-disable-line no-console
}

/**
 * Converts Stylelint result objects to annotation format.
 *
 * @param {Array} failedFiles Stylelint result objects that have warnings.
 * @return {Array} Annotations with command, filePath, and message fields.
 */
function toAnnotations( failedFiles ) {
	const truncationPath = process.cwd();
	const annotations = [];

	failedFiles.forEach( ( file ) => {
		// Strip the cwd to a repo-root-relative path with no `./` prefix. GitHub only
		// links annotations to a pull request's changed files when the path matches
		// the diff exactly, and a leading `./` prevents that match.
		const filePath = file.source.replace( `${ truncationPath }/`, '' );

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

/**
 * Builds a concise, human-readable report from annotations.
 *
 * stylelint's CLI only sets a non-zero exit code when the formatter returns a
 * non-empty report. An empty report makes it skip that step, letting lint errors
 * pass CI silently. This therefore returns a non-empty string whenever there are
 * problems.
 *
 * @param {Array} annotations Annotation objects from `toAnnotations`.
 * @return {string} Report text, or empty when there are no problems.
 */
function toReport( annotations ) {
	if ( annotations.length === 0 ) {
		return '';
	}

	const linesByFile = new Map();

	annotations.forEach( ( { filePath, line, column, command, message } ) => {
		const lines = linesByFile.get( filePath ) ?? [];
		// `command` holds the severity ('error' or 'warning').
		lines.push( `  ${ line }:${ column }  ${ command }  ${ message }` );
		linesByFile.set( filePath, lines );
	} );

	const blocks = [ ...linesByFile ].map( ( [ filePath, lines ] ) =>
		[ filePath, ...lines ].join( '\n' )
	);

	return `${ blocks.join( '\n\n' ) }\n`;
}

/**
 * External dependencies
 */

// Ref: https://stylelint.io/developer-guide/formatters/
function stylelintFormatter ( results, returnValue ) {
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

module.exports = stylelintFormatter;
