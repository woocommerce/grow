# Grow Smooth Generator
A smooth generator for Grow extension data using WP-CLI.

## Installation
Grow Smooth Generator requires Composer and WP-CLI to function. The [WooCommerce Smooth Generator](https://github.com/woocommerce/wc-smooth-generator#readme) must be installed and activated.

1. Copy this plugin into your site's plugins folder
2. From command line CD into the plugin folder
3. Run `composer install` and wait for the installation to complete
4. Run `wp plugin activate grow-smooth-generator` to activate the plugin
5. You now have access to a couple of new WP-CLI commands under the main `wp wc generate` command.

## Commands

### AutomateWoo Conversions

Generate conversions based on the number of conversions parameter.
- `wp wc generate aw-conversions <nr of conversions> --workflow=<workflow ID>`

Generate conversions with random dates between `--date-start` and the current date.
- `wp wc generate aw-conversions <nr of conversions> --workflow=<workflow ID> --date-start=2020-04-01`

Generate conversions with random dates between `--date-start` and `--date-end`.
- `wp wc generate aw-conversions <nr of conversions> --workflow=<workflow ID> --date-start=2020-04-01 --date-end=2020-04-24`
