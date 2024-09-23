#!/usr/bin/env bash

# The value of TAG_NAME and the content composited from it are described in terms of
# the official release build. When creating a test build, a branch name is passed in,
# but the related contents won't be adjusted to make the result as close as possible
# to the official release build.
REPO_URL=$1
TAG_NAME=$2
SOURCE_SHA=$(git rev-parse HEAD)

# To build all actions:

pushd ./packages/github-actions

## 1. Build the JavaScript actions.
npm ci --ignore-scripts
npm run build

## 2. Build the PHP actions into .zip files.
./build-php-actions.sh

popd

# Use the github-actions bot account to commit.
# https://api.github.com/users/github-actions%5Bbot%5D
git config user.name github-actions[bot]
git config user.email 41898282+github-actions[bot]@users.noreply.github.com

# To move all actions to the top directory:
## 1. Delete all files from version control system.
git rm -r .
git commit -q -m "Create the ${TAG_NAME} release build for the \`github-actions\` package."

## 2. Get all actions back.
git checkout HEAD^ -- ./packages/github-actions/actions
git restore --staged .

## 3. Avoid committing src directories to the build.
echo "/packages/github-actions/actions/*/src" > .gitignore

## 4. Unzip all of the PHP actions and replace them.
for zipFile in $(find ./packages/github-actions/actions -name "*.zip" -mindepth 1 -maxdepth 1) ; do
  actionDir="${zipFile%.*}"
  rm -rf $actionDir
  unzip $zipFile -d ./packages/github-actions/actions
  rm $zipFile
  echo "${actionDir}/src" | sed -e "s/^\.\//!/g" >> .gitignore
done

## 5. Move all actions to the top directory.
git add ./packages/github-actions/actions
git mv ./packages/github-actions/actions/* ./

## 6. Create the README to point to the source revision of this build.
tee README.md << END
# Custom GitHub actions
### This is the release build of version \`${TAG_NAME}\`.
### :pushpin: Please visit [here to view the source code of this version](${REPO_URL}/tree/${SOURCE_SHA}/packages/github-actions).
END
git add README.md

## 7. Complete the build for release or test.
git commit -q --amend -C HEAD

# The temporary `tmp-gha-release-build` branch is only for pushing to the remote repo.
# Tagging it with a version tag will be proceeded with a separate step.
git push origin HEAD:refs/heads/tmp-gha-release-build
git push -d origin tmp-gha-release-build
