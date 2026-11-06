# Prepare MySQL in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Enable MySQL service
- Log the version information

The `root` user (password `root`) keeps MySQL's default authentication method, `caching_sha2_password`. PHP 7.4 and newer support it.

### Upgrading from v3

v3 switched `root` to `mysql_native_password` so PHP 7.0-7.3 could connect. MySQL 8.4 turned that method off by default and MySQL 9.0 removed it, so v4 no longer does this.

If your workflow tests PHP 7.3 or older against this MySQL, keep this one action on `woocommerce/grow/prepare-mysql@actions-v3`. That tag points to 3.0.7, which works on `ubuntu-24.04` and `ubuntu-26.04`. Your other grow actions can still move to v4.

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
        uses: woocommerce/grow/prepare-mysql@actions-v4

      - name: Create database
        run: mysql -e 'CREATE DATABASE IF NOT EXISTS wordpress_test;' -u root -proot
```
