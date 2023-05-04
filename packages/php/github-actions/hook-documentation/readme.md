# WordPress Hook Documentation

This action generates WordPress hook documentation from the source code of the plugin.

## IO

### Inputs

This action accepts the following inputs:

* `source-directories` – A comma-separated list of directories to scan for hooks. Defaults to `src/`.
* `main-branch` – The name of the main branch. Defaults to `main`.
* `debug-output` – Whether to output extra debug information. Defaults to `no`. Will still produce debug output if the action fails.

### Outputs

* `hook-docs` – The generated hook documentation. This will be a single file in markdown format.
* `debugging-output` - Debugging output from the action.

## Development



## Usage

Sample yaml file:

```yaml
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
        uses: actions/checkout@v3
        with:
          ref: ${{ github.head_ref }}

      - name: Generate hook documentation
        id: generate-hook-docs
        uses: woocommerce/grow/packages/php/github-actions/hook-documentation@feature/hook_helper
        with:
          debug-output: yes
          source-directories: src/,templates/
          main-branch: develop

      - name: Commit hook documentation
        shell: bash
        run: |
          git config user.name github-actions
          git config user.email github-actions@users.noreply.github.com
          echo "${{ steps.generate-hook-docs.outputs.hook-docs }}" > docs/Hooks.md
          git add docs/Hooks.md
          if git diff --cached --quiet; then
            echo "*No documentation changes to commit.*" >> $GITHUB_STEP_SUMMARY
          else
            echo "*Committing documentation changes.*" >> $GITHUB_STEP_SUMMARY
            git commit -q -m "Update hooks documentation from ${{ steps.get-notes.outputs.next-tag }} branch."
            git push
          fi
```
