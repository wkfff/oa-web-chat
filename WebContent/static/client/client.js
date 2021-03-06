/*
 *  Licensed to the Apache Software Foundation (ASF) under one
 *  or more contributor license agreements.  See the NOTICE file
 *  distributed with this work for additional information
 *  regarding copyright ownership.  The ASF licenses this file
 *  to you under the Apache License, Version 2.0 (the
 *  "License"); you may not use this file except in compliance
 *  with the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

//等待窗口
var  waiting=null;
//

var server;
var port;
var jid;
var password;
var connection;
var isDisconnecting = false;

var connectionStatuses = {};
connectionStatuses[Strophe.Status.ERROR] = "ERROR";
connectionStatuses[Strophe.Status.CONNECTING] = "CONNECTING";
connectionStatuses[Strophe.Status.CONNFAIL] = "CONNFAIL";
connectionStatuses[Strophe.Status.AUTHENTICATING] = "AUTHENTICATING";
connectionStatuses[Strophe.Status.AUTHFAIL] = "AUTHFAIL";
connectionStatuses[Strophe.Status.CONNECTED] = "CONNECTED";
connectionStatuses[Strophe.Status.DISCONNECTED] = "DISCONNECTED";
connectionStatuses[Strophe.Status.DISCONNECTING] = "DISCONNECTING";
connectionStatuses[Strophe.Status.ATTACHED] = "ATTACHED";



var logger_win =null ;//日志窗口

var roster_win=null ;//联系人窗口

var tabs_manager =null ;//标签页管理器

//初始化客户端
function initComponent(){
	//$("#tabs").tabs();//对话框标签页
	
	//标签页
    $("#tabs").ligerTab({changeHeightOnResize:true,dragToMove:true,dblClickToClose:true});
    tabs_manager = $("#tabs").ligerGetTabManager();
	
	var buttons ={};//联系人按钮
	//buttons[locale.AddRoster]=addContact;//添加联系人按钮
	//buttons[locale.Disconnect]=disconnect;//断开连接按钮
	
	//联系人窗口
	/*
	$("#roster").dialog({
		autoOpen: false,
		buttons: buttons,//按钮设置
		closeOnEscape: false,
		width: 400,
		height: 250,
		position: ["right", "top"],
		title: locale.Roster,
		beforeclose: function() {return isDisconnecting;}
	});
    */
	
	//联系人窗口
	roster_win =$.ligerDialog.open({ 
		title:locale.Roster,  
		target: $("#roster") ,
		isResize:true ,
		width: 500,
		height: 300,
		modal:false,
		showMax: true,
		showToggle: true, 
		showMin: true,
		left: $(window).width() -550,
		top: 20,
		show :false,
		buttons:[
           {
	           text :locale.AddRoster ,onclick :addContactOnly //添加联系人按钮
           },
		   {
			   text :"邀请联系人" ,onclick :addContact //添加联系人按钮
		   },
		   {
			   text :"搜索" ,onclick :openSearch //添加联系人按钮
		   },
		   
		   {
			   text :locale.Disconnect  ,onclick :disconnect //断开连接按钮
		   },
		   
		   {
			   text :"清空日志"  ,onclick :function(){
				   $("#logger").empty();
			   }
		   },
		   
		   {
			   text :"群聊"  ,onclick :function(){
				   verifyMucChatTab("oa-room@chat."+getMyDomain());//打开群聊窗口
			   }
		   }
	    ]
		
	});
	

	//连接按钮
	$("#connect").click(function() {
		f_connect();//连接方法
	});
	
	//日志窗口
	logger_win =$.ligerDialog.open({ 
		title:"日志",  
		target: $("#logger") ,
		isResize:true ,
		width:800,
		height:300,
		modal:false,
		showMax: true,
		showToggle: true, 
		showMin: true,
		fixedType:'n'
	});
	
	
	//初始化联系人菜单
	init_roster_menu();
}

//连接XMPP
function f_connect(){
	$("#connect-form").hide();
	$("#workspace").show();
	
	roster_win.active();//恢复联系人窗口
	connect();//建立服务器的连接
	
	
}

