<?php
/**
 * Repository class
 */

namespace Automattic\WooCommerce\Grow\WR\Utils;

use WR\Tools\Logger;
use WR\Tools\Utils;

/**
 * Represents a plugin (calls it s Product)
 */
class Product {

	/**
	 * Build the product, handling package.json build process
	 *
	 * @param bool   $use_nvm           Either to `nvm` or not.
	 * @param string $grow_root_path    WooGrow root path.
	 * @param string $product           Product name.
	 * @param string $folder            Product folder.
	 *
	 * @throws \Exception On error.
	 * @return array Zip file path.
	 */
	public static function maybe_build_with_nvm( $use_nvm, $grow_root_path, $product, $folder ) {
		$logger = Logger::default();
		if ( $use_nvm ) {
			$logger->notice( 'Attempting to use the product\'s recommended node version.' );
			return static::build( $grow_root_path, $product, $folder );
		} else {
			return \WR\Tools\Product::build( $product, $folder );
		}
	}

	/**
	 * Build the product, handling package.json build process
	 *
	 * @param string $grow_root_path    WooGrow root path.
	 * @param string $product           Product name.
	 * @param string $folder            Product folder.
	 *
	 * @throws \Exception On error.
	 * @return array Zip file path.
	 */
	public static function build( $grow_root_path, $product, $folder ) {
		$logger       = Logger::default();
		$package_json = \WR\Tools\Product::get_package_json( $product, $folder );
		$wp_org_slug  = ! empty( $package_json['config']['wp_org_slug'] ) && ( $package_json['config']['wp_org_slug'] !== $product ) ? $package_json['config']['wp_org_slug'] : false;
		$use_pnpm     = (bool) ( $package_json['config']['use_pnpm'] ?? false );
		$build_step   = $package_json['config']['build_step'] ?? false;

		chdir( $folder );
		Utils::exec_sprintf( 'rm -rf %s.zip', $product );
		if ( $wp_org_slug ) {
			Utils::exec_sprintf( 'rm -rf %s.zip', $wp_org_slug );
		}

		if ( $build_step ) {
			shell_exec( "{$grow_root_path}/bin/build '{$build_step}'" ); // phpcs:ignore
		} elseif ( $use_pnpm ) {
			shell_exec( "{$grow_root_path}/bin/build pnpm" ); // phpcs:ignore
		} else {
			shell_exec( "{$grow_root_path}/bin/build npm" ); // phpcs:ignore
		}

		$zipfile = '';
		if ( file_exists( sprintf( '%s/%s.zip', $folder, $product ) ) ) {
			$zipfile = realpath( sprintf( '%s.zip', $product ) );
		} elseif ( $wp_org_slug && file_exists( sprintf( '%s/%s.zip', $folder, $wp_org_slug ) ) ) {
			$zipfile = realpath( sprintf( '%s.zip', $wp_org_slug ) );
		}
		if ( $zipfile ) {
			$logger->notice( 'Product build: {zipfile}', [ 'zipfile' => $zipfile ] );
			return $zipfile;
		}

		if ( $wp_org_slug ) {
			throw new \Exception( sprintf( "'npm run build' command did not produce '%s.zip' or '%s.zip'", $product, $wp_org_slug ), 3 );
		} else {
			throw new \Exception( sprintf( "'npm run build' command did not produce '%s.zip'", $product ), 3 );
		}
	}
}
