/**
 * External dependencies
 */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
	{
		input: './actions/get-release-notes/src/get-release-notes.js',
		output: {
			file: './actions/get-release-notes/get-release-notes.js',
		},
		external: [ 'path', 'fs' ],
		plugins: [
			nodeResolve( { preferBuiltins: true } ),
			commonjs(),
			json( { compact: true } ),
		],
	},
	{
		input: './actions/phpcs-diff/src/annotate-phpcs-report.js',
		output: {
			file: './actions/phpcs-diff/annotate-phpcs-report.js',
		},
		external: [ 'fs', 'node:process' ],
		plugins: [ nodeResolve( { preferBuiltins: true } ), commonjs() ],
	},
	{
		input: './actions/update-version-tags/src/update-version-tags.js',
		output: {
			file: './actions/update-version-tags/update-version-tags.js',
		},
		plugins: [
			nodeResolve( { preferBuiltins: true } ),
			commonjs(),
			json( { compact: true } ),
		],
	},
];
