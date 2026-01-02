# Auto merge a released trunk

This action provides the following functionality for GitHub Actions users:

- Automatically merge trunk to develop after a release done with the `woocommerce/grow/prepare-extension-release`

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
name: Auto merge a released trunk

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
      - uses: woocommerce/grow/automerge-released-trunk@actions-v2
```
