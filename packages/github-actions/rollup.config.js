/**
 * External dependencies
 */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
	{
		input: './actions/eslint-annotation/src/eslintFormatter.js',
		output: {
			file: './actions/eslint-annotation/eslintFormatter.cjs',
			format: 'cjs',
		},
		// This action imports 'eslint' from the caller repo.
		external: [ 'eslint' ],
	},
	{
		input: './actions/get-release-notes/src/get-release-notes.js',
		output: {
			file: './actions/get-release-notes/get-release-notes.mjs',
		},
		plugins: [
			nodeResolve( {
				preferBuiltins: true,
				exportConditions: [ 'node' ],
			} ),
			commonjs(),
		],
	},
	{
		input: './actions/phpcs-diff/src/annotate-phpcs-report.js',
		output: {
			file: './actions/phpcs-diff/annotate-phpcs-report.mjs',
		},
		plugins: [
			nodeResolve( {
				preferBuiltins: true,
				exportConditions: [ 'node' ],
			} ),
			commonjs(),
		],
	},
	{
		input: './actions/stylelint-annotation/src/stylelintFormatter.js',
		output: {
			file: './actions/stylelint-annotation/stylelintFormatter.cjs',
			format: 'cjs',
		},
		// This action imports 'stylelint' from the caller repo.
		external: [ 'stylelint' ],
	},
	{
		input: './actions/update-version-tags/src/update-version-tags.js',
		output: {
			file: './actions/update-version-tags/update-version-tags.mjs',
		},
		plugins: [
			nodeResolve( {
				preferBuiltins: true,
				exportConditions: [ 'node' ],
			} ),
			commonjs(),
		],
	},
	{
		input: './actions/get-plugin-releases/src/get-plugin-releases.js',
		output: {
			file: './actions/get-plugin-releases/get-plugin-releases.mjs',
		},
		plugins: [
			nodeResolve( {
				preferBuiltins: true,
				exportConditions: [ 'node' ],
			} ),
			commonjs(),
		],
	},
	{
		input: './actions/prepare-extension-release/src/woo-extension-create-pr-for-release.mjs',
		output: {
			file: './actions/prepare-extension-release/woo-extension-create-pr-for-release.mjs',
		},
		plugins: [
			nodeResolve( {
				preferBuiltins: true,
				exportConditions: [ 'node' ],
			} ),
		],
	},
	{
		input: './actions/publish-extension-dev-build/src/publish-extension-dev-build.js',
		output: {
			file: './actions/publish-extension-dev-build/publish-extension-dev-build.mjs',
		},
		plugins: [
			nodeResolve( {
				preferBuiltins: true,
				exportConditions: [ 'node' ],
			} ),
			commonjs(),
		],
	},
];