function formatTime(val) {
	return val < 10 ? "0" + val : val;
}
//输出日志
function log(msg, xml) {
	
	var m = "[" + new DateFormat().format(new Date())+ "] " + msg;
	if (xml) {
		xml = xml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
		m += ": " + xml;
	}
	m += "<br/>";
	
	//输出日志到页面
	$("#logger").append(m);
	$("#logger").get(0).scrollTop = $("#logger").get(0).scrollHeight;
}
//输出日志
Strophe.log = function (level, msg) {
	if(typeof console != "undefined" && console.log) console.log(msg);
	
};
//连接
function connect() {
	server = $("#server").val();
	port = $("#port").val();
	contextPath = $("#boshContextPath").val();
	jid = $("#jid").val();
	password = $("#password").val();
	log("连接到 <b>" + server + ":" + port + "/" + contextPath + "</b> as <b>" + jid + "</b>...");
	//连接对象
	connection = new Strophe.Connection("http://" + server + ":" + port + "/" + contextPath);

	connection.connect(jid, password, function(status) {
		log("连接状态: " + connectionStatuses[status]);
		if (status === Strophe.Status.CONNECTED) {//已连接
			userConnected();
		} else if (status === Strophe.Status.DISCONNECTED) {//连接断开
			$("#workspace").hide();
			$("#connect-form").show();
			$("#logger").empty();
			
			roster_win.min();//隐藏联系人窗口
		}
	});
}
//用户连接
function userConnected() {
	getRoster();//取得联系人列表
	// handle received messages
	connection.addHandler(messageReceived, null, "message", "chat");//个人对话信息
	connection.addHandler(MucMessageReceived, null, "message", "groupchat");//分组对话信息
	// handle presence
	connection.addHandler(presenceReceived, null, "presence");	
	isDisconnecting = false;
	//$("#roster").dialog("open");	//打开联系人窗口
	roster_win.active();//恢复联系人窗口
	
	
	addMUC();//加入群聊流程开始
}

//去掉域名显示JID
function jid2id(_jid) {
	return Strophe.getBareJidFromJid(_jid).replace("@", "AT").replace(/\./g, "_");
}


//接收并显示信息
function messageReceived(msg) {
	log("已取得对话信息：", Strophe.serialize(msg));
	var _jid = $(msg).attr("from");
	
	verifyChatTab(_jid);
	
	var body = $(msg).find("> body");
	if (body.length === 1) {
		showMessage(jid2id(_jid), _jid, body.text());
	}
	return true;
}
//发送信息
function showMessage(tabId, authorJid, text) {
	var bareJid = Strophe.getBareJidFromJid(authorJid);
	//var chat = $("#chat" + tabId + " > div");
	var chatcontent =$(".l-tab-content > div[tabid ='chat"+tabId+"'] >div").first();//对话内容DIV
	
	if (chatcontent.length === 0) {
		return;
	}
	if(bareJid==jid)
	    chatcontent.append("<div style='padding:5px;color:blue;'><b>" + bareJid + "</b>: " + new DateFormat().format(new Date()) + "</div>");
	else
		chatcontent.append("<div style='padding:5px;color:green;'><b>" + bareJid + "</b>: " + new DateFormat().format(new Date()) + "</div>");
	
	chatcontent.append("<div style='padding:5px'>&nbsp;&nbsp;"+text+"</div>");
	chatcontent.get(0).scrollTop = chatcontent.get(0).scrollHeight;
	//$("#tabs").tabs("select", "#chat" + tabId);
	//选中一个tab
	tabs_manager.selectTabItem("chat" + tabId);
	
	//对话输入框焦点
	//$(".l-tab-content > div[tabid ='chat"+tabId+"']>textarea").focus();
}


