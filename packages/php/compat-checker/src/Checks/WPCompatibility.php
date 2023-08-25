<?php
/**
 * WordPress Compatibility Check.
 *
 * @package Automattic/WooCommerce/Grow/Tools
 */

namespace Automattic\WooCommerce\Grow\Tools\Checks;

use Automattic\WooCommerce\Grow\Tools\Exception\IncompatibleException;

defined( 'ABSPATH' ) || exit;

/**
 * The WooCommerce Compatibility Check class.
 */
class WPCompatibility extends CompatCheck {

	/**
	 * Check if the current WordPress version is compatible.
	 */
	private function check_wp_version() {
		global $wp_version;
		if ( version_compare( $this->plugin_data['TestedWP'], $wp_version, '<' ) ) {
			add_action( 'admin_notices', array( $this, 'wp_not_tested' ) );
		}
		return true;
	}

	/**
	 * Display WordPress version not tested warning.
	 */
	public function wp_not_tested() {
		global $wp_version;

		$plugin_name    = $this->plugin_data['Name'];
		$plugin_version = $this->plugin_data['Version'];

		$message = sprintf(
			/* translators: %1$s - Plugin Name, %2$s - Plugin version, %3$s - WordPress version number */
			esc_html__( '%1$s - %2$s is untested with WordPress %3$s.', 'woogrow-compat-checker' ),
			'<strong>' . $plugin_name . '</strong>',
			$plugin_version,
			$wp_version
		);

		$this->add_admin_notice(
			'wordpress-untested',
			'warning',
			$message
		);
	}

	/**
	 * Run all compatibility checks.
	 *
	 * @return bool
	 */
	protected function run_checks() {
		try {
			$this->check_wp_version();
			return true;
		} catch ( IncompatibleException $e ) {
			return false;
		}
	}
}
