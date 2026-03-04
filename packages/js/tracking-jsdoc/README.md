# woocommerce-grow-tracking-jsdoc

JSDoc template to report Tracking events to markdown file.

## Usage

0. `npm i jsdoc` and configure jsdoc according to your source code, so the `npx jsdoc ./your/source/` runs successfully.
1. Install or link this package via npm
2. Add your `/TRACKING.md` template

   ```md
   # Usage Tracking
   
   Some nice general description.
   
   <woocommerce-grow-tracking-jsdoc></woocommerce-grow-tracking-jsdoc>
   ```
3. Generate the docs
   ```sh
   jsdoc -r your/source/files/ -t ./node_modules/woocommerce-grow-tracking-jsdoc
   ```



## Config

You may add any of the following properties to your JSDoc config (`.jsdocrc.json`) to change those default values:
```js
{
  "templates": {
    "woocommerce-grow-tracking-jsdoc": {
      // Path to the markdown file to which the tracking events' docs should be added
      "path": "TRACKING.md",
      // Pattern to be used to match the content to be replaced. The groups are respectively: start marker, replaceable content, end marker.
      "replacement": "(<woocommerce-grow-tracking-jsdoc(?:\\s[^>]*)?>)([\\s\\S]*)(<\\/woocommerce-grow-tracking-jsdoc.*>)"
    }
  }
```
Then make sure `jsdoc` uses it, by `jsdoc -r your/source/files/ -c .jsdocrc.json`.

## Emitters
If you would like to add some descriptions to `@fires` or `@emits` tags, for example to specify what data is attached to the event, add `fires-description` to your plugins list:

```json
{
  "plugins": [
    // To be able to add descriptions to `@fires` & `@emits`
    "woocommerce-grow-tracking-jsdoc/fires-description"
  ],
  // …
```

## Release

### Official release process

1. Create the branch `release/tracking-jsdoc` onto the target revision on `trunk` branch.
1. When the branch is created, [the prepare workflow](https://github.com/woocommerce/grow/actions/workflows/js-packages-prepare-release.yml) will prepend changelog, update the version in package.json, and create a release PR.
1. Check if the new changelog content and updated version are correct.
   - If something needs to be revised, append the changes in the release PR.
1. Approve the release PR to trigger [the create release workflow](https://github.com/woocommerce/grow/actions/workflows/js-packages-create-release.yml).
1. After the new release is created, [the release workflow](https://github.com/woocommerce/grow/actions/workflows/js-packages-release.yml) will create the release build, update the version tags, and merge the release PR automatically.

### Testing the release process

1. Create a new release with a prerelease version tag. For example `tracking-jsdoc-vX.Y.Z-pre`.
1. Check if the "JS Packages - Release" workflow runs successfully.
1. Delete the testing releases and tags once they are no longer in use.
