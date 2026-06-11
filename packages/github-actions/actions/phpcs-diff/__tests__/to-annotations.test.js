/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import toAnnotations from '../src/to-annotations.js';

describe( 'phpcs-diff toAnnotations', () => {
	it( 'Should always set command to "error"', () => {
		const reportFiles = {
			'src/Example.php': {
				messages: [ { line: 10, message: 'Missing docblock' } ],
			},
		};
		const result = toAnnotations( reportFiles );

		assert.strictEqual( result.length, 1 );
		assert.strictEqual( result[ 0 ].command, 'error' );
	} );

	it( 'Should prefix file path with "./"', () => {
		const reportFiles = {
			'src/Example.php': {
				messages: [ { line: 5, message: 'Some error' } ],
			},
		};
		const result = toAnnotations( reportFiles );

		assert.strictEqual( result[ 0 ].filePath, './src/Example.php' );
	} );

	it( 'Should include line number and message', () => {
		const reportFiles = {
			'src/App.php': {
				messages: [
					{ line: 42, message: 'Expected 1 space after comma' },
				],
			},
		};
		const result = toAnnotations( reportFiles );

		assert.strictEqual( result[ 0 ].line, 42 );
		assert.strictEqual(
			result[ 0 ].message,
			'Expected 1 space after comma'
		);
	} );

	it( 'Should handle multiple files with multiple messages', () => {
		const reportFiles = {
			'a.php': {
				messages: [
					{ line: 1, message: 'Error 1' },
					{ line: 2, message: 'Error 2' },
				],
			},
			'b.php': {
				messages: [ { line: 10, message: 'Error 3' } ],
			},
		};
		const result = toAnnotations( reportFiles );

		assert.strictEqual( result.length, 3 );
		assert.strictEqual( result[ 0 ].filePath, './a.php' );
		assert.strictEqual( result[ 2 ].filePath, './b.php' );
	} );

	it( 'Should return an empty array for an empty report', () => {
		const result = toAnnotations( {} );

		assert.deepStrictEqual( result, [] );
	} );
} );
