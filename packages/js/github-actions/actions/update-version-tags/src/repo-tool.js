/**
 * External dependencies
 */
import github from '@actions/github';

/**
 * Class operates a GitHub repository.
 */
export default class RepoTool {
	/**
	 * Create a RepoTool instance.
	 *
	 * @param {string} token The personal access token or GITHUB_TOKEN of the repo.
	 * @param {Object} context The context of the current action.
	 */
	constructor( token, context ) {
		this.context = context;
		this.octokit = github.getOctokit( token );
		this.git = this.octokit.rest.git;
	}

	/**
	 * Checks if the given tag exists in the repository.
	 *
	 * @param {string} tag The tag to be checked. For example, 'v1.2-tools'.
	 * @return {Promise} Promise instance represents whether the given tag exists.
	 * @throws {Response} Will throw the response instance if it could not determine the result.
	 */
	async hasTag( tag ) {
		try {
			await this.git.getRef( {
				...this.context.repo,
				ref: `tags/${ tag }`,
			} );
		} catch ( response ) {
			// Status code 404 means the `ref` doesn't exist.
			// Doc: https://docs.github.com/en/rest/git/refs#get-a-reference
			if ( response.status === 404 ) {
				return false;
			}
			throw response;
		}
		return true;
	}

	/**
	 * Force updates the reference of the given tag onto the specified commit.
	 *
	 * @param {string} tag The tag to be updated. For example, 'v1.2-tools'.
	 * @param {string} sha The SHA1 value of the commit to set this reference to.
	 * @return {Promise} Promise instance represents the result of this operation.
	 */
	async updateTag( tag, sha ) {
		return this.git.updateRef( {
			...this.context.repo,
			force: true,
			ref: `tags/${ tag }`,
			sha,
		} );
	}

	/**
	 * Creates a new tag reference onto the specified commit if the given tag doesn't exist.
	 * Otherwise, force updates the reference of the given tag onto the specified commit.
	 *
	 * @param {string} tag The tag to be updated or created. For example, 'v1.2-tools'.
	 * @param {string} sha The SHA1 value of the commit to set this reference to.
	 * @return {Promise} Promise instance represents the result of this operation.
	 */
	async upsertTag( tag, sha ) {
		if ( await this.hasTag( tag ) ) {
			return this.updateTag( tag, sha );
		}

		return this.git.createRef( {
			...this.context.repo,
			ref: `refs/tags/${ tag }`,
			sha,
		} );
	}
}
