/**
 * External dependencies
 */
import semver from 'semver';

/**
 * Parses a version name and returns its major and minor version names.
 * The pattern of version name is `{prefix}-{version}`.
 * - The format of `{prefix}` should be lowercase alphanumeric and hyphen characters,
 *   but not leading with numbers and not continuous hyphens.
 * - The format of `{version}` should be valid semantic versioning (https://semver.org/),
 *   and the only exception is there can be a leading 'v' in `{version}`.
 *
 * For example:
 * - tools-1.2.3
 * - tools-v1.2.3
 * - tools-v1.2.3-pre
 * - ipv6-tools-v1.2.3
 * - ipv6-tools-v1.2.3-beta.0
 *
 * @param {string} version The version to be parsed. For example, 'tools-v1.2.3'.
 * @return {{majorVersion: string, minorVersion: string} | null}
 *   The payload of major and minor version names.
 *   For example, { majorVersion: 'tools-v1', minorVersion: 'tools-v1.2' }
 *   `null` if the passed-in value doesn't match the pattern pattern.
 */
export default function parseVersion( version ) {
	const versionRegex = /^([a-z][a-z\d]*(?:-[a-z\d]+)*-)?(v)?(.+)$/;
	const matched = version.match( versionRegex ) || [];
	const [ , prefix, leadingV, semVersion ] = matched;

	if ( semver.valid( semVersion ) === null ) {
		return null;
	}

	const { major, minor, prerelease } = semver.parse( semVersion );
	const numberParts = [];

	const parts = [
		prefix,
		leadingV,
		numberParts,
		// The `prerelease` could be ['beta', '1'], so adds them as 'beta.1' with a leading `-`.
		prerelease.length && [ '-', prerelease.join( '.' ) ],
	].filter( Boolean );

	numberParts.push( major );
	const majorVersion = parts.flat().join( '' );

	numberParts.push( '.', minor );
	const minorVersion = parts.flat().join( '' );

	return {
		majorVersion,
		minorVersion,
	};
}
