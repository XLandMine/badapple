var url = require('url');
var mime = require("mime");
var fs = require("fs");
var path = require("path");

var cache = {};

function router(requrl,response){

	var pathname = url.parse(requrl).pathname;
	// var params = url.parse(requrl, true).query;
	console.log("你要去的是不是这里："+pathname);
	if(pathname == "/"){
		loadFile(response,cache,"./index.html");
	}else {
		pathname = "." + pathname;  //将绝对地址转化为相对地址
		loadFile(response,cache,pathname);
	}
	
}

//发送404
function sen404(response){ 
	response.writeHead(404,{"Content-Type":"text/plain"});
	response.write("404 not found");
	response.end();
}

//发送请求的文件
function sendFile(response,filePath,fileContents){ 
	response.writeHead(200,{"Content-Type":mime.lookup(path.basename(filePath))});
	response.end(fileContents);
	console.log("send file form " + filePath);
}

//发送请求的内容
function loadFile(response,cache,absPath){
	//判断文件是否在缓存中，存在则直接发送，不存在则读取文件发送
	if(cache[absPath]){
		sendFile(response,absPath,cache[absPath]);
	}else{
		console.log(absPath);
		fs.exists(absPath,function(exists){
			if(exists){
				fs.readFile(absPath,function(err,data){
					if(err){
						sen404(response);
					}else{
						cache[absPath] = data;
						sendFile(response,absPath,data);
					}
				})
			}else{
				sen404(response);
			}
		})
	}
}

exports.router = router;