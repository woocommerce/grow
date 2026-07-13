/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import toReport from '../src/to-report.js';

describe( 'stylelint-annotation toReport', () => {
	it( 'Should return an empty string when there are no annotations', () => {
		assert.strictEqual( toReport( [] ), '' );
	} );

	it( 'Should return a non-empty string when there are annotations', () => {
		// The stylelint CLI skips its exit-code assignment on an empty report, so a
		// non-empty report is what keeps lint errors failing the job.
		const report = toReport( [
			{
				command: 'error',
				filePath: './a.css',
				line: 1,
				column: 1,
				message: 'Some error',
			},
		] );

		assert.ok( report.length > 0 );
	} );

	it( 'Should include the file path, position, severity, and message', () => {
		const report = toReport( [
			{
				command: 'error',
				filePath: './src/style.css',
				line: 5,
				column: 3,
				message: 'Unexpected empty block (block-no-empty)',
			},
		] );

		assert.match( report, /\.\/src\/style\.css/ );
		assert.match(
			report,
			/5:3\s+error\s+Unexpected empty block \(block-no-empty\)/
		);
	} );

	it( 'Should group multiple warnings under the same file', () => {
		const report = toReport( [
			{
				command: 'error',
				filePath: './a.css',
				line: 1,
				column: 1,
				message: 'Error 1',
			},
			{
				command: 'warning',
				filePath: './a.css',
				line: 2,
				column: 5,
				message: 'Warning 1',
			},
		] );

		// The file path should appear once, followed by both entries.
		assert.strictEqual( report.match( /\.\/a\.css/g ).length, 1 );
		assert.match( report, /Error 1/ );
		assert.match( report, /Warning 1/ );
	} );

	it( 'Should separate different files into their own blocks', () => {
		const report = toReport( [
			{
				command: 'error',
				filePath: './a.css',
				line: 1,
				column: 1,
				message: 'Error A',
			},
			{
				command: 'error',
				filePath: './b.css',
				line: 10,
				column: 3,
				message: 'Error B',
			},
		] );

		assert.match( report, /\.\/a\.css/ );
		assert.match( report, /\.\/b\.css/ );
	} );
} );
