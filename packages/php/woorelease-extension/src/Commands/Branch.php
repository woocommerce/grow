<?php
/**
 * Woorelease main command.
 *
 * @package WR\Command
 */

namespace Automattic\WooCommerce\Grow\WR\Commands;

use Automattic\WooCommerce\Grow\WR\Utils\Git as WooGrowGit;
use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use WR\Tools\Git;
use WR\Tools\Logger;
use WR\Tools\Utils;

/**
 * Class for implementing the release command.
 */
class Branch extends Command {

	protected static $defaultName = 'branch';

	public function __construct( string $name = null ) {
		parent::__construct( $name );
	}

	protected function configure() {
		$this
			->setDescription( 'Creates a release branch if does not exist.' )
			->setHelp( 'This command allows you to create a release branch.' )
			->addArgument( 'github_url', InputArgument::REQUIRED, 'Full GitHub URL for product to build.' )
			->addArgument( 'default_branch', InputArgument::REQUIRED, 'Default GitHub project branch name.' )
			->addOption( 'release', null, InputOption::VALUE_NONE, 'If specified, it will do an actual release branch creation instead of a simulation.' );
	}

	protected function execute( InputInterface $input, OutputInterface $output ) {
		try {
			$logger         = Logger::instance( $output );
			$github_url     = $input->getArgument( 'github_url' );
			$default_branch = $input->getArgument( 'default_branch' );
			$release        = false !== $input->getOption( 'release' );

			list( $product, $gh_org, $branch ) = Utils::parse_product_info( $github_url );

			// Prepare the release: check release/branch to exist.
			$repository_url    = sprintf( 'https://github.com/%1$s/%2$s', $gh_org, $product );
			$is_release_branch = WooGrowGit::does_branch_exist( $repository_url, $branch );
			if ( ! $is_release_branch ) {
				$output->writeln( sprintf( "\n<info>Release branch %s does not exist.</info>\n", $branch ) );
				if ( $create_release_branch && Utils::yes_no( sprintf(
						'You are trying to release from %s which does not exist. Do you want to create it from %s?',
						$branch,
						$default_branch
				) ) ) {
					$create = WooGrowGit::create_branch( $branch );
					if ( $release ) {
						$push = $create && WooGrowGit::push_branch( $repository_url, $branch );
						if ( ! $push ) {
							if ( ! Utils::yes_no( sprintf(
								'Branch %s has failed to create. Do you want to release from the %s branch?',
								$branch,
								$default_branch
							) ) ) {
								throw new Exception( 'Release cancelled.' );
							}
						}
					} else {
						$logger->notice( 'Simulation mode. Creating local branch {branch}. In simulation mode branch won\'t be pushed to remote.', array( 'branch' => $branch ) );
					}
				} else {
					if ( ! Utils::yes_no( sprintf(
						'You\'ve decided not to create %s branch. Do you want to release from the %s branch?',
						$branch,
						$default_branch
					) ) ) {
						throw new Exception( 'Release cancelled.' );
					}
				}
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
