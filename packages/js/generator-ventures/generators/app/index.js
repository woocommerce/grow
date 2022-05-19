import Generator from 'yeoman-generator';
import DotFilesGenerator from '../dotfiles/index.js';
import GitHubGenerator from '../github/index.js';

export default class VenturesGenerator extends Generator {
	usage(){
		return 'yo ventures[:app] [options]';
	}
	initializing() {
		const packageRoot = this.sourceRoot() + '/../';
	  	this.composeWith( { Generator: GitHubGenerator, path: packageRoot + '../github/index.js' } );
	  	this.composeWith( { Generator: DotFilesGenerator, path: packageRoot + '../dotfiles/index.js' } );
	}
};
