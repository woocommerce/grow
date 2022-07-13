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
	 * @param {string} packageDir                               The path to the root directory of a package in this repository.
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

	/**
	 * Gets the heading and content of a specific version of the changelog.
	 *
	 * @param {string} version                            The version of changelog be obtained. For example, '1.4.7'.
	 * @param {string} [changelogFilePath='CHANGELOG.md'] The relative path to the changelog file.
	 * @return {{version: string, heading: string, content: string}} The version, heading and content of the specified version.
	 */
	getChangelogByVersion( version, changelogFilePath = 'CHANGELOG.md' ) {
		const versionPattern = version.replace( /\./g, '\\.' );
		const pattern = `^(## [\\d-]{10} \\(${ versionPattern }\\))\\n((?:.+\\n)+)`;
		const regex = new RegExp( pattern, 'm' );

		const changelog = this.getFile( changelogFilePath );
		const [ , heading = '', content = '' ] = changelog.match( regex ) || [];

		return { version, heading, content };
	}
}
