<?php
/**
 * The Compatibility Checker tool.
 *
 * @package Automattic/WooCommerce/Grow/Tools
 */

namespace Automattic\WooCommerce\Grow\Tools\CompatChecker\v0_0_1;

use Automattic\WooCommerce\Grow\Tools\CompatChecker\v0_0_1\Checks\WPCompatibility;
use Automattic\WooCommerce\Grow\Tools\CompatChecker\v0_0_1\Checks\WCCompatibility;

defined( 'ABSPATH' ) || exit;

/**
 * The CompatChecker main class.
 */
class Checker {

	/**
	 * The Checker instance.
	 *
	 * @var Checker
	 */
	private static $instance;

	/**
	 * The Plugin instance.
	 *
	 * @return Checker
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Parses the plugin contents to retrieve plugin's metadata.
	 *
	 * @param string $plugin_file  The Absolute path to the main plugin file.
	 * @param string $file_version The plugin file version. Can be the same as the plugin version.
	 */
	public function get_plugin_data( $plugin_file, $file_version ) {
		$default_headers = [
			'Name'        => 'Plugin Name',
			'Version'     => 'Version',
			'RequiresWP'  => 'Requires at least',
			'RequiresPHP' => 'Requires PHP',
			'RequiresWC'  => 'WC requires at least',
			'TestedWP'    => 'Tested up to',
			'TestedWC'    => 'WC tested up to',
		];

		$transient_key = 'wc_grow_compat_checker_' . plugin_basename( $plugin_file ) . $file_version;
		$plugin_data   = get_transient( $transient_key );

		if ( false === $plugin_data ) {
			$plugin_data         = get_file_data( $plugin_file, $default_headers, 'plugin' );
			$plugin_data['File'] = $plugin_file;
			set_transient( $transient_key, $plugin_data, MONTH_IN_SECONDS );
		}

		return $plugin_data;
	}

	/**
	 * Runs all compatibility checks.
	 *
	 * @param string $plugin_file_path The Absolute path to the main plugin file.
	 * @param string $file_version     The plugin file version. Can be the same as the plugin version.
	 *
	 * @return bool
	 */
	public function is_compatible( $plugin_file_path, $file_version ) {
		$checks          = [
			WPCompatibility::class,
			WCCompatibility::class,
		];
		$plugin_data     = $this->get_plugin_data( $plugin_file_path, $file_version );
		$plugin_basename = plugin_basename( $plugin_file_path );

		// Remove dismissable notices on plugin deactivation.
		register_deactivation_hook(
			$plugin_file_path,
			[
				WCCompatibility::instance( $plugin_basename ),
				'remove_dismissable_notices',
			]
		);

		// Run all compatibility checks.
		foreach ( $checks as $compatibility ) {
			if ( ! $compatibility::instance( $plugin_basename )->is_compatible( $plugin_data ) ) {
				return false;
			}
		}

		return true;
	}
}
