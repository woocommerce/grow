<?php

namespace Automattic\WooCommerce\Grow\Ventures\Installer;

use Composer\Composer;
use Composer\EventDispatcher\EventSubscriberInterface;
use Composer\IO\IOInterface;
use Composer\Plugin\PluginInterface;
use Composer\Script\ScriptEvents;

/**
 * Class Plugin
 *
 * @since %VERSION%
 */
class Plugin implements PluginInterface, EventSubscriberInterface {

	/** @var Composer */
	protected $composer;

	/** @var IOInterface */
	protected $io;

	/**
	 * Returns an array of event names this subscriber wants to listen to.
	 *
	 * The array keys are event names and the value can be:
	 *
	 * * The method name to call (priority defaults to 0)
	 * * An array composed of the method name to call and the priority
	 * * An array of arrays composed of the method names to call and respective
	 *   priorities, or 0 if unset
	 *
	 * For instance:
	 *
	 * * array('eventName' => 'methodName')
	 * * array('eventName' => array('methodName', $priority))
	 * * array('eventName' => array(array('methodName1', $priority), array('methodName2'))
	 *
	 * @return array<string, string|array{0: string, 1?: int}|array<array{0: string, 1?: int}>> The event names to
	 *                       listen to
	 */
	public static function getSubscribedEvents() {
		return [
			ScriptEvents::POST_INSTALL_CMD => [

			],
			ScriptEvents::POST_UPDATE_CMD  => [

			],
		];
	}

	/**
	 * Apply plugin modifications to Composer
	 *
	 * @param Composer    $composer
	 * @param IOInterface $io
	 *
	 * @return void
	 */
	public function activate( Composer $composer, IOInterface $io ) {
		$this->composer = $composer;
		$this->io       = $io;
	}

	/**
	 * Remove any hooks from Composer
	 *
	 * This will be called when a plugin is deactivated before being
	 * uninstalled, but also before it gets upgraded to a new version
	 * so the old one can be deactivated and the new one activated.
	 *
	 * @param Composer    $composer
	 * @param IOInterface $io
	 *
	 * @return void
	 */
	public function deactivate( Composer $composer, IOInterface $io ) {
		// These aren't the droids you're looking for. Move along.
	}

	/**
	 * Prepare the plugin to be uninstalled
	 *
	 * This will be called after deactivate.
	 *
	 * @param Composer    $composer
	 * @param IOInterface $io
	 *
	 * @return void
	 */
	public function uninstall( Composer $composer, IOInterface $io ) {
		// These aren't the droids you're looking for. Move along.
	}
}
