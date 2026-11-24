# ESLint formatter to annotate the linting results in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Annotate the errors and warnings of eslint results in GitHub Actions.

## Usage

See [action.yml](action.yml)

## Compatibility

The formatter loads `eslint` from the caller repo. It first looks next to the formatter file. When `eslint` isn’t there, for example when pnpm installs it only as a dependency of another package such as `@wordpress/scripts`, it loads `eslint` from the running `eslint` command.

- `eslint` >= 7

#### Basic:

```yaml
name: ESLint

on:
  pull_request:

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
      - run: npm ci
      - uses: woocommerce/grow/eslint-annotation@actions-v3
        with:
          formatter-dest: "./my-formatter.cjs"
      - run: eslint --format ./my-formatter.cjs src
```

Uses .cjs to ensure the formatter script will be imported as a CommonJS module.
