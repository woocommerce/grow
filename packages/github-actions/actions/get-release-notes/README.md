# Get release notes via GitHub API in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Get release notes via GitHub
- Based on package.json, infer the next release version and tag by matching keywords to release notes

## Usage

See [action.yml](action.yml)

#### Basic:

```yaml
on:
  push:
    branches:
      - release/my-tool

jobs:
  EchoRelease:
    name: Echo Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Get release notes
        id: get-notes
        uses: woocommerce/grow/get-release-notes@actions-v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          tag-template: "v{version}"

      - name: Echo release notes
        run: |
          echo '${{ steps.get-notes.outputs.release-notes-shell }}'
          echo '${{ steps.get-notes.outputs.release-changelog-shell }}'
```

:pushpin: Please note that when using release notes in the shell, always use the output with `-shell` suffix and wrap it in single quotes to avoid special characters that may cause problems.

#### Matching version level keywords to infer the next version and tag:

Create a [configuration for the changelog categories](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes#configuring-automatically-generated-release-notes) at `.github/release.yml` in the repository. For example:

```yaml
# .github/release.yml

changelog:
  categories:
    # Major level
    - title: Major Changes
        - major
    - title: Breaking Changes
      labels:
        - breaking

    # Minor level
    - title: Exciting New Features
      labels:
        - feature
    - title: Improvements
      labels:
        - improvement

    # Patch level
    - title: Other Changes
      labels:
        - "*"
```

Matching the `title` by keywords in each level:

```yaml
# A GitHub workflow

on:
  push:
    branches:
      - release/my-tool

jobs:
  EchoRelease:
    name: Echo Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Get release notes
        id: get-notes
        uses: woocommerce/grow/get-release-notes@actions-v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          tag-template: "v{version}"
          major-keywords: major changes, breaking
          minor-keywords: new Features, improvement

      - name: Echo release notes
        run: |
          echo '${{ steps.get-notes.outputs.release-notes-shell }}'
          echo '${{ steps.get-notes.outputs.release-changelog-shell }}'
          echo "${{ steps.get-notes.outputs.next-version }}"
          echo "${{ steps.get-notes.outputs.next-tag }}"
```

Once any of changelog headings (`###` syntax in Markdown) in release notes has a single word starting with the same keyword, the level is matched. If both major and minor cannot be matched, it falls back to patch level. The matched level will be used to determine the next version number.

#### Prepare release commits:

```yaml
on:
  push:
    branches:
      - release/my-tool

jobs:
  CheckCreatedBranch:
    name: Check Created Branch
    runs-on: ubuntu-latest
    steps:
      - name: Check created release branch
        uses: actions/github-script@v7
        with:
          script: |
            if ( ! context.payload.created ) {
              await github.rest.actions.cancelWorkflowRun( {
                ...context.repo,
                run_id: context.runId,
              } );
            }

  PrepareRelease:
    name: Prepare Release
    runs-on: ubuntu-latest
    needs: CheckCreatedBranch
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Get release notes
        id: get-notes
        uses: woocommerce/grow/get-release-notes@actions-v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          tag-template: "v{version}"

      - name: Prepare release commits
        run: |
          TODAY=$(date '+%Y-%m-%d')
          NEXT_VER="${{ steps.get-notes.outputs.next-version }}"
          CHANGELOG='${{ steps.get-notes.outputs.release-changelog-shell }}'

          printf "## ${TODAY} (${NEXT_VER})\n${CHANGELOG}\n\n%s\n" "$(cat CHANGELOG.md)" > CHANGELOG.md
          jq ".version=\"${NEXT_VER}\"" package.json > package.json.tmp
          mv package.json.tmp package.json
          jq ".version=\"${NEXT_VER}\"" package-lock.json > package-lock.json.tmp
          mv package-lock.json.tmp package-lock.json

          git config user.name github-actions
          git config user.email github-actions@users.noreply.github.com
          git add CHANGELOG.md
          git add package.json
          git add package-lock.json
          git commit -q -m "Update changelog and package version for the ${{ steps.get-notes.outputs.next-tag }} release."
          git push
```
