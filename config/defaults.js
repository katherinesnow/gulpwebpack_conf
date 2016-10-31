var path =require('path');
var chunks=[];
var filePath = {
	srcPath: path.join(__dirname,'../src'),//__dirname  当前路径 src样式文件源码根目录
	tplPath: path.join(__dirname,'../src'),//页面文件源码根目录
	build:path.join(__dirname,'../bulid'),//编译目录
	devbuild:path.join(__dirname,"../devbuild"),//开发编译目录
	package:path.join(__dirname,'../package'),//包目录
	publicPath:'/'
};

var pages =[{
	name:"Entry/index",
	entry:'Entry/index.jsx',
	ftl: 'wxPages/Entry/index.html'
},{
	name:"FillInfo/index",
	entry:'FillInfo/index.jsx',
	ftl: 'wxPages/FillInfo/index.html'
}];

var pagesToPath=function (){
	var _p=[];
	pages.forEach(function(_page) {
        var _obj = {
            name: _page.name,//'FillInfo/index'
            entry: 'page/' + _page.entry,// "page/FillInfo/index.jsx"
            ftl: _page.ftl,// 'wxPages/FillInfo/index.html'
            templates: path.join(filePath.tplPath, _page.ftl)// ../src/wxPages/FillInfo/index.html 
        };
        _p.push(_obj);
        chunks.push(_page.name);//所有页面的组合名称
    });
    return _p;//返回所有的页面组合信息
};

module.exports = {
    filePath: filePath,
    pages: pages,
    pagesToPath: pagesToPath,
    port: 8090,
    chunks: chunks
};
//这里module.exports 用于返回一些{全局共享}的常量或者变量 