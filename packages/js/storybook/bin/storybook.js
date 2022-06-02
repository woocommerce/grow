#! /usr/bin/env node
/**
 * External dependencies
 */
import { argv } from 'process';
import shell from 'shelljs';
import path from 'path';

process.env.PATH += ( path.delimiter + path.join( process.cwd(), 'node_modules', '.bin') );

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
