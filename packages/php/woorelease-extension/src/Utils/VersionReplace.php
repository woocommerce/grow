<?php

namespace Automattic\WooCommerce\Grow\WR\Utils;

use WR\Tools\Logger;
use WR\Tools\Product;
use WR\Tools\Utils;

/**
 * Class VersionReplace
 *
 * @since %VERSION%
 */
class VersionReplace {

	/**
	 * Attempt to replace placeholder PHPDocs version strings.
	 *
	 * @param string $product            Product name.
	 * @param string $folder             Product folder.
	 * @param string $version            Product version.
	 */
	public static function maybe_replace( $product, $folder, $version ) {
		$logger       = Logger::default();
		$package_json = Product::get_package_json( $product, $folder );

		if ( empty( $package_json['config'] ) || empty( $package_json['config']['version_replace_paths'] ) ) {
			$logger->notice( 'Skipping PHPDoc version placeholder replacements.' );
			return;
		}

		$logger->notice( 'Attempting PHPDoc version placeholder replacements...' );

		/*
		* Replace @since|version x.x.x with $version.
		*/
		$paths = $package_json['config']['version_replace_paths'];
		if ( ! is_array( $paths ) ) {
			$paths = [ $paths ];
		}

		chdir( $folder );
		// Prevent the sed pattern search from matching this string.
		$sed_command  = 'sed -i.bak -e "s/@%1$s\( \{1,\}\)x.x.x/@%1$s\1%3$s/g;s/@%2$s\( \{1,\}\)x.x.x/@%2$s\1%3$s/g;s/\'x.x.x\'/\'%3$s\'/g" ';
		$sed_command  = sprintf( $sed_command, 'since', 'version', $version );
		$find_replace = 'find ./%1$s -iname \'*.php\' -exec ' . $sed_command . '{} \;';
		foreach ( $paths as $path ) {
			$logger->notice( "Replacing version placeholders in ./{path}", array( 'path' => $path ) );
			$local_path = $folder . '/' . $path;

			if ( is_dir( $local_path ) ) {
				$command = sprintf( $find_replace, $path );
				$cleanup = sprintf( 'find ./%1$s -name "*.php.bak" -type f -delete', $path );
			} else {
				$command = $sed_command . $local_path;
				$cleanup = sprintf('unlink %s.bak', $local_path);
			}
			Utils::exec_sprintf( $command );
			Utils::exec_sprintf( $cleanup );
		}
	}
}
