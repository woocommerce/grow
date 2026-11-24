/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Internal dependencies
 */
import requireFromCaller from '../require-from-caller.js';

const semver = createRequire( import.meta.url )( 'semver' );
const thisFile = fileURLToPath( import.meta.url );
// A path where no node_modules can be found, like a formatter outside the package's reach.
const unreachableFile = path.join(
	os.tmpdir(),
	'grow-require-from-caller',
	'formatter.cjs'
);

describe( 'requireFromCaller', () => {
	it( 'Should load the package relative to the formatter file', () => {
		assert.strictEqual(
			requireFromCaller( 'semver', import.meta.url, unreachableFile ),
			semver
		);
	} );

	it( 'Should fall back to the CLI script when the formatter cannot reach the package', () => {
		assert.strictEqual(
			requireFromCaller( 'semver', unreachableFile, thisFile ),
			semver
		);
	} );

	it( 'Should throw the original error when neither path can reach the package', () => {
		const unreachableCli = path.join(
			path.dirname( unreachableFile ),
			'cli.js'
		);

		assert.throws(
			() =>
				requireFromCaller( 'semver', unreachableFile, unreachableCli ),
			( error ) =>
				error.code === 'MODULE_NOT_FOUND' &&
				error.message.includes( 'formatter.cjs' ) &&
				! error.message.includes( 'cli.js' )
		);
	} );
} );
