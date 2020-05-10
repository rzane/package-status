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

### Publish to NPM

Make sure to set `NPM_TOKEN` in your repo settings.

```yaml
- name: Setup Node
  uses: actions/setup-node@v1
  with:
    node-version: 12
    registry-url: https://registry.npmjs.org

- name: Check
  id: check
  uses: rzane/is-unpublished@v1

- name: Publish
  run: yarn install && yarn publish --access public
  if: ${{ steps.check.outputs.is-unpublished == 'true' }}
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

- name: Release
  uses: actions/create-release@v1
  if: ${{ steps.check.outputs.is-unpublished == 'true' }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ steps.check.outputs.version }}
    release_name: v${{ steps.check.outputs.version }}
```

### RubyGems

Make sure to set `RUBYGEMS_TOKEN` in your repo settings.

```yaml
- name: Setup Ruby
  uses: actions/setup-ruby@v1
  with:
    ruby-version: 2.6.x
    registry-url: https://registry.npmjs.org

- name: Check
  id: check
  uses: rzane/is-unpublished@v1

- name: Publish
  if: ${{ steps.check.outputs.is-unpublished == 'true' }}
  run: |
    mkdir -p $HOME/.gem
    touch $HOME/.gem/credentials
    chmod 0600 $HOME/.gem/credentials
    printf -- "---\n:rubygems_api_key: ${RUBYGEMS_TOKEN}\n" > $HOME/.gem/credentials
    gem build *.gemspec
    gem push *.gem
  env:
    RUBYGEMS_TOKEN: ${{ secrets.RUBYGEMS_TOKEN }}

- name: Release
  if: ${{ steps.check.outputs.is-unpublished == 'true' }}
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ steps.check.outputs.version }}
    release_name: v${{ steps.check.outputs.version }}
```
