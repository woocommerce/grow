/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Internal dependencies
 */
import PackageTool from '../package-tool.js';

const fixturesDir = path.join(
	path.dirname( fileURLToPath( import.meta.url ) ),
	'fixtures'
);

describe( 'PackageTool', () => {
	describe( 'getFile', () => {
		it( 'Should read a file from the package directory', () => {
			const tool = new PackageTool( 'test-package', fixturesDir );
			const content = tool.getFile( 'package.json' );

			assert.ok( content.includes( '"test-package"' ) );
		} );

		it( 'Should throw when the file does not exist', () => {
			const tool = new PackageTool( 'test-package', fixturesDir );

			assert.throws(
				() => tool.getFile( 'nonexistent.txt' ),
				( err ) => {
					assert.ok( err instanceof Error );
					assert.ok( err.message.includes( 'nonexistent.txt' ) );
					assert.ok( err.message.includes( 'does not exist' ) );
					return true;
				}
			);
		} );
	} );

	describe( 'getSettings', () => {
		it( 'Should parse and return package.json content', () => {
			const tool = new PackageTool( 'test-package', fixturesDir );
			const settings = tool.getSettings();

			assert.strictEqual( settings.name, 'test-package' );
			assert.strictEqual( settings.version, '1.4.7' );
		} );
	} );

	describe( 'getChangelogByVersion', () => {
		it( 'Should extract the correct version section from CHANGELOG', () => {
			const tool = new PackageTool( 'test-package', fixturesDir );
			const result = tool.getChangelogByVersion( '1.4.7' );

			assert.strictEqual( result.version, '1.4.7' );
			assert.strictEqual( result.heading, '## 2024-12-01 (1.4.7)' );
			assert.ok(
				result.content.includes( 'Fixed critical bug in auth module' )
			);
			assert.ok( result.content.includes( 'Updated dependencies' ) );
		} );

		it( 'Should return empty heading and content for a nonexistent version', () => {
			const tool = new PackageTool( 'test-package', fixturesDir );
			const result = tool.getChangelogByVersion( '9.9.9' );

			assert.strictEqual( result.version, '9.9.9' );
			assert.strictEqual( result.heading, '' );
			assert.strictEqual( result.content, '' );
		} );

		it( 'Should extract a different version correctly', () => {
			const tool = new PackageTool( 'test-package', fixturesDir );
			const result = tool.getChangelogByVersion( '1.5.0' );

			assert.strictEqual( result.heading, '## 2025-01-15 (1.5.0)' );
			assert.ok( result.content.includes( 'Added new feature X' ) );
		} );
	} );
} );
