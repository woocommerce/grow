#! /usr/bin/env node
/**
 * External dependencies
 */
import { execSync } from 'node:child_process';
import path from 'node:path';

process.env.PATH +=
	path.delimiter + path.join( process.cwd(), 'node_modules', '.bin' );

const args = process.argv.slice( 2 );
execSync(
	'jsdoc -r -c .jsdocrc.json -t woocommerce-grow-tracking-jsdoc ' +
		args.join( ' ' ),
	{ stdio: 'inherit' }
);
