# Stylelint formatter to annotate the linting results in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Annotate the errors and warnings of stylelint results in GitHub Actions.

## Usage

See [action.yml](action.yml)

## Compatibility

The formatter loads `stylelint` from the caller repo. It first looks next to the formatter file. When `stylelint` isn’t there, for example when pnpm installs it only as a dependency of another package such as `@wordpress/scripts`, it loads `stylelint` from the running `stylelint` command.

- `stylelint` >= 13

#### Basic:

```yaml
name: Stylelint

on:
  pull_request:

jobs:
  stylelint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
      - run: npm ci
      - uses: woocommerce/grow/stylelint-annotation@actions-v3
        with:
          formatter-dest: "./my-formatter.cjs"
      - run: stylelint --custom-formatter ./my-formatter.cjs "**/*.css"
```

Uses .cjs to ensure the formatter script will be imported as a CommonJS module.
