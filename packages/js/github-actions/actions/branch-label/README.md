# Branchname to Changelog label

This action sets PR's `type: *` & `changelog: *` labels according to the branch name convention.

Branch names starting
- `(breaking|add|update|fix|tweak|doc)/` get `changelog: *`
- `release/` get `changelog: none`
- `add/` get also `type: enhancement`
- `fix/` get also `type: bug`
- `doc/` get also `type: documentation`

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
        uses: woocommerce/grow/branch-label@actions-v1
```
