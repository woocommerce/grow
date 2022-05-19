import Generator from 'yeoman-generator';

export default class GitHubGenerator extends Generator {
	async prompting() {
		this.answers = await this.prompt([
			{
				type: "input",
				name: "title",
				message: "Your project title (used in CONTRIBUTING.md)",
				default: this.packageJson.get( 'title' ) || this.appname
			},
			{
				type: "input",
				name: "ideasboard",
				message: "What's the plugin ideas board's category number? (leave empty if none)",
				default: ''
			}
		]);
	}

	writing() {
		this.fs.copyTpl(
			this.templatePath( '**' ), // copy everything
			this.destinationPath( '.github/' ),
			{ ...this.answers }
		);
	}
};
