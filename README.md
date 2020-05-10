<h1 align="center">is-unpublished</h1>

<div align="center">

![Build](https://github.com/rzane/is-unpublished/workflows/CI/badge.svg)
![Version](https://img.shields.io/npm/v/is-unpublished)
![License](https://img.shields.io/npm/l/is-unpublished)

</div>

A scripting tool for CI environments to determine if your package needs to be published.

```bash
npm install -g is-unpublished

if is-unpublished; then
  # Do whatever you need to do to publish your package!
fi
```

This tool supports the following package formats:

- [`npm`](https://npmjs.org)
- [`gem`](https://rubygems.org)
- [`hex`](https://hex.pm)

## Github Action

You can also use this package as a Github action.

## Inputs

### `cwd`

The directory your package lives in.

## Outputs

### `name`

The name of your package.

### `version`

The current version of your package.

### `is-unpublished`

Indicates that your package hasn't been published yet.

## Example usage

```yaml
- name: Check
  id: check
  uses: rzane/is-unpublished@v1

- name: Publish
  run: yarn publish
  if: ${{ steps.check.outputs.is-unpublished == 'true' }}

- name: Release
  uses: actions/create-release@v1
  if: ${{ steps.check.outputs.is-unpublished == 'true' }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ steps.check.outputs.version }}
    release_name: v${{ steps.check.outputs.version }}
```
