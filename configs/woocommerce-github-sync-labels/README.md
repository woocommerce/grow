# woocommerce-github-sync-labels config

In Grow we adhere to Woo convention of GitHub labels (PbIy4N-2wg-p2). However, we add a few more.

This folder contains configs to be used with [`woocommerce-github-sync-labels`](https://github.com/woocommerce/woocommerce-github-sync-labels) to automatically, sync those labels with all our repos.

## How to use

1. [Install and setup `woocommerce-github-sync-labels`](https://github.com/woocommerce/woocommerce-github-sync-labels#install)
2. Copy configs from this folder into the cloned tool folder 
3. Run dry run
	```
	npm start -- --dry-run --preserve-labels
	```
4. Update the labels. Use `--preserve-labels` not to remove the existing labels.
	```
	npm start -- --preserve-labels
	```
