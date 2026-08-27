# Publish extension development build

This action provides the following functionality for GitHub Actions users:

- Publish or update the extension development build via a pre-release on GitHub.

## Prerequisites

This action references a sibling action through GitHub's self repository syntax (`$/`), which is not available on GitHub Enterprise Server.

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
on:
  push:
    branches:
      - develop

jobs:
  PublishDevBuild:
    name: Publish Dev Build
    runs-on: ubuntu-latest
    steps:
      # build extension
      - run: npm run build

      - uses: woocommerce/grow/publish-extension-dev-build@actions-v3
        with:
          extension-asset-path: my-extension.zip

```
