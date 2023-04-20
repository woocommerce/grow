<?php
namespace WC\Grow\SmoothGenerator\Generator\AutomateWoo;

use AutomateWoo\Log;
use AutomateWoo\Workflows\Factory as Workflow_Factory;
use WC\SmoothGenerator\Generator\Generator;
use WP_CLI;
use WP_User;

/**
 * AutomateWoo Conversion data generator.
 */
class EmailTracking extends Generator {

	/**
	 * Return a new conversion.
	 *
	 * @param bool  $save Save the object before returning or not.
	 * @param array $assoc_args Arguments passed via the CLI for additional customization.
	 * @return Log|false Workflow Run log with tracking data populated or false when failed.
	 */
	public static function generate( $save = true, $assoc_args = [] ) {

		$workflow = Workflow_Factory::get( $assoc_args['workflow'] );
		if ( ! $workflow || ! $workflow->is_conversion_tracking_enabled() ) {
			WP_CLI::error( 'Workflow does not have conversion tracking enabled.' );
		}

		// Generate a workflow log entry.
		$workflow->set_data_item( 'user', self::get_user() );
		$workflow->create_run_log();

		// Get two random dates within date range and sort.
		$dates = [
			self::get_date( $assoc_args, true ),
			self::get_date( $assoc_args, true ),
		];
		sort( $dates );

		// Update log date to match order date.
		$log = $workflow->get_current_log();
		$log->set_date( $dates[0] );

		// Track an open event.
		if ( ! $log->has_open_recorded() ) {
			$tracking = $log->get_meta( 'tracking_data' );

			if ( ! $tracking ) {
				$tracking = [];
			}

			$tracking[] = [
				'type' => 'open',
				'date' => $dates[0],
			];

			$log->update_meta( 'tracking_data', $tracking );
		}

		// Randomly track click event with a different date.
		$track_click = (bool) wp_rand( 0, 1 );
		if ( $track_click && ! $log->has_click_recorded() ) {
			$tracking = $log->get_meta( 'tracking_data' );

			if ( ! $tracking ) {
				$tracking = [];
			}

			$tracking[] = [
				'type' => 'click',
				'date' => $dates[1],
			];

			$log->update_meta( 'tracking_data', $tracking );
		}

		if ( $save ) {
			$log->save();
		}

		return $log;
	}

	/**
	 * Get an existing user.
	 *
	 * @return WP_User User object with data populated.
	 */
	public static function get_user() {
		global $wpdb;

		$total_users = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->users}" );
		$offset      = wp_rand( 0, $total_users );
		$user_id     = (int) $wpdb->get_var( "SELECT ID FROM {$wpdb->users} ORDER BY rand() LIMIT $offset, 1" ); // phpcs:ignore
		return get_user_by( 'id', $user_id );
	}

	/**
	 * Returns a date to use. If no date arguments have been passed, this will
	 * return the current date. If a `date-start` argument is provided, a random date will be chosen
	 * between `date-start` and the current date. You can pass an `end-date` and a random date between start
	 * and end will be chosen.
	 *
	 * @param array $assoc_args   CLI arguments.
	 * @param bool  $include_time Include timestamp, default false.
	 * @return string Date string (Y-m-d)
	 */
	protected static function get_date( $assoc_args, $include_time = false ) {
		$current = date( 'Y-m-d', time() );
		if ( ! empty( $assoc_args['date-start'] ) && empty( $assoc_args['date-end'] ) ) {
			$start = $assoc_args['date-start'];
			$end   = $current;
		} elseif ( ! empty( $assoc_args['date-start'] ) && ! empty( $assoc_args['date-end'] ) ) {
			$start = $assoc_args['date-start'];
			$end   = $assoc_args['date-end'];
		} else {
			return $current;
		}

		$dates = array();
		$date  = strtotime( $start );
		while ( $date <= strtotime( $end ) ) {
			$dates[] = date( 'Y-m-d', $date );
			$date    = strtotime( '+1 day', $date );
		}

		$date = $dates[ array_rand( $dates ) ];

		if ( $include_time ) {
			return $date . ' ' . wp_rand( 0, 23 ) . ':00:00';
		}

		return $date;
	}

}
