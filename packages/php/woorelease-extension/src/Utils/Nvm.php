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
	 * @param string $grow_root_path Path to the root of the Grow project.
	 *
	 * @return bool True if `nvm` is installed, false otherwise.
	 */
	public static function does_nvm_exist( $grow_root_path ) {
		try {
			Utils::exec_sprintf( "{$grow_root_path}/bin/nvm -e" );
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}
}
