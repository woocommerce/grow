<?php
/**
 * Woorelease main command.
 *
 * @package WR\Command
 */

namespace Automattic\WooCommerce\Grow\WR\Commands;

/**
 * Class for implementing the release command.
 */
class Simulate extends Release {

	protected static $defaultName = 'simulate';

	protected function configure() {
		parent::configure();

		$this->simulate = true;

		$this
			->setDescription( 'Simulates the release process, following the standard Woo process.' )
			->setHelp( 'This command allows you to create a fully simulated release (skipping the deploy and release to GitHub).' );
	}
}
