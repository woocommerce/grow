<?php
/**
 * Woorelease main command.
 *
 * @package WR\Command
 */

namespace Automattic\WooCommerce\Grow\WR\Commands;

use Automattic\WooCommerce\Grow\WR\Utils\Git as WooGrowGit;
use Automattic\WooCommerce\Grow\WR\Utils\Product as WooGrowProduct;
use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use WR\Command\Release as WooReleaseRelease;
use WR\Tools\Git;
use WR\Tools\Logger;
use WR\Tools\Utils;
use WR\Tools\WP_Org;

/**
 * Class for implementing the release command.
 */
class Release extends WooReleaseRelease {
	/**
	 * The default command name.
	 *
	 * @var string|null
	 */
	protected static $defaultName = 'release'; // phpcs:ignore WordPress.NamingConventions.ValidVariableName

	/**
	 * Configures the current command.
	 *
	 * @return void
	 */
	protected function configure() {
		parent::configure();
		$this
			->addOption( 'nvm_use', null, InputOption::VALUE_NONE, 'If specified, the release will use `nvm use`' )
			->addOption( 'default_branch', null, InputOption::VALUE_OPTIONAL, 'If specified, the release branch will be created from it.' );
	}

	/**
	 * Executes the command.
	 *
	 * @param InputInterface  $input  The input interface, to get options, arguments, etc.
	 * @param OutputInterface $output The output interface.
	 *
	 * @return int 0 if everything went fine, or an exit code
	 * @throws Exception In case of error.
	 */
	protected function execute( InputInterface $input, OutputInterface $output ) {
		try {
			$logger                = Logger::instance( $output );
			$github_url            = $input->getArgument( 'github_url' );
			$version               = $input->getOption( 'product_version' );
			$wc_tested             = $input->getOption( 'wc_tested' );
			$wp_tested             = $input->getOption( 'wp_tested' );
			$prerelease            = $input->getOption( 'prerelease' );
			$generate_changelog    = $input->getOption( 'generate_changelog' );
			$nvm_use               = $input->getOption( 'nvm_use' );
			$default_branch        = $input->getOption( 'default_branch' );
			$release               = ! $this->simulate;
			$reauth                = false !== $input->getOption( 'svn_reauth' );

			list( $product, $gh_org, $branch ) = Utils::parse_product_info( $github_url );

			$logger->notice( 'Processing product {product}...', [ 'product' => $product ] );

			// Clone product.
			$folder = WooGrowGit::clone_product_release_or_default( $product, $branch, $default_branch, $gh_org );

			// Call branch command to create release branch or release from default.
			$command   = $this->getApplication()->find( 'branch' );
			$arguments = [
				'github_url'     => $github_url,
				'default_branch' => $default_branch,
				'--folder'       => $folder,
			];

			if ( Command::SUCCESS !== $command->run( new ArrayInput( $arguments ), $output ) ) {
				return Command::FAILURE;
			}
			// Get current active branch name after the branch command.
			$active_branch = $this->getApplication()->get_meta( "{$product}_branch" ) ?? $branch;
			// Update $branch and $github_url with currently active branch name.
			if ( $branch !== $active_branch ) {
				$branch     = $active_branch;
				$github_url = sprintf( 'https://github.com/%1$s/%2$s/tree/%3$s', $gh_org, $product, $branch );
			}

			if ( empty( $folder ) ) {
				$output->writeln( sprintf( "\n<error>Release FAILED for %s</error>\n", $product ) );
				throw new Exception( sprintf( 'Cloning %s repository branch %s have failed.', $product, $branch ) );
			}

			// If $version is not supplied, use current and bump the patch version.
			if ( ! isset( $version ) ) {
				$package_file = $folder . '/package.json';

				if ( ! file_exists( $package_file ) ) {
					throw new \Exception( 'Did not find required "package.json" file in product', 2 );
				}

				$version_file = file_get_contents( $folder . '/package.json' );

				$entry_regex = '/^\s*"version":\s*"(?<version>\d+\.\d+\.\d+)"/ms';

				if ( preg_match( $entry_regex, $version_file, $matches ) ) {
					$version_parts = explode( '.', $matches['version'] );
					$version       = $version_parts[0] . '.' . $version_parts[1] . '.' . (int) ++$version_parts[2];
				}
			}

			// Call vb:replace command.
			$command   = $this->getApplication()->find( 'vb:replace' );
			$arguments = [
				'github_url'        => $github_url,
				'--folder'          => $folder,
				'--product_version' => $version,
				// Don't make a separate commit for PHPDoc version replacements
				'--release'         => false,
			];

			if ( Command::SUCCESS !== $command->run( new ArrayInput( $arguments ), $output ) ) {
				return Command::FAILURE;
			}

			// Call vb:change command.
			$command   = $this->getApplication()->find( 'vb:change' );
			$arguments = [
				'github_url'           => $github_url,
				'--folder'             => $folder,
				'--product_version'    => $version,
				'--wc_tested'          => $wc_tested,
				'--wp_tested'          => $wp_tested,
				'--release'            => $release,
				'--generate_changelog' => $generate_changelog,
			];

			if ( Command::SUCCESS !== $command->run( new ArrayInput( $arguments ), $output ) ) {
				return Command::FAILURE;
			}

			// Call cl:generate command.
			$command   = $this->getApplication()->find( 'cl:generate' );
			$arguments = [
				'github_url'        => $github_url,
				'--folder'          => $folder,
				'--product_version' => $version,
				'--wc_tested'       => $wc_tested,
				'--wp_tested'       => $wp_tested,
				'--release'         => $release,
				'--parse_only'      => empty( $generate_changelog ),
			];

			if ( Command::SUCCESS !== $command->run( new ArrayInput( $arguments ), $output ) ) {
				return Command::FAILURE;
			}

			// If version was not specified, attempt to read it from meta added by `cl:generate`.
			if ( empty( $version ) ) {
				if ( $this->getApplication()->has_meta( 'version' ) ) {
					$version = $this->getApplication()->get_meta( 'version' );
				}

				if ( empty( $version ) ) {
					throw new \Exception( 'Could not auto-detect version.', 76 );
				}
			}

			$logger->notice( 'Building product' );
			$grow_root_path = $this->getApplication()->get_meta( 'root_dir' );
			$zip_file       = WooGrowProduct::maybe_build_with_nvm( $nvm_use, $grow_root_path, $product, $folder );

			// Call wccom:release or wporg:release command.
			$wp_org_slug = WP_Org::maybe_get_slug( $product, $folder );
			$arguments   = [
				'github_url' => $github_url,
				'--folder'   => $folder,
				'--zip_file' => $zip_file,
				'--release'  => $release,
			];
			if ( false !== $wp_org_slug ) {
				$logger->notice( "Found product slug for WordPress.org: '{org_slug}'. Following .org release process.", [ 'org_slug' => $wp_org_slug ] );
				$release_command = 'wporg:release';
				if ( $version ) {
					$arguments['--product_version'] = $version;
				}
				if ( $reauth ) {
					$arguments['--svn_reauth'] = true;
				}
			} else {
				$release_command = 'wccom:release';
			}

			$command = $this->getApplication()->find( $release_command );

			if ( Command::SUCCESS !== $command->run( new ArrayInput( $arguments ), $output ) ) {
				return Command::FAILURE;
			}

			// Create GitHub release with command gh:release.
			if ( $release ) {
				$command   = $this->getApplication()->find( 'gh:release' );
				$arguments = [
					'github_url'        => $github_url,
					'--folder'          => $folder,
					'--product_version' => $version,
					'--zip_file'        => $zip_file,
					'--prerelease'      => $prerelease,
				];

				if ( Command::SUCCESS !== $command->run( new ArrayInput( $arguments ), $output ) ) {
					return Command::FAILURE;
				}
			} else {
				$logger->notice( 'Simulation mode. Skipping upload of asset {asset} to GH release.', [ 'asset' => $zip_file ] );
			}

			if ( $release ) {
				if ( empty( $version ) ) {
					$logger->warning( 'Could not auto-detect version, optional translation trigger was not executed.' );
				} else {
					$command   = $this->getApplication()->find( 'translate:trigger' );
					$arguments = [
						'github_url'        => $github_url,
						'--product_version' => $version,
						'--folder'          => $folder,
					];

					if ( Command::SUCCESS !== $command->run( new ArrayInput( $arguments ), $output ) ) {
						return Command::FAILURE;
					}
				}
			} else {
				$logger->notice( 'Simulation mode. Skipping optional translations trigger.' );
			}

			// Cleaning up the mess after simulations.
			if ( ! $release ) {
				$command   = $this->getApplication()->find( 'branch' );
				$arguments = [
					'github_url'     => $github_url,
					'default_branch' => $default_branch,
					'--folder'       => $folder,
					'--cleanup'      => true,
				];
				if ( Command::SUCCESS === $command->run( new ArrayInput( $arguments ), $output ) ) {
					$logger->notice( 'Simulation mode. Release branch cleanup has succeeded.' );
				} else {
					$logger->error( 'Simulation mode. Release branch cleanup has failed. Please cleanup `{branch}` branch manually.', [ 'branch' => $branch ] );
				}
			}

			// End simulation mode.
			if ( ! $release ) {
				Git::output_diff( $folder );
				$logger->notice( WOORELEASE_PRODUCT_NAME . ' simulation finished.' );
				Utils::display_release_command();

				return Command::SUCCESS;
			}

			// End release.
			$logger->notice( WOORELEASE_PRODUCT_NAME . ' finished.' );

			return Command::SUCCESS;
		} catch ( \Exception $e ) {
			Utils::handle_error( $e );

			return Command::FAILURE;
		}
	}
}
