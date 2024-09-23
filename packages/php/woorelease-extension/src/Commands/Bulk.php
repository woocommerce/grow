<?php

namespace Automattic\WooCommerce\Grow\WR\Commands;

use Automattic\WooCommerce\Grow\WR\Utils\Nvm;
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
	 * @param InputInterface  $input  The input interface, to get options, arguments, etc.
	 * @param OutputInterface $output The output interface.
	 *
	 * @throws InvalidArgumentException When the command is not found.
	 *
	 * @see InputInterface::bind()
	 * @see InputInterface::validate()
	 */
	protected function initialize( InputInterface $input, OutputInterface $output ) {
		// This throws an exception if the command is not found, which we want to allow.
		$command = $this->getApplication()->get( $input->getArgument( 'release-command' ) );

		$is_not_release  = ! $command instanceof Release;
		$is_not_simulate = ! $command instanceof Simulate;
		if ( $is_not_release && $is_not_simulate ) {
			throw new InvalidArgumentException(
				sprintf(
					'Command "%s" (%s) is not an instance of %s',
					$command->getName(),
					get_class( $command ),
					Release::class
				)
			);
		}

		// Get the command definition and merge it to this command definition.
		$new_definition = new InputDefinition();
		$new_options    = [];

		$command_options = $command->getDefinition()->getOptions();
		foreach ( $command_options as $command_option ) {
			// Skip the product_version option.
			if ( 'product_version' === $command_option->getName() ) {
				continue;
			}

			$new_options[] = $command_option;
		}

		$new_definition->setArguments( $this->getDefinition()->getArguments() );
		$new_definition->setOptions( $this->getDefinition()->getOptions() );
		$new_definition->addOptions( $new_options );

		$this->setDefinition( $new_definition );
		$input->bind( $this->getDefinition() );
	}

	/**
	 * Executes the current command.
	 *
	 * @param InputInterface  $input  The input interface, to get options, arguments, etc.
	 * @param OutputInterface $output The output interface.
	 *
	 * @return int 0 if everything went fine, or an exit code
	 *
	 * @throws LogicException When this abstract method is not implemented.
	 *
	 * @see setCode()
	 */
	protected function execute( InputInterface $input, OutputInterface $output ) {
		/** @var Release $release_command */
		$release_command = $this->getApplication()->get( $input->getArgument( 'release-command' ) );

		// Set up the provided options as flag values.
		$options = [];
		foreach ( array_filter( $input->getOptions() ) as $option => $value ) {
			$options[ "--{$option}" ] = $value;
		}

		$errors = [];
		foreach ( $this->getReleaseData() as $item ) {
			$output->writeln( sprintf( '<info>Starting release for %s...</info>', $item['name'] ) );
			$git_hub_url = sprintf(
				'https://github.com/%1$s/%2$s/tree/%3$s',
				$item['organization'],
				$item['repo'],
				$item['branch']
			);

			$args = array_merge(
				$options,
				[
					'github_url'        => $git_hub_url,
					'--product_version' => $item['version'],
					'--default_branch'  => $item['default_branch'],
				]
			);

			$grow_root_path = $this->getApplication()->get_meta( 'root_dir' );
			if ( Nvm::does_nvm_exist( $grow_root_path ) ) {
				$args['--nvm_use'] = true;
			}

			$result = $release_command->run( new ArrayInput( $args ), $output );
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
	 *
	 * @throws RuntimeException When the application is not an instance of `Application` or the release.txt file does not exist.
	 */
	private function getReleaseData(): array {
		$app = $this->getApplication();
		if ( ! $app instanceof Application ) {
			throw new RuntimeException( sprintf( 'Expected application to be an instance of %s', Application::class ) );
		}

		$file_system = new Filesystem();
		$file        = "{$app->get_meta('root_dir')}/release.txt";
		if ( ! $file_system->exists( $file ) ) {
			throw new RuntimeException( sprintf( 'Release file does not exist. Expected path: %s', $file ) );
		}

		// It's a local file.
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$extension_data      = json_decode( file_get_contents( "{$app->get_meta('root_dir')}/extensions.json" ), true );
		$default_branch      = $extension_data['defaultBranch'] ?? 'develop';
		$github_organization = $extension_data['githubOrganization'] ?? 'woocommerce';
		$extensions          = array_column( $extension_data['extensions'] ?? [], null, 'repoSlug' );

		// This woorelease extension is not performed in WordPress.
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen
		$resource   = fopen( $file, 'r' );
		$to_release = [];
		while ( ! feof( $resource ) ) {
			$line = fgets( $resource );
			$line = trim( $line );

			// Lines starting with # are a comment and should be ignored.
			if ( str_starts_with( $line, '#' ) ) {
				continue;
			}

			// Empty lines should be ignored.
			if ( '' === $line ) {
				continue;
			}

			[ $slug, $version, $branch ] = array_pad( explode( "\t", $line ), 4, null );
			$to_release[ $slug ] = [
				'name'           => $extensions[ $slug ]['name'],
				'repo'           => $extensions[ $slug ]['repoSlug'],
				'version'        => $version,
				'organization'   => $extensions[ $slug ]['githubOrganization'] ?? $github_organization,
				'branch'         => $branch ?? $extensions[ $slug ]['defaultBranch'] ?? $default_branch,
				'default_branch' => $extensions[ $slug ]['defaultBranch'] ?? $default_branch,
			];
		}

		return $to_release;
	}
}
