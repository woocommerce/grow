/**
 * External dependencies
 */
import semver from 'semver';

/**
 * Parses a version name and returns its major and minor version names.
 *
 * The version format should be a valid semantic versioning. https://semver.org/
 * The only exception is that there can be a leading 'v'.
 *
 * @param {string} version The version to be parsed. For example, 'v1.2.3-tools'.
 * @return {{majorVersion: string, minorVersion: string} | null}
 *   The payload of major and minor version names.
 *   For example, { majorVersion: 'v1-tools', minorVersion: 'v1.2-tools' }
 *   `null` if the passed-in value is invalid semantic versioning.
 */
export default function parseVersion( version ) {
	// A leading 'v' is stripped off.
	const validVersion = semver.valid( version );

	if ( validVersion === null ) {
		return null;
	}

	const { major, minor, prerelease } = semver.parse( validVersion );
	const numberParts = [ major ];
	const parts = [ numberParts ];

	if ( validVersion !== version ) {
		parts.unshift( 'v' );
	}

	if ( prerelease.length ) {
		// The `prerelease` could be ['beta', '1'], so adds them as 'beta.1' with a leading `-`.
		parts.push( '-', prerelease.join( '.' ) );
	}

	const majorVersion = parts.flat().join( '' );

	numberParts.push( '.', minor );

	const minorVersion = parts.flat().join( '' );

	return {
		majorVersion,
		minorVersion,
	};
}
