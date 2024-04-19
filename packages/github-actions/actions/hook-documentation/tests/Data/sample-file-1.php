<?php
declare(strict_types=1);

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests\Data;

use stdClass;
use function do_action;

function sample_function_1() {
	$some_var = 'foo';
	/**
	 * Do some sample action.
	 *
	 * @param string $some_var
	 */
	do_action( 'sample_action_1', $some_var );
}

function sample_function_2() {
	$some_var       = 'foo';
	$some_other_var = new stdClass();
	/**
	 * Do another sample action.
	 *
	 * @param string $some_var
	 * @param stdClass $some_other_var
	 */
	do_action( 'sample_action_2', $some_var, $some_other_var );
}

function sample_function_3() {
	$some_var = 'foo';
	/**
	 * Do some sample action in another place.
	 *
	 * @param string $some_var
	 */
	do_action( 'sample_action_1', $some_var );
}
