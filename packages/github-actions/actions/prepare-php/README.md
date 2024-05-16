# Prepare PHP in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Set up PHP with a specific version
- Set up tools like `cs2pr`, `wp-cli`, etc
- Set up coverage driver
- Load caching Composer dependencies
- Run `composer install --prefer-dist --no-interaction`
- Log the version information of `php` and `composer`

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
jobs:
  UnitTests:
    name: Unit tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Prepare PHP
        uses: woocommerce/grow/prepare-php@actions-v2

      - name: Run unit tests
        run: vendor/bin/phpunit
```

#### Specify the PHP version:

```yaml
steps:
  - name: Checkout repository
  - uses: actions/checkout@v4

  - name: Prepare PHP
    uses: woocommerce/grow/prepare-php@actions-v2
    with:
      php-version: 8.1
```

#### Set up with tools

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Prepare PHP
    uses: woocommerce/grow/prepare-php@actions-v2
    with:
      tools: cs2pr

  - name: Coding standards
    run: vendor/bin/phpcs ./* -q --report=checkstyle | cs2pr
```

To use Composer v1, set this parameter with `composer:v1`

[Full list of support tools](https://github.com/shivammathur/setup-php/blob/v2/README.md#wrench-tools-support)

#### Set up coverage driver

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Prepare PHP
    uses: woocommerce/grow/prepare-php@actions-v2
    with:
      coverage: xdebug
```

The `coverage` is `"none"` by default to disable both `Xdebug` and `PCOV`.

[Supported coverage drivers](https://github.com/shivammathur/setup-php/blob/v2/README.md#signal_strength-coverage-support)

#### Skip the `composer install`

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Prepare PHP
    uses: woocommerce/grow/prepare-php@actions-v2
    with:
      install-deps: "no"

  - name: My task
    run: composer update --prefer-dist --no-interaction
```
