/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import toAnnotations from '../src/to-annotations.js';

describe( 'stylelint-annotation toAnnotations', () => {
	it( 'Should use the severity string as the command', () => {
		const failedFiles = [
			{
				source: `${ process.cwd() }/src/style.css`,
				warnings: [
					{
						severity: 'error',
						line: 5,
						column: 3,
						text: 'Unexpected empty block (block-no-empty)',
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result.length, 1 );
		assert.strictEqual( result[ 0 ].command, 'error' );
	} );

	it( 'Should handle "warning" severity', () => {
		const failedFiles = [
			{
				source: `${ process.cwd() }/src/app.css`,
				warnings: [
					{
						severity: 'warning',
						line: 10,
						column: 1,
						text: 'Expected single space (declaration-colon-space-after)',
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result[ 0 ].command, 'warning' );
	} );

	it( 'Should truncate file path from .source to be relative to cwd', () => {
		const failedFiles = [
			{
				source: `${ process.cwd() }/src/components/button.css`,
				warnings: [
					{
						severity: 'error',
						line: 1,
						column: 1,
						text: 'Some error',
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result[ 0 ].filePath, 'src/components/button.css' );
	} );

	it( 'Should pass through message text', () => {
		const messageText = 'Expected indentation of 2 spaces (indentation)';
		const failedFiles = [
			{
				source: `${ process.cwd() }/a.css`,
				warnings: [
					{
						severity: 'warning',
						line: 3,
						column: 1,
						text: messageText,
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result[ 0 ].message, messageText );
	} );

	it( 'Should handle multiple files with multiple warnings', () => {
		const failedFiles = [
			{
				source: `${ process.cwd() }/a.css`,
				warnings: [
					{
						severity: 'error',
						line: 1,
						column: 1,
						text: 'Error 1',
					},
					{
						severity: 'warning',
						line: 2,
						column: 5,
						text: 'Warning 1',
					},
				],
			},
			{
				source: `${ process.cwd() }/b.css`,
				warnings: [
					{
						severity: 'error',
						line: 10,
						column: 3,
						text: 'Error 2',
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result.length, 3 );
		assert.strictEqual( result[ 0 ].command, 'error' );
		assert.strictEqual( result[ 1 ].command, 'warning' );
		assert.strictEqual( result[ 2 ].filePath, 'b.css' );
	} );

	it( 'Should return an empty array when given no failed files', () => {
		const result = toAnnotations( [] );

		assert.deepStrictEqual( result, [] );
	} );
} );
