<?php

declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests\Unit;

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;
use Closure;
use RuntimeException;

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
	'should find actions in sample file 1',
	function() {
		$workspace   = dirname( __DIR__ );
		$github_repo = 'https://github.com/example/test';
		$sha         = 'abc123';
		$args        = [
			'github_path' => $github_repo,
			'github_blob' => $sha,
			'workspace'   => $workspace,
			'source_dirs' => [ 'Data/' ],
		];

		$documentor = new Documentor( $args );
		$results    = $documentor->generate_hooks_docs();
		expect( $results )->not()->toBeEmpty()->toBeString();

		return $results;
	}
);

it(
	'should find all actions in sample file 1',
	function( string $results ) {
		expect( $results )->toContain( 'sample_action_1', 'sample_action_2' );
	}
)->depends( 'it should find actions in sample file 1' );

it(
	'should find sample action 1 only once',
	function( string $results ) {
		expect( $results )->toContainCount( 'sample_action_1', 1 );
	}
)->depends( 'it should find actions in sample file 1' );

it(
	'should find the sample-file-1 filename 6 times – twice for each action',
	function( string $results ) {
		expect( $results )->toContainCount( 'sample-file-1.php', 6 );
	}
)->depends( 'it should find actions in sample file 1' );

it(
	'should not contain the full workspace directory',
	function( string $results ) {
		expect( $results )->not()->toContain( dirname( __DIR__ ) . '/Data' );
	}
)->depends( 'it should find actions in sample file 1' );
