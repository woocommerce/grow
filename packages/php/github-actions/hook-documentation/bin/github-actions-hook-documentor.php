#!/usr/bin/env php
<?php

use Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Documentor;

$autoloadPath = dirname( __DIR__ ) . '/vendor/autoload.php';
if ( ! file_exists( $autoloadPath ) ) {
	echo "Please run 'composer install'!\n";
	exit( 1 );
}

require_once $autoloadPath;

// Source directories need the full path prepended.
$source_dirs = array_map(
	function( $path ) {
		$path = trim( $path );

		return $path;
	},
	explode( ',', $_ENV['INPUT_SOURCE-DIRECTORIES'] ?? 'src/' )
);

$args = [
	'output_file' => $_ENV['INPUT_OUTPUT-FILE'] ?? 'docs/Hooks.md',
];

$documentor = new Documentor(
	[
		'github_path' => '',
		'source_dirs' => [
			'src/',
		],
		'output_file' => $_ENV['INPUT_OUTPUT-FILE'] ?? 'docs/Hooks.md',
	]
);

$documentor->generate_hooks_docs();
