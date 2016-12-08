$(function(){
	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext('2d');
	var audio=$('audio').get(0);
//	var hei=setInterval(miaoh,1000);
//	var bai=setInterval(miao,1000);
	var AI = false;
	var gameState = 'pause';
	var kongbai = {};
	var sep = 40;
	////////////////////////////////////////小圆半径
	var sR = 4;
	////////////////////////////////////////棋子半径
	var bR = 17;
	
	
	/////////////////////////////////////////定义圆
	function circle(x,y,r){
		ctx.save();
		ctx.beginPath();
		ctx.arc(lambada(x), lambada(y), r ,0, Math.PI *2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	
	///////////////////////////////////////位置转换
	function lambada(x){
		return (x + 0.5) * sep + 0.5;
	}
	
	/////////////////////////////////////////棋盘
	function drawQipan(){
		ctx.clearRect(0,0,canvas.width,canvas.width);
		ctx.save();
		ctx.beginPath();
		for(var i = 0;i < 15;i++){
			ctx.moveTo(20.5,20.5 + i *sep);
			ctx.lineTo(580.5,20.5 + i *sep);
			ctx.moveTo(20.5 + i *sep ,20.5);
			ctx.lineTo(20.5 + i *sep ,580.5);
		}
		ctx.strokeStyle = "#555";
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		
		circle(7, 7, sR);
		circle(3, 3, sR);
		circle(11, 3, sR);
		circle(3, 11, sR);
		circle(11, 11, sR);
		for (var i = 0;i < 15; i++){
			for(var j = 0; j < 15; j++){
				kongbai[lianjie(i, j)] = true;
			}
		}
	}
	
	drawQipan();
	
	
	
	
	

	

    
    
	
	var qizi = {  };
	/////////////////////////////////////////落子 棋子
	function luozi(x ,y , r ,color){
		ctx.save();
		ctx.translate(lambada(x),lambada(y));
		ctx.beginPath();
		ctx.arc(0, 0, r, 0, Math.PI *2);
		if (color === "black") {
			var g = ctx.createRadialGradient(-7, -7, 0, 0, 0, 20);
			g.addColorStop(0.1, '#ddd');
			g.addColorStop(0.2, '#999');
			g.addColorStop(1, '#000');
			audio.play();
			clearInterval(hei);
			clearInterval(mh);
//			miao();
		}else{
			var g = ctx.createRadialGradient(-7, -7, 0, 0, 0, 20);
			g.addColorStop(0.1, '#fff');
			g.addColorStop(0.2, '#eee');
			g.addColorStop(1, '#ddd');
			audio.play();
            clearInterval(bai);
            clearInterval(mb);
//          miaoh();
		}
		ctx.shadowOffsetX=2;
    	ctx.shadowOffsetY=2;
   		ctx.shadowBlur = 2;
		ctx.shadowColor = "rgba(0,0,0,0.5)";
		ctx.fillStyle = g;
		ctx.arc(0,0,r,0,Math.PI*2);
		
		
		ctx.fill();
		ctx.closePath();
		ctx.restore();
		
		qizi[lianjie(x, y)] = color;
		gameState = "play";
		delete kongbai[lianjie(x, y)];
//		qizi[x + '_' + y] = color;
//		qizi.push({x: x, y: y, color: color});
	}
//	luozi(7, 7, bR, "white")

	
	
	/////////////////////////////////////////判断棋盘上有没有棋子
//	function you(x,y){
//		var flag = false;
//		////////////////////////////////jquery 遍历
//		$.each(qizi, function(i,v) {
//			if( v.x === x && v.y === y) {
//				flag = true;
//			}
//		});
//		return flag;
//	}
	
	/////////////////////////////////////////人机大战   防守


	
	function intel() {
    	var max1 = -Infinity;
    	var max2 = -Infinity;
    	var pos1 = {};
    	var pos2 = {};
    	for(var k in kongbai){
    		var x = parseInt(k.split('_')[0]);
    		var y = parseInt(k.split('_')[1]);
    		var m1 = cal(x,y,"black")
    		var m2 = cal(x,y,"white")
    		if(m1>max1){
    			max1=m1;
    			pos1={x:x,y:y};
    		}
    		if(m2>max2){
    			max2=m2;
    			pos2={x:x,y:y};
    		}
    	}
    	if(max1>max2){
    		return pos1;
    	}else{
    		return pos2;
    		
    	}
    	
    	
    }
	
	
	
	/////////////////////////////////////////生成棋谱
	function chessManual(){
		ctx.save();
		ctx.font = '20px/1  微软雅黑';
		
		ctx.textAlign = "center";
		ctx.textBaseline = "middle"
		var i =1;
		for( var k in qizi){
			var arr = k.split('_');
			if(qizi[k] === 'white'){
				ctx.fillStyle = "black";
			}else{
				ctx.fillStyle = "white";
			}
			ctx.fillText(i++, lambada(parseInt(arr[0])), lambada(parseInt(arr[1])));
		}
		
		
		ctx.restore();
		$("#img").show().width(600).height(600);
		if($("#img").find("img").length){
			$('#img').find("img").attr('src',canvas.toDataURL());
		}else{
			$('<img>').attr('src',canvas.toDataURL() ).appendTo('#img');
		}
		//收集画布中所有的像素 转换成一张浏览器可用的图片
		if($("#img").find("a").length){
			$('#img').find("a").attr('href',canvas.toDataURL());
		}else{
			$("<a>").attr('href',canvas.toDataURL()).attr('download','qipu.png').appendTo('#img');
		}
		
	}
	
	
	
	
	var kaiguan = true;
	/////////////////////////////////////////落子 棋子点击效果
	function handleClick(e){
		var x = Math.floor(e.offsetX / sep);
		var y = Math.floor(e.offsetY / sep);
		
		if( qizi[x + '_' + y] ){
			return;
		}
		if(AI){
			luozi(x, y, bR, 'black');
			if( cal(x,y,"black") >=5 ){
//				alert("黑棋赢");
				$(canvas).off("click");
				$(".info").find(".blackwin").html("<img src='img/heisheng.png'/>").end().addClass('active');
			}
			var p=intel()
			luozi(p.x,p.y, bR, 'white');
			if( cal(p.x,p.y,"white") >=5 ){
//				alert("白棋赢");
				$(canvas).off("click");
				$(".info").find(".blackwin").html("<img src='img/baisheng.png'/>").end().addClass('active');
			}
			return;
		}
		if (kaiguan) {
			luozi(x, y, bR, 'black');
			if( cal(x,y,"black") >=5 ){
//				alert("黑棋赢");
				$(canvas).off("click");
				$(".info").find(".blackwin").html("<img src='img/heisheng.png'/>").end().addClass('active');
			}
		} else{
			luozi(x, y, bR, 'white');
			if( cal(x,y,"white") >=5 ){
//				alert("白棋赢");
				$(canvas).off("click");
				$(".info").find(".blackwin").html("<img src='img/baisheng.png'/>").end().addClass('active');
			}
		}
		kaiguan = !kaiguan;
	}
	
	
	$(canvas).on("click",handleClick);
	
	
	
	/////////////////////////////////////////判断输赢
	function lianjie(a,b){
		return a + '_' +b;
	}
	function panduan (x, y) {
		r = 0;
		var i = 1;
		while (lianjie(x + i, y) === "black"){
			r++;
			i++;
		}
		return r;
	}
	
	
	/////////////////////////////////////////行列左斜右斜
	function cal(x,y,color){
		//行
		var row = 1; var i;
		i = 1; while (qizi[lianjie(x + i, y)] === color) {row++; i++; }
		i = 1; while (qizi[lianjie(x - i, y)] === color) {row++; i++; }
		
		//列
		var lie = 1;
		i = 1; while (qizi[lianjie(x, y - i)] === color) {lie++; i++; }
		i = 1; while (qizi[lianjie(x, y + i)] === color) {lie++; i++; }
		
		//左斜
		var zX = 1;
		i = 1; while (qizi[lianjie(x + i, y + i)] === color) {zX++; i++; }
		i = 1; while (qizi[lianjie(x - i, y - i)] === color) {zX++; i++; }
		
		//右斜
		var yX = 1;
		i = 1; while (qizi[lianjie(x + i, y - i)] === color) {yX++; i++; }
		i = 1; while (qizi[lianjie(x - i, y + i)] === color) {yX++; i++; }
		
		return Math.max(row,lie,zX,yX)
	}
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	////////////////////////////////////////////////开始游戏
	 $('.start').on('click',function(){
        $(this).closest("ul").addClass('ani');
    });
    
  	////////////////////////////////////////////////关闭保存图片页面
  	$('#img .close').on('click',function(){
  		$(this).parent().css("display","none");
		drawQipan();
  		for(var k in qizi){
  			var x = parseInt(k.split('_')[0]);
  			var y = parseInt(k.split('_')[1]);
  			luozi(x, y, qizi[k]);
  		}
  	})
  	////////////////////////////////////////////////这个有点小问题
  	
  	
	////////////////////////////////////////////////选择游戏类型
	$(".st").on('click',function(){
		$('.xuanze').slideDown(500);
	})
	$(".queding").on('click',function(){
		$('.xuanze').slideUp(500);
	})
	
	
	
	////////////////////////////////////////////////游戏规则
	$(".heqi").on('click',function(){
		$('.jieshao').slideToggle(500);
	})
	
	
	
	
	
	////////////////////////////////////////////////再来一局
	$(".ai").on('click',function(){
		$(".info").removeClass('active');
		drawQipan();
		$(canvas).on("click",handleClick);
		kaiguan = true;
		qizi = {};
		gameState = "pause";
	})
	
	////////////////////////////////////////////////查看棋谱
	$(".huiqi").on('click',chessManual);
	
	
	
	
	////////////////////////////////////////////////退出游戏
	$('.renshu').on('click',function(){
      window.close();
    })
	
	////////////////////////////////////////////////人机对战
	$(".renji").on("click",function(){
		if(gameState==="play"){
			return;
		}
		$(".renren").removeClass("red")
		$(this).addClass("red");
		AI=true;
	})
	$(".renren").on("click",function(){
		if(gameState==="play"){
			return;
		}
		$(".renji").removeClass("red")
		$(this).addClass("red");
		AI=false;
	})
	
	
	
	
	
	
	
	
	
	function format(second){
	    var m=parseInt(second/60);
	    var s=parseInt(second%60);
	    s=(s < 10)?( '0' + s):s;
	    m=(m<10)?('0'+m):m;
	    var time=m + ":" + s;
	    return time;
	}
	
	///////////////////////////////////////////////白秒表
    var second=$('.clock').get(0);
    var sctx=second.getContext('2d');
    var sb=0;
    function miao() {
        sctx.clearRect(0,0,100,100)
        sctx.save();
        sctx.translate(50,50);
        sctx.beginPath();
        sctx.rotate(Math.PI*2/60*sb);
        sctx.arc(0,0,3,0,Math.PI*2);
        sctx.moveTo(0,-3)
        sctx.lineTo(0,-30)
        sctx.moveTo(0,3)
        sctx.lineTo(0,8)
        sctx.stroke();
        sctx.closePath();
        sctx.restore();
        sb++;
    }
    miao()
    var bai=setInterval(miao,1000);
    
    
    var secondb=0
    var timeb=$('.time')
    var mb = function () {
        secondb++;
        timeb=$('.time').text(format(secondb));
    }
    setInterval(mb,1000)
    
    
    //////////////////////////////////////////////黑秒表
    var secondh=$('.clockh').get(0);
    var hctx=secondh.getContext('2d');
    var sh=0;
    function miaoh() {
        hctx.clearRect(0,0,100,100)
        hctx.save();
        hctx.translate(50,50);
        hctx.beginPath();
        hctx.strokeStyle = '#fff';
        hctx.rotate(Math.PI*2/60*sh);
        hctx.arc(0,0,3,0,Math.PI*2);
        hctx.moveTo(0,-3)
        hctx.lineTo(0,-30)
        hctx.moveTo(0,3)
        hctx.lineTo(0,8)

        hctx.stroke();
        hctx.closePath();
        hctx.restore();
        sh++;
    }
    miaoh()
    var hei=setInterval(miaoh,1000);

    var secondh=0
    var timeh=$('.time')
    var mh = function () {
        secondh++;
        timeh=$('.time').text(format(secondh));
    }
    setInterval(mh,1000)
    $(document).on('mousedown',false);
	
})
