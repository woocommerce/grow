#! /usr/bin/env node
/**
 * External dependencies
 */
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

process.env.PATH +=
	path.delimiter + path.join( process.cwd(), 'node_modules', '.bin' );

const args = process.argv.slice( 2 );
execFileSync(
	'jsdoc',
	[
		'-r',
		'-c',
		'.jsdocrc.json',
		'-t',
		'woocommerce-grow-tracking-jsdoc',
		...args,
	],
	{ stdio: 'inherit' }
);
