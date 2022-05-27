<?php
/**
 * Ventures Bootstrap file for Woorelease extensions.
 */

use WooCommerce\Ventures\WR\Commands\VersionReplace;

require_once __DIR__ . '/vendor/autoload.php';

return [
	new VersionReplace(),
];
