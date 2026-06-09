/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import toAnnotations from '../src/to-annotations.js';

describe( 'eslint-annotation toAnnotations', () => {
	it( 'Should map severity 2 to "error" command', () => {
		const failedFiles = [
			{
				filePath: `${ process.cwd() }/src/index.js`,
				messages: [
					{
						severity: 2,
						ruleId: 'no-unused-vars',
						message: "'x' is defined but never used",
						line: 5,
						column: 3,
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result.length, 1 );
		assert.strictEqual( result[ 0 ].command, 'error' );
	} );

	it( 'Should map severity 1 to "warning" command', () => {
		const failedFiles = [
			{
				filePath: `${ process.cwd() }/src/app.js`,
				messages: [
					{
						severity: 1,
						ruleId: 'no-console',
						message: 'Unexpected console statement',
						line: 10,
						column: 1,
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result.length, 1 );
		assert.strictEqual( result[ 0 ].command, 'warning' );
	} );

	it( 'Should format message as "[ruleId] message"', () => {
		const failedFiles = [
			{
				filePath: `${ process.cwd() }/src/index.js`,
				messages: [
					{
						severity: 2,
						ruleId: 'semi',
						message: 'Missing semicolon',
						line: 1,
						column: 10,
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result[ 0 ].message, '[semi] Missing semicolon' );
	} );

	it( 'Should truncate file path to be relative to cwd', () => {
		const failedFiles = [
			{
				filePath: `${ process.cwd() }/src/utils/helper.js`,
				messages: [
					{
						severity: 2,
						ruleId: 'no-undef',
						message: "'foo' is not defined",
						line: 3,
						column: 1,
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result[ 0 ].filePath, './src/utils/helper.js' );
	} );

	it( 'Should handle multiple files with multiple messages', () => {
		const failedFiles = [
			{
				filePath: `${ process.cwd() }/a.js`,
				messages: [
					{
						severity: 2,
						ruleId: 'r1',
						message: 'm1',
						line: 1,
						column: 1,
					},
					{
						severity: 1,
						ruleId: 'r2',
						message: 'm2',
						line: 2,
						column: 1,
					},
				],
			},
			{
				filePath: `${ process.cwd() }/b.js`,
				messages: [
					{
						severity: 2,
						ruleId: 'r3',
						message: 'm3',
						line: 5,
						column: 10,
					},
				],
			},
		];
		const result = toAnnotations( failedFiles );

		assert.strictEqual( result.length, 3 );
		assert.strictEqual( result[ 0 ].command, 'error' );
		assert.strictEqual( result[ 1 ].command, 'warning' );
		assert.strictEqual( result[ 2 ].filePath, './b.js' );
	} );

	it( 'Should return an empty array when given no failed files', () => {
		const result = toAnnotations( [] );

		assert.deepStrictEqual( result, [] );
	} );
} );
