// var express = require('express');
// var router = express.Router();
var fs = require('fs');

var cache = {};
/* GET home page. */
function index(req, res) {
  res.render('index');
};

function badapple(req,res){
	//获得url参数列表的num值
	var num = req.query.num;
	//判断资源是否存在cache中
	if(cache[num]){
		//存在则直接发送
		sendFile(res,cache[num]);
	}else{
		//不存在则读取资源文件
		fs.readFile("public/badappleTxt.txt",function(err,data){
			if(err){

			}else{
				data = data.toString();
				for(var i = 0; i < 10; i++){
					//将数据拆分成10次保存在cache中
					cache[i] = data.substring(i/10*data.length,(i+1)/10*data.length);
				}
				sendFile(res,cache[num]);
			}
		})
	}
	
}
//发送请求的文件
function sendFile(res,fileContents){ 
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.end(fileContents);
}

exports.index = index;
exports.badapple = badapple;



