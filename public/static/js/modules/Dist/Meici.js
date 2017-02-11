/* 
* @Author: Charles
* @Date:   2016-05-05 11:23:13
* @Last Modified time: 2016-07-21 21:11:41
*/

var dist_meici = { page:1, pagesize:20, sort_field:'id', sort_order:'asc' };

dist_meici.changeIndexTab = function (index,status) {
    "use strict";
    dist_meici.list_tab_index = index;
    dist_meici.status = status;
    //if(!$('#dist_meici_index_tab'+index+' .list_table').html())
    dist_meici.getList({status:status},index);
};

dist_meici.getList = function(params,page,obj) {
    "use strict";
    obj = !!obj ? obj : $('#dist_meici_applyIndex .list_table');
    dist_meici.sort_order='desc';

    var data = $('#dist_meici_applyIndex .search_bar').getFormData(params);
    //9的状态为搜索
    if(params == 9){
        console.log('data.currentParam:' + data.currentParam);
        if(data.currentParam){
            params=data.currentParam;
            $('.meici_sku').val('');
            $('.meici_spu').val('');
        }
    }

    data.page=1;
    data.pagesize=dist_meici.pagesize;
    data.sort_field=dist_meici.sort_field;
    data.sort_order=dist_meici.sort_order;

    if($.isPlainObject(page)) { $.extend(data,page); }
    dist_meici.page=data.page;
    dist_meici.pagesize=data.pagesize;
    dist_meici.sort_field=data.sort_field;
    dist_meici.sort_order=data.sort_order;
    dist_meici.order_lists = [];
    dist_meici.member = {};

    if(params == 1){
        //未提交
        data.status = 1;
        data.meici_status = 9;
        data.params = 1;
    }
    if(params == 2){
        //未上架
        //1、提交未审核，2、审核未通过
        data.status = 1;
        data.meici_status =1;
        //4未美西审核未通过
        data.other_meici_status =4;
        data.params = 2;
    }
    if(params == 3 ){
        //已下架
        data.status = 1;
        data.meici_status =3;
        data.params = 3;
    }
    if(params == 4){
        //已上架
        data.status = 1;
        data.meici_status =2;
        data.params = 4;
    }
    console.log(data);
    $.postH('/dist/meici/lists',data,function(res) {
        //console.log(dist_meici);
        obj.html(res);
        if(params == 1) {
            obj.listCheckAble(obj.find('.btn_bar a').has('.checkable'));
        }else{
			obj.children(".prodatatable").children("tbody").children("tr").prepend("<td></td>");
			obj.children(".prodatatable").children("tbody").children("tr:first").children("td").hide();
		}
        obj.find('.btn_bar').find('a.allOpen').click(function () {
            //obj.find('table.datatable>tbody>tr').show();
            //obj.find('i[toggle-show]').removeClass('icon-plus-sign').addClass('icon-minus-sign');
			$(".proSPUclose_m").css("height","auto");
			$(".proSPUclose").addClass("psc_o").html("收起");
			$(".proSPUinfo_m").show();
        });
        obj.find('.btn_bar').find('a.allClose').click(function () {
            //obj.find('table.datatable>tbody>tr').hide();
            //obj.find('i[toggle-show]').removeClass('icon-minus-sign').addClass('icon-plus-sign');
			$(".proSPUclose_m").css("height","68px");
			$(".proSPUclose").removeClass("psc_o").html("展开");
			$(".proSPUinfo_m").hide();
        });
        obj.find('i[toggle-show]').click(function () {
            var spu = $(this).attr('toggle-show');
            if($(this).hasClass('icon-minus-sign')) {
                $(this).removeClass('icon-minus-sign').addClass('icon-plus-sign');
                obj.find('table.datatable>tbody>tr[data-spu='+spu+']').hide();
            }
            else {
                $(this).removeClass('icon-plus-sign').addClass('icon-minus-sign');
                obj.find('table.datatable>tbody>tr[data-spu='+spu+']').show();
            }
        });
        //加载搜索的数据类型
        if(params == 4){
            $('.meici_sku').show();
            $('.meici_spu').show();
        }else{
            $('.meici_sku').hide();
            $('.meici_spu').hide();
        }

        obj.listSortAble(dist_meici,function(field,order) { //渲染排序效果

            dist_meici.getList({sort_field:field,sort_order:order});
        });
    });
};


dist_meici.listToCheck = function(obj){
    var ids=[];
    obj = !!obj ? obj : $('#dist_meici_applyIndex .list_table');
    obj.find('table.datatable>tbody>tr[data-id]').each(function(i) {
        if($(this).find('i.checkable').hasClass('icon-checked')){  ids.push($(this).attr('data-id')); }
    });
    dist_meici.setstatus(ids.join())
}

dist_meici.setstatus = function(ids) {
    var status =  $('#current_params').val();
    if(status && !confirm('您确定要提交到审核？')) return false;
    else  $.postJ('/dist/meici/setstatus',{ids:ids,status:status,dosubmit:1},function(json) {
        if(!!json.status){
            dist_meici.getList(status);
        }
        });
}


