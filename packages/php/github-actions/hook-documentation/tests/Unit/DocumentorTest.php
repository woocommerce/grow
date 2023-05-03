<?php

declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests\Unit;

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;
use Closure;
use RuntimeException;

use function Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests\getTestDataDocumentor;

it(
	'should throw an exception for missing constructor args',
	function( array $args, string $message ) {
		expect(
			function() use ( $args ) {
				new Documentor( $args );
			}
		)->toThrow( RuntimeException::class, $message );
	}
)->with( 'constructors' );
/** @see packages/php/github-actions/hook-documentation/tests/Datasets/Constructors.php */

it(
	'should correctly replace local path with github url',
	function() {
		$workspace   = '/path/to/the/workspace/example-test';
		$github_repo = 'https://github.com/example/test';
		$sha         = 'abc123';
		$args        = [
			'github_path' => $github_repo,
			'github_blob' => $sha,
			'workspace'   => $workspace,
		];

		// Mock parts of the class that we need with an anonymous class and function.
		$class = new class( $args ) extends Documentor {
			/** No-op */
			protected function validate_args( array $defaults, array $args ): void {}
		};

		$get_file_url = Closure::bind(
			function( array $file ) {
				return $this->get_file_url( $file );
			},
			$class,
			$class
		);

		$files = [
			[
				'path'     => "{$workspace}/foo.php",
				'expected' => "{$github_repo}/blob/{$sha}/foo.php#L1",
				'line'     => 1,
			],
			[
				'path'     => "{$workspace}/bar.php",
				'expected' => "{$github_repo}/blob/{$sha}/bar.php#L2",
				'line'     => 2,
			],
		];

		foreach ( $files as $file ) {
			expect( $get_file_url( $file ) )->toBe( $file['expected'] );
		}
	}
);

it(
	'should gracefully handle a non-existent directory',
	function() {
		expect(
			getTestDataDocumentor( 'Data/', 'FakeDir/' )->generate_hooks_docs()
		)->not()->toBeEmpty()->toBeString();
	}
);

it(
	'should throw an exception when no hooks were found',
	function() {
		expect(
			function() {
				getTestDataDocumentor( 'FakeDir/' )->generate_hooks_docs();
			}
		)->toThrow( RuntimeException::class, 'No hooks found' );
	}
);
