# Changelog

## 2022-07-05 (1.1.0)
### New Features 🎉
* Add a GitHub action for adding branch type labels. (https://github.com/woocommerce/grow/pull/14)
* Add escaped outputs `release-notes-shell` and `release-changelog-shell` for the get-release-notes action. (https://github.com/woocommerce/grow/pull/20)
* Add release process for the `github-actions` package. (https://github.com/woocommerce/grow/pull/22)
### Bug Fixes 🐛
* Fix the issue that unescaped chars may break the release preparation of `github-actions` package. (https://github.com/woocommerce/grow/pull/21)

## 2022-06-23 (1.0.0)
### New Features 🎉
* Add custom GitHub actions for reuse across repositories. (https://github.com/woocommerce/grow/pull/11)
* Add GitHub action and workflow for the versioning management of the reusable custom actions. (https://github.com/woocommerce/grow/pull/12)
* Add an action and a GitHub workflow to get release notes via GitHub and prepare release content. (https://github.com/woocommerce/grow/pull/16)
* Add a new custom action `phpcs-diff` to run PHPCS to the changed lines of code in a PR. (https://github.com/woocommerce/grow/pull/17)
### Tweaked 🔧
* Tweak the `update-version-tags` action and the `github-actions-release` workflow. (https://github.com/woocommerce/grow/pull/18)