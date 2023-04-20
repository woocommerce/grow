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
		return 'https://api.wordpress.org/stats/wordpress/1.0/'
	}

	return `https://api.wordpress.org/stats/plugin/1.0/${slug}`;
}

function getInput( key ) {
	const input = core.getInput( key );
	core.info( `==> Input "${ key }":\n${ input }` );
	return input;
}

function setOutput( key, value ) {
	core.info( `==> Output "${ key }":\n${ value }` );
	core.setOutput( key, value );
}

function parsePluginVersions( versions = {} ) {

	const numberOfReleases = parseInt( getInput( 'releases' ) ) || 3;

	let output = [];

	Object.keys( versions ).reverse().forEach( version => {
		if (version !== 'other') {
			output.push( version );
		}
	});

	setOutput( 'matrix', output.slice(-numberOfReleases) );
}


getPluginReleases().then( () => core.info( 'Finish getting the release versions.' ) )
	.catch( handleActionErrors );
