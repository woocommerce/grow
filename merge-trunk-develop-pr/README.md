# PR to merge `trunk` to `develop`

This action provides the following functionality for GitHub Actions users:

- Create a PR to merge `trunk` to `develop` after a release done with the `woocommerce/grow/prepare-extension-release`

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
name: PR to merge a released trunk

on:
  pull_request:
    types:
      - closed
    branches:
      - trunk

jobs:
  automerge_trunk:
    runs-on: ubuntu-latest
    steps:
      - uses: woocommerce/grow/merge-trunk-develop-pr@actions-v1
```
