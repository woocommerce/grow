<?php

declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation;

use Symfony\Component\Finder\Finder;

/**
 * Class Documentor
 *
 * @since x.x.x
 */
class Documentor {

	/** @var array */
	protected array $args;

	public function __construct( array $args = [] ) {
		$this->args = array_merge(
			[
				'github_path'  => '',
				'source_dirs' => [],
				'output_file'  => '',
			],
			$args
		);
	}

	/**
	 * Get files to scan.
	 *
	 * @return array
	 */
	protected function get_files_to_scan(): array {
		$files = [];

		$finder = new Finder();
		$finder->in($this->args['source_dirs']);
		$finder->files()->name('*.php');

		foreach ( $finder as $file ) {
			$files[] = $file->getRealPath();
		}

		return array_filter( $files );
	}

	/**
	 * Get hooks.
	 *
	 * @param array $files_to_scan Files to scan.
	 *
	 * @return array
	 */
	protected function get_hooks( array $files_to_scan ): array {
		$scanned = [];
		$results = [];

		foreach ( $files_to_scan as $heading => $files ) {
			$hooks_found = [];

			foreach ( $files as $f ) {
				if ( array_key_exists( $f, $scanned ) ) {
					continue;
				}

				$current_file     = $f;
				$tokens           = token_get_all( file_get_contents( $f ) );
				$token_type       = false;
				$current_class    = '';
				$current_function = '';

				$scanned[ $current_file ] = 1;

				foreach ( $tokens as $index => $token ) {
					if ( is_array( $token ) ) {
						$trimmed_token_1 = trim( $token[1] );
						if ( T_CLASS === $token[0] ) {
							$token_type = 'class';
						} elseif ( T_FUNCTION === $token[0] ) {
							$token_type = 'function';
						} elseif ( 'do_action' === $token[1] ) {
							$token_type = 'action';
						} elseif ( 'apply_filters' === $token[1] ) {
							$token_type = 'filter';
						} elseif ( $token_type && ! empty( $trimmed_token_1 ) ) {
							switch ( $token_type ) {
								case 'class':
									$current_class = $token[1];
									break;
								case 'function':
									$current_function = $token[1];
									break;
								case 'filter':
								case 'action':
									$hook = trim( $token[1], "'" );
									$hook = str_replace( '_FUNCTION_', strtoupper( $current_function ), $hook );
									$hook = str_replace( '_CLASS_', strtoupper( $current_class ), $hook );
									$hook = str_replace( '$this', strtoupper( $current_class ), $hook );
									$hook = str_replace( [ '.', '{', '}', '"', "'", ' ', ')', '(' ], '', $hook );
									$hook = preg_replace( '/\/\/phpcs:(.*)(\n)/', '', $hook );
									$loop = 0;

									// Keep adding to hook until we find a comma or colon.
									while ( 1 ) {
										$loop ++;
										$prev_hook = is_string( $tokens[ $index + $loop - 1 ] ) ? $tokens[ $index + $loop - 1 ] : $tokens[ $index + $loop - 1 ][1];
										$next_hook = is_string( $tokens[ $index + $loop ] ) ? $tokens[ $index + $loop ] : $tokens[ $index + $loop ][1];

										if ( in_array( $next_hook, [ '.', '{', '}', '"', "'", ' ', ')', '(' ], true ) ) {
											continue;
										}

										if ( in_array( $next_hook, [ ',', ';' ], true ) ) {
											break;
										}

										$hook_first = substr( $next_hook, 0, 1 );
										$hook_last  = substr( $next_hook, -1, 1 );

										if ( '{' === $hook_first || '}' === $hook_last || '$' === $hook_first || ')' === $hook_last || '>' === substr( $prev_hook, -1, 1 ) ) {
											$next_hook = strtoupper( $next_hook );
										}

										$next_hook = str_replace( [ '.', '{', '}', '"', "'", ' ', ')', '(' ], '', $next_hook );

										$hook .= $next_hook;
									}

									$hook = trim( $hook );

									if ( isset( $hooks_found[ $hook ] ) ) {
										$hooks_found[ $hook ]['files'][] = [
											'path' => $current_file,
											'line' => $token[2],
										];
									} else {
										$hooks_found[ $hook ] = [
											'files'    => [
												[
													'path' => $current_file,
													'line' => $token[2],
												],
											],
											'class'    => $current_class,
											'function' => $current_function,
											'type'     => $token_type,
										];
									}
									break;
							}
							$token_type = false;
						}
					}
				}
			}

			ksort( $hooks_found );

			if ( ! empty( $hooks_found ) ) {
				$results[ $heading ] = $hooks_found;
			}
		}

		return $results;
	}

	/**
	 * Get file URL.
	 *
	 * @param array $file File data.
	 * @return string
	 */
	protected function get_file_url( array $file ): string {
		return str_replace( '.php', '.php#L' . $file['line'], $file['path'] );
	}

	/**
	 * Get file link.
	 *
	 * @param array $file File data.
	 * @return string
	 */
	protected function get_file_link( array $file ): string {
		return sprintf(
			'<a href="%s">%s</a>',
			"{$this->args['github_path']}{$this->get_file_url( $file )}",
			basename( $file['path'] ) . "#L{$file['line']}"
		);
	}

	/**
	 * Get delimited list output.
	 *
	 * @param array $hook_list List of hooks.
	 * @param array $files_to_scan List of files to scan.
	 */
	protected function get_delimited_list_output( array $hook_list ): string {

		$output  = "# Hooks Reference\n\n";
		$output .= "A list of hooks, i.e `actions` and `filters`, that are defined or used in this project.\n\n";

		foreach ( $hook_list as $hooks ) {
			foreach ( $hooks as $hook => $details ) {
				$link_list = [];
				foreach ( $details['files'] as $file ) {
					$link_list[] = "- {$this->get_file_link( $file )}";
				}

				$links   = implode( "\n", $link_list );
				$output .= sprintf(
					"## %s\n\n**Type**: %s\n\n**Used in**:\n\n%s\n\n",
					$hook,
					$details['type'],
					$links
				);
			}
		}

		return $output;
	}

	/**
	 * Generate hooks documentation.
	 */
	public function generate_hooks_docs() {
		$hook_list = $this->get_hooks( $this->get_files_to_scan() );
		if ( empty( $hook_list ) ) {
			return;
		}

		// Add hooks reference content.
		$output = $this->get_delimited_list_output( $hook_list );

		file_put_contents( $this->args['output_file'], $output );
	}
}
