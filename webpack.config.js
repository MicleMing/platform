/**
 * @file webpack config
 * @author lanmingming@baidu.com
 * @date 2015-12-22
 */

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var vue = require('vue-loader');
var imports = require('imports-loader');
var exports = require('exports-loader');

// OSX & Linux => '/', Windows => '\\'
var abs = function (p) {
    return path.join(__dirname, p);
};

// path for source
var srcPath = abs('src');

// path for output
var outputPath = abs('build');

module.exports = {

    devtool: 'cheap-module-eval-source-map',

    context: srcPath,

    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(srcPath, 'app.js')
    ],

    output: {
        path: outputPath,
        filename: 'index.js'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader?name=image/[name][hash:6].[ext]'
            },
            {   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?name=fonts/[name].[ext]&limit=10000&minetype=application/font-woff"
            },
            {   test: /fontawesome\-webfont\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            }

        ],

        noParse: [
           // /[\/\\]node_modules[\/\\]vue[\/\\]/
        ]
    },
    externals: {
       // "vue": "vue"
    },
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract("css"),
            less: ExtractTextPlugin.extract("css!less")
        }
    },

    resolve: {
        root: srcPath,

        alias: {
        }
    },

    plugins: [
        // compress js
/*        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),*/
        // package css seperately
        new ExtractTextPlugin('index.css'),

        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // extract common code
/*        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js'
        })*/
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })

    ]

};
