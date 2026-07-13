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
export default function toReport( annotations ) {
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
