/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import parseVersion from '../src/parse-version.js';

describe( 'parseVersion', () => {
	it( 'Should parse a plain version', () => {
		const result = parseVersion( '1.2.3' );

		assert.deepStrictEqual( result, {
			majorVersion: '1',
			minorVersion: '1.2',
		} );
	} );

	it( 'Should parse a version with leading v', () => {
		const result = parseVersion( 'v1.2.3' );

		assert.deepStrictEqual( result, {
			majorVersion: 'v1',
			minorVersion: 'v1.2',
		} );
	} );

	it( 'Should parse a version with prefix', () => {
		const result = parseVersion( 'tools-1.2.3' );

		assert.deepStrictEqual( result, {
			majorVersion: 'tools-1',
			minorVersion: 'tools-1.2',
		} );
	} );

	it( 'Should parse a version with prefix and leading v', () => {
		const result = parseVersion( 'tools-v1.2.3' );

		assert.deepStrictEqual( result, {
			majorVersion: 'tools-v1',
			minorVersion: 'tools-v1.2',
		} );
	} );

	it( 'Should parse a version with a complex multi-segment prefix', () => {
		const result = parseVersion( 'ipv6-tools-v1.2.3' );

		assert.deepStrictEqual( result, {
			majorVersion: 'ipv6-tools-v1',
			minorVersion: 'ipv6-tools-v1.2',
		} );
	} );

	it( 'Should include prerelease identifiers in both major and minor versions', () => {
		const result = parseVersion( 'tools-v1.2.3-beta.0' );

		assert.deepStrictEqual( result, {
			majorVersion: 'tools-v1-beta.0',
			minorVersion: 'tools-v1.2-beta.0',
		} );
	} );

	it( 'Should handle prerelease with a single identifier', () => {
		const result = parseVersion( 'v1.2.3-pre' );

		assert.deepStrictEqual( result, {
			majorVersion: 'v1-pre',
			minorVersion: 'v1.2-pre',
		} );
	} );

	it( 'Should return null for an invalid version', () => {
		assert.strictEqual( parseVersion( 'not-a-version' ), null );
	} );

	it( 'Should return null for "trunk"', () => {
		assert.strictEqual( parseVersion( 'trunk' ), null );
	} );

	it( 'Should return null for an empty string', () => {
		assert.strictEqual( parseVersion( '' ), null );
	} );
} );
