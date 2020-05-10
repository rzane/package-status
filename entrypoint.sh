#!/bin/sh -l

if is-unpublished "$@"; then
  echo "::set-output name=is-unpublished::true"
else
  echo "::set-output name=is-unpublished::false"
fi
