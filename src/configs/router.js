/**
 * @file router
 */
var Vue = require('vue');
var VueRouter = require('vue-router');


Vue.use(VueRouter)


var router = new VueRouter();

router.map({});

router.redirect({

});

var start = function (instance, element) {
    router.start(instance, element);
};

module.exports = {
    start: start
};