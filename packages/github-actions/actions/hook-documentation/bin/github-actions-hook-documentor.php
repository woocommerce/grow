#!/usr/bin/env php
<?php

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;

$autoload_path = dirname( __DIR__ ) . '/vendor/autoload.php';
if ( ! file_exists( $autoload_path ) ) {
	echo "Please run 'composer install'!\n";
	exit( 1 );
}

require_once $autoload_path;

// Set up variables from the environment.
$env = getenv();

$base_path   = $env['WORKSPACE'] ?? getcwd();
$ref         = $env['SHA'] ?? $env['BRANCH'] ?? '';
$source_dirs = $env['SOURCE_DIRECTORIES'] ?? 'src/';
$base_url    = $env['BASE_URL'] ?? '';

// Source directories need the full path prepended.
$source_dirs = array_map(
	function ( $path ) {
		return ltrim( trim( $path ), '/' );
	},
	explode( ',', $source_dirs )
);

$args = [
	'github_blob' => $ref,
	'base_url'    => $base_url,
	'source_dirs' => $source_dirs,
	'workspace'   => $base_path,
];

try {
	echo ( new Documentor( $args ) )->generate_hooks_docs();
} catch ( RuntimeException $e ) {
	echo $e->getMessage() . PHP_EOL;
	exit( 2 );
}
