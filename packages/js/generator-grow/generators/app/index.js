/**
 * External dependencies
 */
import Generator from 'yeoman-generator';
import path from 'node:path';

/**
 * Internal dependencies
 */
import DotFilesGenerator from '../dotfiles/index.js';
import GitHubGenerator from '../github/index.js';

export default class GrowGenerator extends Generator {
	usage() {
		return 'yo grow[:app] [options]';
	}

	async initializing() {
		const packageRoot = path.resolve( this.sourceRoot(), '../..' );

		await this.composeWith( {
			Generator: GitHubGenerator,
			path: path.resolve( packageRoot, 'github/index.js' ),
		} );

		await this.composeWith( {
			Generator: DotFilesGenerator,
			path: path.resolve( packageRoot, 'dotfiles/index.js' ),
		} );
	}
}
