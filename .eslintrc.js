module.exports = {
	extends: [ 'plugin:@woocommerce/eslint-plugin/recommended' ],
	settings: {
		'import/resolver': 'node',
		jest: {
			version: 29,
		},
	},
	ignorePatterns: [
		// ESLint ignores dotfiles by default. This re-includes .github/.
		'!.github',
		'**/vendor/',
	],
};
