/**
 * External dependencies
 */
import path from 'path';
import fs from 'fs';

/**
 * Gets the settings of package.json
 *
 * @param {string} workspace The working directory on the job runner in GitHub actions for steps. Usually, it's an environment variable that can be accessed by the variable name `GITHUB_WORKSPACE`.
 * @param {string} packageDir The path to the directory containing the package.json.
 * @return {Object} The parsed JSON content of package settings.
 * @throws {Error} Will throw an error if the package.json does not exist.
 */
export default function getPackageSettings( workspace, packageDir ) {
	const filePath = path.join( workspace, packageDir, 'package.json' );

	if ( ! fs.existsSync( filePath ) ) {
		throw new Error(
			`The specified package.json file at: ${ filePath } does not exist.`
		);
	}

	const content = fs.readFileSync( filePath, 'utf8' );
	return JSON.parse( content );
}
