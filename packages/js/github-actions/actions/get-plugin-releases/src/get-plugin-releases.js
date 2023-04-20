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
	fetch(`https://api.wordpress.org/stats/plugin/1.0/${getInput( 'slug' )}`)
		.then(res => res.json())
		.then(parsePluginVersions);
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

	let output = [];

	Object.keys( versions ).forEach( version => {
		if (version !== 'other') {
			output.push( version );
		}
	});

	setOutput( 'matrix', output );
}


getPluginReleases().then( () => core.info( 'Finish getting the release versions.' ) )
	.catch( handleActionErrors );
