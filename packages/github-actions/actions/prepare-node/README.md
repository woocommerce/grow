# Prepare Node.js in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Set up Node.js with a specific version
- Load caching npm dependencies
- Run `npm ci` with or without the `--ignore-scripts` option
- Log the version information of `node` and `npm`

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
jobs:
  Build:
    name: Build bundle
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Prepare node
        uses: woocommerce/grow/prepare-node@actions-v2
        with:
          node-version: 20

      - name: Build bundle
        run: npm run build
```

Must specify either `node-version` or `node-version-file` option to set the version.

[Supported version syntax](https://github.com/actions/setup-node/blob/v3/README.md#supported-version-syntax)

#### Specify the node version via a file:

```yaml
steps:
  - name: Checkout repository
  - uses: actions/checkout@v4

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v2
    with:
      node-version-file: ".nvmrc"
```

#### Specify the cache dependency path:

```yaml
steps:
  - name: Checkout repository
  - uses: actions/checkout@v4

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v2
    with:
      node-version: 18
      cache-dependency-path: "./packages/github-actions"
```

#### Skip the `npm ci`

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v2
    with:
      node-version: "lts/*"
      install-deps: "no"

  - name: My task
    run: npm outdated
```

#### Run `npm ci` with the `--ignore-scripts` option

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v2
    with:
      node-version: "latest"
      ignore-scripts: "no"

  - name: My task
    run: npm run lint:js
```
