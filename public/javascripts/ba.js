(function (){
	var arr = [];
	var tm = null;
	var i = 0;       	//将要播放的帧数
	var fps = 62;  		//一帧的播放速度
	var cacheIndex = 0; //定义资源标识符
	var current = null;
	var previous = null;
	var mtk = $("#mtk");
	var cacheFlag = false;
	var startFlag = false;

	//开始播放字符串
	function start(){
		if(i < arr.length){
			current = new Date();

			//定义一个dt来记录一帧实际播放时间
			var dt = current - previous;
			console.log(dt);
			previous = current;

			$("#txt").val(arr[i]);

			//fps为理想帧率  fps-dt得出与实际帧率的差值
			var time = fps;
			//如果dt比fps大说明需要加快下一帧的速度以达到平衡
			//如果dt比fps小说明这次是上一次加快的，不需要处理
			if(dt > fps){
				/*
					理想数据为dt == fps == 62
					但是就算增加差值还是难以达到效果 
					dt总是大于62  使得视频播放时间大于220秒导致不同步
					测试所得dt 大约在62 - 65 之间
					所以为了尽量使dt  == fps
					所以对下一帧播放时间time再次-2
				*/
				time = fps + (fps - dt) - 2;
			}
			// console.log("dt----"+dt);
			tm = setTimeout("start()",time);
		}else if(cacheIndex < 9){
			//资源标识符小于9说明资源还未全部获取完毕
			addInfo($("#info > ul"),"缓冲中。。。");
			startFlag = true;
			$("video")[0].pause();
		}else{
			addInfo($("#info > ul"),"播放完成");
			//三秒后拉上mtk
			setTimeout(function(){
				mtk.animate({"top":0});
			},3000)
		}

		i++;

	}
	function ajaxGetBa(data){
		//将获取到的内容通过“,”切割成字符串并合并到arr中
		arr = arr.concat(data.split(","));
		
		addInfo($("#info > ul"),"资源加载完成"+(cacheIndex+1)+"0%");
		mtk.children("button").animate({"opacity":"1"},1000);

		//当资源标识符为9时表明资源全部获取完毕，停止资源获取
		if(cacheIndex == 9){
			addInfo($("#info > ul"),"资源全部加载成功");
			return;
		}
		//判断此时播放是否因为缓存而暂停
		if(startFlag){
			current = new Date();
			previous = new Date();
			//继续播放视频和字符串
			$("video")[0].play();
			start();
			startFlag = false;
		}
		// 自增资源标识符
		cacheIndex++;
		// 再次获取数据
		$.get("badapple",{num:cacheIndex},ajaxGetBa);
	}
	function addInfo($obj,txt){
		mtk.children()[0].innerHTML += "<br>" + txt;
		$obj.append("<li>" + txt + "</li>");
		if($obj.children().length > 5){
			$obj.children().first().remove();
		}
	}
	var btnClickHolder = function(){
		var clientHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight|| 2000;
		mtk.animate({
			"top":-clientHeight
		})
		//初始化参数
		i = 0;
		current = new Date();
	    previous = new Date();
	    //播放字符动画
		start();
		//显示播放器并播放mp4文件
		$("video").css("opacity","1");
		$("video")[0].play();
	}

	window.start = start;
	window.ajaxGetBa = ajaxGetBa;
	window.addInfo = addInfo;
	window.btnClickHolder = btnClickHolder;
	window.cacheIndex = cacheIndex;
})()







//页面加载完就获取资源
$(function(){

	addInfo($("#info > ul"),"资源加载中....");
	addInfo($("#info > ul"),"由于带有视频，缓存时间略长，请安心等待");
	addInfo($("#info > ul"),"缓存10%即可观看");
	//用ajax的get方法访问服务器获取数据
	//发送url到后台获取数据，由于数据量大，所以进行分10段去获取
	//通过num标识要获取第几段数据,cacheIndex为当前获取的资源标识符
	$.get("badapple",{num:cacheIndex},ajaxGetBa);
	
	$("#btn").click(btnClickHolder);
});

