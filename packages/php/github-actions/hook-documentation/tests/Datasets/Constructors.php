<?php

declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation\Tests\Datasets;

dataset(
	'constructors',
	[
		'missing workspace'          => [
			[
				'github_blob' => 'foo',
				'base_url'    => 'bar',
				'source_dirs' => [ 'src/' ],
			],
			'Missing an argument: workspace',
		],
		'missing source_dirs'        => [
			[
				'github_blob' => 'foo',
				'base_url'    => 'bar',
				'workspace'   => 'baz',
			],
			'Missing an argument: source_dirs',
		],
		'missing base_url'           => [
			[
				'github_blob' => 'foo',
				'source_dirs' => [ 'src/' ],
				'workspace'   => 'baz',
			],
			'Missing an argument: base_url',
		],
		'missing github_blob'        => [
			[
				'base_url'    => 'bar',
				'source_dirs' => [ 'src/' ],
				'workspace'   => 'baz',
			],
			'Missing an argument: github_blob',
		],
		'missing multiple arguments' => [
			[],
			'Missing some arguments: github_blob,base_url,source_dirs,workspace',
		],
	]
);
