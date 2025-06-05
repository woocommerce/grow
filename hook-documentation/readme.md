# WordPress Hook Documentation

This action generates WordPress hook documentation from the source code of the plugin.

## IO

### Inputs

This action accepts the following inputs:

* `source-directories` – A comma-separated list of directories to scan for hooks. Defaults to `src/`.
* `debug-output` – Whether to output extra debug information. Defaults to `no`. Will still produce debug output if the action fails.

### Outputs

* `hook-docs` – The generated hook documentation. This will be a single file in markdown format.
* `debugging-output` - Debugging output from the action.

## Usage

This action is intended to be used in a workflow that runs on pull requests. It will generate hook documentation from the source code of the plugin and commit it to the repository.

### Example workflow

```yaml
# filename: .github/workflows/php-hook-documentation.yml
name: PHP Hook Documentation Generator

on:
  pull_request:
    paths:
      - "**.php"
      - .github/workflows/php-hook-documentation.yml

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  HookDocumentation:
    name: Hook Documentation Generator
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the repository
        uses: actions/checkout@v4
        with:
          # Checks out a branch instead of a commit in detached HEAD state
          ref: ${{ github.head_ref }}

        # This generates the documentation string. The `id` property is used to reference the output in the next step.
      - name: Generate hook documentation
        id: generate-hook-docs
        uses: woocommerce/grow/hook-documentation@actions-v2
        with:
          debug-output: yes
          source-directories: src/,templates/

      - name: Commit hook documentation
        shell: bash
        # Use the github-actions bot account to commit.
        # https://api.github.com/users/github-actions%5Bbot%5D
        run: |
          git config user.name github-actions[bot]
          git config user.email 41898282+github-actions[bot]@users.noreply.github.com
          echo "${{ steps.generate-hook-docs.outputs.hook-docs }}" > docs/Hooks.md
          git add docs/Hooks.md
          if git diff --cached --quiet; then
            echo "*No documentation changes to commit.*" >> $GITHUB_STEP_SUMMARY
          else
            echo "*Committing documentation changes.*" >> $GITHUB_STEP_SUMMARY
            git commit -q -m "Update hooks documentation from ${{ github.head_ref }} branch."
            git push
          fi
```

## Development

For development of this action, you will need to install the dependencies with Composer:

```bash
composer install
```

### Testing

All of the code for this action is in the `src/` directory. The entry point used by the `action.yml` file is `bin/generate-hook-documentation.php`. This file converts environment variables into proper parameters for the `Documentor` class.

Unit tests are configured using [pest](https://pestphp.com/). There are two options for running tests:

* `composer test` – This is a normal test run, and the test suite will be executed.
* `composer test:coverage` – This will run the test suite and generate a code coverage report in the `coverage` directory. After the coverage report is generated, launch the `coverage/index.html` file in any browser to view the report.

New unit tests should generally be placed in the `tests/Unit/` directory. Files with the suffix `Test.php` will automatically be run by the test suite.

![Unit Test Suite example](/.github/images/hook-documentation-unit-test-run.png)
