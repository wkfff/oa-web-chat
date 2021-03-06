<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String contextPath = request.getContextPath();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript">

//this is needed by flXHR to automatically include its dependencies
window.basePath ="<%=request.getContextPath() %>";

if(window.flensed) window.flensed.base_path="<%=contextPath %>/static/resources/flxhr/";
</script>
<!-- kindeditor -->
<link rel="stylesheet" href="<%=contextPath %>/static/kindeditor/themes/default/default.css" />
<link rel="stylesheet" href="<%=contextPath %>/static/kindeditor/plugins/code/prettify.css" />
<script charset="utf-8" src="<%=contextPath %>/static/kindeditor/kindeditor.js"></script>
<script charset="utf-8" src="<%=contextPath %>/static/kindeditor/lang/zh_CN.js"></script>
<script charset="utf-8" src="<%=contextPath %>/static/kindeditor/plugins/code/prettify.js"></script>
<!--  -->

<link rel="stylesheet" type="text/css"
	href="<%=contextPath%>/static/skins/ligerui-icons.css" />
<link rel="stylesheet" type="text/css"
	href="<%=contextPath%>/static/skins/Aqua/css/ligerui-all.css" />
<link rel="stylesheet" type="text/css"
	href="<%=contextPath%>/static/skins/base.css" />

<script type="text/javascript" src="<%=contextPath %>/static/scripts/jquery-1.7.2.min.js"></script>





<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/core/base.js"></script>
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerAccordion.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerButton.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerCheckBox.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerComboBox.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerDateEditor.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerDialog.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerDrag.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerEasyTab.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerForm.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerGrid.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerLayout.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerMenu.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerMenuBar.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerMessageBox.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerNoSelect.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerRadio.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerResizable.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerSpinner.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerTab.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerTextBox.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerTip.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerToolBar.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerTree.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/ligerui/plugins/ligerWindow.js"></script> 
<script type="text/javascript" src="<%=contextPath%>/static/scripts/dateformat.js"></script> 

<script type="text/javascript" src="<%=contextPath %>/static/resources/flxhr/flensed.js"></script>



<script type="text/javascript" src="<%=contextPath %>/static/resources/flxhr/flXHR.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/resources/strophe/core.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/resources/strophe/base64.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/resources/strophe/md5.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/resources/strophe/strophe.flxhr.js"></script>

<script type="text/javascript" src="<%=contextPath %>/static/client/locale_zh.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/client/menu.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/client/vcard.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/client/client.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/client/search.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/client/roster.js"></script>
<script type="text/javascript" src="<%=contextPath %>/static/client/muc.js"></script>







<script type="text/javascript">
$(document).ready(function() {
	//初始化客户端
	initComponent();
	
	f_connect();//连接
	
	$(window).unload(function(){
		disconnect();//断开连接
	});
	
});
</script>
</head>
<body style="font-family: arial;">
<!-- 连接窗口 -->
	<div id="connect-form" style="margin: auto; width: 300px;" >
		<table>
			<tr>
				<td style='padding:5px'>Server</td>
				<!-- 服务器IP  -->
				<td style='padding:5px'><input type="text" id="server" value="<%=  request.getServerName()%>" />
				</td>
			</tr>
			<tr>
				<td style='padding:5px'>Port</td>
				<!--  bosh 端口 -->
				<td style='padding:5px'><input type="text" id="port" value="${requestScope.jabber_bosh_port}" />
				</td>
			</tr>
			<tr>
				<td style='padding:5px'>Context path</td>
				<td style='padding:5px'><input type="text" id="boshContextPath" value="bosh/" />
				</td>
			</tr>
			<tr>
				<td style='padding:5px'>JID</td>
				<td style='padding:5px'><input type="text" id="jid" value="${requestScope.jid}" />
				</td>
			</tr>
			<tr>
				<td style="style='padding:5px'">Password</td>
				<td style='padding:5px'><input type="password" id="password" value="${requestScope.j_password}" />
				</td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td style='padding:5px'><input type="button" id="connect" value="Connect"
					style="float: right; margin-top: 5px;" />
				</td>
			</tr>
		</table>
	</div>

	<div id="workspace" style="display: none;">

		
<!-- 对话 -->
		<div id="tabs" style=" border:1px solid #A3C0E8;width: 50%; height: 400px; display: none;">
			<ul></ul>
		</div>


		

	</div>
	
	
	<!-- 联系人窗口 -->
    <div id="roster" style="display:none;"></div>
    
    <!-- 日志 -->
	<div id="logger" style="display:none;"></div>
	
	
	<!-- vcard窗口 -->
    <div id="vcard_win"
		style="width: 400px; height: 300px; margin: 3px;  display: none;">
		<form id="vcard_form"></form>
    </div>
    
    <!-- jabber search窗口 -->
    <div id='search_win' style='width:800px;height:300px;display:none'>
        <table width="95%" height="90%">
            <tr>
              <td width="40%" valign="top" align="left">
                <table>
                  <tr>
                    <td>
                      <form id="search_form" ></form>
                    </td>
                  </tr>
                  <tr>
                    <td>
                        <div id="search_btn"></div>
                    </td>
                  </tr>
                </table>
              </td>
              
              <td width="60%" valign="top" align="left" rowspan="2">
              
                <div id='search_result_grid'></div>
              </td>
              
            
            </tr>
        </table>
    </div>
    
</body>
</html>
