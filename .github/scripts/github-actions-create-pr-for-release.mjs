/**
 * Internal dependencies
 */
import PackageTool from '../../packages/github-actions/utils/package-tool.js';

export default async ( { github, context, refName, version } ) => {
	const packageTool = new PackageTool( 'packages/github-actions' );
	const { heading, content } = packageTool.getChangelogByVersion( version );

	const title = `Release version ${ version } of the \`github-actions\` package`;
	const body = `## Checks
- [ ] The updated version in the package.json and package-lock.json is correct.
- [ ] The changelog is correct.
## Next steps
1. Approve this PR to allow [the next workflow creates a new release](https://github.com/woocommerce/grow/actions/workflows/github-actions-create-release.yml).
1. Merge this PR after the new release is successfully created and [the version tags are updated](https://github.com/woocommerce/grow/actions/workflows/github-actions-release.yml).
---
${ heading }
${ content }`;

	await github.rest.pulls.create( {
		...context.repo,
		base: 'source/actions-v1',
		head: refName,
		title,
		body,
	} );
};
