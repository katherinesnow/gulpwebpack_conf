# gulpwebpack_conf
Nodejs下利用gulp +webpack + React 实现前端工程化 架构实践

develop分支的代码是最新的.

安装：

1. 将代码git 到本地，默认git 下来对应本地分支是master

2. 切换最新代码分支: git checkout develop

3. 切换到项目根目录, 运行 npm install 安装依赖包.

4. 在config 文件中配置了webpack 打包的基本配置文件，包含开发环境和上线环境. 

   开发环境:webpack.config.js  上线环境: webpack.dist.config.js
   
5. 进入到 项目根目录，运行命令:gulp 

   打开服务器 ：http://172.16.11.127:8091/webpack-dev-server
   
   你可以打开URL:http://172.16.11.127:8091/webpack-dev-server/wxPages/JoinGroup/index.html
   
   在本地直接运行该页面.
   
   
6. 也可以通过"gulp build" 命令，将所有的文件打包到目录build 中，将build中所有的文件部署到服务器即可.



gulp 相关配置说明地址: 

http://www.imooc.com/article/13843

webpack 相关 配置说明：

http://www.imooc.com/article/13872


初学者，如果有什么问题，还请多多纠正.
