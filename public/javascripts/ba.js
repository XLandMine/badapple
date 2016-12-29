function BadApple () {
	this.content = [];
	this.timer = null;
	this.index = 0;   		//将要播放的帧数
	this.fps = 62;			//一帧的播放速度
	this.cacheIndex = 0;	//资源标识符
	this.startFlag = false;
}
var fn = BadApple.prototype;

fn.start = function () {
	//记录最后时间
	var lastTime = Date.now();
	//等待时间
	var waiteTime = 0;
	console.time("fps");
	this.timer = setInterval( function(){
		if(this.index < this.content.length){
			//记录当前时间
			var nowTime = Date.now();
			//将循环一次的时间保存进waiteTime里
			waiteTime += nowTime - lastTime;
			lastTime = nowTime;
			//如果等待时间大于一帧，则表明该播放一帧图片，否则继续等待
			if (waiteTime > this.fps - 2) {
				//将等待时间减少一帧的时间
				console.timeEnd("fps");
				console.time("fps");

				waiteTime -= this.fps;
				//将数组显示到txt控件上，并使i自增
				$("#txt").val(this.content[i++]);
			}
		}else if(this.cacheIndex < 9){
			//资源标识符小于9说明资源还未全部获取完毕
			this.addInfo($("#info > ul"),"缓冲中。。。");
			//设置播放flag为true  表示当前视频并未播放完毕，仅仅是暂停了
			this.startFlag = true;
			$("video")[0].pause();
			clearInterval(this.timer);
		}else{
			this.addInfo($("#info > ul"),"播放完成");
			//清除定时器
			clearInterval(this.timer);
			//三秒后拉上mtk
			setTimeout(function(){
				$("#mtk").animate({"top":0});
			},3000)
		}
	}.bind(this) ,16);
}

fn.getContent = function(data) {
	//将获取到的内容通过“,”切割成字符串并合并到this.content中
	this.content = this.content.concat(data.split(","));

	this.addInfo($("#info > ul"),"资源加载完成"+(this.cacheIndex+1)+"0%");
	$("#mtk").children("button").css("display","block").animate({"opacity":"1"},1000);

	//当资源标识符为9时表明资源全部获取完毕，停止资源获取
	if(this.cacheIndex == 9){
		this.addInfo($("#info > ul"),"资源全部加载成功");
		return;
	}
	//判断此时播放是否因为缓存而暂停
	if(this.startFlag){
		//继续播放视频和字符串
		$("video")[0].play();
		this.start();
		this.startFlag = false;
	}
	// 自增资源标识符
	this.cacheIndex++;
	// 再次获取数据
	$.get("badapple",{num:this.cacheIndex},function(data){
		this.getContent(data);
	}.bind(this));
}

fn.addInfo = function addInfo($obj,txt){
	$("#mtk").children()[0].innerHTML += "<br>" + txt;
	$obj.append("<li>" + txt + "</li>");
	if($obj.children().length > 5){
		$obj.children().first().remove();
	}
}


//页面加载完就获取资源
$(function(){

	var ba = new BadApple();
	ba.addInfo($("#info > ul"),"资源加载中....");
	ba.addInfo($("#info > ul"),"由于带有视频，缓存时间略长，请安心等待");
	ba.addInfo($("#info > ul"),"缓存10%即可观看");
	//用ajax的get方法访问服务器获取数据
	//发送url到后台获取数据，由于数据量大，所以进行分10段去获取
	//通过num标识要获取第几段数据,cacheIndex为当前获取的资源标识符
	$.get("badapple",{num:ba.cacheIndex},function(data){
		ba.getContent(data);
	});

	$("#btn").click(function(){
		var clientHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight|| 2000;
		$("#mtk").animate({
			"top":-clientHeight
		})
		//初始化参数
		i = 0;
	    //播放字符动画
		ba.start();
		//显示播放器并播放mp4文件
		$("video").css("opacity","1");
		$("video")[0].play();
	});
});

