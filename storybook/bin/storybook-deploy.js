#! /usr/bin/env node

/**
 * Internal dependencies
 */
const { shell } = require( '../utils' );

shell.exec("npm run storybook:build && gh-pages -d ./storybook/dist");
