/* 
* @Author: Peak
* @Date:   2016-06-22 13:59:16
* @Last Modified time: 2016-07-06 20:51:29
*/

$.fn.McWebUploader = function(options,fn) { //渲染百度上传插件
    "use strict";
    var inputObjs = this;
    var uploader;
    if ( !WebUploader.Uploader.support() ) {
        alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error( 'WebUploader does not support the browser you are using.' );
    }

    var urlFitSize = function(ops,url) {
        console.log(ops);
        console.log(url);
        if(!!ops.imageSize && ops.imageSize.match(/^\d+[x*]\d+$/)) {
            var ext = url.substr(url.lastIndexOf('.'));
            return url.substr(0,url.lastIndexOf('.'))+'-'+ops.imageSize.replace('*','x')+ext;
        }
        return url;
    }
    var renderPreview = function(uploadPanelObj,inputObject,ops) { //渲染预览图片
        if(!ops.showPreview) return false;
        uploadPanelObj.find('.uploader_preview_box').empty();
        var fileUrls = !ops.multiple ? [inputObject.val()] : inputObject.val().split(ops.separator);
        for(var i in fileUrls) {
            var fileUrl = fileUrls[i];
            if(!fileUrl.match(/\S+/)) return false;
            var ext = fileUrl.substr(fileUrl.lastIndexOf('.')+1);
            if(!ops.multiple) uploadPanelObj.find('.img-thumbnail').remove();
            uploadPanelObj.find('.uploader_percent').empty();
            if($.inArray(ext.toLowerCase(),['jpg','gif','png','jpeg'])>=0) {
                var preView = $('<div class="img-thumbnail" data-url="'+fileUrl+'" style="margin:5px;position:relative;float:left;">'+(!ops.multiple?'':'<button class="btn btn-mini btn-danger" data-role="remove" type="button" title="去除" style="right:2px;top:2px;position:absolute;"><i class="icon icon-times"></i></button>')+'<img src="'+fileUrl+'" onload="$(this).lightbox();" style="max-width:640px;width:auto;max-height:160px;height:auto;" title="点击查看"/></div>');
            }
            else {
                var preView = $('<div class="img-thumbnail" data-url="'+fileUrl+'" style="margin:5px;">'+(!ops.multiple?'':'<button class="btn btn-mini btn-danger" data-role="remove" type="button" title="去除" style="right:2px;top:2px;position:absolute;"><i class="icon icon-times"></i></button>')+'<h2><i class="icon icon-file"></i></h2>' +fileUrl+ ' <a href="'+fileUrl+'" class="mgL8" target="_blank"><i class="icon icon-signout"></i></a></div>');
            }
            uploadPanelObj.find('.uploader_preview_box').append(preView);
            $(preView).hover(
                function(){$(this).find('button').css('opacity',0.8);},
                function(){$(this).find('button').css('opacity',0.3);}
            ).find('button').css('opacity',0.3);
            if(ops.multiple) $(preView).find('button[data-role=remove]').click(function() {
                var url = $(this).parent().attr('data-url');
                var urls = inputObject.val().split(ops.separator);
                urls.splice(urls.indexOf(url),1);
                inputObject.val(urls);
                $(this).parent().remove();
            });
        }
    }
    var renderBtn  = function(uploadPanelObj,inputObject,btnId,ops,urls) { //渲染选择文件按钮
        if(!urls.uploadUrl) return false;
        else {
            ops.uploadUrl = urls.uploadUrl;
            uploader = WebUploader.create({  // 实例化
                pick: { id: '#'+btnId, label: ops.pickLabel, multiple : ops.multiple },
                accept: ops.accept,
                swf:'/static/js/webuploader/Uploader.swf',    // swf文件路径
                disableGlobalDnd: true,
                chunked: false,
                server: ops.uploadUrl,
                auto: true, //是否自动上传
                fileSizeLimit: 200 * 1024 * 1024,    // 200 M
                fileSingleSizeLimit: 5 * 1024 * 1024,    // 50 M
                onUploadSuccess: function(file,response) {
                    var res = (typeof response=='object' || $.isArray(res) || $.isPlainObject(response)) ? response : $.parseJSON(response);
                    if(($.isArray(res) && res.length>0) || $.isPlainObject(res)) {
                        if(!!res.error && !!res.message) {
                            uploadPanelObj.find('.uploader_percent').empty();
                            msgShow(res.message, res.success);
                        }
                        else {
                            var fileUrl = urlFitSize(ops, $.isArray(res) ? res[0] : res.url);
                            if(!ops.multiple) inputObject.val(fileUrl);
                            else {
                                var inputVal = inputObject.val();
                                inputObject.val(!!inputVal?inputVal+ops.separator+fileUrl:fileUrl);
                            }
                            renderPreview(uploadPanelObj,inputObject,ops);
                            if(typeof fn=='function') fn(res,urls,ops);
                        }
                    } else { msgShow(res,0); }
                    uploader.removeFile( file );
                },
                onUploadProgress:function(file,percentage) {
                    uploadPanelObj.find('.uploader_percent').html('<span><i class="icon icon-spin icon-spinner-indicator"></i> '+parseInt(percentage*100+'%</span>'));
                },
                onUploadError: function(file,reason) {
                    if(!!reason) msgShow(reason, 0);
                    uploadPanelObj.find('.uploader_percent').empty();
                },
                uploadFinished: function () {
                    uploader.reset();
                }
            });
        }
    }

    inputObjs.each(function(i) {
        var inputObj = $(this);
        if(typeof(inputObj.attr("use-fileupload"))!="undefined" && inputObj.attr("use-fileupload").match(/\S+/)) {
            options = $.parseJSON(inputObj.attr("use-fileupload"));
        }
        if(!options && !$.isPlainObject(options) && !options.uploadPath) return false;


        var def = { uploadUrl:'',multiple:false,separator:';',imageSize:'',
            accept:{title:'Images',extensions:'gif,jpg,jpeg,png',mimeTypes:'image/*'},
            showPreview:true,pickLabel:'选择图片',previewPosition:'top',
            limitWidth:0, limitHeight:0
        };  //默认配置
        if($.isPlainObject(options)) { $.extend(def,options); }

        var inputName = inputObj.attr('name').replace(/[^\w]+/g,'_');
        var btnId = 'webuploader_'+nowTime()+'_btn_'+inputName+i;
        var uploadPanel = $('<table width="100%">'
            +(def.previewPosition=='top'?'<tr><td class="uploader_preview_box" colspan="3"></td></tr>':'')
            +'<tr><td class="uploader_url_input">'
            +(inputObj.attr('type')=='hidden'?'':'</td><td width="106">')
            +'<div id="'+btnId+'" style="margin-left:5px;"></div></td><td class="uploader_percent"></td></tr>'
            +(def.previewPosition=='bottom'?'<tr><td class="uploader_preview_box" colspan="3"></td></tr>':'')
            +'</table>');
        if(inputObj.attr('type')!='hidden') { inputObj.attr({type:'text'}); }
        inputObj.before(uploadPanel).appendTo($(uploadPanel).find('.uploader_url_input'));

        if(!!inputObj.val()) { renderPreview($(uploadPanel),inputObj,def); }
        inputObj.change(function() { renderPreview($(uploadPanel),inputObj,def); });

        //图片上传charels.20161118
        if(options.addpic == true){
            var data;
            data = options.product_url.split(';');
            for(var i=0;i< data.length;i++) {
                var inputVal = inputObj.val();
                if(i>0){
                    inputObj.val(inputVal+';'+ data[i]);
                }else{
                    inputObj.val(data[i]);
                }
                //console.log(inputObj.val());
                renderPreview($(uploadPanel),inputObj,def);
            }
        }

        getFileUploadUrl(def,function(urls) {
            renderBtn($(uploadPanel),inputObj,btnId,def,urls);
        });
    });

}