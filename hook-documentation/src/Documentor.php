<?php

declare( strict_types=1 );

namespace Automattic\WooCommerce\Grow\GitHubActions\HookDocumentation;

use RuntimeException;
use Symfony\Component\Finder\Finder;

/**
 * Class Documentor
 *
 * @since x.x.x
 */
class Documentor {

	/** @var array */
	protected array $args;

	/**
	 * Constructor.
	 *
	 * @param array $args {
	 *     Array of arguments. All arguments are required.
	 *
	 *     @type string $github_blob GitHub blob to reference for linking (e.g. a commit or a branch).
	 *     @type string $base_url    Base URL to use for generating links.
	 *     @type array  $source_dirs Directories to scan for hooks.
	 *     @type string $workspace   Workspace directory where the code is checked out.
	 * }
	 * @throws RuntimeException If any of the required arguments are missing.
	 */
	public function __construct( array $args = [] ) {
		$defaults = [
			'github_blob' => '',
			'base_url'    => '',
			'source_dirs' => [],
			'workspace'   => '',
		];

		// Validate args.
		$args = array_filter( array_merge( $defaults, $args ) );
		$this->validate_args( $defaults, $args );

		// Store args.
		$this->args = $args;
	}

	/**
	 * Get files to scan.
	 *
	 * @return array
	 */
	protected function get_files_to_scan(): array {
		$files  = [];
		$finder = $this->get_finder();

		foreach ( $this->args['source_dirs'] as $section ) {
			$section_name           = basename( $section );
			$files[ $section_name ] = [];
			$section_finder         = clone $finder;
			$section_finder->path( $section );

			foreach ( $section_finder as $file ) {
				$files[ $section_name ][] = $file->getRealPath();
			}
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
		$scanned       = [];
		$results       = [];
		$hook_continue = [
			'.' => 1,
			'{' => 1,
			'}' => 1,
			'"' => 1,
			"'" => 1,
			' ' => 1,
			')' => 1,
			'(' => 1,
		];
		$hooks_break   = [
			',' => 1,
			';' => 1,
		];

		foreach ( $files_to_scan as $heading => $files ) {
			$hooks_found = [];

			foreach ( $files as $f ) {
				if ( array_key_exists( $f, $scanned ) ) {
					continue;
				}

				// It's a local file.
				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				$tokens           = token_get_all( file_get_contents( $f ) );
				$token_type       = false;
				$current_file     = $f;
				$current_class    = '';
				$current_function = '';

				$scanned[ $current_file ] = 1;

				foreach ( $tokens as $index => $token ) {
					if ( ! is_array( $token ) ) {
						continue;
					}

					$trimmed_token_1 = trim( $token[1] );
					if ( T_CLASS === $token[0] ) {
						$token_type = 'class';
					} elseif ( T_FUNCTION === $token[0] ) {
						$token_type = 'function';
					} elseif ( 'do_action' === $token[1] || 'do_action_ref_array' === $token[1] ) {
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
								$hook = $this->normalize_hook( $token[1], $current_function, $current_class );

								// Keep adding to hook until we find a comma or colon.
								$loop = 0;
								do {
									++$loop;
									$prev_hook = is_string( $tokens[ $index + $loop - 1 ] )
										? $tokens[ $index + $loop - 1 ] : $tokens[ $index + $loop - 1 ][1];
									$next_hook = is_string( $tokens[ $index + $loop ] ) ? $tokens[ $index + $loop ]
										: $tokens[ $index + $loop ][1];

									if ( array_key_exists( $next_hook, $hook_continue ) ) {
										continue;
									}

									if ( array_key_exists( $next_hook, $hooks_break ) ) {
										break;
									}

									$hook_first = substr( $next_hook, 0, 1 );
									$hook_last  = substr( $next_hook, -1, 1 );

									if (
										'{' === $hook_first ||
										'}' === $hook_last ||
										'$' === $hook_first ||
										')' === $hook_last ||
										'>' === substr( $prev_hook, -1, 1 )
									) {
										$next_hook = strtoupper( $next_hook );
									}

									$next_hook = $this->remove_special_chars( $next_hook );

									$hook .= $next_hook;
								} while ( true );

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
	 *
	 * @return string
	 */
	protected function get_file_url( array $file ): string {
		$replacements = [
			"{$this->args['workspace']}" => $this->get_github_url_permalink(),
			'.php'                       => ".php#L{$file['line']}",
		];

		return str_replace(
			array_keys( $replacements ),
			array_values( $replacements ),
			$file['path']
		);
	}

	/**
	 * Get the base permalink URL for GitHub.
	 *
	 * @return string
	 */
	protected function get_github_url_permalink(): string {
		return "{$this->args['base_url']}/blob/{$this->args['github_blob']}";
	}

	/**
	 * Get file link.
	 *
	 * The link will be returned in Markdown format.
	 *
	 * @param array $file File data.
	 *
	 * @return string
	 */
	protected function get_file_link( array $file ): string {
		return sprintf(
			'[%2$s](%1$s)',
			$this->get_file_url( $file ),
			basename( $file['path'] ) . "#L{$file['line']}"
		);
	}

	/**
	 * Get delimited list output.
	 *
	 * @param array $hook_list List of hooks.
	 */
	protected function get_delimited_list_output( array $hook_list ): string {
		$output  = "# Hooks Reference\n\n";
		$output .= "A list of hooks, e.g. \`actions\` and \`filters\`, that are defined or used in this project.\n\n";

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
	 *
	 * @throws RuntimeException When no hooks are found.
	 */
	public function generate_hooks_docs(): string {
		$hook_list = $this->get_hooks( $this->get_files_to_scan() );
		if ( empty( $hook_list ) ) {
			throw new RuntimeException( 'No hooks found!' );
		}

		return $this->get_delimited_list_output( $hook_list );
	}

	/**
	 * Get base finder instance.
	 *
	 * @return Finder
	 */
	protected function get_finder(): Finder {
		return ( new Finder() )
			->files()
			->name( '*.php' )
			->in( $this->args['workspace'] );
	}

	/**
	 * Validate the args
	 *
	 * @param array $defaults
	 * @param array $args
	 *
	 * @return void
	 *
	 * @throws RuntimeException When any arguments are missing.
	 */
	protected function validate_args( array $defaults, array $args ): void {
		$arg_count     = count( $args );
		$default_count = count( $defaults );
		if ( $arg_count < $default_count ) {
			$diff     = $default_count - $arg_count;
			$singular = $diff === 1;
			throw new RuntimeException(
				sprintf(
					'Missing %s argument%s: %s',
					$singular ? 'an' : 'some',
					$singular ? '' : 's',
					join( ',', array_keys( array_diff_key( $defaults, $args ) ) )
				)
			);
		}
	}

	/**
	 * Normalize the hook.
	 *
	 * @param string $hook
	 * @param string $current_function
	 * @param string $current_class
	 *
	 * @return string
	 */
	protected function normalize_hook( string $hook, string $current_function, string $current_class ): string {
		$hook = trim( $hook, "'" );

		$replacements = [
			'__FUNCTION__' => $current_function,
			'__CLASS__'    => $current_class,
			'$this'        => $current_class,
		];

		$hook = str_replace(
			array_keys( $replacements ),
			array_values( $replacements ),
			$hook
		);

		$hook = $this->remove_special_chars( $hook );

		return preg_replace( '#//phpcs:(.*)(\n)#', '', $hook );
	}

	/**
	 * @param string $hook
	 *
	 * @return string
	 */
	protected function remove_special_chars( string $hook ): string {
		$removals = [ '.', '{', '}', '"', "'", ' ', ')', '(' ];

		return str_replace( $removals, '', $hook );
	}
}
