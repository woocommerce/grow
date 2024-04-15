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