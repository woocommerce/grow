/**
 * External dependencies
 */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Internal dependencies
 */
import handleActionErrors from '../../../utils/handle-action-errors.js';

export default async ( { github, context, core, changelog, inputs } ) => {
	const { repos, git } = github.rest;

	const assetPath = inputs[ 'extension-asset-path' ];
	const assetContentType = inputs[ 'extension-asset-content-type' ];
	const tag = inputs[ 'tag-name' ];
	const releaseTitle = inputs[ 'release-title' ];

	async function findExistingRelease() {
		core.info( `Finding the existing release by tag ${ tag } …` );

		return repos
			.getReleaseByTag( {
				...context.repo,
				tag,
			} )
			.then( ( response ) => {
				const { id, assets } = response.data;

				core.info(
					'Found the target tag. Proceed to update the existing release.'
				);
				return { id, assets };
			} )
			.catch( ( error ) => {
				if ( error.status === 404 ) {
					core.info(
						'The target tag is not found. Proceed to create a new release.'
					);
					return {};
				}
				return Promise.reject( error );
			} );
	}

	async function publishRelease( { id, assets } ) {
		core.info( 'Publishing release …' );

		const updateTime = new Date().toUTCString();
		const body = `## Unreleased changes - ${ updateTime }\n${ changelog }`;
		const params = {
			...context.repo,
			name: releaseTitle,
			body,
			prerelease: true,
			make_latest: 'false',
		};

		const isExisting = Boolean( id );

		if ( isExisting ) {
			params.release_id = id;
		} else {
			params.tag_name = tag;
			params.target_commitish = context.ref.replace( 'refs/heads/', '' );
		}

		const apiName = isExisting ? 'updateRelease' : 'createRelease';
		const response = await repos[ apiName ]( params );

		return {
			id: response.data.id,
			assets,
		};
	}

	async function updateExtensionAsset( { id, assets = [] } ) {
		const extensionName = path.basename( assetPath );
		const extensionAsset = assets.find(
			( asset ) => asset.name === extensionName
		);

		if ( extensionAsset ) {
			core.info( 'Deleting the existing extension asset …' );

			await repos.deleteReleaseAsset( {
				...context.repo,
				asset_id: extensionAsset.id,
			} );
		}

		core.info( 'Updating the extension asset …' );

		return await repos.uploadReleaseAsset( {
			...context.repo,
			headers: {
				'content-type': assetContentType,
				'content-length': fs.statSync( assetPath ).size,
			},
			release_id: id,
			name: extensionName,
			data: fs.readFileSync( assetPath ),
		} );
	}

	async function updateTag() {
		core.info( `Updating the ref of tag ${ tag } to ${ context.sha } …` );

		return git.updateRef( {
			...context.repo,
			force: true,
			ref: `tags/${ tag }`,
			sha: context.sha,
		} );
	}

	return Promise.resolve()
		.then( findExistingRelease )
		.then( publishRelease )
		.then( updateExtensionAsset )
		.then( updateTag )
		.catch( handleActionErrors );
};
