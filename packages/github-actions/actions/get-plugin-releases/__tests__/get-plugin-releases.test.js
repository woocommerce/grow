/**
 * External dependencies
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * Internal dependencies
 */
import { default as wcData } from './fixtures/woocommerce.json' with { type: 'json' };
import { default as wpData } from './fixtures/wordpress.json' with { type: 'json' };
import { parsePluginVersions } from '../src/get-plugin-releases.js';

describe( 'get-plugin-releases', () => {
	describe( 'WordPress', () => {
		it( 'Get latest 3 releases', () => {
			const inputs = {
				slug: 'wordpress',
				numberOfReleases: 3,
				includeRC: false,
				includePatches: false,
			};
			const result = parsePluginVersions( wpData, inputs );

			assert.deepStrictEqual( result, [ '6.9', '6.8.3', '6.7.4' ] );
		} );

		it( 'Get latest 1 release', () => {
			const inputs = {
				slug: 'wordpress',
				numberOfReleases: 1,
				includeRC: false,
				includePatches: false,
			};
			const result = parsePluginVersions( wpData, inputs );

			assert.deepStrictEqual( result, [ '6.9' ] );
		} );

		it( 'Get latest 10 releases', () => {
			const inputs = {
				slug: 'wordpress',
				numberOfReleases: 10,
				includeRC: false,
				includePatches: false,
			};
			const result = parsePluginVersions( wpData, inputs );

			assert.deepStrictEqual( result, [
				'6.9',
				'6.8.3',
				'6.7.4',
				'6.6.4',
				'6.5.7',
				'6.4.7',
				'6.3.7',
				'6.2.8',
				'6.1.9',
				'6.0.11',
			] );
		} );

		it( '`includePatches` has no effect', () => {
			// Because the data source only provides the latest patch for each minor version
			const inputs = {
				slug: 'wordpress',
				numberOfReleases: 3,
				includeRC: false,
				includePatches: true,
			};
			const result = parsePluginVersions( wpData, inputs );

			assert.deepStrictEqual( result, [ '6.9', '6.8.3', '6.7.4' ] );
		} );

		it( '`includeRC` has no effect', () => {
			// Because the data source does not include RC versions
			const inputs = {
				slug: 'wordpress',
				numberOfReleases: 3,
				includeRC: false,
				includePatches: true,
			};
			const result = parsePluginVersions( wpData, inputs );

			assert.deepStrictEqual( result, [ '6.9', '6.8.3', '6.7.4' ] );
		} );
	} );

	describe( 'WooCommerce', () => {
		it( 'Get latest 3 releases without RC or patches', () => {
			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 3,
				includeRC: false,
				includePatches: false,
			};
			const result = parsePluginVersions( wcData, inputs );

			assert.deepStrictEqual( result, [ '10.4.3', '10.3.7', '10.2.3' ] );
		} );

		it( 'Get latest 1 release without RC or patches', () => {
			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 1,
				includeRC: false,
				includePatches: false,
			};
			const result = parsePluginVersions( wcData, inputs );

			assert.deepStrictEqual( result, [ '10.4.3' ] );
		} );

		it( 'Get latest 10 releases without RC or patches', () => {
			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 10,
				includeRC: false,
				includePatches: false,
			};
			const result = parsePluginVersions( wcData, inputs );

			assert.deepStrictEqual( result, [
				'10.4.3',
				'10.3.7',
				'10.2.3',
				'10.1.3',
				'10.0.5',
				'9.9.6',
				'9.8.6',
				'9.7.2',
				'9.6.3',
				'9.5.3',
			] );
		} );

		it( 'Get latest 10 releases including patches but without RC', () => {
			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 10,
				includeRC: false,
				includePatches: true,
			};
			const result = parsePluginVersions( wcData, inputs );

			assert.deepStrictEqual( result, [
				'10.4.3',
				'10.4.2',
				'10.4.1',
				'10.4.0',
				'10.3.7',
				'10.3.6',
				'10.3.5',
				'10.3.4',
				'10.3.3',
				'10.3.2',
			] );
		} );

		it( 'Get latest 5 releases including RC but without patches', () => {
			const data = {
				version: '10.3.7',
				versions: {
					'10.3.0': '',
					'10.3.0-rc.1': '',
					'10.3.0-rc.2': '',
					'10.3.1': '',
					'10.3.2': '',
					'10.4.0-rc.1': '',
					'8.0.0': '',
					'8.0.0-rc.1': '',
					'8.0.0-rc.2': '',
					'9.0.0': '',
					'9.0.0-rc.1': '',
					'9.9.0-rc.1': '',
					'9.9.1': '',
					trunk: '',
				},
			};
			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 10,
				includeRC: true,
				includePatches: false,
			};
			const result = parsePluginVersions( data, inputs );

			assert.deepStrictEqual( result, [
				'10.4.0-rc.1',
				'10.3.2',
				'9.9.1',
				'9.0.0',
				'8.0.0',
			] );
		} );

		it( 'Get latest 10 releases including RC and patches', () => {
			const data = {
				version: '10.3.7',
				versions: {
					'10.3.0': '',
					'10.3.0-rc.1': '',
					'10.3.0-rc.2': '',
					'10.3.1': '',
					'10.3.2': '',
					'10.4.0-rc.1': '',
					'8.0.0': '',
					'8.0.0-rc.1': '',
					'8.0.0-rc.2': '',
					'9.0.0': '',
					'9.0.0-rc.1': '',
					'9.9.0-rc.1': '',
					'9.9.1': '',
					trunk: '',
				},
			};
			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 10,
				includeRC: true,
				includePatches: true,
			};
			const result = parsePluginVersions( data, inputs );

			assert.deepStrictEqual( result, [
				'10.4.0-rc.1',
				'10.3.2',
				'10.3.1',
				'10.3.0',
				'10.3.0-rc.2',
				'10.3.0-rc.1',
				'9.9.1',
				'9.9.0-rc.1',
				'9.0.0',
				'9.0.0-rc.1',
			] );
		} );
	} );

	describe( 'Edge cases', () => {
		it( 'Should ignore versions newer than the latest stable version (unless RC)', () => {
			const data = {
				version: '10.4.3', // Latest stable version
				versions: {
					'10.4.3': '',
					'10.5.0': '',
					'10.5.0-rc.1': '',
				},
			};

			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 2,
				includeRC: false,
				includePatches: false,
			};
			let result = parsePluginVersions( data, inputs );

			assert.deepStrictEqual( result, [ '10.4.3' ] );

			// When including RC, 10.5.0 should still be omitted, but 10.5.0-rc.1 should appear
			result = parsePluginVersions( data, {
				...inputs,
				includeRC: true,
			} );

			assert.deepStrictEqual( result, [ '10.5.0-rc.1', '10.4.3' ] );
		} );

		it( 'Should ignore "trunk", "beta" and "other"', () => {
			const data = {
				version: '1.0.0',
				versions: {
					'1.0.0': '',
					'1.0.1-beta.1': '',
					other: '',
					trunk: '',
				},
			};
			const inputs = {
				slug: 'woocommerce',
				numberOfReleases: 5,
				includeRC: true,
				includePatches: true,
			};
			const result = parsePluginVersions( data, inputs );

			assert.deepStrictEqual( result, [ '1.0.0' ] );
		} );
	} );
} );
