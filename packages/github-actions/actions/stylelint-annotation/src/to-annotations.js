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
