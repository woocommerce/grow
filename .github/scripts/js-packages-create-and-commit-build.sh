#!/usr/bin/env bash
set -euo pipefail

REPO_URL=$1
TAG_NAME=$2
PACKAGE_DIR=$3
PACKAGE_NAME=$(basename "$PACKAGE_DIR")
SOURCE_SHA=$(git rev-parse HEAD)

TMP_BRANCH="tmp-js-pkg-release-build-${PACKAGE_NAME}"
TMP_BRANCH_PUSHED=false

cleanup() {
  if [ "$TMP_BRANCH_PUSHED" = true ]; then
    git push -d origin "$TMP_BRANCH" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Use the github-actions bot account to commit.
# https://api.github.com/users/github-actions%5Bbot%5D
git config user.name github-actions[bot]
git config user.email 41898282+github-actions[bot]@users.noreply.github.com

# To move the package to the top directory:
## 1. Delete all files from version control system.
git rm -r .
git commit -q -m "Create the ${TAG_NAME} release build for the \`${PACKAGE_NAME}\` package."

## 2. Get the package files back.
git checkout HEAD^ -- "./${PACKAGE_DIR}"
git restore --staged .

## 3. Remove files not needed in the release build.
##    This includes release-notes-config.yml and all dotfiles (e.g., .jsdocrc.dev.json, .npmrc).
rm -f "./${PACKAGE_DIR}/release-notes-config.yml"
find "./${PACKAGE_DIR}" -maxdepth 1 -name ".*" -not -name "." -exec rm -rf {} +

## 4. Move the package contents to the top directory.
##    The glob * does not match dotfiles, which is fine since step 3 already removed them.
git add "./${PACKAGE_DIR}"
git mv "./${PACKAGE_DIR}"/* ./

## 5. Create the README to point to the source revision of this build.
tee README.md << END
# ${PACKAGE_NAME}
### This is the release build of version \`${TAG_NAME}\`.
### Please visit [here to view the source code of this version](${REPO_URL}/tree/${SOURCE_SHA}/${PACKAGE_DIR}).
END
git add README.md

## 6. Complete the build for release.
git commit -q --amend -C HEAD

# The temporary branch is only for pushing to the remote repo.
# Tagging it with a version tag will be proceeded with a separate step.
git push origin "HEAD:refs/heads/$TMP_BRANCH"
TMP_BRANCH_PUSHED=true

# Deleting the temporary branch is cleanup, so a failure here should not fail an
# otherwise successful release. Leave it best-effort and let the EXIT trap retry.
if git push -d origin "$TMP_BRANCH"; then
  TMP_BRANCH_PUSHED=false
fi
