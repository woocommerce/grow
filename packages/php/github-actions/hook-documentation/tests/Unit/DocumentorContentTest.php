<?php

declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests;

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;

it(
	'should find actions in sample file 1',
	function() {
		$workspace   = dirname( __DIR__ );
		$github_repo = 'https://github.com/example/test';
		$sha         = 'abc123';
		$args        = [
			'base_url'    => $github_repo,
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
