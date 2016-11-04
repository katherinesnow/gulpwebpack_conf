var webpack= require('webpack');
var path = require('path');
var defaultSettings = require('./defaults');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//理解该插件的作用
var HtmlWebpackPlugin = require('html-webpack-plugin');//理解该插件的作用
var filePath = defaultSettings.filePath;//defaults 中路径配置的json key-value值
var precss = require("precss");//css的预处理功能
var autoprefixer = require('autoprefixer'); //自动补充css前缀功能


var webpackConfig={
	entry: {},//entry 入口函数表示出那些事需要单独打包成一个js包的
	output:{
		path:filePath.build,//生成的文件目录，绝对路径//于配置文件发布路径，如CDN或本地服务器
		filename:'[name].js',// //根据入口文件输出的对应多个文件名
		publicPath: filePath.publicPath
	},
	cache:true,
	devtool: 'inline-source-map',
	resolve: {
		//模块决议配置
	    extensions: ['', '.js', '.jsx'],
	    ////配置别名，在项目中可缩减引用路径
	    alias: {
	      'components': path.join(__dirname, '../src/javascript/components'),
	      'lib': path.join(__dirname, '../src/javascript/lib'),
	      'extend': path.join(__dirname, '../src/javascript/extend'),
	      'page': path.join(__dirname, '../src/javascript/page'),
	      'scss': path.join(__dirname, '../src/scss'),
	      //'pages': path.join(__dirname, '../src/wxPages'),
	      'images': path.join(__dirname, '../statics/images'),
	      'mock': path.join(__dirname, '../src/javascript/mock'),
	      'fonts': path.join(__dirname, '../statics/fonts'),
	      'jquery': path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js')
	    }
	},
	module:{
		//各种加载器，即让各种文件格式可用require引用
		//如果我们想要在js文件中通过require引入模块，比如css或image，那么就需要在这里配置加载器，这一点对于React来说相当方便，因为可以在组件中使用模块化CSS。而一般的项目中可以不用到这个加载器。
		//noParse: [
	    noParse: [
	      path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js')
	    ],
		loaders: [
		      {
		        test: /.jsx?$/,
		        loaders: ['react-hot', 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0&presets[]=stage-1', 'webpack-module-hot-accept'],
		        exclude: /node_modules/
		      },
		      {
		        test: /\.scss/,
		        loader: 'style!css!postcss!sass?outputStyle=compressed',
		      },
		      {
		        test: /\.css$/,
		        loader: 'style!css!postcss',
		      },
		      {
		        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
		        loader: 'url-loader?limit=1&name=res/[name].[hash:8].[ext]'
		      },
		      {
		        test: /\.json$/,
		        loader: 'json-loader'
		      },
		      {
		        test: /\.ftl$/,
		        loader: 'raw-loader'
		      }
    	]
	},/*
	postcss:function () {
		return [precss,autoprefixer]
	},*/
	plugins:[
		new webpack.HotModuleReplacementPlugin(),//Webpack 用来做模块热替换(hot module replacement)HRM
		new ExtractTextPlugin('[name].css'),
    	new webpack.NoErrorsPlugin(),
    	////提供全局的变量，在模块中使用无需用require引入
    	new webpack.ProvidePlugin({
	      $: "jquery",
	      jQuery: "jquery",
	      "window.jQuery": "jquery",
	      "Modernizr": "Modernizr"
	    })
	]
};

//入口注入
//那如果我们想要将打包好的js存放在指定的位置又要如何进行操作呢
function injectEntry() {
  defaultSettings.pagesToPath().forEach(function (item) {
    webpackConfig.entry[item.name] = [
      'webpack-dev-server/client?http://172.16.11.127:' + defaultSettings.port,//资源服务器地址
      'webpack/hot/only-dev-server',
      item.entry
    ];

  });

  //console.log('webpackConfig.entry', webpackConfig.entry);
  //['webpack-dev-server/client?http://localhost:8090','webpack/hot/only-dev-server','Page/FillInfo/index.jsx']
}

function injectHtmlWebpack() {
  defaultSettings.pagesToPath().forEach(function (item) {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: item.ftl,//'wxPages/FillInfo/index.html'  输出的html文件名,默认是idnex.Html ，也可以直接配置带有子目录
        template: item.templates,// 模板路径地址: "../src/wxPages/FillInfo/index.html " 模板文件路径，支持加载器
        chunks: [item.name],//允许只添加某些块FillInfo/index
        inject: true //注入所有的资源到特定的templage 中
      })
    );
  });
}
//html-webpack-plugin 可以帮助生成 HTML 文件

(function () {
  injectEntry();
  injectHtmlWebpack();
})();

module.exports = webpackConfig;
