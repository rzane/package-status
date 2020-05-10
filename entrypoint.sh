#!/bin/sh -l

version=$(is-unpublished --print-version)
echo "::set-output name=version::$version"

if is-unpublished "$@"; then
  echo "::set-output name=is-unpublished::true"
else
  echo "::set-output name=is-unpublished::false"
fi
