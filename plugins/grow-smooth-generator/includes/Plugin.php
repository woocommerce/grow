<?php
namespace WC\Grow\SmoothGenerator;

/**
 * Main plugin class.
 */
class Plugin {

	/**
	 * Constructor.
	 *
	 * @param string $file Main plugin __FILE__ reference.
	 */
	public function __construct( $file ) {
		if ( class_exists( 'WP_CLI' ) ) {
			$cli = new CLI();
		}
	}
}
