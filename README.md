# Grow Packages

This repository is a container for packages, mostly dev tools to serve the Grow Team.
The packages here are too experimental or too Grow-specific to be shared Woo-wide.

## List of packages

- [`/packages/js/generator-grow`](packages/js/generator-grow/README.md) - Yeoman Generator for extension repository boilerplate.
- [`/packages/js/github-actions`](packages/js/github-actions/README.md) - GitHub JavaScript actions.
- [`/packages/js/storybook`](packages/js/storybook/README.md) - Storybook dependencies and basic scripts
- [`/packages/js/tracking-jsdoc`](packages/js/tracking-jsdoc/README.md) - `jsdoc` plugin to document Tracking Events in markdown

## GitHub actions
- [`/github-actions/prepare-mysql`](github-actions/prepare-mysql) - Enable MySQL, handle authentication compatibility
- [`/github-actions/prepare-node`](github-actions/prepare-node) - Set up Node.js with a specific version, load npm cache, install Node dependencies
- [`/github-actions/prepare-php`](github-actions/prepare-php) - Set up PHP with a specific version and tools, load Composer cache, install Composer dependencies
- [`/github-actions/update-version-tags`](github-actions/update-version-tags) - Update version tags

<p align="center">
	<br/><br/>
	Made with 💜 by <a href="https://woocommerce.com/">WooCommerce</a>.<br/>
	<a href="https://woocommerce.com/careers/">We're hiring</a>! Come work with us!
</p>
