/**
 * @Author : sqs3ng
 * @Timestamp : 2016-10-22
 */
var do_Notification = sm("do_Notification");
var do_Page = sm("do_Page");
var do_Global = sm("do_Global");
var do_Button_start = ui("do_Button_start");
var do_ProgressBar_1 = ui("do_ProgressBar_1");
var do_TextField_rows = ui("do_TextField_rows");
var do_TextField_cols = ui("do_TextField_cols");
var do_TextField_result = ui("do_TextField_result");
var do_CheckBox_jia = ui("do_CheckBox_jia");
var do_CheckBox_jian = ui("do_CheckBox_jian");
var do_CheckBox_cheng = ui("do_CheckBox_cheng");
var do_CheckBox_chu = ui("do_CheckBox_chu");
var do_TextField_num = ui("do_TextField_num");
var do_TextBox_word = ui("do_TextBox_word");
var do_Button_clear = ui("do_Button_clear");
var do_ALayout_explain = ui("do_ALayout_explain");

// 当前页面下，订阅android系统返回键的事件：3秒内连续点击两次退出应用
var canBack = false;
var delay3 = mm("do_Timer");
delay3.delay = 3000;
delay3.on("tick", function() {
	delay3.stop();
	canBack = false;
});
do_Page.on("back", function() {
	if (canBack) {
		do_Global.exit();
	} else {
		do_Notification.toast("再次点击退出应用");
		canBack = true;
		delay3.start();
	}
});

do_Button_start.on("touch", function() {
	if (isNaN(do_TextField_rows.text)) {
		sm("do_Notification").toast("行数请填写数字");
		return;
	}
	if (isNaN(do_TextField_cols.text)) {
		sm("do_Notification").toast("列数请填写数字");
		return;
	}
	if (isNaN(do_TextField_num.text)) {
		sm("do_Notification").toast("每行数量请填写数字");
		return;
	}
	if (isNaN(do_TextField_result.text)) {
		sm("do_Notification").toast("计算结果请填写数字");
		return;
	}
	do_Notification.toast("开始出题 ...");
	
	var rows=Number.parseInt(do_TextField_rows.text);
	var cols=Number.parseInt(do_TextField_cols.text);
	var num=Number.parseInt(do_TextField_num.text);
	var result=Number.parseInt(do_TextField_result.text);
	var counts=rows*cols;
	var marks=[];
	if (do_CheckBox_jia.checked) {
		marks.push("+");
	}
	if (do_CheckBox_jian.checked) {
		marks.push("-");
	}
	if (do_CheckBox_cheng.checked) {
		marks.push("*");
	}
	if (do_CheckBox_chu.checked) {
		marks.push("/");
	}
	if (marks.length==0) {
		do_Notification.toast("请先选择运算符号");
		return;
	};
	
	do_Button_start.enabled=false;
	do_ProgressBar_1.progress=0;
	
	//运算数量（几个数字进行运算）
	var init1,init2,init3,init4,init5,init6,init7,init8,init9;
	var init=[init1,init2,init3,init4,init5,init6,init7,init8,init9];
	init=init.slice(0,num);

	//运算符+-*/
	var initm1,initm2,initm3,initm4,initm5,initm6,initm7,initm8,initm9;
	var initmark=[initm1,initm2,initm3,initm4,initm5,initm6,initm7,initm8,initm9];
	initmark=initmark.slice(0,num-1);
	
	var oks=0;//计数
	do {
		//初始化随机数
		for (var y = 0; y < init.length; y++) {
			init[y]=Number.parseInt((Math.random()*(result+1)).toString());
			if (init[y]==0) {
				init[y]=Number.parseInt((Math.random()*(result+1)).toString());
			}
		}
		//初始化运算符
		for (var y = 0; y < initmark.length; y++) {
			initmark[y]=marks[Number.parseInt((Math.random()*(marks.length)).toString())];
		}

		//判断中间计算是否超过得数
		//先计算*/，再判断-
		var mathOK=true;
		for (var y = 0; y < initmark.length; y++) {
			//乘法
			if (initmark[y]=="*") {
				//数不超过9，1-9
				if (init[y]>9 || init[y+1]>9) {
					mathOK=false;
					continue;
				}
			}
			
			//除法
			if (initmark[y]=="/") {
				//被除数不超过9，1-9
				if (init[y+1]>9) {
					mathOK=false;
					continue;
				}else {
					//重新计算/之前的数，增加被整除的成功率
					init[y]=init[y+1]*Number.parseInt((Math.random()*9).toString());
				}
			}

			//计算*/结果
			if (initmark[y]=="*" ||initmark[y]=="/") {
				var tResult=eval(init[y]+initmark[y]+init[y+1]);
				if (tResult>result || tResult!=Number.parseInt(tResult.toString())) {
					//超过得数或者结果不是整数
					mathOK=false;
					continue;
				}
			}
			
			//如果减不是最后一个运算
			if (initmark[y]=="-" && y<initmark.length-1) {
				//如果减后面的运算不是*/
				if (initmark[y+1]!="*" && initmark[y+1]!="/") {
					var tResult=eval(init[y]+initmark[y]+init[y+1]);
					if (tResult<0) {
						//负数
						mathOK=false;
						continue;
					}
				}
			}
			//如果加不是最后一个运算
			if (initmark[y]=="+" && y<initmark.length-1) {
				//如果加后面的运算不是*/
				if (initmark[y+1]!="*" && initmark[y+1]!="/") {
					var tResult=eval(init[y]+initmark[y]+init[y+1]);
					if (tResult>=result) {
						//超过得数
						mathOK=false;
						continue;
					}
				}
			}
		}
		if (!mathOK) {
			//重新计算
			continue;
		}

		//构建计算
		var mathText="";
		for (var y = 0; y < init.length; y++) {
			mathText+=init[y].toString();
			if (y<init.length-1) {
				mathText+=initmark[y];
			}
		}
		
		//计算得数
		var tempResult=eval(mathText);
		if (tempResult>=0 && tempResult<=result && tempResult==Number.parseInt(tempResult.toString())) {
			do_TextBox_word.text+=mathText+"=";
			oks++;
			if (oks%cols==0) {
				do_TextBox_word.text+="\r";
			}else {
				do_TextBox_word.text+=" ";
			}

			do_ProgressBar_1.progress=oks/counts*100;
		}
	} while (oks<counts);
	
	do_Global.setToPasteboard(do_TextBox_word.text);
	do_Notification.toast("出题完毕，已复制成功！");
	do_Button_start.enabled=true;
	
});

//清空结果
do_Button_clear.on("touch", function() {
	do_TextBox_word.text="";
	do_ProgressBar_1.progress=0;
});

//详细操作说明
do_ALayout_explain.on("touch", function() {
	var explain="Word操作：\n";
	explain+="1、以文本方式粘贴。\n";
	explain+="2、全选试题。\n";
	explain+="3、找到将【文字转换成表格】，文字分隔位置选【空格】，确定。\n";
	explain+="4、调整表格、字体大小。\n";
	explain+="5、表格设置成无边框。\n";
	explain+="6、打印。\n";
	do_Notification.alert(explain);
});

