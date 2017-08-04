var http = require('http');
//var BufferHelper = require('bufferhelper');
var HOST = process.argv[2];
var PORT = process.argv[3];
var PROJ_PREFIX = '/' + (process.argv[4] || '');

console.log(HOST);
console.log(PORT);
console.log(PROJ_PREFIX);

// create http services, https protocol hasn't been supported now
var app = http.createServer(function(req, res) {
    // 查询本机ip
    var path = req.url;
    var result = /^[a-zA-Z]+:\/\/[^\/]+(\/.*)?$/.exec(req.url);
    if (result) {
        if (result[1].length > 0) {
            path = result[1];
        } else {
            path = "/";
        }
    }

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8091/");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By", ' 3.2.1');
    res.setHeader("Content-Type", "application/json;charset=utf-8");

    var chunks = [];
    var len = 0;

    console.log('=========================== Request starts:' + (new Date().getTime()) + '=====================================\n');
    console.log(req.headers);
    var param = {
        host: HOST || '172.16.1.51', // 目标主机sjyxtest.yiqiguang.com
        port: PORT || '8022', // 目标主机80
        path: PROJ_PREFIX + path, // 目标路径
        method: req.method, // 请求方式
        headers: req.headers
    };
    console.log('Request params:\n');
    console.log(param);

    var sreq = http.request(param, function(sres) {

        sres.on('data', function(chunk) {
            chunks.push(new Buffer(chunk));
            len += chunk.length;
        });

        sres.on('end', function() {
            var resData = Buffer.concat(chunks, len);
            console.log('=========================== Response receieves:' + (new Date().getTime()) + '=====================================\n');
            console.log(resData.toString());
            console.log('=====================================     end     ===============================================\n\n');
            res.write(resData);
            res.end();
        });
    });

    sreq.on('error', function(e) {
        console.log(e.message);
        sreq.end();
    });

    if (/POST|PUT/i.test(req.method)) {
        req.pipe(sreq);
    } else {
        sreq.end();
    }
});
// 访问127.0.0.1:3001查看效果
app.listen(3001);
console.log('server started on 127.0.0.1:3001');

usage();

function usage() {
    console.log('Usage:');
    console.log('node proxy.js [host] [port] [prefix]');
    console.log('\n\n');
}