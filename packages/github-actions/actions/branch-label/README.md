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
  pull_request_target:
    types: opened

jobs:
  SetLabels:
    permissions:
      contents: read
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - name: Set Labels
        uses: woocommerce/grow/branch-label@actions-v2
```

#### Permissions:

It's recommended to use the `pull_request_target` event instead of `pull_request` to avoid the issue of not having permission to add labels to pull requests.

Ref:
- https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request_target
- https://github.com/actions/labeler/tree/v5#permissions

## Migration from v1 to v2:

```diff
-  pull_request:
+  pull_request_target:
     types: opened

 jobs:
   SetLabels:
+    permissions:
+      contents: read
+      pull-requests: write
     runs-on: ubuntu-latest
     steps:
       - name: Set Labels
-        uses: woocommerce/grow/branch-label@actions-v1
+        uses: woocommerce/grow/branch-label@actions-v2
```
