/**
 * External dependencies
 */
import fetch from 'node-fetch';
import core from '@actions/core';

/**
 * Internal dependencies
 */
import handleActionErrors from "../../../utils/handle-action-errors";


async function getPluginReleases() {

	const slug = getInput( 'slug' );
	const apiEndpoint = getAPIEndpoint(slug);

	fetch(apiEndpoint)
		.then(res => res.json())
		.then(parsePluginVersions);
}

function getAPIEndpoint( slug ) {
	if (slug === 'wordpress') {
		return 'https://api.wordpress.org/core/version-check/1.7/'
	}

	return `https://api.wordpress.org/plugins/info/1.0/${slug}.json`;
}

function getInput( key ) {
	const rawInput = core.getInput( key );
	let input = rawInput;

	if (rawInput === "false") {
		input = false;
	} else if (rawInput === "true") {
		input = true;
	}

	return input;
}

function setOutput( key, value ) {
	core.info( `==> Output "${ key }":\n${ value }` );
	core.setOutput( key, value );
}

function parsePluginVersions( releases = {} ) {
	const slug = getInput( 'slug' );
	const numberOfReleases = parseInt( getInput( 'releases' ) ) || 3;
	const includeRC = getInput( 'includeRC' ) || false;
	const includePatches = getInput( 'includePatches' ) || false;

	let output = [];

	if ( slug !== 'wordpress') {
		Object.keys( releases.versions ).reverse().forEach( version => {
			if (output.length === numberOfReleases) {
				return;
			}

			if ( version !== 'other' && version !== 'trunk' && ! version.includes('beta') && ! includesRC(version, includeRC) && ! isMinorAlreadyAdded( output, version, includePatches ) ) {
				output.push( version );
			}
		});
	} else {
		releases.offers.forEach( release => {
			if (output.length === numberOfReleases) {
				return;
			}

			if ( release.new_files && ! release.version.includes('beta') && ! includesRC(release.version, includeRC) && ! isMinorAlreadyAdded( output, release.version, includePatches ) ) {
				output.push( release.version );
			}
		});
	}

	setOutput( 'matrix', output );
}

function includesRC(version, includeRC) {
	if ( includeRC ) {
		return false;
	}

	return version.includes('rc')
}

function isMinorAlreadyAdded( output, version, includePatches ) {

	if ( includePatches ) {
		return false;
	}

	if ( output.find( el => {
		let elSegments = el.split('.');
		let versionSegments = version.split('.');
		return elSegments[0] === versionSegments[0] && elSegments[1] === versionSegments[1];
	} )) {
		return true
	}
}


getPluginReleases().then( () => core.info( 'Finish getting the release versions.' ) )
	.catch( handleActionErrors );
