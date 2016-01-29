var url = require('url');

function router(handle,requrl,res){

	var pathname = url.parse(requrl).pathname;
	// var params = url.parse(requrl, true).query;

	if(pathname == "/favicon.ico"){
		return;
	}
	console.log("你要去的是不是这里："+pathname);
	if(typeof handle[pathname] == "function"){
		handle[pathname](res);
	}else{
		console.log("没有找到'"+pathname+"'这个路径处理的方法");
		res.writeHead(404, {'Content-Type': 'text/plain'});
	    res.end('404 Not Found\n');
	}
}
exports.router = router;