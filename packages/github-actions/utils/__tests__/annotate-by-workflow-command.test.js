/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import { toAnnotationCommand } from '../annotate-by-workflow-command.js';

describe( 'toAnnotationCommand', () => {
	it( 'Should format a full annotation with all fields', () => {
		const annotation = {
			command: 'error',
			filePath: './src/index.js',
			line: 10,
			endLine: 12,
			column: 5,
			endColumn: 20,
			message: 'Unexpected token',
		};

		assert.strictEqual(
			toAnnotationCommand( annotation ),
			'::error file=./src/index.js,line=10,endLine=12,col=5,endColumn=20::Unexpected token'
		);
	} );

	it( 'Should omit missing optional fields', () => {
		const annotation = {
			command: 'warning',
			filePath: './src/app.js',
			line: 3,
			message: 'Unused variable',
		};

		assert.strictEqual(
			toAnnotationCommand( annotation ),
			'::warning file=./src/app.js,line=3::Unused variable'
		);
	} );

	it( 'Should format a group command', () => {
		const annotation = {
			command: 'group',
			message: 'Annotation commands',
		};

		assert.strictEqual(
			toAnnotationCommand( annotation ),
			'::group::Annotation commands'
		);
	} );

	it( 'Should format an endgroup command', () => {
		const annotation = {
			command: 'endgroup',
		};

		assert.strictEqual( toAnnotationCommand( annotation ), '::endgroup::' );
	} );

	it( 'Should format a notice command', () => {
		const annotation = {
			command: 'notice',
			filePath: './README.md',
			line: 1,
			message: 'Consider updating',
		};

		assert.strictEqual(
			toAnnotationCommand( annotation ),
			'::notice file=./README.md,line=1::Consider updating'
		);
	} );
} );
