/**
 * External dependencies
 */
import fetch from 'node-fetch';
import core from '@actions/core';

/**
 * Internal dependencies
 */
import handleActionErrors from '../../../utils/handle-action-errors';

async function getPluginReleases() {
	const slug = getInput( 'slug' );
	const apiEndpoint = getAPIEndpoint( slug );

	return fetch( apiEndpoint )
		.then( ( res ) => res.json() )
		.then( parsePluginVersions );
}

function getAPIEndpoint( slug ) {
	if ( slug === 'wordpress' ) {
		return 'https://api.wordpress.org/core/version-check/1.7/';
	}

	return `https://api.wordpress.org/plugins/info/1.0/${ slug }.json`;
}

function getInput( key ) {
	const rawInput = core.getInput( key );
	let input = rawInput;

	if ( rawInput === 'false' ) {
		input = false;
	} else if ( rawInput === 'true' ) {
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
	const numberOfReleases = parseInt( getInput( 'releases' ), 10 );
	const includeRC = getInput( 'includeRC' );
	const includePatches = getInput( 'includePatches' );

	const output = [];

	if ( slug !== 'wordpress' ) {
		const versions = Object.keys( releases.versions )
			.filter(
				( version ) =>
					version !== 'trunk' &&
					version !== 'other' &&
					! version.includes( 'beta' )
			)
			.sort( semverCompare );

		for ( const version of versions ) {
			const releasesAdded = output.filter(
				( release ) => ! isRC( release )
			);

			if ( releasesAdded.length === numberOfReleases ) {
				break;
			}

			if (
				( includeRC || ! isRC( version ) ) &&
				( includePatches || ! isMinorAlreadyAdded( output, version ) )
			) {
				output.push( version );
			}
		}
	} else {
		for ( const release of releases.offers ) {
			if ( output.length === numberOfReleases ) {
				break;
			}

			if (
				release.new_files &&
				( includePatches ||
					! isMinorAlreadyAdded( output, release.version ) )
			) {
				output.push( release.version );
			}
		}
	}

	setOutput( 'versions', output );
}

function isRC( version ) {
	return version.toLowerCase().includes( 'rc' );
}

function isMinorAlreadyAdded( output, version ) {
	if (
		output.find( ( el ) => {
			const elSegments = el.split( '.' );
			const versionSegments = version.split( '.' );
			return (
				elSegments[ 0 ] === versionSegments[ 0 ] &&
				elSegments[ 1 ] === versionSegments[ 1 ]
			);
		} )
	) {
		return true;
	}
}

function semverCompare( a, b ) {
	const regex = /^(\d+)\.(\d+)\.(\d+)(-rc\.\d+)?$/;

	const aMatches = a.toLowerCase().match( regex );
	const [ , majorA, minorA, patchA, rcA ] = aMatches;

	const bMatches = b.toLowerCase().match( regex );
	const [ , majorB, minorB, patchB, rcB ] = bMatches;

	if ( majorA !== majorB ) return majorB - majorA;
	if ( minorA !== minorB ) return minorB - minorA;
	if ( patchA !== patchB ) return patchB - patchA;

	if ( ! rcA ) return -1;
	if ( ! rcB ) return 1;

	return rcB.localeCompare( rcA );
}

getPluginReleases()
	.then( () => core.info( 'Finish getting the release versions.' ) )
	.catch( handleActionErrors );
