import Generator from 'yeoman-generator';

export default class DotFilesGenerator extends Generator {
	writing() {
		this.fs.copyTpl(
			this.templatePath( '.*' ),
			this.destinationPath( './' )
		);
	}
};
