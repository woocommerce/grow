<?php
/**
 * Simulate command.
 *
 * @package WR\Command
 */

namespace Automattic\WooCommerce\Grow\WR\Commands;

/**
 * Class for implementing the simulate release command.
 */
class Simulate extends Release {
	/**
	 * The default command name.
	 *
	 * @var string|null
	 */
	protected static $defaultName = 'simulate'; // phpcs:ignore WordPress.NamingConventions.ValidVariableName

	/**
	 * Configures the current command.
	 */
	protected function configure() {
		parent::configure();

		$this->simulate = true;

		$this
			->setDescription( 'Simulates the release process, following the standard Woo process.' )
			->setHelp( 'This command allows you to create a fully simulated release (skipping the deploy and release to GitHub).' );
	}
}