//验证对话框
function verifyChatTab(_jid) {
	var id = jid2id(_jid);//JID
	var bareJid = Strophe.getBareJidFromJid(_jid);
	$("#tabs").show();
	
	var chat =$(".l-tab-content > div[tabid ='chat"+id+"']");
	if (chat.length === 0) {
		//$("#tabs").tabs("add", "#chat" + id, bareJid);
		//添加一个tab
		tabs_manager.addTabItem({tabid:"chat"+id,text :bareJid}); 
		
		//对话窗口
		chat =$(".l-tab-content > div[tabid ='chat"+id+"']");
		
		
		chat.append("<div style='height: 290px; margin-bottom: 10px; overflow: auto;'></div><textarea style='width: 100%;height:110px'/>");
		
		
		chat.append("<div style='width:100%;height:30px;text-align:right'> <a href='###' class='chatBox_closeButton'  onclick=\"closeTab('chat"+id+"')\" >关　闭</a></div>");
		
		chat.data("jid", _jid);
		/*
		$(".l-tab-content > div[tabid =chat'"+id+"']>textarea").keydown(function(event) {
			if (event.which === 13) {
				event.preventDefault();
				sendMessage($(this).parent().data("jid"), $(this).val());
				$(this).val("");
			}
		});
		*/
		KindEditor.create($(".l-tab-content > div[tabid =chat'"+id+"']>textarea")[0], {
			cssPath : window.basePath+'static/kindeditor/plugins/code/prettify.css',
			allowFileManager : false,
			items : [
			            'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
						'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
						'insertunorderedlist', '|', 'emoticons', 'image', 'link'
			],
			afterCreate : function() {
				var self = this;
				//ctrl+Enter 发送消息
				KindEditor.ctrl(self.edit.doc, 13, function() {
					self.sync();
					
					sendMessage($(self.srcElement).parent().data("jid"),self.html());
					
					self.html("");
					
				});
			}
		});
	}
	//$("#tabs").tabs("select", "#chat" + id);
	//选中一个tab
	tabs_manager.selectTabItem("chat" + id);
	
	//对话输入框焦点
	$(".l-tab-content > div[tabid =chat'"+id+"']>textarea").focus();
}
//关闭对话框
function closeTab(id){
	tabs_manager.removeTabItem(id);
}
//断开连接
function disconnect() {
	isDisconnecting = true;
	//$("#roster").dialog("close");
	roster_win.min();//隐藏联系人窗口
	$("#roster").empty();//清空联系人窗口
	
 	log("正在断开连接...");
	
 	//发送离线信息
	connection.send($pres({type: "unavailable"}));
	connection.flush();
	connection.disconnect();
}


//与某人对话
function chatWith(toJid) {
	log("正在与 " + toJid + "对话...");
	verifyChatTab(toJid);
}


//发送对话信息
function sendMessage(toJid, text) {
	showMessage(jid2id(toJid), jid, text);//显示对话信息框
    var msg = $msg({to: toJid, "type": "chat"}).c('body').t(text);
    
    
    //日志
    log("正在发送信息:", Strophe.serialize(msg));
    
    
    //发送信息
    connection.send(msg);
}


//接收消息包
function presenceReceived(presence) {
	log("取得在线信息:", Strophe.serialize(presence));
	var fromJid = $(presence).attr('from');
	var bareFromJid = Strophe.getBareJidFromJid(fromJid);
	var type = $(presence).attr('type');
	var id = jid2id(fromJid);
	if (type === "error") {
		alert("Received presence error!");
	} else if (type === "subscribe") {
		if (confirm(fromJid + " 想加你为好友,是否同意?")) {
			var pres = $pres({to: fromJid, type: "subscribed"});
			log("同意加为好友:", pres.toString());
			connection.send(pres);
			if ($("#roster > div[jid=" + id + "]").length === 0) {
				addToRoster(fromJid);
				pres = $pres({to: fromJid, type: "subscribe"});
				log("正在恢复好友申请..." + fromJid, pres.toString());
				connection.send(pres);
			}
		} else {
			var pres = $pres({to: fromJid, type: "unsubscribed"});
			log("拒绝好友邀请:", pres.toString());
			connection.send(pres);
		}
	} else if (bareFromJid !== jid) {
		var contact = $("#roster > div[jid=" + id + "]");
		var a= $("#roster > div[jid=" + id + "]>a");
		if (contact.length === 1) {
			var isOnline = contact.text().match(/.+\(online\)/);//是否在线显示
			if (isOnline && type === "unavailable") {
				a.text(bareFromJid + " ("+locale.offline+")");
			} else if (!isOnline && type !== "unavailable") {
				a.text(bareFromJid + " ("+locale.online+")");
				log("正在发送好友申请...", $pres().toString());
				connection.send($pres());
			}
		}
	}
	return true;
}


//添加联系人
function addContact() {
	var toJid = prompt("输入联系人JID:");//输入新的联系人
	var id = jid2id(toJid);
	if (toJid === null) {
		return;
	}
	if (toJid === jid) {//不能添加自己
		alert("不能添加自己为联系人!");
		return;
	}
	if ($("#roster > div[jid=" + id + "]").length > 0) {
		alert("JID 已经在你的联系人列表内!");
		return;
	}
	addToRoster(toJid);//添加联系人
	
	//添加联系人的日志
	var pres = $pres({to: toJid, type: "subscribe"});
	log("正在请求添加联系人... " + toJid, pres.toString());
	connection.send(pres);
}