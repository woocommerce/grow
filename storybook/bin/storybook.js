#! /usr/bin/env node

/**
 * Internal dependencies
 */
const { shell } = require( '../utils' );
const argv = require('process').argv;

switch (argv[argv.length - 1]) {
	case 'build':
		shell.exec("BABEL_ENV=development build-storybook -c ./storybook -o ./storybook/dist");
		break;
	case 'deploy':
		shell.exec("npm run storybook build && gh-pages -d ./storybook/dist");
		break;
	default:
		shell.exec("start-storybook  -c ./storybook -p 6006 --ci");
}
