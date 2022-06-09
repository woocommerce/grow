#! /usr/bin/env node
/**
 * External dependencies
 */
import shell from 'shelljs';
import path from 'path';

process.env.PATH += ( path.delimiter + path.join( process.cwd(), 'node_modules', '.bin') );

const args = process.argv.slice( 2 );
shell.exec( 'jsdoc -r -c .jsdocrc.json -t woocommerce-grow-tracking-jsdoc ' + args.join( ' ' ) );
