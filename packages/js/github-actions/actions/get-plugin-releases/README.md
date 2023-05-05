# Get latest releases versions from a specific plugin or from wordpress core

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
        id: wc-matrix
        uses: woocommerce/grow/get-plugin-releases@actions-v1.5.0-pre
        with:
          slug: woocommerce

      - name: Get Release versions from Wordpress
        id: wp-matrix
        uses: woocommerce/grow/get-plugin-releases@actions-v1.5.0-pre
        with:
          slug: wordpress

      - name: Get Release versions from GLA
        id: gla-matrix
        uses: woocommerce/grow/get-plugin-releases@actions-v1.5.0-pre
        with:
          slug: google-listings-and-ads

      - name: Get L-3 Release versions from WC including RC
        id: wc-matrix-l3-rc
        uses: woocommerce/grow/get-plugin-releases@actions-v1.5.0-pre
        with:
          slug: woocommerce
          releases: 4
          includeRC: true

      - name: Get L-2 Release versions from WC including patches
        id: wc-matrix-patches
        uses: woocommerce/grow/get-plugin-releases@actions-v1.5.0-pre
        with:
          slug: woocommerce
          includePatches: true

      - name: Show the matrix output
        run: |
          echo "The versions WooCommerce are: ${{ steps.wc-matrix.outputs.matrix }}"
          echo "The versions Wordpress are: ${{ steps.wp-matrix.outputs.matrix }}."
          echo "The versions GLA are: ${{ steps.gla-matrix.outputs.matrix }}."
          echo "The 4 versions WC RC are: ${{ steps.wc-matrix-l3-rc.outputs.matrix }}."
          echo "The versions WC ( inc patches ) are: ${{ steps.wc-matrix-patches.outputs.matrix }}."
```
