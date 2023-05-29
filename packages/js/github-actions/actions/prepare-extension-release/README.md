# Prepare Grow extension release

This action provides the following functionality:

- Creates a release branch
- Creates a release PR with a checklist & full `woorelease` commands to run locally.

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
name: 'Prepare New Release'
run-name:  Prepare New Release `${{ github.event.inputs.type }}/${{ github.event.inputs.version }}` by @${{ github.actor }}

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version number to be released'
        required: true
      type:
        description: 'Type of the release (release|hotfix)'
        required: true
        default: 'release'
      wp_version:
        description: 'WordPress tested up to'
      wc_version:
        description: 'WooCommerce tested up to'

  Prepare_release:
    name: Prepare release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - uses: woocommerce/grow/prepare-extension-release@actions-v1
        with:
          version: ${{ github.event.inputs.version }}
          type: ${{ github.event.inputs.type }}
          wp_version: ${{ github.event.inputs.wp_version }}
          wc_version: ${{ github.event.inputs.wc_version }}
          main_branch: 'trunk'
```
