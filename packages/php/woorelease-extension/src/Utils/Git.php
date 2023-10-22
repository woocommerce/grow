<?php
/**
 * Git class.
 *
 * @package Automattic\WooCommerce\Grow\WR\Utils
 */

namespace Automattic\WooCommerce\Grow\WR\Utils;

use WR\Tools\Utils;

/**
 * Class Git
 *
 * Extends the Git class from the woorelease package with additional functionality.
 */
class Git extends \WR\Tools\Git {

	/**
	 * Checks if a branch exists in a remote repository.
	 *
	 * @param string $repository_url The remote repository URL.
	 * @param string $branch         The branch name.
	 *
	 * @return bool True if the branch exists, false otherwise.
	 */
	public static function is_branch_exists( $repository_url, $branch ) {
		// --exit-code returns 0 if the branch exists, 2 otherwise.
		try {
			Utils::exec_sprintf( 'git ls-remote --exit-code --heads %s %s', $repository_url, $branch );
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}

	public static function create_branch( $repository_url, $branch ) {
		try {
			Utils::exec_sprintf( 'git checkout --exit-code -b %s %s', $branch );
			Utils::exec_sprintf( 'git push origin %s', $branch );
			return true;
		} catch ( \Exception $e ) {
			return false;
		}
	}
}
