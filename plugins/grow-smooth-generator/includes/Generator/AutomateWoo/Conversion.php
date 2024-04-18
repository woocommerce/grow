<?php
namespace WC\Grow\SmoothGenerator\Generator\AutomateWoo;

use AutomateWoo\Workflows\Factory as Workflow_Factory;
use WC\SmoothGenerator\Generator\Generator;
use WC\SmoothGenerator\Generator\Order;
use WC_Order;
use WP_CLI;

/**
 * AutomateWoo Conversion data generator.
 */
class Conversion extends Generator {

	/**
	 * Return a new conversion.
	 *
	 * @param bool  $save Save the object before returning or not.
	 * @param array $assoc_args Arguments passed via the CLI for additional customization.
	 * @return WC_Order|false Order object with conversion data populated or false when failed.
	 */
	public static function generate( $save = true, $assoc_args = [] ) {
		$workflow = Workflow_Factory::get( $assoc_args['workflow'] );
		if ( ! $workflow || ! $workflow->is_conversion_tracking_enabled() ) {
			WP_CLI::error( 'Workflow does not have conversion tracking enabled.' );
		}

		// Generate order for tracking.
		$order = Order::generate( $save, $assoc_args );

		// Generate a workflow log entry.
		$workflow->set_data_item( 'order', $order );
		$workflow->set_data_item( 'user', $order->get_user() );
		$workflow->create_run_log();

		// Update log date to match order date.
		$log = $workflow->get_current_log();
		$log->set_date( $order->get_date_created() );
		$log->save();

		// Set order conversion tracking data.
		$order->update_meta_data( '_aw_conversion', $workflow->get_id() );
		$order->update_meta_data( '_aw_conversion_log', $log->get_id() );

		if ( $save ) {
			$order->save();
		}

		return $order;
	}
}
