/**
 * Converts Stylelint result objects to annotation format.
 *
 * @param {Array} failedFiles Stylelint result objects that have warnings.
 * @return {Array} Annotations with command, filePath, and message fields.
 */
export default function toAnnotations( failedFiles ) {
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
