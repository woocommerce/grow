<?php
/**
 * Plugin Name: Grow Smooth Generator
 * Description: A smooth generator for Grow extension data.
 * Version: 0.1.1
 * Author: Grow
 * Author URI: https://woogrowp2.wordpress.com
 *
 * Tested up to: 6.2
 * Requires PHP: 7.4
 * WC requires at least: 7.5
 * WC tested up to: 7.6
 */

defined( 'ABSPATH' ) || exit;

// Autoloader.
if ( ! class_exists( \WC\Grow\SmoothGenerator\Plugin::class ) ) {
	require __DIR__ . '/vendor/autoload.php';
}

/**
 * Fetch instance of plugin.
 *
 * @return \WC\Grow\SmoothGenerator\Plugin
 */
function wc_grow_smooth_generator() {
	static $instance;

	if ( is_null( $instance ) ) {
		$instance = new \WC\Grow\SmoothGenerator\Plugin( __FILE__ );
	}

	return $instance;
}

/**
 * Init plugin when WordPress loads and PHP requirements are met.
 */
if ( version_compare( PHP_VERSION, '7.4', '>' ) ) {
	add_action(
		'plugins_loaded',
		function () {
			if ( is_plugin_active( 'wc-smooth-generator/wc-smooth-generator.php' ) ) {
				wc_grow_smooth_generator();
			} else {
				add_action( 'admin_notices', 'wc_grow_smooth_generator_notices' );
			}
		},
		20
	);
}

/**
 * Display admin notice with required dependencies.
 */
function wc_grow_smooth_generator_notices() {
	?>
	<div class="notice notice-error">
		<p>Grow Smooth Generator requires the WooCommerce Smooth Generator plugin to be active.</p>
	</div>
	<?php
}
