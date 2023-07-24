# Get latest releases versions from a specific WordPress.org plugin or from WordPress core

This action provides the following functionality for GitHub Actions users:

- Get L-x release versions via GitHub job

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
on:
  push:
    branches:
      - release/my-tool

jobs:
  GetPluginReleases:
    name: Get Plugin Releases
    runs-on: ubuntu-latest
    steps:
      - name: Get Release versions from WooCommerce
        id: wc-versions
        uses: woocommerce/grow/get-plugin-releases@actions-v1
        with:
          slug: woocommerce

      - name: Get Release versions from WordPress
        id: wp-versions
        uses: woocommerce/grow/get-plugin-releases@actions-v1
        with:
          slug: wordpress

      - name: Get Release versions from GLA
        id: gla-versions
        uses: woocommerce/grow/get-plugin-releases@actions-v1
        with:
          slug: google-listings-and-ads

      - name: Get L-3 Release versions from WC including RC
        id: wc-versions-l3-rc
        uses: woocommerce/grow/get-plugin-releases@actions-v1
        with:
          slug: woocommerce
          releases: 4
          includeRC: true

      - name: Get L-2 Release versions from WC including patches
        id: wc-versions-patches
        uses: woocommerce/grow/get-plugin-releases@actions-v1
        with:
          slug: woocommerce
          includePatches: true

      - name: Show the versions output
        run: |
          echo "The versions WooCommerce are: ${{ steps.wc-versions.outputs.versions }}"
          echo "The versions Wordpress are: ${{ steps.wp-versions.outputs.versions }}."
          echo "The versions GLA are: ${{ steps.gla-versions.outputs.versions }}."
          echo "The 4 versions WC RC are: ${{ steps.wc-versions-l3-rc.outputs.versions }}."
          echo "The versions WC ( inc patches ) are: ${{ steps.wc-versions-patches.outputs.versions }}."
```
