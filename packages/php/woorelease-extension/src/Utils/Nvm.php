<?php
/**
 * NVM class.
 *
 * @package Automattic\WooCommerce\Grow\WR\Utils
 */

namespace Automattic\WooCommerce\Grow\WR\Utils;

use Exception;
use WR\Tools\Utils;

/**
 * Class NVM
 *
 * Check if `nvm` CLI tool is installed.
 */
class Nvm {

	/**
	 * Checks if `nvm` is installed.
	 *
	 * @return bool True if `nvm` is installed, false otherwise.
	 */
	public static function does_nvm_exist() {
		try {
			Utils::exec_sprintf( './nvm -e' );
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Runs `nvm use` command.
	 *
	 * @return bool True if `nvm use` succeeded, false otherwise.
	 */
	public static function use() {
		try {
			Utils::exec_sprintf( './nvm -u' );
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}
}
