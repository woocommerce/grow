#! /usr/bin/env node
/**
 * Internal dependencies
 */
 import { shell } from '../../utils.js'

 shell.exec("jsdoc -r ./js/src -c .jsdocrc.json -t woocommerce-grow-tracking-jsdoc");
