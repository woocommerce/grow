var wooExtensionCreatePrForRelease = async ( { context, github, inputs, refName } ) => {
	const {
		'main-branch': base,
		'post-steps': postSteps,
		'pre-steps': preSteps,
		type,
		version,
		'wc-version': wcVersion,
		'wp-version': wpVersion,
	} = inputs;
	// Assume the extension package is named as the repo.
	const extensionPackageName = context.payload.repository.name;
	// Build repo URL. WooRelease expects HTML one with `https://github.com/…/tree…`.
	const repoURL =
		context.payload.repository.html_url + '/tree/' + type + '/' + version;

	const testedVersions =
		( wpVersion ? ' --wp_tested=' + wpVersion : '' ) +
		( wcVersion ? ' --wc_tested=' + wcVersion : '' );

	const title = `${
		type.charAt( 0 ).toUpperCase() + type.slice( 1 )
	} ${ version }`;
	// We need to add only one newline before the pre-steps to make sure it's rendered as a list.
	let trimmedPreSteps = preSteps;
	if ( trimmedPreSteps !== '' ) {
		trimmedPreSteps = '\n' + trimmedPreSteps.trim();
	}

	const body = `## Checklist
1. [ ] Check if the version, base, and target branches are as you desire.
1. [ ] Make sure you have \`woorelease\` installed and set up.
1. [ ] Go to your local repo clone, and check out this PR to be able to commit any potential adjustments.
   \`\`\`sh
   git fetch origin ${ refName }
   git checkout ${ refName }
   \`\`\`${ trimmedPreSteps }
1. [ ] Simulate the release locally
   \`\`\`sh
   woorelease simulate --product_version=${ version } ${ testedVersions } --generate_changelog ${ repoURL }
   \`\`\`
   _Note: Select \`y\` when prompted: "Would you like to add/delete them in the svn working copy?"_
1. [ ] The changelog is correct.
   Check if some entries are missing, need rewording, or need to be deleted. You can edit respective PRs by changing their title, \`### Changelog entry\` section, or assigning the \`changelog: none\` label.
   You can also edit the changelog manually in the \`woorelease release\` step later.
1. [ ] Automated tests are passing.
1. [ ] Test the package
   1. [ ] Install the \`/tmp/${ extensionPackageName }.zip\` file on a test site
   1. [ ] Confirm it activates without warnings/errors and is showing the right versions
   1. [ ] Run a few basic smoke tests

## Next steps
1. [ ] Do the final release
   \`\`\`
   woorelease release --product_version=${ version } ${ testedVersions }  --generate_changelog ${ repoURL }
   \`\`\`
   When prompted for changelog entries, double-check and apply any changes if needed.
1. [ ] Go to ${ context.payload.repository.html_url }/releases/${ version }, generate GitHub release notes, and paste them as a comment here.
1. [ ] Merge this PR after the new release is successfully created and the version tags are updated.
1. [ ] Merge \`trunk\` to \`develop\` (PR), if applicable for this repo.
1. [ ] Update documentation
   - [ ] Publish any new required docs
   - [ ] Update triggers/rules/actions listing pages
1. [ ] Mark related ideas complete [on the feature requests page](https://woo.com/feature-requests/${ extensionPackageName }/).
${ postSteps }
`;

	const pull = await github.rest.pulls.create( {
		...context.repo,
		base,
		head: refName,
		title,
		body,
	} );
	return pull.data;
};

export { wooExtensionCreatePrForRelease as default };
