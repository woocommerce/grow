/**
 * External dependencies
 */
import github from '@actions/github';
import core from '@actions/core';
import semver from 'semver';

/**
 * Internal dependencies
 */
import getPackageSettings from '../../../utils/get-package-settings.js';
import RepoTool from '../../../utils/repo-tool.js';
import handleActionErrors from '../../../utils/handle-action-errors.js';

const TMP_TAG = 'tmp--github-action-get-release-notes';

function compositeVersionTag( version ) {
	const template = core.getInput( 'tag-template' );
	return template.replace( '{version}', version );
}

function parseChangelog( notesContent ) {
	const matched = notesContent.match(
		/## What's Changed\n([\d\D]+?)(?=\n\n)/i
	);
	if ( matched ) {
		return matched[ 1 ];
	}
	return '';
}

async function getReleaseNotes() {
	// Prepare parameters
	const { context } = github;
	const workspace = process.env.GITHUB_WORKSPACE;
	const token = core.getInput( 'repo-token' );
	const packageDir = core.getInput( 'package-dir' );

	const tag = core.getInput( 'tag' ) || TMP_TAG;
	const targetCommitish =
		core.getInput( 'target-commitish' ) ||
		context.ref.replace( 'refs/heads/', '' );
	let previousTag = core.getInput( 'previous-tag' );
	const configPath = core.getInput( 'config-path' );

	// Resolve the previous tag
	const repoTool = new RepoTool( token, context );
	const { version } = getPackageSettings( workspace, packageDir );

	if ( ! previousTag ) {
		const versionTag = compositeVersionTag( version );

		if ( await repoTool.hasTag( versionTag ) ) {
			previousTag = versionTag;
		}
	}

	// Log info
	core.info( `Resolved target commitish: ${ targetCommitish }` );
	core.info( `Resolved previous tag: ${ previousTag }` );

	// Fetch release notes
	const { body } = await repoTool.generateReleaseNotes(
		tag,
		targetCommitish,
		previousTag,
		configPath
	);
	const changelog = parseChangelog( body );

	// Output results
	core.setOutput( 'release-notes', body );
	core.setOutput( 'release-changelog', changelog );
}

// Start running this action.
getReleaseNotes()
	.then( () => core.info( 'Finish getting the release notes.' ) )
	.catch( handleActionErrors );
