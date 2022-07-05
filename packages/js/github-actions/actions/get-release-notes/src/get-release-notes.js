/**
 * External dependencies
 */
import github from '@actions/github';
import core from '@actions/core';
import semver from 'semver';

/**
 * Internal dependencies
 */
import PackageTool from '../../../utils/package-tool.js';
import RepoTool from '../../../utils/repo-tool.js';
import handleActionErrors from '../../../utils/handle-action-errors.js';
import matchVersionLevel from './match-version-level.js';

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

function escapeSingleQuote( text ) {
	return text.replace( /'/g, `'"'"'` );
}

function setOutput( key, value ) {
	core.info( `==> Output "${ key }":\n${ value }` );
	core.setOutput( key, value );
}

async function getReleaseNotes() {
	// Prepare parameters
	const { context } = github;
	const token = core.getInput( 'repo-token' );
	const packageDir = core.getInput( 'package-dir' );

	const tag = core.getInput( 'tag' ) || TMP_TAG;
	const targetCommitish =
		core.getInput( 'target-commitish' ) ||
		context.ref.replace( 'refs/heads/', '' );
	const configPath = core.getInput( 'config-path' );

	const majorKeywords = core.getInput( 'major-keywords' );
	const minorKeywords = core.getInput( 'minor-keywords' );

	// Resolve the previous tag
	const repoTool = new RepoTool( token, context );
	const packageTool = new PackageTool( packageDir );
	const { version } = packageTool.getSettings();
	const versionTag = compositeVersionTag( version );
	const previousTag = ( await repoTool.hasTag( versionTag ) )
		? versionTag
		: '';

	// Log info
	core.info( `Resolved target commitish: ${ targetCommitish }` );
	if ( previousTag ) {
		core.info( `Resolved previous tag: ${ previousTag }` );
	} else {
		core.info(
			`The previous tag ${ versionTag } does not exist. The inferred version number will be the same as package.json.`
		);
	}

	// Fetch release notes
	const { body } = await repoTool.generateReleaseNotes(
		tag,
		targetCommitish,
		previousTag,
		configPath
	);
	const changelog = parseChangelog( body );

	let notesContent = body;
	let nextVersion = '';
	let nextTag = '';

	// Infer the next version and tag.
	if ( semver.valid( version ) ) {
		const level = matchVersionLevel( body, majorKeywords, minorKeywords );
		nextVersion = previousTag ? semver.inc( version, level ) : version;
		nextTag = compositeVersionTag( nextVersion );

		if ( notesContent.endsWith( TMP_TAG ) ) {
			notesContent = notesContent.replace( TMP_TAG, nextTag );
		}
	} else {
		core.warning( `The ${ version } is not a valid semantic versioning.` );
	}

	// Output results
	setOutput( 'release-notes', notesContent );
	setOutput( 'release-notes-shell', escapeSingleQuote( notesContent ) );
	setOutput( 'release-changelog', changelog );
	setOutput( 'release-changelog-shell', escapeSingleQuote( changelog ) );
	setOutput( 'next-version', nextVersion );
	setOutput( 'next-tag', nextTag );
}

// Start running this action.
getReleaseNotes()
	.then( () => core.info( 'Finish getting the release notes.' ) )
	.catch( handleActionErrors );
