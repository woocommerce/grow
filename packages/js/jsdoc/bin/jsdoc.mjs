#! /usr/bin/env node
/**
 * External dependencies
 */
import shell from 'shelljs';
import path from 'path';

process.env.PATH += ( path.delimiter + path.join( process.cwd(), 'node_modules', '.bin') );

shell.exec("jsdoc -r ./js/src -c .jsdocrc.json -t woocommerce-grow-tracking-jsdoc");
