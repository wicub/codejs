jQuery.support.cors = true; //<IE10
$.ajaxSetup({ global : true, cache : false, xhrFields: { withCredentials: true }, crossDomain: true});

//异步获取JS模块
function modules(jsModules,fn,jsRoot) {
    var jsRoot = !jsRoot ? '/static/js/modules/': jsRoot;
    if($.isArray(jsModules)) {
        var mod = jsModules.shift();
        mod = mod.indexOf('.js') >0? mod : mod+'.js';
        $.getScript(jsRoot+mod,function () {
            if(jsModules.length>0) modules(jsModules,fn,jsRoot); else if($.isFunction(fn)) fn();
        });
    }
    else {
        jsModules = jsModules.indexOf('.js') >0? jsModules : jsModules+'.js';
        $.getScript(jsRoot+jsModules,fn);
    }
}

var fileUploadUrl = new Object();
//当前时间的时间戳
function nowTime() {
    return parseInt(new Date().getTime()/1000);
}
//获取文件上传的url
function getFileUploadUrl(ops,fn) {
    if(!ops.uploadPath) return false;
    if(!fileUploadUrl[ops.uploadPath]) {
        $.postJ('/Home/tools/getStoreUrls',{uploadPath:ops.uploadPath,limitWidth:ops.limitWidth,limitHeight:ops.limitHeight},function(urls){
            fileUploadUrl[ops.uploadPath] = [urls,nowTime()];
            if($.isFunction(fn)) fn(urls);
        });
    }
    else {
        if(nowTime()-fileUploadUrl[ops.uploadPath][1]>1200) { //20min
            $.postJ('/Home/tools/getStoreUrls',{uploadPath:ops.uploadPath,limitWidth:ops.limitWidth,limitHeight:ops.limitHeight},function(urls){
                fileUploadUrl[ops.uploadPath] = [urls,nowTime()];
                if($.isFunction(fn)) fn(urls);
            });
        }
        else { if($.isFunction(fn)) fn(fileUploadUrl[ops.uploadPath][0]); }
    }
}
//图片url可指定尺寸
function imageUrl(url,size) {
    var ext = url.substr(url.lastIndexOf('.'));
    if(!url.match(/^\/u\//)) return url;
    else if(!size) return url.substr(0,url.lastIndexOf('.')).replace(/-\d+x\d+$/,'')+ext;
    else if(!size.match(/^\d+[x*]\d+$/)) return url;
    else return url.substr(0,url.lastIndexOf('.')).replace(/-\d+x\d+$/,'-')+size.replace('*','x')+ext;
}
//渲染KindEditor编辑器
function renderKEditor(el,options) {
    if(!el) return false;
    In.ready('KindEditor',function() {
       var defOps = { uploadPath:'Wst/KindEditor', moduleName:'', uploadJson:'',afterBlur: function(){this.sync();} }; //默认配置
        if($.isPlainObject(options)) { $.extend(defOps,options); }
        defOps.uploadPath += !!defOps.moduleName? defOps.moduleName.replace(/^\w/,function(v){return v.toUpperCase()}) : '';
        getFileUploadUrl(defOps.uploadPath,function(urls) { //{viewUrl:'',uploadUrl:'',uploadPathUrl:''}
            defOps.uploadJson = urls.uploadUrl;
            var editor = KindEditor.create(el,defOps);
        });
    });
}
//显示操作信息
function msgShow(msg,status,options) {
    var def = { type:'success',placement:'center'};
    if($.isPlainObject(options)) { $.extend(def,options); }
    def.type = !status?'warning':'success';
    var msg = new $.zui.Messager(msg, def);
    msg.show();
}

//异步渲染页面
$.postH = function(url,data,fn) {
	"use strict";
	$.post(url,data,function(res) {
        if(!res) {
            msgShow('网络延迟，请重试',0,{type:'warning',placement: 'top'});
        	return false;
        }
        else if(typeof fn=='function') fn(res);
    });
}

//异步获取并处理json数据
$.postJ = function(url,data,fn,hideMsg) {
	"use strict";
	$.post(url,data,function(res) {
        if(!res) {
            msgShow('网络延迟，请重试',0,{type:'warning',placement: 'top'});
        	return false;
        }
        else {
        	var json = $.isPlainObject(res)?res:$.parseJSON(res);
        	if(!!json.info && !hideMsg) { msgShow(json.info,json.status,!!data.msgOptions?data.msgOptions:{}); }
            if(!!json.data && json.data=='need login') { location.href="/Home/Index/login"; }
            if(typeof fn=='function') fn(json);
        }
    });
}

//JSONP
var MODULE_URLS = null;
$.jsonP = function (module,url,data,fn) {
    "use strict";
    var runJsonp = function(module,url,data,fn) {
        var fullUrl = (!module?'':MODULE_URLS[module])+url;
        $.ajax({ type : "post", url : fullUrl, dataType : "jsonp", data: data,
            jsonp: "jpcallback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            //jsonpCallback:"jpcallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            success : function(json){        if(typeof fn=='function') fn(json);        },
            error:function(){   msgShow('网络延迟，请重试',0,{type:'warning',placement: 'top'});     }
        });
    }
    if(!MODULE_URLS) {
        $.postJ('/home/index/mdurls',{},function (json) {
            if(!!json.status) {
                MODULE_URLS = json.data;
                runJsonp(module,url,data,fn);
            }
        });
    }
    else runJsonp(module,url,data,fn);
}

$.fn.renderFileUpload = function(options,fn) { //渲染上传按钮插件
    "use strict";
    var inputObjs = this;
    In.ready('McWebUploader',function() {
        inputObjs.McWebUploader(options,fn); 
    });
}

$.fn.selectAll = function() {
    "use strict";
    $(this).find(':checkbox').prop('checked',true);
    $(this).addClass('active');
}

$.fn.unSelectAll = function() {
    "use strict";
    $(this).find(':checkbox').prop('checked',false);
    $(this).removeClass('active');
}

$.fn.listCheckAble = function(checkSwitch) {
    "use strict";
    var listObj = this.find('table.datatable');
    if(!checkSwitch) {
        var checkSwitch = $('<th class="pointer" width="20"><i class="checkable icon icon-check-empty"></i></th>') ;
        listObj.find('thead>tr').prepend(checkSwitch);
    } else  listObj.find('thead>tr').prepend('<th width="20"></th>');

    this.find('table.datatable>tbody>tr').each(function() {
        if(!$(this).attr('check-disable')) $(this).prepend('<td class="pointer"><i class="checkable icon icon-check-empty"></i></td>');
        else $(this).prepend('<td></td>');
    });
    checkSwitch.click(function() {
        var checkPBtn = $(this).find('i.checkable');
        if(checkPBtn.hasClass('icon-check-empty')) {
            checkPBtn.removeClass('icon-check-empty').addClass('icon-checked');
            listObj.find('tbody>tr>td:has(i.checkable)').find('i.checkable').removeClass('icon-check-empty').addClass('icon-checked');
            listObj.find('tbody>tr>td:has(i.checkable)').addClass('active');
        }
        else {
            checkPBtn.removeClass('icon-checked').addClass('icon-check-empty');
            listObj.find('tbody>tr>td:has(i.checkable)').find('i.checkable').removeClass('icon-checked').addClass('icon-check-empty');
            listObj.find('tbody>tr>td:has(i.checkable)').removeClass('active');
        }
    });

    listObj.find('tbody>tr>td:has(i.checkable)').click(function() {
        var checkBtn = $(this).find('i.checkable');
        if(checkBtn.hasClass('icon-check-empty')) {
            checkBtn.removeClass('icon-check-empty').addClass('icon-checked');
            $(this).addClass('active');
        }
        else {
            checkBtn.removeClass('icon-checked').addClass('icon-check-empty');
            $(this).removeClass('active');
        }
    });
}

$.fn.listCheckedVals = function (attr,fn) {
    var listObj = this;
    var vals= [];
    listObj.find('tbody>tr['+attr+']').each(function(i) {
        if($(this).find('i.checkable').hasClass('icon-checked')) {
            if($(this).attr(attr)) {  vals.push($(this).attr(attr)); if(typeof fn=='function') fn($(this),i); }
        }
    });
    return vals;
}

$.fn.listSortAble = function(params,fn) {
    "use strict";
    var listObj = this;
    var sortFields = listObj.find('thead>tr>th[sort-field]');
    sortFields.addClass('pointer').append('<i class="mgL5 icon icon-sort"></i>')
        .each(function() {
            if($(this).attr('sort-field')==params.sort_field) {
                $(this).find('i').removeClass('icon-sort').addClass('icon-sort-'+(params.sort_order=='desc'?'down':'up'));
            }
        })
        .hover(function() {$(this).addClass('col-hover');},function() {$(this).removeClass('col-hover');})
        .click(function() {
            sortFields.each(function(){
                if(!$(this).hasClass('col-hover')) {
                    $(this).find('i').removeClass('icon-sort-down').removeClass('icon-sort-up').addClass('icon-sort');
                }
            });
            if( $(this).find('i').hasClass('icon-sort-down') ) { //原升序
                $(this).find('i').removeClass('icon-sort-down').addClass('icon-sort-up'); //升序
                if(typeof fn=='function') fn($(this).attr('sort-field'),'asc');
            }
            else {
                $(this).find('i').removeClass('icon-sort-up').addClass('icon-sort-down'); //降序
                if(typeof fn=='function') fn($(this).attr('sort-field'),'desc');
            }
        });
}

//渲染树状表格
$.fn.renderTreeGrid = function() {
    "use strict";
    var listObj = this;
    var treeTh = listObj.find('thead>tr>th[data-type=tree]');
    if(treeTh.length>0) {
        var thTxt = treeTh.text();
        var open = $('<a class="pdL10" href="javascript:void(-1);">展开</a>');
        var close = $('<a class="pdL10" href="javascript:void(-1);">收起</a>');
        treeTh.append(open).append(close);
        listObj.find('tbody>tr>td[data-type=tree]').each(function() {
            var trtd = $(this);
            var isParent = trtd.parent().attr('data-parent')=="1"?true:false;
            var id = trtd.parent().attr('data-id');
            var repeat = trtd.parent().attr('data-repeat');
            var iconObj = $('<i class="pointer mgR8 icon icon-minus-sign"></i>');
            if(isParent===true) trtd.prepend(iconObj); else trtd.prepend('<span class="pdR10"></span>');
            if(repeat>"0") trtd.prepend('<span>└ </span>');
            iconObj.click(function(event) {
                if($(this).hasClass('icon-minus-sign')) {
                    $(this).removeClass('icon-minus-sign').addClass('icon-plus-sign');
                    $(this).parent().parent().nextUntil('[data-repeat='+repeat+']').each(function () {
                        if($(this).attr('data-repeat')>=repeat) {
                            $(this).hide().find('i.icon-minus-sign').removeClass('icon-minus-sign').addClass('icon-plus-sign');
                        }
                    });
                }
                else {
                    $(this).removeClass('icon-plus-sign').addClass('icon-minus-sign');
                    $(this).parent().parent().nextAll('[data-pid='+id+']').show();
                }
            });
        });
        open.click(function(){
            listObj.find('tbody>tr>td[data-type=tree]').find('i.icon').removeClass('icon-plus-sign').addClass('icon-minus-sign');
            listObj.find('tbody>tr[data-repeat!=0]').show();
        });
        close.click(function(){
            listObj.find('tbody>tr>td[data-type=tree]').find('i.icon').removeClass('icon-minus-sign').addClass('icon-plus-sign');
            listObj.find('tbody>tr[data-repeat!=0]').hide();
        });
    }
}

//给对话框添加按钮
$.fn.addBtn = function(options,fn) {
	"use strict";
	var def = { style:'btn-default', icon:'', name:'关闭',callback:null };
	if($.isPlainObject(options)) { $.extend(def,options); }
	
	if(this.find('.modal-footer').length<1) { this.find('.modal-body').after('<div class="modal-footer"></div>'); }
    var btnHtml = $('<button type="button" class="btn '+def.style+'" '+(!fn?'data-dismiss="modal"':'')+'>'+def.name+'</button>');
    this.find('.modal-footer').append(btnHtml);
    $(btnHtml).html((!def.icon?'':'<i class="icon '+def.icon+'"></i> ')+def.name);
    if(typeof fn=='function') fn($(btnHtml));
	return this;
}

//分页
$.fn.pagerBar = function(pagenation,fn) {
    "use strict";
    var obj = this;
    var def = {pagesize:20,page:1,page_total:1,total:0};
    if($.isPlainObject(pagenation)) { $.extend(def,pagenation); }
    var pager = $('<table><tr><td>共'+def.total+'条记录、'+def.page_total+'页，当前第<input type="text" class="form-control input-sm input_page" value="'+def.page+'">页，每页<select class="form-control input-sm input_pagesize"><option value="10" '+(def.pagesize==10?'selected':'')+'>10</option><option value="20" '+(def.pagesize==20?'selected':'')+'>20</option><option value="30" '+(def.pagesize==30?'selected':'')+'>30</option><option value="50" '+(def.pagesize==50?'selected':'')+'>50</option><option value="100" '+(def.pagesize==100?'selected':'')+'>100</option></select>条</td><td><div class="btn-group pager"></div></td></tr></table>');
    var firstPage = $('<button type="button" class="btn icon icon-step-backward '+(def.page<=1?'disabled':'')+'" title="首页"></button>');
    var frontPage = $('<button type="button" class="btn icon icon-chevron-left '+(def.page<=1?'disabled':'')+'" title="上一页"></button>');
    var nextPage = $('<button type="button" class="btn icon icon-chevron-right '+(def.page>=def.page_total?'disabled':'')+'" title="下一页"></button>');
    var lastPage = $('<button type="button" class="btn icon icon-step-forward '+(def.page>=def.page_total?'disabled':'')+'" title="尾页"></button>');
    var refresh = $('<button type="button" class="btn icon icon-refresh" title="刷新"></button>');
    pager.find('div.pager').append(firstPage).append(frontPage).append(nextPage).append(lastPage).append(refresh);
    firstPage.click(function() { if(typeof fn=='function')fn(1,parseInt(def.pagesize)); });
    frontPage.click(function() { if(typeof fn=='function')fn(parseInt(def.page)-1,parseInt(def.pagesize)); });
    nextPage.click(function() { if(typeof fn=='function')fn(parseInt(def.page)+1,parseInt(def.pagesize)); });
    lastPage.click(function() { if(typeof fn=='function')fn(parseInt(def.page_total),parseInt(def.pagesize)); });
    refresh.click(function() { if(typeof fn=='function')fn(parseInt(def.page),parseInt(def.pagesize)); });

    pager.find('.input_page').keyup(function(event){
        if(event.keyCode==13 && typeof fn=='function') fn(parseInt($(this).val()),parseInt(def.pagesize));
    });
    pager.find('.input_pagesize').change(function(){
        if(typeof fn=='function') fn(parseInt(def.page),parseInt($(this).val()));
    });
    obj.append(pager);
    return pager;
}

//获取表单值
$.fn.getFormData = function(params,notFilter) {
    "use strict";
    var a = arguments[0] ? arguments[0] : 1;
    var obj = this;
    var data = {};
    obj.find(':input').each(function() {
        var tmp = $(this).val();
        var key = $(this).attr('name');
        if(!!notFilter || (tmp!='' && tmp!=null)) { //默认过滤空值
            data[key]= tmp;
        }
    });
    if(a ==9 ){
        var current_params = $('#current_params').val();
        if(current_params){
            data.currentParam = current_params;
        }
    }

    return data;
}


//对话框
function dialogWin(options,fn) {
	"use strict";
	var def = { url:'', data:{}, title:'对话框', icon:'', fullscreen:false, width:'auto', height:'auto', divId:'_dialogWin_',closeBtn:true,btns:[],closeCallback:null };
    var winOptions = {moveable:true,backdrop:false,position:'center',rememberPos:false};
	if($.isPlainObject(options)) { $.extend(def,options); }
    var winDivObj = $('#'+def.divId);
    if(winDivObj.length<1) {
        var _dialogWin_ = $(
            '<div id="'+def.divId+'" class="modal fade"><div class="modal-dialog '+(def.fullscreen?'modal-fullscreen':'')+'" style="overflow:hidden;"><div class="modal-content">'
              +'<div class="modal-header">'
                +'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>'
                +'<h4 class="modal-title"></h4></div>'
              +'<div class="modal-body"><i class="icon icon-spin icon-spinner-indicator"></i></div>'
              +(def.closeBtn===true?'<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div>':'')
            +'</div></div></div>'
        );
        $('body').append(_dialogWin_);
        winDivObj = $('#'+def.divId);
	    winDivObj.modal(winOptions);
    }
    else winDivObj.modal(winOptions);

    $('body').find('div.modal-dialog').parent().css({zIndex:1000});
    winDivObj.css({zIndex:1050}).find('.modal-dialog').css({maxWidth:'100%',maxHeight:'100%'});
    if(!!def.fullscreen) {
        winDivObj.find('.modal-body').height(winDivObj.find('.modal-dialog').height()-142).css({overflow:'auto'});
    }
    if(!!def.width) winDivObj.find('.modal-dialog').width(def.width);
    if(!!def.height) {
        def.height = ($.isNumeric(def.height) && def.height>$(window).height()) ? $(window).height() : def.height;
        winDivObj.find('.modal-dialog').height(def.height);
        if($.isNumeric(def.height)) {
            winDivObj.find('.modal-body').height(def.height-142).css({overflow:'auto'});
        }
    }

    winDivObj.find('.modal-dialog').resize(function() {
        if(winDivObj.find('.modal-dialog').height()>=$(window).height()-10) {
            winDivObj.find('.modal-body').height(winDivObj.find('.modal-dialog').height()-142).css({overflow:'auto'});
        }
    });

    winDivObj.find('.modal-title').html((!def.icon?'':'<i class="icon '+def.icon+'"></i> ')+def.title);

    if(def.btns.length>0) {
		if(winDivObj.find('.modal-footer').length<1) {
			winDivObj.find('.modal-body').after('<div class="modal-footer"></div>');
		}
		else {
			winDivObj.find('.modal-footer').html(def.closeBtn===true?'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>':'');
		}
    	$.each(def.btns,function(i){
            var btnDef = { style:'btn-default', icon:'', name:'关闭',disabled:false,callback:null };0;
    		var btnOps = def.btns[i];
			if($.isPlainObject(options)) { $.extend(btnDef,btnOps); }
		    var btnHtml = $('<button type="button" class="btn '+btnDef.style+'" '+(btnDef.disabled?'disabled':'')+(!btnDef.callback?' data-dismiss="modal"':'')+'>'+btnDef.name+'</button>');
		    winDivObj.find('.modal-footer').append(btnHtml);
		    $(btnHtml).html((!btnDef.icon?'':'<i class="icon '+btnDef.icon+'"></i> ')+btnDef.name);
		    if(typeof btnDef.callback=='function') $(btnHtml).click(function() {
                $(btnHtml).attr('disabled',true); window.setTimeout(function () {$(btnHtml).attr('disabled',false);},1000);
                btnDef.callback(winDivObj,$(btnHtml));
            });
    	});
    }
    winDivObj.find('[data-dismiss=modal]').click(function() {
        if(typeof def.closeCallback=='function') def.closeCallback(winDivObj);
        winDivObj.find(".form-date,.form-datetime").datetimepicker('remove');
        winDivObj.remove(); //$('.modal-backdrop').remove();
    });

    winDivObj.find('.modal-body').html('<i class="icon icon-spin icon-spinner-indicator"></i>');
    if(!!def.url) {
        $.postH(def.url,def.data,function(res) {
            winDivObj.find('.modal-body').html(res);
            winDivObj.modal('ajustPosition', 'center');
            if(typeof fn=='function') fn(winDivObj,res);
        });
    }
    else if(typeof fn=='function') fn(winDivObj);
}


var tabUrlList = new Object(); //打开的tab列表
var activeTabUrl = ''; //激活的tab url
var tabId;
function selectTab(url,params){
	"use strict";
	var url1 = url.split('?')[0];
	tabId = 'tab'+url1.replace(new RegExp(/\W/g),'_');
	$("#HomeTab li[url='"+url+"']>a").on('shown.zui.tab', function () {
	    activeTabUrl = url;
	});
	$("#HomeTab li[url='"+url+"']>a").tab('show');
    if(!$.isPlainObject(params)) params={};
	$.get(url,params,function(str) {
		$('#'+tabId).html(str);
	});
}

//点击菜单，添加Tab页  
function addTabToNavBar(title,url,ableClose,params) {
	"use strict";
	url = '/'+url.replace(new RegExp(/^\/*/),'');
    //截取字符串
    var url1 = url.split('?')[0];
	//alert(url1);
	if(tabUrlList[url1]){
		selectTab(url,params);
		return;
	}
	tabUrlList[url1] = "1";
	var tabW = 0;
	var tabBarW = $("#HomeTab").width();
	var tabId = 'tab'+url.replace(new RegExp(/\W/g),'_');
	var titleDom = $('<li url="'+url+'"><a href="#'+tabId+'" data-toggle="tab">'+(ableClose===false?'':'<i class="icon icon-remove"></i>')+title+'</a></li>');
	var contentDom = $('<div class="tab-pane" id="'+tabId+'"><i class="icon icon-spin icon-spinner-indicator"></i></div>');
	
	$("#HomeTab>li").each(function(){ tabW+=$(this).width();	});
	if(tabBarW-tabW<208){ //下拉
		if($("#HomeTab>li.dropdown").length<1) {
			$("#HomeTab").append('<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">其他<b class="caret"></b></a><ul class="dropdown-menu" role="menu" aria-labelledby="otherMenuTabDrop"></ul></li>');
		}
		$("#HomeTab>li.dropdown>ul").append(titleDom);
	}
	else {
		if($("#HomeTab>li.dropdown").length<1) $("#HomeTab").append(titleDom);
		else $("#HomeTab>li.dropdown").before(titleDom);
	}
	$("#HomeTabContent").append(contentDom);
	titleDom.hover(function() { $(this).find('i.icon-remove').show(); }, function() { $(this).find('i.icon-remove').hide(); })
		.find('i.icon-remove').click(function() {
            $("#HomeTabContent").find('#'+tabId).find(".form-date,.form-datetime").datetimepicker('remove');
			var _url = $(this).parent().parent().attr('url');
			$(this).parent().parent().remove();
			$("#HomeTabContent").find('#'+tabId).remove();
			if($("#HomeTab>li.dropdown>ul").html()=='') {
				$("#HomeTab>li.dropdown").remove();
			} else {
				var _tabW = 0;
				$("#HomeTab>li").each(function(){ _tabW+=$(this).width(); });
				if(tabBarW-tabW>=208) {
					$("#HomeTab>li.dropdown").before($("#HomeTab>li.dropdown>ul>li:first"));
					if($("#HomeTab>li.dropdown>ul").html()=='') { $("#HomeTab>li.dropdown").remove(); }
				}
			}
			if(activeTabUrl!=_url) $("#HomeTab li[url='"+activeTabUrl+"']>a").tab('show');
			else $("#HomeTab li>a:last").tab('show');
			tabUrlList[url1] = 0;
		}).hide();
	selectTab(url,params);
}

function eventOfMenus() {
	"use strict";
	$(".menu_left").click(function(){
		var	menu_lnext = $(this).parents("li").find(".menu_lnext");
		var sjlg_em_on = $(this).find("em");
		$(".menu_lnext").find("li").css("background-color","");
		if(menu_lnext.is(":hidden")){
			$(".menu_lnext").hide();
			menu_lnext.show();
			$(".menu_left").find("em").removeClass("sjlg_on");
			sjlg_em_on.addClass("sjlg_on");
		}else{
			menu_lnext.hide();
			sjlg_em_on.removeClass("sjlg_on");
		}
		if($(this).attr('url')) {
			addTabToNavBar($(this).text(),$(this).attr('url'));
		}
	});
	$(".menu_lnext").find("li").click(function(){
		$(".menu_lnext").find("li").css("background-color","");
		$(this).css("background-color","#297eae");
		if($(this).attr('url')) {
			addTabToNavBar($(this).text(),$(this).attr('url'));
		}
	});

	$(window).add('.rightSidebar .pageTit').resize(function(){
	  	var tabW = 0;
		var tabBarW = $("#HomeTab").width();
		$("#HomeTab>li").each(function(){ tabW+=$(this).width(); });
		if(tabBarW-tabW<208){ //下拉
			if($("#HomeTab>li.dropdown").length<1) {
				$("#HomeTab").append('<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">其他<b class="caret"></b></a><ul class="dropdown-menu" role="menu" aria-labelledby="otherMenuTabDrop"></ul></li>');
			}
			$("#HomeTab>li.dropdown>ul").append($("#HomeTab>li").not('.dropdown').last());
		}
		else {
			if($("#HomeTab>li.dropdown").length>0) {
				$("#HomeTab>li.dropdown").before($("#HomeTab>li.dropdown>ul>li:first"));
				if($("#HomeTab>li.dropdown>ul").html()=='') { $("#HomeTab>li.dropdown").remove(); }
			}
		}
	});
}

(function () {
    var calc = {
        /*
         函数，加法函数，用来得到精确的加法结果
         说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
         参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
         调用：Calc.Add(arg1,arg2,d)
         返回值：两数相加的结果
         */
        Add: function (arg1, arg2) {
            arg1 = arg1.toString(), arg2 = arg2.toString();
            var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
            var maxLen = Math.max(d1.length, d2.length);
            var m = Math.pow(10, maxLen);
            var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
            var d = arguments[2];
            return typeof d === "number" ? Number((result).toFixed(d)) : result;
        },
        /*
         函数：减法函数，用来得到精确的减法结果
         说明：函数返回较为精确的减法结果。
         参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
         调用：Calc.Sub(arg1,arg2)
         返回值：两数相减的结果
         */
        Sub: function (arg1, arg2) {
            return Calc.Add(arg1, -Number(arg2), arguments[2]);
        },
        /*
         函数：乘法函数，用来得到精确的乘法结果
         说明：函数返回较为精确的乘法结果。
         参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
         调用：Calc.Mul(arg1,arg2)
         返回值：两数相乘的结果
         */
        Mul: function (arg1, arg2) {
            var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
            m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
            resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
            return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
        },
        /*
         函数：除法函数，用来得到精确的除法结果
         说明：函数返回较为精确的除法结果。
         参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
         调用：Calc.Div(arg1,arg2)
         返回值：arg1除于arg2的结果
         */
        Div: function (arg1, arg2) {
            var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
            m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
            resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
            return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
        }
    };
    window.Calc = calc;
}());