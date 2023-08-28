<?php
/**
 * The Compatibility Checker tool.
 *
 * @package Automattic/WooCommerce/Grow/Tools
 */

namespace Automattic\WooCommerce\Grow\Tools;

use Automattic\WooCommerce\Grow\Tools\Checks\WPCompatibility;
use Automattic\WooCommerce\Grow\Tools\Checks\WCCompatibility;

defined( 'ABSPATH' ) || exit;

/**
 * The CompatChecker class.
 */
class CompatChecker {

	/** @var CompatChecker The class instance. */
	private static $instance;

	/**
	 * The Plugin instance.
	 *
	 * @return CompatChecker
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
		$default_headers = array(
			'Name'        => 'Plugin Name',
			'Version'     => 'Version',
			'RequiresWP'  => 'Requires at least',
			'RequiresPHP' => 'Requires PHP',
			'RequiresWC'  => 'WC requires at least',
			'TestedWP'    => 'Tested up to',
			'TestedWC'    => 'WC tested up to',
		);

		$transient_key = 'wc_grow_compat_checker_' . $plugin_file . $file_version;
		$plugin_data   = get_transient( $transient_key );

		if ( false === $plugin_data ) {
			$plugin_data = get_file_data( $plugin_file, $default_headers, 'plugin' );
			set_transient( $transient_key, $plugin_data, YEAR_IN_SECONDS );
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
		$checks      = array(
			WPCompatibility::class,
			WCCompatibility::class,
		);
		$plugin_data = $this->get_plugin_data( $plugin_file_path );

		foreach ( $checks as $compatibility ) {
			if ( ! $compatibility::instance()->is_compatible( $plugin_data ) ) {
				return false;
			}
		}

		return true;
	}
}
