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
      wp-version:
        description: 'WordPress tested up to'
      wc-version:
        description: 'WooCommerce tested up to'

jobs:
  Prepare_release:
    name: 'Prepare release'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - uses: woocommerce/grow/prepare-extension-release@actions-v1
        with:
          version: ${{ github.event.inputs.version }}
          type: ${{ github.event.inputs.type }}
          wp-version: ${{ github.event.inputs.wp-version }}
          wc-version: ${{ github.event.inputs.wc-version }}
          main-branch: 'trunk'
          pre-steps: |
            1. [ ] Prepare something more before the release
          post-steps: |
            ### Additional post-release checklist
            1. [ ] Update documentation
               - [ ] Publish any new required docs
```
