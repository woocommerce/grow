/**
 * External dependencies
 */
import { default as path, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const githubPath = path.join( __dirname, './index.js' );

describe( ':github', function () {
	it( 'generate `.github/*.md` files', async function () {
		await helpers.run( githubPath ).then( function () {
			assert.file( '.github/CODE_OF_CONDUCT.md' );
			assert.file( '.github/CONTRIBUTING.md' );
			assert.file( '.github/ISSUE_TEMPLATE/1-bug_report.md' );
			assert.file( '.github/ISSUE_TEMPLATE/2-new_feature.md' );
			assert.file( '.github/PULL_REQUEST_TEMPLATE.md' );
			assert.file( '.github/SECURITY.md' );
		} );
	} );
	it( 'generate `.github/workflows/branch-labels.yml` file', async function () {
		await helpers.run( githubPath ).then( function () {
			assert.file( '.github/workflows/branch-labels.yml' );
		} );
	} );
	it( 'Should use given project title in CONTRIBUTING.md', async function () {
		await helpers
			.run( githubPath )
			.withPrompts( { title: 'MyAwesomeProject Title' } )
			.then( function () {
				assert.fileContent(
					'.github/CONTRIBUTING.md',
					'Thanks for your interest in contributing to MyAwesomeProject Title!'
				);
			} );
	} );
	it( 'Should use (package.json).title as the project title in CONTRIBUTING.md', async function () {
		await helpers
			.run( githubPath )
			.on( 'ready', function ( generator ) {
				generator.fs.write(
					'package.json',
					'{ "title": "Package Title" }'
				);
			} )
			.then( function () {
				assert.fileContent(
					'.github/CONTRIBUTING.md',
					`Thanks for your interest in contributing to Package Title!`
				);
			} );
	} );
	it( 'Should use folder name as the project title in CONTRIBUTING.md', async function () {
		await helpers.run( githubPath ).then( function () {
			assert.fileContent(
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
				assert.fileContent(
					'.github/CONTRIBUTING.md',
					'https://woo.com/feature-requests/foo-bar'
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

				assert.fileContent(
					'.github/CONTRIBUTING.md',
					`https://woo.com/feature-requests/${ appname }`
				);
			} );
	} );
} );
