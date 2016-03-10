var arr = [];
var tm = null;
var i = 0;        //将要播放的帧数
var fps = 62;   //一帧的播放速度
var current = null;
var previous = null;
var mtk = $("#mtk");
var cacheFlag = false;
var startFlag = false;


function addInfo($obj,txt){
	$obj.append("<li>" + txt + "</li>");
	if($obj.children().length > 5){
		$obj.children().first().remove();
	}
}

//页面加载完就获取资源
$(function(){
	var xhr = new XMLHttpRequest();
	// var baTxtStr = null;
	xhr.i = 0;//绑定index标识
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if((xhr.status>=200&&xhr.status<300)||xhr.status == 304){
				
				//将获取到的内容通过“,”切割成字符串
				arr = arr.concat(xhr.responseText.split(","));
				mtk.children()[0].innerHTML += "<br>资源加载完成"+xhr.i+"0%";
				addInfo($("#info > ul"),"资源加载完成"+xhr.i+"0%");
				mtk.children("button").animate({"opacity":"1"},1000);
				
				if(xhr.i == 10){
					mtk.children()[0].innerHTML += "<br>资源全部加载成功";
					addInfo($("#info > ul"),"资源全部加载成功");
					cacheFlag = true;
					//显示开始按钮
					//将获取到的内容
					
					//播放时间为220秒 用时间/长度得出一帧播放的时间
					// fps = 220*1000/arr.length;

					//释放内存
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
				xhr.open("get","badapple?num="+xhr.i,true);
				xhr.i++;
				xhr.send(null);
			}else{
				mtk.children()[0].innerHTML += "<br>资源加载失败,失败码为:"+xhr.status;
				addInfo($("#info > ul"),"资源加载失败,失败码为:"+xhr.status);
			}
		}
	}
	mtk.children()[0].innerHTML += "<br>资源加载中....";
	mtk.children()[0].innerHTML += "<br>由于带有视频，缓存时间略长，请安心等待";
	mtk.children()[0].innerHTML += "<br>缓存10%即可观看";
	addInfo($("#info > ul"),"资源加载中....");
	addInfo($("#info > ul"),"由于带有视频，缓存时间略长，请安心等待");
	addInfo($("#info > ul"),"缓存10%即可观看");
	//发送url到后台获取数据，由于数据量大，所以进行分10段去获取
	//通过num标识要获取第几段数据
	xhr.open("get","badapple?num="+xhr.i,true);
	xhr.i++;
	xhr.send(null);
	

	$("#btn").click(function(){
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
	});

});

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
	}else if(!cacheFlag){
		addInfo($("#info > ul"),"缓冲中。。。");
		startFlag = true;
		$("video")[0].pause();
	}else{
		setTimeout(function(){
			mtk.children()[0].innerHTML += "<br>播放完成";
			addInfo($("#info > ul"),"播放完成");
			mtk.animate({"top":0});
		},1000)
	}

	i++;

}