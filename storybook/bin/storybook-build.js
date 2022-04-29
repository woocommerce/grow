#! /usr/bin/env node

/**
 * Internal dependencies
 */
const { shell } = require( '../utils' );

shell.exec("BABEL_ENV=development build-storybook  -c ./storybook -o ./storybook/dist");
