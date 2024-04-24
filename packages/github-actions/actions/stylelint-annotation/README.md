# Stylelint formatter to annotate the linting results in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Annotate the errors and warnings of stylelint results in GitHub Actions.

## Usage

See [action.yml](action.yml)

## Compatibility

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - uses: woocommerce/grow/stylelint-annotation@actions-v2
        with:
          formatter-dest: "./my-formatter.cjs"
      - run: stylelint --custom-formatter ./my-formatter.cjs "**/*.css"
```

Uses .cjs to ensure the formatter script will be imported as a CommonJS module.
