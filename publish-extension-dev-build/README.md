# Publish extension development build

This action provides the following functionality for GitHub Actions users:

- Publish or update the extension development build via a pre-release on GitHub.

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

      - uses: woocommerce/grow/publish-extension-dev-build@actions-v1
        with:
          extension-asset-path: my-extension.zip

```
