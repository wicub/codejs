/*
 * @Author: Peak
 * @Date:   2016-05-27 12:21:57
 * @Last Modified time: 2016-06-01 16:38:14
 * JS 验证
 */
//初始化表单验证器
$.fn.initValidate = function(enterFn) {
    "use strict";
    var form = this;
    var inputs = this.find('[validate-rule]');
    form.find(':input').keyup(function() {
        if(event.keyCode==13) if($.isFunction(enterFn)) enterFn($(this));
    });
    inputs.blur(function() { $(this).checkData(form); }).change(function() { $(this).checkData(form); });
}

//直接验证表单和输入框
$.fn.validate = function(fn1,fn2) {
    "use strict";
    var form = this;
    var inputs = this.find('[validate-rule]');
    var allRight = true;
    inputs.each(function() {
        var r = $(this).checkData(form,1);
        if(r!==true) { allRight=false; }
    });
    if(allRight===true) { if($.isFunction(fn1)) fn1(); }
    else { if($.isFunction(fn2)) fn2(); }
}

//检查具体输入框的值
$.fn.checkData = function(form,directShow) {
    "use strict";
    var obj = this;
    var val = obj.val();
    var vIsEmpty = !val.match(/\S+/g);
    var vRule = obj.attr('validate-rule');
    var vTitle = obj.attr('validate-title');
    var tipPlace = 'top';

    var checkCondition = function(v1,op,v2) {
        if($.inArray(op,['eq','=='])) {  return v1==v2; }      //等于
        else if($.inArray(op,['neq','!='])) {   return v1!=v2; }  //不等于
        else if($.inArray(op,['heq','==='])) {  return v1===v2; }  //恒等于
        else if($.inArray(op,['gt','>'])) {     return v1>v2; }    //大于
        else if($.inArray(op,['elg','>='])) {   return v1>=v2; }  //大于等于
        else if($.inArray(op,['lt','<'])) {     return v1<v2; }    //小于
        else if($.inArray(op,['elt','<='])) {   return v1<=v2; }  //小于等于
    };
    var vConditions = {
        'eq':'等于',          '==':'等于',         'neq':'不等于',        '!=':'不等于',          'heq':'恒等于',
        '===':'恒等于',       'gt' :'大于',        '>'  :'大于',          'elg':'大于等于',        '>=' :'大于等于',
        'lt' :'小于',         '<'  :'小于',        'elt':'小于等于',       '<=':'小于等于'
    };
    var vFuncNames = {
        'isEmail':'Email地址',
        'isMobilePhone':'手机号',
        'isTelephone':'电话号码、手机号或400号电话格式',
        'isMemberAccount': '手机号或邮箱格式',
        'isUserName': '由字母、数字、空格、横线和下划线组成的字符串',
        'isChinese':'由中文、字母、数字、空格、横线和下划线组成的字符串',
        'isToken':'TOKEN字符串（字母、数字、等号）',
        'isSha1':'SHA1字符串',
        'isMd5':'MD5字符串',
        'isLetter':'字母',
        'isUpper':'大写字母',
        'isLower':'小写字母',
        'isFloat':'浮点型',
        'isUnsignedFloat':'无符号浮点型',
        'isOptFloat':'为空或是浮点型',
        'isName':'不含标点符号',
        'isPrice':'价格格式',
        'isDateFormat':'日期格式',
        'isDate':'日期格式',
        'isYear':'4位整数',
        'isInt':'整形',
        'isUnsignedInt':'无符号整形',
        'isUrl':'URL格式',
        'isIp4':'IP4地址格式',
        'isAbsoluteUrl':'绝对URL格式',
        'isFileName':'文件名格式（字母、数字、横线、下划线、点号）',
        'isPath':'由字母、数字、横线、下划线、点号、斜杠组成',
        'isPaths':'由字母、数字、横线、下划线、点号、斜杠组成，多个由分号";"隔开',
        'isBirthDate':'规范的生日格式',
        'isIMEI':'IMEI格式字符串',
        'isISBN':'ISBN格式字符串',
        'isIdCard':'规范的身份证号',
        'isNickname':'由中文、字母和下划线组成的字符串',
        'isPasswd':'由6~32个字母、数字、标点符[ ~!@#$%^&*_- ]号组成的字符串',
        'isColor':'3个不大于255的数字，由逗号分隔',
        'isIntId':'数字',
        'isIntIds':'数字，多个用逗号“,”隔开',
        'isMixId':'由字母、数字、下划线组成',
        'isMixIds':'由字母、数字、下划线组成，多个用逗号“,”隔开',
        'unEmpty':'非空',
        'isEname':'由字母、空格、“`”组成',
    };

    var vFn = {
        'isEmail' : function(v){
            return vIsEmpty || v.match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/);
        },
        'isMobilePhone' : function(v){ return vIsEmpty || v.match(/^1[34578][0-9]{9}$/); },
        'isTelephone' : function (v) {
            if(vIsEmpty) return true;
            else if(v.match(/^(\+?86-?)?1[34578][0-9]{9}$/)) return true;
            else if(v.match(/^(010|02\d{1}|0[3-9]\d{2})-\d{7,9}(-\d+)?$/)) return true;
            else if(v.match(/^400(-\d{3,4}){2}$/)) return true;
            else return false;
        },
        'isMemberAccount':function (v) { return vFn.isMobilePhone(v) || vFn.isEmail(v);},
        'isUserName' : function(v){ return vIsEmpty || v.match(/^\w+[\s\w-]*\w+$/); },
        'isChinese' : function(v){ return vIsEmpty || v.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]+[\u4E00-\u9FA5a-zA-Z0-9_\s-]*$/g); },
        'isToken' : function(v){ return vIsEmpty || v.match(/^[a-zA-Z0-9=]+$/); },
        'isSha1' : function(v){ return vIsEmpty || v.match(/^[a-fA-F0-9]{40}$/); },
        'isMd5' : function(v){ return vIsEmpty || v.match(/^[a-f0-9A-F]{32}$/); },
        'isLetter' : function(v){ return vIsEmpty || v.match(/^[a-zA-Z]+$/); },
        'isUpper' : function(v){ return vIsEmpty || v.match(/^[A-Z]+$/); },
        'isLower' : function(v){ return vIsEmpty || v.match(/^[a-z]+$/); },
        'isFloat' : function(v){ return vIsEmpty || v.match(/^-?\d+\.\d+$/); },
        'isUnsignedFloat' : function(v){ return vIsEmpty || v.match(/^\d+\.\d+$/); },
        'isOptFloat' : function(v){ return vIsEmpty || !v || vFn.isFloat(v); },
        'isName' : function(v){
            return vIsEmpty || !v.match(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g);
        },
        'isPrice' : function(v){ return vIsEmpty || v.match(/^[0-9]{1,10}(\.[0-9]{1,9})?$/); },
        'isDateFormat' : function(v){
            return vIsEmpty || v.match(/^([0-9]{4})-((0?[0-9])|(1[0-2]))-((0?[0-9])|([1-2][0-9])|(3[01]))( [0-9]{2}:[0-9]{2}:[0-9]{2})?$/);
        },
        'isDate' : function(v){ return vIsEmpty || v.match(/^([0-9]{4})-((0?[0-9])|(1[0-2]))-((0?[0-9])|([1-2][0-9])|(3[01]))$/); },
        'isYear' : function(v){ return vIsEmpty || v.match(/^\d{4}$/); },
        'isInt' : function(v){ return vIsEmpty || v.match(/^-?\d+$/g); },
        'isUnsignedInt' : function(v){ return vIsEmpty || v.match(/^\d+$/g); },
        'isUrl' : function(v){ return vIsEmpty || v.match(/^[~:#,%&_=\(\)\.\? \+\-@\/a-zA-Z0-9]+$/); },
        'isIp4' : function(v){
            var ary = v.split('.');
            return vIsEmpty || (!v.match(/[^\.\d]/) && ary.length == 4 && ary[0] >= 0 && ary[1] >= 0 && ary[2] >= 0 && ary[3] >= 0 && ary[0] <= 255 && ary[1] <= 255 && ary[2] <= 255 && ary[3] <= 255);
        },
        'isAbsoluteUrl' : function(v){ return vIsEmpty || v.match(/^https?:\/\/[!,:#%&_=\(\)\.\? \+\-@\/a-zA-Z0-9]+$/); },
        'isFileName' : function(v){ return vIsEmpty || v.match(/^[a-zA-Z0-9_.-]+$/); },
        'isPath' : function(v){ return vIsEmpty || v.match(/^[a-zA-Z0-9_.-\/]+$/); },
        'isPaths' : function(v){ return vIsEmpty || v.match(/^[a-zA-Z0-9_.-;\/]+$/); },
        'isBirthDate' : function(v){
            if (vIsEmpty || v == '0000-00-00') return true;
            else if (v.match( /^(19|20)(\d){2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])$/)) {
                return true;
            }
            else return false;
        },
        'isIMEI' : function(v){ return vIsEmpty || v.match(/^[0-9a-z]{15}$/i); },
        'isISBN' : function(v){ return vIsEmpty || v.match(/^[0-9]{13}$/); },
        'isIdCard' : function(v){ return vIsEmpty || v.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/); },
        'isNickname' : function(v){ return vIsEmpty || v.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]{2,18}$/); },
        'isPasswd' : function(v){ return vIsEmpty || v.match(/^[\w~!@#$%^&*_-]{6,32}$/i); },
        'isColor' : function(v){ return vIsEmpty || v.match(/^\d{1,3},\d{1,3},\d{1,3}$/); },
        'isIntId' : function(v){ return vIsEmpty || v.match(/^[0-9]+$/); },
        'isIntIds' : function(v){ return vIsEmpty || v.match(/^[0-9,]+$/); },
        'isMixId' : function(v){ return vIsEmpty || v.match(/^[\w]+$/); },
        'isMixIds' :function(){ return vIsEmpty || v.match(/^[\w,]+$/); },
        'unEmpty' : function(v){ return !vIsEmpty; },
        'isEname' : function(v){ return vIsEmpty || v.match(/^[a-zA-Z]+[a-zA-Z`\s]+[a-zA-Z]+$/); },
    };

    var showErr = function(title) {
        obj.tooltip('destroy');
        obj.parent().addClass('has-error');
        obj.tooltip({placement:tipPlace,title:title });
        if(!!directShow) obj.tooltip('show');
        return title;
    };

    if(!vRule) return true;
    var validConds = vRule.split('|');
    var i='';
    for(i in validConds) {
        var vi = validConds[i];
        if(vi=='require' && vIsEmpty===true) {
            return showErr((!!vTitle?vTitle:'该项')+'必填');
        }
        else if(vi.substr(0,11)=='require_if:' && vIsEmpty===true) { //某条件下必填
            var cond = vi.substr(11).split(':');
            if(vIsEmpty===false && cond.length==3 && !!cond) {
                if(checkCondition(form.find('[name='+cond[0]+']').val(),cond[1],cond[2])) {
                    return showErr((!!vTitle?vTitle:'该项')+'必填');
                }
            }
        }
        else {
            var op='';
            if(vi=='numeric' && !$.isNumeric(val)) {
                return showErr((!!vTitle?vTitle:'该项')+'必须是数字');
            }
            else if(vi.substr(0,10)=='maxLength:' && val.length>parseInt(vi.substr(10))) {
                return showErr( (!!vTitle?vTitle:'该项')+'字符长度不能超过'+vi.substr(10) );
            }
            else if(!!vFuncNames[vi] && (typeof vFn[vi]=='function') && !vFn[vi](val) ) {
                return showErr((!!vTitle?vTitle:'该项')+'必须是'+vFuncNames[vi] );
            }
            for( op in vConditions) {
                if(op==vi.substr(0,vi.indexOf(':'))) {
                    var v2 = vi.substr(vi.indexOf(':')+1);
                    if(!checkCondition(val,op,v2)) {
                        return showErr((!!vTitle?vTitle:'该项')+'必须'+vConditions[op]+v2);
                    }
                }
            }

        }
    }
    obj.parent().removeClass('has-error');
    obj.tooltip('destroy');
    return true;
}