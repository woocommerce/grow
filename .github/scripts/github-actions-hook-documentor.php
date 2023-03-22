#!/usr/bin/env php
<?php

use Automattic\WooCommerce\Grow\HookDocumentation\Documentor;

$autoloadPath = dirname( __DIR__, 2 ) . '/vendor/autoload.php';
if ( ! file_exists( $autoloadPath ) ) {
	echo "Please run 'composer install'!\n";
	exit( 1 );
}

require_once $autoloadPath;

$documentor = new Documentor(
	[
		'github_path'  => '',
		'source_dirs' => [
			'src/',
		],
		'output_file'  => $_ENV['INPUT_OUTPUT-FILE'] ?? 'docs/Hooks.md',
	]
);

$documentor->generate_hooks_docs();
