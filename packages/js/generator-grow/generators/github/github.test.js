/**
 * External dependencies
 */
import { default as path, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import helpers, { result } from 'yeoman-test';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const githubPath = path.join( __dirname, './index.js' );

describe( ':github', function () {
	it( 'generate `.github/*.md` files', async function () {
		await helpers.run( githubPath ).then( function () {
			result.assertFile( '.github/CODE_OF_CONDUCT.md' );
			result.assertFile( '.github/CONTRIBUTING.md' );
			result.assertFile( '.github/ISSUE_TEMPLATE/1-bug_report.md' );
			result.assertFile( '.github/ISSUE_TEMPLATE/2-new_feature.md' );
			result.assertFile( '.github/PULL_REQUEST_TEMPLATE.md' );
			result.assertFile( '.github/SECURITY.md' );
		} );
	} );
	it( 'generate `.github/workflows/branch-labels.yml` file', async function () {
		await helpers.run( githubPath ).then( function () {
			result.assertFile( '.github/workflows/branch-labels.yml' );
		} );
	} );
	it( 'Should use given project title in CONTRIBUTING.md', async function () {
		await helpers
			.run( githubPath )
			.withPrompts( { title: 'MyAwesomeProject Title' } )
			.then( function () {
				result.assertFileContent(
					'.github/CONTRIBUTING.md',
					'Thanks for your interest in contributing to MyAwesomeProject Title!'
				);
			} );
	} );
	it( 'Should use (package.json).title as the project title in CONTRIBUTING.md', async function () {
		await helpers
			.run( githubPath )
			.onGenerator( function ( generator ) {
				generator.fs.write(
					'package.json',
					'{ "title": "Package Title" }'
				);
			} )
			.then( function () {
				result.assertFileContent(
					'.github/CONTRIBUTING.md',
					`Thanks for your interest in contributing to Package Title!`
				);
			} );
	} );
	it( 'Should use folder name as the project title in CONTRIBUTING.md', async function () {
		await helpers.run( githubPath ).then( function () {
			result.assertFileContent(
				'.github/CONTRIBUTING.md',
				`Thanks for your interest in contributing to ${ path.basename(
					process.cwd()
				) }!`
			);
		} );
	} );
	it( 'When slug is given, should generate feature requests page link.', async function () {
		await helpers
			.run( githubPath )
			.withPrompts( { slug: 'foo-bar' } )
			.then( function () {
				result.assertFileContent(
					'.github/CONTRIBUTING.md',
					'https://woocommerce.com/feature-requests/foo-bar'
				);
			} );
	} );
	it( 'If no slug is given, should use app name to generate the link.', async function () {
		await helpers
			.run( githubPath )
			.withPrompts( { slug: '' } )
			.then( function ( runResult ) {
				// Appname default to the folder name.
				const appname = runResult.generator.appname;

				result.assertFileContent(
					'.github/CONTRIBUTING.md',
					`https://woocommerce.com/feature-requests/${ appname }`
				);
			} );
	} );
} );
