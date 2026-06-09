/**
 * Converts PHPCS report file entries to annotation format.
 *
 * @param {Object} reportFiles PHPCS report files object keyed by file path.
 * @return {Array} Annotations with command, filePath, line, and message fields.
 */
export default function toAnnotations( reportFiles ) {
	const entries = Object.entries( reportFiles );
	const annotations = [];

	entries.forEach( ( [ filePath, metadata ] ) => {
		metadata.messages.forEach( ( { line, message } ) => {
			// The `coverageChecker` package doesn't output warnings by default,
			// and warnings are treated as errors in its strict mode.
			// So all messages can only be transformed as error annotations here.
			annotations.push( {
				command: 'error',
				filePath: `./${ filePath }`,
				line,
				message,
			} );
		} );
	} );

	return annotations;
}
