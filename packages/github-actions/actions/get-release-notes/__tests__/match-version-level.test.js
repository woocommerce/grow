/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import matchVersionLevel from '../src/match-version-level.js';

const defaultMajorKeywords = 'breaking';
const defaultMinorKeywords = 'feature, enhancement';

describe( 'matchVersionLevel', () => {
	it( 'Should return "major" when a heading matches a major keyword', () => {
		const content = '### Breaking Changes\n- Removed old API';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'major'
		);
	} );

	it( 'Should return "minor" when a heading matches a minor keyword', () => {
		const content = '### New Features\n- Added dark mode';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'minor'
		);
	} );

	it( 'Should return "minor" when a heading matches the "enhancement" keyword', () => {
		const content = '### Enhancements\n- Improved performance';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'minor'
		);
	} );

	it( 'Should return "patch" when no heading matches any keyword', () => {
		const content = '### Bug Fixes\n- Fixed crash on startup';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'patch'
		);
	} );

	it( 'Should match keywords case-insensitively', () => {
		const content = '### BREAKING changes\n- Major overhaul';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'major'
		);
	} );

	it( 'Should prioritize "major" over "minor" when both match', () => {
		const content =
			'### Breaking Changes\n- Removed API\n### New Features\n- Added widget';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'major'
		);
	} );

	it( 'Should return "patch" for empty content', () => {
		assert.strictEqual(
			matchVersionLevel( '', defaultMajorKeywords, defaultMinorKeywords ),
			'patch'
		);
	} );

	it( 'Should return "patch" for content with no headings', () => {
		const content = 'Just some plain text without any headings.';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'patch'
		);
	} );

	it( 'Should support custom comma-separated keywords with spaces', () => {
		const content = '### Awesome Stuff\n- Something cool';

		assert.strictEqual(
			matchVersionLevel( content, 'major changes', 'awesome, cool' ),
			'minor'
		);
	} );

	it( 'Should only match headings (###), not body text', () => {
		const content =
			'### Bug Fixes\n- This is a breaking change in behavior';

		assert.strictEqual(
			matchVersionLevel(
				content,
				defaultMajorKeywords,
				defaultMinorKeywords
			),
			'patch'
		);
	} );
} );
