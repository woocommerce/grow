<?php

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests\Unit;

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;
use PHPUnit\Framework\TestCase;

class DocumentorTest extends TestCase {

	/**
	 * @test
	 */
	public function it_should_throw_an_exception_if_the_workspace_is_not_set() {
		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( 'Missing an argument: workspace' );

		$args = [
			'github_blob' => 'foo',
			'github_path' => 'bar',
			'source_dirs' => [ 'src/' ],
		];

		new Documentor( $args );
	}

	/**
	 * @test
	 */
	public function it_should_throw_an_exception_if_the_source_dirs_are_not_set() {
		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( 'Missing an argument: source_dirs' );

		$args = [
			'github_blob' => 'foo',
			'github_path' => 'bar',
			'workspace'   => 'baz',
		];

		new Documentor( $args );
	}

	/**
	 * @test
	 */
	public function it_should_throw_an_exception_if_the_github_blob_is_not_set() {
		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( 'Missing an argument: github_blob' );

		$args = [
			'github_path' => 'bar',
			'source_dirs' => [ 'src/' ],
			'workspace'   => 'baz',
		];

		new Documentor( $args );
	}

	/**
	 * @test
	 */
	public function it_should_throw_an_exception_if_the_github_path_is_not_set() {
		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( 'Missing an argument: github_path' );

		$args = [
			'github_blob' => 'foo',
			'source_dirs' => [ 'src/' ],
			'workspace'   => 'baz',
		];

		new Documentor( $args );
	}

	/**
	 * @test
	 */
	public function it_should_throw_an_exception_if_the_source_dirs_are_empty() {
		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( 'Missing an argument: source_dirs' );

		$args = [
			'github_blob' => 'foo',
			'github_path' => 'bar',
			'source_dirs' => [],
			'workspace'   => 'baz',
		];

		new Documentor( $args );
	}

	/**
	 * @test
	 */
	public function it_should_throw_an_exception_if_multiple_args_are_missing() {
		$this->expectException( \RuntimeException::class );
		$this->expectExceptionMessage( 'Missing some arguments: source_dirs,workspace' );

		$args = [
			'github_blob' => 'foo',
			'github_path' => 'bar',
		];

		new Documentor( $args );
	}
}
