# Prepare MySQL in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Enable MySQL service
- Handle the authentication compatibility for PHP 7.0-7.3
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
        uses: actions/checkout@v3

      - name: Prepare MySQL
        uses: woocommerce/grow/prepare-mysql@actions-v1

      - name: Create database
        run: mysql -e 'CREATE DATABASE IF NOT EXISTS wordpress_test;' -u root -proot
```
