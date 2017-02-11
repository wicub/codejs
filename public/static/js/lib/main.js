/*
var _btn_act = true;
$(function(){
	siderheight();
	//加载下拉导航
	$(".sidebarSub li").each(function() {
		var thisLi = $(this).attr("class");
		if(thisLi == "sidebar_cur"){
			$(this).parents(".sidebarSub").show();
			$(this).parents(".sidebarSub").siblings(".sidebarTit").addClass("sidebar_cur");
			$(this).parents(".sidebarSub").siblings(".sidebarTit").children("em").addClass("sideOpen");
		} 
    });
	
	
	
	//左侧导航动画
	$(".sidebar .sidebarTit").click(function(){
		var thisNext = $(this).next(".sidebarSub");
		if(thisNext.is(":visible")){
			$(this).removeClass("sidebar_cur");
			$(this).children("em").removeClass("sideOpen");
			thisNext.hide();
		}else{
			$(this).addClass("sidebar_cur");
			$(this).children("em").addClass("sideOpen");
			$(this).parent("li").siblings("li").children(".sidebarSub").hide();
			$(this).parent("li").siblings("li").children(".sidebarTit").removeClass("sidebar_cur");
			$(this).parent("li").siblings("li").children(".sidebarTit").children("em").removeClass("sideOpen");
			thisNext.show();
		};
	});

	//全屏
	$(".sidePull_m").click(function(){
		var pullC = $(".sidePull_m").children("em").attr("class");
		if(pullC == "spull"){
			$(".rightContent").css({"margin-left":"215px"});
			$(".leftSidebar").css({"left":"0"});
			$(".sidePull_m em").removeClass("spull").html("&lt;")
			$(".sidebar").css({"left":"0"});
		}else{
			$(".rightContent").css({"margin-left":"30px"});
			$(".leftSidebar").css({"left":"-185px"});
			$(".sidePull_m em").addClass("spull").html("&gt;")
			$(".sidebar").css({"left":"-215px"});
		};

	});

	//拖动
	try {
		if($(".ac_box").length>0 && $(".ac_box h3").length>0) {
			$('.ac_box').drag(function( ev, dd ){
				$( this ).css({
					top: dd.offsetY,
					left: dd.offsetX
				});
			},{handle:".ac_box h3"});
		}
	}catch (e){}
        
        console.log("%c","padding:100px 200px;line-height:120px;background:url('http://ny.co/Tpl/Public/img/2.jpg') no-repeat");
        console.log("欢迎进入: NEW YORK管理系统");
        console.log("美西官网: http://www.meici.com");
});

jQuery.jqtab = function(tabtit,tab_conbox,shijian){
	$(tab_conbox).find("div.tabBox").hide();
	$(tabtit).find("li:first").addClass("tabCur").show(); 
	$(tab_conbox).find("div.tabBox:first").show();

	$(tabtit).find("li").bind(shijian,function(){
		$(this).addClass("tabCur").siblings("li").removeClass("tabCur"); 
		var activeindex = $(tabtit).find("li").index(this);
		$(tab_conbox).children().eq(activeindex).show().siblings().hide();
		return false;
	});
};
*/
//公用弹出框
function boxShow(boxID){
	var isIE6= /msie 6/i.test(navigator.userAgent);
	if (isIE6){
		$("select").hide();
	}
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    var relLeft = ($(window).width() - $("#" + boxID).width())/2;
    var relTop = ($(window).height() - $("#" + boxID).height())/2;
    $(".mask").css({height:maskHeight, width:maskWidth}).show();
	$(".mask_a").css({height:maskHeight, width:maskWidth}).show();
    $("#" + boxID).css({top:$(window).scrollTop() + relTop + "px", left:$(window).scrollLeft() + relLeft + "px"}).show();
        $(".close_btn1").click(function(){
		location.reload();
	});
	$(".close_btn, .mask, .btnCancel").click(function(){
		$(".mask, .ac_box").hide();
		if (isIE6){
			$("select:hidden").show()
		}
	});
}

