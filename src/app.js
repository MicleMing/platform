/**
 * @file entry
 */

define(function (require, exports, module) {

    var Vue = require('vue');
    var $ = require('jquery');
    require('./filter/main');
    require('./dirctive/main');

    // 全局jquery
    if (window.jQuery === undefined) {
        window.jQuery = $;
    }

    // Vue.config.debug = false;
    // process.env.NODE_ENV = 'production';

    var router = require('./configs/router');

    var app = Vue.extend(require('./pages/index.vue'));


    router.start(app, '#platform');

 });
