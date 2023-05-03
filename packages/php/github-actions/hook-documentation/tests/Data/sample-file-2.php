<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests;

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;

class SampleClassWithHooks {

	protected string $filtered_value = 'foo';

	public function hooks() {
		do_action( 'class_action_1', $this );
		do_action( 'class_action_2', $this );
		do_action_ref_array( 'class_action_ref_array', [ $this, 'foo' ] );
		$this->filtered_value = (string) apply_filters( 'class_filter_1', $this->filtered_value );
	}

	public function __call( $name, $arguments ) {
		do_action( 'class_magic_action', $name, $arguments );
		do_action( "class_magic_action_{$name}", $arguments );
	}
}
