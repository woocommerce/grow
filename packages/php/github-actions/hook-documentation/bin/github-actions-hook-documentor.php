#!/usr/bin/env php
<?php

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;

$autoloadPath = dirname( __DIR__ ) . '/vendor/autoload.php';
if ( ! file_exists( $autoloadPath ) ) {
	echo "Please run 'composer install'!\n";
	exit( 1 );
}

require_once $autoloadPath;

// Set the base path for files to work with.
$base_path = getcwd();

// Source directories need the full path prepended.
$source_dirs = array_map(
	function ( $path ) use ( $base_path ) {
		$path = trim( $path );
		$path = ltrim( $path, '/' );

		return "{$base_path}/{$path}";
	},
	explode( ',', $_ENV['INPUT_SOURCE-DIRECTORIES'] ?? 'src/' )
);

$args = [
	'github_path' => '',
	'source_dirs' => $source_dirs,
];

$documentor = new Documentor( $args );

try {
	$output = $documentor->generate_hooks_docs();

	// Write to the output file.
	$output_file = ltrim( $_ENV['INPUT_OUTPUT-FILE'] ?? 'docs/Hooks.md', '/' );
	file_put_contents("{$base_path}/{$output_file}", $output );

	// Set action output.
	echo $output;
} catch ( RuntimeException $e ) {
	// No hooks found.
}
