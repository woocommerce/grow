#! /usr/bin/env node

/**
 * Internal dependencies
 */
const { shell } = require( '../utils' );

shell.exec("start-storybook  -c ./storybook -p 6006 --ci");