//商品修改
dist_meici.edit = function(spu,meiciStatus,billType) {
    "use strict";
    var data={};
    data.spu = spu;
    if(meiciStatus == 1 ){
        //已下架
        data.status = 1;
        data.meici_status =9;
        data.params = 1;
    }
    if(meiciStatus == 3 ){
        //已下架
        data.status = 1;
        data.meici_status =3;
        data.params = 3;
    }
    if(meiciStatus == 4){
        //已上架
        data.status = 1;
        data.meici_status =2;
        data.params = 4;
    }

    dialogWin({title:'编辑商品信息[SPU：'+spu+']',url:'/dist/meici/editdata',data:data,icon:'icon-pencil',width:900,
        btns:[
            {name:'保存',style:'btn-primary',callback:function(win,btn) {
                //pms_product.editSubmit(win,function() { pms_product.getList(5); });
                dist_meici.editSubmit(billType,meiciStatus,win,function() { dist_meici.getList(data.params);
                     });
            }}
        ]
    },function(win) {
        win.find('form').initValidate();
    });
};

//编辑表单保存 Y
dist_meici.editSubmit = function(billType,meiciStatus,win,fn,isApply) {
    "use strict";
    var postData=[],obj,list;
    obj = !!obj ? obj : $('#dist_meici_checkinfo_form');
    obj.find('.dist_meici_product').each(function(i) {
        var ids={},quantity,quantityData,new_price,priceData,sku_id;
        quantity = $(this).find("[name='quantity[]']").attr('data-value');
        quantityData= $(this).find("[name='quantity[]']").val();
        if(billType == 1){ //cost_price
            new_price = $(this).find("[name='cost_price[]']").attr('data-value');
            priceData= $(this).find("[name='cost_price[]']").val();
        }else{
            new_price = $(this).find("[name='price[]']").attr('data-value');
            priceData= $(this).find("[name='price[]']").val();
        }

        sku_id =  $(this).find("[name='sku_id[]']").val();

        if(quantity !== quantityData){
            ids.quantity = quantityData;
        }
        if(new_price !== priceData){
            if(billType ==1){
                ids.cost_price =1;
            }else{
                ids.cost_price =0;
            }
            ids.new_price = priceData;
        }

        //console.log(ids);
        if(ids.new_price || ids.quantity){
            ids.sku_id = sku_id;
            ids.meici_status = meiciStatus;
            postData.push(ids);
        }else{
            alert('您没有进行修改');
            return true;
        }
        //if($(this).find('i.checkable').hasClass('icon-checked')){  ids.push($(this).attr('data-id')); }
    });
    if(postData && postData.length > 0){
        list  = JSON.stringify(postData);
    }else{
        confirm('您没有进行修改');return;
    }
    console.log(list);
    $.postJ('/dist/meici/editdata',{data:list,dosubmit:1},function(json) {  if(json.status){
        win.modal('hide'); if($.isFunction(fn)) fn();
        }
    }
    );

};


//查看日志 Y
dist_meici.looklogs = function(spu,type,sku) {
    "use strict";
    modules('Dist/Meicilogs',function() {
        var operate_type = !type?'':(type=='info'?'3':(type=='error'?'4':''));
        console.log('operate_type:' + operate_type);
        dist_meicilogs.list4dialog({spu:spu, operate_type:operate_type,sku:sku});
    });
};

//审核商品信息 Y
dist_meici.checkInfo = function(spu) {
    "use strict";
    dialogWin({title:'审核商品信息[SPU：'+spu+']',url:'/dist/meici/checkinfo',data:{spu:spu},icon:'icon-info-sign',width:900,closeBtn:false,
         btns:[
             {name:'审核',style:'btn-primary',callback:function(win,btn) {
                 dist_meici.setstatus(win,function() { pms_product.getList(); });
             }},
             {name:'取消',style:'btn-primary',callback:function(win,btn) {
                 dist_meici.checkInfoSubmit(win,spu,0,function () { dist_meici.getApplyList(); });
             }}
        ]
    },function(win) {
        win.find('form').initValidate();
        win.find('form :input').attr('disabled',true);

    });
}


//提交审核商品信息结果 Y
dist_meici.checkInfoSubmit = function(win,spu,pass,fn) {
    "use strict";
    if(!pass) { //未通过
        win.find('tr.reject_reason').show().find('[name=reject_reason]').attr({"validate-rule":"require|maxLength:600","disabled":false}).focus();
    } else {
        win.find('tr.reject_reason').hide().find('[name=reject_reason]').attr({"validate-rule":"","disabled":true});
    }
    win.find('form').validate(function(){
        win.find('form').ajaxSubmit({
            url:'/pms/product/checkinfo', data:{dosubmit:1,spu:spu,pass:!pass?0:1},
            success: function (r) {
                msgShow(r.info,r.status);
                if(!!r.status) { win.modal('hide'); if($.isFunction(fn)) fn(r); }
            }
        });
    });
}


dist_meici.addLabelInput = function (obj,val) {
    var labelInput = $('<span class="float_l mgR8">' +
        '<input name="labels[]" class="form-control float_l" type="text" style="width:80px;" placeholder="输入标签" validate-rule="require|isChinese|maxLength:30" value="'+(!val?'':val)+'"/>' +
        '<a class="pointer float_r" onclick="$(this).parent().remove();"><i class="icon icon-times"></i></a>'+
        '</span>');
    obj.before(labelInput);
    $(labelInput).initValidate();
}