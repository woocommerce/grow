/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import {
	parseChangelog,
	escapeSingleQuote,
} from '../src/release-notes-utils.js';

describe( 'parseChangelog', () => {
	it( 'Should extract the "What\'s Changed" section', () => {
		const notes = [
			"## What's Changed",
			'* Fix bug by @user in #123',
			'* Add feature by @user in #456',
			'',
			'## New Contributors',
			'* @user made their first contribution',
		].join( '\n' );

		const result = parseChangelog( notes );

		assert.strictEqual(
			result,
			'* Fix bug by @user in #123\n* Add feature by @user in #456'
		);
	} );

	it( 'Should return empty string when no "What\'s Changed" section exists', () => {
		const notes = [
			'## New Contributors',
			'* @user made their first contribution',
		].join( '\n' );

		assert.strictEqual( parseChangelog( notes ), '' );
	} );

	it( 'Should match case-insensitively', () => {
		const notes = [
			"## what's changed",
			'* Some change',
			'',
			'## Other section',
		].join( '\n' );

		assert.strictEqual( parseChangelog( notes ), '* Some change' );
	} );

	it( 'Should return empty string for empty content', () => {
		assert.strictEqual( parseChangelog( '' ), '' );
	} );

	it( 'Should return empty string when section is at end without trailing blank line', () => {
		const notes = "## What's Changed\n* Fix bug by @user in #123";

		assert.strictEqual( parseChangelog( notes ), '' );
	} );
} );

describe( 'escapeSingleQuote', () => {
	it( 'Should escape single quotes', () => {
		assert.strictEqual(
			escapeSingleQuote( "it's a test" ),
			"it'\"'\"'s a test"
		);
	} );

	it( 'Should return unchanged text without single quotes', () => {
		assert.strictEqual(
			escapeSingleQuote( 'no quotes here' ),
			'no quotes here'
		);
	} );

	it( 'Should handle multiple consecutive single quotes', () => {
		assert.strictEqual( escapeSingleQuote( "a''b" ), "a'\"'\"''\"'\"'b" );
	} );

	it( 'Should handle empty string', () => {
		assert.strictEqual( escapeSingleQuote( '' ), '' );
	} );
} );
