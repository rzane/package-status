# package-status

This is a GitHub action that will allow you to publish your package whenever the version number changes.

It will detect the current version of your package and check the package registry for a corresponding entry.

## Inputs

### `name`

**Required** The name of your package

### `type`

**Required** The type of package you are developing. Must be one of the following:

- [`gem`](https://rubygems.org)
- [`npm`](https://npmjs.org)
- [`hex`](https://hex.pm)

### `cwd`

Use this if your package lives in a subdirectory.

## Outputs

### `version`

Reflects the version that is specified in the committed code.

### `published`

Indicates that the current version has already been published.

## Example usage

uses: package-status
with:
name: "my-npm-package"
type: "npm"
