# Grow Team Storybook

Storybook dependencies and basic scripts


## Prerequisites

- You will the StoryBook config files as if you installed it in your ouw repository.
- You will need to configure GH Pages s if you would do it in your own repository.
- You will need to add the scripts in your repo calling the storybook binaries described in the usage section. 

Example of working implementation can be found in [GLA plugin storybook folder](https://github.com/woocommerce/google-listings-and-ads/tree/develop/storybook) and [GLA plugin package.json](https://github.com/woocommerce/google-listings-and-ads/blob/develop/package.json)

## Usage

- `storybook` Generates a storybook local dev server watching for changes
- `storybook build` Compiles and generates `dist` folder with the storybook
- `storybook deploy` Calls storybook `build` and deploys `dist` folder to GH pages. 

<p align="center">
	<br/><br/>
	Made with 💜 by <a href="https://woocommerce.com/">WooCommerce</a>.<br/>
	<a href="https://woocommerce.com/careers/">We're hiring</a>! Come work with us!
</p>
