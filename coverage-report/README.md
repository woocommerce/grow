# Unit Test Coverage Report in GitHub Actions

This action adds a Unit test coverage report to the PR as a comment. The coverage report must be in the clover format.
For main branches (trunk) the coverage report will be uploaded as a GitHub artifact. When the action is run as part of a PR the artifact from the main branch will be downloaded, and use as a comparison with the report in the current PR.
This final report will be added to the PR as a comment.

## Usage

See [action.yml](action.yml)

By default the artifact will be saved as `coverage-report` and the report will be found in the file `tests/coverage/report.xml`. The options `report-file`, `report-path` and `report-name` can be adjusted if we need to have multiple reports (one for JS unit tests and another for PHP unit tests).

The parameter workflow must point to the current workflow file, which indicates where to save the downloaded artifact so it can be used in the comparison between branches.

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

      - name: Run unit tests (with coverage report)
        run: phpdbg -qrr vendor/bin/phpunit --coverage-clover=tests/coverage/report.xml

      - name: PHP unit coverage report
        uses: woocommerce/grow/coverage-report@actions-v2
        with:
          base-branch: trunk
          test-comment: "PHP unit test coverage"
          workflow: .github/workflows/php-unit-tests.yml # Point to the current workflow
```
