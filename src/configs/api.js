/**
 * @file api
 */

var targets = {
	test: 'http://demo',
	relative: './'
};

var address = targets.test;

var api = {

    /**
     * @desc demo
     */
    demo: address + 'demo.json'
};

module.exports = api;
