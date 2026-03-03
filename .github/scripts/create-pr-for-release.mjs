/**
 * Internal dependencies
 */
import PackageTool from '../../packages/github-actions/utils/package-tool.js';

export default async ( {
	github,
	context,
	refName,
	version,
	packageDir,
	packageName,
	createReleaseWorkflow,
	releaseWorkflow,
} ) => {
	const packageTool = new PackageTool( packageDir );
	const { heading, content } = packageTool.getChangelogByVersion( version );

	const { owner, repo } = context.repo;
	const workflowBaseUrl = `https://github.com/${ owner }/${ repo }/actions/workflows`;

	const title = `Release version ${ version } of the \`${ packageName }\` package`;
	const body = `## Checks
- [ ] The updated version in the package.json and package-lock.json (if present) is correct.
- [ ] The changelog is correct.
## Next steps
1. Approve this PR to allow [the next workflow creates a new release](${ workflowBaseUrl }/${ createReleaseWorkflow }).
1. After the new release is successfully created, [the release workflow](${ workflowBaseUrl }/${ releaseWorkflow }) will update the version tags and merge this PR automatically.
---
${ heading }
${ content }`;

	await github.rest.pulls.create( {
		...context.repo,
		base: 'trunk',
		head: refName,
		title,
		body,
	} );
};
