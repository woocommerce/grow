# Run PHPCS Diff in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Run PHPCS to the changed lines of code in a pull request.
- Set error annotations to a pull request.

## Prerequisites

Install required packages: `dealerdirect/phpcodesniffer-composer-installer` and `exussum12/coverage-checker`.

- `composer require --dev dealerdirect/phpcodesniffer-composer-installer:^v0.7 exussum12/coverage-checker:^1.0`

## Usage

See [action.yml](action.yml)

When a repository is not maintained initially with PHPCS, it could get a lot of errors if introduced. This action allows PHPCS to run only for the changed lines of code in a PR, enabling repository maintenance to introduce PHPCS and then progressively adjust the codebase.

#### Basic:

```yaml
name: PHP Coding Standards - Diff

on:
  pull_request:
    paths:
      - "**.php"

jobs:
  CodingStandardsDiff:
    name: PHP coding standards - diff
    runs-on: ubuntu-latest
    steps:
      - name: Run PHPCS to changed lines of code
        uses: woocommerce/grow/phpcs-diff@actions-v2
```

#### Specify the PHP version:

```yaml
steps:
  - name: Run PHPCS to changed lines of code
    uses: woocommerce/grow/phpcs-diff@actions-v2
    with:
      php-version: 8.1
```
