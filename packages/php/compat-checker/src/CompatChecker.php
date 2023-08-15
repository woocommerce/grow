<?php
/**
 * The Compatibility Checker tool.
 *
 * @package Automattic/WooCommerce/Grow/Tools
 */

namespace Automattic\WooCommerce\Grow\Tools;

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
}