//公用tip
function tipsShow(b){
	var $tip=$('<div id="tip"><div class="t_box"><div class="tip_msg">'+ b +'<s><i></i></s></div></div></div>');
    $('body').append($tip);
    $('#tip').show('fast');
	$('.tip').mouseout(function(){
	  $('#tip').remove();
	}).mousemove(function(e){
	  $('#tip').css({"top":(e.pageY-20)+"px","left":(e.pageX+20)+"px"})
	}).mousedown(function(){
	  $('#tip').remove();
	})
}

//在线咨询超出范围显示返回顶部
$(function() {
	$(window).scroll(function() {
		if($(this).scrollTop() > 200) {
			$(".scroll_m_top").fadeIn(300);
		} else {
			$(".scroll_m_top").fadeOut(300);
		}
	});
});

//左侧 leftSidebar 高度
function siderheight(){
	var winH = $(document).height();
	var headH = $(".header").height();
	var siderH = winH - headH
	$(".leftSidebar").height(siderH);
	$(".rightContent").css({"min-height":siderH});
}

//判断浏览器
function brwsTester(){
	return (document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;
}

//写cookies
function setCookie(name,value,life,path){
    var life = arguments[2] ? arguments[2] : 365;
    var path = arguments[3] ? arguments[3] : false;
	var date = new Date();
	date.setTime(date.getTime() + life * 86400000);
	document.cookie = name + "=" + escape(value) + ";expires=" + date.toGMTString() + ((path) ? ";path=" + path : '');
}
//读取cookies的值
function getCookie(name){
	var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)){
		return unescape(arr[2]);
	}else{
		return false;
	}
}
//删除cookies的值
function delCookie(name,path){
    var path = arguments[1] ? arguments[1] : false;
    var exp = new Date();
    exp.setTime (exp.getTime() - 1);
    document.cookie = name + "=''" + "; expires=" + exp.toGMTString() + ((path) ? ";path=" + path : '');
}
//格式化数字（php number_format）number传进来的数,fix保留的小数位,默认保留两位小数,fh为整数位间隔符号,默认为空格,jg为整数位每几位间隔,默认为3位一隔
function number_format(number, fix, fh, jg){
    var fix = arguments[1] ? arguments[1] : 2;
    var fh = arguments[2] ? arguments[2] : ' ';
    var jg = arguments[3] ? arguments[3] : 3;
    var str = '';
    var sign;
    sign = number >= 0 ? '' : '-';  //记下正负数
    number = parseFloat(Math.abs(number), 10).toFixed(fix);
    number = number.toString();
    var zsw = number.split('.')[0]; //整数位
    var xsw = number.split('.')[1]; //小数位
    var zswarr = zsw.split('');   //将整数位逐位放进数组
    for(var i=1; i<=zswarr.length; i++){
        str = zswarr[zswarr.length - i] + str;
        if((i % jg) == 0){
            str = fh + str; //每隔jg位前面加指定符号
        }
    }
    str = ((zsw.length % jg) == 0) ? str.substr(1) : str; //如果整数位长度是jg的的倍数,去掉最左边的fh
    zsw = str + '.' + xsw; //重新连接整数和小数位
    return sign.toString() + zsw.toString();
}
//类似与php中的str_pad方法(input, pad_length, pad_string, pad_type)
function str_pad(str, len, chr, dir){
    str = str.toString();
    len = (typeof len == 'number') ? len : 0;
    chr = (typeof chr == 'string') ? chr : ' ';
    dir = (/left|right|both/i).test(dir) ? dir : 'right';
    var repeat = function(c, l) { // inner "character" and "length"
        var repeat = '';
        while (repeat.length < l) {
            repeat += c;
        }
        return repeat.substr(0, l);
    }
    var diff = len - str.length;
    if (diff > 0) {
        switch (dir) {
            case 'left':
                str = '' + repeat(chr, diff) + str;
                break;
            case 'both':
                var half = repeat(chr, Math.ceil(diff / 2));
                str = (half + str + half).substr(1, len);
                break;
            default: // and "right"
                str = '' + str + repeat(chr, diff);
        }
    }
    return str;
}
//格式化时间戳
function getData(nS) {
    var day2 = new Date(nS * 1000);
    return day2.getFullYear()+"-"+(day2.getMonth()+1)+"-"+day2.getDate()+" "+day2.getHours()+":"+day2.getMinutes()+":"+day2.getSeconds();
}
//Post提交，返回TP格式JSON数据
function _postJSON(url, Post, fun){
    var waitTime = arguments[3] ? arguments[3] : 1;
    url += '/' + new Date().getTime();
    $.post(url, Post ,function(jsonStr){
        if(waitTime > 0){
            waitTime = (jsonStr.status == 1) ? 1 : 2;
            msgBoxText(jsonStr.info, waitTime, function(){
                _btn_act = true;
                if(jsonStr.status == 1 && typeof(fun) == 'function'){
                    fun(jsonStr.data);
                }
            });
        }else{
            _btn_act = true;
            if(jsonStr.status == 1 && typeof(fun) == 'function'){
                fun(jsonStr.data);
            }
        }
    });
}
//错误输出
function _errMsg(){
    var msg = arguments[0] ? arguments[0] : '处理失败';
    var showId = arguments[1] ? arguments[1] : '';
    var w_t = arguments[2] ? arguments[2] : 2;
    if(showId == 'msgBox'){
        msgBoxText(msg, w_t, null);
    }else if(showId == '' || $('#' + showId).length < 1){
        alert(msg);
    }else {
        $('#' + showId).html(msg);
    }
    _btn_act = true;
    return false;
}
//排除关键词
function delKeyStr(str){
    var find = ['#', ':', '|', '+'];
    var rep = ['','','',''];
    for(var k in find){
        str = str.replace(find[k], rep[k]);
    }
    return str;
}
/*
function _msgalertshow(){
    //if($('#_msg_mask').attr('id') != undefined) return;
    alert(3232);
    var mask = $('<div class="mask" id="_msg_mask" style="z-index:9000;"></div>');
    var act_box = $('<div id="_msg_act_box" class="ac_box rack_case01" style="width:450px;min-height:60px;z-index:9001;"><div class="ac_content" style="padding:20px;"><div class="goods_edit">正在读取数据，请稍候......</div></div></div>');
    $('body').append(mask);
    $('body').append(act_box);
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    var relLeft = ($(window).width() - $("#_msg_act_box").width())/2;
    var relTop = ($(window).height() - $("#_msg_act_box").height())/2;
    $('#_msg_mask').css({height:maskHeight, width:maskWidth}).show();
    $("#_msg_act_box").css({top:$(window).scrollTop() + relTop + 'px', left:$(window).scrollLeft() + relLeft + 'px'}).show();
}

function _msgalerthide(){
    $('#_msg_mask').remove();
    $('#_msg_act_box').remove();
}*/
function msgBoxText(msg, goTime, fun){
    if($('#_msg_mask').attr('id') == undefined){
        _msgalertshow();
    }
    msg = '<font color="red"><b>' + msg + '</b></font>';
    $("#_msg_act_box .goods_edit").html('&nbsp;&nbsp;&nbsp;' + msg + '&nbsp;&nbsp;&nbsp;<span id="_msg_timer">' + goTime + '</span>秒后恢复');
    $('#_msg_timer').everyTime('1s','B',function(){
        var t1 = parseInt($(this).html());
        --t1;
        $(this).html(t1);
        if (t1 == 0){
            _msgalerthide();
            if(typeof(fun) == 'function'){
                fun();
            }
        }
    },goTime);
}

//分页跳转
function jumpPage(obj,totalPages){
    var page = parseInt($(obj).parent().find('input').val(),10);
    if(isNaN(page) || page == 0){
        alert("请填写正确的跳转页码");
        return false;
    }else{
        if(page > totalPages){
            alert("当前只有"+totalPages+"页");
        }else{
            var url = $(obj).parent().parent().find('a').eq(0).attr('href');
            var urlArray= url.split('/p/')
            window.location = urlArray[0]+'/p/' + page
        }
    }
}


//导出搜索
function searchCondition(form,status,url){
    var p = $('.page_cur').html();
    if(status==1){
        $("#"+form).attr('action',url+"/p/"+p);
        $("#"+form).removeAttr('target');
    }else if(status==2){
        $("#"+form).attr('action',url+"/p/"+p);
        $("#"+form).attr('target','_black');
    }
    $("#"+form).submit();
}