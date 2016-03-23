/**
 * @file server
 * @author lanmingming@baidu.com
 * @date 2016-1-24
 */
var webpack = require('webpack');
// var webpackDevMiddleware = require('koa-webpack-dev-middleware');
// var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config');
var serverConfig = require('./config.js');

var fs = require('fs');
var path = require('path');
var koa = require('koa');
var proxy = require('koa-proxy');
var koaStatic = require('koa-static');
var app = koa();

var port = serverConfig.port;

var compiler = webpack(webpackConfig);

app.use(koaStatic(serverConfig.static, {}));

/*app.use(webpackDevMiddleware(compiler, {
	noInfo: true
}));

app.use(function *(next) {
    yield webpackHotMiddleware(compiler).bind(null, this.req, this.res);
    yield next;
});*/

app.use(proxy({
	host: serverConfig.proxy
}));

app.use(function *(next) {
	var url = this.url;
	if (url === '/') {
		var file = path.join(__dirname, 'src', 'index.html');
		var stat = fs.statSync(file);
		this.response.status = 200;
		this.response.length = stat.size;
		this.response.type = path.extname(file);
		this.response.body = fs.createReadStream(file)
	}
	yield next;
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
})
