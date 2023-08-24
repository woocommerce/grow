<?php
/**
 * WooCommerce Compatibility Check.
 *
 * @package Automattic/WooCommerce/Grow/Tools
 */

namespace Automattic\WooCommerce\Grow\Tools\Checks;

use Automattic\WooCommerce\Grow\Tools\Exception\IncompatibleException;

defined( 'ABSPATH' ) || exit;

/**
 * The WooCommerce Compatibility Check class.
 */
class WCCompatibility extends CompatCheck {

	/** @var int|float The miniumum supported WooCommerce versions before the latest. */
	private $min_wc_semver = 2; // By default, the last 2 major versions behind the latest published are supported.

	/**
	 * Determins if WooCommerce is installed.
	 *
	 * @return bool
	 */
	private function is_wc_installed() {
		$plugin            = 'woocommerce/woocommerce.php';
		$installed_plugins = get_plugins();

		return isset( $installed_plugins[ $plugin ] );
	}

	/**
	 * Determines if WooCommerce is activated.
	 *
	 * @return bool
	 */
	private function is_wc_activated() {
		return class_exists( 'WooCommerce' );
	}

	/**
	 * Determines if the WooCommerce compatible.
	 *
	 * @return bool
	 */
	private function is_wc_compatible() {
		$wc_version = '8.0.2'; // TODO: Get WooCommerce version.
		$wc_version_required = '8.0.4'; // TODO: Get minimum required WooCommerce version from plugin file.

		if ( ! $wc_version_required ) {
			return true;
		}

		return defined( 'WC_VERSION' ) && version_compare( WC_VERSION, $wc_version_required, '>=' );
	}

	/**
	 * Check WooCommerce installation and activation.
	 *
	 * @return bool
	 * @throws IncompatibleException If WooCommerce is not activated.
	 */
	private function check_wc_installation_and_activation() {
		if ( ! $this->is_wc_activated() ) {
			add_action( 'admin_notices', array( $this, 'wc_fail_load' ) );
			throw new IncompatibleException( esc_html__( 'WooCommerce is not installed or activated.', 'woogrow-compat-checker' ) );
		}
		return true;
	}

	/**
	 * Check WooCommerce version.
	 *
	 * @return bool
	 * @throws IncompatibleException If WooCommerce version is not compatible.
	 */
	private function check_wc_version() {
		if ( ! $this->is_wc_compatible() ) {
			add_action( 'admin_notices', array( $this, 'wc_out_of_date' ) );
			throw new IncompatibleException( esc_html__( 'WooCommerce version not compatible.', 'woogrow-compat-checker' ) );
		}

		return true;
	}

	/**
	 * Check for WooCommerce upgrade recommendation.
	 *
	 * @return bool
	 */
	private function check_wc_upgrade_recommendation() {
		return true;
	}

	/**
	 * Add notices for WooCommerce not being installed or activated.
	 */
	public function wc_fail_load() {
		$plugin = 'woocommerce/woocommerce.php';
		$plugin_name = 'WooCommerce Brands'; // TODO: Get plugin name from plugin file.

		if ( $this->is_wc_installed() ) {
			if ( ! current_user_can( 'activate_plugins' ) ) {
				return;
			}

			$activation_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=' . $plugin . '&amp;plugin_status=all&amp;paged=1&amp;s', 'activate-plugin_' . $plugin );
			$message        = sprintf(
				/* translators: %1$s - Plugin Name, %2$s - activate WooCommerce link open, %3$s - activate WooCommerce link close. */
				esc_html__( '%1$s requires WooCommerce to be activated. Please %2$sactivate WooCommerce%3$s.', 'woogrow-compat-checker' ),
				'<strong>' . $plugin_name . '</strong>',
				'<a href="' . esc_url( $activation_url ) . '">',
				'</a>'
			);
			$this->add_admin_notice(
				'woocommerce-not-activated',
				'error',
				$message
			);
		} else {
			if ( ! current_user_can( 'install_plugins' ) ) {
				return;
			}

			$install_url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=woocommerce' ), 'install-plugin_woocommerce' );
			$message     = sprintf(
				/* translators: %1$s - Plugin Name, %2$s - install WooCommerce link open, %3$s - install WooCommerce link close. */
				esc_html__( '%1$s requires WooCommerce to be installed and activated. Please %2$sinstall WooCommerce%3$s.', 'woogrow-compat-checker' ),
				'<strong>' . $plugin_name . '</strong>',
				'<a href="' . esc_url( $install_url ) . '">',
				'</a>'
			);

			$this->add_admin_notice(
				'woocommerce-not-installed',
				'error',
				$message
			);
		}
	}

	/**
	 * Add notices for out of date WooCommerce.
	 */
	public function wc_out_of_date() {
		if ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		$plugin = 'woocommerce/woocommerce.php';
		$plugin_name = 'WooCommerce Brands'; // TODO: Get plugin name from plugin file.
		$wc_version_required = '8.0.4'; // TODO: Get minimum required WooCommerce version from plugin file.

		$update_url = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . $plugin ), 'upgrade-plugin_' . $plugin );
		$message    = sprintf(
			/* translators: %1$s - Plugin Name, %2$s - minimum WooCommerce version, %3$s - update WooCommerce link open, %4$s - update WooCommerce link close, %5$s - download minimum WooCommerce link open, %6$s - download minimum WooCommerce link close. */
			esc_html__( '%1$s requires WooCommerce version %2$s or higher. Please %3$supdate WooCommerce%4$s to the latest version, or %5$sdownload the minimum required version &raquo;%6$s', 'woogrow-compat-checker' ),
			'<strong>' . $plugin_name . '</strong>',
			$wc_version_required,
			'<a href="' . esc_url( $update_url ) . '">',
			'</a>',
			'<a href="' . esc_url( 'https://downloads.wordpress.org/plugin/woocommerce.' . $wc_version_required . '.zip' ) . '">',
			'</a>'
		);

		$this->add_admin_notice(
			'woocommerce-out-of-date',
			'error',
			$message
		);
	}

	/**
	 * Run all compatibility checks.
	 */
	private function run_checks() {
		try {
			$this->check_wc_installation_and_activation();
			$this->check_wc_version();
			$this->check_wc_upgrade_recommendation();
			return true;
		} catch ( IncompatibleException $e ) {
			return false;
		}
	}

	/**
	 * Determins if the plugin is WooCommerce compatible.
	 */
	public function is_compatible() {
		add_action( 'admin_notices', array( $this, 'display_admin_notices' ), 20 );
		return $this->run_checks();
	}
}
