<?php
namespace WC\Grow\SmoothGenerator;

use WP_CLI_Command;

/**
 * WP-CLI Integration class
 */
class CLI extends WP_CLI_Command {

	/**
	 * Conditionally load commands for each extension.
	 */
	public function __construct() {
		if ( defined( 'AUTOMATEWOO_VERSION' ) ) {
			CLI\AutomateWoo::add_commands();
		}
	}
}
