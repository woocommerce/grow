/**
 * External dependencies
 */
import { createRequire } from 'node:module';

/**
 * Loads a package of the caller repo, like `eslint` or `stylelint`, for a formatter
 * script that is copied into the caller repo.
 *
 * It first resolves the package from the formatter file. When that fails, it resolves
 * it from the running CLI script. With pnpm's default layout, a package that is only
 * a transitive dependency (for example eslint under `@wordpress/scripts`) is not
 * linked in the repo root, but the CLI script is a file inside that package.
 *
 * @param {string} name         Package name.
 * @param {string} formatterUrl URL or path of the formatter file.
 * @param {string} [cliPath]    Path of the running CLI script. Defaults to `process.argv[ 1 ]`.
 * @return {*} The exports of the package.
 */
export default function requireFromCaller(
	name,
	formatterUrl,
	cliPath = process.argv[ 1 ]
) {
	try {
		return createRequire( formatterUrl )( name );
	} catch ( error ) {
		if ( error.code !== 'MODULE_NOT_FOUND' ) {
			throw error;
		}

		try {
			return createRequire( cliPath )( name );
		} catch {
			throw error;
		}
	}
}
