# Branchname to Changelog label

This action sets PR's `type: *` & `changelog: *` labels according to the branch name convention.

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
on:
  pull_request:
    types: opened
jobs:
  SetLabels:
    runs-on: ubuntu-latest
    steps:
      - name: Set Labels
        uses: woocommerce/grow/github-actions/branch-label@add/label-action
```
