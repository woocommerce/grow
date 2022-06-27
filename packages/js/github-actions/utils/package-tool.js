/**
 * External dependencies
 */
import path from 'path';
import fs from 'fs';

/**
 * Class operates a package in this repository.
 */
export default class PackageTool {
	/**
	 * Create a PackageTool instance.
	 *
	 * @param {string} packageDir The path to the root directory of a package in this repository.
	 * @param {string} [workspace=process.env.GITHUB_WORKSPACE] The working directory on the job runner in GitHub actions for steps. Usually, it's an environment variable that can be accessed by the variable name `GITHUB_WORKSPACE` or the context `github.workspace`.
	 */
	constructor( packageDir, workspace = process?.env.GITHUB_WORKSPACE ) {
		this.base = path.join( workspace, packageDir );
	}

	/**
	 * Gets a file content from the repository.
	 *
	 * @param {string} relativeFilePath The relative path to a file.
	 * @return {string} The file content.
	 * @throws {Error} Will throw an error if the file does not exist.
	 */
	getFile( relativeFilePath ) {
		const filePath = path.join( this.base, relativeFilePath );

		if ( ! fs.existsSync( filePath ) ) {
			const filename = path.basename( filePath );
			throw new Error(
				`The specified ${ filename } file at: ${ filePath } does not exist.`
			);
		}

		return fs.readFileSync( filePath, 'utf8' );
	}

	/**
	 * Gets the settings of package.json.
	 *
	 * @return {Object} The parsed JSON content of package settings.
	 * @throws {Error} Will throw an error if the package.json does not exist.
	 */
	getSettings() {
		return JSON.parse( this.getFile( 'package.json' ) );
	}
}
