/**
 * External dependencies
 */
import path from 'path';
import Generator from 'yeoman-generator';

export default class PhpcsGenerator extends Generator {
	async prompting() {
		this.answers = await this.prompt( [
			{
				type: 'confirm',
				name: 'isDiffOnly',
				message:
					'Would you like to perform the PHPCS check on the changed lines of code only?',
				default: false,
			},
			{
				type: 'confirm',
				name: 'installConfig',
				message: 'Whether to create the PHPCS config file?',
				default: true,
			},
			{
				type: 'confirm',
				name: 'installLocalScripts',
				message:
					'Whether to set up npm scripts for running the check locally?',
				default: true,
			},
			{
				type: 'confirm',
				name: 'installGithubAction',
				message: 'Whether to run the check in GitHub Actions?',
				default: false,
			},
		] );

		const furtherQuestions = [];

		// PHPCS configuration
		if ( this.answers.installConfig ) {
			furtherQuestions.push(
				{
					type: 'input',
					name: 'textDomain',
					message:
						'What is the text domain for the i18n strings of this plugin?',
					default: this._findTextDomain(),
				},
				{
					type: 'editor',
					name: 'excludePatterns',
					message:
						'What are the exclusion patterns of PHPCS config to be set?',
					default: this._findExclusionPatterns().join( '\n' ),
					filter( input ) {
						return input
							.split( '\n' )
							.map( ( el ) => el.trim() )
							.filter( Boolean );
					},
				}
			);
		}

		// GitHub action
		if ( this.answers.installGithubAction ) {
			furtherQuestions.push( {
				type: 'list',
				name: 'phpVersion',
				message: 'What PHP version to use in GitHub Actions?',
				choices: [ '8.1', '8.0', '7.4', '7.3', '7.2' ],
				default: '7.4',
			} );

			if ( ! this.answers.isDiffOnly ) {
				// Only php-coding-standards.yml will be triggered by push events.
				furtherQuestions.push( {
					type: 'input',
					name: 'branches',
					message:
						'What branches of push events should trigger this check in GitHub Actions? (separate branches by commas)',
					default: this._findPersistentBranches().join( ', ' ),
					filter( input ) {
						return input.split( /\s*,\s*/ ).filter( Boolean );
					},
				} );
			}
		}

		// Required composer packages
		const depsQuestion = {
			type: 'checkbox',
			name: 'installDeps',
			message:
				'If you would like to install the required composer packages together, please select the wanted packages.',
			choices: [
				'dealerdirect/phpcodesniffer-composer-installer:^v0.7',
				'wp-coding-standards/wpcs:^2.3',
			],
			default: [],
		};

		if ( this.answers.isDiffOnly ) {
			depsQuestion.choices.push( 'exussum12/coverage-checker:^1.0' );
		}

		furtherQuestions.push( depsQuestion );
		const furtherAnswers = await this.prompt( furtherQuestions );
		Object.assign( this.answers, furtherAnswers );
	}

	install() {
		const { installDeps } = this.answers;
		if ( installDeps.length ) {
			const opts = [ 'require', '--dev', ...installDeps ];
			this.spawnCommand( 'composer', opts );
		}
	}

	writing() {
		const { answers } = this;

		// PHPCS configuration
		if ( answers.installConfig ) {
			const filename = 'phpcs.xml.dist';
			this.fs.copyTpl(
				this.templatePath( filename ),
				this.destinationPath( filename ),
				answers
			);
		}

		// GitHub action
		if ( answers.installGithubAction ) {
			const filename = answers.isDiffOnly
				? 'php-coding-standards-diff.yml'
				: 'php-coding-standards.yml';

			this.fs.copyTpl(
				this.templatePath( filename ),
				this.destinationPath( `.github/workflows/${ filename }` ),
				answers
			);
		}

		// Add mpm scripts to package.json and bash file for phpcs-diff
		if ( answers.installLocalScripts ) {
			const scripts = { 'lint:php': 'vendor/bin/phpcs' };

			if ( answers.isDiffOnly ) {
				const filename = 'phpcs-diff.sh';
				const destPath = `./bin/${ filename }`;
				this.fs.copyTpl(
					this.templatePath( filename ),
					this.destinationPath( destPath )
				);

				scripts[ 'lint:php:diff' ] = destPath;
			}

			this.fs.extendJSON(
				this.destinationPath( 'package.json' ),
				{ scripts },
				null,
				this._getPackageJsonIndent()
			);

			// Skip `npm install` because it only changes the "scripts" config.
			this.env.options.skipInstall = true;
		}
	}

	_findTextDomain() {
		// Ref: https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/#text-domains
		const mainFile = `${ path.basename( this.contextRoot ) }.php`;

		if ( this.existsDestination( mainFile ) ) {
			const content = this.readDestination( mainFile );
			const matched = content.match( /^\s*\* Text Domain: (.+)/im );
			if ( matched ) {
				return matched[ 1 ];
			}
		}
		return '';
	}

	_findExclusionPatterns() {
		const patterns = [];
		const configFilename = [ 'phpcs.xml.dist', 'phpcs.xml' ].find(
			( filename ) => this.existsDestination( filename )
		);

		if ( configFilename ) {
			const content = this.readDestination( configFilename );
			const regex = /<exclude-pattern>([^<]+)<\/exclude-pattern>/g;
			content.replace( regex, ( _, pattern ) => {
				patterns.push( pattern );
			} );
		} else {
			patterns.push( '*/node_modules/*', '*/vendor/*', './assets/*' );
		}
		return patterns;
	}

	_findPersistentBranches() {
		const possibleBranches = [ 'main', 'trunk', 'develop', 'dev' ];
		let branches = [];

		try {
			const { stdout } = this.spawnCommandSync(
				'git',
				[ 'branch', '-r' ],
				{ stdio: [ process.stdout ] }
			);
			branches = stdout
				.split( '\n' )
				.map( ( el ) => el.replace( /^\s*[^\/]+\//, '' ) )
				.filter( ( el ) => possibleBranches.includes( el ) );
		} catch ( e ) {
			// Do nothing.
		}

		return branches;
	}

	_getPackageJsonIndent() {
		const content = this.readDestination( 'package.json' );
		const match = content.match( /^[ \t]+/m ) || [ '  ' ];
		return match[ 0 ];
	}
}
