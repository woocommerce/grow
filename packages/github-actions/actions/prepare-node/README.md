# Prepare Node.js in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Set up Node.js with a specific version
- Detect whether the repo uses npm or pnpm, and set up pnpm when needed
- Load caching npm or pnpm dependencies
- Run `npm ci` or `pnpm install --frozen-lockfile` with or without the `--ignore-scripts` option
- Log the version information of `node`, `npm` and `pnpm`

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
        uses: actions/checkout@v6

      - name: Prepare node
        uses: woocommerce/grow/prepare-node@actions-v3
        with:
          node-version: 24

      - name: Build bundle
        run: npm run build
```

Must specify either `node-version` or `node-version-file` option to set the version.

[Supported version syntax](https://github.com/actions/setup-node/blob/v6/README.md#supported-version-syntax)

#### Specify the node version via a file:

```yaml
steps:
  - name: Checkout repository
  - uses: actions/checkout@v6

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v3
    with:
      node-version-file: ".nvmrc"
```

#### Specify the cache dependency path:

```yaml
steps:
  - name: Checkout repository
  - uses: actions/checkout@v6

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v3
    with:
      node-version: 24
      cache-dependency-path: "./packages/github-actions"
```

#### Skip the `npm ci`

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v6

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v3
    with:
      node-version: "lts/*"
      install-deps: "no"

  - name: My task
    run: npm outdated
```

#### Run `npm ci` without the `--ignore-scripts` option

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v6

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v3
    with:
      node-version: "latest"
      ignore-scripts: "no"

  - name: My task
    run: npm run lint:js
```

#### Use pnpm

The action uses pnpm when the `packageManager` field in package.json names pnpm, or when the repo has a `pnpm-lock.yaml` and no `package-lock.json`. It installs the pnpm version from the `packageManager` field, so that field is required for pnpm. pnpm 11 needs Node.js 22.13 or later.

```json
{
  "packageManager": "pnpm@11.29.0"
}
```

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v6

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v3
    with:
      node-version-file: ".nvmrc"

  - name: Build bundle
    run: pnpm run build
```

With `install-deps: "no"`, pnpm is still set up, but its store is not cached.

#### Choose the package manager

Set `package-manager` to `npm` or `pnpm` to skip the detection. The default is `auto`.

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v6

  - name: Prepare node
    uses: woocommerce/grow/prepare-node@actions-v3
    with:
      node-version: 24
      package-manager: "npm"
```
