/**
 * External dependencies
 */
import core from '@actions/core';

export default function handleActionErrors( e ) {
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
}
