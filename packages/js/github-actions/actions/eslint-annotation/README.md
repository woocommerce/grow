# ESLint formatter to annotate the linting results in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Annotate the errors and warnings of eslint results in GitHub Actions.

## Usage

See [action.yml](action.yml)

## Compatibility

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
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - uses: woocommerce/grow/eslint-annotation@actions-v1
        with:
          formatter-dest: "./my-formatter.cjs"
      - run: eslint --format ./my-formatter.cjs src
```

Uses .cjs to ensure the formatter script will be imported as a CommonJS module.
