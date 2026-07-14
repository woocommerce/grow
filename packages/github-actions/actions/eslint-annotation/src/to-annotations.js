/**
 * Converts ESLint result objects to annotation format.
 *
 * @param {Array} failedFiles ESLint result objects that have errors or warnings.
 * @return {Array} Annotations with command, filePath, and message fields.
 */
export default function toAnnotations( failedFiles ) {
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
