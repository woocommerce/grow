# Prepare MySQL in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Enable MySQL service
- Handle the authentication compatibility for PHP 7.0-7.3
  - MySQL 8.0 (for example `ubuntu-24.04`): sets `default_authentication_plugin=mysql_native_password`.
  - MySQL 8.4 (for example `ubuntu-26.04`): turns on `mysql_native_password` and makes it the default with `authentication_policy`.
  - MySQL 9.0 and newer: skipped, as MySQL removed `mysql_native_password`. Users keep `caching_sha2_password`.
- Log the version information

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
jobs:
  UnitTests:
    name: Unit tests with database
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Prepare MySQL
        uses: woocommerce/grow/prepare-mysql@actions-v3

      - name: Create database
        run: mysql -e 'CREATE DATABASE IF NOT EXISTS wordpress_test;' -u root -proot
```
