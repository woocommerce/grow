/**
 * External dependencies
 */
import shell from 'shelljs';
import path from 'path';

process.env.PATH += ( path.delimiter + path.join( process.cwd(), 'node_modules', '.bin') );

export { shell };
