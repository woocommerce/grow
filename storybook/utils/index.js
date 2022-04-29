const shell = require("shelljs");
const path = require("path")

process.env.PATH += ( path.delimiter + path.join( process.cwd(), 'node_modules', '.bin') );

module.exports = {
	shell
}
