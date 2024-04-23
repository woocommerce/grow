# Update version tags in GitHub Actions

This action provides the following functionality for GitHub Actions users:

- Create or update the major and minor version tags onto the release commit.
- Optionally specify the target commit to be set the version tags via a SHA1 value.

## Usage

See [action.yml](action.yml)

When releasing a new version, this action creates or updates the major and minor version tags onto the target commit of the release. For example, if the new release version tag is `v1.2.3`, then this action will:

- Create or update `v1` tag onto the same commit of `v1.2.3` tag.
- Create or update `v1.2` tag onto the same commit of `v1.2.3` tag.

And the `v1.2.2` and `v1.1` would not be changed.

[Using tags for release management](https://docs.github.com/en/actions/creating-actions/about-custom-actions#using-tags-for-release-management)

#### Basic:

```yaml
name: Release my tools

on:
  release:
    types:
      - published
      - edited

jobs:
  UpdateTags:
    name: Build and Update Version Tags
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.release.tag_name }}

      - name: Update version tags
        uses: woocommerce/grow/update-version-tags@actions-v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Trigger by a workflow_run event:

See [github-actions-release.yml](/.github/workflows/github-actions-release.yml) of this repo.

#### Specify the target commit:

See [github-actions-release.yml](/.github/workflows/github-actions-release.yml) of this repo.
