/**
 * [gulp description]
 * gulp只有五个方法:task run watch src dest 
 */
//引入gulp，项目文件中安装的gulp的引入方式
var gulp =require('gulp');
var path = require("path");
var webpack = require("webpack");
var gulpWebpack =require('gulp-webpack');
var gulpZip= require("gulp-zip");
var del = require("del");
var open =require("open");



var webpackDevServer = require("webpack-dev-server"),
	defaultSettings = require('./config/defaults.js'),
	webpackDevConfig = require('./config/webpack.config.js'),//开发环境webpack配置信息
	webpackDistConfig = require('./config/webpack.dist.config.js'),
	packageConfig = require('./config/package.js');

 filePath = defaultSettings.filePath;

//引入组件
var jshint = require("gulp-jshint");
var gutil = require("gulp-util");
var sass= require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");



gulp.task('dev', function() {
    var compiler = webpack(webpackDevConfig);
    new webpackDevServer(compiler, {
        contentBase: './',
        historyApiFallback: true,
        hot: true,
        noInfo: false,
        publicPath: filePath.publicPath
    }).listen(defaultSettings.port, function(err) {
        console.log('listening: http://localhost:' + defaultSettings.port);
        console.log('Opening your system browser...');
        console.log(defaultSettings.filePath.tplPath);
        open('http://localhost:' + defaultSettings.port + '/webpack-dev-server/');//可以是localhost或者是127.0.0.1
    });
});

//你也许会想要在编译文件之前删除一些文件
gulp.task('clean', function(cb) {
    return del(['build/**/*'], cb);
});

gulp.task("build",['clean'],function () {
	return gulp.src(filePath.srcPath)
		.pipe(gulpWebpack(webpackDistConfig))
		.pipe(gulp.dest('build/'));
});
/*
gulp.task('package', function() {
    return gulp.src(filePath.srcPath)
        .pipe(gulpWebpack(packageConfig))
        .pipe(gulp.dest('package/'));
});
*/

//gulp.task('zip',function() {
//	return gulp.src('./package/**/*')
//		.pipe(gulpZip('test.zip'))
//		.pipe(gulp.dest('./'))
//});




//检查脚本
gulp.task('lint',function () {
	gulp.src('./src/javascript/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//编译sass
//sass 任务会编译scss/目录下的scss文件，并把编译完成的css文件保存到build/css目录中
//可以设置scss 编译输出后的不同风格
gulp.task('sass',function () {
	gulp.src("./src/scss/**/*.scss")
		.pipe(sass({
			outputStyle: 'compact'
		})).pipe(gulp.dest("./build/css"));
});

//合并，压缩文件
//scipts 任务会合并js 目录下的所有js文件并输出到dist目录中，然后gulp会重命名。压缩合并的文件，也输出到dist/目录
gulp.task('scripts',function () {
	gulp.src('./src/javascript/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./build'))
		.pipe(rename("all.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("./build"))
});

//这时，我们创建了一个基于其他任务的default任务。
//使用.run()方法关联和运行我们上面定义的任务，使用.watch() 方法去监听制定目录的文件变化,当有文件变化时，会运行回调定义的其他任务。

//gulp.task('default',function(){
//	//将你的默认的任务代码放在这里
//	gulp.run('lint','sass','scripts');
//	//监听文件变化
//	//监听的文件是必填参数，可以是个数组
//	gulp.watch(["./src/javascript/**/*.js","./src/scss/**/*.scss"],function () {
		//当监听文件变化时，会运行回调定义的其他任务
//		gulp.run('lint','sass','scripts');
//	});
//});


gulp.task('default', ['dev'],function(){
	//这里需要gulp处理过程
	
});
