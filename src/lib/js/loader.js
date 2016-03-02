/**
 * @file 加载文件
 * @athor lanmingming@baidu.com
 * @date 2016-1-7
 */

define(function (require, exports, module) {
    var moduleCache = {};

    var getPathUrl = function (modName) {
        var url = modName;
        url =  (/\.js$/.test(url)) ? url : (url + '.js');
        return url;
    };

    // 加载模块
    var loadMod = function (modName, callback) {
        var url = getPathUrl(modName);
        var docHeader;
        var mod;

        if (moduleCache[modName]) {
            mod = moduleCache[modName];
            if (mod.status === 'loaded') {
                // has ben loaded
                setTimeout(callback(), 0);
            }
            if (mod.status === 'loading') {
                mod.onload.push(callback);
            }
        }
        else {
            // 未被加载
            // 1.放到加载对象中
            mod = moduleCache[modName] = {
                modName: modName,
                status: 'loading',
                onload: [callback]
            };

            // 2.创建script 插入到页面中
            var oScript = document.createElement('script');
            oScript.id = modName;
            oScript.type = 'text/javascript';
            oScript.charset = 'utf-8';
            oScript.async = true;
            oScript.src = url;

            docHeader = document.getElementsByTagName('head')[0];
            docHeader.appendChild(oScript);

            oScript.onload = function () {
                moduleCache[oScript.id].status = 'loaded';
                var fn = null;
                while (fn = moduleCache[oScript.id].onload.shift()) {
                    fn();
                }
            };
        }
    };
    var require = function (deps, callback) {
        var params = [];
        var depCount = 0;
        var i;
        var len;
        var isEmpty = false;

        deps = typeof deps === 'object' ? deps : [deps];

        if (deps.length) {
            for (i = 0, len = deps.length; i <= len - 1; i++) {
                (function (i) {
                    depCount++;

                    // 加载模块
                    loadMod(deps[i], function () {
                        depCount--;
                        if (depCount === 0) {
                            callback.apply(null, []);
                        }
                    });
                })(i);
            }
        }
        else {
            isEmpty = true;
        }

        if (isEmpty) {
            setTimeout(function () {
                callback.call(null, params);
            }, 0);
        }
    };

    module.exports = {
        require: require
    }
});