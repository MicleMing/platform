/**
 * @file jquery ajax 通用封装，提供防重提交，提交loading提示功能
 * @author lanmingming
 * @date 2015-12-27
 */
define(function (require, exports, module) {

    var $ = require('jquery');

    var spinner = '<div class="anti-spinner-level-1 iAjax-loading"><div></div><div></div><div></div></div>';
    var bodySpinner = '<div class="anti-body-spinner iAjax-loading"><div></div><div></div><div></div></div>';
    var buttonSpinner = '<div class="anti-button-spinner iAjax-loading"><div></div><div></div><div></div></div>';

    // var spinner = '<div class="fa fa-spinner iAjax-loading"></div>';
    // var bodySpinner = '<div class="fa fa-spinner anti-spinner-body-ps iAjax-loading"></div>';
    // var buttonSpinner = '<div class="fa fa-spinner anti-spinner-btn-ps iAjax-loading"></div>';

    $.iAjaxHook = {
        'noLoad': {
            loading: function () {},
            removeLoading: function () {}
        },
        'div': {
            loading: function (selector) {
                selector.html(spinner1);
            },
            removeLoading: function (selector) {
                selector.find(".iAjax-loading").remove();
            }
        },
        'button': {
            loading: function (selector) {
                var load = $(buttonSpinner).appendTo(selector);
                selector.prop('disabled', true)
                    .addClass('disabled');
                return load;
            },
            removeLoading: function (selector, load) {
                selector.prop('disabled', false)
                    .removeClass('disabled');
                load.remove();
            }
        },
        'body': {
            loading: function (selector) {
                if (typeof selector === 'function') {
                    selector = $('body');
                }
                var load = $(bodySpinner).appendTo(selector);
                return load;
            },
            removeLoading: function (selector) {
                if (typeof selector === 'function') {
                    selector = $('body');
                }
                selector.find(".iAjax-loading").remove();
            }
        }
    }

    var nodo = function () {
    };

    var paramObj = function (obj) {
        var strArr = [];
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                strArr.push(key + '=' + obj[key]);
            }
        }
        return strArr.join('&');
    }

    var iAjax = function (options) {
            var load = null;
            var nodeName = nodeName = (this[0] && this[0].nodeName || '').toLocaleLowerCase();
            var loadType = this.attr('loadType') || nodeName || 'body';
            loadType = loadType === 'a' ? 'button' : loadType;

            var url = options.url;
            var type = options.type || 'POST';
            var data = options.data;

            // type == 'PUT' 时, 将数据放到url（适合反抓取平台
            if (type === 'PUT') {
                url = url + '?' + paramObj(data);
                data = {};
            }


            // 传输文件配置
            var processData = typeof options.processData === 'boolean' ? options.processData : true;
            var contentType = options.contentType !== undefined ? options.contentType : "application/x-www-form-urlencoded";

            var successCb = options.success || nodo;
            var errorCb = options.error || nodo;

            var defaultOps = {
                url: url,
                type: type,
                data: data,
                cache: false,
                context: this,
                processData: processData, // 默认情况下，通过data选项传递进来的数据，如果是一个对象(技术上讲只要不是字符串)，都会处理转化成一个查询字符串，以配合默认内容类型 "application/x-www-form-urlencoded"
                contentType: contentType,
                
                beforeSend: function (jqXHR, settings) {
                    if (this.prop('disabled')) {
                        return false;
                    } else {
                        load = $.iAjaxHook[loadType].loading(this);
                    }
                },
                success: function (data) {
                    $.iAjaxHook[loadType].removeLoading(this, load);
                    successCb(data);
                },
                error: function (err) {
                    $.iAjaxHook[loadType].removeLoading(this, load);
                    errorCb(err);
                }
            };
            return $.ajax(defaultOps);
        }

    // 挂载到jquery
    $.iAjax = iAjax;

    // 挂载到selector
    $.fn.extend({
        iAjax: iAjax
    });
});
