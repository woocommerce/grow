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
To document what or when is emitted with `@fires` or `@emmits`.
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