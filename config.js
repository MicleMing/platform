/**
 * @file config
 */

var path = require('path');

module.exports = {
	port: 3400,
	proxy: 'http://localhost:4000',
	static: path.join(__dirname, 'build')
};