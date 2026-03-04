# woocommerce-grow-jsdoc

A bundle of commonly used JSDoc plugins and a command to glue as much as possible together.

## Usage

1. Install or link the package via npm
2. Add your `/TRACKING.md` template

   ```md
   # Usage Tracking
   
   Some nice general description.
   
   <woocommerce-grow-tracking-jsdoc></woocommerce-grow-tracking-jsdoc>
   ```
3. Add the `jsdocrc.json` with the list of plugins (and their config if needed)
   ```json
   {
      "plugins": [
         "woocommerce-grow-jsdoc/tilde-alias",
         "woocommerce-grow-tracking-jsdoc/fires-description",
         "jsdoc-plugin-typescript",
         "jsdoc-advanced-types-plugin",
         "jsdoc-plugin-intersection"
      ],
      "typescript": {
         "moduleRoot": "./js/src"
      }
   }
   ```
4. Generate the docs
   ```sh
   woocommerce-grow-jsdoc ./js/src
   ```

## Included plugins

### `~` Alias
`woocommerce-grow-jsdoc/tilde-alias`

If your codebase uses a `.~` or `~` alias for the root directory, you may use `tilde-alias`.

```js
{
  "plugins": [
    "woocommerce-grow-jsdoc/tilde-alias"
  ],
  // …
```

### Bundled external plugins
Plugins implemented elsewhere, that are bundled here for easier use


### Event emitters descriptions
[`woocommerce-grow-tracking-jsdoc/fires-description`](https://github.com/woocommerce/grow/tree/add/jsdoc/packages/js/tracking-jsdoc#emitters)
To document what or when is emitted with `@fires` or `@emits`.
#### Imported types
`jsdoc-plugin-typescript`

If your codebase uses TS-style of importing types `{import('foo').bar}`, you will most probably get an error, like:
```
ERROR: Unable to parse a tag's type expression for source file … Invalid type expression "import('foo').bar"
```

To mitigate that use the `jsdoc-plugin-typescript` plugin to skip those.
```js
{
  "plugins": [
    "jsdoc-plugin-typescript"
  ],
  "typescript": {
    "moduleRoot": "./js/src" // Path to your module's root directory.
  }
  // …
```

####  TypeScript type definitions
[`jsdoc-advanced-types-plugin`](https://github.com/tomalec/jsdoc-advanced-types-plugin#add/return-support)
To support 
```js
/* @param {(property : string) => string[]}
```

#### Types intersections
[`jsdoc-plugin-intersection`](https://www.npmjs.com/package/jsdoc-plugin-intersection)
To support
```js
 /* @param {SomeClass & {abc: 123}}
```

## Release

### Official release process

1. Create the branch `release/jsdoc` onto the target revision on `trunk` branch.
1. When the branch is created, [the prepare workflow](https://github.com/woocommerce/grow/actions/workflows/js-packages-prepare-release.yml) will prepend changelog, update the version in package.json and package-lock.json, and create a release PR.
1. Check if the new changelog content and updated version are correct.
   - If something needs to be revised, append the changes in the release PR.
1. Approve the release PR to trigger [the create release workflow](https://github.com/woocommerce/grow/actions/workflows/js-packages-create-release.yml).
1. After the new release is created, [the release workflow](https://github.com/woocommerce/grow/actions/workflows/js-packages-release.yml) will create the release build, update the version tags, and merge the release PR automatically.

### Testing the release process

1. Create a new release with a prerelease version tag. For example `jsdoc-vX.Y.Z-pre`.
1. Check if the "JS Packages - Release" workflow runs successfully.
1. Delete the testing releases and tags once they are no longer in use.
