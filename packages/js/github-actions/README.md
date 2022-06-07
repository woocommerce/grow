# GitHub JavaScript actions

[![GitHub Actions - Release](https://github.com/woocommerce/grow/actions/workflows/github-actions-release.yml/badge.svg)](https://github.com/woocommerce/grow/actions/workflows/github-actions-release.yml)

GitHub JavaScript actions that help to composite GitHub workflows across the repos maintained by the Grow Team.

## Prerequisites

1. Install `node` with version >= 14
1. Install node modules `npm i`

## Release

### Official release

1. Find the latest version tag of GitHub actions in this repo. For example, `v1.4.7-actions`.
1. Create a new release with a new version tag that increases numerically in the format `vX.Y.Z-actions`.
   - For a patch version like fixing bugs, increases the Z number. For example, `v1.4.8-actions`.
   - For a minor version like adding new features, increases the Y number and reset the Z to 0. For example, `v1.5.0-actions`.
   - For a major version like having incompatible changes, increases the X number and reset the Y and Z to 0. For example, `v2.0.0-actions`.
1. After publishing the new release, the "GitHub Actions - Release" workflow of the GitHub Actions in this repo will continue the building and committing the bundle. And then update the references of the corresponding major and minor version tags onto the new release. For example:
   - When the new release version is `v1.4.8-actions`, it should update the references of `v1-actions` and `v1.4-actions` onto `v1.4.8-actions`.
   - When the new release version is `v1.5.0-actions`, it should update the reference of `v1-actions` and create `v1.5-actions` tag onto `v1.5.0-actions`.
   - When the new release version is `v2.0.0-actions`, it should create `v2-actions` and `v2.0-actions` tags onto `v1.4.8-actions`.
1. Check if the ["GitHub Actions - Release" workflow](https://github.com/woocommerce/grow/actions/workflows/github-actions-release.yml) is run successfully.

### Testing release

1. Basically use the same processing as the [Official release](#official-release) above, :warning: **but the format of version tag should be `vX.Y.Z-actions-pre`**.
1. Delete the testing releases and tags once they are no longer in use.

## Usage

See the [GitHub actions](../../../github-actions) in each directory.

<p align="center">
	<br/><br/>
	Made with 💜 by <a href="https://woocommerce.com/">WooCommerce</a>.<br/>
	<a href="https://woocommerce.com/careers/">We're hiring</a>! Come work with us!
</p>
