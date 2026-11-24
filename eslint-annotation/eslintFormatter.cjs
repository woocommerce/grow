'use strict';

var node_module = require('node:module');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/**
 * External dependencies
 */

/**
 * Loads a package of the caller repo, like `eslint` or `stylelint`, for a formatter
 * script that is copied into the caller repo.
 *
 * It first resolves the package from the formatter file. When that fails, it resolves
 * it from the running CLI script. With pnpm's default layout, a package that is only
 * a transitive dependency (for example eslint under `@wordpress/scripts`) is not
 * linked in the repo root, but the CLI script is a file inside that package.
 *
 * @param {string} name         Package name.
 * @param {string} formatterUrl URL or path of the formatter file.
 * @param {string} [cliPath]    Path of the running CLI script. Defaults to `process.argv[ 1 ]`.
 * @return {*} The exports of the package.
 */
function requireFromCaller(
	name,
	formatterUrl,
	cliPath = process.argv[ 1 ]
) {
	try {
		return node_module.createRequire( formatterUrl )( name );
	} catch ( error ) {
		if ( error.code !== 'MODULE_NOT_FOUND' ) {
			throw error;
		}

		try {
			return node_module.createRequire( cliPath )( name );
		} catch {
			throw error;
		}
	}
}

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
 * Converts ESLint result objects to annotation format.
 *
 * @param {Array} failedFiles ESLint result objects that have errors or warnings.
 * @return {Array} Annotations with command, filePath, and message fields.
 */
function toAnnotations( failedFiles ) {
	const truncationPath = process.cwd();
	const annotations = [];

	failedFiles.forEach( ( file ) => {
		// Strip the cwd to a repo-root-relative path with no `./` prefix. GitHub only
		// links annotations to a pull request's changed files when the path matches
		// the diff exactly, and a leading `./` prevents that match.
		const filePath = file.filePath.replace( `${ truncationPath }/`, '' );

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

/**
 * Internal dependencies
 */

const { ESLint } = requireFromCaller( 'eslint', (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('eslintFormatter.cjs', document.baseURI).href)) );

// Ref: https://eslint.org/docs/developer-guide/working-with-custom-formatters
function eslintFormatter ( results, context ) {
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

module.exports = eslintFormatter;
