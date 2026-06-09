/**
 * Extracts the "What's Changed" section from release notes content.
 *
 * @param {string} notesContent The content of release notes from GitHub.
 * @return {string} The changelog content, or empty string if not found.
 */
export function parseChangelog( notesContent ) {
	const matched = notesContent.match(
		/## What's Changed\n([\d\D]+?)(?=\n\n)/i
	);
	if ( matched ) {
		return matched[ 1 ];
	}
	return '';
}

/**
 * Escapes single quotes for safe use in shell commands.
 *
 * @param {string} text The text to escape.
 * @return {string} The escaped text.
 */
export function escapeSingleQuote( text ) {
	return text.replace( /'/g, `'"'"'` );
}
