<?php

namespace Automattic\WooCommerce\Grow\WR\Commands;

use InvalidArgumentException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\LogicException;
use Symfony\Component\Console\Exception\RuntimeException;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputDefinition;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use WR\Application;
use WR\Command\Release;

/**
 * Class Bulk
 *
 * @since %VERSION%
 */
class Bulk extends Command {
	/**
	 * Configures the current command.
	 */
	protected function configure() {
		$this
			->setName( 'bulk' )
			->setDescription( 'Run a bulk simulate or release.' )
			->addArgument(
				'release-command',
				InputArgument::REQUIRED,
				'The command to run in bulk.'
			);

		// We're going to do our own validation, so ignore those errors.
		$this->ignoreValidationErrors();
	}

	/**
	 * Initializes the command after the input has been bound and before the input
	 * is validated.
	 *
	 * This is mainly useful when a lot of commands extends one main command
	 * where some things need to be initialized based on the input arguments and options.
	 *
	 * @see InputInterface::bind()
	 * @see InputInterface::validate()
	 */
	protected function initialize( InputInterface $input, OutputInterface $output ) {
		// This throws an exception if the command is not found, which we want to allow.
		$command = $this->getApplication()->get( $input->getArgument( 'release-command' ) );
		if ( ! $command instanceof Release ) {
			throw new InvalidArgumentException(
				sprintf(
					'Command "%s" is not an instance of %s',
					$command->getName(),
					Release::class
				)
			);
		}

		// Get the command definition and merge it to this command definition.
		$newDefinition = new InputDefinition();
		$newOptions    = [];

		$commandOptions = $command->getDefinition()->getOptions();
		foreach ( $commandOptions as $commandOption ) {
			// Skip the product_version option.
			if ( 'product_version' === $commandOption->getName() ) {
				continue;
			}

			$newOptions[] = $commandOption;
		}

		$newDefinition->setArguments( $this->getDefinition()->getArguments() );
		$newDefinition->setOptions( $this->getDefinition()->getOptions() );
		$newDefinition->addOptions( $newOptions );

		$this->setDefinition( $newDefinition );
		$input->bind( $this->getDefinition() );
	}

	/**
	 * Executes the current command.
	 *
	 * @return int 0 if everything went fine, or an exit code
	 *
	 * @throws LogicException When this abstract method is not implemented
	 *
	 * @see setCode()
	 */
	protected function execute( InputInterface $input, OutputInterface $output ) {
		/** @var Release $releaseCommand */
		$releaseCommand = $this->getApplication()->get( $input->getArgument( 'release-command' ) );

		// Set up the provided options as flag values.
		$options = [];
		foreach ( array_filter( $input->getOptions() ) as $option => $value ) {
			$options[ "--{$option}" ] = $value;
		}

		$errors = [];
		foreach ( $this->getReleaseData() as $item ) {
			$output->writeln( sprintf( '<info>Starting release for %s...</info>', $item['name'] ) );
			$gitHubUrl = sprintf(
				'https://github.com/%1$s/%2$s/tree/%3$s',
				$item['organization'],
				$item['repo'],
				$item['branch']
			);

			$args = array_merge(
				$options,
				[
					'github_url'        => $gitHubUrl,
					'--product_version' => $item['version'],
				]
			);

			$result = $releaseCommand->run( new ArrayInput( $args ), $output );
			if ( static::SUCCESS !== $result ) {
				$output->writeln( sprintf( "\n<error>Release FAILED for %s</error>\n", $item['name'] ) );

				$errors[] = $item['name'];
			}

			$output->writeln( sprintf( "<info>Finished release for %s</info>\n", $item['name'] ) );
		}

		if ( empty( $errors ) ) {
			return static::SUCCESS;
		}

		$output->writeln(
			sprintf(
				"<error>The following %1\$d %2\$s failed to release: %3\$s.</error>\n\n<error>Please check the log for more details.</error>",
				count( $errors ),
				count( $errors ) === 1 ? 'product' : 'products',
				join( ', ', $errors )
			)
		);

		return static::FAILURE;
	}

	/**
	 * Get data from the release.txt file about what extensions to release.
	 *
	 * @return array
	 */
	private function getReleaseData(): array {
		$app = $this->getApplication();
		if ( ! $app instanceof Application ) {
			throw new RuntimeException( sprintf( 'Expected application to be an instance of %s', Application::class ) );
		}

		$fileSystem = new Filesystem();
		$file       = "{$app->get_meta('root_dir')}/release.txt";
		if ( ! $fileSystem->exists( $file ) ) {
			throw new RuntimeException( sprintf( 'Release file does not exist. Expected path: %s', $file ) );
		}

		$extensionData      = json_decode( file_get_contents( "{$app->get_meta('root_dir')}/extensions.json" ), true );
		$defaultBranch      = $extensionData['defaultBranch'] ?? 'trunk';
		$githubOrganization = $extensionData['githubOrganization'] ?? 'woocommerce';
		$extensions         = array_column( $extensionData['extensions'] ?? [], null, 'repoSlug' );

		$toRelease = [];
		$resource  = fopen( $file, 'r' );
		while ( false !== ( $line = fgets( $resource ) ) ) {
			$line = trim( $line );

			// Lines starting with # are a comment and should be ignored.
			if ( str_starts_with( $line, '#' ) ) {
				continue;
			}

			// Empty lines should be ignored.
			if ( '' === $line ) {
				continue;
			}

			[ $slug, $version, $branch ] = array_pad( explode( "\t", $line ), 3, null );
			$toRelease[ $slug ]          = [
				'name'         => $extensions[ $slug ]['name'],
				'repo'         => $extensions[ $slug ]['repoSlug'],
				'version'      => $version,
				'organization' => $extensions[ $slug ]['githubOrganization'] ?? $githubOrganization,
				'branch'       => $branch ?? $extensions[ $slug ]['defaultBranch'] ?? $defaultBranch,
			];
		}

		return $toRelease;
	}
}
