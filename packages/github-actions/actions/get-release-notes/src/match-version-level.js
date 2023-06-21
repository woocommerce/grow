/**
 * Separates keywords by commas, trims for each keyword, and clears the empty items.
 *
 * @param {string} keywords The string of version keywords that separated by commas.
 * @return {Array<string>} The array of parsed keywords.
 */
function parseKeywords( keywords ) {
	return keywords.split( /\s*,\s*/ ).filter( Boolean );
}

/**
 * Matches a version level with keywords regardless of case.
 * The version pattern used is semantic versioning.
 *
 * The matching priority is 'major', 'minor', and 'patch'.
 * Once any of headings (`###`) in release notes has a single word
 * starting with the same keyword, the match level is returned.
 * If both major and minor cannot be matched, 'patch' will be returned.
 *
 * @param {string} notesContent  The content of release notes got from GitHub.
 * @param {string} majorKeywords The string of major level keywords that separated by commas. For example, 'breaking, brand new'.
 * @param {string} minorKeywords The string of minor level keywords that separated by commas. For example, 'feature, enhancement'.
 * @return {'major'|'minor'|'patch'} The matched version level.
 */
export default function matchVersionLevel(
	notesContent,
	majorKeywords,
	minorKeywords
) {
	const headings = [];
	notesContent.replace( /^### (.+)/gm, ( _, el ) => headings.push( el ) );

	const headingContent = headings.join( '\n' );
	const levels = [
		[ 'major', parseKeywords( majorKeywords ) ],
		[ 'minor', parseKeywords( minorKeywords ) ],
		[ 'patch', [ '|' ] ], // Match all includes empty string.
	];

	return levels
		.find( ( [ , keywords ] ) => {
			const pattern = keywords.join( '|' ).replace( /^|\|/g, '$&\\b' );
			const regex = new RegExp( pattern, 'i' );
			return regex.test( headingContent );
		} )
		.shift();
}
