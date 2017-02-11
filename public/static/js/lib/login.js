jQuery.support.cors = true; //<IE10
$.ajaxSetup({ global : true, cache : false, xhrFields: { withCredentials: true }, crossDomain: true});;
//登录页面
	$(document).ready(function(){
		$(".username").focus();
		$(".imglogo").width($(window).width());
		$(".imglogo").height($(window).height());
	});

	//重载验证码
	function fleshVerify(type){
		var timenow = new Date().getTime();
		if (type)
		{
			$("#verifyImg").src= '/home/index/code'+timenow;
		}else{
			$('#verifyImg').attr('src','/home/index/code'+timenow);
		}
	}

	//验证登入
	function checkLogin1(type){
		$('.login_msg').html('');
		var username = $.trim($('#username').val());
		if(username=='') 
		{
			$('.login_msg').html('用户名不能为空');
					$('#verify').val('');
					fleshVerify();
			return false;
		}

		var password = $('#password').val();
		if(password=='')
		{
			$('.login_msg').html('密码不能为空');
					$('#verify').val('');
					fleshVerify();                        
			return false;
		}
		var verify = $.trim($('#verify').val());
		if(verify=='') 
		{
			$('.login_msg').html('验证码不能为空');
					$('#verify').val('');
					fleshVerify();
			$(".login_code").focus();
			return false;
		}
		var post = {
			username:username,
			password:password,
			verify:verify
		}
		$.post('/home/index/checklogin',post,function(msg){
			msg = $.isPlainObject(msg)?msg:$.parseJSON(msg);
			var status = msg.status;
            if(!status) {
                $('.login_msg').html(msg.info);
                $('#verify').val('');
                fleshVerify();
            }
            else window.location.href='/';
		});
		return false;
	}
//登录页面结束
