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
	 * Creates a new branch and pushes it to the remote repository.
	 * Rollbacks if the branch was (not) created but (and) not pushed.
	 *
	 * @param string $branch The branch name.
	 *
	 * @return bool True if the branch was created, false otherwise.
	 */
	public static function create_branch( $branch ) {
		try {
			Utils::exec_sprintf( 'git checkout -b %s', $branch );
			return true;
		} catch ( Exception $e ) {
			try {
				// Cleanup if the branch was created but not pushed.
				Utils::exec_sprintf( 'git branch -D %s', $branch );
			} catch ( Exception $e ) {
				return false;
			}
			return false;
		}
	}

	/**
	 * Pushes a branch to the remote repository.
	 *
	 * @param string $repository_url The remote repository URL.
	 * @param string $branch         The branch name.
	 *
	 * @return bool True if the branch was pushed, false otherwise.
	 */
	public static function push_branch( $repository_url, $branch ) {
		self::does_branch_exist( $repository_url, $branch );
		try {
			Utils::exec_sprintf( 'git push origin %s', $branch );
			return true;
		} catch ( Exception $e ) {
			try {
				// Cleanup if the branch was created but not pushed.
				Utils::exec_sprintf( 'git push origin --delete %s', $branch );
			} catch ( Exception $e ) {
				return false;
			}
			return false;
		}
	}
}
