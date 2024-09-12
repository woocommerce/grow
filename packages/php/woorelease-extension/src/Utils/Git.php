<?php
/**
 * Git class.
 *
 * @package Automattic\WooCommerce\Grow\WR\Utils
 */

namespace Automattic\WooCommerce\Grow\WR\Utils;

use Exception;
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
	public static function does_branch_exist( $repository_url, $branch ) {
		// --exit-code returns 0 if the branch exists, 2 otherwise.
		try {
			Utils::exec_sprintf( 'git ls-remote --exit-code --heads %s %s', $repository_url, $branch );
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Creates a new local release branch.
	 *
	 * @param string $branch The branch name.
	 *
	 * @return bool True if the branch was created, false otherwise.
	 */
	public static function create_branch( $folder, $branch ) {
		try {
			chdir( $folder );
			Utils::exec_sprintf( 'git checkout -b %s', $branch );
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Pushes a branch to the remote repository.
	 *
	 * @param string $folder         Current working repository clone.
	 * @param string $repository_url The remote repository URL.
	 * @param string $branch         The branch name.
	 *
	 * @return bool True if the branch was pushed, false otherwise.
	 */
	public static function push_branch( $folder, $repository_url, $branch ) {
		try {
			chdir( $folder );
			Utils::exec_sprintf( 'git push --set-upstream origin %s', $branch );
			return true;
		} catch ( Exception $e ) {
			try {
				// Cleanup if the branch was created but not pushed.
				static::delete_branch( $folder, $repository_url, $branch );
			} catch ( Exception $e ) {
				return false;
			}
			return false;
		}
	}

	/**
	 * Deletes a branch to the remote repository.
	 *
	 * @param string $folder         Current working copy.
	 * @param string $repository_url The remote repository URL.
	 * @param string $branch         The branch name.
	 *
	 * @return bool True if the branch was deleted, false otherwise.
	 */
	public static function delete_branch( $folder, $repository_url, $branch ) {
		try {
			chdir( $folder );
			if ( self::does_branch_exist( $repository_url, $branch ) ) {
				Utils::exec_sprintf( 'git push %s --delete %s', $repository_url, $branch );
			}
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Attempt to clone the product and checkout the specific version which, if failed, tries to clone the default version.
	 *
	 * @param string $product         Product name.
	 * @param string $branch          Git branch.
	 * @param string $default_branch  Git branch.
	 * @param string $gh_org          Git organization.
	 *
	 * @throws \Exception On error.
	 * @return string Product folder.
	 */
	public static function clone_product_release_or_default( $product, $branch, $default_branch, $gh_org ) {
		try {
			return parent::clone_product( $product, $branch, $gh_org );
		} catch ( Exception $e ) {
			return parent::clone_product( $product, $default_branch, $gh_org );
		}
	}
}
