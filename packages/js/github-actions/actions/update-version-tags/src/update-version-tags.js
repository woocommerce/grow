/**
 * External dependencies
 */
import github from '@actions/github';
import core from '@actions/core';

/**
 * Internal dependencies
 */
import RepoTool from '../../../utils/repo-tool.js';
import parseVersion from './parse-version.js';

async function updateVersionTags() {
	// Prepare parameters
	const { context } = github;
	const tagName = context.payload.release.tag_name;

	const token = core.getInput( 'repo-token' );
	const sha = core.getInput( 'sha' ) || context.sha;

	core.info( `Release tag: ${ tagName }` );
	core.info( `Target sha: ${ sha }` );

	const versionName = parseVersion( tagName );

	if ( ! versionName ) {
		throw new Error(
			`Invalid tag name: ${ tagName }. It should be a valid semantic versioning.`
		);
	}

	// Uodate tag versions
	const repoTool = new RepoTool( token, context );

	if ( sha !== context.sha ) {
		core.info( `Updating release version tag: ${ tagName }` );
		await repoTool.updateTag( tagName, sha );
	}

	const { draft, prerelease } = context.payload.release;

	if ( draft || prerelease ) {
		core.notice(
			'Skip major and minor version tags updating for draft or pre-release.'
		);
		return;
	}

	const { majorVersion, minorVersion } = versionName;

	core.info( `Updating major version tag: ${ majorVersion }` );
	await repoTool.upsertTag( majorVersion, sha );

	core.info( `Updating minor version tag: ${ minorVersion }` );
	await repoTool.upsertTag( minorVersion, sha );
}

// Start running this action.
updateVersionTags()
	.then( () => {
		core.info( 'Finish updating the version tags.' );
	} )
	.catch( ( e ) => {
		let message;

		if ( e instanceof Error ) {
			message = `${ e.name } - ${ e.message }`;

			if ( e.stack ) {
				core.startGroup( 'Call stack' );
				core.info( e.stack );
				core.endGroup();
			}
		} else {
			message = JSON.stringify( e, null, 2 );
		}

		core.setFailed( `Action failed with error: ${ message }` );
	} );
