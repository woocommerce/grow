<?php

namespace Automattic\WooCommerce\Grow\WR\Commands;

use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Automattic\WooCommerce\Grow\WR\Utils\VersionReplace as VR;
use WR\Command\Versionbump_Replace;
use WR\Tools\Git;
use WR\Tools\Logger;
use WR\Tools\Utils;

/**
 * Class VersionReplace
 *
 * @since %VERSION%
 */
class VersionReplace extends Versionbump_Replace {
	/**
	 * Configures the current command.
	 */
	protected function configure() {
		parent::configure();
		$this->setName( 'vb:replace' );
		$this->setDescription( "{$this->getDescription()} (Ventures version)" );
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
			$logger  = Logger::instance( $output );
			$folder  = $input->getOption( 'folder' );
			$version = $input->getOption( 'product_version' );
			$release = $input->getOption( 'release' );

			[ $product, $gh_org, $branch ] = Utils::parse_product_info( $input->getArgument( 'github_url' ) );

			$logger->notice( 'Processing product {product}...', [ 'product' => $product ] );

			// If we don't have a repo folder then clone the product.
			$folder = $folder ?? Git::clone_product( $product, $branch, $gh_org );

			// Try to replace versions.
			if ( ! empty( $version ) ) {
				VR::maybe_replace( $product, $folder, $version );
			}

			// Log changes applied by the script.
			Git::output_diff( $folder, 'log' );

			// Commit changes after version updates.
			if ( ! $release ) {
				$logger->notice(
					'Simulation mode. No commit or push to GitHub. Review repo here {folder}',
					[ 'folder' => $folder ]
				);
			} else {
				$logger->notice( 'Committing and pushing to GitHub for {product}...', [ 'product' => $product ] );
				Git::commit_changes( $folder, 'PHPDoc version replacements' );
			}

			$logger->notice( WOORELEASE_PRODUCT_NAME . ' completed replacing version strings.' );

			return Command::SUCCESS;
		} catch ( Exception $e ) {
			Utils::handle_error( $e );

			return Command::FAILURE;
		}
	}
}
