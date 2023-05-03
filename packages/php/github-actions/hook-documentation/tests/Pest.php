<?php

declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests;

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;
use PHPUnit\Framework\Assert;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "uses()" function to bind a different classes or traits.
|
*/

// uses(Tests\TestCase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

//expect()->extend('toBeOne', function () {
//    return $this->toBe(1);
//});

expect()->extend(
	'toContainCount',
	function( string $value, int $count ) {
		$result = substr_count( $this->value, $value );
		Assert::assertEquals( $count, $result );

		return $this;
	}
);

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

//function something()
//{
//    // ..
//}
/**
 * @param array $source_dirs
 *
 * @return Documentor
 */
function getTestDataDocumentor( ...$source_dirs ): Documentor {
	$args        = [
		'github_path' => 'https://github.com/example/test',
		'github_blob' => 'abc123',
		'workspace'   => __DIR__,
		'source_dirs' => $source_dirs ?: [ 'Data/' ],
	];

	return new Documentor( $args );
}
