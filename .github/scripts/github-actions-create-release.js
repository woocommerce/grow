const fs = require( 'fs' );

module.exports = async ( { github, context, workspace, outputJsonPath } ) => {
	const packageDir = 'packages/js/github-actions';
	const { default: PackageTool } = await import(
		`${ workspace }/${ packageDir }/utils/package-tool.js`
	);

	const packageTool = new PackageTool( packageDir );
	const { version } = packageTool.getSettings();
	const { content } = packageTool.getChangelogByVersion( version );
	const tag = `actions-v${ version }`;
	const name = `github-actions ${ version }`;
	const body = `## What's Changed\n${ content }`;
	let release;

	try {
		const response = await github.rest.repos.createRelease( {
			...context.repo,
			tag_name: tag,
			target_commitish: context.payload.pull_request.head.ref,
			name,
			body,
		} );
		release = response.data;
	} catch ( e ) {
		await github.rest.pulls.dismissReview( {
			...context.repo,
			pull_number: context.payload.pull_request.number,
			review_id: context.payload.review.id,
			message: 'Release creation workflow failed',
		} );
		throw e;
	}

	const commentBody = `New release has been created: [${ release.name }](${ release.html_url })`;
	await github.rest.issues.createComment( {
		...context.repo,
		issue_number: context.payload.pull_request.number,
		body: commentBody,
	} );

	fs.writeFileSync( outputJsonPath, JSON.stringify( release ), 'utf8' );
};
