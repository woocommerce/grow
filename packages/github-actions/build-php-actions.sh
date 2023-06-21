#!/usr/bin/env bash

# Loop through all directories, building the package for each one if it has composer.json.
for d in $(find ./actions -mindepth 1 -maxdepth 1 -type d) ; do
  pushd $d
  baseDir=$(basename $d)

  if [ -e composer.json ]; then
    rm -rf build/*
    composer install --no-dev -no
    composer archive --format=zip --dir=build
    cd build
    find . -name "*.zip" -exec unzip -d $baseDir {} \;
    rm *.zip
    zip -r $baseDir $baseDir
    rm -rf $baseDir
    mv $baseDir.zip ../../
  fi
  popd
done
