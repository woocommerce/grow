/**
 * External dependencies
 */
import Generator from 'yeoman-generator';

export default class GitHubGenerator extends Generator {
	async prompting() {
		this.answers = await this.prompt( [
			{
				type: 'input',
				name: 'title',
				message: 'Your project title (used in CONTRIBUTING.md)',
				default: this.packageJson.get( 'title' ) || this.appname,
			},
			{
				type: 'input',
				name: 'slug',
				message: "What's the plugin slug for feature requests page?",
				default: this.appname.replace( /\s+/g, '-' ).toLowerCase(),
			},
		] );
	}

	writing() {
		this.fs.copyTpl(
			this.templatePath( '**' ), // copy everything
			this.destinationPath( '.github/' ),
			{ ...this.answers }
		);
	}
}
