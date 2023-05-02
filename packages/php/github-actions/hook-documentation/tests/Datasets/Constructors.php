<?php
declare( strict_types=1 );

dataset(
	'constructors',
	[
		'missing workspace'   => [
			[
				'github_blob' => 'foo',
				'github_path' => 'bar',
				'source_dirs' => [ 'src/' ],
			],
			'Missing an argument: workspace',
		],
		'missing source_dirs' => [
			[
				'github_blob' => 'foo',
				'github_path' => 'bar',
				'workspace'   => 'baz',
			],
			'Missing an argument: source_dirs',
		],
		'missing github_path' => [
			[
				'github_blob' => 'foo',
				'source_dirs' => [ 'src/' ],
				'workspace'   => 'baz',
			],
			'Missing an argument: github_path',
		],
		'missing github_blob' => [
			[
				'github_path' => 'bar',
				'source_dirs' => [ 'src/' ],
				'workspace'   => 'baz',
			],
			'Missing an argument: github_blob',
		],
		'missing multiple arguments' => [
			[],
			'Missing some arguments: github_blob,github_path,source_dirs,workspace',
		]
	]
);
