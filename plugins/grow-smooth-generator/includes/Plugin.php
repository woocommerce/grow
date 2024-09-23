<?php
namespace WC\Grow\SmoothGenerator;

/**
 * Main plugin class.
 */
class Plugin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( class_exists( 'WP_CLI' ) ) {
			$cli = new CLI();
		}
	}
}
