/**
 * External dependencies
 */
import core from '@actions/core';
import semverValid from 'semver/functions/valid.js';
import semverRcompare from 'semver/functions/rcompare.js';
import semverPrerelease from 'semver/functions/prerelease.js';
import semverCoerce from 'semver/functions/coerce.js';

/**
 * Internal dependencies
 */
import handleActionErrors from '../../../utils/handle-action-errors.js';

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

function isRC( version ) {
	const pre = semverPrerelease( version.toLowerCase() );
	return pre?.[ 0 ] === 'rc';
}

function isMinorAlreadyAdded( output, version ) {
	const currentVer = semverCoerce( version );

	if (
		output.find( ( el ) => {
			const elVer = semverCoerce( el );

			return (
				elVer.major === currentVer.major &&
				elVer.minor === currentVer.minor
			);
		} )
	) {
		return true;
	}
}

function normalizeData( data, inputs ) {
	let latest;
	let rawVersions;

	if ( inputs.slug === 'wordpress' ) {
		rawVersions = data.offers.reduce( ( acc, offer ) => {
			if ( offer.new_files ) {
				acc.push( offer.version );
			}
			return acc;
		}, [] );
	} else {
		latest = data.version;
		rawVersions = Object.keys( data.versions );
	}

	return { latest, rawVersions };
}

export function parsePluginVersions( data, inputs ) {
	const { latest, rawVersions } = normalizeData( data, inputs );
	const { slug, numberOfReleases, includeRC, includePatches } = inputs;
	const output = [];

	if ( slug !== 'wordpress' ) {
		const versions = rawVersions
			.filter( ( version ) => {
				if ( version.includes( 'beta' ) || ! semverValid( version ) ) {
					return false;
				}
				return (
					isRC( version ) || semverRcompare( latest, version ) <= 0
				);
			} )
			.sort( semverRcompare );

		for ( const version of versions ) {
			if ( output.length === numberOfReleases ) {
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
		for ( const version of rawVersions ) {
			if ( output.length === numberOfReleases ) {
				break;
			}

			if ( includePatches || ! isMinorAlreadyAdded( output, version ) ) {
				output.push( version );
			}
		}
	}

	return output;
}

async function getPluginReleases( inputs ) {
	const apiEndpoint = getAPIEndpoint( inputs.slug );

	return fetch( apiEndpoint )
		.then( ( res ) => res.json() )
		.then( ( data ) => parsePluginVersions( data, inputs ) );
}

// Directly perform this action if it's running in GitHub Actions.
if ( process.env.GITHUB_ACTIONS ) {
	const inputs = {
		slug: getInput( 'slug' ),
		numberOfReleases: parseInt( getInput( 'releases' ), 10 ),
		includeRC: getInput( 'includeRC' ),
		includePatches: getInput( 'includePatches' ),
	};

	getPluginReleases( inputs )
		.then( ( versions ) => {
			core.info( `==> Output "versions":\n${ versions }` );
			core.setOutput( 'versions', versions );
			core.info( 'Finish getting the release versions.' );
		} )
		.catch( handleActionErrors );
}
