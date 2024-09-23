/*
 * ============================================================================
 * For validating the `tilde-alias` plugin in the JS package `jsdoc` in this
 * repo.
 * ============================================================================
 */

/**
 * @typedef {import('~/types').CountryCode} CountryCode
 * @typedef {import('.~/types').DateTime} DateTime
 */

/*
 * ============================================================================
 * For validating the `fires-description` plugin and `publish` template in the
 * JS package `tracking-jsdoc` in this repo.
 * ============================================================================
 */

/**
 * Triggered when datepicker (date ranger picker) is updated,
 * with report name and data that comes from `DateRangeFilterPicker`'s `onRangeSelect` callback
 *
 * @event datepicker_update
 * @property {string}      report  Name of the report (e.g. `"dashboard" | "reports-programs" | "reports-products" | "product-feed"`)
 * @property {CountryCode} country Value selected in datepicker.
 * @property {string}      compare Value selected in datepicker.
 * @property {string}      period  Value selected in datepicker.
 * @property {DateTime}    before  Value selected in datepicker.
 * @property {DateTime}    after   Value selected in datepicker.
 */

/**
 * A modal is opened.
 *
 * @event modal_opened
 * @property {string} context Indicates which modal is open
 */

/**
 * A modal is closed.
 *
 * @event modal_closed
 * @property {string} context Indicates which modal is closed
 * @property {string} action  Indicates the modal is closed by what action (e.g. `maybe-later`|`dismiss` | `create-another-campaign`)
 *                            - `maybe-later` is used when the "Maybe later" button on the modal is clicked
 *                            - `dismiss` is used when the modal is dismissed by clicking on "X" icon, overlay, generic "Cancel" button, or pressing ESC
 *                            - `create-another-campaign` is used when the button "Create another campaign" is clicked
 *                            - `create-paid-campaign` is used when the button "Create paid campaign" is clicked
 *                            - `confirm` is used when the button "Confirm", "Save"  or similar generic "Accept" button is clicked
 */
