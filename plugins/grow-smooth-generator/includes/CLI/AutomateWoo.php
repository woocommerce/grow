<?php
namespace WC\Grow\SmoothGenerator\CLI;

use WP_CLI, WP_CLI_Command;
use WC\SmoothGenerator\Generator\Order;
use WC\Grow\SmoothGenerator\Generator\AutomateWoo\Conversion;
use WC\Grow\SmoothGenerator\Generator\AutomateWoo\EmailTracking;

/**
 * WP-CLI Integration class
 */
class AutomateWoo extends WP_CLI_Command {

	/**
	 * Generate conversions.
	 *
	 * @param array $args Arguments specified.
	 * @param array $assoc_args Associative arguments specified.
	 */
	public static function conversions( $args, $assoc_args ) {
		list( $amount ) = $args;
		$amount         = absint( $amount );

		$time_start = microtime( true );

		WP_CLI::line( 'Initializing...' );

		$progress = \WP_CLI\Utils\make_progress_bar( 'Generating conversions', $amount );

		Order::disable_emails();
		for ( $i = 1; $i <= $amount; $i++ ) {
			Conversion::generate( true, $assoc_args );
			$progress->tick();
		}

		$time_end       = microtime( true );
		$execution_time = round( ( $time_end - $time_start ), 2 );
		$display_time   = $execution_time < 60 ? $execution_time . ' seconds' : human_time_diff( $time_start, $time_end );

		$progress->finish();

		WP_CLI::success( $amount . ' conversions generated in ' . $display_time );
	}

	/**
	 * Generate email tracking.
	 *
	 * @param array $args Arguments specified.
	 * @param array $assoc_args Associative arguments specified.
	 */
	public static function email_tracking( $args, $assoc_args ) {
		list( $amount ) = $args;
		$amount         = absint( $amount );

		$time_start = microtime( true );

		WP_CLI::line( 'Initializing...' );

		$progress = \WP_CLI\Utils\make_progress_bar( 'Generating email and SMS tracking', $amount );

		for ( $i = 1; $i <= $amount; $i++ ) {
			EmailTracking::generate( true, $assoc_args );
			$progress->tick();
		}

		$time_end       = microtime( true );
		$execution_time = round( ( $time_end - $time_start ), 2 );
		$display_time   = $execution_time < 60 ? $execution_time . ' seconds' : human_time_diff( $time_start, $time_end );

		$progress->finish();

		WP_CLI::success( $amount . ' email and SMS tracking generated in ' . $display_time );
	}

	/**
	 * Add all CLI commands.
	 */
	public static function add_commands() {
		WP_CLI::add_command(
			'wc generate aw-conversions',
			[ __CLASS__, 'conversions' ],
			[
				'shortdesc' => 'Generate AutomateWoo conversions.',
				'synopsis'  => [
					[
						'name'        => 'amount',
						'type'        => 'positional',
						'description' => 'The number of conversions to generate.',
						'optional'    => true,
						'default'     => 10,
					],
					[
						'name'        => 'workflow',
						'type'        => 'assoc',
						'description' => 'Specify an existing workflow which tracks conversions.',
					],
					[
						'name'        => 'date-start',
						'type'        => 'assoc',
						'description' => 'Randomize the conversion date using this as the lower limit. Format as YYYY-MM-DD.',
						'optional'    => true,
					],
					[
						'name'        => 'date-end',
						'type'        => 'assoc',
						'description' => 'Randomize the conversion date using this as the upper limit. Only works in conjunction with date-start. Format as YYYY-MM-DD.',
						'optional'    => true,
					],
				],
				'longdesc'  => "## EXAMPLES\n\nwc generate aw-conversions 10 --workflow=123\n\nwc generate aw-conversions 50 --workflow=123 --date-start=2020-01-01 --date-end=2022-12-31",
			]
		);

		WP_CLI::add_command(
			'wc generate aw-email-tracking',
			[ __CLASS__, 'email_tracking' ],
			[
				'shortdesc' => 'Generate AutomateWoo email and SMS tracking.',
				'synopsis'  => [
					[
						'name'        => 'amount',
						'type'        => 'positional',
						'description' => 'The number of tracking logs to generate.',
						'optional'    => true,
						'default'     => 10,
					],
					[
						'name'        => 'workflow',
						'type'        => 'assoc',
						'description' => 'Specify an existing workflow which tracks conversions.',
					],
					[
						'name'        => 'date-start',
						'type'        => 'assoc',
						'description' => 'Randomize the tracking date using this as the lower limit. Format as YYYY-MM-DD.',
						'optional'    => true,
					],
					[
						'name'        => 'date-end',
						'type'        => 'assoc',
						'description' => 'Randomize the tracking date using this as the upper limit. Only works in conjunction with date-start. Format as YYYY-MM-DD.',
						'optional'    => true,
					],
				],
				'longdesc'  => "## EXAMPLES\n\nwc generate aw-email-tracking 10 --workflow=123\n\nwc generate aw-email-tracking 50 --workflow=123 --date-start=2020-01-01 --date-end=2022-12-31",
			]
		);
	}

}
