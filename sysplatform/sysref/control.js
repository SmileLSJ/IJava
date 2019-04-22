var __zIndex=1;
//add by chw start
var __USER_CHANGED_DT = new Set();
//add by chw end
function _$autoGenIndex(){
	return __zIndex++;
	
};
function _$setElementStyle(observer,className){
	if(observer.className!=className)observer.className=className;
	
};
function _$setElementImage(observer,imgPath){
	var oldPath=observer.src.substring(__SERVER_HOST.length);
	if(oldPath!=imgPath){
		var imageObj=_$getSysCacheImage(imgPath);
		observer.src=imageObj.src;
	}
	
};
function _$setElementBgImage(observer,imgPath){
	if(imgPath==""){
		observer.style.backgroundImage="url()";
		return;
	}

	var oldPath=observer.style.backgroundImage.substring(__SERVER_HOST.length+4,observer.style.backgroundImage.length-1);
	if(oldPath!=imgPath){
		var imageObj=_$getSysCacheImage(imgPath);
		observer.style.backgroundImage="url("+imageObj.src+")";
		
	}
};
function _$setElementShadow(observer,shadowEnabled){
	if(shadowEnabled){
		var shadowFilter='progid:DXImageTransform.Microsoft.Shadow(color="#C0C0C0",Direction=135,Strength=3)';
		observer.runtimeStyle.filter=observer.currentStyle.filter+' '+shadowFilter;
	}
	else{
		observer.runtimeStyle.filter=observer.currentStyle.filter;
	}
	
};
var __SysCacheImages=new HashList();
function _$getSysCacheImage(imgPath){
	var key=imgPath.replace(/\//g,"_").replace(/\./g,"_");
	var imageObj=__SysCacheImages.get(key);
	if(!imageObj){
		imageObj=new Image();
		imageObj.src=imgPath;
		__SysCacheImages.put(key, imageObj);
	}
	
	return imageObj;
};
_$registerFinalizeProcedure(function (){
	__SysCacheImages.clear();
	delete __SysCacheImages;
});


//��XML��ݵ���ȡ������������ݿ�
//����ListDropDown,radiogroup,checkboxgroup
function _$itemXmlIsland2Dataset(control){
	var dataset=KingfisherFactory.create("Dataset",control.getViewModel().getNamespace(),control.id+"_items");
	dataset.addField(control._valueField,"string");
	dataset.addField(control._labelField,"string");
	var xmlDoc=$("__"+control.id);
	if(xmlDoc!=null){
		var xmlRoot;
		if(browserType==__Browser_IE){
			xmlRoot=xmlDoc.documentElement;
			
		}else {
			xmlRoot=xmlDoc.getElementsByTagName("records")[0];
				
		};
		if(xmlRoot!=null){
			dataset._$parseRecordNodes(xmlRoot,true);
			
		}
	};
	return dataset;
};


var __RPC_AGENT=null;
function _$getRandomParam(){
	return (new Date()).getTime();
	
};
function _$remoteRequest(viewModel,action,type,xml,showLoadingTip,idcard){
	if(!action)return;
	
	var result;
//	alert(xml);	
	if(browserType==__Browser_IE){
		if(showLoadingTip){
			var rpcInfo=new Object();
			rpcInfo.action=action;
			rpcInfo.type=type;
			rpcInfo.xml=xml;
			rpcInfo.viewInstanceId=viewModel._instanceId;
			rpcInfo.clientType="feather3";
			rpcInfo.idcard = idcard;
			rpcInfo.rpc=false;
			result=showModalDialog(__SKIN_PATH+"/kf-agent.html",rpcInfo,"dialogHeight:"+_$getPreferenceSetting("__RPC_LoadingDialog_Height")+"px;dialogWidth: "+_$getPreferenceSetting("__RPC_LoadingDialog_Width")+"px;center:yes;help:no;resizable:yes;status:no");
			
		}else {
			var requestParams="rpc=true&type="+type+"&idcard="+idcard+"&viewInstanceId="+viewModel._instanceId+"&clientType=feather3"+"&xml="+escape(xml)+"&rd"+_$getRandomParam();
			var xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			xmlHttp.open("POST",action,false);
			xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xmlHttp.setRequestHeader("Pragma","no-cache");
			xmlHttp.send(requestParams);
			if(xmlHttp.readyState==4){
				if(xmlHttp.status == 200||xmlHttp.status==0){
					result=xmlHttp.responseText;
				}
				else{
					//������ʧ��ʱ���½�������ʾ������Ϣ
   				var w=window.open("");
   				w.document.write(xmlHttp.responseText);
  			}
			}
		}
		delete xmlHttp;
//		alert(result);
		var xmlDoc=new ActiveXObject("Msxml.DOMDocument");
		if(xmlDoc.loadXML(result)){
			return xmlDoc;
			
		}else {
			return null;
			
		}
	}else {
		if(showLoadingTip){
			var left=(window.screen.availWidth-parseInt(_$getPreferenceSetting("__RPC_LoadingDialog_Width")))/2;
			var top=(window.screen.availHeight-parseInt(_$getPreferenceSetting("__RPC_LoadingDialog_Height")))/2;
			__RPC_AGENT=window.open(__SKIN_PATH+"/kf-agent.html","_blank","directories=no,location=no,menubar=no,resizable=yes,scrollbars=no,status=no,titlebar=no,toolbar=no,top="+top+",left="+left+",width=260,height=100");
			__RPC_AGENT.focus();
			
		};
		try{
			var url=action+"?"+"rpc=false&type="+type+"&idcard="+idcard+"&viewInstanceId="+viewModel._instanceId+"&clientType=feather3"+"&xml="+escape(xml)+"&rd"+_$getRandomParam();
			var xmlDoc=document.implementation.createDocument("","",null);
			xmlDoc.async=false;
			xmlDoc.load(url);
			return xmlDoc;
			
		}finally{
			if(showLoadingTip&&__RPC_AGENT!=null){
				__RPC_AGENT.close();
				
			}
		}
	}
};
var __Processing_Amount=0;
function _$asyncRequest(viewModel,action,type,xml,showLoadingTip,idcard,asyncFunc){
//	alert(xml);
	if(browserType==__Browser_IE){
		var requestParams="rpc=true&type="+type+"&idcard="+idcard+
				"&viewInstanceId="+viewModel._instanceId+"&clientType=feather3"+"&xml="+escape(xml)+"&rd"+_$getRandomParam();
		var xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		xmlHttp.onreadystatechange=function (){
			if(xmlHttp.readyState==4){
				__Processing_Amount--;
				if(showLoadingTip)_$hideLoadingTip();
				if(xmlHttp.status == 200||xmlHttp.status==0){
					delete xmlHttp.onreadystatechange;
					var xmlDoc=new ActiveXObject("Msxml.DOMDocument");
					if(xmlDoc.loadXML(xmlHttp.responseText)){
						asyncFunc(true,xmlDoc);
						
					}
					else{
						alert("error");
						//������ʧ��ʱ���½�������ʾ������Ϣ
	   				var w=window.open("");
	   				w.document.write(xmlHttp.responseText);
					}
				}
				else{
					//������ʧ��ʱ���½�������ʾ������Ϣ
   				var w=window.open("");
   				w.document.write(xmlHttp.responseText);
  			}
				delete xmlHttp;
			}
		};
		xmlHttp.open("POST",action,true);
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Pragma","no-cache");
		xmlHttp.send(requestParams);
		
	}else {
		var url=action+"?"+"rpc=true&type="+type+"&idcard="+idcard+"&viewInstanceId="+viewModel._instanceId+"&clientType=feather3"+"&xml="+escape(xml)+"&rd"+_$getRandomParam();
		var xmlDoc=document.implementation.createDocument("","",null);
		xmlDoc.async=true;
		xmlDoc.onload=function (){
			__Processing_Amount--;			
			if(showLoadingTip)_$hideLoadingTip();
			delete xmlDoc.onload;
			asyncFunc(true,this);
			
		};
		xmlDoc.load(url);
		
	};
	if(showLoadingTip)_$showLoadingTip();
	__Processing_Amount++;
	
};
var __Loading_TIP_DIV=null;
function _$showLoadingTip(){
	if(__Loading_TIP_DIV==null){
		__Loading_TIP_DIV=$$("DIV");
		__Loading_TIP_DIV.style.display="none";
		__Loading_TIP_DIV.style.position="absolute";
		__Loading_TIP_DIV.innerHTML="<TABLE cellSpacing=\"8\"><TR><TD><IMG src=\""+__SKIN_PATH+"/loading.gif\"></TD>"+"<TD style=\"white-space: nowrap\">"+__LOADING_TIP+"</TD></TR></TABLE>";
		__Loading_TIP_DIV.className="LoadingTip";
		document.body.appendChild(__Loading_TIP_DIV);
		
	};
	__Loading_TIP_DIV.style.display="";
	var scrollLeft=document.body.scrollLeft;
	var scrollTop=document.body.scrollTop;
	var clientWidth=document.body.clientWidth;
	var clientHeight=document.body.clientHeight;
	var offsetWidth=__Loading_TIP_DIV.offsetWidth;
	var offsetHeight=__Loading_TIP_DIV.offsetHeight;
	__Loading_TIP_DIV.style.left=scrollLeft+(clientWidth-offsetWidth)/2;
	__Loading_TIP_DIV.style.top=scrollTop+(clientHeight-offsetHeight)/2;
	
};
function _$hideLoadingTip(){
	if(__Processing_Amount<=0&&__Loading_TIP_DIV!=null)__Loading_TIP_DIV.style.display="none";
	
};


var __Temp_Recording_InitFunction=null;
function _$initContainerObject(initChildren){
	if(typeof(initChildren)!="function")return ;
	if(__Temp_Recording_InitFunction==null)__Temp_Recording_InitFunction=initChildren;
	try{
		var objectArray=__View_Control_Resources._objectArray;
		var objCount=objectArray.length;		//������Ŀ//
		initChildren();
		if(initChildren==__Temp_Recording_InitFunction){
			var dataTables=new Array();
			for(var i=objCount;i<objectArray.length;i++){
				var observer=objectArray[i];
				if(observer._kingfisherClass=="DataTable"){
					dataTables.push(observer);
					
				}else {
					observer.activate();
					
				}
			};
			for(var i=0;i<dataTables.length;i++){
				dataTables[i].activate();
				
			}
		}
	}finally{
		__Temp_Recording_InitFunction=null;
		
	}
};


//**************************
//���Դ���//
//**************************
function _$DocumentDebugger(){
	this._logger=new Array();
	this._window=null;	
	this._editorLog=null;
	this._tabset=null;
	
};
_$DocumentDebugger.prototype.destroy=function (){
	this._window=null;
	this._editorLog=null;
	
};
_$DocumentDebugger.prototype.log=function (text){
	if(text==null){
		text="";
		
	}else {
		
	};
	this._logger.push(text);
	var editor=this._editorLog;
	if(editor!=null){
		if(editor.value==""){
			editor.value=text;
			
		}else {
			editor.value=editor.value+"\n"+text;
			
		}
	}
};
_$DocumentDebugger.prototype.clearLog=function (text){
	this._logger=new Array();
	if(this._editorLog!=null){
		this._editorLog.value="";
		
	}
};
_$DocumentDebugger.prototype.show=function (currentTab,exclusive){
	var subWindow=this._window;
	if(subWindow==null){
		subWindow=KingfisherFactory.create("SubWindow",null,null,__SubWindow_STATUS_HIDDEN);
		subWindow.setShowMinimizeButton(true);
		subWindow.setShowMaximizeButton(true);
		subWindow.setShowCloseButton(true);
		subWindow.setResizable(false);
//		subWindow.style.overflow="hidden";
		subWindow.style.width=440;
		subWindow.style.height=220;
		subWindow.setTitle("Kingfisher Client Debugger");
		subWindow.activate();
		
		var tabSet=KingfisherFactory.create("TabSet",null,"__debug_tabset");
		tabSet.setClosable(false);
		tabSet.style.height=220;		
		var contentContainer=tabSet;
		var div,html;
		var layout="table-layout: fixed";		
		div=$$("DIV");
		div.id=tabSet.id+"_evaluation";
		html="<TABLE style=\"width: 100%; height: 100%; "+layout+"\"><TR style=\"height: 100%\"><TD colSpan=2 style=\"height: 100%\">"+"<TEXTAREA id=\"__debug_editorScript\" style=\"width: 100%; height: 100%\"></TEXTAREA></TD><TR>"+"<TR><TD style=\"width: 100%\"><LABEL id=\"__debug_scriptResult\"></LABEL></TD><TD align=\"right\">"+"<BUTTON id=\"__debug_buttonExecute\" style=\"width: 80\">Execute</BUTTON></TD></TR></TABLE>";
		div.innerHTML=html;
		contentContainer.appendChild(div);
		div=$$("DIV");
		div.id=tabSet.id+"_log";
		html="<TABLE style=\"width: 100%; height: 100%; "+layout+"\"><TR><TD align=\"right\">"+"<BUTTON id=\"__debug_buttonClearLog\" style=\"width: 80\">Clear</BUTTON></TD></TR>"+"<TR style=\"height: 100%\"><TD style=\"height: 100%\">"+"<TEXTAREA id=\"__debug_editorLog\" style=\"width: 100%; height: 100%\"></TEXTAREA></TD><TR></TABLE>";
		div.innerHTML=html;
		contentContainer.appendChild(div);
		div=$$("DIV");
		div.id=tabSet.id+"_info";
		html="<TABLE width=\"100%\" border=\"1\" borderColor=\"#E0E0E0\" style=\"border-collapse: collapse\">"+"<TR><TD>Version: </TD><TD>Ver:5.00</TD></TR>"+"<TR><TD>Location: </TD><TD>"+location.href+"</TD></TR>"+"<TR><TD>Browser: </TD><TD>"+navigator.userAgent+"</TD></TR>"+"<TR><TD>Context: </TD><TD>"+__CONTEXT_PATH+"</TD></TR>"+"<TR><TD>Skin: </TD><TD>"+__SKIN_PATH+"</TD></TR>"+"</TABLE>";
		div.innerHTML=html;
		contentContainer.appendChild(div);
		subWindow.getContentContainer().appendChild(tabSet);
		document.body.appendChild(subWindow);

		var editorScript=KingfisherFactory.create("TextEditor",null,"__debug_editorScript");
		var editorLog=KingfisherFactory.create("TextEditor",null,"__debug_editorLog");
		var buttonExecute=KingfisherFactory.create("Button",null,"__debug_buttonExecute");
		EventManager.addKingfisherEvent(buttonExecute,"onClick",this._$debug);
		var buttonClearLog=KingfisherFactory.create("Button",null,"__debug_buttonClearLog");
		EventManager.addKingfisherEvent(buttonClearLog,"onClick",this._$cleanup);
		EventManager.addSystemEvent(editorScript,"onfocus",function (){
			$("__debug_scriptResult").innerText="";
			
		});
		tabSet.addTab(new Tab("evaluation","Evaluation"));
		tabSet.addTab(new Tab("log","Log"));
		tabSet.addTab(new Tab("info","Information"));		
		this._window=subWindow;
		this._editorLog=editorLog;
		
	}else {
		tabSet=$("__debug_tabset");
		
	};
	if(currentTab!=null){
		tabSet.setCurrentTab(currentTab);
		
	};
	subWindow.show(exclusive,true);
	tabSet.activate();
	this._editorLog.value=this._logger.join("\n");
	if(tabSet.getCurrentTab().getName()=="evaluation"){
		setTimeout("try { $(\"__debug_editorScript\").focus(); } catch(e) {}",0);
		
	}
};
_$DocumentDebugger.prototype._$debug=function (){
	var resultLabel=$("__debug_scriptResult");
	var beginDate=new Date();
	eval($("__debug_editorScript").value);
	var endDate=new Date();
	resultLabel.innerText=((endDate.getTime()-beginDate.getTime())/1000)+" sec.";
	
};
_$DocumentDebugger.prototype._$cleanup=function (){
	Debugger.clearLog();
	
};
var Debugger=new _$DocumentDebugger();
function _$DocumentDebugger_destroy(){
	Debugger.destroy();
	Debugger=null;
	
};
_$registerFinalizeProcedure(_$DocumentDebugger_destroy);



/**
Button Control
*/
function _$buildButton(id,viewModel){
	var button=null;
	if(id){
		button=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(button==null){
		button=$$("BUTTON");
		button.id=id;
		
	}
	if(!button.className)button.className="Button";
	_$setElementBgImage(button,__SKIN_PATH+"/button/secondary-enabled.gif");
	button._class=button.className;
	button.getId=_$Component_getId;
	button.destroy=_$Button_destroy;
	button.getViewModel=_$Component_getViewModel;
	button.isActive=_$Component_isActive;
	button._$activate=_$Component_activate;
	button.setVisible=_$Component_setVisible;
	button.isShowQuickHelp=_$Element_getShowQuickHelp;
	button.setShowQuickHelp=_$Element_setShowQuickHelp;
	button.getToolTip=_$Element_getToolTip;
	button.setToolTip=_$Element_setToolTip;
	button.getHelpDelay=_$Element_getHelpDelay;
	button.setHelpDelay=_$Element_setHelpDelay;
	button.activate=_$Button_activate;
	button.getTag=_$Element_getTag;
	button.setTag=_$Element_setTag;
	button.getContext=_$Element_getContext;
	button.setContext=_$Element_setContext;
	button.getValue=_$Button_getValue;
	button.setValue=_$Button_setValue;
	button.getCommand=_$Button_getCommand;
	button.setCommand=_$Button_setCommand;
	button.getMenu=_$Button_getMenu;
	button.setMenu=_$Button_setMenu;
	button.isAllowPushDown=_$Button_getAllowPushDown;
	button.setAllowPushDown=_$Button_setAllowPushDown;
	button.isDown=_$Button_getDown;
	button.setDown=_$Button_setDown;
	button.getDecorate=_$Button_getDecorate;
	button.setDecorate=_$Button_setDecorate;
	button.setDisabled=_$Button_setDisabled;
	button.getDisabled=_$Button_getDisabled;
	button.onFocus=_$Button_$onFocus;
	button._$refreshDecorate=_$Button_refreshDecorate;

	button.setEnabled=_$Button_setEnabled;		//����2.0
	button.isEnabled=_$Button_isEnabled;
	button._viewModel=viewModel;
	button.hideFocus=true;
	button._showQuickHelp=false;
	EventManager.addSystemEvent(button,"onclick",function (){
		_$Button_onClick(button);
		
	});
	EventManager.addSystemEvent(button,"onmousedown",function (){
		_$fireKingfisherEvent(button,"onMouseDown",[button]);
		
	});
	EventManager.addSystemEvent(button,"onmouseup",function (){
		_$fireKingfisherEvent(button,"onMouseUp",[button]);
		
	});
	EventManager.addSystemEvent(button,"onmouseenter",function (){
		_$fireKingfisherEvent(button,"onMouseEnter",[button]);
		
	});
	EventManager.addSystemEvent(button,"onmouseleave",function (){
		_$fireKingfisherEvent(button,"onMouseLeave",[button]);
		
	});
	if(button.hotKey)
		HotKeyManager.addHotKeyElement(button);
	
	button._command=null;	
	button._menu=null;
	button._allowPushDown=false;
	button._down=false;
	button._localize=true;
	return button;
	
};
KingfisherFactory._$registerComponentType("Button",_$buildButton);
function _$Button_destroy(){
	
};
function _$Button_activate(){
	this._$activate();
	
	if(this._toolTip)
		this.title=this._toolTip;
	if(this.hotKey){
		this.title=(this.title?this.title+" ": "")+"Ctrl+"+this.hotKey;
	};
	if(this._showQuickHelp && parseString(this.title)!=""){
    QuickHelp.add(new HelpItem(this, this.title, this._helpDelay));
	}

	if(this._decorate && !this._build){
		this._$refreshDecorate();
		this._build=true;
	}
};
function _$Button_refreshDecorate(){
	var decorate=this.firstChild;
	if(decorate&&decorate.tagName&&decorate.tagName=="IMG")
		_$setElementImage(decorate,this._decorate);
	else{
		//decorate=$$("<img align=\"absmiddle\" src=\""+this._decorate+"\" style=\"margin-right: 4px\">");
		decorate = $$("img");
		decorate.align = "absmiddle";
		decorate.src = this._decorate;
		decorate.style.marginRight = "4px";
		this.insertAdjacentElement("afterbegin", decorate);
	}
	if(this.disabled)
		decorate.style.filter="gray";
	else
		decorate.style.filter="";
}
function _$Button_$onFocus(){
	if(!this.disabled){
		try{
			this.focus();
		}
		catch(e){
		}
	}
	
};
function _$Button_getValue(){
	return this._value;
	
};
function _$Button_setValue(value){
	this._value=value;
	var key="";
	if(this.accessKey)	key="(<u>" + this.accessKey + "</u>)";
	if(this.hotKey)	key="(<u>" + this.hotKey + "</u>)";
	this.innerHTML=value+key;
	
};
function _$Button_getCommand(){
	return kingfisher.feather.getControl(this._command);
	
};
function _$Button_setCommand(command){
	this._command=command;
	
};
function _$Button_getMenu(){
	return kingfisher.feather.getControl(this._menu);
	
};
function _$Button_setMenu(menu){
	this._menu=menu;
	
	var buttonType=parseInt(_$getPreferenceSetting("__Button_Type",1));
	if(buttonType==2){
		if(menu){
			var buttonHolder=this._buttonHolder;
			if(buttonHolder==null){
				var tr,td,holderTd;
				tr=$$("TR");				
				td=$$("TD");
				tr.appendChild(td);
				var buttonHolder=$$("BUTTON");
				this._buttonHolder=buttonHolder;
				buttonHolder.style.width=12;
				buttonHolder.hideFocus=true;
				buttonHolder.innerHTML="<IMG src=\""+__SKIN_PATH+"/button/indicator.gif\" "+"style=\"border-style: none\">";
				var button=this;
				EventManager.addSystemEvent(buttonHolder,"onclick",function (){
					var menu=button.getMenu();
					if(menu!=null){
					var box=menu._$getPopupMenu(menu._topItem);
						if(box!=null){
							box.show();
							menu._$locatePopupMenu(box,button,"buttonHolder");
							box._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",1000);
							
						}
						
					}
				});
				holderTd=$$("TD");
				tr.appendChild(holderTd);
				var tbody=$$("TBODY");
				tbody.appendChild(tr);
				var table=$$("TABLE");
				table.appendChild(tbody);
				table.cellPadding=0;
				table.cellSpacing=0;
				table.className=this.className+"Holder";
				var parentNode=this.parentNode;
				if(parentNode!=null){
					parentNode.replaceChild(table,this);
					td.appendChild(this);
					holderTd.appendChild(buttonHolder);
					this.className="";
					
				}else {
					alert("Error Code: 000125!");
					
				}
			}
		}else {
			this.innerText=this.getValue();
			this._buttonHolder=null;
			
		}
	}
};
function _$Button_getAllowPushDown(){
	return this._allowPushDown;
	
};
function _$Button_setAllowPushDown(allowPushDown){
	this._allowPushDown=allowPushDown;
	if(!allowPushDown)this.setDown(false);
	
};
function _$Button_getDown(){
	return this._down;
	
};
function _$Button_setDown(down){
	if(this._allowPushDown||!down){
		this._down=down;
		_$setElementStyle(this,(down)?(this._class+"_Down"):(this._class));
		
	}
};
function _$Button_getDecorate(){
	return this._decorate;
	
};
function _$Button_setDecorate(decorate){
//	if(!decorate) return;
//	if(decorate.substr(0,1)!="/"){
//		decorate=__CONTEXT_PATH+'/'+decorate;
		
//	};
	this._decorate=decorate;
	
	if(this._decorate && this._build){
		this._$refreshDecorate();
	}
	
};
function _$Button_getDisabled() {
	return this.disabled;
};

function _$Button_setDisabled(disabled) {
	this.disabled=disabled;
	if(this._decorate && this._build){
		this._$refreshDecorate();
	}
};
function _$Button_onClick(button){
	if(button._allowPushDown)button.setDown(!button.isDown());	
	if(button._onClick!=null&&!_$fireKingfisherEvent(button,"onClick",[button])){
		return ;
		
	};
	var command=button.getCommand();
	if(command!=null){
		command.execute();
		
	}else {
		var buttonType=parseInt(_$getPreferenceSetting("__Button_Type",1));
		if(buttonType==1){
			var menu=button.getMenu();
			if(menu!=null){
			var box=menu._$getPopupMenu(menu._topItem);
				if(box!=null){
					box.show();
					menu._$locatePopupMenu(box,button,"button");
					box._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",1000);
					
				}
				
			}
		}
	}
};


//**************************
//�ָ�ؼ�
//**************************
var __NonIE_WINDOW_CURTAIN=null;
function _$getWindowCurtain(){
	if(__NonIE_WINDOW_CURTAIN==null){
		var div=$$("DIV");
		div.style.position="absolute";
		div.style.left=0;
		div.style.top=0;
		div.style.display="none";
		document.body.appendChild(div);
		__NonIE_WINDOW_CURTAIN=div;
		
	};
	__NonIE_WINDOW_CURTAIN.style.width=document.body.scrollWidth;
	__NonIE_WINDOW_CURTAIN.style.height=document.body.scrollHeight;
	__NonIE_WINDOW_CURTAIN.style.zIndex=_$autoGenIndex();
	return __NonIE_WINDOW_CURTAIN;
	
};
var __SplitPanel_ORIENTA_HORIZONTAL="horizontal";
var __SplitPanel_ORIENTA_VERTICAL="vertical";
var __SplitPanel_NOTHING_BUTTON_SIZE=4;
var __SplitPanel_HAS_BUTTON_SIZE=6;
var __SplitPanel_BUTTON_WIDTH=7;
var __SplitPanel_POSITION=200;
function _$buildSplitPanel(id,viewModel,orientation){
	var splitPanel=null;	
	if(id){
		splitPanel=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(orientation!=__SplitPanel_ORIENTA_VERTICAL){
		orientation=__SplitPanel_ORIENTA_HORIZONTAL;
		
	};
	if(splitPanel==null){
		splitPanel=$$("TABLE");
		splitPanel.id=id;
		var tbody=$$("TBODY");
		var row,cell,div;
		if(orientation==__SplitPanel_ORIENTA_VERTICAL){
			row=$$("TR");
			cell=$$("TD");
			row.appendChild(cell);
			tbody.appendChild(row);
			row=$$("TR");
			cell=$$("TD");
			row.appendChild(cell);
			tbody.appendChild(row);
			row=$$("TR");
			cell=$$("TD");
			row.appendChild(cell);
			tbody.appendChild(row);
			
		}else {
			row=$$("TR");
			cell=$$("TD");
			row.appendChild(cell);
			cell=$$("TD");
			row.appendChild(cell);
			cell=$$("TD");
			row.appendChild(cell);
			tbody.appendChild(row);
			
		};
		splitPanel.appendChild(tbody);
		
	};
	splitPanel.getId=_$Component_getId;
	splitPanel.getViewModel=_$Component_getViewModel;
	splitPanel.isActive=_$Component_isActive;
	splitPanel.activate=_$SplitPanel_activate;
	splitPanel.destroy=_$SplitPanel_destroy;	
	splitPanel.getTag=_$Element_getTag;
	splitPanel.setTag=_$Element_setTag;
	splitPanel.getContext=_$Element_getContext;
	splitPanel.setContext=_$Element_setContext;
	splitPanel.getOrientation=_$SplitPanel_getOrientation;
	splitPanel.getPadding=_$SplitPanel_getPadding;
	splitPanel.setPadding=_$SplitPanel_setPadding;
	splitPanel.isShowButtons=_$SplitPanel_getShowButtons;
	splitPanel.setShowButtons=_$SplitPanel_setShowButtons;
	splitPanel.isDraggable=_$SplitPanel_getDraggable;
	splitPanel.setDraggable=_$SplitPanel_setDraggable;
	splitPanel.getPosition=_$SplitPanel_getPosition;
	splitPanel.setPosition=_$SplitPanel_setPosition;
	splitPanel._$paint=_$SplitPanel_paint;
	splitPanel._$getDraggingCursor=_$SplitPanel_getDraggingCursor;
	splitPanel._$redispose=_$SplitPanel_redispose;
	splitPanel._viewModel=viewModel;
	splitPanel._orientation=orientation;
	splitPanel._padding=1;
	splitPanel._showButtons=true;
	splitPanel._draggable=true;
	splitPanel._position=__SplitPanel_POSITION;
	return splitPanel;
	
};
KingfisherFactory._$registerComponentType("SplitPanel",_$buildSplitPanel);
function _$SplitPanel_destroy(){
	this._upLeftSection=null;
	if(this._splitter!=null)this._splitter._splitPanel=null;
	this._splitter=null;
	this._btnUpLeft=null;
	this._btnDownRight=null;
	this._downRightSection=null;
	
};
function _$SplitPanel_activate(){
	if(!this._active){
		this._$paint();
		this.setPosition(this._position);
		this._active=true;
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$SplitPanel_getOrientation(){
	return this._orientation;
	
};
function _$SplitPanel_getPadding(){
	return this._padding;
	
};
function _$SplitPanel_setPadding(padding){
	this._padding=padding;
	
};
function _$SplitPanel_getShowButtons(){
	
	return this._showButtons;
	
};
function _$SplitPanel_setShowButtons(showButtons){
	this._showButtons=showButtons;
	
};
function _$SplitPanel_getDraggable(){
	return this._draggable;
	
};
function _$SplitPanel_setDraggable(draggable){
	this._draggable=draggable;
	
};
function _$SplitPanel_getPosition(){
	return this._position;
	
};
function _$SplitPanel_setPosition(position){
	this._position=position;
	if(this._upLeftSection){
		if(this._orientation==__SplitPanel_ORIENTA_VERTICAL){
			if(position=="100%"){
				this._status=1;
				this._downRightSection.style.height=0;
				
			}else if(position==0){
				this._status=2;
				this._downRightSection.style.height="100%";
				
			}else {
				this._status=0;
				this._downRightSection.style.height="";
				
			};
			this._upLeftSection.style.height=position;
			
		}else {
			if(position=="100%"){
				this._status=1;
				this._downRightSection.style.width=0;
				
			}else if(position==0){
				this._status=2;
				this._downRightSection.style.width="100%";
				
			}else {
				this._status=0;
				this._downRightSection.style.width="";
				
			};
			this._upLeftSection.style.width=position;
			
		};
		if(this._showButtons){
			if(position==0){
				
				this._btnUpLeft._disabled=true;
				this._btnDownRight._disabled=false;
				
			}else if(position=="100%"){
				this._btnUpLeft._disabled=false;
				this._btnDownRight._disabled=true;
				
			}else {
				this._btnUpLeft._disabled=false;
				this._btnDownRight._disabled=false;
				
			};
			var src,button;
			button=this._btnUpLeft;
			src=(button._disabled)?button._vertHoriDisabledIcon:button._vertHoriIcon;
			_$setElementImage(button,src);
			button=this._btnDownRight;
			src=(button._disabled)?button._vertHoriDisabledIcon:button._vertHoriIcon;
			_$setElementImage(button,src);
			
		};
		_$Window_onResize();
		
	}
};
function _$SplitPanel_paint(){
	function _$buildButton(splitPanel){
		var button=$$("IMG");
		_$setElementStyle(button,splitPanel._class+"_Button");
		EventManager.addSystemEvent(button,"onclick",function (){
			_$SplitPanel$Button_onClick(splitPanel,button);
			
		});
		return button;
		
	};
	function _$buildSplitPanel$ButtonArea(splitPanel){
		var table=$$("TABLE");
		table.cellPadding=0;
		table.cellSpacing=0;
		var tbody=$$("TBODY");
		var row,cell;
		_$setElementStyle(table,splitPanel._class+"_ButtonArea");
		if(splitPanel._orientation==__SplitPanel_ORIENTA_VERTICAL){
			row=$$("TR");
			cell=$$("TD");
			cell.style.width=6;
			row.appendChild(cell);			
			cell=$$("TD");
			row.appendChild(cell);
			var btnLeftUp=_$buildButton(splitPanel);
			btnLeftUp._kingfisherClass="SplitPanelButton_UpLeft";
			btnLeftUp._vertHoriIcon=__SKIN_PATH+"/splitpanel/button_vert1.gif";
			btnLeftUp._vertHoriDisabledIcon=__SKIN_PATH+"/splitpanel/button_vert1_disabled.gif";
			btnLeftUp.style.width=__SplitPanel_BUTTON_WIDTH;
			splitPanel._btnUpLeft=btnLeftUp;
			cell.appendChild(btnLeftUp);
			cell=$$("TD");
			cell.style.width=6;
			row.appendChild(cell);
			cell=$$("TD");
			var btnRightDown=_$buildButton(splitPanel);
			btnRightDown._kingfisherClass="SplitPanelButton_DownRight";
			btnRightDown._vertHoriIcon=__SKIN_PATH+"/splitpanel/button_vert2.gif";
			btnRightDown._vertHoriDisabledIcon=__SKIN_PATH+"/splitpanel/button_vert2_disabled.gif";
			btnRightDown.style.width=__SplitPanel_BUTTON_WIDTH;
			splitPanel._btnDownRight=btnRightDown;
			cell.appendChild(btnRightDown);
			row.appendChild(cell);
			cell=$$("TD");
			cell.style.width=6;
			row.appendChild(cell);
			tbody.appendChild(row);
			
		}else {
			row=$$("TR");
			row.style.height=6;
			cell=$$("TD");
			row.appendChild(cell);
			tbody.appendChild(row);
			row=$$("TR");
			cell=$$("TD");
			var btnLeftUp=_$buildButton(splitPanel);
			btnLeftUp._vertHoriIcon=__SKIN_PATH+"/splitpanel/button_hori1.gif";
			btnLeftUp._vertHoriDisabledIcon=__SKIN_PATH+"/splitpanel/button_hori1_disabled.gif";
			btnLeftUp._kingfisherClass="SplitPanelButton_UpLeft";
			btnLeftUp.style.height=__SplitPanel_BUTTON_WIDTH;
			splitPanel._btnUpLeft=btnLeftUp;
			cell.appendChild(btnLeftUp);
			row.appendChild(cell);
			tbody.appendChild(row);
			row=$$("TR");
			row.style.height=6;
			cell=$$("TD");			
			row.appendChild(cell);
			tbody.appendChild(row);
			row=$$("TR");
			cell=$$("TD");
			var btnRightDown=_$buildButton(splitPanel);
			btnRightDown._kingfisherClass="SplitPanelButton_DownRight";
			btnRightDown._vertHoriIcon=__SKIN_PATH+"/splitpanel/button_hori2.gif";
			btnRightDown._vertHoriDisabledIcon=__SKIN_PATH+"/splitpanel/button_hori2_disabled.gif";
			btnRightDown.style.height=__SplitPanel_BUTTON_WIDTH;
			splitPanel._btnDownRight=btnRightDown;
			cell.appendChild(btnRightDown);
			row.appendChild(cell);
			tbody.appendChild(row);
			row=$$("TR");
			row.style.height=6;
			cell=$$("TD");
			row.appendChild(cell);
		};
			tbody.appendChild(row);
			
		table.appendChild(tbody);
		EventManager.addSystemEvent(table,"onmousedown",function (){
			event.cancelBubble=true;
			
		});
		return table;
		
	};
	function _$buildSplitPanel$Splitter(splitPanel){
		var table=$$("TABLE");
		_$setElementStyle(table,splitPanel._class+"_Splitter");
		table.cellPadding=0;
		table.cellSpacing=0;
		table.style.width="100%";
		table.style.height="100%";
		table.border=_$getPreferenceSetting("__SplitPanel_Splitter_BorderWidth");
		table.borderColor=_$getPreferenceSetting("__SplitPanel_Splitter_BorderColor");
		var tbody=$$("TBODY");
		var row=$$("TR");
		var cell=$$("TD");
		cell.align="center";
		cell.valign="center";
		if(splitPanel._showButtons){
			cell.appendChild(_$buildSplitPanel$ButtonArea(splitPanel));
			
		};
		row.appendChild(cell);
		tbody.appendChild(row);
		table.appendChild(tbody);		
		return table;
		
	};
	this.cellPadding=this._padding;
	this.cellSpacing=0;
	this.style.tableLayout="fixed";
	var tbody=this.tBodies[0];
	var upleftSection,downrightSection,splitBar,splitter;
	var size=(this._showButtons)?__SplitPanel_HAS_BUTTON_SIZE:__SplitPanel_NOTHING_BUTTON_SIZE;
	if(this._orientation==__SplitPanel_ORIENTA_VERTICAL){
		if(!this.className)this.className="SplitPanel_Vert";
		this._class=this.className;
		upleftSection=tbody.rows[0].cells[0];
		this._upLeftSection=upleftSection;
		splitter=_$buildSplitPanel$Splitter(this);
		splitBar=tbody.rows[1].cells[0];
		splitBar.style.height=size+this._padding*2;
		splitBar.appendChild(splitter);
		if(this._draggable){
			splitter.style.cursor="n-resize";
			
		};
		this._splitter=splitter;
		downrightSection=tbody.rows[2].cells[0];
		this._downRightSection=downrightSection;
		
	}else {
		if(!this.className)this.className="SplitPanel_Hori";
		this._class=this.className;
		upleftSection=tbody.rows[0].cells[0];
		this._upLeftSection=upleftSection;
		splitter=_$buildSplitPanel$Splitter(this);
		splitBar=tbody.rows[0].cells[1];
		splitBar.style.width=size+this._padding*2;
		splitBar.appendChild(splitter);
		if(this._draggable){
			splitter.style.cursor="e-resize";
			
		};
		this._splitter=splitter;
		downrightSection=tbody.rows[0].cells[2];
		this._downRightSection=downrightSection;
		
	};
	upleftSection.vAlign="top";
	downrightSection.vAlign="top";	
	downrightSection.style.width="100%";
	downrightSection.style.height="100%";
	splitter._splitPanel=this;
	EventManager.addSystemEvent(splitter,"onclick",function (){
		_$SplitPanel$Splitter_onClick(splitter);
		
	});
	EventManager.addSystemEvent(splitter,"onmousemove",function (){
		_$SplitPanel$Splitter_onMouseMove(splitter);
		
	});
	EventManager.addSystemEvent(splitter,"onmousedown",function (){
		_$SplitPanel$Splitter_onMouseDown(splitter);
		event.returnValue=false;
		event.cancelBubble=true;
		
	});
	if(browserType==__Browser_IE){
		EventManager.addSystemEvent(splitter,"onmouseup",function (){
			_$SplitPanel$Splitter_onMouseUp(splitter);
			
		});
		
	}
};
var __SplitPanel_DRAGGING_CURSOR=null;
function _$SplitPanel_getDraggingCursor(){
	var cursor=__SplitPanel_DRAGGING_CURSOR;
	if(cursor==null){
		cursor=$$("IMG");
		_$setVisible(cursor,false);
		_$setElementStyle(cursor,this._class+"_DraggingCursor");
		document.body.appendChild(cursor);
		__SplitPanel_DRAGGING_CURSOR=cursor;
		
	};
	cursor.style.zIndex=_$autoGenIndex();
	return cursor;
	
};
function _$SplitPanel_redispose(){
	var x,y;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		y=event.clientY+document.body.scrollTop;
		
	}else {
		x=event.pageX;
		y=event.pageY;
		
	}
	var cursor=this._$getDraggingCursor();
	var absPos=_$getAbsolutePosition(this._splitter);
	var ctlPos=_$getAbsolutePosition(this);
	if(this._orientation==__SplitPanel_ORIENTA_VERTICAL){
		var top=absPos[1]+(y-this._yPosition);
		if(top>=ctlPos[1]&&top<=ctlPos[1]+this.offsetHeight){
			cursor.style.top=top;
			
		}
	}else {
		var left=absPos[0]+(x-this._xPosition);
		if(left>=ctlPos[0]&&left<=ctlPos[0]+this.offsetWidth){
			cursor.style.left=left;
			
		}
	}
};
function _$SplitPanel$Splitter_onClick(splitter){
	var splitPanel=splitter._splitPanel;
	if(splitPanel._orientation==__SplitPanel_ORIENTA_VERTICAL){
		if(splitPanel._status==2){
			splitPanel.setPosition(splitPanel._oldPos);
			
		}else {
			splitPanel._oldPos=splitPanel._upLeftSection.offsetHeight;
			splitPanel.setPosition(0);
			
		}
	}else {
		if(splitPanel._status==2){
			splitPanel.setPosition(splitPanel._oldPos);
			
		}else {
			splitPanel._oldPos=splitPanel._upLeftSection.offsetWidth;
			splitPanel.setPosition(0);
			
		}
	};
	if(browserType==__Browser_IE){
		splitter.releaseCapture();
		
	}else {
		EventManager._$removeSystemEvent(window,"onmousemove",_$SplitPanel$Splitter_NonIE_onMouseMove,true);
		EventManager._$removeSystemEvent(window,"onmouseup",_$SplitPanel$Splitter_NonIE_onMouseUp,true);
		__NonIE_SPLITPANEL_SPLITTER=null;
		
	};
	splitPanel._xPosition=-1;
	splitPanel._yPosition=-1;
	splitPanel._mouseMoving=false;
	
};
function _$SplitPanel$Splitter_onMouseMove(splitter){
	
	var splitPanel=splitter._splitPanel;
	if(splitPanel._mouseMoving){
		splitPanel._$redispose();
		
	}else {
		var x,y;
		if(browserType==__Browser_IE){
			x=event.clientX+document.body.scrollLeft;
			y=event.clientY+document.body.scrollTop;
			
		}else {
			x=event.pageX;
			y=event.pageY;
			
		};
		if(splitPanel._xPosition>=0&&splitPanel._yPosition>=0&&(Math.abs(splitPanel._xPosition-x)>2||Math.abs(splitPanel._yPosition-y)>2)){
			if(browserType!=__Browser_IE){
				_$setDisplay(_$getWindowCurtain(),true);
				
			};
			var cursor=splitPanel._$getDraggingCursor();
			var absPos=_$getAbsolutePosition(splitter);
			cursor.style.left=absPos[0];
			cursor.style.top=absPos[1];
			cursor.style.width=splitter.offsetWidth;
			cursor.style.height=splitter.offsetHeight;
			_$setVisible(cursor,true);
			splitPanel._mouseMoving=true;
			
		}
	}
};
function _$SplitPanel$Splitter_onMouseDown(splitter){
	var splitPanel=splitter._splitPanel;
	if(!splitPanel._draggable){
		return ;
		
	};
	var mouseButton;
	var targ;
	if(browserType==__Browser_IE){
		mouseButton=event.button;
		targ=event.srcElement;
		targ.unselectable=true;
		
	}else {
		mouseButton=event.which;
		targ=event.target;
		targ.style.MozUserSelect="none";
		
	}
	if(mouseButton!=1)return ;
	if(!splitPanel._mouseMoving){
		var x,y;
		if(browserType==__Browser_IE){
			x=event.clientX+document.body.scrollLeft;
			y=event.clientY+document.body.scrollTop;
			splitter.setCapture(true);
			
		}else {
			x=event.pageX;
			y=event.pageY;
			__NonIE_SPLITPANEL_SPLITTER=splitter;
			EventManager.addSystemEvent(window,"onmousemove",_$SplitPanel$Splitter_NonIE_onMouseMove,true);
			EventManager.addSystemEvent(window,"onmouseup",_$SplitPanel$Splitter_NonIE_onMouseUp,true);
			
		};
		splitPanel._xPosition=x;
		splitPanel._yPosition=y;
		
	}
};
function _$SplitPanel$Splitter_onMouseUp(splitter){
	var mouseButton;
	if(browserType==__Browser_IE){
		mouseButton=event.button;
		
	}else {
		mouseButton=event.which;
		
	};
	if(mouseButton!=1)return ;
	var splitPanel=splitter._splitPanel;
	if(!splitPanel._mouseMoving){
		return ;
		
	};
	var x,y;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		y=event.clientY+document.body.scrollTop;
		
	}else {
		x=event.pageX;
		y=event.pageY;
		
	};
	var upleftSection=splitPanel._upLeftSection;
	var absPos=_$getAbsolutePosition(splitter);
	if(splitPanel._orientation==__SplitPanel_ORIENTA_VERTICAL){
		var height=upleftSection.offsetHeight+(y-splitPanel._yPosition);
		if(height>=0&&height<=splitPanel.offsetHeight){
			splitPanel.setPosition(height);			
			
		}
	}else {
		var width=upleftSection.offsetWidth+(x-splitPanel._xPosition);
		if(width>=0&&width<=splitPanel.offsetWidth){
			splitPanel.setPosition(width);
			
		}
	};
	var cursor=splitPanel._$getDraggingCursor();
	_$setVisible(cursor,false);
	if(browserType==__Browser_IE){
		splitter.releaseCapture();
		
	}else {
		EventManager._$removeSystemEvent(window,"onmousemove",_$SplitPanel$Splitter_NonIE_onMouseMove,true);
		EventManager._$removeSystemEvent(window,"onmouseup",_$SplitPanel$Splitter_NonIE_onMouseUp,true);
		__NonIE_SPLITPANEL_SPLITTER=null;
		if(browserType!=__Browser_IE){
			_$setDisplay(_$getWindowCurtain(),false);
			
		}
	};
	splitPanel._xPosition=-1;
	splitPanel._yPosition=-1;
	splitPanel._mouseMoving=false;
	
};
function _$SplitPanel$Button_onClick(splitPanel,button){
	if(splitPanel._orientation==__SplitPanel_ORIENTA_VERTICAL){
		if(button._kingfisherClass=="SplitPanelButton_UpLeft"){
			if(splitPanel._downRightSection.offsetHeight<=1){
				splitPanel.setPosition(splitPanel._oldPos);
				
			}else if(splitPanel._upLeftSection.offsetHeight>1){
				splitPanel._oldPos=splitPanel._upLeftSection.offsetHeight;
				splitPanel.setPosition(0);
				
			}
		}else {
			if(splitPanel._upLeftSection.offsetHeight<=1){
				splitPanel.setPosition(splitPanel._oldPos);
				
			}else if(splitPanel._downRightSection.offsetHeight>1){
				splitPanel._oldPos=splitPanel._upLeftSection.offsetHeight;
				splitPanel.setPosition("100%");
				
			}
		}
	}else {
		if(button._kingfisherClass=="SplitPanelButton_UpLeft"){
			
			if(splitPanel._downRightSection.offsetWidth<=1){
				splitPanel.setPosition(splitPanel._oldPos);
				
			}else if(splitPanel._upLeftSection.offsetWidth>1){
				splitPanel._oldPos=splitPanel._upLeftSection.offsetWidth;
				splitPanel.setPosition(0);
				
			}
		}else {
			if(splitPanel._upLeftSection.offsetWidth<=1){
				splitPanel.setPosition(splitPanel._oldPos);
				
			}else if(splitPanel._downRightSection.offsetWidth>1){
				splitPanel._oldPos=splitPanel._upLeftSection.offsetWidth;
				splitPanel.setPosition("100%");
				
			}
		}
	};
	event.cancelBubble=true;
	
};
var __NonIE_SPLITPANEL_SPLITTER=null;
function _$SplitPanel$Splitter_NonIE_onMouseUp(){
	_$SplitPanel$Splitter_onMouseUp(__NonIE_SPLITPANEL_SPLITTER);
	
};
function _$SplitPanel$Splitter_NonIE_onMouseMove(){
	_$SplitPanel$Splitter_onMouseMove(__NonIE_SPLITPANEL_SPLITTER);
	
};


//**************************
//�Ӵ��ڿؼ�
//**************************
var __SubWindow_STACK=new Collection();
var __SubWindow_EXCLUSIVE_COVERING=null;
function _$getExclusiveCovering(){
	if(__SubWindow_EXCLUSIVE_COVERING==null){
		var div=$$("DIV");
		div.className="SubWindowExclusiveCovering";
		div.style.position="absolute";
		div.style.left=0;
		div.style.top=0;
		div.style.display="none";
		document.body.appendChild(div);
		__SubWindow_EXCLUSIVE_COVERING=div;
		
	};
	var scrollWidth=document.body.scrollWidth;
	var scrollHeight=document.body.scrollHeight;
	var clientWidth=document.body.clientWidth;
	var clientHeight=document.body.clientHeight;
	__SubWindow_EXCLUSIVE_COVERING.style.width=(scrollWidth>clientWidth)?scrollWidth:clientWidth;
	__SubWindow_EXCLUSIVE_COVERING.style.height=(scrollHeight>clientHeight)?scrollHeight:clientHeight;
	__SubWindow_EXCLUSIVE_COVERING.style.zIndex=_$autoGenIndex();
	return __SubWindow_EXCLUSIVE_COVERING;
	
};
_$registerFinalizeProcedure(function (){
	__SubWindow_STACK.clear();
	__SubWindow_STACK=null;
	__SubWindow_EXCLUSIVE_COVERING=null;
	__SubWindow_DRAGGING_CURSOR=null;
	__Current_SUBWINDOW=null;
	
});

var __SubWindow_STATUS_NORMAL="normal";
var __SubWindow_STATUS_MIN="minimize";
var __SubWindow_STATUS_MAX="maximize";
var __SubWindow_STATUS_HIDDEN="hidden";
var SubWindow=new Object();
SubWindow.hideParent=function (){
	if(parent!=null){
		var subwinStack=parent.__SubWindow_STACK;
		if(subwinStack!=null){
			var element=subwinStack._first;
			while(element!=null){
				var subWindow=element._data;
				if(subWindow!=null&&subWindow._active){
					var frame=subWindow.getContentContainer().firstChild;
					if(frame!=null&&frame.contentWindow==window){
						subWindow.hide();
						break;
						
					}
				};
				element=element._next;
				
			}
		}
	}
};
SubWindow.getAll=function (){
	return __SubWindow_STACK;
	
};
function _$buildSubWindow(id,viewModel,status){
	var subWindow=null;
	if(id){
		subWindow=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(subWindow==null){
		subWindow=$$("DIV");
		subWindow.id=id;
		var table=$$("TABLE");
		var row,cell;
		var tbody=$$("TBODY");		
		cell=$$("TD");
		row=$$("TR");
		row.appendChild(cell);
		tbody.appendChild(row);
		var contentContainer=$$("DIV");
		cell=$$("TD");
		row=$$("TR");
		cell.appendChild(contentContainer);
		row.appendChild(cell);
		tbody.appendChild(row);
		table.appendChild(tbody);
		subWindow.appendChild(table);
		
	};
	subWindow.getId=_$Component_getId;
	subWindow.getViewModel=_$Component_getViewModel;
	subWindow.isActive=_$Component_isActive;
	subWindow.activate=_$SubWindow_activate;
	subWindow.destroy=_$SubWindow_destroy;
	subWindow.getTag=_$Element_getTag;
	subWindow.setTag=_$Element_setTag;
	subWindow.getContext=_$Element_getContext;
	subWindow.setContext=_$Element_setContext;
	subWindow.refresh=_$SubWindow_refresh;
	subWindow.getTitle=_$SubWindow_getTitle;
	subWindow.setTitle=_$SubWindow_setTitle;
	subWindow.isResizable=_$SubWindow_getResizable;
	subWindow.setResizable=_$SubWindow_setResizable;
	subWindow.isDraggable=_$SubWindow_getDraggable;
	subWindow.setDraggable=_$SubWindow_setDraggable;
	subWindow.isShowMinimizeButton=_$SubWindow_getShowMinimizeButton;
	subWindow.setShowMinimizeButton=_$SubWindow_setShowMinimizeButton;
	subWindow.isShowMaxnimizeButton=_$SubWindow_getShowMaxnimizeButton;
	subWindow.setShowMaximizeButton=_$SubWindow_setShowMaximizeButton;
	subWindow.isShowCloseButton=_$SubWindow_getShowCloseButton;
	subWindow.setShowCloseButton=_$SubWindow_setShowCloseButton;
	subWindow.getTitleClickAction=_$SubWindow_getTitleClickAction;
	subWindow.setTitleClickAction=_$SubWindow_setTitleClickAction;
	subWindow.getTitleDblClickAction=_$SubWindow_getTitleDblClickAction;
	subWindow.setTitleDblClickAction=_$SubWindow_setTitleDblClickAction;
	subWindow.getStatus=_$SubWindow_getStatus;
	subWindow.setStatus=_$SubWindow_setStatus;
	subWindow.getContentContainer=_$SubWindow_getContentContainer;
	subWindow.minimize=_$SubWindow_minimize;
	subWindow.maximize=_$SubWindow_maximize;
	subWindow.restore=_$SubWindow_restore;
	subWindow.hide=_$SubWindow_hide;
	subWindow.show=_$SubWindow_show;	
	subWindow.rebuild=_$SubWindow_rebuild;
	subWindow._$setWindowStyle=_$SubWindow_setWindowStyle;
	subWindow._$mouseAction=_$SubWindow_mouseAction;
	subWindow._$getDraggingCursor=_$SubWindow_getDraggingCursor;
	subWindow._$redispose=_$SubWindow_redispose;
	subWindow._$getFloatSubWindow=_$SubWindow_getFloatSubWindow;
	//by gz 2007-01-07
	subWindow.isNailup=_$SubWindow_getNailup;
	subWindow.setNailup=_$SubWindow_setNailup;
	subWindow.isShowMenuButton=_$SubWindow_getShowMenuButton;
	subWindow.setShowMenuButton=_$SubWindow_setShowMenuButton;
	subWindow.isShowNailButton=_$SubWindow_getShowNailButton;
	subWindow.setShowNailButton=_$SubWindow_setShowNailButton;
	subWindow._$switchWindow=_$SubWindow_switchWindow;
	//end
	EventManager.addSystemEvent(subWindow,"onmousemove",function (){
		_$SubWindow_onMouseMove(subWindow);
		
	});
	EventManager.addSystemEvent(subWindow,"onmousedown",function (){
		_$SubWindow_onMouseDown(subWindow);
		
	});
	if(browserType==__Browser_IE){
		EventManager.addSystemEvent(subWindow,"onmouseup",function (){
			_$SubWindow_onMouseUp(subWindow);
			
		});
		
	};
	subWindow._viewModel=viewModel;
	subWindow._title="";
	subWindow._resizable=true;
	subWindow._draggable=true;
	subWindow._nailup=false;
	subWindow._showMenuButton=true;
	subWindow._showNailButton=true;
	subWindow._showMinimizeButton=true;
	subWindow._showMaxnimizeButton=true;
	subWindow._showCloseButton=false;
	subWindow._titleClickAction=null;
	subWindow._titleDblClickAction="maximize";
	subWindow._status=(status)?status:__SubWindow_STATUS_NORMAL;
	subWindow._exclusive=false;
	subWindow._hasExpanded=false;
	__SubWindow_STACK.insert(subWindow);
	return subWindow;
	
};
KingfisherFactory._$registerComponentType("SubWindow",_$buildSubWindow);
function _$SubWindow_activate(){
	if(!this._active){
		if(this._status!=__SubWindow_STATUS_MIN&&this._status!=__SubWindow_STATUS_HIDDEN){
			if(typeof(this._initChildren)=="function"){
				this._initChildren();
				this._initChildren=null;
				
			}
		}
		this.rebuild();
		if(this._status!=__SubWindow_STATUS_NORMAL){
			var status=this._status;
			this._status=__SubWindow_STATUS_NORMAL;
			this.setStatus(status);
			
		};
		this._active=true;
		this.refresh();

//	by gz 2007-01-07
		this.style.zIndex=_$autoGenIndex();
		this._$switchWindow(this);
//	end

		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$SubWindow_rebuild(){
	this._class=this.className;
	if(!this._class)this._class="SubWindow";
	if(this.style.position=="absolute"){
		_$setElementStyle(this,"Float"+this._class);
		
	}else {
		_$setElementStyle(this,this._class);
		
	};
	this.style.cursor="move";
	var table=this.firstChild;
	this._windowTable=table;
	table.style.cursor="default";
	_$setElementStyle(table,"WindowTable");
	table.style.width="100%";
	table.style.height="100%";
	table.cellPadding=0;
	table.cellSpacing=0;
	table.style.tableLayout="fixed";
	var tbody=this.firstChild.tBodies[0];
	var row,cell;
	row=tbody.rows[0];
	cell=row.cells[0];
	var titleBarTable=$$("TABLE");
	titleBarTable.cellPadding=0;
	titleBarTable.cellSpacing=0;
	titleBarTable.style.width="100%";
	var titleBarBody,titleBarRow,titleBarCell;
	titleBarRow=$$("TR");

	var subWindow=this;
	if(this._showMenuButton){
		var controlMenu=KingfisherFactory.create("Menu",null,"__subwindow_controlmenu"+_$genControlId());
		var menuItem;
		menuItem=new MenuItem("restore",__SUBWINDOW_TIP_RESTORE);
		menuItem.setIcon(__SKIN_PATH+"/subwindow/normal.gif");
		menuItem._$setInnerMethod("_$SubWindow_ControlMenu_onClick");
		controlMenu.getTopItem().addItem(menuItem);
		menuItem=new MenuItem("minimize",__SUBWINDOW_TIP_MINIMIZE);
		menuItem.setIcon(__SKIN_PATH+"/subwindow/minimize.gif");
		menuItem._$setInnerMethod("_$SubWindow_ControlMenu_onClick");
		controlMenu.getTopItem().addItem(menuItem);
		menuItem=new MenuItem("maximize",__SUBWINDOW_TIP_MAXIMIZE);
		menuItem.setIcon(__SKIN_PATH+"/subwindow/maximize.gif");
		menuItem._$setInnerMethod("_$SubWindow_ControlMenu_onClick");
		controlMenu.getTopItem().addItem(menuItem);
		menuItem=new MenuItem("nailup",__SUBWINDOW_TIP_NAILUP);
		menuItem._$setInnerMethod("_$SubWindow_ControlMenu_onClick");
		controlMenu.getTopItem().addItem(menuItem);
		menuItem=new MenuItem("close",__SUBWINDOW_TIP_CLOSE);
		menuItem.setIcon(__SKIN_PATH+"/subwindow/close.gif");
		menuItem._$setInnerMethod("_$SubWindow_ControlMenu_onClick");
		controlMenu.getTopItem().addItem(menuItem);
		this._controlMenu=controlMenu;

		titleBarCell=$$("TD");
		var btnMenu=$$("IMG");
		btnMenu._kingfisherClass="WindowButton";
		_$setElementStyle(btnMenu,"WindowButton");
		_$setElementImage(btnMenu,__SKIN_PATH+"/subwindow/kingfisher.gif");
		titleBarCell.appendChild(btnMenu);
		titleBarRow.appendChild(titleBarCell);
		this._windowMenuCell=titleBarCell;
		EventManager.addSystemEvent(btnMenu,"onclick",function (){
			_$SubWindow_MenuButton_onClick(subWindow,btnMenu);
			
		});
	}

	titleBarCell=$$("TD");
	titleBarCell.innerHTML=this._title;
	titleBarCell.style.whiteSpace="nowrap";
	titleBarCell.style.paddingLeft=8;
	titleBarCell.style.width="100%";
	titleBarRow.appendChild(titleBarCell);	
	EventManager.addSystemEvent(titleBarCell,"onclick",function (){
		_$SubWindow$Titlebar_onClick(subWindow);
		
	});
	EventManager.addSystemEvent(titleBarCell,"ondblclick",function (){
		_$SubWindow$Titlebar_onDblClick(subWindow);
		
	});
	this._windowTitleCell=titleBarCell;
	
	if(this._showNailButton){
		titleBarCell=$$("TD");
		var btnNail=$$("IMG");
		btnNail._kingfisherClass="WindowButton";
		_$setElementStyle(btnNail,"WindowButton");
		_$setElementImage(btnNail,__SKIN_PATH+"/subwindow/" + (this._nailup?"nailup.gif":"nail.gif"));
		titleBarCell.appendChild(btnNail);
		titleBarRow.appendChild(titleBarCell);
		this._btnNail=btnNail;
		EventManager.addSystemEvent(btnNail,"onmouseover",function (){
			_$SubWindow$Button_onMouseOver(btnNail);
			
		});
		EventManager.addSystemEvent(btnNail,"onmouseout",function (){
			_$SubWindow$Button_onMouseOut(btnNail);
			
		});
		EventManager.addSystemEvent(btnNail,"onclick",function (){
			_$SubWindow$NailButton_onClick(subWindow,btnNail);
			
		});
		
	};
	
	if(this._showMinimizeButton){
		titleBarCell=$$("TD");
		var btnMinimize=$$("IMG");
		btnMinimize._kingfisherClass="WindowButton";
		_$setElementStyle(btnMinimize,"WindowButton");
		_$setElementImage(btnMinimize,__SKIN_PATH+"/subwindow/minimize.gif");
		titleBarCell.appendChild(btnMinimize);
		titleBarRow.appendChild(titleBarCell);
		this._btnMinimize=btnMinimize;
		EventManager.addSystemEvent(btnMinimize,"onmouseover",function (){
			_$SubWindow$Button_onMouseOver(btnMinimize);
			
		});
		EventManager.addSystemEvent(btnMinimize,"onmouseout",function (){
			_$SubWindow$Button_onMouseOut(btnMinimize);
			
		});
		EventManager.addSystemEvent(btnMinimize,"onclick",function (){
			_$SubWindow$MinimizeButton_onClick(subWindow,btnMinimize);
			
		});
		
	};
	if(this._showMaxnimizeButton){
		titleBarCell=$$("TD");
		var btnMaximize=$$("IMG");
		btnMaximize._kingfisherClass="WindowButton";
		_$setElementStyle(btnMaximize,"WindowButton");
		_$setElementImage(btnMaximize,__SKIN_PATH+"/subwindow/maximize.gif");
		titleBarCell.appendChild(btnMaximize);
		titleBarRow.appendChild(titleBarCell);
		this._btnMaximize=btnMaximize;
		EventManager.addSystemEvent(btnMaximize,"onmouseover",function (){
			
			_$SubWindow$Button_onMouseOver(btnMaximize);
			
		});
		EventManager.addSystemEvent(btnMaximize,"onmouseout",function (){
			_$SubWindow$Button_onMouseOut(btnMaximize);
			
		});
		EventManager.addSystemEvent(btnMaximize,"onclick",function (){
			_$SubWindow$MaximizeButton_onClick(subWindow,btnMaximize);
			
		});
		
	};
	if(this._showCloseButton){
		titleBarCell=$$("TD");
		var btnClose=$$("IMG");
		btnClose._kingfisherClass="WindowButton";
		_$setElementStyle(btnClose,"WindowButton");
		_$setElementImage(btnClose,__SKIN_PATH+"/subwindow/close.gif");
		titleBarCell.appendChild(btnClose);
		titleBarRow.appendChild(titleBarCell);
		this._btnClose=btnClose;
		EventManager.addSystemEvent(btnClose,"onmouseover",function (){
			_$SubWindow$Button_onMouseOver(btnClose);
			
		});
		EventManager.addSystemEvent(btnClose,"onmouseout",function (){
			_$SubWindow$Button_onMouseOut(btnClose);
			
		});
		EventManager.addSystemEvent(btnClose,"onclick",function (){
			_$SubWindow$CloseButton_onClick(subWindow,btnClose);
			
		});
		
	};
	titleBarBody=$$("TBODY");
	titleBarBody.appendChild(titleBarRow);
	titleBarTable.appendChild(titleBarBody);
	_$setElementStyle(titleBarTable,"TitleBar");
	cell.appendChild(titleBarTable);
	this._windowTitleBar=cell;
	row=tbody.rows[1];
	row.style.height="100%";	
	cell=row.cells[0];
	cell.style.padding=_$getPreferenceSetting("__SubWindow_Content_Padding");
	var div=cell.childNodes[0];
	div.style.width="100%";
	div.style.height="100%";
	div.style.valign="top";
	_$setElementStyle(div,this._class+"ContentContainer");
	this._contentContainer=div;
	this._contentOuterCell=cell;
	this._buildOver=true;
	
};
function _$SubWindow_setWindowStyle(isAbsolute){
	if(isAbsolute){
		_$setElementStyle(this,"Float"+this._class);
		_$setElementStyle(this._contentContainer,"Float"+this._class+"ContentContainer");
		
	}else {
		_$setElementStyle(this,this._class);
		_$setElementStyle(this._contentContainer,this._class+"ContentContainer");
		
	}
};
function _$SubWindow_refresh(){
	this._$setWindowStyle(this.style.position=="absolute");
	
};
function _$SubWindow_destroy(){
	__SubWindow_STACK.remove(this);
	this._btnMinimize=null;
	this._btnMaximize=null;
	this._btnNail=null;
	this._btnClose=null;
	this._windowTitleCell=null;
	this._windowMenuCell=null;
	this._windowTitleBar=null;
	this._contentContainer=null;
	this._contentOuterCell=null;
	this._windowTable=null;
	this._floatSubWindow=null;
	this._controlMenu=null;
	
};
function _$SubWindow_getTitle(){
	return this._title;
	
};
function _$SubWindow_setTitle(title){
	this._title=title;
	if(this._active){
		this._windowTitleCell.innerHTML=title;
		
	}
};
function _$SubWindow_getNailup(){
	return this._nailup;
	
};
function _$SubWindow_setNailup(nailup){
	if(nailup){
		this._oldResizable=this._resizable;
		this._oldDraggable=this._draggable;
		this.setResizable(false);
		this.setDraggable(false);
	}
	else{
		this.setResizable(this._oldResizable);
		this.setDraggable(this._oldDraggable);
	}
};
function _$SubWindow_getResizable(){
	return this._resizable;
	
};
function _$SubWindow_setResizable(resizable){
	
	this._resizable=resizable;
	var draggableCursor;
	if(!this._nailup && this._resizable){
		draggableCursor="move";
		
	}else {
		draggableCursor="default";
		
	};
	if(this.style.cursor!=draggableCursor){
		this.style.cursor=draggableCursor;
		
	}

	this._nailup=!(this._resizable || this._draggable);
	if(this._btnNail)
		_$setElementImage(this._btnNail,__SKIN_PATH+"/subwindow/" + (this._nailup?"nailup.gif":"nail.gif"));
};
function _$SubWindow_getDraggable(){
	return this._draggable;
	
};
function _$SubWindow_setDraggable(draggable){
	this._draggable=draggable;
	var draggableCursor;
	if(!this._nailup && this._draggable){
		draggableCursor="move";
		
	}else {
		draggableCursor="default";
		
	};
	if(this.style.cursor!=draggableCursor){
		this.style.cursor=draggableCursor;
		
	}

	this._nailup=!(this._resizable || this._draggable);
	if(this._btnNail)
		_$setElementImage(this._btnNail,__SKIN_PATH+"/subwindow/" + (this._nailup?"nailup.gif":"nail.gif"));
};
function _$SubWindow_getShowMenuButton(){
	return this._showMenuButton;
	
};
function _$SubWindow_setShowMenuButton(showMenuButton){
	this._showMenuButton=showMenuButton;
	
};
function _$SubWindow_getShowNailButton(){
	return this._showNailButton;
	
};
function _$SubWindow_setShowNailButton(showNailButton){
	this._showNailButton=showNailButton;
	
};
function _$SubWindow_getShowMinimizeButton(){
	return this._showMinimizeButton;
	
};
function _$SubWindow_setShowMinimizeButton(showMinimizeButton){
	this._showMinimizeButton=showMinimizeButton;
	
};
function _$SubWindow_getShowMaxnimizeButton(){
	return this._showMaxnimizeButton;
	
};
function _$SubWindow_setShowMaximizeButton(showMaximizeButton){
	this._showMaxnimizeButton=showMaximizeButton;
	
};
function _$SubWindow_getShowCloseButton(){
	return this._showCloseButton;
	
};
function _$SubWindow_setShowCloseButton(showCloseButton){
	this._showCloseButton=showCloseButton;
	
};
function _$SubWindow_getTitleClickAction(){
	
	return this._titleClickAction;
	
};
function _$SubWindow_setTitleClickAction(titleClickAction){
	this._titleClickAction=titleClickAction;
	
};
function _$SubWindow_getTitleDblClickAction(){
	return this._titleDblClickAction;
	
};
function _$SubWindow_setTitleDblClickAction(titleDblClickAction){
	this._titleDblClickAction=titleDblClickAction;
	
};
function _$SubWindow_getContentContainer(){
	return this._contentContainer;
	
};
function _$SubWindow_mouseAction(){
	var x,y;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		y=event.clientY+document.body.scrollTop;
	}else {
		x=event.pageX;
		y=event.pageY;
		
	};
	if(this._resizable){
		var absPos=_$getAbsolutePosition(this);
		var left=absPos[0]+1;
		var top=absPos[1]+1;
		var de=Math.abs(left-x);
		var dw=Math.abs(left+this.offsetWidth-x);
		var dn=Math.abs(top-y);
		var ds=Math.abs(top+this.offsetHeight-y);
		if(de<=3){
			if(dn<=18){
				return "ne-resize";
				
			}else if(ds<=18){
				return "se-resize";
				
			}else {
				return "e-resize";
				
			}
		}else if(dw<=3){
			if(dn<=18){
				return "nw-resize";
				
			}else if(ds<=18){
				return "sw-resize";				
				
			}else {
				return "w-resize";
				
			}
		};
		if(dn<=3){
			if(de<=18){
				return "ne-resize";
				
			}else if(dw<=18){
				return "nw-resize";
				
			}else {
				return "n-resize";
				
			}
		}else if(ds<=3){
			if(de<=18){
				return "se-resize";
				
			}else if(dw<=18){
				return "sw-resize";
				
			}else {
				return "s-resize";
				
			}
		}
	};
	if(this._draggable){
		var titleBarCell=this._windowTitleCell;
		var absPos=_$getAbsolutePosition(titleBarCell);
		if(x<=absPos[0]+titleBarCell.offsetWidth&&y<=absPos[1]+titleBarCell.offsetHeight){
			var windowMenuCell=this._windowMenuCell;
			if(windowMenuCell){
				absPos=_$getAbsolutePosition(windowMenuCell);
				if(x>=absPos[0]+windowMenuCell.offsetWidth&&y<=absPos[1]+windowMenuCell.offsetHeight)
					return "move";
				else
					return null;
			}
			return "move";
			
		}else {
			return null;
			
		}
	}
};
function _$SubWindow_redispose(){
	//�������
	function _$slidingScale(ax,ay,bx,by,cx,cy){
		bx-=ax;
		by-=ay;
		cx-=ax;
		cy-=ay;
		var dx,dy;
		if(cx/bx<cy/by){
			
			dx=cx;
			dy=parseInt(dx*by/bx);
			
		}else {
			dy=cy;
			dx=parseInt(dy*bx/by);
			
		};
		dx+=ax;
		dy+=ay;
		return [dx,dy];
		
	};
	var x,y;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		y=event.clientY+document.body.scrollTop;
		
	}else {
		x=event.pageX;
		y=event.pageY;
		
	};
	var offsetParent=this.offsetParent;
	var left=0;
	var top=0;
	var right=left+document.body.clientWidth;
	var bottom=top+document.body.clientHeight;
	if(x<left){
		x=left;
		
	}else if(x>right){
		x=right;
		
	};
	if(y<top){
		y=top;
		
	}else if(y>bottom){
		y=bottom;
		
	};
	absPos=_$getAbsolutePosition(this);
	left=absPos[0];
	top=absPos[1];
	right=left+this.offsetWidth;
	bottom=top+this.offsetHeight;
	
	var cursor=this._$getDraggingCursor();
	//���簴סctrl��shilt��ڰ���������
	switch(this._moving){
		case "e-resize":{
			var right=cursor.offsetLeft+cursor.offsetWidth;			
			if(right-x>5){
				cursor.style.left=x;
				if(browserType==__Browser_IE){
					cursor.style.width=right-x;
					
				}else {
					cursor.style.width=right-x-(cursor.offsetWidth-cursor.clientWidth);
					
				}
			};
			break;
			
		};
		case "w-resize":{
			if(x-cursor.offsetLeft>5){
				cursor.style.width=x-cursor.offsetLeft;
				
			};
			break;
			
		};
		case "n-resize":{
			var bottom=cursor.offsetTop+cursor.offsetHeight;
			if(bottom-y>18){
				cursor.style.top=y;
				if(browserType==__Browser_IE){
					cursor.style.height=bottom-y;
					
				}else {
					cursor.style.height=bottom-y-(cursor.offsetHeight-cursor.clientHeight);
					
				}
			};
			break;
			
		};
		case "s-resize":{
			if(y-cursor.offsetTop>18){
				cursor.style.height=y-cursor.offsetTop;
				
			};
			break;
			
		};
		case "ne-resize":{
			var absPos;
			if(event.shiftKey||event.ctrlKey){
				absPos=_$slidingScale(left,top,right,bottom,x,y);
				
			}else {
				absPos=[x,y];
				
			};
			var width=right-absPos[0];
			var height=bottom-absPos[1];
			if(width>5&&height>18){
				cursor.style.left=absPos[0];
				cursor.style.top=absPos[1];
				cursor.style.width=width;
				cursor.style.height=height;				
				
			};
			break;
			
		};
		case "nw-resize":{
			var absPos;
			if(event.shiftKey||event.ctrlKey){
				absPos=_$slidingScale(left,bottom,right,top,x,y);
				
			}else {
				absPos=[x,y];
				
			};
			var width=absPos[0]-left;
			var height=bottom-absPos[1];
			if(width>5&&height>18){
				cursor.style.top=absPos[1];
				cursor.style.width=width;
				cursor.style.height=height;
				
			};
			break;
			
		};
		case "se-resize":{
			var absPos;
			if(event.shiftKey||event.ctrlKey){
				absPos=_$slidingScale(right,top,left,bottom,x,y);
				
			}else {
				absPos=[x,y];
				
			};
			var width=right-absPos[0];
			var height=absPos[1]-top;
			if(width>5&&height>18){
				cursor.style.left=absPos[0];
				cursor.style.width=width;
				cursor.style.height=height;
				
			};
			break;
			
		};
		case "sw-resize":{
			var absPos;
			if(event.shiftKey||event.ctrlKey){
				absPos=_$slidingScale(left,top,right,bottom,x,y);
				
			}else {
				absPos=[x,y];
				
			};
			var width=absPos[0]-left;
			var height=absPos[1]-top;
			if(width>5&&height>18){
				cursor.style.width=width;
				cursor.style.height=height;
				
			}
			break;
			
		};
		case "move":{
			var absPos=_$getAbsolutePosition(this);
			cursor.style.left=absPos[0]+(x-this._xPosition);
			cursor.style.top=absPos[1]+(y-this._yPosition);
			break;
			
		}
	}
};
function _$SubWindow_getStatus(){
	return this._status;
	
};
function _$SubWindow_setStatus(status){
	if(this._status==status)return ;
	if(!this._buildOver){
		this._status=status;
		return ;
		
	};
	var zoom=this._status;
	try{
		switch(zoom){
			case __SubWindow_STATUS_NORMAL:{
				this._oldPos=this.style.position;
				this._offsetLeft=this.offsetLeft;
				this._offsetTop=this.offsetTop;
				if(this.$tB){
					this._offsetWidth=this.offsetWidth;
					this._offsetHeight=this.offsetHeight;
					
				}else {
					this._offsetWidth=this.style.width;
					this._offsetHeight=this.style.height;
					
				};
				break;
				
			};
			case __SubWindow_STATUS_MAX:{
				var windowTable=this._windowTable;
				this.appendChild(windowTable);
				_$setDisplay(this._$getFloatSubWindow(),false);
				break;
				
			};
			case __SubWindow_STATUS_HIDDEN:{
				if(this._active&&this._beforeShow!=null){
					var result=_$fireKingfisherEvent(this,"beforeShow",[this]);
					if(result!=null)throw result;
					
				};
				break;
				
			}
		}
//	by gz 2007-01-07
		this._$switchWindow(this);
//		__Current_SUBWINDOW=this;
//	end
		var hasResize=false;
		var hasExpanded=false;
		switch(status){
			case __SubWindow_STATUS_NORMAL:{
				if(this._active&&this._beforeRestore!=null){
					var result=_$fireKingfisherEvent(this,"beforeRestore",[this]);
					if(result!=null)throw result;
					
				};
				if(this._exclusive){
					_$setDisplay(_$getExclusiveCovering(),true);
					
				};
				if(parseInt(this._offsetWidth)>0){
					this.style.left=this._offsetLeft;
					this.style.top=this._offsetTop;
					this.style.width=this._offsetWidth;
					this.style.height=this._offsetHeight;
					this.style.position=this._oldPos;
					
				};
				this.style.zIndex=_$autoGenIndex();
				if(this._btnMinimize)_$setElementImage(this._btnMinimize,__SKIN_PATH+"/subwindow/minimize.gif");
				if(this._btnMaximize)_$setElementImage(this._btnMaximize,__SKIN_PATH+"/subwindow/maximize.gif");
				hasResize=true;
				hasExpanded=true;
				this._status=status;
				if(this._active)_$fireKingfisherEvent(this,"afterRestore",[this]);
				break;
				
			};
			case __SubWindow_STATUS_MIN:{
				if(this._active&&this._beforeMinimize!=null){
					var result=_$fireKingfisherEvent(this,"beforeMinimize",[this]);
					if(result!=null)throw result;
					
				};
				_$setDisplay(this._contentContainer,false);
				if(typeof(this._offsetWidth)=="number"){
					this.style.width=this._offsetWidth;
					
				};
				this.style.height=0;
				this.style.zIndex=_$autoGenIndex();
				if(this._btnMinimize)_$setElementImage(this._btnMinimize,__SKIN_PATH+"/subwindow/normal.gif");
				if(this._btnMaximize)_$setElementImage(this._btnMaximize,__SKIN_PATH+"/subwindow/maximize.gif");
				this._status=status;				
				if(this._active)_$fireKingfisherEvent(this,"afterMinimize",[this]);
				break;
				
			};
			case __SubWindow_STATUS_MAX:{
				if(this._active&&this._beforeMaximize!=null){
					var result=_$fireKingfisherEvent(this,"beforeMaximize",[this]);
					if(result!=null)throw result;
					
				};
				var windowTable=this._windowTable;
				var maximizeContainer=this._$getFloatSubWindow();
				maximizeContainer.appendChild(windowTable);
				_$setDisplay(maximizeContainer,true);
				if(this._btnMinimize)_$setElementImage(this._btnMinimize,__SKIN_PATH+"/subwindow/minimize.gif");
				if(this._btnMaximize)_$setElementImage(this._btnMaximize,__SKIN_PATH+"/subwindow/normal.gif");
				hasResize=true;
				hasExpanded=true;
				this._status=status;
				if(this._active)_$fireKingfisherEvent(this,"afterMaximize",[this]);
				break;
				
			};
			case __SubWindow_STATUS_HIDDEN:{
				if(this._active&&this._beforeHide!=null){
					var result=_$fireKingfisherEvent(this,"beforeHide",[this]);
					if(result!=null)throw result;
					
				};
				if(this._btnMinimize)_$setElementImage(this._btnMinimize,__SKIN_PATH+"/subwindow/minimize.gif");
				if(this._btnMaximize)_$setElementImage(this._btnMaximize,__SKIN_PATH+"/subwindow/maximize.gif");
				_$setDisplay(this,false);
				if(this._exclusive){
					_$setDisplay(_$getExclusiveCovering(),false);
					
				};
				this._status=status;
				if(this._active)_$fireKingfisherEvent(this,"afterHide",[this]);
				this._oldPos=this.style.position;
				this._offsetLeft=0;
				this._offsetTop=0;
				this._offsetWidth=0;
				this._offsetHeight=0;
				break;
				
			}
		};
		switch(zoom){
			
			case __SubWindow_STATUS_MIN:{
				if(this._contentContainer!=null){
					_$setDisplay(this._contentContainer,true);
					
				};
				if(!this._hasExpanded){
					_$initContainerObject(this._initChildren);
					this._initChildren=null;
					
				};
				break;
				
			};
			case __SubWindow_STATUS_HIDDEN:{
				_$setDisplay(this,true);
				if(!this._hasExpanded){
					_$initContainerObject(this._initChildren);
					this._initChildren=null;
					
				};
				if(this._active)_$fireKingfisherEvent(this,"afterShow",[this]);
				break;
				
			}
		};
		if(hasExpanded)this._hasExpanded=true;
		if(hasResize){
			_$Window_onResize();
			
		};
		if(this._btnMinimize)_$setElementStyle(this._btnMinimize,"WindowButton");
		if(this._btnMaximize)_$setElementStyle(this._btnMaximize,"WindowButton");
		if(this._btnClose)_$setElementStyle(this._btnClose,"WindowButton");
		
	}catch(e){
		_$processException(e);
		
	}
};
function _$SubWindow$Button_onMouseOver(button){
	_$setElementStyle(button,"HotWindowButton");
	
};
function _$SubWindow$Button_onMouseOut(button){
	_$setElementStyle(button,"WindowButton");
	
};
function _$SubWindow_ControlMenu_onClick(menu,menuitem){
	if(__Current_SUBWINDOW){
		switch(menuitem.getName()){
			case "nailup":{
				__Current_SUBWINDOW.setNailup(!__Current_SUBWINDOW._nailup);
				break;
			}
			case "restore":{
				__Current_SUBWINDOW.restore();
				break;
			}
			case "minimize":{
				__Current_SUBWINDOW.minimize();
				break;
			}
			case "maximize":{
				__Current_SUBWINDOW.maximize();
				break;
			}
			case "close":{
				__Current_SUBWINDOW.hide();
				break;
			}
		}
	}
};
function _$SubWindow_MenuButton_onClick(subWindow,button){
	subWindow._$switchWindow(subWindow);
	var menu=subWindow._controlMenu;
	if(menu!=null){
		var items = menu.getTopItem().getItems();
		for(var i=0;i<items.size();i++){
			var item=items.get(i);
			switch(item.getName()){
				case "nailup":{
					item.setIcon(__SKIN_PATH+"/subwindow/"+(subWindow._nailup?"menu_nailup.gif":"menu_nail.gif"));
					item.setDisabled(!parseBoolean(subWindow._showNailButton));
					break;
				}
				case "restore":{
					item.setDisabled(subWindow._status==__SubWindow_STATUS_NORMAL);
					break;
				}
				case "minimize":{
					item.setDisabled(subWindow._status==__SubWindow_STATUS_MIN) || !parseBoolean(subWindow._showMinimizeButton);
					break;
				}
				case "maximize":{
					item.setDisabled((subWindow._status==__SubWindow_STATUS_MAX) || !parseBoolean(subWindow._showMaxnimizeButton));
					break;
				}
				case "close":{
					item.setDisabled(!parseBoolean(subWindow._showCloseButton));
					break;
				}
			}
		}
		
		var box=menu._$getPopupMenu(menu._topItem);
		if(box!=null){
			box.show();
			menu._$locatePopupMenu(box,button,"button");
			box._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",1000);
				
		}
	}
};
function _$SubWindow$NailButton_onClick(subWindow,button){
	subWindow._$switchWindow(subWindow);
	subWindow.setNailup(!subWindow._nailup);
	
};
function _$SubWindow$MinimizeButton_onClick(subWindow,button){
	if(subWindow._status==__SubWindow_STATUS_MIN){
		subWindow.restore();
		
	}else {
		subWindow.minimize();
		
	}
	
};
function _$SubWindow$MaximizeButton_onClick(subWindow,button){
	if(subWindow._status==__SubWindow_STATUS_MAX){
		subWindow.restore();
		
	}else {
		subWindow.maximize();
		
	}
};
function _$SubWindow$CloseButton_onClick(subWindow,button){
	subWindow.hide();
	
};
function _$SubWindow_onMouseMove(subWindow){
	if(subWindow._moving){
		subWindow._$redispose();
		
	}
};
function _$SubWindow_onMouseDown(subWindow){
	var mouseButton;
	if(browserType==__Browser_IE){
		mouseButton=event.button;
		
	}else {
		mouseButton=event.which;
		
	};
	if(mouseButton!=1)return ;
	subWindow._moving=subWindow._$mouseAction();
	if(subWindow._moving!=null){
		if(browserType==__Browser_IE){
			var targ=event.srcElement;
			targ.unselectable=true;
			
		}else {
			_$setDisplay(_$getWindowCurtain(),true);
			var targ=event.target;
			targ.style.MozUserSelect="none";
			
		};
		var cursor=subWindow._$getDraggingCursor();
		var absPos=_$getAbsolutePosition(subWindow);
		cursor.style.left=absPos[0];
		cursor.style.top=absPos[1];
		if(browserType==__Browser_IE){
			cursor.style.width=subWindow.offsetWidth;
			cursor.style.height=subWindow.offsetHeight;
			
		}else {
			cursor.style.width=subWindow.clientWidth;
			cursor.style.height=subWindow.clientHeight;
			
		}
		_$setVisible(cursor,true);
		if(subWindow._moving=="move"){
			subWindow._windowTable.style.cursor="move";
			
		};

//	by gz 2007-01-07
		subWindow._$switchWindow(subWindow);
//	end

		var x,y;
		if(browserType==__Browser_IE){
			subWindow.setCapture(true);
			x=event.clientX+document.body.scrollLeft;
			y=event.clientY+document.body.scrollTop;
			
		}else {
			x=event.pageX;
			y=event.pageY;
//			by gz 2007-01-07
//			__Current_SUBWINDOW=subWindow;
			EventManager.addSystemEvent(window,"onmousemove",_$SubWindow_NonIE_onMouseMove,true);
			EventManager.addSystemEvent(window,"onmouseup",_$SubWindow_NonIE_onMouseUp,true);
			
		};
		subWindow._xPosition=x;
		subWindow._yPosition=y;
		
	}
};
function _$SubWindow_onMouseUp(subWindow){
	var mouseButton;
	if(browserType==__Browser_IE){
		mouseButton=event.button;
		
	}else {
		mouseButton=event.which;
		
	};
	if(mouseButton!=1)return ;
	if(subWindow._moving!=null){
		subWindow.style.zIndex=_$autoGenIndex();
		var cursor=subWindow._$getDraggingCursor();
		var absPos=_$getAbsolutePosition(cursor);
		var winPos=_$getAbsolutePosition(subWindow);
		var width;
		var height;
		if(browserType==__Browser_IE){
			width=cursor.offsetWidth;
			height=cursor.offsetHeight;
			
		}else {
			width=cursor.clientWidth;
			height=cursor.clientHeight;
			
		}
		if(width>5||height>5){
			if(absPos[0]!=winPos[0]||absPos[1]!=winPos[1]){
				try{
					var aimLeft=subWindow.offsetLeft+(absPos[0]-winPos[0]);
					var aimTop=subWindow.offsetTop+(absPos[1]-winPos[1]);
					if(this._active&&this._beforeMove!=null){
						var result=_$fireKingfisherEvent(this,"beforeMove",[this,aimLeft,aimTop]);
						if(result!=null)throw result;
						
					};
					subWindow.style.position="absolute";
					subWindow.style.left=aimLeft;
					subWindow.style.top=aimTop;
					subWindow._$setWindowStyle(true);
					if(subWindow._status==__SubWindow_STATUS_MIN){
						subWindow._offsetLeft=subWindow.offsetLeft;
						subWindow._offsetTop=subWindow.offsetTop;
						if(browserType==__Browser_IE){
							subWindow._offsetLeft--;
							subWindow._offsetTop--;
							
						}
					};
					if(this._active)_$fireKingfisherEvent(this,"afterMove",[this]);
					
				}catch(e){
					_$processException(e);
					
				}
			};
			var souWidth=subWindow.offsetWidth;
			var souHeight=subWindow.offsetWidth;
			if(width!=souWidth||height!=souHeight){
				try{
					if(this._active&&this._beforeResize!=null){
						var result=_$fireKingfisherEvent(this,"beforeResize",[this,width,height]);
						if(result!=null)throw result;
						
					};
					subWindow.style.tableLayout="fixed";
					subWindow.style.width=width;
					subWindow.style.height=height;
					_$Window_onResize();
					subWindow.$tB=true;
					if(this._active)_$fireKingfisherEvent(this,"afterResize",[this]);
					
				}
				catch(e){
					_$processException(e);
					
				}
			}
		};
		_$setVisible(cursor,false);
		if(browserType==__Browser_IE){
			subWindow.releaseCapture();
			
		}else {
			_$setDisplay(_$getWindowCurtain(),false);
			EventManager._$removeSystemEvent(window,"onmousemove",_$SubWindow_NonIE_onMouseMove,true);
			EventManager._$removeSystemEvent(window,"onmouseup",_$SubWindow_NonIE_onMouseUp,true);
			__Current_SUBWINDOW=null;
			
		};
		subWindow._moving=null;
		subWindow._windowTable.style.cursor="default";
		
	}
};
function _$SubWindow$Titlebar_onClick(subWindow){
//	by gz 2007-01-07
	subWindow._$switchWindow(subWindow);
//	end
	switch(subWindow._titleClickAction){
		case "maximize":{
			if(subWindow.getStatus()==__SubWindow_STATUS_MAX){
				subWindow.setStatus(__SubWindow_STATUS_NORMAL);
				
			}else {
				subWindow.setStatus(__SubWindow_STATUS_MAX);
				
			};
			break;
		}
		case "minimize":{
			if(subWindow.getStatus()==__SubWindow_STATUS_MIN){
				subWindow.setStatus(__SubWindow_STATUS_NORMAL);
				
			}else {
				subWindow.setStatus(__SubWindow_STATUS_MIN);
				
			};
			break;
		}
	}
};
function _$SubWindow$Titlebar_onDblClick(subWindow){
	switch(subWindow._titleDblClickAction){
		case "maximize":{
			if(subWindow.getStatus()==__SubWindow_STATUS_MAX){
				subWindow.setStatus(__SubWindow_STATUS_NORMAL);
				
			}else {
				subWindow.setStatus(__SubWindow_STATUS_MAX);
				
			};
			break;		
		}
		case "minimize":{
			if(subWindow.getStatus()==__SubWindow_STATUS_MIN){
				subWindow.setStatus(__SubWindow_STATUS_NORMAL);
				
			}else {
				subWindow.setStatus(__SubWindow_STATUS_MIN);
				
			};
			break;
		}
	}
};
function _$SubWindow_switchWindow(subWindow){
	var titleBarTable;
	if(__Current_SUBWINDOW && __Current_SUBWINDOW != subWindow &&
	 __Current_SUBWINDOW.style.position=="absolute" &&
	 __SubWindow_STACK.findElement(__Current_SUBWINDOW) != null){
		titleBarTable=__Current_SUBWINDOW._windowTitleBar.firstChild;
		_$setElementStyle(titleBarTable,"TitleBar_Inactive");
	}
	
	__Current_SUBWINDOW=subWindow;
	titleBarTable=__Current_SUBWINDOW._windowTitleBar.firstChild;
	_$setElementStyle(titleBarTable,"TitleBar");
};
var __Current_SUBWINDOW=null;
function _$SubWindow_NonIE_onMouseUp(){
	_$SubWindow_onMouseUp(__Current_SUBWINDOW);
	
};
function _$SubWindow_NonIE_onMouseMove(){
	_$SubWindow_onMouseMove(__Current_SUBWINDOW);
	
};
var __SubWindow_DRAGGING_CURSOR=null;
function _$SubWindow_getDraggingCursor(){
	var cursor=__SubWindow_DRAGGING_CURSOR;
	if(cursor==null){
		cursor=$$("DIV");
		_$setVisible(cursor,false);
		cursor.className="SubWindowDraggingCursor";
		document.body.appendChild(cursor);
		__SubWindow_DRAGGING_CURSOR=cursor;
		
	};
	cursor.style.zIndex=_$autoGenIndex();
	return cursor;
	
};
function _$SubWindow_minimize(){
	this.setStatus(__SubWindow_STATUS_MIN);
	
};
function _$SubWindow_maximize(){
	this.setStatus(__SubWindow_STATUS_MAX);
	
};
function _$SubWindow_restore(){
	this.setStatus(__SubWindow_STATUS_NORMAL);
	
};
function _$SubWindow_hide(){
	this.setStatus(__SubWindow_STATUS_HIDDEN);
	
};
function _$SubWindow_show(exclusive,center){
	var scrollLeft=document.body.scrollLeft;
	var scrollTop=document.body.scrollTop;
	var clientWidth=document.body.clientWidth;
	var clientHeight=document.body.clientHeight;	
	this._exclusive=exclusive;
	this.setStatus(__SubWindow_STATUS_NORMAL);
	if(center){
		var offsetWidth=this.offsetWidth;
		var offsetHeight=this.offsetHeight;
		this.style.left=parseInt(scrollLeft+(clientWidth-offsetWidth)/2);
		this.style.top=parseInt(scrollTop+(clientHeight-offsetHeight)/2);
		this.style.position="absolute";
		this._$setWindowStyle(true);
		
	}
};
function _$SubWindow_getFloatSubWindow(){
	var windowContainer=this._floatSubWindow;
	if(windowContainer==null){
		var windowContainer=$$("DIV");
		_$setElementStyle(windowContainer,"Float"+this._class);
		windowContainer.style.position="absolute";
		document.body.appendChild(windowContainer);
		windowContainer.style.left=0;
		windowContainer.style.top=0;
		windowContainer.style.width="100%";
		windowContainer.style.height="100%";
		this._floatSubWindow=windowContainer;
		
	};
	windowContainer.style.zIndex=_$autoGenIndex();
	return windowContainer;
	
};



//**************************
//����ؼ�
//**************************
function _$buildGroupBox(id,viewModel,status){
	var box=null;
	if(id){
		box=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(box==null){
		box=$$("<table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" height=\"100%\">");
		box.id=id;
		var div;
		var tbody=$$("TBODY");
		var tr=$$("TR");
		var td=$$("<td height=\"6\" width=\"4\">");
		tr.appendChild(td);
		td=$$("<td rowspan=\"2\" extra=\"legend\">");
		tr.appendChild(td);
		td=$$("<td height=\"6\" width=\"100%\">");
		tr.appendChild(td);
		tbody.appendChild(tr);

		tr=$$("TR");
		var img=$$("<img height=\"1\" width=\"4\">");
		td=$$("<td height=\"6\" width=\"4\" extra=\"line1\">");
		td.appendChild(img);
		tr.appendChild(td);
		img=$$("<img height=\"1\" width=\"1\">");
		td=$$("<td height=\"6\" width=\"100%\" extra=\"line2\">");
		td.appendChild(img);
		tr.appendChild(td);
		tbody.appendChild(tr);

		tr=$$("TR");
		var contentContainer=$$("<div extra=\"ContentContainer\">");
		td=$$("<td colspan=\"3\" extra=\"line3\" valign=\"top\">");
		td.appendChild(contentContainer);
		div=$$("<div extra=\"especial\" style=\"display: none;\">");
		div.appendChild(document.createTextNode("&nbsp;"));
		td.appendChild(div);
		tr.appendChild(td);
		tbody.appendChild(tr);
		box.appendChild(tbody);
		
	}
	box.getId=_$Component_getId;
	box.getViewModel=_$Component_getViewModel;
	box.isActive=_$Component_isActive;
	box.setVisible=_$Component_setVisible;
	box.activate=_$GroupBox_activate;
	box.destroy=_$GroupBox_destroy;
	box.getTag=_$Element_getTag;
	box.setTag=_$Element_setTag;
	box.getContext=_$Element_getContext;
	box.setContext=_$Element_setContext;
	box.getTitle=_$GroupBox_getTitle;
	box.setTitle=_$GroupBox_setTitle;
	box.isShowExpandButton=_$GroupBox_getShowExpandButton;
	box.setShowExpandButton=_$GroupBox_setShowExpandButton;
	box.isExpanded=_$GroupBox_getExpanded;
	box.setExpanded=_$GroupBox_setExpanded;
	box.expand=_$GroupBox_expand;
	box.collapse=_$GroupBox_collapse;
	box.getContentContainer=_$GroupBox_getContentContainer;
	box.rebuild=_$GroupBox_rebuild;
	box._viewModel=viewModel;
	box.style.overflow="visible";
	if(!box.className)box.className="GroupBox";
	box._class=box.className;
	box._title="";
	box._showExpandButton=true;
	box._expanded=true;
	box._hasExpanded=false;				//�Ƿ�չ����//
	return box;
	
};
KingfisherFactory._$registerComponentType("GroupBox",_$buildGroupBox);
function _$GroupBox_destroy(){
	this._groupBoxTitle=null;
	this._btnGroupBoxExpand=null;
	this._legend=null;
	this._contentContainer=null;
	this._especial=null;
	
};
function _$GroupBox_activate(){
	if(!this._active){
		this.rebuild();
		if(!this._expanded){
			this._expanded=true;
			this.setExpanded(false);
			
		}else {
			if(this._btnGroupBoxExpand!=null){
				_$setElementImage(this._btnGroupBoxExpand,__SKIN_PATH+"/groupbox/collapse.gif");
				
			};
			if(typeof(this._initChildren)=="function"){
				this._initChildren();
				this._initChildren=null;				
				
			}
		};
		this._groupBoxTitle.innerHTML=this._title;
		this._active=true;
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$GroupBox_rebuild(){
	var boxClass=new Object();
	boxClass.borderWidth=this.currentStyle.borderWidth;
	boxClass.borderColor=this.currentStyle.borderColor;
	boxClass.borderStyle=this.currentStyle.borderStyle;
	
	function _$getGroupBoxInnerNode(box,parentNode,boxClass){
		for(var i=0;i<parentNode.childNodes.length;i++){
			var lastNode=parentNode.childNodes[i];
			if(lastNode.nodeType!=1)	continue;

			var extra=lastNode.getAttribute("extra");
			if(extra!=null && extra.toUpperCase()=="LEGEND"){
				box._legend=lastNode;
				
			}else if(extra!=null && extra.toUpperCase()=="CONTENTCONTAINER"){
				box._contentContainer=lastNode;
				
			}else if(extra!=null && extra.toUpperCase()=="ESPECIAL"){
				box._especial=lastNode;
				
			}else if(extra!=null && extra.toUpperCase()=="LINE1"){
				lastNode.style.borderLeftColor=boxClass.borderColor;
				lastNode.style.borderLeftWidth=boxClass.borderWidth;
				lastNode.style.borderLeftStyle=boxClass.borderStyle;
				lastNode.style.borderTopColor=boxClass.borderColor;
				lastNode.style.borderTopWidth=boxClass.borderWidth;
				lastNode.style.borderTopStyle=boxClass.borderStyle;
				
			}else if(extra!=null && extra.toUpperCase()=="LINE2"){
				lastNode.style.borderRightColor=boxClass.borderColor;
				lastNode.style.borderRightWidth=boxClass.borderWidth;
				lastNode.style.borderRightStyle=boxClass.borderStyle;
				lastNode.style.borderTopColor=boxClass.borderColor;
				lastNode.style.borderTopWidth=boxClass.borderWidth;
				lastNode.style.borderTopStyle=boxClass.borderStyle;
				
			}else if(extra!=null && extra.toUpperCase()=="LINE3"){
				lastNode.style.borderLeftColor=boxClass.borderColor;
				lastNode.style.borderLeftWidth=boxClass.borderWidth;
				lastNode.style.borderLeftStyle=boxClass.borderStyle;
				lastNode.style.borderRightColor=boxClass.borderColor;
				lastNode.style.borderRightWidth=boxClass.borderWidth;
				lastNode.style.borderRightStyle=boxClass.borderStyle;
				lastNode.style.borderBottomColor=boxClass.borderColor;
				lastNode.style.borderBottomWidth=boxClass.borderWidth;
				lastNode.style.borderBottomStyle=boxClass.borderStyle;
				
			}
			_$getGroupBoxInnerNode(box,lastNode,boxClass);
		};
	};
	_$getGroupBoxInnerNode(this,this,boxClass);
	
	var legend=this._legend;
	var contentContainer=this._contentContainer;
	
	this.style.borderWidth=0;
	_$setElementStyle(legend,this._class+"Title");
	_$setElementStyle(contentContainer,this._class+"ContentContainer");
	var cell,row,tbody;
	var groupBoxTitle,btnGroupBoxExpand;
	tbody=$$("TBODY");
	cell=$$("TD");
	cell.noWrap=true;
	groupBoxTitle=cell;
	row=$$("TR");
	row.appendChild(cell);
	tbody.appendChild(row);
	if(this._showExpandButton){
		cell=$$("TD");
		btnGroupBoxExpand=$$("IMG");
		_$setElementStyle(btnGroupBoxExpand,this._class+"ExpandButton");
		cell.appendChild(btnGroupBoxExpand);
		row.appendChild(cell);
		
	};
	tbody.appendChild(row);
	var table=$$("TABLE");
	table.cellSpacing=0;
	table.appendChild(tbody);
	legend.appendChild(table);
	contentContainer.style.width="100%";
	contentContainer.style.height="100%";
	if(btnGroupBoxExpand!=null){
		var box=this;
		EventManager.addSystemEvent(btnGroupBoxExpand,"onclick",function (){
			
			_$GroupBox_ExpandButton_onClick(box);
			
		});
		
	};
	this._groupBoxTitle=groupBoxTitle;
	this._btnGroupBoxExpand=btnGroupBoxExpand;
	this._buildOver=true;
	
};
function _$GroupBox_getTitle(){
	return this._title;
	
};
function _$GroupBox_setTitle(title){
	if(this._active){
		this._groupBoxTitle.innerHTML=title;
		
	};
	this._title=title;
	
};
function _$GroupBox_getShowExpandButton(){
	return this._showExpandButton;
	
};
function _$GroupBox_setShowExpandButton(showExpandButton){
	this._showExpandButton=showExpandButton;
	
};
function _$GroupBox_getExpanded(){
	return this._expanded;
	
};
function _$GroupBox_setExpanded(expanded){
	if(this._expanded==expanded)return ;
	if(!this._buildOver){
		this._expanded=expanded;
		return ;
		
	};
	var contentContainer=this._contentContainer;
	var especial=this._especial;
	if(expanded){
		contentContainer.style.height=this._sourceContaiHeight;
		this.style.height=this._sourceOffsetHeight;
		
	}else {
		if(parseString(this.currentStyle.height)!="")
			this._sourceOffsetHeight=this.currentStyle.height;
		else
			this._sourceOffsetHeight=this.offsetHeight;
		if(parseString(contentContainer.currentStyle.height)!="")
			this._sourceContaiHeight=contentContainer.currentStyle.height;
		else
			this._sourceContaiHeight=contentContainer.offsetHeight;
		this.style.height=1;
		
	};
	_$setDisplay(contentContainer,expanded);
	_$setDisplay(especial,!expanded);
	this._expanded=expanded;
	if(this._btnGroupBoxExpand!=null){
		if(expanded){
			_$setElementImage(this._btnGroupBoxExpand,__SKIN_PATH+"/groupbox/collapse.gif");
			
		}else {
			_$setElementImage(this._btnGroupBoxExpand,__SKIN_PATH+"/groupbox/expand.gif");
			
		}
	};
	if(expanded){
		if(!this._hasExpanded){
			_$initContainerObject(this._initChildren);
			this._initChildren=null;
			
		};
		this._hasExpanded=true;
		_$Window_onResize();
		
	}
};
function _$GroupBox_expand(){
	this.setExpanded(true);
	
};
function _$GroupBox_collapse(){
	this.setExpanded(false);
	
};
function _$GroupBox_getContentContainer(){
	return this._contentContainer;
	
};
function _$GroupBox_ExpandButton_onClick(box){
	box.setExpanded(!box._expanded);
	
};



//**************************
//�������ؼ�
//**************************
var __ScrollBar_ORIENTA_HORIZONTAL="horizontal";
var __ScrollBar_ORIENTA_VERTICAL="vertical";
var __ScrollBar_DROPMODE_MOUSEMOVE="mousemove";
var __ScrollBar_DROPMODE_MOUSEUP="mouseup";
var __ScrollBar_SILDER_MIN_SIZE=10;
function _$buildScrollBar(id,viewModel,orientation){
	var scrollBar=null;
	if(id){
		scrollBar=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(scrollBar==null){
		scrollBar=$$("TABLE");
		scrollBar.id=id;
		
	};
	if(!scrollBar.className)scrollBar.className="ScrollBar";
	scrollBar._class=scrollBar.className;
	scrollBar.getId=_$Component_getId;
	scrollBar.getViewModel=_$Component_getViewModel;
	scrollBar.isActive=_$Component_isActive;
	scrollBar.setVisible=_$Component_setVisible;
	scrollBar.activate=_$ScrollBar_activate;
	scrollBar.destroy=_$ScrollBar_destroy;
	scrollBar.getTag=_$Element_getTag;
	scrollBar.setTag=_$Element_setTag;
	scrollBar.getContext=_$Element_getContext;
	scrollBar.setContext=_$Element_setContext;
	scrollBar.reset=_$ScrollBar_reset;
	scrollBar.refresh=_$ScrollBar_refresh;
	scrollBar._$draggingPosition=_$ScrollBar_draggingPosition;
	scrollBar._$getDraggingTip=_$ScrollBar_getDraggingTip;
	scrollBar._$showDraggingTip=_$ScrollBar_showDraggingTip;
	scrollBar.getDragMode=_$ScrollBar_getDragMode;
	scrollBar.setDragMode=_$ScrollBar_setDragMode;
	scrollBar.getMin=_$ScrollBar_getMin;
	scrollBar.setMin=_$ScrollBar_setMin;
	scrollBar.getMax=_$ScrollBar_getMax;
	scrollBar.setMax=_$ScrollBar_setMax;
	scrollBar.getSmallChange=_$ScrollBar_getSmallChange;
	scrollBar.setSmallChange=_$ScrollBar_setSmallChange;
	scrollBar.getBigChange=_$ScrollBar_getBigChange;
	scrollBar.setBigChange=_$ScrollBar_setBigChange;
	scrollBar.getPageSize=_$ScrollBar_getPageSize;
	scrollBar.setPageSize=_$ScrollBar_setPageSize;
	scrollBar.getPosition=_$ScrollBar_getPosition;
	scrollBar.setPosition=_$ScrollBar_setPosition;
	scrollBar.isShowDraggingTip=_$ScrollBar_getShowDraggingTip;
	scrollBar.setShowDraggingTip=_$ScrollBar_setShowDraggingTip;	
	scrollBar.rebuild=_$ScrollBar_rebuild;
	scrollBar.onResize=_$ScrollBar_onResize;
	scrollBar._viewModel=viewModel;
	scrollBar._orientation=(orientation==null)?__ScrollBar_ORIENTA_HORIZONTAL:orientation;
	scrollBar._dragMode=__ScrollBar_DROPMODE_MOUSEMOVE;
	scrollBar._showDraggingTip=true;
	scrollBar._min=0;
	scrollBar._max=100;
	scrollBar._smallChange=20;
	scrollBar._bigChange=20;
	scrollBar._pageSize=20;
	scrollBar._position=0;
	return scrollBar;
	
};
KingfisherFactory._$registerComponentType("ScrollBar",_$buildScrollBar);
function _$ScrollBar_activate(){
	if(!this._active){
		this.rebuild();
		this._active=true;
		this.refresh();
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$ScrollBar_destroy(){
	this._btnUpLeft._scrollBar=null;
	this._btnDownRight._scrollBar=null;
	this._scrollbarSilder._scrollBar=null;
	this._scrollbarTrack._scrollBar=null;
	this._btnUpLeft=null;
	this._btnDownRight=null;
	this._scrollbarSilder=null;
	this._scrollbarTrack=null;
	this._draggingTip=null;
	
};
function _$ScrollBar_rebuild(){
	if(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
		this.style.height=1;
		
	}else {
		this.style.width=1;
		
	};
	for(var i=this.childNodes.length-1;i>=0;i--){
		this.removeChild(this.childNodes[i]);
		
	};
	this.border=0;
	this.cellSpacing=1;
	this.cellPadding=0;	
	var btnLeftUp=$$("IMG");
	var btnRightDown=$$("IMG");
	var slider=$$("IMG");
	var track=$$("TD");
	track.appendChild(slider);
	track.style.width="100%";
	track.style.height="100%";
	track.vAlign="top";

	this._btnUpLeft=btnLeftUp;
	this._btnDownRight=btnRightDown;
	this._scrollbarSilder=slider;
	this._scrollbarTrack=track;
	var tbody=$$("TBODY");
	var row,cell;
	if(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
		row=$$("TR");
		tbody.appendChild(row);
		cell=$$("TD");
		row.appendChild(cell);
		cell.appendChild(btnLeftUp);
		row.appendChild(track);
		cell=$$("TD");
		row.appendChild(cell);
		cell.appendChild(btnRightDown);
		
	}else {
		row=$$("TR");
		tbody.appendChild(row);
		cell=$$("TD");
		row.appendChild(cell);
		cell.appendChild(btnLeftUp);
		row=$$("TR");
		row.style.height="100%";
		tbody.appendChild(row);
		row.appendChild(track);
		row=$$("TR");
		tbody.appendChild(row);
		cell=$$("TD");
		row.appendChild(cell);
		cell.appendChild(btnRightDown);
		
	};
	this.appendChild(tbody);
	btnLeftUp._scrollBar=this;
	btnLeftUp.className="Button";	
	btnRightDown._scrollBar=this;
	btnRightDown.className="Button";
	track._scrollBar=this;
	slider.className=(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL?"H":"V") + "Silder";
	slider.style.position="relative";
	slider._mobile=false;
	slider._scrollBar=this;
	var arrowType;
	if(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
		arrowType="hori";
		
	}else {
		arrowType="vert";
		
	};
	_$setElementImage(slider,__SKIN_PATH+"/scrollbar/slider_"+arrowType+".gif");
	EventManager.addSystemEvent(btnLeftUp,"onclick",function (){
		_$ScrollBar$Button_onClick(btnLeftUp._scrollBar);
		event.cancelBubble=true;
		
	});
	EventManager.addSystemEvent(btnRightDown,"onclick",function (){
		_$ScrollBar$Button_onClick(btnRightDown._scrollBar);
		event.cancelBubble=true;
		
	});
	EventManager.addSystemEvent(track,"onclick",function (){
		_$ScrollBar$Button_onClick(btnLeftUp._scrollBar);
		event.cancelBubble=true;
		
	});
	EventManager.addSystemEvent(btnLeftUp,"onmousedown",function (){
		_$ScrollBar$Button_onMouseDown(btnLeftUp._scrollBar);
		
	});
	EventManager.addSystemEvent(btnRightDown,"onmousedown",function (){
		_$ScrollBar$Button_onMouseDown(btnRightDown._scrollBar);
		
	});
	EventManager.addSystemEvent(slider,"onmousedown",function (){
		_$ScrollBar$Silder_onMouseDown(slider);		
		
	});
	if(browserType==__Browser_IE){
		EventManager.addSystemEvent(slider,"onmouseup",function (){
			_$ScrollBar$Silder_onMouseUp(slider);
			event.cancelBubble=true;
			
		});
		EventManager.addSystemEvent(slider,"onmousemove",function (){
			_$ScrollBar$Silder_onMouseMove(slider);
			
		});
		
	}
};
function _$ScrollBar_reset(){
	this._position=0;
	this.refresh();
	
};
function _$ScrollBar_refresh(){
	if(!this._active)return ;
	if(this._max<this._min){
		this._max=this._min;
		
	};
	var interfix=(this._max-this._min);
	if(this._position>this._max)this._position=this._max;
	if(this._position<this._min)this._position=this._min;
	if(interfix>0){
		var amend=0;
		var silderSize;
		var silderPos;
		if(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
			//��ݹ�������������û���Ŀ��
			var trackWidth=this._scrollbarTrack.offsetWidth;
			silderSize=(this._pageSize/(interfix+this._pageSize))*trackWidth;
			if(trackWidth - silderSize >= 1){			
				var blankTrackWidth=trackWidth-silderSize;
				if(silderSize<__ScrollBar_SILDER_MIN_SIZE){
					silderSize=__ScrollBar_SILDER_MIN_SIZE;
					blankTrackWidth=trackWidth-silderSize;
					
				}else {
					amend=1;
					
				};
				if(this._position==this._max){
					silderPos=blankTrackWidth+amend;
					
				}else {
					silderPos=(this._position-this._min)/interfix*blankTrackWidth;
					
				};
				this._scrollbarSilder.style.width=silderSize;			
				this._scrollbarSilder.style.left=silderPos;
				this._scrollbarSilder._left=silderPos;

				this._btnUpLeft.disabled=false;
				this._btnDownRight.disabled=false;
				this._btnUpLeft.className="Button" + (this._scrollbarSilder._mobile?"_Down":"");
				this._btnDownRight.className="Button" + (this._scrollbarSilder._mobile?"_Down":"");
				_$setDisplay(this._scrollbarSilder,true);
			}
			else{
				this._btnUpLeft.disabled=true;
				this._btnDownRight.disabled=true;
				this._btnUpLeft.className="Button_Disabled";
				this._btnDownRight.className="Button_Disabled";
				_$setDisplay(this._scrollbarSilder,false);
			}
			
		}else {
			//��ݹ�������������û���ĸ߶�
			var trackHeight=this._scrollbarTrack.offsetHeight+1;
			silderSize=(this._pageSize/(interfix+this._pageSize))*trackHeight;
			var blankTrackHeight=trackHeight-silderSize;
			if(silderSize<__ScrollBar_SILDER_MIN_SIZE){
				amend=-1;
				silderSize=__ScrollBar_SILDER_MIN_SIZE;
				blankTrackHeight=trackHeight-silderSize;
				
			};
			if(this._position==this._max){
				silderPos=blankTrackHeight+amend;
				
			}else {
				silderPos=(this._position-this._min)/interfix*blankTrackHeight;
				
			};
			this._scrollbarSilder.style.height=silderSize;
			this._scrollbarSilder.style.top=silderPos;
			this._scrollbarSilder._top=silderPos;
			
			this._btnUpLeft.disabled=false;
			this._btnDownRight.disabled=false;
			this._btnUpLeft.className="Button" + (this._scrollbarSilder._mobile?"_Down":"");
			this._btnDownRight.className="Button" + (this._scrollbarSilder._mobile?"_Down":"");
			_$setDisplay(this._scrollbarSilder,true);
		};
		
	}else {
		this._btnUpLeft.disabled=true;
		this._btnDownRight.disabled=true;
		this._btnUpLeft.className="Button_Disabled";
		this._btnDownRight.className="Button_Disabled";
		_$setDisplay(this._scrollbarSilder,false);
		
	}
	
	var arrowType;
	if(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
		arrowType="hori";
		
	}else {
		arrowType="vert";
		
	};
	_$setElementImage(this._btnUpLeft,__SKIN_PATH+"/scrollbar/btn1_"+arrowType+(this._btnUpLeft.disabled?"_disabled":"")+".gif");
	_$setElementImage(this._btnDownRight,__SKIN_PATH+"/scrollbar/btn2_"+arrowType+(this._btnUpLeft.disabled?"_disabled":"")+".gif");
};
function _$ScrollBar_draggingPosition(){
	var interfix=(this._max-this._min);
	if(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
		var trackWidth=this._scrollbarTrack.offsetWidth;
		this.setPosition(this._scrollbarSilder._left/(trackWidth-this._scrollbarSilder.offsetWidth)*interfix+this._min);
		
	}else {
		var trackHeight=this._scrollbarTrack.offsetHeight;
		this.setPosition(this._scrollbarSilder._top/(trackHeight-this._scrollbarSilder.offsetHeight)*interfix+this._min);
		
	}
};
function _$ScrollBar_getDragMode(){
	return this._dragMode;
	
};
function _$ScrollBar_setDragMode(dragMode){
	this._dragMode=dragMode;
	
};
function _$ScrollBar_getMin(){
	return this._min;
	
};
function _$ScrollBar_setMin(min){
	this._min=min;
	this.refresh();
	
};
function _$ScrollBar_getMax(){
	return this._max;
	
};
function _$ScrollBar_setMax(max){
	this._max=max;
	this.refresh();
	
};
function _$ScrollBar_getSmallChange(){
	return this._smallChange;
	
};
function _$ScrollBar_setSmallChange(smallChange){
	this._smallChange=smallChange;
	
};
function _$ScrollBar_getBigChange(){
	return this._bigChange;
	
};
function _$ScrollBar_setBigChange(bigChange){
	this._bigChange=bigChange;
	
};
function _$ScrollBar_getPageSize(){
	return this._pageSize;
	
};
function _$ScrollBar_setPageSize(pageSize){
	this._pageSize=pageSize;
	this.refresh();
	
};
function _$ScrollBar_getPosition(){
	return this._position;
	
};
function _$ScrollBar_setPosition(position){
	var oldPosition=this._position;
	this._position=Math.round(position);
	this.refresh();
	_$fireKingfisherEvent(this,"onPositionChanged",[this,oldPosition]);
	
};
function _$ScrollBar_getShowDraggingTip(){
	return this._showDraggingTip;
	
};
function _$ScrollBar_setShowDraggingTip(showDraggingTip){
	this._showDraggingTip=showDraggingTip;
	
};
function _$ScrollBar$Button_onClick(scrollBar){
	var targ=_$getEventTarget();
	if(targ==scrollBar._btnUpLeft){
		scrollBar.setPosition(scrollBar._position-scrollBar._smallChange);
		
	}else if(targ==scrollBar._btnDownRight){
		scrollBar.setPosition(scrollBar._position+scrollBar._smallChange);
		
	}else if(targ==scrollBar._scrollbarTrack){
		var silderLeft,silderTop;
		var newSilderLeft,newSilderTop;
		var absPos=_$getAbsolutePosition(scrollBar._scrollbarSilder);
		silderLeft=absPos[0];
		silderTop=absPos[1];
		if(browserType==__Browser_IE){
			newSilderLeft=event.clientX+document.body.scrollLeft;
			newSilderTop=event.clientY+document.body.scrollTop;
			
		}else {
			newSilderLeft=event.pageX;
			newSilderTop=event.pageY;
			
		};
		var isBigChange;
		if(scrollBar._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
			isBigChange=(newSilderLeft>silderLeft);
			
		}else {
			isBigChange=(newSilderTop>silderTop);
			
		};
		var bigChange=((scrollBar._bigChange>0)?scrollBar._bigChange:scrollBar._pageSize);
		if(isBigChange){
			scrollBar.setPosition(scrollBar._position+bigChange);
			
		}else {
			scrollBar.setPosition(scrollBar._position-bigChange);
			
		}
	}
};
function _$ScrollBar$Button_onMouseDown(scrollBar){
	var targ=_$getEventTarget();
	if(targ==scrollBar._btnUpLeft){
		targ.className="Button_Down";
		
	}else if(targ==scrollBar._btnDownRight){
		targ.className="Button_Down";
		
	}
};
function _$ScrollBar$Silder_onMouseDown(slider){
	slider._mobile=true;
	slider._oldLeft=slider._left;
	slider._oldTop=slider._top;
	if(browserType==__Browser_IE){
		var targ=event.srcElement;
		targ.unselectable=true;
		slider._newLeft=event.clientX;
		slider._newTop=event.clientY;
		slider.setCapture(true);
		
	}else {
		var targ=event.target;
		targ.style.MozUserSelect="none";
		slider._newLeft=event.pageX;
		slider._newTop=event.pageY;		
		__ScrollBar_SILDER=slider;
		EventManager.addSystemEvent(window,"onmousemove",_$ScrollBar$Silder_NonIE_onMouseMove,true);
		EventManager.addSystemEvent(window,"onmouseup",_$ScrollBar$Silder_NonIE_onMouseUp,true);
		
	};
	var affinalScrollBar=slider._scrollBar;
	slider.className=(affinalScrollBar._orientation==__ScrollBar_ORIENTA_HORIZONTAL?"H":"V") + "Silder_Down";
	affinalScrollBar._btnUpLeft.className="Button_Down";
	affinalScrollBar._btnDownRight.className="Button_Down";
	
	if(affinalScrollBar._showDraggingTip){
		_$setDisplay(affinalScrollBar._$getDraggingTip(),true);
		affinalScrollBar._$showDraggingTip();
		
	}
};
function _$ScrollBar$Silder_onMouseUp(slider){
	var affinalScrollBar=slider._scrollBar;
	if(affinalScrollBar._showDraggingTip){
		_$setDisplay(affinalScrollBar._$getDraggingTip(),false);
		
	};
	slider._mobile=false;
	slider.className=(affinalScrollBar._orientation==__ScrollBar_ORIENTA_HORIZONTAL?"H":"V") + "Silder";
	affinalScrollBar._btnUpLeft.className="Button";
	affinalScrollBar._btnDownRight.className="Button";

	if(browserType==__Browser_IE){
		slider.releaseCapture();
		
	}else {
		EventManager._$removeSystemEvent(window,"onmousemove",_$ScrollBar$Silder_NonIE_onMouseMove,true);
		EventManager._$removeSystemEvent(window,"onmouseup",_$ScrollBar$Silder_NonIE_onMouseUp,true);
		__ScrollBar_SILDER=null;
		
	};
	if(slider._scrollBar._dragMode==__ScrollBar_DROPMODE_MOUSEUP){
		slider._scrollBar._$draggingPosition();
		
	}
};
function _$ScrollBar$Silder_onMouseMove(slider){
	if(!slider._mobile)return ;
	var x,y;
	if(browserType==__Browser_IE){
		x=event.clientX;
		y=event.clientY;
		
	}else {
		x=event.pageX;
		y=event.pageY;
		
	};
	var track=slider._scrollBar._scrollbarTrack;
	if(slider._scrollBar._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
		var left=(x-slider._newLeft)+slider._oldLeft;
		if(left<0)left=0;		
		var trackWidth=track.offsetWidth;
		if(left+slider.offsetWidth>trackWidth){
			left=trackWidth-slider.offsetWidth;
			
		};
		if(left==slider.style.left)return ;
		slider.style.left=left;
		slider._left=left;
		
	}else {
		var top=(y-slider._newTop)+slider._oldTop;
		if(top<0)top=0;
		var trackHeight=track.offsetHeight;
		if(top+slider.offsetHeight>trackHeight){
			top=trackHeight-slider.offsetHeight;
			
		};
		if(top==slider.style.top)return ;
		slider.style.top=top;
		slider._top=top;
		
	};
	var affinalScrollBar=slider._scrollBar;
	affinalScrollBar._$showDraggingTip();
	if(slider._scrollBar._dragMode==__ScrollBar_DROPMODE_MOUSEMOVE){
		slider._scrollBar._$draggingPosition();
		
	}
};
var __ScrollBar_SILDER=null;
function _$ScrollBar$Silder_NonIE_onMouseUp(){
	_$ScrollBar$Silder_onMouseUp(__ScrollBar_SILDER);
	
};
function _$ScrollBar$Silder_NonIE_onMouseMove(){
	_$ScrollBar$Silder_onMouseMove(__ScrollBar_SILDER);
	
};
function _$ScrollBar_onResize(){
	this.refresh();
	
};
function _$ScrollBar_getDraggingTip(){
	var label=this._draggingTip;
	if(label==null){
		label=$$("LABEL");
		label.className=this._class+"PositionLabel";
		label.style.display="none";
		label.style.position="absolute";
		document.body.appendChild(label);
		this._draggingTip=label;
		_$setElementShadow(this._draggingTip,true);
		
	};
	return label;
	
};
function _$ScrollBar_showDraggingTip(){
	if(!this._showDraggingTip)return ;	
	var label=this._$getDraggingTip();
	var slider=this._scrollbarSilder;
	var track=this._scrollbarTrack;
	var absPos=_$getAbsolutePosition(slider);
	var interfix=(this._max-this._min);
	var position;
	if(this._orientation==__ScrollBar_ORIENTA_HORIZONTAL){
		var trackWidth=track.offsetWidth;
		position=Math.round(this._scrollbarSilder._left/(trackWidth-this._scrollbarSilder.offsetWidth)*interfix+this._min);
		if(position>this._max)position=this._max;
		label.innerText=position+"/"+this._max;
		label.style.left=absPos[0]+((slider.offsetWidth-label.offsetWidth)/2);
		label.style.top=absPos[1]-label.offsetHeight-3;
		
	}else {
		var trackHeight=track.offsetHeight;
		position=Math.round(this._scrollbarSilder._top/(trackHeight-this._scrollbarSilder.offsetHeight)*interfix+this._min);
		if(position>this._max)position=this._max;
		label.innerText=position+"/"+this._max;
		label.style.left=absPos[0]-label.offsetWidth-3;
		label.style.top=absPos[1]+((slider.offsetHeight-label.offsetHeight)/2);
		
	}
};

//**************************
//��ݿؼ�����ķ��������Զ���
//**************************
function _$DataControl_activate(){
	if(!this._active){
		this._active=true;
		this.establishBinding();

		if(this._showQuickHelp && parseString(this._toolTip)!=""){
	    QuickHelp.add(new HelpItem(this, this._toolTip, this._helpDelay));
		}

		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$DataControl_getDataset(){
	return this._dataset;
	
};
function _$DataControl_setDataset(dataset){
	var oldDataset=this._dataset;
	this._dataset=kingfisher.feather.getDataset(dataset);
	if(this._active){
		if(oldDataset!=null)oldDataset.removeObserver(this);
		this.establishBinding();
		
	}
};
function _$DataControl_establishBinding(){
	var dataset=this._dataset;
	if(dataset!=null){
		if(isNaN(this._disableBindingCount))this._disableBindingCount=0;
		dataset.addObserver(this);
		
	}else if(this._disableBindingCount<=0){
		this.refresh();
		
	}
};
function _$DataControl_abolishBinding(){
	var dataset=this._dataset;
	if(dataset!=null&&dataset._window!=this._window){
		dataset.removeObserver(this);
		
	}
};
function _$DataControl_disableBinding(){
	this._disableBindingCount++;
	
};
function _$DataControl_enableBinding(){
	this._disableBindingCount--;
	
};
function _$SimpleDataControl_getField(){
	return this._field;
	
};
function _$SimpleDataControl_setField(field){
	this._field=field;
	
};


//**************************
//��ݵ������ؼ�
//**************************
function _$buildDataPilot(id,viewModel){
	
	var pilot=null;
	if(id){
		pilot=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(pilot==null){
		pilot=$$("TABLE");
		pilot.id=id;
		
	};
	pilot.cellPadding=0;
	pilot.cellSpacing=1;
	if(!pilot.className)pilot.className="DataPilot";
	pilot.getId=_$Component_getId;
	pilot.getViewModel=_$Component_getViewModel;
	pilot.isActive=_$Component_isActive;
	pilot.getTag=_$Element_getTag;
	pilot.setTag=_$Element_setTag;
	pilot.getContext=_$Element_getContext;
	pilot.setContext=_$Element_setContext;
	pilot.getDataset=_$DataControl_getDataset;
	pilot.setDataset=_$DataControl_setDataset;
	pilot.establishBinding=_$DataControl_establishBinding;
	pilot._$abolishBinding=_$DataControl_abolishBinding;
	pilot.activate=_$DataPilot_activate;
	pilot.processDatasetMessage=_$DataPilot_processDatasetMessage;
	pilot.disableBinding=_$DataControl_disableBinding;
	pilot.enableBinding=_$DataControl_enableBinding;
	pilot.refresh=_$DataPilot_refresh;
	pilot.destroy=_$DataPilot_destroy;
	pilot.getButtonNames=_$DataPilot_getButtonNames;
	pilot.setButtonNames=_$DataPilot_setButtonNames;
	pilot.isConfirmCancel=_$DataPilot_getConfirmCancel;
	pilot.setConfirmCancel=_$DataPilot_setConfirmCancel;
	pilot.isConfirmDelete=_$DataPilot_getConfirmDelete;
	pilot.setConfirmDelete=_$DataPilot_setConfirmDelete;
	pilot.setVisible=_$DataPilot_setVisible;
	pilot._$paint=_$DataPilot_paint;
	pilot._viewModel=viewModel;
	pilot._dataset=null;
	pilot._buttonNames="movefirst,moveprev,gopage,movenext,movelast,appendrecord,deleterecord,postrecord,cancelrecord";
	pilot._buttons=null;
	pilot._confirmDelete=true;
	pilot._confirmCancel=true;
	pilot._buildOver=false;
	return pilot;
	
};
KingfisherFactory._$registerComponentType("DataPilot",_$buildDataPilot);
function _$DataPilot_activate(){
	if(!this._active){
		this._active=true;
		this._$paint();		
		this.establishBinding();

		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$DataPilot_paint(){
	function _$buildFigure(button,buttonName){
		button._buttonName=buttonName;
		switch(buttonName){
			case "movefirst":{
				button.innerHTML="<FONT face=Webdings>9</FONT>";
				button.title=__DATAPILOT_MOVE_FIRST;
				button.style.paddingLeft=4;
				button.style.paddingRight=4;
				break;
				
			};
			case "prevpage":{
				button.innerHTML="<FONT face=Webdings>7</FONT>";
				button.title=__DATAPILOT_PREV_PAGE;
				button.style.paddingLeft=4;
				button.style.paddingRight=4;
				break;
				
			};
			case "moveprev":{
				button.innerHTML="<FONT face=Webdings>3</FONT>";
				button.title=__DATAPILOT_MOVE_PREV;
				button.style.paddingLeft=4;
				button.style.paddingRight=4;
				break;
				
			};
			case "gopage":{
				button.innerHTML="<FONT face=BatangChe>go</FONT>";
				button.style.width="24px";
				button.title=__PAGEPILOT_GOTO;
				button.style.paddingLeft=4;
				button.style.paddingRight=4;
				break;
				
			};
			case "movenext":{
				button.innerHTML="<FONT face=Webdings>4</FONT>";
				button.title=__DATAPILOT_MOVE_NEXT;
				button.style.paddingLeft=4;
				button.style.paddingRight=4;
				break;
				
			};
			case "nextpage":{
				button.innerHTML="<FONT face=Webdings>8</FONT>";
				button.title=__DATAPILOT_NEXT_PAGE;
				button.style.paddingLeft=4;
				button.style.paddingRight=4;
				break;
				
			};
			case "movelast":{
				button.innerHTML="<FONT face=Webdings>:</FONT>";
				button.title=__DATAPILOT_MOVE_LAST;
				button.style.paddingLeft=4;
				button.style.paddingRight=4;
				break;
				
			};
			case "insertrecord":{
				
				button.innerText=__DATAPILOT_INSERT_RECORD;
				button.title=__DATAPILOT_INSERT_RECORD;
				button.style.paddingLeft=3;
				button.style.paddingRight=3;
				break;
				
			};
			case "appendrecord":{
				button.innerText=__DATAPILOT_APPEND_RECORD;
				button.title=__DATAPILOT_APPEND_RECORD;
				button.style.paddingLeft=3;
				button.style.paddingRight=3;
				break;
				
			};
			case "deleterecord":{
				button.innerText=__DATAPILOT_DELETE_RECORD;
				button.title=__DATAPILOT_DELETE_RECORD;
				button.style.paddingLeft=3;
				button.style.paddingRight=3;
				break;
				
			};
			case "postrecord":{
				button.innerText=__DATAPILOT_POST_RECORD;
				button.title=__DATAPILOT_POST_RECORD;
				button.style.paddingLeft=3;
				button.style.paddingRight=3;
				break;
				
			};
			case "cancelrecord":{
				button.innerText=__DATAPILOT_CANCEL_RECORD;
				button.title=__DATAPILOT_CANCEL_RECORD;
				button.style.paddingLeft=3;
				button.style.paddingRight=3;
				break;
				
			}
		}
	};
	var tbody=this._tbody;
	if(tbody!=null){
		this.removeChild(tbody);
		for(var i=tbody.childNodes.length-1;i>=0;i--){
			tbody.removeChild(tbody.childNodes[i]);
			
		}
	}else {
		tbody=$$("TBODY");
		this._tbody=tbody;
		
	};
	var buttons=new Array();
	this._buttons=buttons;
	var pilot=this;	
	var row=$$("TR");
	var buttonNames=this._buttonNames.split(",");
	for(var i=0;i<buttonNames.length;i++){
		var buttonName=buttonNames[i];
		var cell=$$("TD");
		var button=KingfisherFactory.create("Button",null,null);
		_$buildFigure(button,buttonName);
		button.disabled=true;
		button._dataset=this._dataset;
		EventManager.addSystemEvent(button,"onclick",function (){
			_$DataPilot_onClick(pilot);
			
		});
		if(buttonName=="gopage"){
			this._goButton=button;
			
			var editor=KingfisherFactory.create("TextEditor",null,"__datapilot_pageno"+_$genControlId());
			editor.className="PageNo";
			editor.readOnly=true;
			editor.maxLength=4;
			editor.onFocus=null;
			editor.onBlur=null;
			EventManager.addSystemEvent(editor,"onkeydown",function (){
				if(event.keyCode==13 && pilot._goButton && !pilot._goButton.disabled){
					pilot._goButton.focus();
				}
			});
			cell.appendChild(editor);

			var editor=KingfisherFactory.create("TextEditor",null,"__datapilot_pagecount"+_$genControlId());
			editor.className="PageCount";
			editor.readOnly=true;
			editor.onFocus=null;
			editor.onBlur=null;
			cell.appendChild(editor);
		}
		buttons.push(button);
		cell.appendChild(button);
		row.appendChild(cell);
		
	};
	tbody.appendChild(row);
	this.appendChild(tbody);
	this._buildOver=true;
	
};
function _$DataPilot_refresh(){
	this.processDatasetMessage(__Dataset_MSG_REFRESH,this._dataset,null);
	
};
function _$DataPilot_destroy(){
	this._$abolishBinding();
	this._tbody=null;
	this._buttons=null;
	this._goButton=null;
	
};
function _$DataPilot_setVisible(visible){
	if(parseBoolean(visible))
		this.style.visibility = 'visible';
	else
		this.style.visibility = 'hidden';
};
function _$DataPilot_getButtonNames(){
	return this._buttonNames;
	
};
function _$DataPilot_setButtonNames(buttonNames){
	if(buttonNames!=null)buttonNames=buttonNames.toLowerCase();
	this._buttonNames=buttonNames;
	if(this._active){
		this._$paint();
		
	}
};
function _$DataPilot_getConfirmCancel(){
	return this._confirmCancel;
	
};
function _$DataPilot_setConfirmCancel(confirmCancel){
	this._confirmCancel=confirmCancel;
	
};
function _$DataPilot_getConfirmDelete(){
	return this._confirmDelete;
	
};
function _$DataPilot_setConfirmDelete(confirmDelete){
	this._confirmDelete=confirmDelete;
	
};
function _$DataPilot_processDatasetMessage(message,dataset,args){
	function _$refreshSubItem(button,dataset){
		var buttonName=button._buttonName;
		switch(buttonName){
			case "movefirst":{
				//alert(dataset.isFirst());
				//button.disabled=dataset.isFirst();
				button.disabled=(dataset.getPageIndex()<=1);
				break;
				
			};
			case "prevpage":{
				button.disabled=(dataset.getPageIndex()<=1);
				break;
				
			};
			case "moveprev":{
				button.disabled=dataset.isFirst();
				break;
				
			};
			case "gopage":{
				var txtPageCount=button.previousSibling;
				txtPageCount.setValue("/"+dataset.getPageCount());
				var txtPageNo=txtPageCount.previousSibling;
				txtPageNo.setValue(dataset.getPageIndex());
				txtPageNo.readOnly=!(dataset.getPageCount()>1);
				button.disabled=!(dataset.getPageCount()>1);
				break;
				
			};
			case "movenext":{
				button.disabled=dataset.isLast();
				break;
				
			};
			case "nextpage":{
				button.disabled=(dataset.getPageIndex()>=dataset.getPageCount());
				break;
				
			};
			case "movelast":{
				//button.disabled=dataset.isLast();
				button.disabled=(dataset.getPageIndex()>=dataset.getPageCount());
				break;
				
			};
			case "insertrecord":;
			case "appendrecord":{
				button.disabled=dataset.isReadOnly();
				break;
				
			};
			case "deleterecord":{
				var record=dataset._current;
				button.disabled=(record==null||dataset.isReadOnly()||!record.isCanDelete());
				break;
				
			};
			case "postrecord":;
			case "cancelrecord":{
				var record=dataset._current;
				button.disabled=(record==null||(!record.isDirty()&&record._state!=__Record_STATE_NEW));
				break;
				
			}
		}
	}
	switch(message){
		case __Dataset_MSG_CURRENT_CHANGED:{
			if(this._pageIndex==dataset.getPageIndex()){
				break;
				
			}
		};
		case __Dataset_MSG_REFRESH:;
		case __Dataset_MSG_STATE_CHANGED:;
		case __Dataset_MSG_RECORD_STATE_CHANGED:{
			this._pageIndex=((dataset!=null)?dataset.getPageIndex():1);
			var buttons=this._buttons;
			for(var i=0;i<buttons.length;i++){
				try{
					var button=buttons[i];
					button._dataset=dataset;
					if(this._onRefreshButton!=null){
						var result=_$fireKingfisherEvent(this,"onRefreshButton",[this,button,button._buttonName]);
						if(result!=null)throw result;
						
					};
					if(dataset!=null){
						_$refreshSubItem(button,dataset);
						
					}else {
						button.disabled=true;
						
					}
				}catch(e){
					_$processException(e);
					
				}
			};
			break;
			
		}
	}
};
function _$DataPilot_onClick(pilot){
	var button=_$getEventTarget();
	if(pilot._onButtonClick!=null&&!_$fireKingfisherEvent(pilot,"onButtonClick",[pilot,button,button._buttonName])){
		return ;
		
	};
	var dataset=button._dataset;
	switch(button._buttonName){
		
		case "movefirst":{
			if(!dataset.isAutoLoadPage()&&dataset.getPageIndex()>1){
				dataset.setPageIndex(1);
				dataset.flushData();
				
			};
			dataset.moveFirst();
			break;
			
		};
		case "prevpage":{
			if(dataset.isAutoLoadPage()){
				dataset.moveToPage(dataset.getPageIndex()-1);
				
			}else if(dataset.getPageIndex()>1){
				dataset.setPageIndex(dataset.getPageIndex()-1);
				dataset.flushData();
				
			};
			break;
			
		};
		case "moveprev":{
			dataset.movePrev();
			break;
			
		};
		case "gopage":{
			var txtPageNo=button.previousSibling.previousSibling;
			var pageIndex=parseInt(txtPageNo.getValue());
			if(isNaN(pageIndex)||pageIndex<1||pageIndex>dataset.getPageCount()){
				alert(__PAGEPILOT_INVALID_PAGEINDEX);
				txtPageNo.value=dataset.getPageIndex();
				return ;
				
			};
			
			if(dataset.isAutoLoadPage()){
				dataset.moveToPage(pageIndex);
				
			}else{
				dataset.setPageIndex(pageIndex);
				dataset.flushData();
				
			};
			break;
			
		};
		case "movenext":{
			dataset.moveNext();
			break;
			
		};
		case "nextpage":{
			if(dataset.isAutoLoadPage()){
				dataset.moveToPage(dataset.getPageIndex()+1);
				
			}else if(dataset.getPageIndex()<dataset.getPageCount()){
				dataset.setPageIndex(dataset.getPageIndex()+1);
				dataset.flushData();
				
			};
			break;
			
		};
		case "movelast":{
			if(!dataset.isAutoLoadPage()&&dataset.getPageIndex()<dataset.getPageCount()){
				dataset.setPageIndex(dataset.getPageCount());
				dataset.flushData();
				
			};
			dataset.moveLast();
			break;
			
		};
		case "insertrecord":{
			dataset.insertRecord("before");
			break;
			
		};
		case "appendrecord":{
			dataset.insertRecord();
			break;			
			
		};
		case "deleterecord":{
			if(!pilot._confirmDelete||confirm(__CONFIRM_DELETE_RECORD)){
				dataset.deleteRecord();
				
			};
			break;
			
		};
		case "postrecord":{
			dataset.postRecord();
			break;
			
		};
		case "cancelrecord":{
			if(!pilot._confirmCancel||confirm(__CONFIRM_CANCEL_RECORD)){
				dataset.cancelRecord();
				
			};
			break;
			
		}
	}
};


//**************************
//ҳ�뵼�����ؼ�
//**************************
var __PagePilot_TYPE_LINK="link";
var __PagePilot_TYPE_BUTTON="button";
function _$buildPagePilot(id,viewModel){
	var pilot=null;
	if(id){
		pilot=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(pilot==null){
		pilot=$$("TABLE");
		pilot.id=id;
		
	};
	pilot.cellPadding=0;
	pilot.cellSpacing=1;
	if(!pilot.className)pilot.className="PagePilot";
	pilot.getId=_$Component_getId;
	pilot.getViewModel=_$Component_getViewModel;
	pilot.isActive=_$Component_isActive;
	pilot.setVisible=_$Component_setVisible;
	pilot.getTag=_$Element_getTag;
	pilot.setTag=_$Element_setTag;
	pilot.getContext=_$Element_getContext;
	pilot.setContext=_$Element_setContext;
	pilot.getDataset=_$DataControl_getDataset;
	pilot.setDataset=_$DataControl_setDataset;
	pilot.establishBinding=_$DataControl_establishBinding;
	pilot._$abolishBinding=_$DataControl_abolishBinding;
	pilot.activate=_$DataControl_activate;
	pilot.processDatasetMessage=_$PagePilot_processDatasetMessage;
	pilot.disableBinding=_$DataControl_disableBinding;
	pilot.enableBinding=_$DataControl_enableBinding;	
	pilot.refresh=_$PagePilot_refresh;
	pilot.destroy=_$PagePilot_destroy;
	pilot.getPilotType=_$PagePilot_getPilotType;
	pilot.setPilotType=_$PagePilot_setPilotType;
	pilot.getMaxLink=_$PagePilot_getMaxLink;
	pilot.setMaxLink=_$PagePilot_setMaxLink;
	pilot.isShowPageInfo=_$PagePilot_getShowPageInfo;
	pilot.setShowPageInfo=_$PagePilot_setShowPageInfo;
	pilot.isShowGotoButton=_$PagePilot_getShowGotoButton;
	pilot.setShowGotoButton=_$PagePilot_setShowGotoButton;
	pilot.setVisible=_$PagePilot_setVisible;
	pilot._$paint=_$PagePilot_paint;
	pilot._viewModel=viewModel;
	pilot._pageIndex=0;
	pilot._dataset=null;
	pilot._pilotType=__PagePilot_TYPE_LINK;
	pilot._maxLink=10;
	pilot._showPageInfo=true;
	pilot._showGotoButton=true;
	pilot._buildOver=false;
	return pilot;
	
};
KingfisherFactory._$registerComponentType("PagePilot",_$buildPagePilot);
function _$PagePilot_paint(){
	var row=this._barRow;
	if(row!=null){
		//clear all info
		for(var i=row.childNodes.length-1;i>=0;i--){
			row.removeChild(row.childNodes[i]);
			
		}
	}else {
		var tbody=$$("TBODY");
		var row=$$("TR");
		tbody.appendChild(row);
		this.appendChild(tbody);
		this._barRow=row;
		
	};
	var cell;
	cell=$$("TD");
	row.appendChild(cell);
	this._contentOuterCell=cell;
	var pagePilot=this;
	if(this._pilotType==__PagePilot_TYPE_LINK){
		cell.noWrap=true;
		EventManager.addSystemEvent(cell,"onclick",function (){
			_$PagePilot$Link_onClick(_$getEventTarget(),pagePilot);
			
		});
		
	}else {
		var button;
		button=KingfisherFactory.create("Button",null,null);
		button._kingfisherClass="PagePilot_MoveFirst";
		button.innerHTML="<FONT face=Webdings>9</FONT>";
		button.title=__PAGEPILOT_FIRST_PAGE;
		button.style.width=30;
		cell.appendChild(button);
		button=KingfisherFactory.create("Button",null,null);
		button._kingfisherClass="PagePilot_PrevPage";
		button.innerHTML="<FONT face=Webdings>7</FONT>";
		button.title=__PAGEPILOT_PREV_PAGE;
		button.style.width=30;
		button.style.marginLeft=1;
		cell.appendChild(button);
		button=KingfisherFactory.create("Button",null,null);
		button._kingfisherClass="PagePilot_NextPage";
		button.innerHTML="<FONT face=Webdings>8</FONT>";
		button.title=__PAGEPILOT_NEXT_PAGE;
		button.style.width=30;
		button.style.marginLeft=1;
		cell.appendChild(button);
		button=KingfisherFactory.create("Button",null,null);
		button._kingfisherClass="PagePilot_MoveLast";
		button.innerHTML="<FONT face=Webdings>:</FONT>";
		button.title=__PAGEPILOT_LAST_PAGE;
		button.style.width=30;
		button.style.marginLeft=1;
		cell.appendChild(button);
		EventManager.addSystemEvent(cell,"onclick",function (){
			_$PagePilot$Button_onClick(_$getEventTarget(),pagePilot);
			
		});
		
	}
	if(this._showPageInfo){
		cell=$$("TD");
		cell.style.width="8";
		row.appendChild(cell);
		cell=$$("TD");
		cell.align="right";
		cell.style.whiteSpace="nowrap";
		row.appendChild(cell);
		this._pageInfoCell=cell;
		
	};
	if(this._showGotoButton){
		cell=$$("TD");
		cell.style.width="8";
		row.appendChild(cell);
		var editor=KingfisherFactory.create("TextEditor",null,null);
		editor.style.width="30";
		cell=$$("TD");
		cell.style.width="1";
		cell.appendChild(editor);
		row.appendChild(cell);
		this._txtGotoCell=cell;
		var button=KingfisherFactory.create("Button",null,null);
		button.setValue("go");
		button.title=__PAGEPILOT_GOTO;
		cell=$$("TD");
		cell.style.width="1";
		cell.appendChild(button);
		row.appendChild(cell);
		this._btnGotoCell=cell;
		EventManager.addSystemEvent(button,"onclick",function (){
			_$PagePilot$Goto_onClick(pagePilot);
			
		});
		
	};
	this._buildOver=true;	
};
function _$PagePilot_destroy(){
	this._$abolishBinding();
	this._barRow=null;
	this._contentOuterCell=null;
	this._txtGotoCell=null;
	this._btnGotoCell=null;
	this._pageInfoCell=null;
	
};
function _$PagePilot_setVisible(visible){
	if(parseBoolean(visible))
		this.style.visibility = 'visible';
	else
		this.style.visibility = 'hidden';
};
function _$PagePilot_getShowPageInfo(){
	return this._showPageInfo;	
	
};
function _$PagePilot_setShowPageInfo(showPageInfo){
	this._showPageInfo=showPageInfo;
	
};
function _$PagePilot_getShowGotoButton(){
	return this._showGotoButton;
	
};
function _$PagePilot_setShowGotoButton(showGotoButton){
	this._showGotoButton=showGotoButton;
	
};
function _$PagePilot_getPilotType(){
	return this._pilotType;
	
};
function _$PagePilot_setPilotType(pilotType){
	this._pilotType=pilotType;
	
};
function _$PagePilot_getMaxLink(){
	return this._maxLink;
	
};
function _$PagePilot_setMaxLink(maxLink){
	this._maxLink=maxLink;
	
};
function _$PagePilot_processDatasetMessage(message,dataset,args){
	if(!this._buildOver){
		this._$paint();
		
	};
	switch(message){
		case __Dataset_MSG_REFRESH:{
			this.refresh();
			break;
			
		};
		case __Dataset_MSG_CURRENT_CHANGED:{
			if(dataset.getPageIndex()!=this._pageIndex){
				this.refresh();
				
			};
			break;
			
		}
	}
};
function _$PagePilot_refresh(){
	function _$buildPageLink(pagePilot,dataset,pageIndex){
		var label=$$("LABEL");
		label._pageIndex=pageIndex;
		label.innerText=pageIndex;
		if(pageIndex==dataset.getPageIndex()){
			label.className="CurrentPageLink";
			
		}else if(dataset.isPageLoaded(pageIndex)){
			label.className="VisitedPageLink";			
			
		}else {
			label.className="PageLink";
			
		};
		return label;
		
	};
	var dataset=this._dataset;
	var pageIndex=dataset.getPageIndex();
	var pageCount=dataset.getPageCount();
	var contentCell=this._contentOuterCell;
	if(this._pilotType==__PagePilot_TYPE_LINK){
		contentCell.innerHTML="";
		var maxLink=this.getMaxLink();
		var beginPageIndex=pageIndex-parseInt(maxLink/2);
		if(beginPageIndex>(pageCount-maxLink+1)){
			beginPageIndex=pageCount-maxLink+1;
			
		};
		if(beginPageIndex<1){
			beginPageIndex=1;
			
		};
		var endPageIndex=beginPageIndex+maxLink-1;
		if(endPageIndex>pageCount){
			endPageIndex=pageCount;
			
		};
		if(beginPageIndex>1){
			contentCell.appendChild(_$buildPageLink(this,dataset,1));
			if(beginPageIndex>2){
				contentCell.appendChild(document.createTextNode("..."));
				
			}
		};
		for(var i=beginPageIndex;i<=endPageIndex;i++){
			contentCell.appendChild(_$buildPageLink(this,dataset,i));
			
		};
		if(endPageIndex<pageCount){
			if(endPageIndex<pageCount-1){
				contentCell.appendChild(document.createTextNode("..."));
				
			};
			contentCell.appendChild(_$buildPageLink(this,dataset,pageCount));
			
		}
	}else {
		var childNodes=contentCell.childNodes;
		for(var i=0;i<childNodes.length;i++){
			var button=childNodes[i];
			switch(button._kingfisherClass){
				case "PagePilot_MoveFirst":{
					button.disabled=(pageIndex<=1);					
					break;
					
				};
				case "PagePilot_PrevPage":{
					button.disabled=(pageIndex<=1);
					break;
					
				};
				case "PagePilot_NextPage":{
					button.disabled=(pageIndex>=pageCount);
					break;
					
				};
				case "PagePilot_MoveLast":{
					button.disabled=(pageIndex>=pageCount);
					break;
					
				}
			}
		}
	};
	if(this._pageInfoCell!=null){
		var text=__DATAPILOT_PAGEINFO.replace("${pageIndex}",dataset.getPageIndex());
		text=text.replace("${pageCount}",dataset.getPageCount());
		this._pageInfoCell.innerText=text;
		
	};
	if(this._showGotoButton){
		var txtGoto=this._txtGotoCell.firstChild;
		txtGoto.value=pageIndex;
		
	};
	this._pageIndex=pageIndex;
	
};
function _$PagePilot$Link_onClick(pageLink,pagePilot){
	if(pageLink.className!="CurrentPageLink"){
		var dataset=pagePilot._dataset;
		if(dataset.isAutoLoadPage()){
			dataset.moveToPage(pageLink._pageIndex);
			
		}else if(pageLink._pageIndex>=1&&pageLink._pageIndex<=dataset.getPageCount()){
			dataset.setPageIndex(pageLink._pageIndex);
			dataset.flushData();
			
		}
	}
};
function _$PagePilot$Button_onClick(button,pagePilot){
	var dataset=pagePilot._dataset;
	var pageIndex=dataset.getPageIndex();
	var pageCount=dataset.getPageCount();
	switch(button._kingfisherClass){
		case "PagePilot_MoveFirst":{
			if(dataset.isAutoLoadPage()){
				dataset.moveToPage(1);				
				
			}else if(pageIndex>1){
				dataset.setPageIndex(1);
				dataset.flushData();
				
			};
			break;
			
		};
		case "PagePilot_PrevPage":{
			if(dataset.isAutoLoadPage()){
				dataset.moveToPage(pageIndex-1);
				
			}else if(pageIndex>1){
				dataset.setPageIndex(pageIndex-1);
				dataset.flushData();
				
			};
			break;
			
		};
		case "PagePilot_NextPage":{
			if(dataset.isAutoLoadPage()){
				dataset.moveToPage(pageIndex+1);
				
			}else if(pageIndex<pageCount){
				dataset.setPageIndex(pageIndex+1);
				dataset.flushData();
				
			};
			break;
			
		};
		case "PagePilot_MoveLast":{
			if(dataset.isAutoLoadPage()){
				dataset.moveToPage(pageCount);
				
			}else if(pageIndex<pageCount){
				dataset.setPageIndex(pageCount);
				dataset.flushData();
				
			};
			break;
			
		}
	}
};
function _$PagePilot$Goto_onClick(pagePilot){
	var dataset=pagePilot._dataset;
	var txtGoto=pagePilot._txtGotoCell.firstChild;
	var pageIndex=parseInt(txtGoto.value);
	if(isNaN(pageIndex)||pageIndex<1||pageIndex>dataset.getPageCount()){
		alert(__PAGEPILOT_INVALID_PAGEINDEX);
		txtGoto.value=dataset.getPageIndex();
		return ;
		
	};
	if(dataset.isAutoLoadPage()){
		dataset.moveToPage(pageIndex);
		
	}
	else if(dataset.getPageCount()>1){
		dataset.setPageIndex(pageIndex);
		dataset.flushData();
		
	}
};


//**************************
//����ؼ��ؼ�
//**************************
var __Calendar_TYPE_SIMPLE="simple";        //����ģʽ//
var __Calendar_TYPE_SCHEDULE="schedule";    //�ճ̰��ű�ģʽ//
function _$buildCalendar(id,viewModel){
	var calendar=null;
	if(id){
		calendar=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(calendar==null){
		calendar=$$("DIV");
		calendar.style.width=400;
		calendar.style.height=300;
		calendar.id=id;
		
	};
	if(!calendar.className)calendar.className="Calendar";
	calendar.getId=_$Component_getId;
	calendar.getViewModel=_$Component_getViewModel;
	calendar.isActive=_$Component_isActive;
	calendar.activate=_$Calendar_activate;
	calendar.destroy=_$Calendar_destroy;
	calendar.getTag=_$Element_getTag;
	calendar.setTag=_$Element_setTag;
	calendar.getContext=_$Element_getContext;
	calendar.setContext=_$Element_setContext;
	calendar.getDataset=_$DataControl_getDataset;
	calendar.setDataset=_$DataControl_setDataset;
	calendar.getField=_$SimpleDataControl_getField;
	calendar.setField=_$SimpleDataControl_setField;
	calendar.establishBinding=_$DataControl_establishBinding;
	calendar._$abolishBinding=_$DataControl_abolishBinding;
	calendar.processDatasetMessage=_$Calendar_processDatasetMessage;
	calendar.disableBinding=_$DataControl_disableBinding;
	calendar.enableBinding=_$DataControl_enableBinding;
	calendar.refresh=_$Calendar_refresh;
	calendar.setCalendarType=_$Calendar_setCalendarType;
	calendar.getCalendarType=_$Calendar_getCalendarType;
	calendar.setDate=_$Calendar_setDate;
	calendar.getDate=_$Calendar_getDate;
	calendar.setDateX=_$Calendar_setDateX;
	calendar.onKeyDown=_$Calendar_onKeyDown;
	calendar.onKeyUp=_$Calendar_onKeyUp;
	calendar.refresh=_$Calendar_refresh;	
	calendar.post=_$Calendar_post;
	calendar.getRecords=_$Calendar_getRecords;
	calendar._$paint=_$Calendar_paint;
	calendar._$showMonthlyDate=_$Calendar_showMonthlyDate;
	calendar._$tabular=_$Calendar_tabular;
	calendar._$setCurrentDayStyle=_$Calendar_setCurrentDayStyle;
	calendar._$changeDate=_$Calendar_changeDate;
	calendar._$getMonthMaxDay=_$Calendar_getMonthMaxDay;
	calendar._$refreshCellValue=_$Calendar_refreshCellValue;
	calendar._$refreshCellStyle=_$Calendar_refreshCellStyle;
	calendar._viewModel=viewModel;
	calendar._dataset=null;
	calendar._field=null;
	calendar._calendarType=__Calendar_TYPE_SIMPLE;
	calendar._txtMonth=null;
	calendar._txtYear=null;
	calendar.calendarCells=null;
	calendar._currentCell=null;
	calendar._localize=true;
	return calendar;
	
};
KingfisherFactory._$registerComponentType("Calendar",_$buildCalendar);
function _$Calendar_destroy(){
	this._$abolishBinding();
	var cells=this.calendarCells;
	for(var i=0;i<cells.length;i++){
		delete cells[i];
		
	};
	this.calendarCells=null;
	this._currentCell=null;
	this._txtMonth=null;
	this._txtYear=null;
	
};
function _$Calendar_paint(){
	var table=$$("TABLE");
	var tbody=$$("TBODY");
	table.style.width="100%";
	table.style.height="100%";
	table.cellSpacing=0;
	table.cellPadding=_$getPreferenceSetting("__Calendar_CellPadding");

	var calendar=this;
	var row,cell,dateInput;
	row=$$("TR");
	row.className="Header";	
	cell=$$("TD");
	var dateControlPanel=$$("TABLE");
	var dateControlBody,dateControlRow,dateControlCell;
	dateControlBody=$$("TBODY");
	dateControlPanel.cellPadding=0;
	dateControlPanel.cellSpacing=0;
	dateControlPanel.align="center";
	dateControlRow=$$("TR");
	var button=KingfisherFactory.create("Button",null,null);
	button.innerHTML="<FONT face=Webdings>3</FONT>";
	_$setElementBgImage(button,"");
	dateControlCell=$$("TD");
	dateControlCell.appendChild(button);
	dateControlRow.appendChild(dateControlCell);
	EventManager.addSystemEvent(button,"onclick",function (){
		_$Calendar_previousMonth(calendar);
		
	});
	dateControlCell=$$("TD");
	dateControlCell.style.width=1;
	dateControlRow.appendChild(dateControlCell);
	dateInput=$$("INPUT");
	dateInput.style.width=23;
	dateInput.className="TextEditor";
	this._txtMonth=dateInput;
	dateControlCell=$$("TD");
	dateControlCell.appendChild(dateInput);
	dateControlRow.appendChild(dateControlCell);
	EventManager.addSystemEvent(dateInput,"onkeyup",function (){
		calendar.onKeyUp();
		
	});
	dateControlCell=$$("TD");
	dateControlCell.style.width=1;
	dateControlRow.appendChild(dateControlCell);
	button=KingfisherFactory.create("Button",null,null);
	button.innerHTML="<FONT face=Webdings>4</FONT>";
	_$setElementBgImage(button,"");
	dateControlCell=$$("TD");
	dateControlCell.appendChild(button);
	dateControlRow.appendChild(dateControlCell);
	EventManager.addSystemEvent(button,"onclick",function (){
		_$Calendar_nextMonth(calendar);
		
	}
	);
	dateControlCell=$$("TD");
	dateControlCell.style.width=6;
	dateControlRow.appendChild(dateControlCell);
	button=KingfisherFactory.create("Button",null,null);
	button.innerHTML="<FONT face=Webdings>3</FONT>";
	_$setElementBgImage(button,"");
	dateControlCell=$$("TD");
	dateControlCell.appendChild(button);
	dateControlRow.appendChild(dateControlCell);
	EventManager.addSystemEvent(button,"onclick",function (){
		_$Calendar_previousYear(calendar);
		
	});
	dateControlCell=$$("TD");
	dateControlCell.style.width=1;
	dateControlRow.appendChild(dateControlCell);
	dateInput=$$("INPUT");
	dateInput.style.width=43;
	dateInput.className="TextEditor";
	this._txtYear=dateInput;
	dateControlCell=$$("TD");
	dateControlCell.appendChild(dateInput);
	dateControlRow.appendChild(dateControlCell);
	EventManager.addSystemEvent(dateInput,"onkeyup",function (){
		calendar.onKeyUp();
		
	});
	dateControlCell=$$("TD");
	dateControlCell.style.width=1;
	dateControlRow.appendChild(dateControlCell);
	button=KingfisherFactory.create("Button",null,null);
	button.innerHTML="<FONT face=Webdings>4</FONT>";
	_$setElementBgImage(button,"");
	dateControlCell=$$("TD");
	dateControlCell.appendChild(button);
	dateControlRow.appendChild(dateControlCell);
	EventManager.addSystemEvent(button,"onclick",function (){
		_$Calendar_nextYear(calendar);
		
	});
	dateControlBody.appendChild(dateControlRow);
	dateControlPanel.appendChild(dateControlBody);
	cell.appendChild(dateControlPanel);	
	row.appendChild(cell);
	tbody.appendChild(row);
	row=$$("TR");
	row.style.height="100%";
	cell=$$("TD");
	cell.appendChild(this._$tabular());
	row.appendChild(cell);
	tbody.appendChild(row);
	row=$$("TR");
	row.className="Footer";
	cell=$$("TD");
	button=KingfisherFactory.create("Button",null,null);
	button.innerText=__CALENDAR_TODAY+" "+formatDate(new Date(),"yyyy-MM-dd");
	cell.align="right";
	cell.appendChild(button);
	EventManager.addSystemEvent(button,"onclick",function (){
		_$Calendar_today(calendar);
		
	});
	row.appendChild(cell);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.appendChild(table);
	
};
function _$Calendar_tabular(){
	var table=$$("TABLE");
	table.className="CalendarTable";
	table.style.tableLayout="fixed";
	table.border=_$getPreferenceSetting("__Calendar_DateTable_BorderWidth");
	table.borderColor=_$getPreferenceSetting("__Calendar_DateTable_BorderColor");
	table.style.width="100%";
	table.style.height="100%";
	var tbody=$$("TBODY");
	var row=$$("TR");
	for(var i=0;i<7;i++){
		var cell=$$("TD");
		cell.align="center";
		cell.vAlign="center";
		row.appendChild(cell);
		
	};
	tbody.appendChild(row);
	var weekRow=row;
	this.calendarCells=new Array();
	for(var i=0;i<6;i++){
		
		var dayRow=row.cloneNode(true);
		for(var j=0;j<7;j++){
			var cell=dayRow.childNodes[j];
			cell._kingfisherClass="CalendarCell";
			this.calendarCells.push(cell);
			
		};
		tbody.appendChild(dayRow);
		
	};
	table.appendChild(tbody);
	weekRow.className="Header";
	for(var i=0;i<7;i++){
		var cell=weekRow.childNodes[i];
		cell.innerText=__CALENDAR_DAYS.charAt(i);
		
	};
	var calendar=this;
	EventManager.addSystemEvent(table,"onmousedown",function (){
		var mouseButton;
		var targ;
		if(browserType==__Browser_IE){
			mouseButton=event.button;
			targ=event.srcElement;
			
		}else {
			mouseButton=event.which;
			targ=event.target;
			
		};
		if(mouseButton!=1)return ;
		targ=_$getKingfisherElement(targ,"CalendarCell");
		if(targ!=null){
			calendar._$changeDate(targ._year,targ._month,targ._day);
			_$fireKingfisherEvent(calendar,"onCellClick",[calendar]);
			
		}
	});
	return table;
	
};
function _$Calendar_activate(){
	if(!this._active){
		this._$paint();
		this.establishBinding();
		this._active=true;
		if(!this._year){
			if(this._currentDate!=null){
				this.setDate(this._currentDate);
				this._currentDate=null;
				
			}else {
				
				this.setDate(new Date());
				
			}
		};
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$Calendar_setCalendarType(calendarType){
	this._calendarType=calendarType;
	
};
function _$Calendar_getCalendarType(){
	return this._calendarType;
	
};
function _$Calendar_setDate(date){
	if(date==null)return ;
	this.setDateX(date.getFullYear(),date.getMonth(),date.getDate());
	
};
function _$Calendar_getDate(){
	var cell=this._currentCell;
	if(cell!=null){
		return new Date(cell._year,cell._month,cell._day);
		
	}else {
		return null;
		
	}
};
function _$Calendar_setDateX(year,month,date){
	var currentDate=new Date(year,month,date);
	this._$changeDate(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());
	
};
function _$Calendar_changeDate(year,month,date){
	if(!year||(month<0)||!date)return ;
	var currentDate=new Date(year,month,date);
	if(!this._active){
		this._currentDate=currentDate;
		return ;
		
	};
	year=currentDate.getFullYear();
	month=currentDate.getMonth();
	date=currentDate.getDate();
	if(this._year==year&&this._month==month&&this._day==date){
		return ;
		
	};
	if(this._beforeDateChange!=null){
		var result=_$fireKingfisherEvent(this,"beforeDateChange",[this,currentDate]);
		if(result!=null)throw result;
		
	};
	if(this._year!=year||this._month!=month){
		
		if(this._beforeMonthChange!=null){
			var result=_$fireKingfisherEvent(this,"beforeMonthChange",[this,currentDate]);
			if(result!=null)throw result;
			
		};
		this._year=year;
		this._month=month;
		this._day=date;
		this._$showMonthlyDate(year,month,date);
		_$fireKingfisherEvent(this,"afterMonthChange",[this,currentDate]);
		
	}else if(this._day!=date){
		this._year=year;
		this._month=month;
		this._day=date;
		var currentDayCell=null;
		for(var i=0;i<this.calendarCells.length;i++){
			var cell=this.calendarCells[i];
			if(cell._year==year&&cell._month==month&&cell._day==date){
				currentDayCell=cell;
				break;
				
			}
		};
		if(currentDayCell!=null){
			this._$setCurrentDayStyle(currentDayCell);
			
		}
	};
	_$fireKingfisherEvent(this,"afterDateChange",[this,currentDate]);
	if(!this.$KP){
		this.post();
		
	}
};
var __Calendar_MONTH_MAX_DAY=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
function _$Calendar_getMonthMaxDay(year,month){
	var monthMaxDay=__Calendar_MONTH_MAX_DAY[month];
	if(month==1&&(year%4==0&&year%100!=0||year%400==0)){
		//leap year
		monthMaxDay++;
		
	};
	return monthMaxDay;
	
};
function _$Calendar_setCurrentDayStyle(currentDayCell){
	if(this._currentCell!=null){
		this._currentCell.className="CurrentMonth";
		
	};
	this._currentCell=currentDayCell;	
	if(currentDayCell!=null){
		currentDayCell.className="CurrentDay";
		
	}
};
function _$Calendar_previousMonth(calendar){
	var cell=calendar._currentCell;
	if(cell!=null){
		calendar.setDateX(cell._year,cell._month-1,cell._day);
		
	}
};
function _$Calendar_nextMonth(calendar){
	var cell=calendar._currentCell;
	if(cell!=null){
		calendar.setDateX(cell._year,cell._month+1,cell._day);
		
	}
};
function _$Calendar_previousYear(calendar){
	var cell=calendar._currentCell;
	if(cell!=null){
		calendar.setDateX(cell._year-1,cell._month,cell._day);
		
	}
};
function _$Calendar_nextYear(calendar){
	var cell=calendar._currentCell;
	if(cell!=null){
		calendar.setDateX(cell._year+1,cell._month,cell._day);
		
	}
};
function _$Calendar_today(calendar){
	calendar.setDate(new Date());
	_$fireKingfisherEvent(calendar,"onTodayClick",[calendar]);
	
};
function _$Calendar_onKeyDown(){
	function _$setNewDate(calendar,year,month,date){
		setTimeout(calendar.id+".setDateX("+year+", "+month+", "+date+");",0);
		
	};
	switch(event.keyCode){
		case 37:{
			var cell=this._currentCell;
			if(cell!=null){
				if(event.ctrlKey){
					_$setNewDate(this,cell._year,cell._month-1,cell._day);
					
				}else {
					_$setNewDate(this,cell._year,cell._month,cell._day-1);
					
				}
			};
			break;
			
		}
		case 39:{
			var cell=this._currentCell;
			if(cell!=null){
				if(event.ctrlKey){
					_$setNewDate(this,cell._year,cell._month+1,cell._day);
					
				}else {
					_$setNewDate(this,cell._year,cell._month,cell._day+1);
					
				}
			};
			break;
			
		};
		case 38:{
			var cell=this._currentCell;
			if(cell!=null){
				if(event.ctrlKey){
					_$setNewDate(this,cell._year-1,cell._month,cell._day);
					
				}else {
					_$setNewDate(this,cell._year,cell._month,cell._day-7);
					
				}
			};
			break;
			
		};
		case 40:{
			var cell=this._currentCell;
			if(cell!=null){
				if(event.ctrlKey){
					_$setNewDate(this,cell._year+1,cell._month,cell._day);
					
				}else {
					_$setNewDate(this,cell._year,cell._month,cell._day+7);
					
				}
			};
			break;
			
		};
		case 33:{
			var cell=this._currentCell;
			if(cell!=null){
				if(event.ctrlKey){
					_$setNewDate(this,cell._year-1,cell._month,cell._day);
					
				}else {
					_$setNewDate(this,cell._year,cell._month-1,cell._day);
					
				}
			};
			break;
			
		};
		case 34:{
			var cell=this._currentCell;
			if(cell!=null){
				
				if(event.ctrlKey){
					_$setNewDate(this,cell._year+1,cell._month,cell._day);
					
				}else {
					_$setNewDate(this,cell._year,cell._month+1,cell._day);
					
				}
			};
			break;
			
		};
		case 84:{
			if(event.ctrlKey){
				this.setDate(new Date());
				
			};
			break;
			
		}
	}
};
function _$Calendar_onKeyUp(){
	var txtYear=this._txtYear;
	var txtMonth=this._txtMonth;
	var year=parseInt(txtYear.value);
	var month=parseInt(txtMonth.value)-1;
	if(year>=1900&&year<=3000&&month>=0&&month<=11){
		var currentYear,currentMonth;
		var cell=this._currentCell;
		if(cell!=null){
			currentYear=cell._year;
			currentMonth=cell._month;
			
		};
		if(currentYear!=year||currentMonth!=month){
			this.setDateX(year,month,1);
			
		}
	}
};
function _$Calendar_processDatasetMessage(message,dataset,args){
	this.$KP=true;
	try{
		if(this._calendarType==__Calendar_TYPE_SIMPLE){
			switch(message){
				case __Dataset_MSG_REFRESH:case __Dataset_MSG_REFRESH_RECORD:case __Dataset_MSG_CURRENT_CHANGED:{
					if(dataset._current!=null){
						var date=dataset.getValue(this._field);
						this.setDate(date);
						
					};
					break;
					
				}
				case __Dataset_MSG_DATA_CHANGED:{
					var name=args[1];
					if(name==this._field){
						var date=dataset.getValue(this._field);
						this.setDate(date);
						
					}
				};
				case __Dataset_MSG_GAINING_CHANGE:{
					this.post();
					break;
					
				}
			}
		}else {
			switch(message){
				case __Dataset_MSG_REFRESH:
				case __Dataset_MSG_REFRESH_RECORD:{
					this.refresh();
					break;
					
				};
				case __Dataset_MSG_RECORD_DELETED:{
					var record=args[0];
					var date=record.getValue(this._field);
					this._$refreshCellValue(date);
					break;
					
				};
				case __Dataset_MSG_DATA_CHANGED:{
					var name=args[1];
					if(name==this._field){
						var record=args[0];
						var $9m=args[2];
						var date=record.getValue(name);
						this._$refreshCellValue($9m);
						this._$refreshCellValue(date,record);
						
					};
					break;
					
				}
			}
		}
	}finally{
		this.$KP=false;
		
	}
};
function _$Calendar_refresh(){
	this._$showMonthlyDate(this._year,this._month,this._day);
	
};
function _$Calendar_showMonthlyDate(year,month,date){
	if(!year||(month<0)||!date)return ;	
	if(this._txtMonth!=null){
		this._txtMonth.value=month+1;
		
	};
	if(this._txtYear!=null){
		this._txtYear.value=year;
		
	};
	var week=new Date(year,month).getDay();
	var prevMonthMaxDay=0;
	if(week>0){
		currentDate=new Date(year,month-1);
		prevMonthMaxDay=this._$getMonthMaxDay(currentDate.getYear(),currentDate.getMonth());
		
	};
	if(this._calendarType==__Calendar_TYPE_SCHEDULE){
		var dataset=this._dataset;
		if(dataset!=null){
			for(var i=0;i<this.calendarCells.length;i++){
				this.calendarCells[i]._recordset=new Array();
				
			};
			dataset.disableEvents();
			try{
				var field=this._field;
				var record=dataset.getFirstRecord();
				while(record!=null){
					var d=record.getValue(field);
					if(d!=null&&d.getFullYear()==year&&d.getMonth()==month){
						var cell=this.calendarCells[d.getDate()+week-1];
						cell._recordset.push(record);
						
					};
					record=record.getNextRecord();
					
				}
			}finally{
				dataset.enableEvents();
				
			}
		}
	};
	var index=0;
	for(var i=0;i<week;i++){
		var cell=this.calendarCells[index];
		this._$refreshCellStyle(cell,currentDate.getFullYear(),currentDate.getMonth(),prevMonthMaxDay-week+i+1);
		index++;
		
	};
	var currentMonthMaxDay=this._$getMonthMaxDay(year,month);
	for(var i=0;i<currentMonthMaxDay;i++){
		var cell=this.calendarCells[index];
		this._$refreshCellStyle(cell,year,month,i+1);		
		index++;
		
	};
	var nextMonthDay=this.calendarCells.length-index;
	if(nextMonthDay>0){
		currentDate=new Date(year,month+1);
		for(var i=0;i<nextMonthDay;i++){
			var cell=this.calendarCells[index];
			cell._year=currentDate.getFullYear();
			cell._month=currentDate.getMonth();
			cell._day=i+1;
			this._$refreshCellStyle(cell,currentDate.getFullYear(),currentDate.getMonth(),i+1);
			index++;
			
		}
	}
};
function _$Calendar_refreshCellValue(date,record){
	if(date==null)return ;
	var year=date.getFullYear();
	var month=date.getMonth();
	var day=date.getDate();
	var cell;
	var _activeCell=this._currentCell;
	if(_activeCell!=null&&_activeCell._year==year&&_activeCell._month==month&&_activeCell._day==day){
		cell=_activeCell;
		
	}else {
		for(var i=0;i<this.calendarCells.length;i++){
			var _activeCell=this.calendarCells[i];
			if(_activeCell._year==year&&_activeCell._month==month&&_activeCell._day==day){
				cell=_activeCell;
				break;
				
			}
		}
	};
	if(cell==null)return ;
	var recordSet=this.getRecords(date);
	if(recordSet!=null){
		for(var i=recordSet.length-1;i>=0;i--){
			var newRecord=recordSet[i];
			var currentDate=newRecord.getValue(this._field);
			if(newRecord._state==__Record_STATE_DELETE||currentDate==null||currentDate.getFullYear()!=year||currentDate.getMonth()!=month||currentDate.getDate()!=day){
				recordSet.splice(i,1);
				
			}
			
		};
		if(record!=null){
			var currentDate=record.getValue(this._field);
			if(currentDate!=null&&currentDate.getFullYear()==year&&currentDate.getMonth()==month&&currentDate.getDate()==day&&recordSet.indexOf(record)<0){
				recordSet.push(record);
				
			}
		}
	};
	this._$refreshCellStyle(cell,year,month,day);
	
};
function _$Calendar_refreshCellStyle(cell,year,month,date){
	cell._year=year;
	cell._month=month;
	cell._day=date;
	if(this._onCellRefresh==null||_$fireKingfisherEvent(this,"onCellRefresh",[this,cell,new Date(year,month,date),cell._recordset],false)){
		var cellLayout="<DIV style=\"width: 100%; height: 100%; overflow: hidden\">"+"<TABLE cellSpacing=\"0\" cellPadding=\"0\" style=\"width: 100%; height: 100%; table-layout: fixed\">"+"<TR><TD align=\"center\"></TD></TR>";
		if(this._calendarType==__Calendar_TYPE_SCHEDULE){
			cellLayout+="<TR style=\"height: 100%\"><TD align=\"center\" valign=\"middle\"></TD></TR>";
			
		};
		cellLayout+="</TABLE></DIV>";
		cell.innerHTML=cellLayout;
		
	}else {
		return ;
		
	};
	if(month==this._month){
		if(date==this._day){
			this._currentCell=cell;
			cell.className="CurrentDay";
			
		}else {
			cell.className="CurrentMonth";
			
		}
	}else if(month>this._month){
		cell.className="NextMonth";
		
	}else {
		cell.className="PrevMonth";
		
	};
	var row=cell.firstChild.firstChild.tBodies[0].rows[0];	
	if(row!=null){
		var dateCell=row.cells[0];
		if(this._onDateRefresh==null||_$fireKingfisherEvent(this,"onDateRefresh",[this,dateCell,new Date(year,month,date),cell._recordset],false)){
			dateCell.innerText=date;
			
		}
	};
	row=cell.firstChild.firstChild.tBodies[0].rows[1];
	if(row!=null){
		var scheduleCell=row.cells[0];
		scheduleCell.className="Content";
		if(this._onContentRefresh!=null){
			_$fireKingfisherEvent(this,"onContentRefresh",[this,scheduleCell,new Date(year,month,date),cell._recordset],false);
			
		}
	}
};
function _$Calendar_post(){
	if(this._dataset!=null&&this._field!=null){
		if(this._dataset._current!=null){
			this._dataset.getValue(this._field,this.getDate());
			
		}
	}
};
function _$Calendar_getRecords(date){
	var recordSet=null;
	if(date!=null)var year=date.getFullYear();
	var month=date.getMonth();
	var date=date.getDate();
	var index;
	if(month==this._month){
		var week=new Date(year,month,1).getDay();
		index=week+date-1;
		
	}else if(month<this._month){
		var i=this._$getMonthMaxDay(year,month-1);
		index=date-(i-week)-1;
		
	}else if(month>this._month){
		var week=new Date(year,this._month,1).getDay();
		var i=this._$getMonthMaxDay(year,this._month);
		index=week+i+date-1;
		
	};
	var cell=this.calendarCells[index];
	if(cell!=null){
		recordSet=cell._recordset;
		
	};
	if(recordSet==null){
		
		recordSet=new Array();
		
	};
	return recordSet;
	
};


//**************************
//������ؼ�
//**************************
var __ProgressBar_ORIENTA_HORIZONTAL="horizontal";
var __ProgressBar_ORIENTA_VERTICAL="vertical";
function _$buildProgressBar(id,viewModel,orientation){
	var bar=null;
	if(id){
		bar=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(bar==null){
		bar=$$("DIV");
		if(orientation==__ProgressBar_ORIENTA_HORIZONTAL){
			bar.style.width=200;
			
		}else {
			bar.style.height=200;
			
		};
		bar.id=id;
		
	};
	if(!bar.className)bar.className="ProgressBar";
	bar.getId=_$Component_getId;
	bar.getViewModel=_$Component_getViewModel;
	bar.isActive=_$Component_isActive;
	bar.setVisible=_$Component_setVisible;
	bar.getTag=_$Element_getTag;
	bar.setTag=_$Element_setTag;
	bar.getContext=_$Element_getContext;
	bar.setContext=_$Element_setContext;
	bar.getDataset=_$DataControl_getDataset;
	bar.setDataset=_$DataControl_setDataset;
	bar.getField=_$SimpleDataControl_getField;
	bar.setField=_$SimpleDataControl_setField;
	bar.establishBinding=_$DataControl_establishBinding;
	bar._$abolishBinding=_$DataControl_abolishBinding;
	bar.activate=_$DataControl_activate;
	bar.processDatasetMessage=_$ProgressBar_processDatasetMessage;
	bar.disableBinding=_$DataControl_disableBinding;
	bar.enableBinding=_$DataControl_enableBinding;
	bar.refresh=_$ProgressBar_refresh;
	bar.destroy=_$ProgressBar_destroy;
	bar.getMin=_$ProgressBar_getMin;
	bar.setMin=_$ProgressBar_setMin;
	bar.getMax=_$ProgressBar_getMax;
	bar.setMax=_$ProgressBar_setMax;	
	bar.getPosition=_$ProgressBar_getPosition;
	bar.setPosition=_$ProgressBar_setPosition;
	bar.isShowText=_$ProgressBar_getShowText;
	bar.setShowText=_$ProgressBar_setShowText;
	bar.getTextPattern=_$ProgressBar_getTextPattern;
	bar.setTextPattern=_$ProgressBar_setTextPattern;
	bar._$build=_$ProgressBar_build;
	bar._viewModel=viewModel;
	bar._dataset=null;
	bar._field=null;
	bar._orientation=(orientation==null)?__ProgressBar_ORIENTA_HORIZONTAL:orientation;
	bar._min=0;
	bar._max=100;
	bar._position=0;
	bar._showText=true;
	bar._textPattern=null;
	bar._$build();
	return bar;
	
};
KingfisherFactory._$registerComponentType("ProgressBar",_$buildProgressBar);
function _$ProgressBar_destroy(){
	this._$abolishBinding();
	this._pointerCell=null;
	this._outlineTable=null;
	this._label=null;
	
};
function _$ProgressBar_processDatasetMessage(message,dataset,args){
	switch(message){
		case __Dataset_MSG_REFRESH:;
		case __Dataset_MSG_REFRESH_RECORD:
		case __Dataset_MSG_CURRENT_CHANGED:case __Dataset_MSG_DATA_CHANGED:{
			var position=0;
			if(dataset._current!=null){
				position=parseInt(dataset.getValue(this._field));
				if(isNaN(position))position=0;
				
			};
			this.setPosition(position);
			break;
			
		}
	}
};
function _$ProgressBar_build(){
	this.style.overflow="hidden";
	var pointer=$$("DIV");
	pointer.className="Pointer";
	pointer.style.width="100%";	
	pointer.style.height="100%";
	var cell,row,tbody;
	if(this._orientation==__ProgressBar_ORIENTA_HORIZONTAL){
		row=$$("TR");
		row.style.height="100%";
		cell=$$("TD");
		cell.style.width=0;
		cell.appendChild(pointer);
		this._pointerCell=cell;
		row.appendChild(cell);
		cell=$$("TD");
		row.appendChild(cell);
		tbody=$$("TBODY");
		tbody.appendChild(row);
		table=$$("TABLE");
		table.cellPadding=0;
		table.cellSpacing=0;
		table.style.width="100%";
		table.style.height="100%";
		table.style.tableLayout="fixed";
		table.appendChild(tbody);
		
	};
	this.appendChild(table);
	cell=$$("TD");
	cell.className="Label";
	cell.align="center";
	cell.vAlign="middle";
	row=$$("TR");
	row.appendChild(cell);
	tbody=$$("TBODY");
	tbody.appendChild(row);
	table=$$("TABLE");
	table.appendChild(tbody);
	table.style.left=0;
	table.style.width="100%";
	table.style.height="100%";
	table.cellPadding=0;
	table.cellSpacing=0;
	table.style.position="relative";
	this.appendChild(table);
	this._label=cell;
	this._outlineTable=table;
	
};
function _$ProgressBar_refresh(){
	if(this._max<this._min){
		this._max=this._min;
		
	}
	if(this._position<this._min){
		this._position=this._min;
		
	};
	if(this._position>this._max){
		this._position=this._max;
		
	};
	
	var power=(this._position/(this._max-this._min));
	if(isNaN(power))
		power=0;
	if(this._orientation==__ProgressBar_ORIENTA_HORIZONTAL){
		var width=parseInt(power*100)+"%";
		this._pointerCell.style.width=width;
		if(browserType!=__Browser_IE){
			this._pointerCell.style.height=this._pointerCell.parentNode.clientHeight-3;
			
		}
	}else {
		var height=parseInt(power*this.clientHeight+0.5);
		this._pointerCell.style.height=height;
		this._pointerCell.style.top=this.clientHeight-height;
		
	};
	if(this._showText){
		this._outlineTable.style.top=this._pointerCell.offsetHeight*(-1);
		if(this._textPattern!=null){
			var text=this._textPattern.replace(/\$\{percent\}/g, parseInt(power*100));
			text=text.replace(/\$\{min\}/g,this._min);
			text=text.replace(/\$\{max\}/g,this._max);
			this._label.innerText=text;
			
		}else {
			this._label.innerText=this._position;
			
		}
	}
};
function _$ProgressBar_getMin(){
	return this._min;
	
};
function _$ProgressBar_setMin(min){
	this._min=min;
	this.refresh();
	
};
function _$ProgressBar_getMax(){
	return this._max;
	
};
function _$ProgressBar_setMax(max){
	this._max=max;
	this.refresh();
	
};
function _$ProgressBar_getPosition(){
	return this._position;
	
};
function _$ProgressBar_setPosition(position){
	var oldPosition=this._position;
	this._position=parseInt(position+0.5);
	this.refresh();
	_$fireKingfisherEvent(this,"onPositionChanged",[this,oldPosition]);
	
};
function _$ProgressBar_getShowText(){
	return this._showText;
	
};
function _$ProgressBar_setShowText(showText){
	this._showText=showText;
	
};
function _$ProgressBar_getTextPattern(){
	return this._textPattern;
	
};
function _$ProgressBar_setTextPattern(textPattern){
	this._textPattern=textPattern;
	
};


//**************************
//��ʼ��AutoForm�ؼ���FormElementRenderer��
//**************************
function __initFormElementRenderer(id){
	var element=$(id);
	var rendererArea=$(id+"_renderer");
	if(element!=null&&rendererArea!=null){
		element.appendChild(rendererArea);
		_$setDisplay(rendererArea,true);
		
	}
};
function __initFormElement(id, element){
	var form=$(id);
	if(form){
		if(form.controls==null)
			form.controls=new Object();
		if(form.labels==null)
			form.labels=new Object();
		
		var elementId=element.id;
		if(elementId.indexOf("_editor_")!=-1){
			elementId=elementId.replace(/\_editor_/g,"_editors_").replace(/\_editors_/g,".controls[\"")+"\"]";
			eval(elementId+"="+element.id);
		}
		else if(elementId.indexOf("_datalabel_")!=-1){
			elementId=elementId.replace(/\_datalabel_/g,"_editors_").replace(/\_editors_/g,".controls[\"")+"\"]";
			eval(elementId+"="+element.id);
		}
		else if(elementId.indexOf("_fieldlabel_")!=-1){
			elementId=elementId.replace(/\_fieldlabel_/g,"_labels_").replace(/\_labels_/g,".labels[\"")+"\"]";
			eval(elementId+"="+element.id);
		}
		else if(elementId.indexOf("_label_")!=-1){
			elementId=elementId.replace(/\_label_/g,"_labels_").replace(/\_labels_/g,".labels[\"")+"\"]";
			eval(elementId+"="+element.id);
		}
	}
	
};


/**
FieldLabel Control
*/
function _$buildFieldLabel(id,viewModel){
	var label=null;
	if(id){
		if(browserType==__Browser_IE){
			eval("label = "+id);
			
		}else {
			label=$(id);
			
		}
	}else {
		id=_$genControlId();
		
	};
	if(label==null){
		label=$$("LABEL");
		label.id=id;
		
	};
	label.getDataset=_$DataControl_getDataset;
	label.setDataset=_$DataControl_setDataset;
	label.getField=_$SimpleDataControl_getField;
	label.setField=_$SimpleDataControl_setField;
	label.getId=_$Component_getId;
	label.getViewModel=_$Component_getViewModel;
	label.isActive=_$Component_isActive;
	label.setVisible=_$Component_setVisible;
	label.getTag=_$Element_getTag;
	label.setTag=_$Element_setTag;
	label.getContext=_$Element_getContext;
	label.setContext=_$Element_setContext;
	label.processDatasetMessage=_$FieldLabel_processDatasetMessage;
	label.activate=_$DataControl_activate;
	label.establishBinding=_$DataControl_establishBinding;
	label._$abolishBinding=_$DataControl_abolishBinding;
	label.refresh=_$FieldLabel_refresh;
	label.destroy=label._$abolishBinding;
	label._viewModel=viewModel;
	label._dataset=null;
	label._field=null;
	_$setElementStyle(label,"FieldLabel");
	return label;	
	
};
KingfisherFactory._$registerComponentType("FieldLabel",_$buildFieldLabel);
function _$FieldLabel_refresh(){
	if(this._dataset!=null){
		var field=this._dataset.getField(this.getField());
		if(field!=null){
			var leftImage="";
			for(var i=0;i<field._validatorStack.length;i++){
				var validator=field._validatorStack[i];
				if(validator._kingfisherClass=="RequiredValidator"){
					leftImage="<label class='HotLabel' style='font-family:Batang;padding-right:2'>*</label>";
					break;
					
				}
			};
			if(field._toolTip!=null){
				this.title=field._toolTip;
				leftImage+="<IMG src=\""+__SKIN_PATH+"/datatable/tool_tip.gif\">";
				
			}else {
				this.title="";
				
			};
			if(this._onRefresh!=null){
				if(!_$fireKingfisherEvent(this,"onRefresh",[this,field._label,leftImage]))return ;
				
			};
			if(leftImage){
				this.innerHTML=leftImage+field._label;
				
			}else {
				this.innerText=field._label;
				
			}
		}else {
			this.innerText="";
			
		}
	}
};
function _$FieldLabel_processDatasetMessage(message,dataset,args){
	switch(message){
		case __Dataset_MSG_REFRESH:{
			this.refresh();
			break;
			
		}
	}
};


/**
DataLabel Control
*/
function _$buildDataLabel(id,viewModel){
	
	var label=null;
	if(id){
		if(browserType==__Browser_IE){
			eval("label = "+id);
			
		}else {
			label=$(id);
			
		}
	}else {
		id=_$genControlId();
		
	};
	if(label==null){
		label=$$("LABEL");
		label.id=id;
		
	};
	label.getDataset=_$DataControl_getDataset;
	label.setDataset=_$DataControl_setDataset;
	label.getField=_$SimpleDataControl_getField;
	label.setField=_$SimpleDataControl_setField;
	label.getId=_$Component_getId;
	label.getViewModel=_$Component_getViewModel;
	label.isActive=_$Component_isActive;
	label.setVisible=_$Component_setVisible;
	label.getTag=_$Element_getTag;
	label.setTag=_$Element_setTag;
	label.getContext=_$Element_getContext;
	label.setContext=_$Element_setContext;
	label.processDatasetMessage=_$DataLabel_processDatasetMessage;
	label.activate=_$DataControl_activate;
	label.establishBinding=_$DataControl_establishBinding;
	label._$abolishBinding=_$DataControl_abolishBinding;
	label.refresh=_$DataLabel_refresh;
	label.destroy=label._$abolishBinding;
	label._viewModel=viewModel;
	label._dataset=null;
	label._field=null;
	_$setElementStyle(label,"DataLabel");
	return label;
	
};
KingfisherFactory._$registerComponentType("DataLabel",_$buildDataLabel);
function _$DataLabel_refresh(){
	var dataset=this._dataset;
	if(dataset!=null){
		var value="";
		if(dataset._current!=null){
			var field=dataset.getField(this.getField());
			if(field!=null){

				var dropDown=kingfisher.feather.getControl(field.getDropDown());
				if(dropDown==null){
					value=dataset.getString(this._field);
					
				}else {
					if(dropDown._mapValue){
						value=dropDown.getLabel(dataset.getValue(this._field));
						if(!value && dropDown._defaultLabel)
							value=dropDown._defaultLabel;
					}else {
						value=dataset.getString(this._field);
						
					}
				};				
			}
			if(this._onRefresh!=null){
				if(!_$fireKingfisherEvent(this,"onRefresh",[this,value]))return ;
				
			}
		};
		this.innerText=value;
		
	}
};
function _$DataLabel_processDatasetMessage(message,dataset,args){
	switch(message){
		case __Dataset_MSG_REFRESH:case __Dataset_MSG_REFRESH_RECORD:case __Dataset_MSG_CURRENT_CHANGED:{
			this.refresh();
			break;
			
		};
		case __Dataset_MSG_DATA_CHANGED:{
			var name=args[1];
			if(name==this._field){
				this.refresh();
				
			}
		}
	}
};


//**************************
//��ݱ༭�ؼ�����
//**************************
var __DropDown_BUTTON=null;
function _$getDropDownBtn(){
	if(__DropDown_BUTTON==null){
		__DropDown_BUTTON=_$buildDropDownBtn();
		_$setElementStyle(__DropDown_BUTTON,"DropDownButton");
		document.body.appendChild(__DropDown_BUTTON);
		_$setVisible(__DropDown_BUTTON,false);
		__DropDown_BUTTON.style.position="absolute";
		__DropDown_BUTTON.style.left=0;
		__DropDown_BUTTON.style.top=0;
		__DropDown_BUTTON.style.width=0;
		__DropDown_BUTTON.style.height=0;
		
		kingfisher.feather.registerControl(__DropDown_BUTTON);
		
	};
	return __DropDown_BUTTON;
	
};
function _$buildDropDownBtn(){
	var	btnDropdown=$$("BUTTON");
	btnDropdown._kingfisherClass="DropDownButton";
	btnDropdown.destroy=_$DropDown_Button_destroy;
	btnDropdown.onClick=_$DropDown_Button_onClick;
	btnDropdown.hideFocus=true;
	btnDropdown.value="6";
		
	EventManager.addKingfisherEvent(btnDropdown,"onClick",_$DropDown_Button_onClick);
	EventManager.addKingfisherEvent(btnDropdown,"onKeyDown",_$DropDown_Button_onKeyDown);
	EventManager.addSystemEvent(btnDropdown,"onfocus",function (){
		_$Element_onFocus(btnDropdown._editor);
			
	});
	EventManager.addSystemEvent(btnDropdown,"onmousedown",function (){
		event.cancelBubble=true;
			
	});
	EventManager.addSystemEvent(btnDropdown,"onclick",function (){
		btnDropdown.onClick();
			
	});
		
	return btnDropdown;
	
};
function _$DropDown_Button_destroy(){
	this._editor=null;
	this._class=null;
	
};
function _$DropDown_Button_onClick(){
	var dropDown=this._editor.getDropDown();
	if(dropDown!=null){
		if(dropDown.isOpened()){
			dropDown.close();
			
		}else {
			dropDown.open(this._editor);
			
		}
	}
};
function _$DropDown_Button_onKeyDown(){
	var editor=this._editor;
	if(editor!=null){
		editor.onKeyDown();
		
	}
};
function _$buildEditor(editor,bandMode){
	editor._kingfisherClass="Editor";
	editor.getDataset=_$DataControl_getDataset;
	editor.setDataset=_$DataControl_setDataset;
	editor.getField=_$SimpleDataControl_getField;
	editor.setField=_$SimpleDataControl_setField;
	editor.setBandMode=_$Editor_setBandMode;	
	editor.getBandMode=_$Editor_getBandMode;
	editor.setRecord=_$Editor_setRecord;
	editor.getRecord=_$Editor_getRecord;
	editor.setDataType=_$Editor_setDataType;
	editor.getDataType=_$Editor_getDataType;
	editor.isReadOnly=_$Editor_getReadOnly;
	editor.setReadOnly=_$Editor_setReadOnly;
	editor.getEnabled=_$Editor_getEnabled;
	editor.setEnabled=_$Editor_setEnabled;
	editor.getToolTip=_$Element_getToolTip;
	editor.setToolTip=_$Element_setToolTip;
	editor.getId=_$Component_getId;
	editor.getViewModel=_$Component_getViewModel;
	editor.isActive=_$Component_isActive;
	editor.getTag=_$Element_getTag;
	editor.setTag=_$Element_setTag;
	editor.getContext=_$Element_getContext;
	editor.setContext=_$Element_setContext;
	editor.isShowQuickHelp=_$Element_getShowQuickHelp;
	editor.setShowQuickHelp=_$Element_setShowQuickHelp;
	editor.getToolTip=_$Element_getToolTip;
	editor.setToolTip=_$Element_setToolTip;
	editor.getHelpDelay=_$Element_getHelpDelay;
	editor.setHelpDelay=_$Element_setHelpDelay;
	editor.processDatasetMessage=_$Editor_processDatasetMessage;
	editor.activate=_$DataControl_activate;
	editor.establishBinding=_$DataControl_establishBinding;
	editor._$abolishBinding=_$DataControl_abolishBinding;
	editor.disableBinding=_$DataControl_disableBinding;
	editor.enableBinding=_$DataControl_enableBinding;
	editor.destroy=_$Editor_destroy;
	editor.refresh=_$Editor_refresh;
	editor.post=_$Editor_post;
	editor._$refreshToolTip=_$Editor_refreshToolTip;
	editor._$setValue=_$Editor_setValue;
	editor._$getValue=_$Editor_getValue;
	editor._$refreshStyle=_$Editor_refreshStyle;
	editor.onKeyDown=_$Editor_onKeyDown;
	editor._$onFocus=_$Editor_onFocus;
	editor._$$focus=editor.focus;
	editor.focus=_$Editor_focus;
	editor._$getReadOnly=_$Editor_do_getReadOnly;
	editor._$setReadOnly=_$Editor_do_setReadOnly;
	editor._$sizeDropDownBtn=_$Editor_sizeDropDownBtn;
	editor._$showDropDownBtn=_$Editor_showDropDownBtn;
	editor._$hideDropDownBtn=_$Editor_hideDropDownBtn;
	EventManager.addSystemEvent(editor,"onfocus",function (){
		_$Element_onFocus(editor);
	});
	if(bandMode!=null){
		editor._bandMode=bandMode;
		
	}else {
		editor._bandMode="current";
		
	};
	editor._dataset=null;
	editor._record=null;	
	editor._field=null;
	editor._dataType=null;
	editor._oldValue="";
	editor._readOnly=false;
	editor._toolTip="";
	editor._localize=true;
	
};
function _$Editor_setBandMode(bandMode){
	this._bandMode=bandMode;
	
};
function _$Editor_getBandMode(){
	return this._bandMode;
	
};
function _$Editor_setRecord(record){
	this._record=record;
	
};
function _$Editor_getRecord(autoInsert){
	if(this._bandMode=="current"){
		var dataset=this._dataset;
		if(dataset!=null){
			if(autoInsert&&dataset._current==null&&!dataset._readOnly){
				dataset.insertRecord();
				
			};
			return dataset._current;
			
		}else {
			return null;
			
		}
	}else {
		return this._record;
		
	}
};
function _$Editor_getDataType(){
	return this._dataType;
	
};
function _$Editor_setDataType(dataType){
	this._dataType=dataType;
	
};
function _$Editor_getReadOnly(){
	return this._dataReadOnly||this._readOnly;
	
};
function _$Editor_setReadOnly(readOnly){
	this._readOnly=readOnly;
	this._$setReadOnly(readOnly);
	
};
function _$Editor_getEnabled(){
	return (!((this._dataReadOnly||this._readOnly) && (this.disabled)));
	
};
function _$Editor_setEnabled(isEnabled){
	this._readOnly=(!isEnabled);
	this._$setReadOnly(!isEnabled);
	this.disabled = (!isEnabled);
	
};
function _$Editor_do_setReadOnly(readOnly){
	this.readOnly=readOnly;
	this._$refreshStyle();
	
};
function _$Editor_processDatasetMessage(message,dataset,args){
	switch(message){
		case __Dataset_MSG_REFRESH:;
		case __Dataset_MSG_REFRESH_RECORD:
		case __Dataset_MSG_CURRENT_CHANGED:{
			this._$refreshToolTip();
			this._$setValue();
			break;
			
		};
		case __Dataset_MSG_DATA_CHANGED:{
			var record=args[0];
			var name=args[1];
			if(record==this.getRecord()&&name==this._field){
				this._$refreshToolTip(record);
				this._$setValue(record);
				
			};
			break;
			
		};
		case __Dataset_MSG_RECORD_STATE_CHANGED:{
			var record=args[0];
			if(record==this.getRecord()){
				this._$refreshToolTip(record);
				this._$setValue(record);
				
			};
			break;
			
		};
		case __Dataset_MSG_GAINING_CHANGE:{
			this.post();
			break;
			
		}
	}
};
function _$Editor_destroy(){
	this._$abolishBinding();
	this._dropDown=null;
	
};
function _$Editor_refresh(){	
	this._$refreshToolTip();
	this._$setValue();
	
};
function _$Editor_post(){
	var value=this.getValue();
	if(this._oldValue!=value){
		_$fireKingfisherEvent(this,"onPost",[this]);
		this._oldValue=this.getValue();

		var record=this.getRecord(true);
		if(record==null)return false;

		if(!record.setValue(this._field,value))return false;

		return true;
		
	}else {
		return false;
		
	}
};
function _$Editor_do_getReadOnly(newRecord){
	var readOnly=this._readOnly;
	if(!readOnly){
		var dataset=this._dataset;
		var field=null;
		var fieldName=this._field;
		if(fieldName!=null){
			if(dataset==null){
				var record=this.getRecord();
				if(record!=null)
					dataset=record.getDataset();
			}
			if(dataset!=null){
				field=dataset.getField(fieldName);
				
			}
		};
		if(field!=null){
			if(dataset._readOnly||field._readOnly){
				readOnly=true;
				
			}
			else{
				var record=this.getRecord();
				if(record!=null){
					if(this._bandMode=="record"&&newRecord!=null&&newRecord!=record){
						return ;
						
					};
					if(dataset._current){
						if((field._valueProtected&&record._state!=__Record_STATE_NEW&&record._state!=__Record_STATE_INSERT)||
								((dataset._current._state==__Record_STATE_NEW||dataset._current._state==__Record_STATE_INSERT)&&!field._inputForInsert)||
								((dataset._current._state==__Record_STATE_NONE||dataset._current._state==__Record_STATE_MODIFY)&&(!field._inputForUpdate||(!dataset._current.isCanUpdate() && field._name!="select") || (!dataset._current.isCanSelect() && field._name=="select") ))){

							readOnly=true;
							
						}
					}				
				}
			}
		}
	};

	this._dataReadOnly=readOnly;
	return readOnly;
	
};
function _$Editor_refreshToolTip(newRecord){
	var dataset=this._dataset;
	var field=null;
	var fieldName=this._field;
	if(fieldName!=null){
		if(dataset!=null){
			field=dataset.getField(fieldName);
			
		}
	};
	var toolTip=null;
	if(field!=null){
		toolTip=field._toolTip;
		
	};
	if(toolTip==null){
		toolTip=this._toolTip;
		
	};
	if(toolTip==null){
		this.title="";
		
	}else {
		this.title=toolTip;
		
	};
	var editable=this._$getReadOnly(newRecord);
	this._$setReadOnly(editable);
	
};
function _$Editor_getValue(){
	return "";
};
function _$Editor_setValue(newRecord){
	var value=this._$getValue();
	var record=this.getRecord();
	if(record!=null&&record._dataset!=null){
		if(this._bandMode=="record"&&newRecord!=null&&newRecord!=record){
			return ;
			
		};
		if(this._field!=null){
			value=record.getValue(this._field);
			
		}
	};
	this.setValue(value);
	
};
function _$Editor_sizeDropDownBtn(){
	var button=_$getDropDownBtn();	
	if(button._editor==this){
		var absPos=_$getAbsolutePosition(this);
		if(this.offsetHeight>2&&this.offsetWidth>17){
			button.style.width=16;
			button.style.height=this.offsetHeight-2;
			button.style.left=absPos[0]+this.offsetWidth-17;
			button.style.top=absPos[1]+1;
			
		}
	}
};
function _$Editor_showDropDownBtn(){
	var button=_$getDropDownBtn();
	button.style.zIndex=_$autoGenIndex()+999;
	button._editor=this;
	this._oldWidth=this.offsetWidth;
	this.style.borderRightWidth=18;
	this.style.width=this._oldWidth;
	this._$sizeDropDownBtn();
	_$setVisible(button,true);
	return button;
	
};
function _$Editor_hideDropDownBtn(){
	var button=_$getDropDownBtn();
	if(button!=null){
		this.style.borderRightWidth="";
		if(this._oldWidth>0){
			this.style.width=this._oldWidth;
			
		};
		_$setVisible(button,false);
		button._editor=null;
		
	}
};
function _$Editor_setDropDown(dropDown){
	this._dropDown=dropDown;
	this._dropDownOnField=false;
	
};
function _$Editor_getDropDown(){
	
	var dropdown=kingfisher.feather.getControl(this._dropDown);
	if(dropdown==null&&this._dropDown=="__DropdownDate")
		return _$getDateDropDown();
	else
		return dropdown;
	
};
function _$Editor_onKeyDown(){
	if(_$isUserEventDefined(this,"onKeyDown")){
		_$fireKingfisherEvent(this,"onKeyDown",[this]);
		return;
	}

	switch(event.keyCode){
		case 13:{
			if(this.tagName.toUpperCase()=="TEXTAREA")return false;
			var observer=null;
			if(event.shiftKey){
				observer=_$getPriorTabElement(this);
				
			}else {
				observer=_$getNextTabElement(this);
				
			};
			if(observer!=null){
				if(observer._kingfisherClass=="CheckBox")
					event.keyCode=9;
				else if(observer.tagName&&observer.tagName=="BUTTON"){
					_$Element_onFocus(observer);
				}
				else
					_$elementOnFocus(observer);
			}
			break;
			
		}
	};
	return true;
	
};
function _$Editor_onFocus(){
	this.focus();
	
};
function _$Editor_focus(){
	try{
		if(this.offsetWidth>0 && this.offsetHeight>0)
			this._$$focus();
	}
	catch(e){
	}
	
};
function _$Editor_refreshStyle(){
	if(this._dataReadOnly||this._readOnly){
		_$setElementStyle(this,"ReadOnly"+this._class);
		
	}else if(this._hasFocus){
		_$setElementStyle(this,"Active"+this._class);
		
	}else {
		_$setElementStyle(this,this._class);
		
	}
};


//**************************
//�ı��༭���ؼ�
//**************************
function _$buildTextEditor(id,viewModel,bandMode,editorType){
	var editor=null;
	if(id){
		editor=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(editor==null){
		switch(editorType){
			case "textarea":{
				editor=$$("TEXTAREA");
				break;
				
			};
			case "password":{
				editor=$$("INPUT");
				editor.type="password";
				break;
				
			};
			default:{
				editor=$$("INPUT");
				editor.type="text";
				break;
				
			}
		};
		editor.id=id;
		
	}
	editor._editorType=editorType;
	_$buildEditor(editor,bandMode);
	editor._$activate=editor.activate;
	editor.activate=_$TextEditor_activate;
	editor._$destroy=editor.destroy;
	editor.destroy=_$TextEditor_destroy;
	editor._$establishBinding=editor.establishBinding;
	editor.establishBinding=_$TextEditor_establishBinding;
	editor._$processDatasetMessage=editor.processDatasetMessage;
	editor.processDatasetMessage=_$TextEditor_processDatasetMessage;
	editor.getDataType=_$TextEditor_getDataType;
	editor.setDataType=_$TextEditor_setDataType;
	editor.getEditorType=_$TextEditor_getEditorType;
	editor.setEditorType=_$TextEditor_setEditorType;
	editor.setDropDown=_$Editor_setDropDown;
	editor.getDropDown=_$Editor_getDropDown;
	editor.setValue=_$TextEditor_setValue;
	editor.getValue=_$TextEditor_getValue;
	editor.onFocus=_$TextEditor_onFocus;
	editor.onBlur=_$TextEditor_onBlur;
	editor._$onKeyDown=editor.onKeyDown;
	editor.onPaste=_$TextEditor_onPaste;
	editor.onKeyDown=_$TextEditor_onKeyDown;
	editor.onKeyPress=_$TextEditor_onKeyPress;
	editor.onKeyUp=_$TextEditor_onKeyUp;
	editor._$setValue=_$TextEditor_do_setValue;
	editor._$parent_getReadOnly=editor._$getReadOnly;
	editor._$getReadOnly=_$TextEditor_do_getReadOnly;
	editor._$showPutDropDownBtn=_$TextEditor_showPutDropDownBtn;
	editor._$hidePutDropDownBtn=_$TextEditor_hidePutDropDownBtn;
	editor._$$refreshStyle=editor._$refreshStyle;
	editor._$refreshStyle=_$TextEditor_refreshStyle;
	editor._$refresh=_$TextEditor_refresh;
	EventManager.addSystemEvent(editor,"onkeypress",function (){
		editor.onKeyPress();
		
	});
	EventManager.addSystemEvent(editor,"onkeyup",function (){
		editor.onKeyUp();
		
	});
	EventManager.addSystemEvent(editor,"onpaste",function (){
		editor.onPaste();
		
	});
	if(editor.hotKey){
		HotKeyManager.addHotKeyElement(editor);
	}
	editor._viewModel=viewModel;
	if(!editor.className){
		_$setElementStyle(editor,"TextEditor");
		
	};
	editor._class=editor.className;
	editor._dataType=null;
	return editor;
	
};
KingfisherFactory._$registerComponentType("TextEditor",_$buildTextEditor);
function _$TextEditor_destroy(){
	this._$destroy();
	if(this._dropdownBtn)
		this._dropdownBtn.destroy();
	this._dropdownBtn=null;
	this._buttonDiv=null;
};
function _$TextEditor_activate(){
	this._$activate();
	if(this._bandMode=="current")
		this._$showPutDropDownBtn();
};
function _$TextEditor_processDatasetMessage(message,dataset,args){
	switch(message){
		case __Dataset_MSG_REFRESH:
			this._$refresh();
			this._$refreshToolTip();
			this._$setValue();

			break;
		default:
			this._$processDatasetMessage(message,dataset,args);
	}
};
function _$TextEditor_refresh(){
	
	var dataset=this._dataset;
	if(dataset!=null){
		var field=dataset.getField(this._field);
		if(field!=null){
			if(this._dropDown==null || this._dropDownOnField)
				this._dropDown=field._dropDown;
				this._dropDownOnField = true;
		}
	}

	if(this._bandMode=="current"){
		var dropDown=this.getDropDown();
		if(this._dropdownBtn==null && dropDown!=null){
			this._$showPutDropDownBtn();
		}
		else if(this._dropdownBtn!=null && dropDown==null)
			this._$hidePutDropDownBtn();
	}
	
};
function _$TextEditor_establishBinding(){
	var dataset=this._dataset;
	if(dataset!=null){
		var field=dataset.getField(this._field);
		if(field!=null){
			this._fieldDataType=field._dataType;
			if(this._dropDown==null || this._dropDownOnField){
				this._dropDown=field._dropDown;
				this._dropDownOnField=true;
				
			};
			this.mixMaxLength = 0;

			var maxLength=0;
			for(var i=0;i<field._validatorStack.length;i++){
				var validator=field._validatorStack[i];
				if(validator._kingfisherClass=="LengthValidator"){
					
					maxLength=parseInt(validator._maxLength);
					//2010��10��13�� Add By Qwj 
					//�������ĳ��ȿ���
					this.mixMaxLength=parseInt(validator._maxLength);
					break;
				}
			};
			if(maxLength>0){
				this.maxLength=maxLength;
				
			}else {
				this.removeAttribute("maxLength");
				
			}
		}
	};
	this._$establishBinding();
	
};
function _$TextEditor_refreshStyle(){
	this._$$refreshStyle();
	
	if(this._dataReadOnly||this._readOnly){
		var button=this._dropdownBtn;
		if(button){
			_$setElementStyle(button,"ReadOnlyPutDropDownButton");
			button.disabled=true;
		}
		
		var div=this._buttonDiv;
		if(div)
			_$setElementStyle(div,"ReadOnlyPutButtonDiv");
		
	}else if(this._hasFocus){
		var button=this._dropdownBtn;
		if(button){
			_$setElementStyle(button,"ActivePutDropDownButton");
			button.disabled=false;
		}
		
		var div=this._buttonDiv;
		if(div)
			_$setElementStyle(div,"ActivePutButtonDiv");
		
	}else {
		var button=this._dropdownBtn;
		if(button){
			_$setElementStyle(button,"PutDropDownButton");
			button.disabled=false;
		}
		
		var div=this._buttonDiv;
		if(div)
			_$setElementStyle(div,"PutButtonDiv");
		
	}
};
var __Need_showPutDropDownBtn_Elements=new Collection();		//û����ȷ��ʾ������ť�ı༭��//
function _$TextEditor_showPutDropDownBtn(){
	var dropDown=this.getDropDown();
	if(this._dropdownBtn==null && dropDown!=null){
		if(this.offsetHeight>2&&this.offsetWidth>17){
			var button=_$buildDropDownBtn();
			button.id=_$genControlId();
			_$setElementStyle(button,(this._dataReadOnly?"ReadOnly":"")+"PutDropDownButton");
			button.style.width=16;
			button.style.height=this.offsetHeight-2;
			button.disabled=this._dataReadOnly;
			
	//		var row=this.parentElement.parentElement;
			var td=this.parentElement;
			var div=$$("DIV");
			var cell=$$("<TD name='DropDownBtnCell' width='17px'>");
			div.appendChild(button);
			_$setElementStyle(div,(this._readOnly?"ReadOnly":"")+"PutButtonDiv");
			cell.appendChild(div);
	//		row.appendChild(cell);
			td.insertAdjacentElement("afterend", cell);
			this._buttonDiv=div;
			this._dropdownBtn=button;
			button._editor=this;
			
			if(__Need_showPutDropDownBtn_Elements.findElement(this)!=null)
				__Need_showPutDropDownBtn_Elements.remove(this);
		}
		else{
			if(__Need_showPutDropDownBtn_Elements.findElement(this)==null){
				__Need_showPutDropDownBtn_Elements.insert(this);
				
			};
		}
	}
	
	return this._dropdownBtn;
};
function _$TextEditor_hidePutDropDownBtn(){
	var dropDown=this.getDropDown();
	if(this._dropdownBtn!=null && dropDown==null){
			var row=this.parentElement.parentElement;
			var childNodes=row.childNodes;
			if(childNodes[childNodes.length-1].getAttribute("name")=="DropDownBtnCell"){
				row.removeChild(childNodes[childNodes.length-1]);
				this._buttonDiv=null;
				this._dropdownBtn=null;
			}
	}
};
function _$TextEditor_getDataType(){
	return this._dataType;
	
};
function _$TextEditor_setDataType(dataType){
	this._dataType=dataType;
	
};
function _$TextEditor_getEditorType(){
	return this._editorType;
	
};
function _$TextEditor_setEditorType(editorType){
	this._editorType=editorType;
	
};
function _$TextEditor_setValue(value){
	if(this._onSetValue==null||_$fireKingfisherEvent(this,"onSetValue",[this,value])){
		var dropDown=this.getDropDown();
		if(dropDown!=null){
			if(dropDown._mapValue){
				value=dropDown.getLabel(value);
				if(!value && dropDown._defaultLabel)
					value=dropDown._defaultLabel;
				
			}
		};
		this.value=value;
		
	};
	this._oldValue=value;
	
};
function _$TextEditor_getValue(){
	if(this._onGetValue!=null){
		return _$fireKingfisherEvent(this,"onGetValue",[this]);
		
	}else {
		return this.value;
		
	}
};
function _$TextEditor_do_getReadOnly(newRecord){
	
	var editable=this._$parent_getReadOnly(newRecord);
	if(!editable){
		var dropDown=this.getDropDown();
		if(dropDown!=null&&dropDown._fixed){
			editable=true;
			
		}
	};
	return editable;
	
};
function _$TextEditor_do_setValue(newRecord){
	if(this._dataset==null||this._field==null){
		return ;
		
	};
	var value="";
	var record=this.getRecord();
	if(record!=null&&record._dataset!=null){
		if(this._bandMode=="record"&&newRecord!=null&&newRecord!=record){
			return ;
			
		};
		if(this._field!=null){
			if(this._hasFocus&&!this.readOnly){
				value=record.getValue(this._field);
				if(value!=null){
					var dataType=(this._dataType)?this._dataType:this._fieldDataType;
					switch(dataType){
						case 10:
							value=formatDate(value,"yyyy-MM-dd");
							break;
						case 11:
							value=formatDate(value,"HH:mm:ss");
							break;
						case 12:
							value=formatDate(value,"yyyy-MM-dd HH:mm:ss");
							break;
						default:
							value=parseString(value);
							break;
						
					}
				}else {
					value=parseString(value);
					
				}
			}else {
				value=record.getString(this._field);
				
			}
		}
	}
	this.setValue(value);
	this._oldValue=this.value;
	
};
var __TextEditor_select_handle;
function _$TextEditor_onFocus(){
	this._hasFocus=true;

	_$fireKingfisherEvent(this,"onFocus",[this]);

	this.refresh();
	if(this.select){
		clearTimeout(__TextEditor_select_handle);
		__TextEditor_select_handle=setTimeout("$(\""+this.id+"\").select();",10);
		
	};
	var dropDown=this.getDropDown();
	if(dropDown!=null&&!this._readOnly){
		var button;
		if(this._bandMode=="current"){
			if(this._dropdownBtn==null && dropDown!=null){
				button=this._$showPutDropDownBtn();
			}
			else if(this._dropdownBtn!=null && dropDown==null)
				this._$hidePutDropDownBtn();
		}
		else
			button=this._$showDropDownBtn();
		if(this.readOnly && dropDown._fixed && button && !button.disabled){
			try{
				button.focus();
			}
			catch(e){
			}
			
		};
		if(dropDown._autoDropDown){
			dropDown.open(this);
			
		}
	}
};
function _$TextEditor_onBlur(){
	this._hasFocus=false;
	var dropDown=this.getDropDown();
	if(this.value==""&&this._oldValue!=""&&dropDown!=null){
		dropDown._editor=this;
		dropDown._$processDropDownSelected(null);
		
	};
	if(dropDown!=null){
		if(this._bandMode!="current")
			this._$hideDropDownBtn();
		if(dropDown.isOpened()){
			dropDown.close();
			
		}
	};
	if(!this.post()){
		this._$setValue();
		
	};
	this._$refreshToolTip();
	
	_$fireKingfisherEvent(this,"onBlur",[this]);
};
function _$TextEditor_onKeyDown(){
	var dropDown=this.getDropDown();
	switch(event.keyCode){
		//case 113:	  	//F2
		case 118:		//F7
		case 34:{	  //PageDown
			if(dropDown!=null){
				if(dropDown.isOpened()){
					dropDown.close();
					
				}else {
					dropDown.open(this);
					
				}
			};
			break;
			
		};
		case 38:		   //UP ARROW
		case 40:{			 //DOWN ARROW
			if(event.altKey){
				if(dropDown!=null){
					if(dropDown.isOpened()){
						dropDown.close();
						
					}else {
						dropDown.open(this);
						
					}
				};
				return false;
				
			}else {
				if(dropDown!=null&&dropDown.isOpened()){
					dropDown.onKeyDown();
					return false;
									
				}
			};
			break;
			
		};
		case 13:{		//ENTER
			if(dropDown!=null&&dropDown.isOpened()){
				if(!event.ctrlKey){
					dropDown.onKeyDown();
					return false;
					
				}
			}else if(this.tagName.toUpperCase()=="TEXTAREA"&&!event.ctrlKey){
				return false;
				
			};
			break;
			
		};
		case 9:{		//TAB
			break;
			
		}
		default:{
			if(dropDown!=null&&dropDown.isOpened()){
				dropDown.onKeyDown();
				return false;
				
			};
			break;
			
		}
	};
	if(typeof(this._$onKeyDown)=="function"){
		return this._$onKeyDown();
		
	}else {
		return true;
		
	}
};

function _$TextEditor_onKeyPress(){
	 function getSelectionText() {
         if(window.getSelection) {
        	 return window.getSelection().toString();
         } else if(document.selection && document.selection.createRange) {
        	 return document.selection.createRange().text;
         }
         return '';
     }
	 
	if(_$isUserEventDefined(this,"onKeyPress")){
		event.returnValue=_$fireKingfisherEvent(this,"onKeyPress",[this]);
		return;
	};

	var result=true;
	var dataType=(this._dataType)?this._dataType:this._fieldDataType;
	switch(dataType){
		case 1:{
			if ((this.mixMaxLength > 0) && (getSelectionText()==''))
			{
				result = (_$TextEditor_GetMixLength(this.value) < this.mixMaxLength);
			}
			break;
		};

		case 2:;
		case 3:;
		case 4:;
		case 5:{
			result=(event.keyCode==44||event.keyCode==45||(event.keyCode>=48&&event.keyCode<=57));
			break;
			
		};
		case 6:;
		case 7:;
		case 8:{
			result=(event.keyCode==44||event.keyCode==45||event.keyCode==46||(event.keyCode>=48&&event.keyCode<=57));
			break;
			
		};
		case 10:
		case 11:
		case 12:{
			result=(event.keyCode==46||event.keyCode==47||event.keyCode==58||event.keyCode==32||event.keyCode==45||(event.keyCode>=48&&event.keyCode<=57));
			break;
			
		}
	};
	event.returnValue=result;
	
};

function _$TextEditor_onKeyUp(){
	var dataType=(this._dataType)?this._dataType:this._fieldDataType;
	switch(dataType){
		case 1:{
			if (this.mixMaxLength > 0)
			{
				_$TextEditor_Do_SetMaxLen(this, this.mixMaxLength);
			}
			break;
		};
	};
};

function _$TextEditor_onPaste(){
	var dataType=(this._dataType)?this._dataType:this._fieldDataType;
	switch(dataType){
		case 1:{
			if (this.mixMaxLength > 0)
			{
				_$TextEditor_Do_SetMaxLen(this, this.mixMaxLength);
			}
			break;
		};
	};
};

function _$TextEditor_Do_SetMaxLen(obj, mixLen)
{
    var lenLimit=mixLen;
    var val=obj.value;
    var len=_$TextEditor_GetMixLength(val);   
    
    if(len>lenLimit)
    {
        var prevstr="";
        for(var i=0;i<val.length;i++)
        {
            len=_$TextEditor_GetMixLength(val.substring(0,i+1));
            if(len>lenLimit)
            {
                obj.value=prevstr;
                return;
            }
            prevstr=val.substring(0,i+1);                  
        }
    }
}

function _$TextEditor_GetMixLength(val)
{
    var len=0;
    for (var i=0;i<val.length;i++)
    {
        if ((val.charCodeAt(i) < 0) || (val.charCodeAt(i) > 255))
            len+=2;
        else
            len++; 
    }
    return len;
}

//**************************
//������ı��ؼ�
//**************************
function _$buildInterEditor(id,viewModel,bandMode){
	var editor=null;
	if(id){
		editor=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(editor==null){
		editor=$$("INPUT");
		editor.type="text";
		editor.id=id;
		
	}
	_$buildEditor(editor,bandMode);
	editor._$activate=editor.activate;
	editor.activate=_$TextEditor_activate;
	editor._$destroy=editor.destroy;
	editor.destroy=_$InterEditor_destroy;
	editor._$establishBinding=editor.establishBinding;
	editor.establishBinding=_$TextEditor_establishBinding;
	editor._$processDatasetMessage=editor.processDatasetMessage;
	editor.processDatasetMessage=_$InterEditor_processDatasetMessage;
	editor.getDataType=_$TextEditor_getDataType;
	editor.setDataType=_$TextEditor_setDataType;
	editor.setDropDown=_$Editor_setDropDown;
	editor.getDropDown=_$Editor_getDropDown;
	editor.setValue=_$InterEditor_setValue;
	editor.getValue=_$InterEditor_getValue;
	editor.onFocus=_$InterEditor_onFocus;
	editor.onBlur=_$InterEditor_onBlur;
	editor._$onKeyDown=editor.onKeyDown;
	editor.onKeyDown=_$TextEditor_onKeyDown;
	editor.onKeyPress=_$TextEditor_onKeyPress;
	editor._$setValue=_$InterEditor_do_setValue;
	editor._$parent_getReadOnly=editor._$getReadOnly;
	editor._$getReadOnly=_$TextEditor_do_getReadOnly;
	editor._$showPutDropDownBtn=_$TextEditor_showPutDropDownBtn;
	editor._$$refreshStyle=editor._$refreshStyle;
	editor._$refreshStyle=_$TextEditor_refreshStyle;
	editor.setInterDataset=_$InterEditor_setInterDataset;
	editor.getInterDataset=_$InterEditor_getInterDataset;
	editor.setFocusField=_$InterEditor_setFocusField;
	editor.getFocusField=_$InterEditor_getFocusField;
	editor.setBlurFields=_$InterEditor_setBlurFields;
	editor.getBlurFields=_$InterEditor_getBlurFields;
	editor.setWriteField=_$InterEditor_setWriteField;
	editor.getWriteField=_$InterEditor_getWriteField;
	editor.setFormat=_$InterEditor_setFormat;
	editor.getFormat=_$InterEditor_getFormat;
	editor._$change=_$InterEditor_change;
	EventManager.addSystemEvent(editor,"onkeypress",function (){
		editor.onKeyPress();
		
	});
	if(editor.hotKey){
		HotKeyManager.addHotKeyElement(editor);
	}
	editor._viewModel=viewModel;
	if(!editor.className){
		_$setElementStyle(editor,"TextEditor");
		
	};
	editor._class=editor.className;
	editor._dataType=null;
	editor._blurValue="";
	editor._stockValues=new HashList();
	return editor;
	
};
KingfisherFactory._$registerComponentType("InterEditor",_$buildInterEditor);
function _$InterEditor_destroy(){
	this._$destroy();
	if(this._dropdownBtn)
		this._dropdownBtn.destroy();
	this._dropdownBtn=null;
	this._buttonDiv=null;
	this._stockValues=null;
};
function _$InterEditor_setInterDataset(interDataset){
	this._interDataset=interDataset;
};
function _$InterEditor_getInterDataset(){
	return this._interDataset;
};
function _$InterEditor_setFocusField(focusField){
	this._focusField=focusField;
};
function _$InterEditor_getFocusField(){
	return this._focusField;
};
function _$InterEditor_setBlurFields(blurFields){
	this._blurFields=blurFields;
	if(!this._format)
		this._format=blurFields;
};
function _$InterEditor_getBlurFields(){
	return this._blurFields;
};
function _$InterEditor_setWriteField(writeField){
	this._writeField=writeField;
};
function _$InterEditor_getWriteField(){
	return this._writeField;
};
function _$InterEditor_setFormat(format){
	this._format=format;
};
function _$InterEditor_getFormat(){
	return this._format;
};
function _$InterEditor_processDatasetMessage(message,dataset,args){
//	alert(message);
	switch(message){
		case __Dataset_MSG_REFRESH:
		case __Dataset_MSG_CURRENT_CHANGED:
			this._blurValue="";
			this._focusValue="";
			this._oldWriteValue="";
			this.value="";
			
			if(dataset._current!=null){
				var obj=this._stockValues.get("_"+dataset._current.getValue(this._field));
				if(obj != null){
					this._$change(this._focusField, obj.focusValue);
				}
				else
					this._$change(this._writeField, dataset._current.getValue(this._field));
				
				if(this._hasFocus)
					this.value=this._focusValue;
				else
					this.value=this._blurValue;
			}
			break;
		case __Dataset_MSG_DATA_CHANGED:{
			var record=args[0];
			var name=args[1];
			if(record==this.getRecord()&&name==this._field){
				var obj=this._stockValues.get("_"+record.getValue(this._field));
				if(obj != null){
					this._$change(this._focusField, obj.focusValue, true);
				}
				else
					this._$change(this._writeField, record.getValue(this._field), true);
				
				if(this._hasFocus)
					this.value=this._focusValue;
				else
					this.value=this._blurValue;
				
			};
			break;
			
		};
		default:
			this._$processDatasetMessage(message,dataset,args);
	}
};
function _$InterEditor_do_getReadOnly(){
	return false;
};
function _$InterEditor_do_setValue(newRecord){
	if(this._dataset==null||this._field==null){
		return ;
		
	};
	var value="";
	var record=this.getRecord(true);
	if(record!=null&&record._dataset!=null){
		if(this._bandMode=="record"&&newRecord!=null&&newRecord!=record){
			return ;
			
		};
		if(this._field!=null){
			if(this._hasFocus&&!this.readOnly){
				value=record.getValue(this._field);
				if(value!=null){
					var dataType=(this._dataType)?this._dataType:this._fieldDataType;
					switch(dataType){
						case 10:
							value=formatDate(value,"yyyy-MM-dd");
							break;
						case 11:
							value=formatDate(value,"HH:mm:ss");
							break;
						case 12:
							value=formatDate(value,"yyyy-MM-dd HH:mm:ss");
							break;
						default:
							value=parseString(value);
							break;
						
					}
				}else {
					value=parseString(value);
					
				}
			}else {
				value=record.getString(this._field);
				
			}
		}
	}
	this.setValue(value);
	this._oldValue=this.value;
	
};
function _$InterEditor_getValue(){
	if(this._onGetValue!=null){
		return _$fireKingfisherEvent(this,"onGetValue",[this]);
		
	}else {
		return this._oldWriteValue;
		
	}
};
function _$InterEditor_setValue(value){
	if(this._onSetValue==null||_$fireKingfisherEvent(this,"onSetValue",[this,value])){
		if(this._oldWriteValue!=value){
			this.value=value;
		}
		else{
			if(value!=this._focusValue)
				this.value=this._focusValue;
		}
	};
	this._oldValue=value;
};
var __InterEditor_select_handle;
function _$InterEditor_onFocus(){
	this._hasFocus=true;
	this.value=this._focusValue;

	_$fireKingfisherEvent(this,"onFocus",[this]);

	this.refresh();
	if(this.select){
		clearTimeout(__InterEditor_select_handle);
		__InterEditor_select_handle=setTimeout("$(\""+this.id+"\").select();",10);
		
	};
	var dropDown=this.getDropDown();
	if(dropDown!=null&&!this._readOnly){
		var button;
		if(this._bandMode=="current")
			button=this._$showPutDropDownBtn();
		else
			button=this._$showDropDownBtn();
		if(this.readOnly && dropDown._fixed && !button.disabled){
			try{
				button.focus();
			}
			catch(e){
			}
			
		};
		if(dropDown._autoDropDown){
			dropDown.open(this);
			
		}
	}
};
function _$InterEditor_onBlur(){
	this._hasFocus=false;

	var dropDown=this.getDropDown();
	if(this.value==""&&this._oldValue!=""&&dropDown!=null){
		dropDown._editor=this;
		dropDown._$processDropDownSelected(null);
		
	};
	if(dropDown!=null){
		if(this._bandMode!="current")
			this._$hideDropDownBtn();
		if(dropDown.isOpened()){
			dropDown.close();
			
		}
	};

	if(this.value!=this._focusValue){
		this._$change(this._focusField, this.value);
	}
	if(!this.post()){
		this._$setValue();
		
	};
	this.value=this._blurValue;

	this._$refreshToolTip();
	
	_$fireKingfisherEvent(this,"onBlur",[this]);
};
function _$InterEditor_change(field,value,reversal){
	var dataset=kingfisher.feather.getDataset(this._interDataset);
	if(dataset&&this._focusField&&this._blurFields&&parseString(value).trim()!=""&&!this._hasFocus){
		dataset.parameters().clear();

		var result=_$fireKingfisherEvent(this,"beforeGetInterData",[this]);
		if (result) throw result;

		dataset.parameters().setValue(field, value);
		dataset.flushData();

		if(dataset.getPossibleRecordCount()>0){
			dataset.moveFirst();
			var blurFieldsArray=this._blurFields.split(",");
			var blurValue=this._format;
			for(var i=0;i<blurFieldsArray.length;i++){
				var temp=dataset.getValue(blurFieldsArray[i]);
				eval("blurValue=blurValue.replace(/"+blurFieldsArray[i]+"/gi,temp);");
			}
			this._blurValue=blurValue;
			this._focusValue=dataset.getValue(this._focusField);
			this._oldWriteValue=value;
			
			if(this._writeField){
				var record=this.getRecord(true);
				if(record!=null){
					if(!reversal)
						record.setValue(this._field,dataset.getValue(this._writeField));
					this._oldWriteValue=dataset.getValue(this._writeField);
				}
			}
			
			var obj = new Object();
			obj.focusValue=this._focusValue;
			obj.blurValue=this._blurValue;
			this._stockValues.put("_"+this._oldWriteValue, obj);
		}
		else{
			this._blurValue="";
			this._focusValue="";
			this._oldWriteValue="";
		}
		_$fireKingfisherEvent(this,"afterGetInterData",[this, this._blurValue, this._focusValue, this._oldWriteValue]);
	}
	else if(dataset&&this._focusField&&this._blurFields&&parseString(value).trim()==""&&!this._hasFocus){
		this._blurValue="";
		this._focusValue="";
		this._oldWriteValue=""
	}
};



//**************************
//��ѡ��ť�ؼ�
//**************************
function _$buildCheckBox(id,viewModel,bandMode){
	var checkbox=null;
	if(id){
		checkbox=$(id);
		
	}else {
		id=_$genControlId();		
		
	};
	if(checkbox==null){
		checkbox=$$("SPAN");
		checkbox.id=id;
		checkbox.width="100%";
		var control=$$("INPUT");
		control.type="checkbox";
		control.hideFocus=true;
		control.id=_$genControlId();
		checkbox.appendChild(control);
		
	}
	else{
		checkbox.firstChild.id=_$genControlId();
	}
	_$buildEditor(checkbox,bandMode);
	checkbox._$oldEstablishBinding=checkbox.establishBinding;
	checkbox.establishBinding=_$CheckBox_establishBinding;
	checkbox.activate=_$CheckBox_activate;
	checkbox.getOnValue=_$CheckBox_getOnValue;
	checkbox.setOnValue=_$CheckBox_setOnValue;
	checkbox.getOffValue=_$CheckBox_getOffValue;
	checkbox.setOffValue=_$CheckBox_setOffValue;
	checkbox._$getValue=_$CheckBox_do_getValue;
	checkbox.setValue=_$CheckBox_setValue;
	checkbox.getValue=_$CheckBox_getValue;
	checkbox.onFocus=_$CheckBox_onFocus;
	checkbox.onBlur=_$CheckBox_onBlur;
	checkbox._$setReadOnly=_$CheckBox_setReadOnly;
	checkbox._$isChange=_$CheckBox_isChange;
	checkbox._$paint=_$CheckBox_paint;
	checkbox._$trace=_$CheckBox_trace;
	checkbox._onValue=true;
	checkbox._offValue=false;
	checkbox._kingfisherClass="CheckBox";
	EventManager.addSystemEvent(checkbox,"onclick",function (){
		if(checkbox._oldValue!=checkbox.firstChild.checked)
			_$fireKingfisherEvent(checkbox,"onClick",[checkbox]);

		_$CheckBox_onClick(checkbox);
		
	});
	if(checkbox.hotKey){
		checkbox.firstChild.hotKey=checkbox.hotKey;
		HotKeyManager.addHotKeyElement(checkbox.firstChild);
	}
	checkbox._viewModel=viewModel;
	if(!checkbox.className)_$setElementStyle(checkbox,"CheckBox");
	checkbox._class=checkbox.className;
	return checkbox;
	
};
KingfisherFactory._$registerComponentType("CheckBox",_$buildCheckBox);
function _$CheckBox_establishBinding(){
	this._$oldEstablishBinding();
	if(this._dataset!=null){
		var field=this._dataset.getField(this._field);
		if(field!=null){
			if(field._dataType==9){
				this._onValue=true;
				this._offValue=false;
				
			}else {
				this._onValue=__DEFAULT_ONVALUE;
				this._offValue=__DEFAULT_OFFVALUE;
				
			}
			
		}
	}
};
function _$CheckBox_activate(){
	if(!this._active){
		this._active=true;
		this.establishBinding();
		this._$paint();
	}
};
function _$CheckBox_trace(checkbox){
	
	if(checkbox.lastChild.tagName=="LABEL")
		_$setElementStyle(checkbox.lastChild, (checkbox.firstChild.checked?(checkbox._dataReadOnly?"Read":"")+"CheckBoxOn":(checkbox._dataReadOnly?"Read":"")+"CheckBoxOff"));
	this.checked=checkbox.firstChild.checked;
	
};
function _$CheckBox_paint(){
	var label=$$("<LABEL hideFocus=\"true\" for=\""+this.firstChild.id+"\">");
	if(this._accessKey)
		label.accessKey=this._accessKey;
	label.innerHTML="&nbsp;";
	this.appendChild(label);

	this.firstChild.style.position="absolute";
	this.firstChild.style.left = "-1000px";
	this._$trace(this);
};
function _$CheckBox_setReadOnly(readOnly){
	this.disabled=readOnly;
	this._$refreshStyle();
	if(this.lastChild.tagName=="LABEL")
		_$setElementStyle(this.lastChild, (this.firstChild.checked?(this.disabled?"Read":"")+"CheckBoxOn":(this.disabled?"Read":"")+"CheckBoxOff"));
	
};
function _$CheckBox_getOnValue(){
	return this._onValue;
	
};
function _$CheckBox_setOnValue(onValue){
	this._onValue=onValue;
	
};
function _$CheckBox_getOffValue(){
	return this._offValue;
	
};
function _$CheckBox_setOffValue(offValue){
	this._offValue=offValue;
	
};
function _$CheckBox_isChange(value){
	return (parseString(value)==parseString(this._onValue));
	
};
function _$CheckBox_do_getValue(){
	return this.firstChild.checked?this._onValue:this._offValue;
	
};
function _$CheckBox_setValue(value){
	this._succeed=true;
	try{
		if(this._onSetValue==null||_$fireKingfisherEvent(this,"onSetValue",[this,value])){
			this.firstChild.checked=this._$isChange(value);
			this._$trace(this);
			
		};
		this._oldValue=this.firstChild.checked;
		
		var record=this.getRecord();
		if(record!=null&&record._dataset!=null){
			if(this._bandMode=="record" && this._field=="select"){
				record.setDirty(false);
			}
		}
		
	}finally{
		this._succeed=false;
		
	}
};
function _$CheckBox_getValue(){
	if(this._onGetValue!=null){
		return _$fireKingfisherEvent(this,"onGetValue",[this]);
		
	}else {
		var value=(this.firstChild.checked)?this._onValue:this._offValue;
		return value;
		
	}
};
function _$CheckBox_onFocus(){
	this._hasFocus=true;
	this._$refreshStyle();
	
	if(this._bandMode=="record" && this._kingfisherClass=="CellEditor")
		_$setVisible(this.lastChild, true);
	
};
function _$CheckBox_onBlur(){
	this.post();	
	this._hasFocus=false;
	this._$refreshStyle();
	
	if(this._bandMode=="record" && this._kingfisherClass=="CellEditor")
		_$setVisible(this.lastChild, false);
	
};
function _$CheckBox_onClick(checkbox){
	if(!checkbox._succeed){
		if(!checkbox.post()){
			checkbox.refresh();
			
		}
	}
	checkbox._$trace(checkbox);
	
};


//**************************
//��ѡ��ť��ؼ�
//**************************
var __RadioGroup_ORIENTA_FLOW="flow";
var __RadioGroup_ORIENTA_HORIZONTAL="horizontal";
var __RadioGroup_ORIENTA_VERTICAL="vertical";
function _$buildRadioGroup(id,viewModel,bandMode){
	var group=null;
	if(id){
		if(browserType==__Browser_IE){
			eval("group = "+id);
			
		}else {
			group=$(id);
			
		}
	}else {
		id=_$genControlId();
		
	};
	if(group==null){
		group=$$("TABLE");
		group.id=id;
		group.cellPadding=0;
		group.cellSpacing=0;
		var tbody=$$("TBODY");
		var row=$$("TR");
		var cell=$$("TD");
		cell.align="center";
		row.appendChild(cell);
		tbody.appendChild(row);
		group.appendChild(tbody);
		
	};
	_$buildEditor(group,bandMode);
	group._$establishBinding=group.establishBinding;
	group.establishBinding=_$RadioGroup_establishBinding;
	group.setDropDown=_$Editor_setDropDown;
	group.getDropDown=_$Editor_getDropDown;
	group.activate=_$RadioGroup_activate;
	group.destroy=_$RadioGroup_destroy;	
	group.setValue=_$RadioGroup_setValue;
	group.getValue=_$RadioGroup_getValue;
	group.getLabel=_$RadioGroup_getLabel;
	group.setLayout=_$RadioGroup_setLayout;
	group.getLayout=_$RadioGroup_getLayout;
	group.setCols=_$RadioGroup_setCols;
	group.getCols=_$RadioGroup_getCols;
	group.setWidth=_$RadioGroup_setWidth;
	group.onFocus=_$RadioGroup_onFocus;
	group.onBlur=_$RadioGroup_onBlur;
	group.getRadioBoxs=_$RadioGroup_getRadioBoxs;
	group._$setReadOnly=_$RadioGroup_setReadOnly;
	group._$paint=_$RadioGroup_paint;
	group.setItemDataset=_$RadioGroup_setItemDataset;
	group.getItemDataset=_$RadioGroup_getItemDataset;
	group.setValueField=_$RadioGroup_setValueField;
	group.getValueField=_$RadioGroup_getValueField;
	group.setLabelField=_$RadioGroup_setLabelField;
	group.getLabelField=_$RadioGroup_getLabelField;
	group._viewModel=viewModel;
	if(!group.className)_$setElementStyle(group,"RadioGroup");
	group._class=group.className;
	var name=group.getAttribute("name");
	group._name=(name)?name:"__RadioGroup_"+group.id;
	group._layout=__RadioGroup_ORIENTA_FLOW;
	group._radioBoxs=new Array();
	group._valueField="value";
	group._labelField="label";
	group._cols=0;
	group.style.width="100%";
	group._kingfisherClass="RadioGroup";
	return group;
	
};
KingfisherFactory._$registerComponentType("RadioGroup",_$buildRadioGroup);
function _$RadioGroup_setItemDataset(itemDataset){
	
	this._itemDataset=itemDataset;
};
function _$RadioGroup_getItemDataset(){
	
	return this._itemDataset;
};
function _$RadioGroup_setValueField(valueField){
	
	this._valueField=valueField;
};
function _$RadioGroup_getValueField(){
	
	return this._valueField;
};
function _$RadioGroup_setLabelField(labelField){
	
	this._labelField=labelField;
};
function _$RadioGroup_getLabelField(){
	
	return this._labelField;
};
function _$RadioGroup_establishBinding(){
	if(this._dropDown==null){
		var dataset=this._dataset;
		if(dataset!=null){
			var field=dataset.getField(this._field);
			if(field!=null){
				this._dropDown=field._dropDown;
				
			}
		}
	};
	this._$establishBinding();
	
};
function _$RadioGroup_setReadOnly(readOnly){
	this.disabled=readOnly;
	this._$refreshStyle();
	
	var radioBoxs=this._radioBoxs;
	for(var i=0;i<radioBoxs.length;i++){
		var radio=radioBoxs[i];
		_$setElementStyle(radio.nextSibling, (radio.checked?(this.disabled?"Read":"")+"RadioOn":(this.disabled?"Read":"")+"RadioOff"));
				
	};
};
function _$RadioGroup_destroy(){
	this._$abolishBinding();
	this._radioBoxs=null;
	this._valueField=null;
	this._labelField=null;
	
};
function _$RadioGroup_activate(){
	if(!this._active){
		this._active=true;
		this.establishBinding();
		this._$paint();
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$RadioGroup_paint(){
	this._radioBoxs=new Array();	
	var cell=this.tBodies[0].rows[0].cells[0];
	cell.innerHTML="";
	switch(this._layout){
		case __RadioGroup_ORIENTA_VERTICAL:{
			cell.style.whiteSpace="";
			break;
			
		};
		case __RadioGroup_ORIENTA_FLOW:;
		case __RadioGroup_ORIENTA_HORIZONTAL:;
		{
			cell.style.whiteSpace="nowrap";
			break;
			
		}
	};

	var valueField,labelField;
	var dataset;
	var dropDown=this.getDropDown();
	if(this._itemDataset){
		valueField=this._valueField;
		labelField=this._labelField;
		dataset=kingfisher.feather.getDataset(this._itemDataset);
		if(dataset==null)
			return;
	}
	else if(dropDown!=null){
		if(typeof(dropDown._mapValue)=="undefined"){
			alert("RadioGroup \""+this.id+"\" is need with map value DropDown \""+dropDown.id+"\"!");
			return ;
			
		};
		dataset=dropDown.getDataset();
		if(dataset!=null){
			valueField=dropDown._valueField;
			labelField=dropDown._labelField;
		}
		else
			return;
	}
	else{
		valueField=this._valueField;
		labelField=this._labelField;
		dataset=_$itemXmlIsland2Dataset(this);
		if(dataset==null)
			return;
	}
	
	var count=0;
	var group=this;
	var record=dataset.getFirstRecord();
	while(record!=null){
		if((this._radioBoxs.length>0&&this._layout==__RadioGroup_ORIENTA_VERTICAL)||
			(this._radioBoxs.length>0&&this._layout==__RadioGroup_ORIENTA_FLOW&&
			this._cols>0&&count>=this._cols)){
			var newline=$$("BR");
			cell.appendChild(newline);
			count=0;
			
		};
		var radio;
		if(browserType==__Browser_IE){
			radio=$$("<INPUT type=\"radio\" id=\"" + _$genControlId() + "\" name=\""+this._name+"\">");
					
		}else {
			radio=$$("INPUT");
			radio.type="radio";
			radio.name=this._name;
			radio.id=_$genControlId();
			
		};
		
		radio.getLabel=function(){
			return this.label;
		};
		radio.getValue=function(){
			return this.value;
		};
		
		radio.value=record.getString(valueField);
		radio.label=record.getString(labelField);
		cell.appendChild(radio);
		var label=$$("<LABEL hideFocus=\"true\" for=\""+radio.id+"\">");
		label.innerHTML=record.getString(labelField)+"&nbsp;&nbsp;";
		cell.appendChild(label);
		
		radio.style.position="absolute";
		radio.style.left = "-1000px";
		_$setElementStyle(label, (radio.checked?(this._dataReadOnly?"Read":"")+"RadioOn":(this._dataReadOnly?"Read":"")+"RadioOff"));
		
		this._radioBoxs.push(radio);
		EventManager.addSystemEvent(radio,"onclick",function (){
			
			_$RadioGroup$Radio_onClick(group,_$getEventTarget());
					
		});
		EventManager.addSystemEvent(radio,"onfocus",function (){
			_$Element_onFocus(radio);
				
		});
		count++;
		record=record.getNextRecord();
				
	};
	this._$setValue();

};
function _$RadioGroup_setValue(value){
	value=new String(value);
	this._succeed=true;
	try{
		if(this._onSetValue==null||_$fireKingfisherEvent(this,"onSetValue",[this,value])){
			var radioBoxs=this._radioBoxs;
			for(var i=0;i<radioBoxs.length;i++){
				var radio=radioBoxs[i];
				radio.checked=(radio.value==value);
				_$setElementStyle(radio.nextSibling, (radio.checked?(this._dataReadOnly?"Read":"")+"RadioOn":(this._dataReadOnly?"Read":"")+"RadioOff"));
				
			};
		};
		this._oldValue=value;
		
	}finally{
		this._succeed=false;
		
	}
};
function _$RadioGroup_getValue(){
	if(this._onGetValue!=null){
		return _$fireKingfisherEvent(this,"onGetValue",[this]);
		
	}else {
		var value="";
		var radioBoxs=this._radioBoxs;
		for(var i=0;i<radioBoxs.length;i++){
			var radio=radioBoxs[i];
			if(radio.checked){
				value=radio.value;
				break;
				
			}
		};
		return value;
		
	}
};
function _$RadioGroup_getLabel(){
	var label="";
	var radioBoxs=this._radioBoxs;
	for(var i=0;i<radioBoxs.length;i++){
		var radio=radioBoxs[i];
		if(radio.checked){
			label=radio.label;
			break;
				
		}
	};
	return label;
		
};
function _$RadioGroup_getLayout(){
	return this._layout;
	
};
function _$RadioGroup_setLayout(layout){
	this._layout=layout;
	
};
function _$RadioGroup_getCols(){
	return this._cols;
	
};
function _$RadioGroup_setCols(cols){
	this._cols=cols;
	
};
function _$RadioGroup_setWidth(width){
	this.style.width=width;
	
};
function _$RadioGroup_onFocus(){
	this._hasFocus=true;
	this._$refreshStyle();
	var radioBoxs=this._radioBoxs;
	for(var i=0;i<radioBoxs.length;i++){
		var radio=radioBoxs[i];
		if(radio.checked){
			try{
				radio.focus();
				
			}catch(e){
				
			};
			return ;
			
		}
	};
	if(radioBoxs.length>0){
		try{
			radioBoxs[0].focus();
			
		}catch(e){
			
		}
	}
};
function _$RadioGroup_onBlur(){
	this.post();
	this._hasFocus=false;
	this._$refreshStyle();
	
};
function _$RadioGroup_getRadioBoxs(){
	return this._radioBoxs;
	
};
function _$RadioGroup$Radio_onClick(group,radio){
	if(!group._succeed){
		if(!group.post()){
			group.refresh();
			
		}
	}

	_$fireKingfisherEvent(group,"onClick",[group,radio]);
};



//**************************
//��ѡ��ť��ؼ�
//**************************
var __CheckBoxGroup_ORIENTA_FLOW="flow";
var __CheckBoxGroup_ORIENTA_HORIZONTAL="horizontal";
var __CheckBoxGroup_ORIENTA_VERTICAL="vertical";
function _$buildCheckBoxGroup(id,viewModel,bandMode){
	var group=null;
	if(id){
		if(browserType==__Browser_IE){
			eval("group = "+id);
			
		}else {
			group=$(id);
			
		}
	}else {
		id=_$genControlId();
		
	};
	if(group==null){
		group=$$("TABLE");
		group.id=id;
		group.cellPadding=0;
		group.cellSpacing=0;
		var tbody=$$("TBODY");
		var row=$$("TR");
		var cell=$$("TD");
		cell.align="center";
		row.appendChild(cell);
		tbody.appendChild(row);
		group.appendChild(tbody);
		
	};
	_$buildEditor(group,bandMode);
	group._$establishBinding=group.establishBinding;
	group.establishBinding=_$CheckBoxGroup_establishBinding;
	group.setDropDown=_$Editor_setDropDown;
	group.getDropDown=_$Editor_getDropDown;
	group.activate=_$CheckBoxGroup_activate;
	group.destroy=_$CheckBoxGroup_destroy;	
	group.setValue=_$CheckBoxGroup_setValue;
	group.getValue=_$CheckBoxGroup_getValue;
	group.getLabel=_$CheckBoxGroup_getLabel;
	group.setLayout=_$CheckBoxGroup_setLayout;
	group.getLayout=_$CheckBoxGroup_getLayout;
	group.setCols=_$CheckBoxGroup_setCols;
	group.getCols=_$CheckBoxGroup_getCols;
	group.setWidth=_$CheckBoxGroup_setWidth;
	group.onFocus=_$CheckBoxGroup_onFocus;
	group.onBlur=_$CheckBoxGroup_onBlur;
	group.getCheckBoxs=_$CheckBoxGroup_getCheckBoxs;
	group._$setReadOnly=_$CheckBoxGroup_setReadOnly;
	group._$paint=_$CheckBoxGroup_paint;
	group.setItemDataset=_$CheckBoxGroup_setItemDataset;
	group.getItemDataset=_$CheckBoxGroup_getItemDataset;
	group.setValueField=_$CheckBoxGroup_setValueField;
	group.getValueField=_$CheckBoxGroup_getValueField;
	group.setLabelField=_$CheckBoxGroup_setLabelField;
	group.getLabelField=_$CheckBoxGroup_getLabelField;
	group._viewModel=viewModel;
	if(!group.className)_$setElementStyle(group,"CheckBoxGroup");
	group._class=group.className;
	var name=group.getAttribute("name");
	group._name=(name)?name:"__CheckBoxGroup_"+group.id;
	group._layout=__CheckBoxGroup_ORIENTA_FLOW;
	group._checkboxBoxs=new Array();
	group._valueField="value";
	group._labelField="label";
	group.style.width="100%";
	group._kingfisherClass="CheckBoxGroup";
	return group;
	
};
KingfisherFactory._$registerComponentType("CheckBoxGroup",_$buildCheckBoxGroup);
function _$CheckBoxGroup_setItemDataset(itemDataset){
	
	this._itemDataset=itemDataset;
};
function _$CheckBoxGroup_getItemDataset(){
	
	return this._itemDataset;
};
function _$CheckBoxGroup_setValueField(valueField){
	
	this._valueField=valueField;
};
function _$CheckBoxGroup_getValueField(){
	
	return this._valueField;
};
function _$CheckBoxGroup_setLabelField(labelField){
	
	this._labelField=labelField;
};
function _$CheckBoxGroup_getLabelField(){
	
	return this._labelField;
};
function _$CheckBoxGroup_establishBinding(){
	if(this._dropDown==null){
		var dataset=this._dataset;
		if(dataset!=null){
			var field=dataset.getField(this._field);
			if(field!=null){
				this._dropDown=field._dropDown;
				
			}
		}
	};
	this._$establishBinding();
	
};
function _$CheckBoxGroup_setReadOnly(readOnly){
	this.disabled=readOnly;
	this._$refreshStyle();

	var checkboxBoxs=this._checkboxBoxs;
	for(var i=0;i<checkboxBoxs.length;i++){
		var checkbox=checkboxBoxs[i];
		_$setElementStyle(checkbox.nextSibling, (checkbox.checked?(this.disabled?"Read":"")+"CheckBoxGroupOn":(this.disabled?"Read":"")+"CheckBoxGroupOff"));
				
	};
	
};
function _$CheckBoxGroup_destroy(){
	this._$abolishBinding();
	this._checkboxBoxs=null;
	this._valueField=null;
	this._labelField=null;
	
};
function _$CheckBoxGroup_activate(){
	if(!this._active){
		this._active=true;
		this.establishBinding();
		this._$paint();
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$CheckBoxGroup_paint(){
	this._checkboxBoxs=new Array();	
	var cell=this.tBodies[0].rows[0].cells[0];
	cell.innerHTML="";
	switch(this._layout){
		case __CheckBoxGroup_ORIENTA_VERTICAL:{
			cell.style.whiteSpace="";
			break;
			
		};
		case __CheckBoxGroup_ORIENTA_FLOW:;
		case __CheckBoxGroup_ORIENTA_HORIZONTAL:;
		{
			cell.style.whiteSpace="nowrap";
			break;
			
		}
	};
	
	var valueField,labelField;
	var dataset;
	var dropDown=this.getDropDown();
	if(this._itemDataset){
		valueField=this._valueField;
		labelField=this._labelField;
		dataset=kingfisher.feather.getDataset(this._itemDataset);
		if(dataset==null)
			return;
	}
	else if(dropDown!=null){
		dataset=dropDown.getDataset();
		if(dataset!=null){
			valueField=dropDown._valueField;
			labelField=dropDown._labelField;
		}
		else
			return;
	}
	else{
		valueField=this._valueField;
		labelField=this._labelField;
		dataset=_$itemXmlIsland2Dataset(this);
		if(dataset==null)
			return;
	}
	
 	var count=0;
	var group=this;
	var record=dataset.getFirstRecord();
	while(record!=null){
		if((this._checkboxBoxs.length>0&&this._layout==__CheckBoxGroup_ORIENTA_VERTICAL)||
			(this._checkboxBoxs.length>0&&this._layout==__CheckBoxGroup_ORIENTA_FLOW&&
			this._cols>0&&count>=this._cols)){
			var newline=$$("BR");
			cell.appendChild(newline);
			count=0;
					
		};
		var checkbox;
		if(browserType==__Browser_IE){
			checkbox=$$("<INPUT type=\"checkbox\" id=\"" + _$genControlId() + "\" name=\""+this._name+"\">");
					
		}else {
			checkbox=$$("INPUT");
			checkbox.type="checkbox";
			checkbox.name=this._name;
			checkbox.id=_$genControlId();
					
		};
		
		checkbox.getLabel=function(){
			return this.label;
		};
		checkbox.getValue=function(){
			return this.value;
		};
		
		checkbox.label=record.getString(labelField);
		checkbox.value=record.getString(valueField);
		cell.appendChild(checkbox);
		var label=$$("<LABEL hideFocus=\"true\" for=\""+checkbox.id+"\">");
		label.innerHTML=record.getString(labelField)+"&nbsp;&nbsp;";
		cell.appendChild(label);
		
		checkbox.style.position="absolute";
		checkbox.style.left = "-1000px";
		label.className="CheckBoxOff";
		_$setElementStyle(label, (checkbox.checked?(this._dataReadOnly?"Read":"")+"CheckBoxGroupOn":(this._dataReadOnly?"Read":"")+"CheckBoxGroupOff"));

		this._checkboxBoxs.push(checkbox);			
			
		EventManager.addSystemEvent(checkbox,"onclick",function (){
			
			_$CheckBoxGroup$Checkbox_onClick(group,_$getEventTarget());
					
		});
		EventManager.addSystemEvent(checkbox,"onfocus",function (){
			_$Element_onFocus(checkbox);
				
		});
		count++;
		record=record.getNextRecord();
				
	};
	this._$setValue();
};
function _$CheckBoxGroup_setValue(value){
	value=new String(value);
	var valueArray=value.split(",");
	this._succeed=true;
	try{
		if(this._onSetValue==null||_$fireKingfisherEvent(this,"onSetValue",[this,value])){
			var checkboxBoxs=this._checkboxBoxs;
			for(var i=0;i<checkboxBoxs.length;i++){
				var checkbox=checkboxBoxs[i];
				checkbox.checked=false;
				
				for(var j=0;j<valueArray.length;j++){
					if(checkbox.value==valueArray[j]){
						checkbox.checked=true;
						break;
					}
				};
				_$setElementStyle(checkbox.nextSibling, (checkbox.checked?(this._dataReadOnly?"Read":"")+"CheckBoxGroupOn":(this._dataReadOnly?"Read":"")+"CheckBoxGroupOff"));
				
			}
		};
		this._oldValue=value;
		
	}finally{
		this._succeed=false;
		
	}
};
function _$CheckBoxGroup_getValue(){
	if(this._onGetValue!=null){
		return _$fireKingfisherEvent(this,"onGetValue",[this]);
		
	}else {
		var value="";
		var checkboxBoxs=this._checkboxBoxs;
		for(var i=0;i<checkboxBoxs.length;i++){
			var checkbox=checkboxBoxs[i];
			if(checkbox.checked){
				if(value.length>0)
					value+=",";
				value+=checkbox.value;
				
			}
		};
		return value;
		
	}
};
function _$CheckBoxGroup_getLabel(){
	var label=new Array();
	var checkboxBoxs=this._checkboxBoxs;
	for(var i=0;i<checkboxBoxs.length;i++){
		var checkbox=checkboxBoxs[i];
		if(checkbox.checked){
			label.push(checkbox.label);
				
		}
	};
	return label.join(",");
		
};
function _$CheckBoxGroup_getLayout(){
	return this._layout;
	
};
function _$CheckBoxGroup_setLayout(layout){
	this._layout=layout;
	
};
function _$CheckBoxGroup_getCols(){
	return this._cols;
	
};
function _$CheckBoxGroup_setCols(cols){
	this._cols=cols;
	
};
function _$CheckBoxGroup_setWidth(width){
	this.style.width=width;
	
};
function _$CheckBoxGroup_onFocus(){
	this._hasFocus=true;
	this._$refreshStyle();
	var checkboxBoxs=this._checkboxBoxs;
	for(var i=0;i<checkboxBoxs.length;i++){
		var checkbox=checkboxBoxs[i];
		if(checkbox.checked){
			try{
				checkbox.focus();
				
			}catch(e){
				
			};
			return ;
			
		}
	};
	if(checkboxBoxs.length>0){
		try{
			checkboxBoxs[0].focus();
			
		}catch(e){
			
		}
	}
};
function _$CheckBoxGroup_onBlur(){
	this.post();
	this._hasFocus=false;
	this._$refreshStyle();
	
};
function _$CheckBoxGroup_getCheckBoxs(){
	return this._checkboxBoxs;
	
};
function _$CheckBoxGroup$Checkbox_onClick(group,checkbox){
	if(!group._succeed){
		if(!group.post()){
			group.refresh();
			
		}
	}

	_$fireKingfisherEvent(group,"onClick",[group,checkbox]);
};



//**************************
//�������������
//**************************
function _$getDropDownTable(dropDown){
	var table=_$buildTable(dropDown.id+"$Table");
	if(!table.className)table.className="DropDownTable";
	table.style.width="100%";
	table.setReadOnly(true);
	table.setShowIndicator(false);
	table._dropDown=dropDown;
	EventManager.addSystemEvent(table,"onclick",function (){
		table._dropDown.onClick();
		
	});
	return table;
	
};
function DropDown(id){
	this._fixed=true;
	this._autoDropDown=false;
	this._width=0;
	this._height=0;
	this._box=null;
	this._opened=false;
	this._autoSize=true;
	
};
DropDown.prototype=new KingfisherComponent();
DropDown.prototype.isFixed=function (){
	return this._fixed;
	
};
DropDown.prototype.setFixed=function (fixed){
	this._fixed=fixed;
	
};
DropDown.prototype.isAutoDropDown=function (){
	return this._autoDropDown;
	
};
DropDown.prototype.setAutoDropDown=function (autoDropDown){
	this._autoDropDown=autoDropDown;
	
};
DropDown.prototype.isAutoSize=function (){
	return this._autoSize;
	
};
DropDown.prototype.setAutoSize=function (autoSize){
	this._autoSize=autoSize;

};
DropDown.prototype.getWidth=function (){
	return this._width;
	
};
DropDown.prototype.setWidth=function (width){
	this._width=width;
	
};
DropDown.prototype.getHeight=function (){
	return this._height;
	
};
DropDown.prototype.setHeight=function (height){
	this._height=height;	
	
};
DropDown.prototype.getDropDownBox=function (){
	var box=this._box;
	if(box==null){
		box=$$("DIV");
		box._kingfisherClass="DropDownBox";
		_$setVisible(box,false);
		box.style.position="absolute";
		box.style.left=0;
		box.style.top=0;
		box.style.width=0;
		box.style.height=0;
		box.className="DropDownBox";
		document.body.appendChild(box);
		this._box=box;
		box._dropDown=this;
		var dropDown=this;
		EventManager.addSystemEvent(box,"onmousedown",function (){
			_$Element_onFocus(dropDown._editor);
			event.cancelBubble=true;
			
		});
		
	};
	return box;
	
};
DropDown.prototype.isOpened=function (){
	return this._opened;
	
};
DropDown.prototype._$locateDropDownBox=function (){
	var editor=this._editor;
	var absPos=_$getAbsolutePosition(editor);
	var x=absPos[0],y=absPos[1];
	var left,top;
	var box=this.getDropDownBox();
	if(y+editor.offsetHeight+box.offsetHeight+1>document.body.clientHeight){
		top=y-box.offsetHeight-1;
		
	}else {
		top=y+editor.offsetHeight+1;
		
	};
	if(top<0)top=0;
	if(x+box.offsetWidth>document.body.clientWidth){
		left=x+editor.offsetWidth+(editor._dropdownBtn ? editor._dropdownBtn.offsetWidth : 0)-box.offsetWidth;
		
	}else {
		left=x;
		
	};
	if(left<0)left=0;	
	box.style.left=left;
	box.style.top=top;
	
};
DropDown.prototype._$sizeDropDownBox=function (editor){
	this._editor=editor;
	if(this._beforeOpen!=null){
		var result=_$fireKingfisherEvent(this,"beforeOpen",[this,editor]);
		if(result!=null)throw result;
		
	};

	var box=this.getDropDownBox();
	var absPos=_$getAbsolutePosition(editor);
	box.style.zIndex=_$autoGenIndex()+999;
	
	if(this._width>0){
		box.style.width=this._width;
			
	}else {
		var width=editor.offsetWidth + (editor._dropdownBtn ? editor._dropdownBtn.offsetWidth : 0) + 1;
		if(this._autoSize)
			box.style.width=width;
		else
			box.style.width=width<160? 160 : width;
			
	};

	box.style.height=0;
	this._$showDropDownBox(box);
	this._$locateDropDownBox();
	var childNodes=box.childNodes;
	for(var i=0;i<childNodes.length;i++){
		var childNode=childNodes[i];
		if(typeof(childNode.onResize)=="function"){
			childNode.onResize();
			
		}
	};
	this._opened=true;
	
};
DropDown.prototype.open=function (editor){
	try{
		this._$sizeDropDownBox(editor);
		this._$locateDropDownBox();
		var box=this.getDropDownBox();
		_$setVisible(box,true);
		
	}catch(e){
		_$processException(e);
		
	}
};
DropDown.prototype._$selectData=function (selectedRecord){
	if(selectedRecord!=null){
		if(this._onSelect==null||_$fireKingfisherEvent(this,"onSelect",[this,selectedRecord,this._editor])){
			this._$processDropDownSelected(selectedRecord);
			
		};
		_$elementOnFocus(this);
		
	};
	if(this._box!=null){
		var box=this._box;
		_$setVisible(box,false);
		
	};
	this._opened=false;
	
	if(selectedRecord!=null){
		_$fireKingfisherEvent(this,"afterSelect",[this,selectedRecord,this._editor]);
		
	};
};
DropDown.prototype.close=function (selectedRecord){
	this._$selectData(selectedRecord);
	
};



//**************************
//��������Ļ���
//**************************
function SimpleDropDown(){
	
};
SimpleDropDown.prototype=new DropDown();
SimpleDropDown.prototype.destroy=function (){
	this._box=null;
	this._editor=null;
	
};


//**************************
//������ݼ��󶨵�������ĳ�����
//**************************
function AbstractDatasetDropDown(){
	this._dataset=null;
	this._outlineTable=null;
	this._mapValue=false;
	this._labels=null;
	this._valueField="value";
	this._labelField="label";
	this._showColumnHeader=false;
	
};
AbstractDatasetDropDown.prototype=new SimpleDropDown();
AbstractDatasetDropDown.prototype._$destroy=SimpleDropDown.prototype.destroy;
AbstractDatasetDropDown.prototype.destroy=function (){
	this._$destroy();
	this._dataset=null;
	if(this._outlineTable!=null){
		this._outlineTable._dataset=null;
		
	};
	this._outlineTable=null;
	
};
AbstractDatasetDropDown.prototype.getDataset=function (){
	return this._dataset;
	
};
AbstractDatasetDropDown.prototype.setMapValue=function (mapValue){
	this._mapValue=mapValue;
	
};
AbstractDatasetDropDown.prototype.isMapValue=function (){
	return this._mapValue;	
	
};
AbstractDatasetDropDown.prototype._$buildIndex=function (){
	var labels=new Object();
	if(this._valueField&&this._labelField){
		var dataset=this.getDataset();
		var record=dataset.getFirstRecord();
		while(record!=null){
			labels["__"+record.getValue(this._valueField)]=record.getValue(this._labelField);
			record=record.getNextRecord();
			
		};
	}
	else{
		alert(__DROPDOWN_MAP_VALUE);
	}
	this._labels=labels;
	
};
AbstractDatasetDropDown.prototype.getLabel=function (value){
	if(this._mapValue){
		//����п����Ǽ����仯�ģ�����ʱ�̸���
		if(this._labels==null){
			this._$buildIndex();
			
		};
		var labels=this._labels;
		value=labels["__"+value];
		
	};
	var text="";
	if(value!=null){
		text=value+"";
		
	};
	return text;
	
};
AbstractDatasetDropDown.prototype._$showDropDownBox=function (box){
	var table=this._outlineTable;
	if(table==null){
		table=_$getDropDownTable(this);
		box.appendChild(table);
		var dataset=this.getDataset();
		table.setDataset(dataset);
		table.setShowHeader(this._showColumnHeader);
		table.setShowHScrollBar(false);
		if(browserType==__Browser_IE){
			EventManager.addSystemEvent(box,"onresize",function (){
				table.style.width=box.clientWidth;
				
			});
			
		}else {
			table.style.width="100%";
			
		};
		if(dataset.getVisibleCount()>8){
			table.setScrollMode(__Table_SCROLLMODE_RECORD);
			table.setShowVScrollBar(true);
			table.style.height=200;			
			
		}else {
			table.setScrollMode(__Table_SCROLLMODE_SIMPLE);
			table.setShowVScrollBar(false);
			
		};
		this._$showDataColumn(table);
		table.activate();
		this._outlineTable=table;
		
	};
	box.style.overflow="visible";
	if(this._height>0){
		box.style.height=this._height;
		
	}else {
		box.style.height=table.offsetHeight;
		
	}
};
AbstractDatasetDropDown.prototype._$processDropDownSelected=function (selectedRecord){
	var record=selectedRecord;
	var editor=this._editor;
	if(editor!=null){
		var newRecord=editor.getRecord(true);
		if(record!=null){
			if(newRecord!=null){
				if(this._valueField!=null){
					newRecord.setValue(editor._field,record.getValue(this._valueField));
					
				}else {
					newRecord.setValue(editor._field,record.getValue(0));
					
				}
			}else {
				if(this._valueField!=null){
					editor.value=record.getValue(this._valueField);
					
				}else {
					editor.value=record.getValue(0);
					
				}
			}
		}else {
			if(newRecord!=null){
				newRecord.setValue(editor._field,"");
				
			}else {
				editor.value="";
				
			}
		}
	}
	
};
AbstractDatasetDropDown.prototype._$showDataColumn=function (table){
	if(this._visibleFields==null){
		if(this._mapValue){
			table.addColumn(this._labelField);
			
		}else {
			table.addColumn(this._valueField);
			
		}
	}else {
		var fields=this._visibleFields.split(",");
		for(var i=0;i<fields.length;i++){
			table.addColumn(fields[i]);
			
		}
	}
};
AbstractDatasetDropDown.prototype.onKeyDown=function (){
	switch(event.keyCode){
		case 38:		//UP ARROW
		case 40:{		//DOWN ARROW
			var table=this._outlineTable;
			if(table!=null){
				table.onKeyDown();
				
			};
			break;
			
		};
		case 13:{		//ENTER
			this.close(this.getDataset()._current);
			event.returnValue=false;
			break;
			
		}
	}
};
AbstractDatasetDropDown.prototype.onClick=function (){
	this.close(this.getDataset().getCurrent());
	
};
AbstractDatasetDropDown.prototype.getDefaultLabel=function (){
	
	return this._defaultLabel;
};
AbstractDatasetDropDown.prototype.setDefaultLabel=function (defaultLabel){
	
	this._defaultLabel=defaultLabel;
};



//**************************
//�б�������
//**************************
function ListDropDown(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._type="List";
	
};
KingfisherFactory._$registerComponentType("ListDropDown",function (id,viewModel){
	return new ListDropDown(id,viewModel);
	
});
ListDropDown.prototype=new AbstractDatasetDropDown();
ListDropDown.prototype.getDataset=function (){
	if(this._dataset==null){
		var dataset=_$itemXmlIsland2Dataset(this);
		this._dataset=dataset;
		
	};
	return this._dataset;
	
};


//**************************
//��ݼ�����������
//**************************
function DatasetDropDown(id,viewModel){
	this.id=id;
	this._viewModel=viewModel;
	this._type="Dataset";
	this._valueField=null;
	this._labelField=null;
	this._readFields=null;
	this._writeFields=null;
	this._visibleFields=null;
	
};
KingfisherFactory._$registerComponentType("DatasetDropDown",function (id,viewModel){
	return new DatasetDropDown(id,viewModel);
	
});
DatasetDropDown.prototype=new AbstractDatasetDropDown();
DatasetDropDown.prototype._$$destroy=AbstractDatasetDropDown.prototype.destroy;
DatasetDropDown.prototype.destroy=function (){
	this._$$destroy();
	this._$abolishBinding();
	
};
DatasetDropDown.prototype._$activate=DatasetDropDown.prototype.activate;
DatasetDropDown.prototype.activate=function (){
	this._$activate();
	this.establishBinding();
};
DatasetDropDown.prototype.setDataset=function (dataset){
	this._dataset=kingfisher.feather.getDataset(dataset);
	if(this._active){
		this.establishBinding();
		
	}
};
DatasetDropDown.prototype.establishBinding=function (){
	var dataset=this._dataset;
	if(dataset!=null){
		if(isNaN(this._disableBindingCount))this._disableBindingCount=0;
		dataset.addObserver(this);
	}
};
DatasetDropDown.prototype._$abolishBinding=function (){
	var dataset=this._dataset;
	if(dataset!=null&&dataset._window!=this._window){
		dataset.removeObserver(this);
		
	}
};
DatasetDropDown.prototype.processDatasetMessage=function (message,dataset,args){
	
	switch(message){
		case __Dataset_MSG_REFRESH:;
		case __Dataset_MSG_REFRESH_RECORD:{
			this._labels=null;
			break;
		}
	};
};
DatasetDropDown.prototype.getVisibleFields=function (){
	return this._visibleFields;
	
};
DatasetDropDown.prototype.setVisibleFields=function (visibleFields){
	this._visibleFields=visibleFields;	
	
};
DatasetDropDown.prototype._$processDropDownSelected=function (selectedRecord){
	var record=selectedRecord;
	var editor=this._editor;
	var readFields;
	if(editor!=null){
		var newRecord=editor.getRecord(true);
		if(newRecord!=null){
			var dataset=newRecord._dataset;
			var writeFields;
			if(this._readFields!=null){
				readFields=this._readFields.split(",");
				
			}else {
				readFields=[];
				
			};
			if(this._writeFields!=null){
				writeFields=this._writeFields.split(",");
				
			}else {
				writeFields=readFields;
				
			};
			if(readFields.length!=writeFields.length){
				alert("error: readFields and writeFields!");
				return ;
				
			};
			if(record!=null){
				if(readFields.length>0){
					if(readFields.length>3){
						dataset.disableControls();
						
					};
					try{
						for(var i=0;i<readFields.length;i++){
							newRecord.setValue(writeFields[i],record.getValue(readFields[i]));
							
						}
					}finally{
						if(readFields.length>3){
							dataset.enableControls();
							dataset.refreshControls();
							
						}
					}
				}else {
					if(this._valueField!=null){
						newRecord.setValue(editor._field,record.getValue(this._valueField));
						
					}
					
				}
			}else {
				if(readFields.length>0){
					if(readFields.length>3){
						dataset.disableControls();
						
					};
					try{
						for(var i=0;i<readFields.length;i++){
							newRecord.setValue(writeFields[i],"");
							
						}
					}finally{
						if(readFields.length>3){
							dataset.enableControls();
							dataset.refreshControls();
							
						}
					}
				}else {
					newRecord.setValue(editor._field,"");
					
				}
			}
		}else {
			if(record!=null){
				var field=editor._field;
				if(field!=null){
					editor.value=record.getValue(field);
					
				}else {
					if(this._readFields!=null){
						readFields=this._readFields.split(",");
						if(readFields.length>0)
							editor.value=record.getValue(readFields[0]);
					}
					else
						editor.value=record.getValue(0);
					
				}
			}else {
				editor.value="";
				
			}
		}
	}
};
DatasetDropDown.prototype.getValueField=function (){
	return this._valueField;
	
};
DatasetDropDown.prototype.setValueField=function (valueField){
	this._valueField=valueField;
	
};
DatasetDropDown.prototype.getLabelField=function (){
	return this._labelField;
	
};
DatasetDropDown.prototype.setLabelField=function (labelField){
	this._labelField=labelField;	
	
};
DatasetDropDown.prototype.getReadFields=function (){
	return this._readFields;
	
};
DatasetDropDown.prototype.setReadFields=function (readFields){
	this._readFields=readFields;
	
};
DatasetDropDown.prototype.getWriteFields=function (){
	return this._writeFields;
	
};
DatasetDropDown.prototype.setWriteFields=function (writeFields){
	this._writeFields=writeFields;
	
};
DatasetDropDown.prototype.isShowColumnHeader=function (){
	return this._showColumnHeader;
	
};
DatasetDropDown.prototype.setShowColumnHeader=function (showColumnHeader){
	this._showColumnHeader=showColumnHeader;
	
};



//**************************
//����������
//**************************
function DateDropDown(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._type="Date";
	this._fixed=false;
	
};
KingfisherFactory._$registerComponentType("DateDropDown",function (id,viewModel){
	return new DateDropDown(id,viewModel);
	
});
DateDropDown.prototype=new SimpleDropDown();
DateDropDown.prototype.setAutoSize=function (autoSize){
	
};
DateDropDown.prototype._$showDropDownBox=function (box){
	var boxWidth=box.clientWidth;
	var calendar;
	if(box.childNodes.length==0){
		calendar=KingfisherFactory.create("Calendar",null,null);
		calendar.style.borderWidth=0;
		calendar.style.height=180;
		calendar.style.width="100%";
		box.appendChild(calendar);
		box.style.width=calendar.offsetWidth;
		box.style.height=calendar.offsetHeight;
		calendar.activate();
		var dateDropDown=this;
		EventManager.addKingfisherEvent(calendar,"onCellClick",function (calendar){
			dateDropDown._$selectDate(calendar,calendar.getDate());
			
		});		
		EventManager.addKingfisherEvent(calendar,"onTodayClick",function (calendar){
			dateDropDown._$selectDate(calendar,new Date());
			
		});
		
	}else {
		calendar=box.firstChild;
		
	};
	var autoAnchorDate=null;
	if(this._editor!=null){
		autoAnchorDate=parseDate(this._editor.value);
		
	};
	if(autoAnchorDate!=null){
		calendar.setDate(autoAnchorDate);
		
	}else {
		calendar.setDate(new Date());
		
	};
	if(boxWidth<=230){
		calendar.style.width=230;
		
		if(parseInt(calendar.style.width)>parseInt(document.body.clientWidth)-2)
			calendar.style.width=parseInt(document.body.clientWidth)-2;
	}else {
		calendar.style.width="100%";
		
	}
};
DateDropDown.prototype._$selectDate=function (calendar,date){
	this.close(date);
	
};
DateDropDown.prototype._$processDropDownSelected=function (selectedRecord){
	var date=selectedRecord;
	var editor=this._editor;
	if(editor!=null){
		var newRecord=editor.getRecord(true);
		if(date!=null){
			if(newRecord!=null){
				var dataType=1;
				var dataset=newRecord._dataset;
				if(dataset){
					var field=dataset.getField(editor._field);
					if(field)dataType=field._dataType;
					
				};
				if(dataType<=1){
					newRecord.setValue(editor._field,formatDate(date,"yyyy-MM-dd"));
					
				}else {
					newRecord.setValue(editor._field,date.getTime());
					
				}				
				
			}else {
				editor.value=formatDate(date);
				
			}
		}else {
			if(newRecord!=null){
				newRecord.setValue(editor._field,"");
				
			}else {
				editor.value="";
				
			}
		}
		
	}
};
DateDropDown.prototype.onKeyDown=function (){
	var calendar=this.getDropDownBox().firstChild;
	switch(event.keyCode){
		case 37:
		case 39:
		case 38:
		case 40:
		case 33:
		case 34:{
			calendar.onKeyDown();
			break;
			
		};
		case 84:{
			if(event.ctrlKey){
				calendar.onKeyDown();
				
			};
			break;
			
		};
		case 13:{
			this._$selectDate(calendar,calendar.getDate());
			event.returnValue=false;
			break;
			
		}
	}
};



//**************************
//�߼�������ĳ�����
//**************************
function AdvanceDropDown(id){
	this._cachable=true;
	this._path=null;
	this._frame=null;
	this._statusLabel=null;
	this._readFields=null;
	this._writeFields=null;
	this._warmUpDelay=0;
	this._parameters=new ParameterSet();
	
};
AdvanceDropDown.prototype=new DropDown();
AdvanceDropDown.prototype.parameters=function (){
	return this._parameters;
	
};
AdvanceDropDown.prototype._$activate=AdvanceDropDown.prototype.activate;
AdvanceDropDown.prototype.activate=function (){
	this._$activate();
	if(this._warmUpDelay>0){
		setTimeout(this.id+".warmUp();",this._warmUpDelay*100);
		
	}
};
AdvanceDropDown.prototype.destroy=function (){
	this._box=null;	
	this._editor=null;
	this._frame=null;
	this._statusLabel=null;
	
};
AdvanceDropDown.prototype.isCachable=function (){
	return this._cachable;
	
};
AdvanceDropDown.prototype.setCachable=function (cachable){
	this._cachable=cachable;
	
};
AdvanceDropDown.prototype.getReadFields=function (){
	return this._readFields;
	
};
AdvanceDropDown.prototype.setReadFields=function (readFields){
	this._readFields=readFields;
	
};
AdvanceDropDown.prototype.getWriteFields=function (){
	return this._writeFields;
	
};
AdvanceDropDown.prototype.setWriteFields=function (writeFields){
	this._writeFields=writeFields;
	
};
AdvanceDropDown.prototype.getWarmUpDelay=function (){
	return this._warmUpDelay;
	
};
AdvanceDropDown.prototype.setWarmUpDelay=function (warmUpDelay){
	this._warmUpDelay=warmUpDelay;
	
};
AdvanceDropDown.prototype._$getStatusLabel=function (editor){
	var label=this._statusLabel;
	if(label==null){
		label=$$("DIV");
		label.className="DropDownStatusLabel";
		label.style.whiteSpace="nowrap";
		label.innerText=__DROPDOWN_OPENING;
		_$setVisible(label,false);
		label.style.position="absolute";
		document.body.appendChild(label);
		this._statusLabel=label;
		
	};
	return label;
	
};
AdvanceDropDown.prototype._$showStatusLabel=function (editor){
	var absPos=_$getAbsolutePosition(editor);
	var label=this._$getStatusLabel(editor);
	if(label.offsetWidth<editor.offsetWidth){
		label.style.width=editor.offsetWidth;
		
	};
	label.style.left=absPos[0]-((label.offsetWidth-editor.offsetWidth)/2);
	label.style.top=absPos[1]+editor.offsetHeight+2;
	_$setVisible(label,true);	
	
};
AdvanceDropDown.prototype._$hideStatusLabel=function (){
	if(this._statusLabel!=null){
		_$setVisible(this._statusLabel,false);
		
	}
};
AdvanceDropDown.prototype._$showAdvanceDropDownBox=function (){

	if(!this._opened)return false;
	var show=false;
	var dropdownContent=this._frame.contentWindow;
	if(dropdownContent.__DROPDOWN_Page_Opened){
		show=true;
		dropdownContent._$registerAdvanceDropDown(this,window);
		
	}else if((new Date().getTime()-this._openStartTime)>(30*1000)){
		show=true;
		alert(__DROPDOWN_TIMEOUT);
		
	};

	if(show){
		this._$hideStatusLabel();
		this._$locateDropDownBox();
		var box=this.getDropDownBox();
		_$setVisible(box,true);
		if(typeof(this._$editorFilter_focus)=="function"){
			this._$editorFilter_focus();
			
		}
	}else {
		this._showDropdownBoxHandle=setTimeout("kingfisher.feather.getControl(\""+this.id+"\")._$showAdvanceDropDownBox()",100);
		
	};
	return show;
	
};
AdvanceDropDown.prototype.warmUp=function (){
	if(!this._cachable){
		alert("$Jt $au $U4! \""+this.id+"\" is $k1 cachable.");
		return ;
		
	};
	var box=this.getDropDownBox();
	this._$showDropDownBox(box);
	
};
AdvanceDropDown.prototype._$showDropDownBox=function (box){
	var isCache=false;
	var frame=this._frame;
	if(frame==null){
		box.innerHTML="<IFRAME name=\""+this.id+"_frame\" frameBorder=\"0\" marginWidth=\"0\" marginHeight=\"0\" "+"scrolling=\"no\" style=\"width: 100%; height: 100%\"></IFRAME>";
		frame=box.firstChild;
		this._frame=frame;	
		if(browserType==__Browser_IE){
			EventManager.addSystemEvent(frame,"onfocus",function (){
				_$Element_onFocus(frame);
				
			});
			
		};
		isCache=true;
		
	};
	if(isCache||!this._cachable){
		if(browserType==__Browser_IE){
			var path=this.getPath();
			frame.contentWindow.location.href=path;
			
		}else {
			frame.src=this.getPath();
			
		}
	};
	box.style.overflow="hidden";
	if(this._height>0){
		box.style.height=this._height;
		
	}else {
		box.style.height=200;
		
	}
};
AdvanceDropDown.prototype.open=function (editor){
	try{
		this._$sizeDropDownBox(editor);
		this._openStartTime=new Date().getTime();
		if(!this._$showAdvanceDropDownBox()){
			this._$showStatusLabel(editor);
			clearTimeout(this._showDropdownBoxHandle);
			this._showDropdownBoxHandle=setTimeout("kingfisher.feather.getControl(\""+this.id+"\")._$showAdvanceDropDownBox()",100);
			
		}
	}catch(e){
		_$processException(e);
		
	}
};
AdvanceDropDown.prototype.close=function (selectedRecord){
	this._$hideStatusLabel();
	this._$selectData(selectedRecord);
	var dropdownContent=this._frame.contentWindow;
	if(this._showDropdownBoxHandle){
		
		clearTimeout(this._showDropdownBoxHandle);
		if(dropdownContent!=null&&typeof(dropdownContent._$releaseAdvanceDropDown)=="function"){
			dropdownContent._$releaseAdvanceDropDown();
			
		}
	};
	if(!this._cachable&&dropdownContent!=null){
		dropdownContent.location.href="about:blank";
		
	}
};
AdvanceDropDown.prototype._$processDropDownSelected=function (selectedRecord){
	var record=selectedRecord;
	var editor=this._editor;
	if(editor!=null){
		var newRecord=editor.getRecord(true);
		if(newRecord!=null){
			var dataset=newRecord._dataset;
			var readFields;
			var writeFields;
			if(this._readFields!=null){
				readFields=this._readFields.split(",");
				
			}else {
				readFields=[];
				
			};
			if(this._writeFields!=null){
				writeFields=this._writeFields.split(",");
				
			}else {
				writeFields=readFields;
				
			};
			if(readFields.length!=writeFields.length){
				alert("error: readFields length != writeFields length!");
				return ;
				
			};
			if(record!=null){
				if(readFields.length>0){
					if(readFields.length>3){
						dataset.disableControls();
						
					};
					try{
						for(var i=0;i<readFields.length;i++){
							newRecord.setValue(writeFields[i],record.getValue(readFields[i]));
							
						}
					}finally{
						
						if(readFields.length>3){
							dataset.enableControls();
							dataset.refreshControls();
							
						}
					}
				}else {
					editor.value=record.getValue(0);
					
				}
			}else {
				if(readFields.length>0){
					if(readFields.length>3){
						dataset.disableControls();
						
					};
					try{
						for(var i=0;i<readFields.length;i++){
							newRecord.setValue(writeFields[i],"");
							
						}
					}finally{
						if(readFields.length>3){
							dataset.enableControls();
							dataset.refreshControls();
							
						}
					}
				}else {
					editor.value="";
					
				}
			}
		}else {
			if(record!=null){
				var field=editor._field;
				if(field!=null){
					editor.value=record.getValue(field);
					
				}else {
					editor.value=record.getValue(0);
					
				}
			}else {
				editor.value="";
				
			}
		}
	}
};


//**************************
//��̬���������
//**************************
function DynamicDropDown(id,viewModel){
	
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._type="Dynamic";
	this._visibleFields="";
	this._visibleLabels="";
	this._columnFields="";
	this._showColumnHeader=true;
	this._filterParameter="";
	this._loadDataAction="";
	this._filterOnOpen=false;
	this._startWithEmptyRecord=false;
	this._pageSize=20;
	this._isFeather3=true;
	
};
KingfisherFactory._$registerComponentType("DynamicDropDown",function (id,viewModel){
	return new DynamicDropDown(id,viewModel);
	
});
DynamicDropDown.prototype=new AdvanceDropDown();
DynamicDropDown.prototype.getPath=function (){
	var path=new Array();
	path.push(__CONTEXT_PATH);
	if(this._isFeather3){
		path.push("/kingfisher/showDynamicDropDown3.do");
		path.push("?viewInstanceId="+this._viewModel._instanceId);
		path.push("&dropDown="+this.id);
		path.push("&showColumnHeader="+this._showColumnHeader);
		path.push("&startWithEmptyRecord="+this._startWithEmptyRecord);
		path.push("&visibleFields="+this._visibleFields);
		path.push("&filterParameter="+this._filterParameter);
		var parameters=this._parameters._parameters;
		var size=parameters.size();
		for(var i=0;i<size;i++){
			var parameter=parameters._objectArray[i];
			path.push("&pn="+parameter._name);
			path.push("&pv="+_$encode(parameter._value));
			path.push("&pt="+_$encode(parameter._dataType));
			
		};
	}
	else{
		path.push("/kingfisher/showDynamicDropDown2.do");
		path.push("?viewInstanceId="+this._viewModel._instanceId);
		path.push("&dropDown="+this.id);
		path.push("&showColumnHeader="+this._showColumnHeader);
		path.push("&visibleFields="+this._visibleFields);
		path.push("&visibleLabels="+_$encode(this._visibleLabels).replace(/\%u/g,"^"));
		path.push("&columnFields="+this._columnFields);
		path.push("&filterParameter="+this._filterParameter);
		path.push("&pageSize="+this._pageSize);
		path.push("&loadDataAction="+parseString(this._loadDataAction).replace(/\&/g,"~!~"));
		var parameters=this._parameters._parameters;
		var size=parameters.size();
		for(var i=0;i<size;i++){
			var parameter=parameters._objectArray[i];
			path.push("&paramName="+parameter._name);
			path.push("&paramValue="+_$encode(parameter._value));
			path.push("&paramDataType="+_$encode(parameter._dataType));
			
		};
	}
	return path.join("");
	
};
DynamicDropDown.prototype.onKeyDown=function (){
	if(this._frame!=null){
		var dropdownContent=this._frame.contentWindow;
		var table;
		try{
			table=dropdownContent.$("tableDropDown");
		}
		catch(e){
		}
		if(table!=null){
			switch(event.keyCode){
				case 13:{
					this.close();
					event.returnValue=false;
					break;
					
				};
				default:{
					table.onKeyDown();
					break;					
					
				}
			}
		}
	}
};
DynamicDropDown.prototype.setIsFeather3=function (isFeather3){
	this._isFeather3=parseBoolean(isFeather3);
	
};
DynamicDropDown.prototype.getLoadDataAction=function (){
	return this._loadDataAction;
	
};
DynamicDropDown.prototype.setLoadDataAction=function (loadDataAction){
	this._loadDataAction=loadDataAction;
	
};
DynamicDropDown.prototype.getPageSize=function (){
	return this._pageSize;
	
};
DynamicDropDown.prototype.setPageSize=function (pageSize){
	this._pageSize=pageSize;
	
};
DynamicDropDown.prototype.getColumnFields=function (){
	return this._columnFields;
	
};
DynamicDropDown.prototype.setColumnFields=function (columnFields){
	this._columnFields=columnFields;
	
};
DynamicDropDown.prototype.getVisibleFields=function (){
	return this._visibleFields;
	
};
DynamicDropDown.prototype.setVisibleFields=function (visibleFields){
	this._visibleFields=visibleFields;
	
};
DynamicDropDown.prototype.getVisibleLabels=function (){
	return this._visibleLabels;
	
};
DynamicDropDown.prototype.setVisibleLabels=function (visibleLabels){
	this._visibleLabels=visibleLabels;
	
};
DynamicDropDown.prototype.isShowColumnHeader=function (){
	return this._showColumnHeader;
	
};
DynamicDropDown.prototype.setShowColumnHeader=function (showColumnHeader){
	this._showColumnHeader=showColumnHeader;
	
};
DynamicDropDown.prototype.getFilterParameter=function (){
	return this._filterParameter;
	
};
DynamicDropDown.prototype.setFilterParameter=function (filterParameter){
	this._filterParameter=filterParameter;
	
};
DynamicDropDown.prototype.isFilterOnOpen=function (){
	return this._filterOnOpen;
	
};
DynamicDropDown.prototype.setFilterOnOpen=function (filterOnOpen){
	this._filterOnOpen=filterOnOpen;
	
};
DynamicDropDown.prototype.isStartWithEmptyRecord=function (){
	return this._startWithEmptyRecord;
	
};
DynamicDropDown.prototype.setStartWithEmptyRecord=function (startWithEmptyRecord){
	this._startWithEmptyRecord=startWithEmptyRecord;
	
};
//location filter editor
DynamicDropDown.prototype._$editorFilter_focus=function (){
	var dropdownContent=this._frame.contentWindow;
	var editorFilter;
	try{
		editorFilter=dropdownContent.$("editorFilter1");
	}catch(e){		
	}
	
	if(editorFilter!=null){
		editorFilter.focus();
			
	}
};



//**************************
//�Զ���������
//**************************
var __CustomDropDown_OPENMODE_DROPDOWN="dropdown";      //������ģʽ//
var __CustomDropDown_OPENMODE_SUBWINDOW="subwindow";    //��������ģʽ//
function CustomDropDown(id,viewModel){
	if(!id)id=_$genControlId();	
	this.id=id;
	this._viewModel=viewModel;
	this._type="Custom";
	this._path=null;
	this._openMode=__CustomDropDown_OPENMODE_DROPDOWN;
	
};
KingfisherFactory._$registerComponentType("CustomDropDown",function (id,viewModel){
	return new CustomDropDown(id,viewModel);
	
});
CustomDropDown.prototype=new AdvanceDropDown();
CustomDropDown.prototype.getPath=function (){

	var path=this._path;
	if(path.lastIndexOf("?")==-1)
		path+="?x=";
	var parameters=this._parameters._parameters;
	var size=parameters.size();
	for(var i=0;i<size;i++){
		var parameter=parameters._objectArray[i];
		path+="&paramName="+parameter._name;
		path+="&paramValue="+_$encode(parameter._value);
		path+="&paramDataType="+_$encode(parameter._dataType);
			
	};
	return path;
	
};
CustomDropDown.prototype.setPath=function (path){
	if ((path.length>0) && (path.substr(0,4)=='http'))
	{

	}
	else if(path.length>0&&path.charAt(0)=='/'){
		path=__CONTEXT_PATH+path;
		
	};
	this._path=path;
	
};
CustomDropDown.prototype.getOpenMode=function (){
	return this._openMode;
	
};
CustomDropDown.prototype.setOpenMode=function (openMode){
	this._openMode=openMode;
	
};
CustomDropDown.prototype.onKeyDown=function (){
	if(this._frame!=null){
		var dropdownContent=this._frame.contentWindow;
		if(dropdownContent!=null){
			switch(event.keyCode){
				case 13:{
					this.close();
					event.returnValue=false;
					break;
					
				};
				default:{
					if(dropdownContent._$Document_onKeyDown!=null){
						dropdownContent._$Document_onKeyDown();
						
					};
					break;
					
				}
			}
		}
	}
};
CustomDropDown.prototype.warmUp=function (){
	if(!this._cachable){
		alert("$Jt $au $U4! \""+this.id+"\" is $k1 cachable.");
		return ;		
		
	};
	if(this._openMode==__CustomDropDown_OPENMODE_DROPDOWN){
		var box=this.getDropDownBox();
		this._$showDropDownBox(box);
		
	}else {
		this._$showDropDownSubWindow();
		
	}
};
CustomDropDown.prototype._$showDropDownSubWindow=function (){
	var subWindow=this._subWindow;
	var isCache=(subWindow==null);
	if(subWindow==null){
		subWindow=this._$buildSubWindow();
		this._subWindow=subWindow;
		
	};
	subWindow.style.width=this._width;
	subWindow.style.height=this._height;
	this._frame=subWindow.getContentContainer().firstChild;
	if(isCache||!this._cachable){
		var windowContent=this._frame;
		var windowBody=windowContent.nextSibling;
		windowBody.style.display="";
		window.open(this._path,"__frame_"+subWindow.id);
		
	};
	return subWindow;
	
};
CustomDropDown.prototype._$open=CustomDropDown.prototype.open;
CustomDropDown.prototype.open=function (editor){
	if(this._openMode==__CustomDropDown_OPENMODE_DROPDOWN){
		this._$open(editor);
		
	}else {
		try{
			if(this._beforeOpen!=null){
				var result=_$fireKingfisherEvent(this,"beforeOpen",[this]);
				if(result!=null)throw result;
				
			};

			if(!this._path){
				alert("dropdown \"path\" not defined!");
				return ;
				
			};

			var subWindow=this._$showDropDownSubWindow();
			subWindow.show(true,true);
			_$processActiveElementChanged(null);
			this._editor=editor;			
			this._opened=true;
			this._openStartTime=new Date().getTime();
			if(!this._$showAdvanceDropDownBox()){
				clearTimeout(this._showDropdownBoxHandle);
				this._showDropdownBoxHandle=setTimeout("kingfisher.feather.getControl(\""+this.id+"\")._$showAdvanceDropDownBox()",100);
				
			}
		}catch(e){
			_$processException(e);
			
		}
	}
};
CustomDropDown.prototype._$close=CustomDropDown.prototype.close;
CustomDropDown.prototype.close=function (selectedRecord){
	if(this._openMode==__CustomDropDown_OPENMODE_DROPDOWN){
		this._$close(selectedRecord);
		
	}else {
		var subWindow=this._subWindow;
		subWindow.hide();
		this._$selectData(selectedRecord);
		var dropdownContent=this._frame.contentWindow;
		if(this._showDropdownBoxHandle){
			clearTimeout(this._showDropdownBoxHandle);
			if(dropdownContent!=null&&typeof(dropdownContent._$releaseAdvanceDropDown)=="function"){
				dropdownContent._$releaseAdvanceDropDown();
				
			}
		}
	}
};
CustomDropDown.prototype._$parent_showAdvanceDropDownBox=AdvanceDropDown.prototype._$showAdvanceDropDownBox;
CustomDropDown.prototype._$showAdvanceDropDownBox=function (){
	
	if(!this._opened)return false;
	if(this._openMode==__CustomDropDown_OPENMODE_DROPDOWN){
		return this._$parent_showAdvanceDropDownBox();
		
	}else {
		var dropdownContent=this._frame.contentWindow;
		if(dropdownContent.__DROPDOWN_Page_Opened){
			dropdownContent._$registerAdvanceDropDown(this,window);
			return true;
			
		}else if((new Date().getTime()-this._openStartTime)>(30*1000)){
			alert(__DROPDOWN_TIMEOUT);
			
		}else {
			
			this._showDropdownBoxHandle=setTimeout("kingfisher.feather.getControl(\""+this.id+"\")._$showAdvanceDropDownBox()",100);
			
		};
		return false;
		
	}
};
CustomDropDown.prototype._$buildSubWindow=function (){
	var subWindow=KingfisherFactory.create("SubWindow",null,null,__SubWindow_STATUS_HIDDEN);	
	subWindow.style.width=400;
	subWindow.style.height=300;
	subWindow.setShowMinimizeButton(false);
	subWindow.setShowMaximizeButton(false);
	subWindow.setShowCloseButton(true);
	subWindow.activate();
	var windowContainer=subWindow.getContentContainer();
	windowContainer.style.position="relative";	
	windowContainer.innerHTML="<IFRAME name=\"__frame_"+subWindow.id+"\" "+"onload=\"CustomDropDown_setWindowTitle($('"+subWindow.id+"'));\" "+"frameBorder=\"0\" marginWidth=\"0\" marginHeight=\"0\" scrolling=\"no\" style=\"width: 100%; height: 100%\"></IFRAME>"+"<DIV style=\"left:0;top:0;width:100%;height:100%;position:absolute;background-color:white\">"+"<CENTER><TABLE style=\"height:100%\"><TR><TD><IMG src=\""+__SKIN_PATH+"/loading.gif\"></TD><TD>"+__LOADING_TIP+"</TD></TR></TABLE></CENTER></DIV>";
	subWindow.style.position="absolute";
	document.body.appendChild(subWindow);
	var dropDown=this;
	EventManager.addKingfisherEvent(subWindow,"afterHide",function (subWindow){
		var frame=dropDown._frame;
		if(!dropDown._cachable){
			window.open("about:blank","__frame_"+subWindow.id);
			
		}
	});
	return subWindow;
	
};
function CustomDropDown_setWindowTitle(subWindow){
	var windowContent=subWindow.getContentContainer().firstChild;
	try{
		var windowContent=subWindow.getContentContainer().firstChild;
		var windowBody=windowContent.nextSibling;
		windowBody.style.display="none";
		var title=windowContent.contentWindow.document.title;
		if(!title){
			title=windowContent.contentWindow.location.href;
			
		};
		subWindow.setTitle(title);
		
	}catch(e){
		
	}
};



function _$buildCellEditor(bandMode,editorType){
	if(editorType!=null){
		editorType=editorType.toLowerCase();
		
	}else {
		editorType="text";
		
	};
	var editor;
	if(editorType=="text"||editorType=="password"){
		editor=KingfisherFactory.create("TextEditor",null,null,bandMode,editorType);
		editor._defaultWidth=30;
		
	}else if(editorType=="textarea"){
		editor=KingfisherFactory.create("TextEditor",null,null,bandMode,editorType);
		editor._defaultWidth=80;
		editor._defaultHeight=50;
		
	}else if(editorType=="checkbox"){
		editor=KingfisherFactory.create("CheckBox",null,null,bandMode);
		
	}else if(editorType=="radio"){
		editor=KingfisherFactory.create("RadioGroup",null,null,bandMode);
		
	}else if(editorType=="checkgroup"){
		editor=KingfisherFactory.create("CheckGroup",null,null,bandMode);
		
	}else {
		editor=KingfisherFactory.create("TextEditor",null,null,bandMode);
		editor._defaultWidth=30;
		
	};
	EventManager.addSystemEvent(editor,"onmousewheel",function (){
		return _$Table_onMouseWheel(editor._outlineTable);
		
	});
	editor._$$destroy=editor.destroy;
	editor.destroy=_$CellEditor_destroy;
	editor._outlineTable=null;
	editor._activeCell=null;
	editor._localize=true;
	return editor;
	
};
function _$CellEditor_onFocus(){
	if(typeof(this._$oldOnFocus)=="function"){
		this._$oldOnFocus();
		
	}
};
function _$CellEditor_onBlur(){
	if(this._blurProcessing){
		return ;
		
	};
	this._blurProcessing=true;
	try{
		
		if(this._visible){
			this._outlineTable._$hideCellEditor();
			
		};
		if(typeof(this._$oldOnBlur)=="function"){
			this._$oldOnBlur();
			
		}
	}finally{
		this._blurProcessing=false;
		
	}
};
function _$CellEditor_onKeyDown(){
	if(typeof(this._$oldOnKeyDown)=="function"){
		if(!this._$oldOnKeyDown())return ;
		
	};
	this._outlineTable.onKeyDown();
	
};
function _$CellEditor_destroy(){
	this._outlineTable=null;
	this._activeCell=null;
	this._$$destroy();
	
};
var __Default_Indicator_Width=12;
var __Header_ColumnSplitSlider=null;
var __Header_ColumnDraggingCursor=null;
var __Header_ColumnDraggingAnchorPoint=null;
var __Current_HeaderGrid=null;
function _$releaseTablePublicResource(){
	__Header_ColumnSplitSlider=null;
	__Header_ColumnDraggingCursor=null;
	__Header_ColumnDraggingAnchorPoint=null;
	__Current_HeaderGrid=null;
	
};
_$registerFinalizeProcedure(_$releaseTablePublicResource);


//**************************
//����еĳ�����
//**************************
function Column(name){
	this._type=null;
	this._name=name;
	this._label=null;
	this._visible=true;
	this._resizable=true;
	this._toolTip=null;
	this._headerClickable=false;
	this._tag=null;
	this._fullSelected=true;
	
};
Column.prototype.getType=function (){
	return this._type;
	
};
Column.prototype.setType=function (type){
	this._type=type;
	
};
Column.prototype.getName=function (){
	return this._name;
	
};
Column.prototype.setLabel=function (label){
	this._label=label;
	
};
Column.prototype.getLabel=function (){
	return this._label;
	
};
Column.prototype.isVisible=function (){
	return this._visible;
	
};
Column.prototype.setVisible=function (visible){
	this._visible=visible;
	
};
Column.prototype.isResizable=function (){
	return this._resizable;
	
};
Column.prototype.setResizable=function (resizable){
	this._resizable=resizable;
	
};
Column.prototype.isHeaderClickable=function (){
	return this._headerClickable;
	
};
Column.prototype.setHeaderClickable=function (headerClickable){
	this._headerClickable=headerClickable;
	
};
Column.prototype.setFullSelected=function (fullSelected){
	this._fullSelected=fullSelected;
	
};
Column.prototype.getTag=_$Element_getTag;
Column.prototype.setTag=_$Element_setTag;
Column.prototype.isShowQuickHelp=_$Element_getShowQuickHelp;
Column.prototype.setShowQuickHelp=_$Element_setShowQuickHelp;
Column.prototype.getToolTip=_$Element_getToolTip;
Column.prototype.setToolTip=_$Element_setToolTip;
Column.prototype.getHelpDelay=_$Element_getHelpDelay;
Column.prototype.setHelpDelay=_$Element_setHelpDelay;


//**************************
//����ж���
//**************************
function DataColumn(name){
	this._type="data";
	this._name=name;
	this._field=name;
	this._width=100;
	this._align=null;
	this._valign=null;
	this._readOnly=false;
	this._rendererType=null;
	this._editorType=null;
	this._dropDown=null;	
	this._sortable=false;
	this._dataOrder=false;
	this._footerValue=null;
	
};
DataColumn.prototype=new Column();
DataColumn.prototype.destroy=function (){
	
	this._dataset=null;
};
DataColumn.prototype.getField=function (){
	return this._field;
	
};
DataColumn.prototype.setField=function (field){
	this._field=field;
	
	var dataset=this._dataset;
	if(dataset){
		var field=dataset.getField(this._field);
		if(field){
			this._align=field._align;
			this._vAlign=field._vAlign;
		}
	}
};
DataColumn.prototype.getWidth=function (){
	return this._width;
	
};
DataColumn.prototype.setWidth=function (width){
	this._width=width;
	
};
DataColumn.prototype.getAlign=function (){
	return this._align;
	
};
DataColumn.prototype.setAlign=function (align){
	this._align=align;
	
};
DataColumn.prototype.getValign=function (){
	return this._valign;
	
};
DataColumn.prototype.setValign=function (valign){
	this._valign=valign;
	
};
DataColumn.prototype.isReadOnly=function (){
	return this._readOnly;
	
};
DataColumn.prototype.setReadOnly=function (readOnly){
	this._readOnly=readOnly;
	
};
DataColumn.prototype.getRendererType=function (){
	return this._rendererType;
	
};
DataColumn.prototype.setRendererType=function (rendererType){
	this._rendererType=rendererType;
	this._readOnly=(rendererType!=null&&rendererType!="text");
	
};
DataColumn.prototype.getEditorType=function (){
	return this._editorType;
	
};
DataColumn.prototype.setEditorType=function (editorType){
	this._editorType=editorType;
	if(this._align==null&&(editorType=="checkbox"||editorType=="radio"||editorType=="checkgroup")){
		this._align="center";		
		
	}
};
DataColumn.prototype.getDropDown=function (){
	return kingfisher.feather.getControl(this._dropDown);
	
};
DataColumn.prototype.setDropDown=function (dropDown){
	this._dropDown=dropDown;
	
};
DataColumn.prototype.getFooterValue=function (){
	return this._footerValue;
	
};
DataColumn.prototype.setFooterValue=function (footerValue){
	this._footerValue=footerValue;
	
};
DataColumn.prototype._$getCellRenderer=function (){
	if(this._cellRenderer==null){
		var column=this;
		var createCellRenderer=null;
		if(this._onCreateCellRenderer!=null){
			createCellRenderer=function (){
				return _$fireKingfisherEvent(column,"onCreateCellRenderer",[column]);
				
			}
		}else {
			switch(this._rendererType){
				case "checkbox":{
					createCellRenderer=function (){
						var checkbox=KingfisherFactory.create("CheckBox",null,null,"record");
						checkbox.setField(column._field);
						checkbox.activate();
						if(column._dataType==9){
							checkbox._onValue=true;
							checkbox._offValue=false;
							
						}else {
							checkbox._onValue=__DEFAULT_ONVALUE;
							checkbox._offValue=__DEFAULT_OFFVALUE;
							
						};
						return checkbox;
						
					};
					break;
					
				};
				case "radio":{
					createCellRenderer=function (){
						var group=KingfisherFactory.create("RadioGroup",null,null,"record");
						group.setField(column._field);
						group.setDropDown(column._dropDown);
						group.activate();
						return group;
						
					};
					break;
					
				}
				case "checkgroup":{
					createCellRenderer=function (){
						var group=KingfisherFactory.create("CheckGroup",null,null,"record");
						group.setField(column._field);
						group.setDropDown(column._dropDown);
						group.activate();
						return group;						
						
					};
					break;
					
				}
			}
		};
		if(createCellRenderer!=null){
			this._cellRenderer=new ObjectPool(createCellRenderer);
			
		}
	};
	return this._cellRenderer;
	
};
DataColumn.prototype.isSortable=function (){
	return this._sortable;
	
};
DataColumn.prototype.setSortable=function (sortable){
	this._sortable=sortable;
	
};
DataColumn.prototype.isDataOrder=function (){
	return this._dataOrder;
	
};
DataColumn.prototype.setDataOrder=function (dataOrder){
	this._dataOrder=dataOrder;
	
};
DataColumn.prototype.getPattern=function (){
	return this._pattern;
	
};
DataColumn.prototype.setPattern=function (pattern){
	this._pattern=pattern;
	
};



//**************************
//��ݱ���е������
//**************************
function ColumnGroup(name){
	this._type="group";
	this._name=name;
	this._columns=new HashList();
	
};
ColumnGroup.prototype=new Column();
ColumnGroup.prototype.destroy=function (){
	var columnCount=this._columns.size();
	for(var i=0;i<columnCount;i++){
		var column=this._columns.get(i);
		column.destroy();
		
	}
	this._dataset=null;
};
ColumnGroup.prototype.addColumn=function (name){
	var column=new DataColumn(name);
	column._dataset=this._dataset;
	column._group=this;
	this._columns.put(name.toLowerCase(),column);
	return column;
	
};
ColumnGroup.prototype.getColumn=function (name){
	if(typeof(name)=="string"){
		name=name.toLowerCase();
		
	};
	return this._columns.get(name);
	
};
ColumnGroup.prototype.removeColumn=function (name){
	if(typeof(name)=="string"){
		name=name.toLowerCase();
		
	};
	return this._columns.remove(name);
	
};
ColumnGroup.prototype.getColumnCount=function (name){
	
	return this._columns.size();
	
};


//**************************
//�򵥵���ݱ���ͷ����
//**************************
var __Header_STATE_SORT=0;										//����//
var __Header_STATE_CHANGE_COLUMN_WIDTH=1;			//�ı��п��//
var __Header_STATE_DROP=2;										//�϶���//
function _$buildTable$SimpleHeader(table,id){
	var headerGrid=$$("TABLE");
	headerGrid.id=id;
	headerGrid.border=_$getPreferenceSetting("__"+table.className+"_Grid_BorderWidth");
	headerGrid.borderColor=_$getPreferenceSetting("__"+table.className+"_HeaderGrid_BorderColor");
	headerGrid._iconHeight=_$getPreferenceSetting("__"+table.className+"_HeaderGrid_IconHeight");
	var colGroup=$$("COLGROUP");
	if(browserType==__Browser_IE){
		headerGrid.appendChild(colGroup);
		
	};
	var tbody=$$("TBODY");
	headerGrid.appendChild(tbody);
	headerGrid._outlineTable=table;
	headerGrid._colGroup=colGroup;
	headerGrid._tbody=tbody;
	headerGrid._columnSet=new HashList();
	headerGrid._state=__Header_STATE_SORT;
	headerGrid._mouseButton=0;
	headerGrid._mouseX=0;
	EventManager.addSystemEvent(headerGrid,"onmousemove",function (){
		_$Table$SimpleHeader_onMouseMove(headerGrid);
		
	});
	EventManager.addSystemEvent(headerGrid,"onmousedown",function (){
		_$Table$SimpleHeader_onMouseDown(headerGrid);
		
	});
	EventManager.addSystemEvent(headerGrid,"onmouseup",function (){
		_$Table$SimpleHeader_onMouseUp(headerGrid);
		
	});
	EventManager.addSystemEvent(headerGrid,"onclick",function (){
		_$Table$SimpleHeader_onClick(headerGrid);
		
	});
	headerGrid.processDatasetMessage=_$Table$SimpleHeader_processDatasetMessage;
	headerGrid.destroy=_$Table$SimpleHeader_destroy;
	headerGrid.refresh=_$Table$SimpleHeader_refresh;
	headerGrid.getResizingCell=_$Table$SimpleHeader_getResizingCell;
	headerGrid.setColumnWidth=_$Table$SimpleHeader_setColumnWidth;
	headerGrid.getMovingCell=_$Table$SimpleHeader_getMovingCell;
	headerGrid.getColumnDropIndex=_$Table$SimpleHeader_getColumnDropIndex;
	return headerGrid;
	
};
function _$Table$SimpleHeader_getResizingCell(){
	function _$getResizingCell(row,x,y){
		var leftPadding=2;
		var rightPadding=5;
		var childNodes=row.childNodes;
		var element=null;
		var i;
		for(i=0;i<childNodes.length;i++){
			var cell=childNodes[i];
			var right=_$getAbsolutePosition(cell)[0]+cell.offsetWidth;
			if(x>right-leftPadding&&x<right+rightPadding){	//������ڴ˷�Χ�ڣ�ƫ��ȡ��ߵĵ�Ԫ��
				element=cell;
				break;
				
			}
		};
		if(element!=null){
			var column=element._column;
			if(column==null||!column._resizable||column._type!="data"){
				element=null;
				
			}else if(i<childNodes.length-1){
				var absPos=_$getAbsolutePosition(element);
				if(y<absPos[1]||y>absPos[1]+element.offsetHeight){
					element=null;
					
				}
			}
		};
		return element;
		
	};
	var x,y;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		y=event.clientY+document.body.scrollTop;
		
	}else {
		x=event.pageX;
		y=event.pageY;
		
	};
	var cell=_$getResizingCell(this._headerRow,x,y);
	if(cell==null){
		cell=_$getResizingCell(this._detailRow,x,y);
		
	};
	return cell;
	
};
function _$Table$SimpleHeader_getMovingCell(){
	var x;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		
	}else {
		x=event.pageX;		
		
	};
	var childNodes=this._headerRow.childNodes;
	var element=null;
	for(var i=0;i<childNodes.length;i++){
		var cell=childNodes[i];
		var left=_$getAbsolutePosition(cell)[0];
		var width=cell.offsetWidth;
		if(x>left&&x<left+width){
			element=cell;
			break;
			
		}
	};
	if(element!=null){
		var column=element._column;
		if(column!=null){
			return element;
			
		}
	};
	return null;
	
};
function _$Table$SimpleHeader_getColumnDropIndex(){
	var x;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		
	}else {
		x=event.pageX;
		
	};
	var table=this._outlineTable;
	var fixedColumns=0;
	var dropIndex=0;
	var maxLeft=9999;
	var fixedHeader=table._fixedHeaderGrid;
	if(fixedHeader){
		var isShowIndicator=fixedHeader.isShowIndicator();
		var childNodes=fixedHeader._headerRow.childNodes;
		fixedColumns=childNodes.length;
		for(var i=(isShowIndicator)?1:0;i<childNodes.length;i++){
			var cell=childNodes[i];
			var headerCellLeft=Math.abs(x-_$getAbsolutePosition(cell)[0]);
			if(headerCellLeft<maxLeft){
				maxLeft=headerCellLeft;
				dropIndex=i;
				
			}
		}
	};
	var header=table._headerGrid;
	var headerDiv=table._headerGridOuterDiv;
	var headerLeft=_$getAbsolutePosition(headerDiv)[0];
	var isShowIndicator=header.isShowIndicator();
	var childNodes=header._headerRow.childNodes;	
	for(var i=(isShowIndicator)?1:0;i<childNodes.length;i++){
		var cell=childNodes[i];
		var left=_$getAbsolutePosition(cell)[0];
		if(left>headerLeft){
			var headerCellLeft=Math.abs(x-left);
			if(headerCellLeft<maxLeft){
				maxLeft=headerCellLeft;
				dropIndex=fixedColumns+i;
				
			}
		}
	};
	var headerCellLeft=Math.abs(x-(_$getAbsolutePosition(header)[0]+header.offsetWidth));
	if(headerCellLeft<maxLeft){
		dropIndex=fixedColumns+childNodes.length;
		
	};
	return dropIndex;
	
};
function _$Table$SimpleHeader_onMouseDown(headerGrid){
	headerGrid._isDrop=false;
	var resizingCell=headerGrid.getResizingCell();
	if(resizingCell!=null){		//�ı��п��//
		var x;
		if(browserType==__Browser_IE){
			x=event.clientX+document.body.scrollLeft;
			
		}else {
			x=event.pageX;
			
		};
		var table=headerGrid._outlineTable;
		var slider=table._$getColumnSplitSlider();
		slider.style.zIndex=_$autoGenIndex();
		var contentCell=table._outerTable.tBodies[0].rows[0].cells[0];
		var contCellPos=_$getAbsolutePosition(contentCell);
		var resCellPos=_$getAbsolutePosition(resizingCell);
		var margin=parseInt(_$getPreferenceSetting("__"+table.className+"_Grid_BorderWidth"));
		slider.style.left=resCellPos[0];
		slider.style.top=contCellPos[1]+margin;
		if(browserType==__Browser_IE){
			slider.style.width=resizingCell.offsetWidth;
			
		}else {
			slider.style.width=resizingCell.offsetWidth-4;
			
		};
		slider.style.height=contentCell.offsetHeight-margin*2;
		_$setVisible(slider,true);
		slider._resizingCell=resizingCell;
		headerGrid._state=__Header_STATE_CHANGE_COLUMN_WIDTH;
		if(browserType==__Browser_IE){
			slider._newLeft=event.clientX+document.body.scrollLeft;
			slider._newTop=event.clientX+document.body.scrollLeft;
			headerGrid.setCapture(headerGrid);			
			
		}else {
			slider._newLeft=event.pageX;
			slider._newTop=event.pageX;
			__Current_HeaderGrid=headerGrid;
			EventManager.addSystemEvent(window,"onmousemove",_$Table$SimpleHeader_NonIE_onMouseMove,true);
			EventManager.addSystemEvent(window,"onmouseup",_$Table$SimpleHeader_NonIE_onMouseUp,true);
			
		}
	}else {
		if(browserType==__Browser_IE){
			headerGrid._mouseButton=event.button;
			headerGrid._mouseX=event.clientX+document.body.scrollLeft;
			
		}else {
			headerGrid._mouseButton=event.which;
			headerGrid._mouseX=event.pageX;
			
		}
	}
};
function _$Table$SimpleHeader_onMouseMove(headerGrid){
	var x;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		
	}else {
		x=event.pageX;
		
	};
	var table=headerGrid._outlineTable;
	var state=headerGrid._state;
	if(state==__Header_STATE_CHANGE_COLUMN_WIDTH){
		var slider=table._$getColumnSplitSlider();
		var resizingCell=slider._resizingCell;
		var width=resizingCell.offsetWidth;
		var change=slider._newLeft-x;
		if((change+5)<=width){
			slider.style.width=width-change;
			
		}
	}else if(state==__Header_STATE_DROP){
		var cursor=table._$getColumnDraggingCursor();
		var movingCell=cursor._movingCell;
		var column=movingCell._column;
		var absPos=_$getAbsolutePosition(table);
		var halfWidth=(cursor.offsetWidth/2);
		
		if(x<absPos[0]+halfWidth){
			cursor.style.left=absPos[0];
			
		}else if(x>absPos[0]+table.offsetWidth-halfWidth){
			cursor.style.left=absPos[0]+table.offsetWidth-cursor.offsetWidth;			
			
		}else {
			cursor.style.left=x-halfWidth;
			
		};
		_$setVisible(cursor,true);
		
		var cursor=table._$getColumnDraggingAnchorPoint();
		var index=headerGrid.getColumnDropIndex();
		var anchorPointLeft;
		var cell,i,fixedColumns=0;
		var fixedHeader=table._fixedHeaderGrid;
		if(fixedHeader!=null){
			var cells=fixedHeader._headerRow.childNodes;
			fixedColumns=cells.length;
			if(index<cells.length){
				cell=cells[index];
				
			}
		};
		if(cell==null){
			var header=table._headerGrid;
			index=index-fixedColumns;
			cells=header._headerRow.childNodes;
			if(index<cells.length){
				cell=header._headerRow.childNodes[index];
				
			}
		};
		if(cell!=null){
			anchorPointLeft=_$getAbsolutePosition(cell)[0];
			
		}else {
			var header=table._headerGrid;
			anchorPointLeft=_$getAbsolutePosition(header)[0]+header.offsetWidth;
			
		};
		cursor.style.left=anchorPointLeft-(cursor.offsetWidth/2)+1;
		_$setVisible(cursor,true);
		
	}else {
		if(headerGrid._mouseButton==1&&headerGrid._mouseX>0&&Math.abs(headerGrid._mouseX-x)>2){
			headerGrid._mouseButton=0;
			headerGrid._mouseX=0;
			var movingCell=headerGrid.getMovingCell();
			if(movingCell!=null){
				var table=headerGrid._outlineTable;
				var cursor=table._$getColumnDraggingCursor(movingCell);
				cursor.style.zIndex=_$autoGenIndex();
				var absPos=_$getAbsolutePosition(movingCell);
				cursor.style.top=absPos[1];
				headerGrid._state=__Header_STATE_DROP;
				if(browserType==__Browser_IE){
					
					cursor._newLeft=event.clientX+document.body.scrollLeft;
					cursor._newTop=event.clientX+document.body.scrollLeft;
					headerGrid.setCapture(true);
					
				}else {
					cursor._newLeft=event.pageX;
					cursor._newTop=event.pageX;
					__Current_HeaderGrid=headerGrid;
					EventManager.addSystemEvent(window,"onmousemove",_$Table$SimpleHeader_NonIE_onMouseMove,true);
					EventManager.addSystemEvent(window,"onmouseup",_$Table$SimpleHeader_NonIE_onMouseUp,true);
					
				};
				var cursor=table._$getColumnDraggingAnchorPoint();
				var absPos=_$getAbsolutePosition(headerGrid);
				cursor.style.top=absPos[1]+headerGrid.offsetHeight+1;
				
			}
		}else {
			var resizingCell=headerGrid.getResizingCell();
			if(resizingCell!=null){
				if(browserType==__Browser_IE){
					if(browserVersion>="6.0"){
						headerGrid.style.cursor="e-resize";
						
					}
				}else {
					headerGrid.style.cursor="e-resize";
					
				}
			}else {
				if(browserType==__Browser_IE){
					if(browserVersion>="6.0"){
						headerGrid.style.cursor="default";
						
					}
				}else {
					headerGrid.style.cursor="default";
					
				}
			}
		}
	}
};
function _$Table$SimpleHeader_onMouseUp(headerGrid){
	var table=headerGrid._outlineTable;
	var state=headerGrid._state;
	if(table._headerCell!=null){
		_$setElementStyle(table._headerCell,"");
		
	};
	if(state==__Header_STATE_CHANGE_COLUMN_WIDTH){
		//add by chw start
		__USER_CHANGED_DT.add(table.getId());
		//add by chw end
		var slider=table._$getColumnSplitSlider();
		_$setVisible(slider,false);		
		var resizingCell=slider._resizingCell;
		var column=resizingCell._column;
		var width;
		if(browserType==__Browser_IE){
			width=slider.offsetWidth;
			
		}else {
			width=slider.offsetWidth-4;
			
		};
		table.setColumnWidth(column,width);
		headerGrid._isDrop=true;
		
	}else if(state==__Header_STATE_DROP){
		//add by chw start
		__USER_CHANGED_DT.add(table.getId());
		//add by chw end
		var cursor=table._$getColumnDraggingCursor();
		var column=cursor._movingCell._column;
		var index=headerGrid.getColumnDropIndex();
		if(table.isShowIndicator()){
			index--;
			
		};
		var columnCount=table._columns.size();
		var count=0,targ=columnCount;
		for(var i=0;i<columnCount;i++){
			var col=table._columns._objectArray[i];
			if(count==index){
				targ=i;
				break;
				
			};
			if(col._visible){
				count++;
				
			}
		};
		table.setColumnIndex(column,targ);
		cursor._movingCell=null;
		_$setVisible(cursor,false);
		var cursor=table._$getColumnDraggingAnchorPoint();
		_$setVisible(cursor,false);
		headerGrid._isDrop=true;
		
	};
	headerGrid._state=__Header_STATE_SORT;
	headerGrid._mouseButton=0;
	headerGrid._mouseX=0;
	if(browserType==__Browser_IE){
		headerGrid.releaseCapture();
		
	}else {
		EventManager._$removeSystemEvent(window,"onmousemove",_$Table$SimpleHeader_NonIE_onMouseMove,true);
		EventManager._$removeSystemEvent(window,"onmouseup",_$Table$SimpleHeader_NonIE_onMouseUp,true);
		__Current_HeaderGrid=null;
		
	}
};
function _$Table_OrderMenu_onClick(menu,menuitem){
	_$serverOrderData(__Current_HeaderGrid);
};
function _$Table$SimpleHeader_onClick(headerGrid){
	
	function _$selectRecord(table,isSelect,field){
		var processed=false;
		var record=table._$getDatasetFirstRecord();
		if (!table.getDataset().isReadOnly()){
			while(record!=null&&!field._readOnly){
				if(parseBoolean(record.getValue("select"))!=isSelect&&record._canSelect){
					record.setValue("select",isSelect);
					record.setDirty(false);
					processed=true;
					
				};
				record=table._$getDatasetNextRecord(record);
				
			};
		}
		return processed;
		
	};
	
	function _$showOrderMenu(headerGrid){
		var table=headerGrid._outlineTable;
		var orderMenu=table._orderMenu;
		if(orderMenu==null){
			orderMenu=KingfisherFactory.create("Menu",null,"__table_ordermenu"+_$genControlId());
			orderMenu.setItemWidth("80px");
			var menuItem=new MenuItem("dataorder",__DATATABLE_DATA_ORDER);
			menuItem.setIcon(__SKIN_PATH+"/datatable/sort.gif");
			menuItem._$setInnerMethod("_$Table_OrderMenu_onClick");
			orderMenu.getTopItem().addItem(menuItem);
			table._orderMenu=orderMenu;
		}

		var box=orderMenu._$getPopupMenu(orderMenu._topItem);
		if(box!=null){
			var x;
			if(browserType==__Browser_IE){
				x=event.clientX-2;
								
			}else {
				x=event.pageX-3;
							
			};
			var pos=_$getAbsolutePosition(headerGrid);
			box.style.left=x;
			box.style.top=pos[1] + headerGrid.offsetHeight;
			box.show();
			orderMenu._$locatePopupMenu(box,targ,"popup");
			if(browserType==__Browser_IE){
				box._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+orderMenu.id+"\")._$hiden();",3000);
								
			};
		}
	};
	
	if(headerGrid._isDrop)return ;
	var targ,x;
	if(browserType==__Browser_IE){
		targ=event.srcElement;
		x=event.clientX+document.body.scrollLeft;
		
	}else {
		targ=event.target;
		x=event.pageX;
		
	}while(targ!=null&&targ.tagName!="TH"){
		targ=targ.parentNode;
		
	};
	if(targ==null)return ;
	var column=targ._column;
	if(column!=null){
		if(column._type=="data"){
			var table=headerGrid._outlineTable;
			var dataset=table._dataset;
			if(column._field!=null){
				var field=dataset.getField(column._field);
				if(field!=null){
					if(column._name=="select" && column._fullSelected){
						var isSelect=!parseBoolean(column._allSelected);
						dataset.disableControls();
						try{
							var field=dataset.getField(column._field);
							if(!_$selectRecord(table,isSelect,field)){
								column._allSelected=_$selectRecord(table,!isSelect,field);
								
							}
						}catch(e){
							_$processException(e);
							
						}finally{
							dataset.enableControls();
							table.refresh();
							
						}
						
					}
					else if(column._sortable&&!column._dataOrder&&table._sortable){
						if(field._ordered!=null){
							if(event.shiftKey||event.altKey){
								field._ordered=null;
								
							}else if(field._ordered=="ascent"){
								field._ordered="descent";
								
							}else if(field._ordered=="descent"){
								field._ordered="ascent";
								
							}
						}else {
							field._ordered="ascent";
							
						};
						
						if(field._ordered==null){
							dataset.sort(null);
								
						}else {
							dataset.sort(((field._ordered=="ascent")?"+":"-")+field._name);
								
						}
					}
					else if(!column._sortable&&column._dataOrder&&table._sortable){
						//����û�м�¼�����������������
						if(dataset.getVisibleCount()<1)
							return;
						
						if(!event.ctrlKey){
							var ordered;
							var orderCol = table._orderColumns.get(column._name);
							if(orderCol != null && orderCol._ordered!=null){
								if(event.altKey){
									ordered=null;
									
								}else if(orderCol._ordered=="ascent"){
									ordered="descent";
									
								}else if(orderCol._ordered=="descent"){
									ordered="ascent";
									
								}
							}else {
								ordered="ascent";
								
							};
							var orderCol=new Object;
							orderCol._fieldname=field._name;
							orderCol._ordered=ordered;
							table._orderColumns.clear();
							table._orderColumns.put(column._name, orderCol);

							if(table._onHeaderClick==null||_$fireKingfisherEvent(table,"onHeaderClick",[table,targ,column]))
								_$serverOrderData(headerGrid, dataset);
						}
						else{
							if(event.altKey){
								table._orderColumns.remove(column._name);
							}
							else{
								var ordered;
								var orderCol = table._orderColumns.get(column._name);
								if(orderCol==null || orderCol._ordered==null || orderCol._ordered=="descent"){
									ordered="ascent";
									
								}else if(orderCol._ordered=="ascent"){
									ordered="descent";
									
								}
								var orderCol=new Object;
								orderCol._fieldname=field._name;
								orderCol._ordered=ordered;
								table._orderColumns.put(column._name, orderCol);
							}
							var index=table._orderColumns.indexOf(column._name)+1;
							var rightImage="<IMG src=\""+__SKIN_PATH+"/datatable/order_"+ordered+".gif\""+" style=\"height: "+headerGrid._iconHeight+"\">";
							var labelText=column._label;
							if(!labelText)
								labelText=field._label;
							targ.innerHTML=labelText+rightImage+(index>0?index:"");
							
							//��ʾ����˵�
							_$showOrderMenu(headerGrid);
							
							__Current_HeaderGrid=headerGrid;
						}
					}
					else if(column._headerClickable){
						_$fireKingfisherEvent(table,"onHeaderClick",[table,targ,column]);
						
					}
				}
			}
		}
	}else {
		var table=headerGrid._outlineTable;
		table.showPropertiesWindow();
		
	}
};
function _$Table$SimpleHeader_onMouseEnter(headerGrid,headerCell){
	var table=headerGrid._outlineTable;
	var column=headerCell._column;
	if(column==null){
		_$setElementStyle(headerCell,"HotCell");
		table._headerCell=headerCell;
		
	}else {
		if(table._sortable&&(column._sortable||column._headerClickable)){
			_$setElementStyle(headerCell,"HotCell");
			table._headerCell=headerCell;
			
		}
	}
};
function _$Table$SimpleHeader_onMouseLeave(headerGrid,headerCell){
	_$setElementStyle(headerCell,"");	
	headerGrid._outlineTable._headerCell=null;
	
};
function _$Table$SimpleHeader_setColumnWidth(column,width){
	this._state=__Header_STATE_SORT;
	var cell=this._columnSet.get(column._name);
	if(cell!=null){
		if(browserType==__Browser_IE){
			var cols=this._colGroup.childNodes;
			for(var i=0;i<cols.length;i++){
				var col=cols[i];
				if(col._name==column._name){
					col.width=width;
					break;
					
				}
			}
		}else {
			var label=cell.firstChild;
			var souWidth=label.offsetWidth;
			var group=column._group;
			var groupColumn=null,grpColumnCell=null,grpColumnWidth=0;
			if(group!=null){
				groupColumn=this._columnSet.get(group._name);
				grpColumnCell=groupColumn.firstChild;
				grpColumnWidth=grpColumnCell.offsetWidth;
				grpColumnCell.style.width=1;
				
			};
			label.style.width=width;
			if(groupColumn!=null){
				grpColumnCell.style.width=grpColumnWidth+(label.offsetWidth-souWidth);
				
			}
		}
	}
};
function _$Table$SimpleHeader_refresh(dataset){
	function _$paintHeaderIndicator(currentHeaderGrid){
		var col=$$("COL");
		colGroup.appendChild(col);
		var cell=$$("TH");
		var label=$$("DIV");
		cell.appendChild(label);
		headerRow.appendChild(cell);
		cell.rowSpan=2;
		label.style.overflow="hidden";
		label.style.whiteSpace="nowrap";
		if(browserType==__Browser_IE){
			col.width=__Default_Indicator_Width;
			label.style.width="100%";
			
		}else {
			label.style.width=__Default_Indicator_Width+1;
			
		};
		
		var table=currentHeaderGrid._outlineTable;
		if(table._multiSelect){
				label.innerHTML="<IMG src=\""+__SKIN_PATH+"/datatable/multiSelect.gif\">";
		}
		
		EventManager.addSystemEvent(cell,"onmouseenter",function (){
			_$Table$SimpleHeader_onMouseEnter(currentHeaderGrid,cell);
			
		});
		EventManager.addSystemEvent(cell,"onmouseleave",function (){
			_$Table$SimpleHeader_onMouseLeave(currentHeaderGrid,cell);
			
		});
		return cell;
		
	};
	function _$paintHeaderGroupColumn(currentHeaderGrid,column){
		var cell=$$("TH");
		var label=$$("DIV");
		label.id=currentHeaderGrid._outlineTable.id+"_header_"+column._name;
		cell._column=column;
		var columns=column._columns;
		var columnCount=columns.size();
		var groupSpan=0;
		for(var i=0;i<columnCount;i++){
			var subColumn=columns.get(i);
			if(!subColumn._visible)continue;
			_$paintHeaderDataColumn(currentHeaderGrid,currentHeaderGrid._detailRow,subColumn);
			groupSpan++;
			
		};
		if(groupSpan>0){
			cell.colSpan=groupSpan;
			
		};
		if(browserType==__Browser_IE){
			label.style.width="100%";
			label.style.overflow="hidden";
			label.unselectable=true;
			
		}else {
			if(currentHeaderGrid._outlineTable.$gQ){
				label.style.width="100%";
				label.style.overflow="hidden";
				
			}else {
				cell.align="center";
				
			};
			label.style.MozUserSelect="none";
			
		};
		label.style.whiteSpace="nowrap";
		label.style.textOverflow="ellipsis";
		var labelText=column._label;
		if(!labelText)labelText=column._name;
		if(column._toolTip!=null){
			cell.title=column._toolTip;
			if(column._showQuickHelp){
		    QuickHelp.add(new HelpItem(cell, column._toolTip, column._helpDelay));
			}
			
		};
		if(column._onHeaderRefresh==null||_$fireKingfisherEvent(column,"onHeaderRefresh",[column,label,labelText])){
			if(column._toolTip!=null){
				label.innerHTML="<IMG src=\""+__SKIN_PATH+"/datatable/tool_tip.gif\""+" style=\"height: "+currentHeaderGrid._iconHeight+"\">"+labelText;
				
			}else {
				label.innerText=labelText;
				
			}
		};
		EventManager.addSystemEvent(cell,"onmouseenter",function (){
			_$Table$SimpleHeader_onMouseEnter(currentHeaderGrid,cell);
			
		});
		EventManager.addSystemEvent(cell,"onmouseleave",function (){
			_$Table$SimpleHeader_onMouseLeave(currentHeaderGrid,cell);
			
		});
		cell.appendChild(label);
		currentHeaderGrid._headerRow.appendChild(cell);
		currentHeaderGrid._columnSet.put(column._name,cell);
		return cell;
		
	};
	function _$paintHeaderDataColumn(currentHeaderGrid,row,column){
		var col=$$("COL");
		col._name=column._name;
		currentHeaderGrid._colGroup.appendChild(col);
		var cell=$$("TH");
		var label=$$("DIV");
		label.id=currentHeaderGrid._outlineTable.id+"_header_"+column._name;
		cell._column=column;
		if(browserType==__Browser_IE){
			col.width=column._width;
			label.style.width="100%";
			label.unselectable=true;
			
		}else {
			label.style.width=column._width;
			label.style.MozUserSelect="none";
			
		};
		label.style.overflow="hidden";
		label.style.whiteSpace="nowrap";
		label.style.textOverflow="ellipsis";
		var labelText=column._label;
		var leftImage="",rightImage="";
		if(column._field!=null){
			var table=currentHeaderGrid._outlineTable;
			var field=table._dataset.getField(column._field);
			if(field!=null){
				if(!labelText)labelText=field._label;				
				if(column._name!="select"){
					for(var i=0;i<field._validatorStack.length;i++){
						if(field._validatorStack[i]._kingfisherClass=="RequiredValidator"){
							leftImage="<label class='HotLabel' style='font-family:Batang;padding-right:2'>*</label>";
							break;
							
						}
					};
					if(column._sortable&&!column._dataOrder){
						if(field._ordered!=null){
							rightImage="<IMG src=\""+__SKIN_PATH+"/datatable/order_"+field._ordered+".gif\""+" style=\"height: "+currentHeaderGrid._iconHeight+"\">";
							
						}
					}
					else if(!column._sortable&&column._dataOrder){
						var orderCol = table._orderColumns.get(column._name);
						if(orderCol != null && orderCol._ordered!=null){
							rightImage="<IMG src=\""+__SKIN_PATH+"/datatable/order_"+orderCol._ordered+".gif\""+" style=\"height: "+currentHeaderGrid._iconHeight+"\">";
							
						}
					}
				}
			}
		};
		var toolTip=((column._toolTip!=null)?column._toolTip:((field!=null)?field._toolTip:null));
		if(toolTip!=null){
			cell.title=toolTip;
			leftImage+="<IMG src=\""+__SKIN_PATH+"/datatable/tool_tip.gif\""+" style=\"height: "+currentHeaderGrid._iconHeight+"\">";

			if(column._showQuickHelp){
		    QuickHelp.add(new HelpItem(cell, toolTip, column._helpDelay));
			}
			
		}else {
			cell.title="";
			
		};
		if(!labelText)labelText=column._name;
		if(column._onHeaderRefresh==null||_$fireKingfisherEvent(column,"onHeaderRefresh",[column,label,labelText])){
			if(column._name=="select"&&labelText=="select"){
				if(column._fullSelected)
					label.innerHTML=leftImage+"<IMG src=\""+__SKIN_PATH+"/datatable/select.gif\">";
				else
					label.innerHTML=leftImage;
				
			}else if(leftImage.length>0||rightImage.length>0){
				label.innerHTML=leftImage+labelText+rightImage;
				
			}else {
				label.innerText=labelText;
				
			}
		};
		//alert('label: '+labelText);
		EventManager.addSystemEvent(cell,"onmouseenter",function (){
			_$Table$SimpleHeader_onMouseEnter(currentHeaderGrid,cell);
			
		});
		EventManager.addSystemEvent(cell,"onmouseleave",function (){
			_$Table$SimpleHeader_onMouseLeave(currentHeaderGrid,cell);
			
		});
		cell.appendChild(label);
		row.appendChild(cell);
		currentHeaderGrid._columnSet.put(column._name,cell);
		return cell;
		
	};
	var table=this._outlineTable;	
	var showIndicator=this.isShowIndicator();
	var first=this.getFirstColumnIndex();
	var last=this.getLastColumnIndex();
	var colGroup=this._colGroup;
	var tbody=this._tbody;
	var headerRow=$$("TR");
	var detailRow=$$("TR");				//����еĵڶ���//
	for(var i=tbody.childNodes.length-1;i>=0;i--){
		tbody.deleteRow(i);
		
	};
	for(var i=colGroup.childNodes.length-1;i>=0;i--){
		colGroup.removeChild(colGroup.childNodes[i]);
		
	};
	this._headerRow=headerRow;
	this._detailRow=detailRow;
	headerRow.height=table._headerHeight;
	this._columnSet.clear();
	if(showIndicator){
		_$paintHeaderIndicator(this);
		
	};
	var hasGroupColumn=false;
	for(var i=first;i<=last;i++){
		var column=table.getColumn(i);
		if(!column._visible)continue;
		var cell;
		if(column._type=="data"){
			cell=_$paintHeaderDataColumn(this,headerRow,column);
			cell.rowSpan=2;
			
		}else {
			detailRow.height=table._headerHeight;
			_$paintHeaderGroupColumn(this,column);
			hasGroupColumn=true;
			
		}
	};
	tbody.appendChild(headerRow);
	if(browserType==__Browser_IE||hasGroupColumn){
		tbody.appendChild(detailRow);

	}
};
function _$Table$SimpleHeader_processDatasetMessage(message,dataset,args){
	if(message==__Dataset_MSG_REFRESH){
		this.refresh(dataset);
		
	}
};
function _$Table$SimpleHeader_destroy(){
	this._outlineTable=null;
	this._colGroup=null;
	this._tbody=null;
	this._headerRow=null;
	this._detailRow=null;	
	this._columnSet.clear();
	
};
function _$Table$SimpleHeader_NonIE_onMouseUp(){
	_$Table$SimpleHeader_onMouseUp(__Current_HeaderGrid);
	
};
function _$Table$SimpleHeader_NonIE_onMouseMove(){
	_$Table$SimpleHeader_onMouseMove(__Current_HeaderGrid);
	
};



//**************************
//��ݱ��̶��ı�ͷ����
//**************************
function _$buildTable$FixedHeader(table,id){
	var headerGrid=_$buildTable$SimpleHeader(table,id);
	headerGrid.isShowIndicator=_$Table$FixedHeader_getShowIndicator;
	headerGrid.getFirstColumnIndex=_$Table$FixedHeader_getFirstColumnIndex;
	headerGrid.getLastColumnIndex=_$Table$FixedHeader_getLastColumnIndex;
	return headerGrid;
	
};
function _$Table$FixedHeader_getShowIndicator(){
	return this._outlineTable._showIndicator;
	
};
function _$Table$FixedHeader_getFirstColumnIndex(){
	return 0;
	
};
function _$Table$FixedHeader_getLastColumnIndex(){
	return this._outlineTable._fixedColumnCount-1;
	
};



//**************************
//��ݱ������ҷ����ı�ͷ����
//**************************
function _$buildTable$Header(table,id){
	var headerGrid=_$buildTable$SimpleHeader(table,id);
	headerGrid.isShowIndicator=_$Table$Header_getShowIndicator;
	headerGrid.getFirstColumnIndex=_$Table$Header_getFirstColumnIndex;
	headerGrid.getLastColumnIndex=_$Table$Header_getLastColumnIndex;
	return headerGrid;
	
};
function _$Table$Header_getShowIndicator(){
	return false;
	
};
function _$Table$Header_getFirstColumnIndex(){
	return this._outlineTable._fixedColumnCount;
	
};
function _$Table$Header_getLastColumnIndex(){
	return this._outlineTable._columns.size()-1;
	
};



//**************************
//�򵥵���ݱ��ͳ��������
//**************************
function _$buildTable$SimpleFooter(table,id){
	var footerGrid=$$("TABLE");
	footerGrid.id=id;
	footerGrid.border=_$getPreferenceSetting("__"+table.className+"_Grid_BorderWidth");
	footerGrid.borderColor=_$getPreferenceSetting("__"+table.className+"_FooterGrid_BorderColor");	
	footerGrid.style.height="100%";
	var tbody=$$("TBODY");
	var row=$$("TR");
	tbody.appendChild(row);
	footerGrid.appendChild(tbody);
	footerGrid._outlineTable=table;
	footerGrid._barRow=row;
	footerGrid.processDatasetMessage=_$Table$SimpleFooter_processDatasetMessage;
	footerGrid.destroy=_$Table$SimpleFooter_destroy;
	footerGrid.refresh=_$Table$SimpleFooter_refresh;
	footerGrid.setColumnWidth=_$Table$SimpleFooter_setColumnWidth;
	return footerGrid;
	
};
function _$Table$SimpleFooter_processDatasetMessage(message,dataset,args){
	if(message==__Dataset_MSG_REFRESH||message==__Dataset_MSG_DATA_CHANGED||message==__Dataset_MSG_RECORD_DELETED){
		this.refresh(dataset);
		
	}
};
function _$Table$SimpleFooter_destroy(){
	this._outlineTable=null;
	this._barRow=null;
	
};
function _$Table$SimpleFooter_refresh(){
	var table=this._outlineTable;
	var showIndicator=this.isShowIndicator();
	var first=this.getFirstColumnIndex();
	var last=this.getLastColumnIndex();
	var row=this._barRow;
	var footerCols=row.childNodes;
	var index=0;
	if(showIndicator){
		var cell,label;
		if(index<footerCols.length){
			cell=footerCols[index];
			label=cell.firstChild;
			
		}else {
			cell=$$("TD");
			var label=$$("DIV");
			label.style.overflow="hidden";
			label.style.whiteSpace="nowrap";
			label.style.textOverflow="ellipsis";
			cell.appendChild(label);
			row.appendChild(cell);
			
		};
		if(browserType==__Browser_IE){
			label.style.width="100%";
			cell.style.width=__Default_Indicator_Width;
			
		}
		else {
			label.style.width=__Default_Indicator_Width+1;
			
		};
		index++;
		
	};
	var columns=table._columns._objectArray;
	for(var i=first;i<=last;i++){
		var column=columns[i];
		if(!column._visible)continue;
		if(column._type=="data"){
			_$refreshFooterColumn(this,row,column,index,footerCols);
			index++;
			
		}else if(column._type=="group"){
			var subColumns=column._columns._objectArray;
			var groupSpan=0;
			for(var j=0;j<subColumns.length;j++){
				var subColumn=subColumns[j];
				if(!subColumn._visible)continue;
				_$refreshFooterColumn(this,row,subColumn,index,footerCols);
				groupSpan++;
				index++;
				
			}
		}
	};
	for(var i=footerCols.length-1;i>=index;i--){
		row.removeChild(footerCols[i]);
		
	};
	function _$refreshFooterColumn(footerGrid,row,column,index,footerCols){
		var cell,label;
		if(index<footerCols.length){
			cell=footerCols[index];
			label=cell.firstChild;
			
		}else {
			cell=$$("TD");
			var label=$$("DIV");
			label.style.overflow="hidden";
			label.style.whiteSpace="nowrap";
			label.style.textOverflow="ellipsis";
			label.id=footerGrid._outlineTable.id+"_footer_"+column._name;
			cell.appendChild(label);
			row.appendChild(cell);
			
		};
		cell._column=column;
		if(browserType==__Browser_IE){
			label.style.width="100%";
			cell.style.width=column._width;
			
		}else {
			label.style.width=column._width;
			
		}
		var value=parseString(column._footerValue);
		if(value==""&&!column.$2z){
			var dataset=footerGrid._outlineTable._dataset;
			var field=dataset.getField(column._field);
			if(field!=null&&field._supportsSum){
				if(field._format){
					value=formatFloat(dataset.getSum(column._field),field._format);
					
				}else {
					value=dataset.getSum(column._field);
					
				}
			}
		};
		if(column._onFooterRefresh==null||_$fireKingfisherEvent(column,"onFooterRefresh",[column,label,value])){
			if(column._name=="select"&&value==""){
				cell.align="center";
				if(column._fullSelected)
					label.innerHTML="<IMG src=\""+__SKIN_PATH+"/datatable/select.gif\">";
				
			}else {
				cell.align=(column==null||column._align==null)?"right":column._align;
				label.innerText=value;
				
			}
		};
		return cell;
		
	}
};
function _$Table$SimpleFooter_setColumnWidth(column,width){
	var row=this._barRow;
	var footerCols=row.childNodes;
	for(var i=0;i<footerCols.length;i++){
		var cell=footerCols[i];
		if(cell._column==column){
			if(browserType==__Browser_IE){
				cell.style.width=width;
				
			}else {
				cell.firstChild.style.width=width;
				
			};
			break;
			
		}
	}
};



//**************************
//��ݱ��̶���ͳ��������
//**************************
function _$buildTable$FixedFooter(table,id){
	var footerGrid=_$buildTable$SimpleFooter(table,id);
	footerGrid.isShowIndicator=_$Table$FixedFooter_getShowIndicator;
	footerGrid.getFirstColumnIndex=_$Table$FixedFooter_getFirstColumnIndex;
	footerGrid.getLastColumnIndex=_$Table$FixedFooter_getLastColumnIndex;	
	return footerGrid;
	
};
function _$Table$FixedFooter_getShowIndicator(){
	return this._outlineTable._showIndicator;
	
};
function _$Table$FixedFooter_getFirstColumnIndex(){
	return 0;
	
};
function _$Table$FixedFooter_getLastColumnIndex(){
	return this._outlineTable._fixedColumnCount-1;
	
};



//**************************
//��ݱ������ҷ�����ͳ��������
//**************************
function _$buildTable$Footer(table,id){
	var footerGrid=_$buildTable$SimpleFooter(table,id);
	footerGrid.isShowIndicator=_$Table$Footer_isShowIndicator;
	footerGrid.getFirstColumnIndex=_$Table$Footer_getFirstColumnIndex;
	footerGrid.getLastColumnIndex=_$Table$Footer_getLastColumnIndex;
	return footerGrid;
	
};
function _$Table$Footer_isShowIndicator(){
	return false;
	
};
function _$Table$Footer_getFirstColumnIndex(){
	return this._outlineTable._fixedColumnCount;
	
};
function _$Table$Footer_getLastColumnIndex(){
	return this._outlineTable._columns.size()-1;
	
};




//**************************
//�򵥵���ݱ����ݲ���
//**************************
function _$buildTable$SimpleDataGrid(table,id){
	var dataGrid=$$("TABLE");
	dataGrid.id=id;
	dataGrid.border=_$getPreferenceSetting("__"+table.className+"_Grid_BorderWidth");
	dataGrid.borderColor=_$getPreferenceSetting("__"+table.className+"_DataGrid_BorderColor");
	var colGroup=$$("COLGROUP");
	if(browserType==__Browser_IE){
		dataGrid.appendChild(colGroup);
		
	};
	var tbody=$$("TBODY");
	dataGrid.appendChild(tbody);
	dataGrid._outlineTable=table;
	dataGrid._colGroup=colGroup;
	dataGrid._tbody=tbody;
	dataGrid.getColumns=_$Table$SimpleDataGrid_getColumns;
	dataGrid.buildTemplate=_$Table$SimpleDataGrid_buildTemplate;
	dataGrid._$cloneDataRow=_$Table$SimpleDataGrid_cloneDataRow;
	dataGrid.refresh=_$Table$SimpleDataGrid_refresh;
	dataGrid._$coverRow=_$Table$SimpleDataGrid_coverRow;
	dataGrid._$coverAllRow=_$Table$SimpleDataGrid_coverAllRow;	
	dataGrid._$refreshRowData=_$Table$SimpleDataGrid_refreshRowData;
	dataGrid._$refreshRowRecord=_$Table$SimpleDataGrid_refreshRowRecord;
	dataGrid._$refreshCellValue=_$Table$SimpleDataGrid_refreshCellValue;
	dataGrid._$refreshSpecificCellValue=_$Table$SimpleDataGrid_refreshSpecificCellValue;
	dataGrid._$refreshIndicator=_$Table$SimpleDataGrid_refreshIndicator;
	dataGrid.processDatasetMessage=_$Table$SimpleDataGrid_processDatasetMessage;
	dataGrid.destroy=_$Table$SimpleDataGrid_destroy;
	dataGrid.setColumnWidth=_$Table$SimpleDataGrid_setColumnWidth;
	dataGrid._$changeCurrentRow=_$Table$SimpleDataGrid_changeCurrentRow;
	dataGrid._$isExistColumn=_$Table$SimpleDataGrid_isExistColumn;
	dataGrid._$getCurrentRowSpecificCell=_$Table$SimpleDataGrid_getCurrentRowSpecificCell;
	dataGrid._columns=null;
	dataGrid._columnSet=new HashList();
	dataGrid._recordMapping=new HashList();
	dataGrid._currentRow=null;
	EventManager.addSystemEvent(dataGrid,"onmousedown",function (){
		table._$onMouseDown(dataGrid);
		event.cancelBubble=true;
		
	});
	EventManager.addSystemEvent(dataGrid,"onclick",function (){
		table._$onRecordClick(dataGrid);
		
	});
	EventManager.addSystemEvent(dataGrid,"ondblclick",function (){
		table._$onRecordDblClick(dataGrid);
		
	});
	return dataGrid;
	
};
function _$Table$SimpleDataGrid_getColumns(){
	return this._columns;
	
};
function _$Table$SimpleDataGrid_buildTemplate(showIndicator,count,dataset){
	//alert('DataGrid_buildTemplate: '+count+' dataset: '+dataset.getId());
	var table=this._outlineTable;
	var rowTemplet=$$("TR");
	_$setElementStyle(rowTemplet,"Row");
	rowTemplet._record=null;
	var index=0;
	if(showIndicator){
		var cell=$$("TD");
		var label=$$("DIV");
		label._kingfisherClass="CellRenderer";
		label.style.overflow="hidden";
		label.style.whiteSpace="nowrap";
		if(browserType==__Browser_IE){
			label.style.width="100%";
			
		}else {
			label.style.width=__Default_Indicator_Width;			
			
		};
		_$setElementStyle(cell,"Indicator");
		cell.style.height=table._cellHeight;
		cell._kingfisherClass="DataCell";
		cell.appendChild(label);
		rowTemplet.appendChild(cell);
		index++;
		
	};
	for(var i=index;i<count;i++){
		var column=this._columns[i-index];
		var cell=$$("TD");
		var label=$$("DIV");
		label._kingfisherClass="CellRenderer";
		label.style.overflow="hidden";
		label.style.whiteSpace="nowrap";
		label.style.textOverflow="ellipsis";
		label.style.height=table._rowHeight;
		label.style.width="100%";
		label.style.paddingLeft="2px";
		label.style.paddingRight="2px";
		cell.style.height=table._cellHeight;
		cell._kingfisherClass="DataCell";
		cell.align=(column==null||column._align==null)?"left":column._align;
		cell.vAlign=(column==null||column._valign==null)?"top":column._valign;
		cell.appendChild(label);
		rowTemplet.appendChild(cell);
		
	};
	return rowTemplet;
	
};
//ͨ����ģ�帴�Ƴ������//
function _$Table$SimpleDataGrid_cloneDataRow(rowTemplet){
	var row=rowTemplet.cloneNode(true);
	if(browserType!=__Browser_IE){
		for(var i=0;i<row.childNodes.length;i++){
			var cell=row.childNodes[i];
			var label=cell.firstChild;
			cell._kingfisherClass="DataCell";
			label._kingfisherClass="CellRenderer";
			
		}
	};
	return row;
	
};
//�ڸǹ����󿴲�������
function _$Table$SimpleDataGrid_coverRow(row){
	var tbody=this._tbody;
	for(var i=row.childNodes.length-1;i>=0;i--){
		var cell=row.childNodes[i];
		var column=cell._column;
		if(column!=null){
			var objectPool=column._$getCellRenderer();
			if(objectPool!=null){
				objectPool.returnObject(cell.firstChild.firstChild);
				
			}
		}
	}
	tbody.removeChild(row);
	
};
function _$Table$SimpleDataGrid_coverAllRow(){
	var tbody=this._tbody;
	for(var i=tbody.childNodes.length-1;i>=0;i--){
		this._$coverRow(tbody.childNodes[i]);
		
	}
};
function _$Table$SimpleDataGrid_refreshCellValue(row,label,record,column){
	function _$parsePattern(pattern,record,row){
		switch(pattern){
			case "position":{
				if(record && record._dataset){
					var dataset=record._dataset;
					if(record._state==__Record_STATE_NEW||record._state==__Record_STATE_INSERT){
						var prevRecord=record.getPrevRecord();
						if(!prevRecord||!prevRecord._position){
							record._position=1;
						}
						else{
							record._position=prevRecord._position+1;
						}
						return record._position;
					}
					else{
						var pageIndex=record._pageIndex - 1;
						return pageIndex * dataset._pageSize + record._position;
					}
				}
				return 1;
			}
		}
	};
	
	if(record==null||record.$2z){
		if(column._onRefresh!=null){
			if(!_$fireKingfisherEvent(column,"onRefresh",[column,row,label,"",record],false))return ;
			
		};
		label.innerText="";
		label.title="";
		return ;
		
	};
	
	if(column.$2z){
		if(column._onRefresh!=null){
			if(!_$fireKingfisherEvent(column,"onRefresh",[column,row,label,"",record],false))return ;
			
		}
		else if(column._pattern!=null){
			var value=_$parsePattern(column._pattern,record,row);
			label.innerText=value;
			label.title=value;
			label.style.color="blue";
		}
	}
	else if(column._onCreateCellRenderer==null&&(column._rendererType==null||column._rendererType=="text")){
		if(column._editorType=="checkbox"){
			var value=record.getValue(column._field);
			if(column._onRefresh!=null){
				if(!_$fireKingfisherEvent(column,"onRefresh",[column,row,label,value,record],false))return ;
				
			};
			var checked;
			if(column._dataType==9){
				checked=value;
				
			}else {
				checked=(parseString(value)==__DEFAULT_ONVALUE);
				
			};
			var html;
			if(checked){
				html="<FONT face=\"Marlett\" size=\"2\">a</FONT>";
				
			}else {
				html="<FONT face=\"Webdings\" size=\"1\" color=\"silver\">c</FONT>";
				
			};
			label.innerHTML=html;
			
		}else {
			var value;
			var dropDown=column.getDropDown();
			if(dropDown==null){
				value=record.getString(column._field);
				
			}else {
				if(dropDown._mapValue){
					value=dropDown.getLabel(record.getValue(column._field));
					if(!value && dropDown._defaultLabel)
						value=dropDown._defaultLabel;
				}else {
					value=record.getString(column._field);
					
				}
			};
			if(column._onRefresh!=null){
				if(!_$fireKingfisherEvent(column,"onRefresh",[column,row,label,value,record],false))return ;
				
			};
			label.innerText=value;
			label.title=value;
			
		}
	}
	else {
		var value=record.getValue(column._field);
		var terminate=false;		//�Ƿ�Ҫ��ֹ����Ĭ�ϵ��ڲ�����
		if(column._onRefresh!=null){
			terminate=!_$fireKingfisherEvent(column,"onRefresh",[column,row,label,value,record],false);
			
		};
		var objectPool=column._$getCellRenderer();
		if(objectPool!=null){
			var ele=label.firstChild;
			if(ele!=__Current_ActiveEditor||__Current_ActiveEditor==null){
				if(ele!=null){
					objectPool.returnObject(ele);
					for(var i=label.childNodes.length-1;i>=0;i--){
						label.removeChild(label.childNodes[i]);
						
					}
				};
				if(!terminate){
					ele=objectPool.borrowObject();
					label.appendChild(ele);
					if(!ele.style.width)
						ele.style.width="100%";
					if(!ele.style.height)
						ele.style.height="100%";
					if(typeof(ele.setRecord)=="function")ele.setRecord(record);
					if(typeof(ele.setValue)=="function")
						ele.setValue(value);
					else if(typeof(ele.refresh)=="function")
						ele.refresh();
					
				}
			}
			else if(ele.getRecord()!=record){
				if(!terminate){
					if(typeof(ele.setRecord)=="function")ele.setRecord(record);
					if(typeof(ele.setValue)=="function")
						ele.setValue(value);
					else if(typeof(ele.refresh)=="function")
						ele.refresh();
					
				}
			}
		}
	}
};
function _$Table$SimpleDataGrid_refreshSpecificCellValue(row,record,name){
	
	var showIndicator=this.isShowIndicator();
	var columns=this._columns;
	for(var i=0;i<columns.length;i++){
		var column=columns[i];
		if(column._field.toLowerCase()==name.toLowerCase()){
			var index=(showIndicator)?(i+1):i;
			var cell=row.childNodes[index];
			var label=cell.firstChild;
			this._$refreshCellValue(row,label,record,column);
			
		}
	}
};
function _$Table$SimpleDataGrid_refreshRowData(columns,row,record,showIndicator){
//	if(row._rowid==record._rowid)return ;
	
	row._rowid=record._rowid;
	row._record=record;
	
	var table=this._outlineTable;
	var cells=row.childNodes;
	var startIndex=(showIndicator)?1:0;
	var index=0;
	for(var i=startIndex;i<cells.length;i++){
		var column=columns[index];
		if(!column._visible)continue;
		var cell=cells[i];
		var label=cell.firstChild;
		if(cell._column!=null&&cell._column!=column){
			var objectPool=cell._column._$getCellRenderer();
			if(objectPool!=null&&label.firstChild!=null){
				objectPool.returnObject(label.firstChild);
				
			};
			label.parentNode.removeChild(label);
			label=$$("DIV");
			label._kingfisherClass="CellRenderer";
			label.style.overflow="hidden";
			label.style.whiteSpace="nowrap";
			label.style.textOverflow="ellipsis";
			label.style.height=table._rowHeight;
			cell.appendChild(label);
			
		};
		cell._column=column;
		var width=column._width;
		if(browserType==__Browser_OTHER){
			label.style.width=width;
			
		};
		this._$refreshCellValue(row,label,record,column);
		index++;
		
	}
};
function _$Table$SimpleDataGrid_refreshRowRecord(row,record){
	var showIndicator=this.isShowIndicator();	
	this._$refreshRowData(this._columns,row,record,showIndicator);
	
};
//***
//��������
//�������ƺ�ֻ����ʱ���ɼ�Χ�ڵ��У�����ݹ���ʱ��ˢ�¿ɼ�Χ
//@param holistic �Ƿ�����ˢ�»���ֻˢ��һ��,true ����ˢ��
//***
function _$Table$SimpleDataGrid_refresh(dataset,holistic){
	var table=this._outlineTable;
	var showIndicator=this.isShowIndicator();
	var first=this.getFirstColumnIndex();
	var last=this.getLastColumnIndex();
	var tbody=this._tbody;
	var childNodes=tbody.childNodes;
	var rowTemplet=this._rowTemplet;
	var isNewTemplet=false;
	
	if(holistic){
		var subcols=this._colGroup.childNodes;
		var count=0;
		if(showIndicator){
			var col;
			if(count<subcols.length){
				col=subcols[count];
				
			}else {
				col=$$("COL");
				this._colGroup.appendChild(col);
				
			};
			col._index=count;
			col.width=__Default_Indicator_Width;
			count++;
			
		};
		var columns=table._columns;
		this._columns=new Array();
		this._columnSet.clear();
		for(var i=first;i<=last;i++){
			var column=columns._objectArray[i];
			if(!column._visible)continue;
			if(column._type=="data"){
				var col;
				if(count<subcols.length){
					col=subcols[count];
					
				}else {
					col=$$("COL");
					this._colGroup.appendChild(col);
					
				};
				col.width=column._width;
				col._column=column;
				col._index=count;
				this._columnSet.put(column._name,col);
				this._columns.push(column);
				count++;
				
			}else if(column._type=="group"){
				var columnCount=column._columns.size();				
				for(var j=0;j<columnCount;j++){
					var subColumn=column._columns._objectArray[j];
					if(!subColumn._visible)continue;
					var col;
					if(count<subcols.length){
						col=subcols[count];
						
					}else {
						col=$$("COL");
						this._colGroup.appendChild(col);
						
					};
					col.width=subColumn._width;
					col._index=count;
					col._column=subColumn;
					this._columnSet.put(subColumn._name,col);
					this._columns.push(subColumn);
					count++;
					
				}
			}
		};
		for(var i=subcols.length-1;i>=count;i--){
			this._colGroup.removeChild(subcols[i]);
			
		};
		if(rowTemplet!=null){
			if(count!=rowTemplet.childNodes.length){
				this._rowTemplet=null;
				rowTemplet=null;
				
			}
		};
		if(rowTemplet==null){
			rowTemplet=this.buildTemplate(showIndicator,count,dataset);
			this._rowTemplet=rowTemplet;
			isNewTemplet=true;
			
		};
		if(isNewTemplet){
			this._$coverAllRow();
			
		}
	};
	var index=0;
	var useEvenColor=_$getPreferenceSetting("__DataTable_UseEvenColor",false);
	var parityCheck=table._parityCheck;
	var record;
	if(table._scrollMode==__Table_SCROLLMODE_SIMPLE){
		record=table._$getDatasetFirstRecord();
		
	}else {
		record=table.getFirstRecord();
		if(record!=null){
			if(childNodes.length>1){
				var firstTableRecord=childNodes[0]._record;
				if(table._$getDatasetNextRecord(firstTableRecord)==record){
					
					parityCheck=1-parityCheck;
					this._$coverRow(childNodes[0]);
					
				}else if(table._$getDatasetPrevRecord(firstTableRecord)==record){
					parityCheck=1-parityCheck;
					var row=this._$cloneDataRow(rowTemplet);
					tbody.insertBefore(row,childNodes[0]);
					
				}
			}
		}
	};
	this._recordMapping.clear();
	var visibleCols=childNodes.length;		//�ɼ������//
	var spanRowNum=table._$getPageSpanRowNumber();
	while(record!=null){
		var row,subItemRow=false;
		if(!isNewTemplet&&index<visibleCols){
			row=childNodes[index];
			
		}else {
			//δ��ʾ��������//
			row=this._$cloneDataRow(rowTemplet);
			tbody.appendChild(row);
			subItemRow=true;
			
		};
		this._recordMapping.put(record._publicid,row);
		this._$refreshIndicator(row,null);
		if(record==null||record.$2z){
			if(useEvenColor&&(index+parityCheck)%table._parityRow==table._parityRow-1){
				_$setElementStyle(row,"MockEvenRow");		//ż����//
				
			}else {
				_$setElementStyle(row,"MockRow");
				
			}
		}else {
			if(dataset._multiSelectRecords.findElement(record)&&this._outlineTable._highlightSelection&&
				this._currentRow&&this._currentRow._record!=record){
				_$setElementStyle(row,"CurrentRow");
				this._$refreshIndicator(row,record);
			}
			else{
				if(useEvenColor&&(index+parityCheck)%table._parityRow==table._parityRow-1){
					_$setElementStyle(row,"EvenRow");				//ż����//
					
				}else {
					_$setElementStyle(row,"Row");
					
				}
			}
		};
		if(subItemRow||holistic||record!=row._record){
			this._$refreshRowData(this._columns,row,record,showIndicator);
			
		};
		index++;
		if(table._scrollMode!=__Table_SCROLLMODE_SIMPLE){
			if(index>=spanRowNum){
				break;
				
			}
		}
		record=table._$getDatasetNextRecord(record);
		
	};
	table._tableLastRecord=record;
	
	if(this._kingfisherClass=="DataGrid")
		table._parityCheck=parityCheck;
		
	for(var i=visibleCols-1;i>=index;i--){
		this._$coverRow(childNodes[i]);
		
	}
};
function _$Table$SimpleDataGrid_setColumnWidth(column,width){
	var col=this._columnSet.get(column._name);
	if(col!=null){
		if(browserType==__Browser_IE){
			col.width=width;
			
		}else {
			var index=col._index;
			var rows=this._tbody.childNodes;
			for(var i=0;i<rows.length;i++){
				var cell=rows[i].childNodes[index];
				cell.firstChild.style.width=width;
				
			}
		}
	}
};
function _$Table$SimpleDataGrid_changeCurrentRow(dataset){
	var table=this._outlineTable;
	var record=dataset.getCurrent();
	var multiSelectRecords=dataset._multiSelectRecords;
	with(this){
		if(_currentRow!=null){
			if(!table._hasMultiSelect||multiSelectRecords.size()<=1){
				_$refreshIndicator(_currentRow,record);
				_$setElementStyle(_currentRow,_currentRow._oldStyle);
			}
			
		};
		
		if(table._hasMultiSelect && multiSelectRecords.findElement(record)==null)
			multiSelectRecords.insert(record);
		
		_currentRow=null;
		if(table._scrollMode==__Table_SCROLLMODE_SIMPLE){
			var row=null;
			if(record!=null){
				row=_recordMapping.get(record._publicid);
				if(row!=null){
					_$refreshIndicator(row,record);
					if(_outlineTable._highlightSelection&&row.className!="CurrentRow"){
						row._oldStyle=row.className;
						_$setElementStyle(row,"CurrentRow");
						
					}
				}
			};
			_currentRow=row;
			
		}else {
			var row=null;
			if(record!=null){
				row=_recordMapping.get(record._publicid);				
				if(row!=null){
					_$refreshIndicator(row,record);
					if(_outlineTable._highlightSelection&&row.className!="CurrentRow"){
						row._oldStyle=row.className;
						_$setElementStyle(row,"CurrentRow");
						
					};
					_currentRow=row;
					
				}else {
					this.refresh(dataset,false);
					var record=dataset.getCurrent();
					with(this){
						var row=null;
						if(record!=null){
							row=_recordMapping.get(record._publicid);
							if(row!=null){
								_$refreshIndicator(row,record);
								if(_outlineTable._highlightSelection&&row.className!="CurrentRow"){
									row._oldStyle=row.className;
									_$setElementStyle(row,"CurrentRow");
									
								};
								_currentRow=row;
								
							}
						}
					}
				}
			}
		}
	}
};
function _$Table$SimpleDataGrid_refreshIndicator(row,record){
	var table=this._outlineTable;
	var showIndicator=this.isShowIndicator();
	if(showIndicator){
		var cell=row.childNodes[0];
		if(cell!=null){
			var indicatorDiv=cell.firstChild;
			if(record&&row._record==record){
				//qwj 2010.03.15ע��
				//if(record._dirty){
				//	indicatorDiv.style.color="red";
				//	indicatorDiv.innerHTML="<FONT face=Webdings size=1><</FONT>";
				//	
				//}else {
					indicatorDiv.style.color="black";
					if(table._hasMultiSelect)
						indicatorDiv.innerHTML="<FONT face=Marlett size=2>a</FONT>";
					else
						indicatorDiv.innerHTML="<FONT face=Webdings size=1>4</FONT>";
					
				//}
			}else {
				var dataset=table._dataset;			
				if(table._hasMultiSelect&&dataset._multiSelectRecords.size()>0&&record){
					indicatorDiv.style.color="black";
					indicatorDiv.innerHTML="<FONT face=Marlett size=2>a</FONT>";
				}
				else
					indicatorDiv.innerText="";
				
			}
			table._$setFixedPartWidth();

		}
	}
	
};
function _$Table$SimpleDataGrid_processDatasetMessage(message,dataset,args){
	if(message==__Dataset_MSG_REFRESH){
		this.refresh(dataset,true);
		this._$changeCurrentRow(dataset);
		
	}else if(message==__Dataset_MSG_DATA_CHANGED){
		var record=args[0];
		var name=args[1];
		var row=this._recordMapping.get(record._publicid);
		if(row!=null){
			this._$refreshSpecificCellValue(row,record,name);
			
		}
	}else if(message==__Dataset_MSG_CURRENT_CHANGED){
		this._$changeCurrentRow(dataset);
		
	}else if(message==__Dataset_MSG_RECORD_DELETED){

		var record=args[0];
		var table=this._outlineTable;
		var row=this._recordMapping.get(record._publicid);
		if(row!=null){
			this._$coverRow(row);
			if(table._scrollMode!=__Table_SCROLLMODE_SIMPLE){
				
				var rowTemplet=this._rowTemplet;
				var firstTableRecord=table.getFirstRecord();
				var lastTableRecord=table.getLastRecord();
				if(lastTableRecord!=null&&table._$getDatasetNextRecord(lastTableRecord)!=null){
					
					var nextDatasetRecord=table._$getDatasetNextRecord(lastTableRecord);
					var row=this._$cloneDataRow(rowTemplet);
					this._recordMapping.put(nextDatasetRecord._publicid,row);
					this._tbody.appendChild(row);
					this._$refreshRowRecord(row,nextDatasetRecord);
					
				}else if(firstTableRecord!=null&&table._$getDatasetPrevRecord(firstTableRecord)!=null){
					
					var prevDatasetRecord=table._$getDatasetPrevRecord(firstTableRecord);
					var row=this._$cloneDataRow(rowTemplet);
					this._recordMapping.put(prevDatasetRecord._publicid,row);
					this._tbody.insertBefore(row,this._tbody.childNodes[0]);
					this._$refreshRowRecord(row,prevDatasetRecord);
					
				}
			}
		}
	}else if(message==__Dataset_MSG_RECORD_INSERTED){
		var table=this._outlineTable;
		var newInsRecord=args[0];
		var mode=args[1];
		var referend=args[2];
		var tbody=this._tbody;		
		var insertNewRow=false;
		var oldRow=null;

		switch(mode){
			case "begin":{
				if(table._$getDatasetFirstRecord()==dataset.getFirstRecord()){
					oldRow=tbody.rows[0];
					
				};
				break;
				
			};
			case "before":{
				oldRow=this._recordMapping.get(referend._publicid);
				break;
				
			};
			case "after":{
				oldRow=this._recordMapping.get(referend._publicid);
				if(oldRow!=null){
					oldRow=oldRow.nextSibling;
					insertNewRow=(oldRow==null);
					
				};
				break;
				
			};
			case "end":{
				if(table._$getDatasetLastRecord()==dataset.getLastRecord()){
					insertNewRow=true;
					
				};
				break;
				
			}
		};
		var rowTemplet=this._rowTemplet;
		var row=this._$cloneDataRow(rowTemplet);
		if(oldRow!=null){
			tbody.insertBefore(row,oldRow);
			
		}else if(insertNewRow){
			tbody.appendChild(row);
			
		}else {
			return ;
			
		};
		if(newInsRecord!=null){
			this._recordMapping.put(newInsRecord._publicid,row);
			this._$refreshRowRecord(row,newInsRecord);
			
		};
		if(this._scrollMode!=__Table_SCROLLMODE_SIMPLE){
			if(oldRow!=null){
				
				tbody.deleteRow(tbody.rows.length-1);
				
			}else {
				tbody.deleteRow(0);
				
			}
		}
	}else if(message==__Dataset_MSG_RECORD_STATE_CHANGED){
		var record=args[0];
		var row=this._recordMapping.get(record._publicid);
		if(row!=null){
			this._$refreshIndicator(row,record);
			
		}
	}else if(message==__Dataset_MSG_REFRESH_RECORD){
		var record=args[0];
		var row=this._recordMapping.get(record._publicid);
		if(row!=null){
			this._$refreshIndicator(row,record);
			this._$refreshRowRecord(row,record);
			
		}
	}
};
function _$Table$SimpleDataGrid_destroy(){
	this._outlineTable=null;
	this._colGroup=null;
	this._tbody=null;
	this._rowTemplet=null;
	this._currentRow=null;
	this._columns=null;
	this._columnSet.clear();
	this._recordMapping.clear();
	
};
function _$Table$SimpleDataGrid_isExistColumn(column){
	return (this._columns.indexOf(column)>=0);
	
};
function _$Table$SimpleDataGrid_getCurrentRowSpecificCell(column){
	if(this._currentRow!=null){
		var col=this._columnSet.get(column._name);
		if(col!=null){
			var index=col._index;
			return this._currentRow.childNodes[index];
			
		}
	};
	return null;
	
};



//**************************
//��ݱ��̶�����ݲ���
//**************************
function _$buildTable$FixedDataGrid(table,id){
	var dataGrid=_$buildTable$SimpleDataGrid(table,id);
	dataGrid._kingfisherClass="FixedDataGrid";
	dataGrid.isShowIndicator=_$Table$FixedDataGrid_getShowIndicator;	
	dataGrid.getFirstColumnIndex=_$Table$FixedDataGrid_getFirstColumnIndex;
	dataGrid.getLastColumnIndex=_$Table$FixedDataGrid_getLastColumnIndex;
	return dataGrid;
	
};
function _$Table$FixedDataGrid_getShowIndicator(){
	return this._outlineTable._showIndicator;
	
};
function _$Table$FixedDataGrid_getFirstColumnIndex(){
	return 0;
	
};
function _$Table$FixedDataGrid_getLastColumnIndex(){
	return this._outlineTable._fixedColumnCount-1;
	
};



//**************************
//��ݱ������ҷ�������ݲ���
//**************************
function _$buildTable$DataGrid(table,id){
	var dataGrid=_$buildTable$SimpleDataGrid(table,id);
	dataGrid._kingfisherClass="DataGrid";
	dataGrid.isShowIndicator=_$Table$DataGrid_getShowIndicator;
	dataGrid.getFirstColumnIndex=_$Table$DataGrid_getFirstColumnIndex;
	dataGrid.getLastColumnIndex=_$Table$DataGrid_getLastColumnIndex;
	return dataGrid;
	
};
function _$Table$DataGrid_getShowIndicator(){
	return false;
	
};
function _$Table$DataGrid_getFirstColumnIndex(){
	return this._outlineTable._fixedColumnCount;
	
};
function _$Table$DataGrid_getLastColumnIndex(){
	return this._outlineTable._columns.size()-1;
	
};



//**************************
//�򵥵���ݱ��
//**************************
function _$buildTable(id,viewModel){
	var table=null;
	if(id){
		table=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(table==null){
		table=$$("DIV");
		table.id=id;
		
	};
	table.getId=_$Component_getId;
	table.getViewModel=_$Component_getViewModel;
	table.isActive=_$Component_isActive;
	table.setVisible=_$Component_setVisible;
	table.getTag=_$Element_getTag;
	table.setTag=_$Element_setTag;	
	table.getContext=_$Element_getContext;
	table.setContext=_$Element_setContext;
	table.getDataset=_$DataControl_getDataset;
	table.setDataset=_$DataControl_setDataset;
	table.getHeaderHeight=_$Table_getHeaderHeight;
	table.setHeaderHeight=_$Table_setHeaderHeight;
	table.getFooterHeight=_$Table_getFooterHeight;
	table.setFooterHeight=_$Table_setFooterHeight;
	table.getRowHeight=_$Table_getRowHeight;
	table.setRowHeight=_$Table_setRowHeight;
	table.getScrollMode=_$Table_getScrollMode;
	table.setScrollMode=_$Table_setScrollMode;
	table.getFixedColumn=_$Table_getFixedColumn;
	table.setFixedColumn=_$Table_setFixedColumn;
	table.isShowHeader=_$Table_getShowHeader;
	table.setShowHeader=_$Table_setShowHeader;
	table.isShowFooter=_$Table_getShowFooter;
	table.setShowFooter=_$Table_setShowFooter;
	table.isShowIndicator=_$Table_getShowIndicator;
	table.setShowIndicator=_$Table_setShowIndicator;
	table.isShowHScrollBar=_$Table_getShowHScrollBar;
	table.setShowHScrollBar=_$Table_setShowHScrollBar;
	table.isShowVScrollBar=_$Table_getShowVScrollBar;
	table.setShowVScrollBar=_$Table_setShowVScrollBar;
	table.isHighlightSelection=_$Table_getHighlightSelection;
	table.setHighlightSelection=_$Table_setHighlightSelection;
	table.isReadOnly=_$Table_getReadOnly;
	table.setReadOnly=_$Table_setReadOnly;
	table.isEditable=_$Table_getEditable;
	table.setEditable=_$Table_setEditable;
	table.isConfirmCancel=_$Table_getConfirmCancel;
	table.setConfirmCancel=_$Table_setConfirmCancel;
	table.isConfirmDelete=_$Table_getConfirmDelete;
	table.setConfirmDelete=_$Table_setConfirmDelete;
	table.isSupportsPropertiesWindow=_$Table_getSupportsPropertiesWindow;
	table.setSupportsPropertiesWindow=_$Table_setSupportsPropertiesWindow;
	table.getMaxRow=_$Table_getMaxRow;
	table.setMaxRow=_$Table_setMaxRow;
	table.getParityRow=_$Table_getParityRow;
	table.setParityRow=_$Table_setParityRow;
	table.isMultiSelect=_$Table_getMultiSelect;
	table.setMultiSelect=_$Table_setMultiSelect;
	table.getFirstRecord=_$Table_getFirstRecord;
	table.getLastRecord=_$Table_getLastRecord;
	table.destroy=_$Table_destroy;
	table.activate=_$DataControl_activate;
	table._$oldEstablishBinding=_$DataControl_establishBinding;
	table.establishBinding=_$Table_establishBinding;
	table._$abolishBinding=_$DataControl_abolishBinding;
	table.processDatasetMessage=_$Table_processDatasetMessage;
	table.disableBinding=_$DataControl_disableBinding;
	table.enableBinding=_$DataControl_enableBinding;
	table.addColumn=_$Table_addColumn;
	table.addColumnGroup=_$Table_addColumnGroup;
	table.getColumn=_$Table_getColumn;
	table.removeColumn=_$Table_removeColumn;
	table.clearColumn=_$Table_clearColumn;
	table.getColumnCount=_$Table_getColumnCount;
	table.rebuild=_$Table_rebuild;	
	table.refresh=_$Table_refresh;
	table.refreshHeader=_$Table_refreshHeader;
	table.refreshFooter=_$Table_refreshFooter;
	table.onResize=_$Table_onResize;
	table.onKeyDown=_$Table_onKeyDown;
	table.setColumnWidth=_$Table_setColumnWidth;
	table.setColumnIndex=_$Table_setColumnIndex;
	table.setCurrentColumn=_$Table_setCurrentColumn;
	table._$do_showCellEditor=_$Table_do_showCellEditor;
	table._$hideCellEditor=_$Table_hideCellEditor;
	table._$afterScroll=_$Table_afterScroll;
	table.showPropertiesWindow=_$Table_showPropertiesWindow;
	table.getVisibleCount=_$Table_getVisibleCount;
	table._$onFocus=_$Table_onFocus;
	table.focus=_$Table_onFocus;
	table._$getDatasetFirstRecord=_$Table_getDatasetFirstRecord;
	table._$getDatasetLastRecord=_$Table_getDatasetLastRecord;
	table._$getDatasetPrevRecord=_$Table_getDatasetPrevRecord;
	table._$getDatasetNextRecord=_$Table_getDatasetNextRecord;
	table._$moveFirst=_$Table_moveFirst;
	table._$movePrev=_$Table_movePrev;
	table._$moveNext=_$Table_moveNext;
	table._$moveLast=_$Table_moveLast;
	table._$move=_$Table_move;
	table._$insertRecord=_$Table_insertRecord;
	table._$deleteRecord=_$Table_deleteRecord;
	table._$cancelRecord=_$Table_cancelRecord;
	table._$postRecord=_$Table_postRecord;
	table._$getPageSpanRowNumber=_$Table_getPageSpanRowNumber;
	table._$setValidTableFirstRecord=_$Table_setValidTableFirstRecord;
	table._$addColumnByField=_$Table_addColumnByField;
	table._$refreshScrollBar=_$Table_refreshScrollBar;
	table._$setFixedPartWidth=_$Table_setFixedPartWidth;
	table._$setFixedPartHeight=_$Table_setFixedPartHeight;
	table._$setFloatingPartSize=_$Table_setFloatingPartSize;
	table._$getColumnSplitSlider=_$Table_getColumnSplitSlider;
	table._$getColumnDraggingCursor=_$Table_getColumnDraggingCursor;
	table._$getColumnDraggingAnchorPoint=_$Table_getColumnDraggingAnchorPoint;
	table._$showIntactCurrentElement=_$Table_showIntactCurrentElement;
	table._$showCoverPart=_$Table_showCoverPart;
	table._$getCurrentCell=_$Table_getCurrentCell;
	table._$isEditing=_$Table_isEditing;
	table._$getCellEditor=_$Table_getCellEditor;
	table._$showCellEditor=_$Table_showCellEditor;
	table._$sizeCellEditor=_$Table_sizeCellEditor;
	table._$onMouseDown=_$Table_onMouseDown;
	table._$onRecordClick=_$Table_onRecordClick;
	table._$onRecordDblClick=_$Table_onRecordDblClick;
	table._$$resize=_$Table_doResize;
	table._viewModel=viewModel;
	table._columns=new HashList();	
	table._headerHeight=20;
	table._footerHeight=20;
	table._rowHeight=parseInt(_$getPreferenceSetting("__DataTable_DataGrid_RowHeight"));
	table._fixedColumnCount=0;
	table._scrollMode=__Table_SCROLLMODE_RECORD;
	table._showHeader=true;
	table._showFooter=false;
	table._showIndicator=true;
	table._showHScrollBar=true;
	table._showVScrollBar=true;
	table._highlightSelection=true;
	table._readOnly=false;
	table._editable=true;
	table._confirmDelete=true;
	table._confirmCancel=true;
	table._supportsPropertiesWindow=true;
	table._maxRow=0;
	table._outerTable=null;
	table._innerTable=null;
	table._vScrollBar=null;
	table._hScrollBar=null;
	table._fixedHeaderGridOuterDiv=null;
	table._headerGridOuterDiv=null;
	table._fixedDataGridOuterDiv=null;
	table._dataGridOuterDiv=null;
	table._fixedFooterGridDiv=null;
	table._footerGridOuterDiv=null;
	table._fixedHeaderGrid=null;
	table._headerGrid=null;
	table._fixedDataGrid=null;
	table._dataGrid=null;
	table._fixedFooterGrid=null;
	table._footerGrid=null;
	table._dataGridOuterCell=null;
	table._tableFirstRecord=null;
	table._tableLastRecord=null;
	table._parityCheck=0;
	table._cellEditorMap=new HashList();
	table._rebuildDone=false;
	table._fixedPartWidth=0;
	table._fixedPartHeight=0;
	table._headerCell=null;
	table._activeEditor=null;
	table._scrolling=false;
	table._localize=true;
	table._sortable=true;
	table._multiSelect=false;
	table._orderColumns=new HashList();
	EventManager.addSystemEvent(table,"onmousewheel",function (){
		return _$Table_onMouseWheel(table);
		
	}
	);
	if(browserType==__Browser_IE){
		EventManager.addSystemEvent(table,"onresize",function (){
			table.onResize();
			
		});
		
	};
	return table;
	
};



//**************************
//��ݱ��ؼ�
//**************************
var __Table_SCROLLMODE_SIMPLE="simple";
var __Table_SCROLLMODE_RECORD="record";
function _$buildDataTable(id,viewModel){
	var table=_$buildTable(id,viewModel);
	if(!table.className)_$setElementStyle(table,"DataTable");
	return table;
	
};
KingfisherFactory._$registerComponentType("DataTable",_$buildDataTable);
function _$Table_processDatasetMessage(message,dataset,args){
	//������ʾˮƽ������ʱ
	function _$noHScrollBarRefresh(table){
		var dataGrid=table._dataGrid;
		if(!table._showHScrollBar){
			var first=dataGrid.getFirstColumnIndex();
			var last=dataGrid.getLastColumnIndex();
			var spacing=0,colPadding=0;
			if(browserType==__Browser_IE){
				spacing=parseInt(_$getPreferenceSetting("__"+table.className+"_InnerTable_CellSpacing"));
				colPadding=0;
				
			}else {
				spacing=parseInt(_$getPreferenceSetting("__"+table.className+"_Grid_BorderWidth"));
				colPadding=spacing+2;
				
			};
			
			var columns=new Array();
			var visibleColWidth=spacing;
			for(var i=first;i<=last;i++){
				var column=table.getColumn(i);
				if(!column._visible)continue;
				if(column._type=="data"){
					columns.push(column);
					visibleColWidth+=column._width+colPadding;
					
				}else {
					var subColumns=column._columns;
					var columnCount=subColumns.size();
					for(var j=0;j<columnCount;j++){
						var subColumn=subColumns.get(j);						
						if(!subColumn._visible)continue;
						columns.push(subColumn);
						visibleColWidth+=subColumn._width+colPadding;
						
					}
				}
			};
			
			var q=0;
			var colSpacing=spacing;
			var offsetWidth=table._dataGridOuterDiv.offsetWidth;
			var power=offsetWidth/visibleColWidth;
			for(var i=0;i<columns.length;i++){
				var column=columns[i];
				if(!column._visible)return ;
				if(i<columns.length-1){
					var width=column._width*power;
					var p=parseInt(width);
					q+=width-p;
					if(q>0.5){
						p+=1;
						q-=1;
						
					};
					column._width=p;
					
				}else {
					column._width=offsetWidth-colSpacing-colPadding;
					
				};
				colSpacing+=column._width+colPadding;
				
			}
		}
	};
	
	function _$getNewPagePosition(pageSize,index1,index2){
		if(index1==index2){
			return 1;
			
		}else {
			return (index2-index1-1)*pageSize+1;
			
		}
	};
	
	function _$changeCurrentRow(table,dataset,args){
		with(table){
			var currentRowRecord=null;
			if(_scrollMode!=__Table_SCROLLMODE_SIMPLE){
				if(_dataGrid._currentRow!=null){
					currentRowRecord=_dataGrid._currentRow._record;
					
				}
			};
			if(_fixedDataGrid!=null){
				_fixedDataGrid.processDatasetMessage(__Dataset_MSG_CURRENT_CHANGED,dataset,args);
				
			};
			_dataGrid.processDatasetMessage(__Dataset_MSG_CURRENT_CHANGED,dataset,args);		
				
			if(!_scrolling&&_vScrollBar!=null){
				var visibleCount=getVisibleCount();
				_vScrollBar.setMax(visibleCount);
				
				if(_scrollMode!=__Table_SCROLLMODE_SIMPLE){
					var position=_vScrollBar.getPosition();
					var pageSize=dataset._pageSize;
					var current=dataset._current;
					var needRefreshScrollbar=false;
					
					if(current!=null&&currentRowRecord!=null){
						var previousRowRecord=currentRowRecord;
						var nextRowRecord=currentRowRecord;
						var nextPagePosition=0;
						var prevPagePosition=0;
						
						for(var i=0;i<10;i++){
							if(nextRowRecord!=null){
								var recordPageInx=nextRowRecord._pageIndex;
								nextRowRecord=_$getDatasetNextRecord(nextRowRecord);
								
								if(nextRowRecord!=null){
									
									nextPagePosition+=_$getNewPagePosition(pageSize,recordPageInx,nextRowRecord._pageIndex);
									if(nextRowRecord==current){
										position+=nextPagePosition;
										needRefreshScrollbar=true;
										break;
										
									}
								}
							};
							if(previousRowRecord!=null){
								var recordPageInx=previousRowRecord._pageIndex;
								previousRowRecord=_$getDatasetPrevRecord(previousRowRecord);
								
								if(previousRowRecord!=null){
									prevPagePosition+=_$getNewPagePosition(pageSize,recordPageInx,previousRowRecord._pageIndex);
									if(previousRowRecord==current){
										position-=prevPagePosition;
										needRefreshScrollbar=true;
										break;
										
									}
								}
							}
						}
					};
					
					if(needRefreshScrollbar){
						_scrolling=true;
						_vScrollBar.setPosition(position);
						_scrolling=false;
						
					}else {
						if(_$getDatasetLastRecord()==current){
							position=_vScrollBar.getMax();
							
						}
						else {
							position=1;
							var record=_$getDatasetFirstRecord();
							while(record!=null){
								if(record==current)break;
								var recordPageInx=record._pageIndex;
								record=_$getDatasetNextRecord(record);
								if((record!=null)){
									position+=_$getNewPagePosition(pageSize,recordPageInx,record._pageIndex);
									
								}
							}
						};
						_scrolling=true;
						_vScrollBar.setPosition(position);
						_scrolling=false;
						
					}
				}
			}
		}
	};
	//����е�����û���ã���ôȡ��Ӧ�ֶε�Ĭ������
	function _$setColumnByFieldProperty(fields,column){
		var field=fields.get(column._field.toLowerCase());
		if(field!=null){
			if(column._align==null){
				if(field._dataType>=2&&field._dataType<=8){
					column._align="right";
					
				}
			};
			if(column._dropDown==null){
				column._dropDown=field._dropDown;
				
			};
			if(column._editorType==null){
				column._editorType=field._editorType;
				
			}
		}else {
			column.$2z=true;
			
		}
	};
	function _$refreshColumn(table,dataset){
		var fields=dataset._fields;
		var columns=table._columns;
		var columnCount=columns.size();
		for(var i=0;i<columnCount;i++){
			var column=columns._objectArray[i];
			if(column._type=="group"){
				if(column._visible){
					var subColumns=column._columns;
					var subColumnCount=subColumns.size();
					var visibleSubColumns=0;
					for(var j=0;j<subColumnCount;j++){
						
						var subColumn=subColumns._objectArray[j];
						_$setColumnByFieldProperty(fields,subColumn);
						
						if(subColumn._visible)visibleSubColumns++;
						
					};
					//�������е����ж�����ʾ����ô�����Ҳ����ʾ
					if(visibleSubColumns==0){
						column._visible=false;
						
					}
				}
			}else {
				_$setColumnByFieldProperty(fields,column);
				
			}
		}
	};
	with(this){
		if((this.offsetWidth==0||this.offsetHeight==0)&&browserType==__Browser_IE){
			if(_rebuildDone&&__Hidden_Need_Refresh_Elements.findElement(this)==null){
				__Hidden_Need_Refresh_Elements.insert(this);
				
			};
			return ;
			
		};
		if(!_rebuildDone){
			rebuild();
			
		};

		switch(message){
			case __Dataset_MSG_REFRESH:{
				this._hasMultiSelect=false;
				this._cellHeight=this._rowHeight+2+parseInt(_$getPreferenceSetting("__"+this.className+"_Grid_BorderWidth"));
				_$refreshColumn(this,dataset);
				
				var isRefreshed=false;
				if(_fixedHeaderGrid!=null){
					_fixedHeaderGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,args);
					
				};
				if(_headerGrid!=null){
					_$noHScrollBarRefresh(this);
					isRefreshed=true;
					_headerGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,args);
					
				};
				_$setFixedPartHeight();
				if(_scrollMode!=__Table_SCROLLMODE_SIMPLE){
					_$setValidTableFirstRecord();
					
				};
				if(!isRefreshed){
					_$noHScrollBarRefresh(this);
					
				};
				if(_fixedFooterGrid!=null){
					_fixedFooterGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,args);
					
				};
				if(_footerGrid!=null){
					
					_footerGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,args);
					
				};
				if(_fixedDataGrid!=null){
					_fixedDataGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,args);
					
				};
				_$setFixedPartWidth();
				if(browserType==__Browser_IE){
					_$setFloatingPartSize();
					
				};
				_dataGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,args);
				if(browserType!=__Browser_IE){
					_$setFloatingPartSize();
					
				};
				_$refreshScrollBar();
				_$changeCurrentRow(this,dataset,[dataset._current]);
				_$showCoverPart();
				
				this._sourceWidth=this.offsetWidth;
				this._sourceHeight=this.offsetHeight;
				
				if(this._tableResizeTimeout)clearTimeout(this._tableResizeTimeout);

				break;
				
			};
			case __Dataset_MSG_CURRENT_CHANGED:{
				this._$hideCellEditor();
				if(_scrollMode!=__Table_SCROLLMODE_SIMPLE){
					_$setValidTableFirstRecord();
					
				};
				_$changeCurrentRow(this,dataset,args);
				_$showCoverPart();
				break;
				
			};
			case __Dataset_MSG_REFRESH_RECORD:;
			case __Dataset_MSG_DATA_CHANGED:;
			case __Dataset_MSG_RECORD_STATE_CHANGED:{
				if(_fixedDataGrid!=null){
					_fixedDataGrid.processDatasetMessage(message,dataset,args);
					
				};
				_dataGrid.processDatasetMessage(message,dataset,args);
				if(_fixedFooterGrid!=null){
					_fixedFooterGrid.processDatasetMessage(message,dataset,args);
					
				};
				if(_footerGrid!=null){
					_footerGrid.processDatasetMessage(message,dataset,args);
					
				};
				_$setFloatingPartSize();
				break;
				
			};
			case __Dataset_MSG_GAINING_CHANGE:{
				if(_activeEditor!=null){
					_activeEditor.processDatasetMessage(message,dataset,args);					
					
				};
				break;
				
			};
			case __Dataset_MSG_RECORD_INSERTED:{
				if(_fixedDataGrid!=null){
					_fixedDataGrid.processDatasetMessage(message,dataset,args);
					
				};
				_dataGrid.processDatasetMessage(message,dataset,args);
				if(_scrollMode!=__Table_SCROLLMODE_SIMPLE){
					var rows=_dataGrid._tbody.rows;
					if(rows.length>0){
						this._tableFirstRecord=rows[0]._record;
						this._tableLastRecord=rows[rows.length-1]._record;
						
					}
				};
				_$setFixedPartWidth();
				break;
				
			};
			case __Dataset_MSG_RECORD_DELETED:{
				this._hasMultiSelect=false;
				if(_fixedDataGrid!=null){
					_fixedDataGrid.processDatasetMessage(message,dataset,args);
					
				};
				_dataGrid.processDatasetMessage(message,dataset,args);
				if(_fixedFooterGrid!=null){
					_fixedFooterGrid.processDatasetMessage(message,dataset,args);
					
				};
				if(_footerGrid!=null){
					_footerGrid.processDatasetMessage(message,dataset,args);
					
				};
				if(_scrollMode!=__Table_SCROLLMODE_SIMPLE){
					var rows=_dataGrid._tbody.rows;
					if(rows.length>0){
						this._tableFirstRecord=rows[0]._record;
						this._tableLastRecord=rows[rows.length-1]._record;
					}					
				};
				break;
				
			};
			default:{
				if(_fixedDataGrid!=null){
					_fixedDataGrid.processDatasetMessage(message,dataset,args);
					
				};
				_dataGrid.processDatasetMessage(message,dataset,args);
				break;
				
			}
		}
	}

};
function _$Table_destroy(){
	this._$abolishBinding();
	if(this._propertiesWindow!=null){
		this._propertiesWindow.destroy();
		this._propertiesWindow._outlineTable=null;
		this._propertiesWindow=null;
		
	};
	if(__Header_ColumnSplitSlider!=null){
		__Header_ColumnSplitSlider._resizingCell=null;
		
	};
	__Header_ColumnSplitSlider=null;
	if(__Header_ColumnDraggingCursor!=null){
		__Header_ColumnDraggingCursor._activeCell=null;
		__Header_ColumnDraggingCursor._movingCell=null;
		
	};
	__Header_ColumnDraggingCursor=null;
	__Header_ColumnDraggingAnchorPoint=null;
	__Current_HeaderGrid=null;
	this._dataset=null;
	if(this._fixedHeaderGrid!=null){
		this._fixedHeaderGrid.destroy();
		
	};
	if(this._headerGrid!=null){
		this._headerGrid.destroy();
		
	};
	if(this._fixedDataGrid!=null){
		this._fixedDataGrid.destroy();
		
	};
	if(this._dataGrid!=null){
		this._dataGrid.destroy();
		
	};
	if(this._fixedFooterGrid!=null){
		this._fixedFooterGrid.destroy();
		
	};
	if(this._footerGrid!=null){
		this._footerGrid.destroy();
		
	};
	if(this._vScrollBar!=null){
		this._vScrollBar._outlineTable=null;
		
	};
	if(this._hScrollBar!=null){
		this._hScrollBar._outlineTable=null;
		
	};
	var element=this._cellEditorMap._first;
	while(element!=null){
		element._data=null;
		element=element._next;
		
	};
	this._cellEditorMap.clear();
	var columnCount=this._columns.size();	
	for(var i=0;i<columnCount;i++){
		var column=this._columns.get(i);
		column.destroy();
		
	};
	this._columns.clear();
	this._outerTable=null;
	this._innerTable=null;
	this._vScrollBar=null;
	this._hScrollBar=null;
	this._fixedHeaderGridOuterDiv=null;
	this._headerGridOuterDiv=null;
	this._fixedDataGridOuterDiv=null;
	this._dataGridOuterDiv=null;
	this._fixedFooterGridDiv=null;
	this._footerGridOuterDiv=null;
	this._fixedHeaderGrid=null;
	this._headerGrid=null;
	this._fixedDataGrid=null;
	this._dataGrid=null;
	this._fixedFooterGrid=null;
	this._footerGrid=null;
	this._headerCell=null;
	this._dataGridOuterCell=null;
	this._activeEditor=null;
	this._orderColumns.clear();
	this._orderMenu=null;
	
};
function _$Table_establishBinding(){
	var dataset=this._dataset;
	if(dataset!=null){
		var columns=this._columns._objectArray;
		if(columns.length==0){
			this._$addColumnByField();
			
		};
		for(var i=0;i<columns.length;i++){
			var column=columns[i];
			if(column._type=="data"){
				var field=dataset.getField(column._field);
				if(field!=null)column._dataType=field._dataType;
				
			}else {
				var subColumns=column._columns._objectArray;
				for(var j=0;j<subColumns.length;j++){
					var subColumn=subColumns[j];
					var field=dataset.getField(subColumn._field);
					if(field!=null)subColumn._dataType=field._dataType;
					
				}
			}
		}
	}
	this._$oldEstablishBinding();
	
};
function _$Table_onKeyDown(){
	function _$getPreviousColumn(table,column){
		//��shift+tab��һ��,����һ��֮�󲻻�����һ��//
		var columns,span;
		var dataGrid=table._dataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			columns=dataGrid._columns;
			var index=columns.indexOf(column);
			if(index>0){
				return columns[index-1];
				
			}else if(index==0){
				span=true;
				
			}
		};
		dataGrid=table._fixedDataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			columns=dataGrid._columns;
			if(span){
				return columns[columns.length-1];
				
			}else {
				var index=columns.indexOf(column);
				if(index>0){
					return columns[index-1];
					
				}
			}
		};
		return null;
		
	};
	function _$getNextColumn(table,column){
		//��tab��һ��,�����һ��֮�󲻻�����һ��//
		var columns,span;
		var dataGrid=table._fixedDataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			columns=dataGrid._columns;
			var index=columns.indexOf(column);
			if(index>=0&&index<columns.length-1){
				return columns[index+1];
				
			}else if(index==columns.length-1){
				span=true;
				
			}
		};
		dataGrid=table._dataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			columns=dataGrid._columns;
			if(span){
				return columns[0];
				
			}else {
				
				var index=columns.indexOf(column);
				if(index>=0&&index<columns.length-1){
					return columns[index+1];
					
				}
			}
		};
		return null;
		
	};

	function _$getFirstColumn(table,column){
		var dataGrid=table._fixedDataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			return dataGrid._columns[0];
			
		};
		dataGrid=table._dataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			return dataGrid._columns[0];
			
		};
		return null;
		
	};
	function _$getLastColumn(table,column){
		var columns;
		var dataGrid=table._dataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			columns=dataGrid._columns;
			return columns[columns.length-1];
			
		};
		dataGrid=table._fixedDataGrid;
		if(dataGrid!=null&&dataGrid._columns.length>0){
			columns=dataGrid._columns;
			return columns[columns.length-1];
			
		};
		return null;
		
	};
	var dataset=this._dataset;
	var column=(this._currentCell!=null)?this._currentCell._column:null;
	if(event){
		switch(event.keyCode){
			case 37:{		//LEFT ARROW ��//
				if(event.ctrlKey&&column){
					var prevColumn=_$getPreviousColumn(this,column);
					if(prevColumn!=null){
						this.setCurrentColumn(prevColumn);
						event.returnValue=false;
						
					}
				};
				break;
				
			};
			case 39:{		//RIGHT ARROW ��//
				if(event.ctrlKey&&column){
					var nextColumn=_$getNextColumn(this,column);
					if(nextColumn!=null){
						
						this.setCurrentColumn(nextColumn);
						event.returnValue=false;
						
					}
				};
				break;
				
			};
			case 38:{		//UP
				this._$hideCellEditor();
				this._$movePrev();
				if(column)this.setCurrentColumn(column);
				event.returnValue=false;
				break;
				
			};
			case 40:{		//DOWN
				this._$hideCellEditor();
				if(dataset._current==this._$getDatasetLastRecord()&&(dataset._current._state!=__Record_STATE_NEW)&&!dataset._readOnly&&!this._readOnly){
					//��������һ�У������Ƿ������Զ�������¼ By QWJ 2008.08.12
					if (!(_$fireKingfisherEvent(this,"onAbortAppendRecord",[this])))
					{
						this._$insertRecord();
					}
					
				}else {
					this._$moveNext();
					
				};
				if(column)this.setCurrentColumn(column);
				event.returnValue=false;
				break;
				
			};
			case 45:{			//INSERT
				this._$hideCellEditor();
				//��������һ�У������Ƿ������Զ�������¼ By QWJ 2008.08.12
				if (!(_$fireKingfisherEvent(this,"onAbortAppendRecord",[this])))
				{
					if(!dataset._readOnly&&!this._readOnly){
						if(event.ctrlKey){
							this._$insertRecord("before");
							
						}else {
							this._$insertRecord();
							
						}
					}
				};
				if(column)this.setCurrentColumn(column);
				event.returnValue=false;
				break;
				
			};
			case 46:{			//DEL
				if((!this._readOnly) && (!this._dataset.isReadOnly())){
					if(event.ctrlKey){
						this._$hideCellEditor();
						if(!this._confirmDelete||confirm(__CONFIRM_DELETE_RECORD)){
							this._$deleteRecord();
							if(column)this.setCurrentColumn(column);
							
						};
						event.returnValue=false;
						
					}
					
				};
				break;
				
			};
			case 27:{		//ESC
				if(!this._readOnly){
					this._$hideCellEditor();
					if(!this._confirmCancel||confirm(__CONFIRM_CANCEL_RECORD)){
						this._$cancelRecord();
						if(column)this.setCurrentColumn(column);
						
					};
					event.returnValue=false;
					
				};
				break;
				
			};
			case 9:{		//TAB ��//
				if(event.shiftKey){
					var prevColumn=_$getPreviousColumn(this,column);
					if(prevColumn!=null){
						this.setCurrentColumn(prevColumn);
						event.returnValue=false;
						
					}else {
						var oldActiveRow=this._dataGrid._currentRow;
						this._$movePrev();
						if(oldActiveRow==this._dataGrid._currentRow){
							var observer=_$getPriorTabElement(this);
							if(observer!=null)_$elementOnFocus(observer);
							event.returnValue=false;
							
						}else {
							prevColumn=_$getLastColumn(this,column);
							if(prevColumn!=null){
								this.setCurrentColumn(prevColumn);
								event.returnValue=false;
								
							}
						}
					}
				}else {
					var nextColumn=_$getNextColumn(this,column);
					if(nextColumn!=null){
						this.setCurrentColumn(nextColumn);
						event.returnValue=false;
						
					}else {
						var oldActiveRow=this._dataGrid._currentRow;
						this._$moveNext();
						if(oldActiveRow==this._dataGrid._currentRow){
							var observer=_$getNextTabElement(this);
							if(observer!=null)_$elementOnFocus(observer);
							event.returnValue=false;						
							
						}else {
							nextColumn=_$getFirstColumn(this,column);
							if(nextColumn!=null){
								this.setCurrentColumn(nextColumn);
								event.returnValue=false;
								
							}
						}
					}
				};
				break;
				
			};
			case 13:{			//ENTER ��
				if(event.shiftKey){
					var prevColumn=_$getPreviousColumn(this,column);
					if(prevColumn!=null){
						this.setCurrentColumn(prevColumn);
						event.returnValue=false;
						
					}else {
						var oldActiveRow=this._dataGrid._currentRow;
						this._$movePrev();
						if(oldActiveRow==this._dataGrid._currentRow){
							var observer=_$getPriorTabElement(this);
							if(observer!=null)_$elementOnFocus(observer);
							event.returnValue=false;
							
						}else {
							prevColumn=_$getLastColumn(this,column);
							if(prevColumn!=null){
								this.setCurrentColumn(prevColumn);
								event.returnValue=false;
								
							}
						}
					}
				}else {
					var nextColumn=_$getNextColumn(this,column);
					
					//�س�����£�ֻ����Ա༭���� 2013.08.15 by QWJ
					if(!dataset._readOnly && !this._readOnly){
						while (nextColumn)
						{
							
							if (dataset.getField(nextColumn._field) && (!(nextColumn.isReadOnly() || dataset.getField(nextColumn._field).isReadOnly())))
							{
								break;
							}
							nextColumn=_$getNextColumn(this,nextColumn)
						}
					}
					//End
					
					if(nextColumn!=null){
						this.setCurrentColumn(nextColumn);
						event.returnValue=false;
						
					}else {
						var oldActiveRow=this._dataGrid._currentRow;
						if(dataset.getCurrent()==this._$getDatasetLastRecord()){
							//��������һ�У������Ƿ������Զ�������¼ By QWJ 2008.08.12
							if (!(_$fireKingfisherEvent(this,"onAbortAppendRecord",[this])))
							{
								if(!dataset._readOnly&&!this._readOnly){
										this._$insertRecord();
								}
							};
							
						}else {
							this._$moveNext();
							
						}
						if(oldActiveRow==this._dataGrid._currentRow){
							var observer=_$getNextTabElement(this);
							//�����2013.08.23ע�ͣ�����ҳ�����Tabset�󣬽������
							//if(observer!=null)_$elementOnFocus(observer);
							event.returnValue=false;
							
						}else {
							nextColumn=_$getFirstColumn(this,column);
							if(nextColumn!=null){
								this.setCurrentColumn(nextColumn);
								event.returnValue=false;
								
							}
						}
					}
				};
				break;
				
			};
			case 33:{			//PAGE UP ��//
				this._$hideCellEditor();
				this._$move(this._$getPageSpanRowNumber()*(-1));
				if(column)this.setCurrentColumn(column);
				event.returnValue=false;
				break;
				
			};
			case 34:{			//PAGE DOWN ��//
				this._$hideCellEditor();
				this._$move(this._$getPageSpanRowNumber());
				if(column)this.setCurrentColumn(column);
				event.returnValue=false;
				break;
				
			};
			case 36:{			//HOME ��//
				this._$hideCellEditor();
				if(event.ctrlKey){
					this._$moveFirst();
					if(column)this.setCurrentColumn(column);
					event.returnValue=false;
					
				}else {
					var firstColumn=_$getFirstColumn(this,column);
					if(firstColumn!=null){
						this.setCurrentColumn(firstColumn);
						event.returnValue=false;
						
					}
				};
				break;
				
			};
			case 35:{			//END ��//
				this._$hideCellEditor();
				if(event.ctrlKey){
					this._$moveLast();
					if(column)this.setCurrentColumn(column);				
					event.returnValue=false;
					
				}else {
					var lastColumn=_$getLastColumn(this,column);
					if(lastColumn!=null){
						this.setCurrentColumn(lastColumn);
						event.returnValue=false;
						
					}
				};
				break;
				
			};
			case 84:{		//T ��//
				if(event.ctrlKey){
					this._$hideCellEditor();
					this.showPropertiesWindow();
					
				};
				break;
			}
			//F3 or Ctrl+F
			case 70:{
				if(event.ctrlKey){
					if (_$fireKingfisherEvent(this,"onSearchData",[dataset, this]));
						event.returnValue=false;
				}
				break;
			}
			case 114:{
				if (_$fireKingfisherEvent(this,"onSearchData",[dataset, this]));
					event.returnValue=false;
				break;
			}
		}
	}
};
function _$Table_getHeaderHeight(){
	return this._headerHeight;
	
};
function _$Table_setHeaderHeight(headerHeight){
	this._headerHeight=headerHeight;
	
};
function _$Table_getFooterHeight(){
	return this._footerHeight;
	
};
function _$Table_setFooterHeight(footerHeight){
	this._footerHeight=footerHeight;
	
};
function _$Table_getRowHeight(){
	return this._rowHeight;
	
};
function _$Table_setRowHeight(rowHeight){
	this._rowHeight=rowHeight;
	
};
function _$Table_getFixedColumn(){
	return this._fixedColumnCount;
	
};
function _$Table_setFixedColumn(fixedColumn){
	this._fixedColumnCount=fixedColumn;
	
};
function _$Table_getScrollMode(){
	return this._scrollMode;
	
};
function _$Table_setScrollMode(scrollMode){
	this._scrollMode=scrollMode;
	
};
function _$Table_getShowHeader(){
	
	return this._showHeader;
	
};
function _$Table_setShowHeader(showHeader){
	this._showHeader=showHeader;
	
};
function _$Table_getShowFooter(){
	return this._showFooter;
	
};
function _$Table_setShowFooter(showFooter){
	this._showFooter=showFooter;
	
};
function _$Table_getShowIndicator(){
	return this._showIndicator;
	
};
function _$Table_setShowIndicator(showIndicator){
	this._showIndicator=showIndicator;
	
};
function _$Table_getShowHScrollBar(){
	return this._showHScrollBar;
	
};
function _$Table_setShowHScrollBar(showHScrollBar){
	this._showHScrollBar=showHScrollBar;
	
};
function _$Table_getShowVScrollBar(){
	return this._showVScrollBar;
	
};
function _$Table_setShowVScrollBar(showVScrollBar){
	this._showVScrollBar=showVScrollBar;
	
};
function _$Table_getReadOnly(){
	return this._readOnly;
	
};
function _$Table_setReadOnly(readOnly){
	this._readOnly=readOnly;
	
};
function _$Table_getEditable(){
	return this._editable;
	
};
function _$Table_setEditable(editable){
	this._editable=editable;
	
};
function _$Table_getHighlightSelection(){
	return this._highlightSelection;
	
};
function _$Table_setHighlightSelection(highlightSelection){
	this._highlightSelection=highlightSelection;
	
};
function _$Table_getConfirmCancel(){
	return this._confirmCancel;
	
};
function _$Table_setConfirmCancel(confirmCancel){
	
	this._confirmCancel=confirmCancel;
	
};
function _$Table_getConfirmDelete(){
	return this._confirmDelete;
	
};
function _$Table_setConfirmDelete(confirmDelete){
	this._confirmDelete=confirmDelete;
	
};
function _$Table_getSupportsPropertiesWindow(){
	return this._supportsPropertiesWindow;
	
};
function _$Table_setSupportsPropertiesWindow(supportsPropertiesWindow){
	this._supportsPropertiesWindow=supportsPropertiesWindow;
	
};
function _$Table_getMaxRow(){
	return this._maxRow;
	
};
function _$Table_setMaxRow(maxRow){
	this._maxRow=maxRow;
	
};
function _$Table_getParityRow(){
	return this._parityRow;
	
};
function _$Table_setParityRow(parityRow){
	this._parityRow=parityRow;
	
};
function _$Table_getMultiSelect(){
	return this._multiSelect;
	
};
function _$Table_setMultiSelect(multiSelect){
	this._multiSelect=multiSelect;
	
};
function _$Table_addColumn(name){
	var column=new DataColumn(name);
	column._dataset=this._dataset;
	this._columns.put(name.toLowerCase(),column);
	if(name=="select"){
		column.setRendererType("checkbox");
		column.setWidth(23);
		
	};
	return column;
	
};
function _$Table_addColumnGroup(name){
	var column=new ColumnGroup(name);
	column._dataset=this._dataset;
	this._columns.put(name.toLowerCase(),column);
	return column;
	
};
function _$Table_getColumn(name){
	if(typeof(name)=="string"){
		name=name.toLowerCase();
		
	};
	return this._columns.get(name);
	
};
function _$Table_removeColumn(name){
	if(typeof(name)=="string"){
		name=name.toLowerCase();
		
	};
	return this._columns.remove(name);
	
};
function _$Table_clearColumn(){
	this._columns.clear();
	
};
function _$Table_getColumnCount(){
	return this._columns.size();	
	
};
//�����п��ӵ��ֶ���Ϊ�����//
function _$Table_addColumnByField(){
	var dataset=this._dataset;
	if(dataset==null)return ;
	var fieldCount=dataset.getFieldCount();
	for(var i=0;i<fieldCount;i++){
		var field=dataset.getField(i);
		if(field._visible){
			this.addColumn(field._name);
			
		}
	}
};
function _$Table_rebuild(){
	for(var i=this.childNodes.length-1;i>=0;i--){
		this.removeChild(this.childNodes[i]);
		
	};
	var tbody,row,cell,div,headerGrid;
	var fixedColumns=this._fixedColumnCount;
	if(this._showIndicator){
		fixedColumns++;
		
	};
	
	var innerTable=$$("TABLE");
	_$setElementStyle(innerTable,"InnerTable");
	innerTable.border=_$getPreferenceSetting("__"+this.className+"_InnerTable_BorderWidth");
	innerTable.borderColor=_$getPreferenceSetting("__"+this.className+"_InnerTable_BorderColor");
	innerTable.cellSpacing=_$getPreferenceSetting("__"+this.className+"_InnerTable_CellSpacing");
	innerTable.cellPadding=0;
	innerTable.style.width="100%";
	innerTable.style.height="100%";
	tbody=$$("TBODY");
	
	if(this._showHeader){
		row=$$("TR");
		row.style.height=1;
		if(fixedColumns>0){
			cell=$$("TD");
			cell.vAlign="top";
			div=$$("DIV");
			_$setElementStyle(div,"HeaderDiv");
			
			var headerGrid=_$buildTable$FixedHeader(this,this.id+"_FixedHeaderGrid");
			_$setElementStyle(headerGrid,"HeaderGrid");
			this._fixedHeaderGrid=headerGrid;
			this._fixedHeaderGridOuterDiv=div;
			div.appendChild(headerGrid);
			cell.appendChild(div);
			row.appendChild(cell);
			
		};
		cell=$$("TD");		
		cell.width="100%";
		cell.vAlign="top";
		div=$$("DIV");
		_$setElementStyle(div,"HeaderDiv");
		div.style.overflow="hidden";
		
		var headerGrid=_$buildTable$Header(this,this.id+"_HeaderGrid");
		_$setElementStyle(headerGrid,"HeaderGrid");
		this._headerGrid=headerGrid;
		this._headerGridOuterDiv=div;
		div.appendChild(headerGrid);
		cell.appendChild(div);
		row.appendChild(cell);
		cell.appendChild(div);
		tbody.appendChild(row);
		
	};
	row=$$("TR");
	row.style.height="100%";
	if(fixedColumns>0){
		cell=$$("TD");
		cell.vAlign="top";
		div=$$("DIV");
		if(browserType==__Browser_OTHER){
			div.style.height="100%";
			
		};
		div.style.overflow="hidden";
		
		var dataGrid=_$buildTable$FixedDataGrid(this,this.id+"_FixedDataGrid");
		_$setElementStyle(dataGrid,"FixedDataGrid");
		dataGrid.style.tableLayout="fixed";
		if(browserType==__Browser_IE){
			dataGrid.width=1;
			
		};
		this._fixedDataGrid=dataGrid;
		this._fixedDataGridOuterDiv=div;
		div.appendChild(dataGrid);
		cell.appendChild(div);
		row.appendChild(cell);
		
	};
	cell=$$("TD");
	cell.width="100%";
	cell.vAlign="top";
	div=$$("DIV");
	if(browserType==__Browser_OTHER){
		div.style.height="100%";
		div.style.width="100%";
		
	};
	div.style.overflow="hidden";
	if(browserType==__Browser_IE){
		EventManager.addSystemEvent(div,"onscroll",function (){
			_$Table_onScroll(dataGrid._outlineTable);
			
		}
		);
		
	};
	
	var dataGrid=_$buildTable$DataGrid(this,this.id+"_DataGrid");
	_$setElementStyle(dataGrid,"DataGrid");
	dataGrid.style.tableLayout="fixed";
	this._dataGrid=dataGrid;
	this._dataGridOuterDiv=div;
	this._dataGridOuterCell=cell;
	div.appendChild(dataGrid);
	cell.appendChild(div);
	row.appendChild(cell);
	tbody.appendChild(row);
	
	if(this._showFooter){
		row=$$("TR");
		row.style.height=this._footerHeight;

		if(fixedColumns>0){
			cell=$$("TD");
			cell.vAlign="top";
			div=$$("DIV");
			div.style.height="100%";
			div.style.overflow="hidden";
			
			var footerGrid=_$buildTable$FixedFooter(this,this.id+"_FixedFooterGrid");
			_$setElementStyle(footerGrid,"FooterGrid");
			this._fixedFooterGrid=footerGrid;
			this._fixedFooterGridDiv=div;
			div.appendChild(footerGrid);
			cell.appendChild(div);
			row.appendChild(cell);
			
		};
		cell=$$("TD");
		cell.width="100%";
		cell.vAlign="top";
		div=$$("DIV");
		div.style.height="100%";
		div.style.overflow="hidden";
		
		var footerGrid=_$buildTable$Footer(this,this.id+"_FooterGrid");
		_$setElementStyle(footerGrid,"FooterGrid");
		this._footerGrid=footerGrid;
		this._footerGridOuterDiv=div;
		div.appendChild(footerGrid);
		cell.appendChild(div);
		row.appendChild(cell);
		tbody.appendChild(row);
		
	};
	innerTable.appendChild(tbody);
	if(this._showVScrollBar){
		var vScrollBar=KingfisherFactory.create("ScrollBar",null,null,__ScrollBar_ORIENTA_VERTICAL);
		vScrollBar.style.border=0;
		vScrollBar.border=0;
		vScrollBar.activate();
		vScrollBar.style.height="100%";		
		vScrollBar._outlineTable=this;
		vScrollBar.setMin(1);
		if(this._scrollMode!=__Table_SCROLLMODE_SIMPLE){
			vScrollBar.setSmallChange(1);
			vScrollBar.setDragMode(__ScrollBar_DROPMODE_MOUSEUP);
			
		};
		EventManager.addKingfisherEvent(vScrollBar,"onPositionChanged",_$Table$VScrollBar_onPositionChanged);
		this._vScrollBar=vScrollBar;
		
	};
	if(this._showHScrollBar){
		var hScrollBar=KingfisherFactory.create("ScrollBar",null,null,__ScrollBar_ORIENTA_HORIZONTAL);
		hScrollBar.style.border=0;
		hScrollBar.activate();
		hScrollBar._showDraggingTip=false;
		hScrollBar.style.width="100%";
		hScrollBar._outlineTable=this;
		EventManager.addKingfisherEvent(hScrollBar,"onPositionChanged",_$Table$HScrollBar_onPositionChanged);
		this._hScrollBar=hScrollBar;
		
	};
	
	var outerTable=$$("TABLE");
	tbody=$$("TBODY");
	row=$$("TR");
	row.style.height="100%";
	cell=$$("TD");
	cell.width="100%";
	cell.appendChild(innerTable);
	row.appendChild(cell);
	if(this._showVScrollBar){
		cell=$$("TD");
		cell.width=1;
		cell.appendChild(vScrollBar);
		row.appendChild(cell);
		
	};
	tbody.appendChild(row);
	if(this._showHScrollBar){
		row=$$("TR");
		row.style.height=1;
		cell=$$("TD");
		cell.width="100%";
		cell.appendChild(hScrollBar);
		row.appendChild(cell);
		if(this._showVScrollBar){
			cell=$$("TD");
			cell.width=1;
			row.appendChild(cell);
			
		};
		tbody.appendChild(row);
		
	};
	_$setElementStyle(outerTable,"OuterTable");
	outerTable.border=_$getPreferenceSetting("__"+this.className+"_OuterTable_BorderWidth");
	outerTable.borderColor=_$getPreferenceSetting("__"+this.className+"_OuterTable_BorderColor");
	outerTable.cellSpacing=0;	
	outerTable.cellPadding=0;
	outerTable.appendChild(tbody);
	outerTable.style.width="100%";
	if(browserType!=__Browser_IE){
		outerTable.style.height="100%";
		
	};
	
	this._innerTable=innerTable;
	this._outerTable=outerTable;
	this.style.overflow="hidden";
	this.appendChild(outerTable);
	
	if(vScrollBar!=null)vScrollBar.refresh();
	if(hScrollBar!=null)hScrollBar.refresh();
	
	this._rebuildDone=true;
	
};
function _$Table_getDatasetFirstRecord(){
	var dataset=this._dataset;
	if(dataset._autoLoadPage&&!dataset._alreadySort){
		var recordSet=dataset._recordset;
		var record=recordSet._first;
		if(record==null){
			dataset._$insertReferendRecord(1,null);
			return recordSet._first;
			
		};
		if(record._pageIndex>1){
			dataset._$insertReferendRecord(1,record);
			return recordSet._first;
			
		};
		if(record.$2z)return record;
		if(dataset.isRecordVisible(record))return record;
		return this._$getDatasetNextRecord(record);
		
	}else {
		return dataset.getFirstRecord();
		
	}
};
function _$Table_getDatasetLastRecord(){
	var dataset=this._dataset;
	if(dataset._autoLoadPage&&!dataset._alreadySort){
		var recordSet=dataset._recordset;
		var record=recordSet._last;
		if(record==null){
			dataset._$insertReferendRecord(recordSet._pageCount,null);
			return recordSet._last;
			
		};
		if(record._pageIndex<recordSet._pageCount){
			dataset._$insertReferendRecord(recordSet._pageCount,null);
			return recordSet._last;			
			
		};
		if(record.$2z)return record;
		if(dataset.isRecordVisible(record))return record;
		return this._$getDatasetPrevRecord(record);
		
	}else {
		return dataset.getLastRecord();
		
	}
};
function _$Table_getDatasetPrevRecord(record){
	var dataset=record._dataset;
	if(dataset==null){
		return null;
		
	};
	var pageIndex=record._pageIndex;
	if(dataset._autoLoadPage&&!dataset._alreadySort){
		do{
			var newRecord=record._previous;
			if(newRecord!=null){
				if(pageIndex-newRecord._pageIndex>1){
					dataset._$insertReferendRecord(pageIndex-1,record);
					return record._previous;
					
				};
				if(newRecord.$2z)return newRecord;
				if(dataset.isRecordVisible(newRecord))return newRecord;
				
			}else {
				if(pageIndex>1){
					dataset._$insertReferendRecord(pageIndex-1,record);
					return record._previous;
					
				}else {
					return null;
					
				}
			};
			record=newRecord;
			
		}while(true);
		
	}else {
		return record.getPrevRecord();
		
	};
	return null;
	
};
function _$Table_getDatasetNextRecord(record){
	var dataset=record._dataset;
	if(dataset==null){
		return null;		
		
	};
	var pageIndex=record._pageIndex;
	if(dataset._autoLoadPage&&!dataset._alreadySort){
		do{
			var newRecord=record._next;
			if(newRecord!=null){
				if(newRecord._pageIndex-pageIndex>1){
					dataset._$insertReferendRecord(pageIndex+1,newRecord);
					return record._next;
					
				};
				if(newRecord.$2z)return newRecord;
				if(dataset.isRecordVisible(newRecord))return newRecord;
				
			}else {
				if(pageIndex<dataset.getPageCount()){
					dataset._$insertReferendRecord(pageIndex+1,null);
					return record._next;
					
				}else {
					return null;
					
				}
			};
			record=newRecord;
			
		}while(true);
		
	}else {
		return record.getNextRecord();
		
	};
	return null;
	
};
function _$Table_moveFirst(){
	this._dataset.moveFirst();
	
};
function _$Table_movePrev(){
	this._dataset.movePrev();
	
};
function _$Table_moveNext(){
	this._dataset.moveNext();
	
};
function _$Table_moveLast(){
	this._dataset.moveLast();
	
};
function _$Table_move(margin){
	this._dataset.move(margin);
	
};
function _$Table_insertRecord(mode){
	this._dataset.insertRecord(mode);
	
};
function _$Table_deleteRecord(){
	
	this._dataset.deleteRecord();
	
};
function _$Table_cancelRecord(){
	this._dataset.cancelRecord();
	
};
function _$Table_postRecord(){
	this._dataset.postRecord();
	
};
function _$Table_getPageSpanRowNumber(){
	var clientHeight=this.offsetHeight-this._fixedPartHeight;
	var spanRowNum=parseInt(clientHeight/this._cellHeight+0.9);
	if(spanRowNum>this._maxRow&&this._maxRow>0){
		return this._maxRow;
		
	}else {
		return spanRowNum;
		
	}
};
function _$Table_setValidTableFirstRecord(){
	var dataset=this._dataset;
	var current=dataset._current;
	if(current!=null&&current._recordset!=dataset._recordset){
		current=null;
		
	};
	if(current==null){
		this._tableFirstRecord=null;
		this._tableLastRecord=null;
		return ;
		
	};
	
	var spanRowNum=this._$getPageSpanRowNumber();
	var record=null;
	var firstTableRecord=this.getFirstRecord();
	var lastTableRecord=this.getLastRecord();
	if(firstTableRecord!=null&&this._dataGrid._recordMapping.get(current._publicid)!=null){
		record=firstTableRecord;
		
		var validTarget=true;
		var isCurrent=(record==current);
		//�жϵ���ļ�¼�Ƿ�����Ч��
		for(var i=0;i<spanRowNum-1;i++){
			record=this._$getDatasetNextRecord(record);
			if(record==null){
				validTarget=false;
				break;
				
			};
			if(!isCurrent&&record==current){
				isCurrent=true;
				
			}
		};
		if(validTarget&&isCurrent&&lastTableRecord==record){
			return ;
			
		}
	}
	if(firstTableRecord!=null&&this._$getDatasetPrevRecord(firstTableRecord)==current){
		this._tableFirstRecord=current;
		return ;
		
	};
	if(lastTableRecord!=null&&this._$getDatasetNextRecord(lastTableRecord)==current){
		record=current;
		for(var i=0;i<spanRowNum-1;i++){
			var datasetPrevRecord=this._$getDatasetPrevRecord(record);
			if(datasetPrevRecord==null)break;
			record=datasetPrevRecord;
			
		};
		this._tableFirstRecord=record;
		return ;
		
	};
	var half=parseInt(spanRowNum/2);
	record=current;
	for(var i=0;i<half;i++){
		record=this._$getDatasetNextRecord(record);
		if(record==null){
			half=i;
			break;
			
		}
	};
	record=current;
	for(var i=0;i<(spanRowNum-half)-1;i++){
		var datasetPrevRecord=this._$getDatasetPrevRecord(record);
		if(datasetPrevRecord==null)break;
		record=datasetPrevRecord;
		
	};
	this._tableFirstRecord=record;
	
};
function _$Table_getFirstRecord(){
	var dataset=this._dataset;
	var record=this._tableFirstRecord;
	if(record!=null&&record._recordset==dataset._recordset){
		return record;
		
	}else {
		return null;
		
	}
};
function _$Table_getLastRecord(){
	
	var dataset=this._dataset;
	var record=this._tableLastRecord;
	if(record!=null&&record._recordset==dataset._recordset){
		return record;
		
	}else {
		return null;
		
	}
};
function _$Table_refresh(){
	this.processDatasetMessage(__Dataset_MSG_REFRESH,this._dataset,null);
	
};
function _$Table_refreshHeader(){
	var dataset=this._dataset;
	with(this){
		if(_fixedHeaderGrid!=null){
			_fixedHeaderGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,null);
			
		};
		if(_headerGrid!=null){
			_headerGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,null);
			
		}
	}
};
function _$Table_refreshFooter(){
	var dataset=this._dataset;
	with(this){
		if(_fixedFooterGrid!=null){
			_fixedFooterGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,null);
			
		};
		if(_footerGrid!=null){
			_footerGrid.processDatasetMessage(__Dataset_MSG_REFRESH,dataset,null);
			
		}
	}
};
function _$Table_setFixedPartWidth(){
	with(this){
		if(_fixedHeaderGridOuterDiv!=null){
			_fixedHeaderGridOuterDiv.style.width=_fixedHeaderGrid.offsetWidth;
			
		};
		if(_fixedDataGridOuterDiv!=null){
			_fixedDataGridOuterDiv.style.width=_fixedDataGrid.offsetWidth;
			
		};
		if(_fixedFooterGridDiv!=null){
			_fixedFooterGridDiv.style.width=_fixedFooterGrid.offsetWidth;
			
		};
		this._fixedPartWidth=_outerTable.offsetWidth-_dataGridOuterCell.offsetWidth;
		
	}
};
function _$Table_setFixedPartHeight(){
	
	with(this){
		if(_fixedHeaderGrid!=null&&_headerGrid!=null){
			if(_fixedHeaderGrid.offsetHeight<_headerGrid.offsetHeight){
				_fixedHeaderGrid.style.height=_headerGrid.offsetHeight;
				
			}else {
				_headerGrid.style.height=_fixedHeaderGrid.offsetHeight;
				
			}
		};
		if(_fixedHeaderGridOuterDiv!=null){
			_fixedHeaderGridOuterDiv.style.height=_fixedHeaderGrid.offsetHeight;
			
		};
		if(_headerGridOuterDiv!=null){
			_headerGridOuterDiv.style.height=_headerGrid.offsetHeight;
			
		};
		this._fixedPartHeight=_outerTable.offsetHeight-_dataGridOuterCell.offsetHeight;
		
	}
};
function _$Table_setFloatingPartSize(){
	with(this){
		var _width=this.offsetWidth-this._fixedPartWidth;
		var _height=this.offsetHeight-this._fixedPartHeight;
		if(_headerGridOuterDiv!=null){
			if(_width>0){
				_headerGridOuterDiv.style.width=_width;
				
			}
		};
		if(_footerGridOuterDiv!=null){
			if(_width>0){
				_footerGridOuterDiv.style.width=_width;
				
			}
		};
		if(_fixedDataGridOuterDiv!=null){
			if(_height>0){
				if(_showVScrollBar){
					_fixedDataGridOuterDiv.style.height=_height;
					
				}else if(browserType==__Browser_OTHER){
					_fixedDataGridOuterDiv.style.height=_fixedDataGrid.offsetHeight;
					
				}
			}
		};
		if(_dataGridOuterDiv!=null){
			if(_width>0){
				_dataGridOuterDiv.style.width=_width;
				
			};
			if(_height>0){
				if(_showVScrollBar){
					_dataGridOuterDiv.style.height=_height;
					
				}else if(browserType==__Browser_OTHER){
					
					_dataGridOuterDiv.style.height=_dataGrid.offsetHeight;
					
				}
			}
		}
	}
};
function _$Table_getVisibleCount(){
	return this._dataset.getVisibleCount();
	
};
function _$Table_refreshScrollBar(){
	with(this){
		if(_vScrollBar!=null){
			if(_scrollMode==__Table_SCROLLMODE_RECORD){
				var visibleCount=getVisibleCount();
				_vScrollBar.setMax(visibleCount);
				_vScrollBar.setPageSize(1);
				_vScrollBar.setBigChange(_$getPageSpanRowNumber());
				if(browserType==__Browser_OTHER){
					_vScrollBar.style.height=0;
					_vScrollBar.style.height="100%";
					
				}
			}else {
				_vScrollBar.setMax(_dataGridOuterDiv.scrollHeight);
				_vScrollBar.setPageSize(_dataGridOuterDiv.clientHeight);
				
			}
		};
		if(_hScrollBar!=null){
			if(_headerGridOuterDiv!=null){
				element=_headerGridOuterDiv;
				
			}else if(_footerGridOuterDiv!=null){
				element=_footerGridOuterDiv;
				
			}else {
				element=_dataGridOuterDiv;
				
			};
			_hScrollBar.setMax(element.scrollWidth-element.clientWidth);
			_hScrollBar.setPageSize(element.clientWidth);
			_hScrollBar.setBigChange(element.clientWidth);
			_hScrollBar.setPosition(_hScrollBar.getPosition());
			
		};
		_$afterScroll();
		
	}
};
function _$Table_onResize(){
	if(!this._active)return ;
	var needResize=(this._sourceHeight!=this.offsetHeight&&this.offsetHeight>0);
	if(!needResize){
		needResize=(this._sourceWidth!=this.offsetWidth&&this.offsetWidth>0);
		
	}
	if(!needResize)return ;
	if(this._tableResizeTimeout)clearTimeout(this._tableResizeTimeout);
	this._tableResizeTimeout=setTimeout("var table = $(\""+this.id+"\");"+"if (table != null) table._$$resize()",100);
	
};
function _$Table_doResize(){
	this._$setFloatingPartSize();
	this.refresh();
	
};
function _$Table$VScrollBar_onPositionChanged(scrollBar,oldPosition){
	var table=scrollBar._outlineTable;
	if(table._scrolling)return ;
	table._scrolling=true;
	
	try{
		if(table._scrollMode==__Table_SCROLLMODE_RECORD){
			table._dataset._halfPage=parseInt(table._$getPageSpanRowNumber()/2);
			var absPos=scrollBar.getPosition();
			if(absPos<=scrollBar.getMin()){
				table._$moveFirst();
				
			}else if(absPos>=scrollBar.getMax()){
				table._$moveLast();
				
			}else {
				var margin=absPos-oldPosition;
				table._$move(margin);
				
			}
		}else {
			var fixedDataGridOuterDiv=scrollBar._outlineTable._fixedDataGridOuterDiv;
			var dataGridOuterDiv=scrollBar._outlineTable._dataGridOuterDiv;
			var power=scrollBar.getPosition()/(scrollBar.getMax()-scrollBar.getMin()-scrollBar.getPageSize());
			if(fixedDataGridOuterDiv!=null){
				fixedDataGridOuterDiv.scrollTop=(fixedDataGridOuterDiv.scrollHeight-fixedDataGridOuterDiv.clientHeight)*power;
				
			};
			dataGridOuterDiv.scrollTop=(dataGridOuterDiv.scrollHeight-dataGridOuterDiv.clientHeight)*power;
			table._$afterScroll();
			
		}
	}finally{
		
		table._scrolling=false;
		
	}
};
function _$Table$HScrollBar_onPositionChanged(scrollBar,oldPosition){
	var table=scrollBar._outlineTable;
	table._scrolling=true;
	try{
		var headerDiv=scrollBar._outlineTable._headerGridOuterDiv;
		var dataGridOuterDiv=scrollBar._outlineTable._dataGridOuterDiv;
		var footerGridOuterDiv=scrollBar._outlineTable._footerGridOuterDiv;
		var power=(scrollBar.getPosition()-scrollBar.getMin())/(scrollBar.getMax()-scrollBar.getMin());
		
		if(headerDiv!=null){
			headerDiv.scrollLeft=(headerDiv.scrollWidth-headerDiv.clientWidth)*power;
			
		};
		dataGridOuterDiv.scrollLeft=(dataGridOuterDiv.scrollWidth-dataGridOuterDiv.clientWidth)*power;
		if(footerGridOuterDiv!=null){
			footerGridOuterDiv.scrollLeft=(footerGridOuterDiv.scrollWidth-footerGridOuterDiv.clientWidth)*power;
			
		};
		scrollBar._outlineTable._$afterScroll();
		
	}finally{
		setTimeout("$(\""+table.id+"\")._scrolling = false;",0);
		
	}
};
function _$Table_onScroll(table){
	with(table){
		if(!_scrolling){
			if(_scrollMode==__Table_SCROLLMODE_SIMPLE){
				if(_vScrollBar!=null)_vScrollBar.setPosition(_dataGridOuterDiv.scrollTop);
				
			};
			if(_hScrollBar!=null)_hScrollBar.setPosition(_dataGridOuterDiv.scrollLeft);
			
		}
	}
};
function _$Table_getColumnSplitSlider(){
	if(__Header_ColumnSplitSlider==null){
		var div=$$("DIV");
		document.body.appendChild(div);
		_$setElementStyle(div,"ColumnSplitSlider");
		div.style.borderTopStyle="none";
		div.style.borderBottomStyle="none";
		_$setVisible(div,false);
		div._resizingCell=null;
		__Header_ColumnSplitSlider=div;
		
	};
	return __Header_ColumnSplitSlider;
	
};
function _$Table_setColumnWidth(column,width){
	with(this){
		var modifyCol=null;
		if(!_showHScrollBar){
			
			var columns=new Array();
			if(_fixedDataGrid!=null){
				columns=columns.concat(_fixedDataGrid._columns);
				
			};
			columns=columns.concat(_dataGrid._columns);
			var index=columns.indexOf(column);
			if(index>=0){
				if(index==columns.length-1){
					if(index>=0){
						modifyCol=columns[index-1];
						
					}
				}else {
					modifyCol=columns[index+1];
					
				}
			};
			var margin=width-column._width;
			if(modifyCol!=null){
				if(modifyCol._width-margin<5){
					margin=modifyCol._width-5;
					
				};
				modifyCol._width=modifyCol._width-margin;
				
			};
			column._width=column._width+margin;
			
		}else {
			column._width=width;
			
		};
		if(_fixedHeaderGrid!=null){
			_fixedHeaderGrid.setColumnWidth(column,column._width);
			if(modifyCol!=null){
				_fixedHeaderGrid.setColumnWidth(modifyCol,modifyCol._width);
				
			}
		};
		if(_fixedDataGrid!=null){
			_fixedDataGrid.setColumnWidth(column,column._width);
			if(modifyCol!=null){
				_fixedDataGrid.setColumnWidth(modifyCol,modifyCol._width);
				
			}
		};
		if(_fixedFooterGrid!=null){
			_fixedFooterGrid.setColumnWidth(column,column._width);
			if(modifyCol!=null){
				_fixedFooterGrid.setColumnWidth(modifyCol,modifyCol._width);
				
			}
		};
		if(_headerGrid!=null){
			_headerGrid.setColumnWidth(column,column._width);
			if(modifyCol!=null){
				_headerGrid.setColumnWidth(modifyCol,modifyCol._width);
				
			}
			
		};
		_dataGrid.setColumnWidth(column,column._width);
		if(modifyCol!=null){
			_dataGrid.setColumnWidth(modifyCol,modifyCol._width);
			
		};
		if(_footerGrid!=null){
			_footerGrid.setColumnWidth(column,column._width);
			if(modifyCol!=null){
				_footerGrid.setColumnWidth(modifyCol,modifyCol._width);
				
			}
		};
		_$setFixedPartHeight();
		_$setFixedPartWidth();
		_$setFloatingPartSize();
		_$refreshScrollBar();
		setTimeout("var table = $(\""+id+"\");"+"if (table != null) table._$refreshScrollBar()",0);
		
	}
};
function _$Table_getColumnDraggingCursor(movingCell){	//�����϶�ʱ��ʾ�Ļ��ͷ//
	var table=__Header_ColumnDraggingCursor;
	if(table==null){
		var table=$$("TABLE");
		var tbody=$$("TBODY");
		var row=$$("TR");
		var cell=$$("TD");
		_$setElementStyle(table,"ColumnDraggingCursor");
		table.cellPadding=0;
		table.cellSpacing=0;
		_$setVisible(table,false);
		cell.align="center";
		cell.vAlign="middle";
		row.appendChild(cell);
		tbody.appendChild(row);
		table.appendChild(tbody);
		document.body.appendChild(table);
		table._activeCell=cell;
		table._movingCell=null;
		__Header_ColumnDraggingCursor=table;
		
	};
	if(movingCell!=null&&table._movingCell==null){
		var cell=table._activeCell;
		for(var i=cell.childNodes.length-1;i>=0;i--){
			cell.removeChild(cell.childNodes[i]);
			
		};
		table.style.width=movingCell.offsetWidth;
		table.style.height=movingCell.offsetHeight;
		var activeCellContent=movingCell.cloneNode(true);
		activeCellContent.style.backgroundImage="none";
		cell.appendChild(activeCellContent);		
		table._movingCell=movingCell;
		
	};
	return table;
	
};
function _$Table_getColumnDraggingAnchorPoint(){			//��ͷ�϶�ʱ��ʾ�Ķ�λ��
	var image=__Header_ColumnDraggingAnchorPoint;
	if(image==null){
		var image=$$("IMG");
		_$setElementImage(image,__SKIN_PATH+"/datatable/column_drop_cursor.gif");
		image.style.zIndex=_$autoGenIndex();
		image.style.position="absolute";
		_$setVisible(image,false);
		document.body.appendChild(image);
		__Header_ColumnDraggingAnchorPoint=image;
		
	};
	return image;
	
};
function _$Table_setColumnIndex(column,index){
	function _$columnResort(columns,oldColIndex,newColIndex){
		var m,n,shift;
		if(oldColIndex>newColIndex){
			m=newColIndex;
			n=oldColIndex;
			shift="left";
			
		}else {
			m=oldColIndex;
			n=newColIndex;
			shift="right";
			
		};
		var temp=new Array();
		var size=columns.size();
		for(var i=0;i<size;i++){
			temp.push(columns.get(i));
			
		};
		if(shift=="left"){
			var tmp=temp[n];
			for(var i=n-1;i>=m;i--){
				temp[i+1]=temp[i];
				
			};
			temp[m]=tmp;
			
		}else {
			var tmp=temp[m];
			for(var i=m+1;i<=n;i++){
				temp[i-1]=temp[i];
				
			};
			temp[n]=tmp;
			
		};
		columns.clear();		
		for(var i=0;i<size;i++){
			var column=temp[i];
			columns.put(column.getName().toLowerCase(),column);
			
		}
	};
	with(this){
		var oldColIndex=_columns.indexOf(column.getName().toLowerCase());
		var newColIndex=((index>oldColIndex)?index-1:index);
		if(oldColIndex==newColIndex)return ;
		
		_$columnResort(_columns,oldColIndex,newColIndex);
		
		var isChgFixedColumn=(oldColIndex<_fixedColumnCount||newColIndex<_fixedColumnCount);
		var isChgFloatColumn=(oldColIndex>=_fixedColumnCount||newColIndex>=_fixedColumnCount);
		var dataset=this._dataset;
		if(isChgFixedColumn){
			if(_fixedHeaderGrid!=null){
				_fixedHeaderGrid.refresh(dataset);
				
			};
			if(_fixedDataGrid!=null){
				_fixedDataGrid._rowTemplet=null;
				_fixedDataGrid.refresh(dataset,true);
				_fixedDataGrid._$changeCurrentRow(dataset);
				
			};
			if(_fixedFooterGrid!=null){
				_fixedFooterGrid.refresh(dataset);
				
			}
		};
		if(isChgFloatColumn){
			if(_headerGrid!=null){
				_headerGrid.refresh(dataset);
				
			};
			if(_dataGrid!=null){
				_dataGrid._rowTemplet=null;
				_dataGrid.refresh(dataset,true);
				_dataGrid._$changeCurrentRow(dataset);
				
			};
			if(_footerGrid!=null){
				_footerGrid.refresh(dataset);
				
			}
		};
		_$setFixedPartHeight();
		_$setFixedPartWidth();
		_$setFloatingPartSize();
		_$refreshScrollBar();
		
	}
};
//�����Ԫ���б�����һ���֣��������ʹ֮��ȫ��ʾ
function _$Table_showIntactCurrentElement(){
	function _$showCoverElement(element,div,isCell){
		var absPos=_$getAbsolutePosition(element,div);
		var left=absPos[0];
		var top=absPos[1];
		var right=left+element.offsetWidth;		
		var bottom=top+element.offsetHeight;
		var scrollLeft=div.scrollLeft;
		var scrollTop=div.scrollTop;
		var elementRight=scrollLeft+div.clientWidth;
		var sourceTop=scrollTop+div.clientHeight;
		if(top<scrollTop){
			div.scrollTop=top;
			
		}else if(bottom>sourceTop){
			div.scrollTop=div.scrollTop+(bottom-sourceTop);
			
		};
		if(isCell){
			if(left<scrollLeft){
				div.scrollLeft=left;
				
			}else if(right>elementRight){
				div.scrollLeft=div.scrollLeft+(right-elementRight);
				
			}
		}
	};
	if(this._fixedDataGrid!=null){
		var cell=this._currentCell;
		var row=this._fixedDataGrid._currentRow;
		if(row){
			if(cell!=null&&cell.parentNode==row){
				_$showCoverElement(cell,this._fixedDataGridOuterDiv,true);
				
			}else {
				_$showCoverElement(row,this._fixedDataGridOuterDiv);
				
			}
		}
	};
	if(this._dataGrid!=null){
		var row=this._dataGrid._currentRow;
		if(row){
			if(cell!=null&&cell.parentNode==row){
				_$showCoverElement(cell,this._dataGridOuterDiv,true);
				
			}else {
				_$showCoverElement(row,this._dataGridOuterDiv);
				
			}
		};
		if(browserType==__Browser_OTHER&&this._scrollMode==__Table_SCROLLMODE_SIMPLE){
			if(this._vScrollBar!=null){
				this._scrolling=true;
				this._vScrollBar.setPosition(this._dataGridOuterDiv.scrollTop);
				this._scrolling=false;
				
			}
		}
	}
};
function _$Table_showCoverPart(){
	setTimeout("var table = $(\""+this.id+"\");"+"if (table != null) table._$showIntactCurrentElement()",0);
	
};
function _$Table_isEditing(column){		//����е�����Ƿ��ܹ��༭//
	if(this._readOnly||!this._editable||column._readOnly){
		return false;
		
	};
	var dataset=this._dataset;
	if(dataset==null||dataset._readOnly||dataset._current==null){
		return false;
		
	};
	var field=dataset.getField(column._field);
	if(field==null||field._readOnly||
			(field._valueProtected&&dataset._current._state!=__Record_STATE_NEW&&dataset._current._state!=__Record_STATE_INSERT)||
			((dataset._current._state==__Record_STATE_NEW||dataset._current._state==__Record_STATE_INSERT)&&!field._inputForInsert)||
			((dataset._current._state==__Record_STATE_NONE||dataset._current._state==__Record_STATE_MODIFY)&&(!field._inputForUpdate||(!dataset._current.isCanUpdate() && field._name!="select") || (!dataset._current.isCanSelect() && field._name=="select")))){

		return false;
		
	};
	return true;
	
};
function _$Table_setCurrentColumn(column){
	this._$hideCellEditor();
	if(typeof(column)=="number"){
		column=this.getColumn(column);
		
	}else if(typeof(column)=="string"){
		column=this.getColumn(column);
		
	};
	if(column==null)return ;
	var cell=this._$getCurrentCell(column);
	this._currentCell=cell;
	this._$showCoverPart();
	if(cell!=null){
		if(this._hasFocus&&this._$isEditing(column)){
			this._$do_showCellEditor();
			
		}else {
			var label=cell.firstChild;
			var ele=label.firstChild;
			if(ele!=null&&ele.focus&&!ele.disabled){
				ele.focus();
				
			}else {
				_$processActiveElementChanged(this);
				
			}
		}
	}
};
function _$Table_getCurrentCell(column){
	var cell;	
	if(this._fixedDataGrid!=null){
		cell=this._fixedDataGrid._$getCurrentRowSpecificCell(column);
		
	};
	if(cell==null){
		cell=this._dataGrid._$getCurrentRowSpecificCell(column);
		
	};
	return cell;
	
};
function _$Table_getCellEditor(cell){
	var column=cell._column;
	var editorType=column._editorType;
	var editor=this._cellEditorMap.get(column._name);
	if(editor==null){
		editor=_$buildCellEditor("record",editorType);
		editor._outlineTable=this;
		editor.setDataset(this._dataset);
		editor.setField(column._field);
		if(typeof(editor.setDropDown)=="function"){
			editor.setDropDown(column.getDropDown());
			
		};
		editor.style.position="absolute";
		_$setDisplay(editor,false);
		editor.activate();
		document.body.appendChild(editor);
		this._cellEditorMap.put(column._name,editor);
		
	};
	if(column._onGetCellEditor!=null){
		editor=_$fireKingfisherEvent(column,"onGetCellEditor",[column,cell,editor,cell.parentNode._record]);
		
	};
	if(editor!=null){
		editor._kingfisherClass="CellEditor";
		
		if(editor._$oldOnFocus==null){
			editor._$oldOnFocus=editor.onFocus;
			
		};
		editor.onFocus=_$CellEditor_onFocus;
		if(column._onCellEditorFocus!=null)
			editor._onFocus=column._onCellEditorFocus;
		
		if(editor._$oldOnBlur==null){
			editor._$oldOnBlur=editor.onBlur;
			
		};
		editor.onBlur=_$CellEditor_onBlur;
		if(column._onCellEditorBlur!=null)
			editor._onBlur=column._onCellEditorBlur;
			
		if(editor._$oldOnKeyDown==null){
			editor._$oldOnKeyDown=editor.onKeyDown;
			
		};
		editor._$onKeyDown=null;
		editor.onKeyDown=_$CellEditor_onKeyDown;
		if(column._onCellEditorKeyDown!=null)
			editor._onKeyDown=column._onCellEditorKeyDown;
		
	};
	return editor;
	
};
function _$Table_hideCellEditor(){
	var editor=this._activeEditor;
	if(editor!=null){
		editor.onBlur();
		setTimeout("_$setDisplay($(\""+editor.id+"\"), false);",0);
		editor._activeCell=null;
		
	};
	this._activeEditor=null;
	
};
function _$Table_showCellEditor(){
	var cell=this._currentCell;
	var editor=null;
	if(cell!=null&&cell._column!=null){
		editor=this._$getCellEditor(cell);
		
	};
	if(editor!=null){
		editor._activeCell=cell;
		editor.setRecord(this._dataset._current);
		editor.refresh();
		editor.style.zIndex=_$autoGenIndex()+989;
		_$setDisplay(editor,true);
		this._$sizeCellEditor(editor);
		var isActiveEditor=(__Current_ActiveEditor==editor);
		editor.focus();
		if(editor.select){
			setTimeout("$(\""+editor.id+"\").select();",0);
			
		};
		if(isActiveEditor){
			editor.onFocus();
			
		}
	};
	this._activeEditor=editor;
	
};
function _$Table_do_showCellEditor(){
	setTimeout("var table = $(\""+this.id+"\");"+"if (table != null) table._$showCellEditor()",0);
	
};
function _$Table_sizeCellEditor(editor){
	var cell=null;
	if(editor!=null)cell=editor._activeCell;
	if(cell!=null){
		var absPos=_$getAbsolutePosition(cell);
		if(browserType==__Browser_IE){
			editor.style.left=absPos[0];
			editor.style.top=absPos[1];
			
		}else {
			if(editor.type=="checkbox"){
				editor.style.left=absPos[0]-5;
				editor.style.top=absPos[1]-4;				
				
			}else {
				editor.style.left=absPos[0]-1;
				editor.style.top=absPos[1]-1;
				
			}
		};
		var width=cell.offsetWidth+1;
		var height=cell.offsetHeight+1;
		if(editor._defaultWidth>0&&width<editor._defaultWidth)width=editor._defaultWidth;
		if(editor._defaultHeight>0&&height<editor._defaultHeight)height=editor._defaultHeight;
		editor.style.width=width;
		editor.style.height=height;
		editor._$sizeDropDownBtn();
		
	}
};
function _$Table_afterScroll(){
	this._$sizeCellEditor(this._activeEditor);
	
};
function _$Table_onFocus(){
	_$Element_onFocus(this);
	var objectArray=this._columns._objectArray;
	for(var i=0;i<objectArray.length;i++){
		var column=objectArray[i];
		if(column._visible&&!column._readOnly){
			this.setCurrentColumn(column);
			break;
			
		}
	}
};
function _$Table_onMouseDown(dataGrid){
	var table=dataGrid._outlineTable;
	_$Element_onFocus(table);
	
	var targ;
	if(browserType==__Browser_IE){
		targ=event.srcElement;
		
	}else {
		targ=event.target;
		targ.style.MozUserSelect="none";
		
	};
	targ=_$getKingfisherElement(targ,"DataCell");
	if(targ!=null){
		var cell=targ;
		var row=cell.parentNode;
		var record=row._record;
		if(record!=null){
	
			var dataset=table._dataset;			
			var multiSelectRecords=dataset._multiSelectRecords;
			//�ж��Ƿ��ѡ
			if((event.ctrlKey||multiSelectRecords.findElement(record))&&table._multiSelect==true)
				table._hasMultiSelect=true;
			else{
				table._hasMultiSelect=false;
				if(multiSelectRecords.size()>0){
					multiSelectRecords.clear();
					table.refresh();
				}
			}

			if(!record.$2z){
				dataset.setCurrent(record);
				
			}else {
				var row1=0,row2=0;
				var tbody=dataGrid._tbody;
				for(var i=0;i<tbody.childNodes.length;i++){
					var visibleRow=tbody.childNodes[i];
					if(visibleRow._record==dataset._current){
						row1=i;
						
					}else if(visibleRow._record==record){
						row2=i;
						
					}
				};
				dataset._halfPage=parseInt(table._$getPageSpanRowNumber()/2);
				table._$move(row2-row1);
				
			};
			dataGrid._outlineTable.setCurrentColumn(cell._column);
			
		}
	}
};
function _$Table_onRecordClick(dataGrid){
	var targ=_$getKingfisherElement(_$getEventTarget(),"DataCell");
	if(targ!=null){
		_$fireKingfisherEvent(dataGrid._outlineTable,"onRecordClick",[dataGrid._outlineTable,targ,targ._column]);
		
	}
};
function _$Table_onRecordDblClick(dataGrid){
	var targ=_$getKingfisherElement(_$getEventTarget(),"DataCell");
	if(targ!=null){
		_$fireKingfisherEvent(dataGrid._outlineTable,"onRecordDblClick",[dataGrid._outlineTable,targ,targ._column]);
		
	}
};
function _$Table_onMouseWheel(table){
	__Mouse_Wheel_Trigger=true;
	var dataset=table._dataset;
	var column=(table._currentCell!=null)?table._currentCell._column:null;	
	var order=0;
	if(event.wheelDelta>=120){
		table._$hideCellEditor();
		if(!dataset.isFirst()){
			order=-1;
			table._$move(order);
			if(column)table.setCurrentColumn(column);
			
		}
	}else if(event.wheelDelta<=-120){
		table._$hideCellEditor();
		if(!dataset.isLast()){
			order=1;
			table._$move(order);
			if(column)table.setCurrentColumn(column);
			
		}
	};
	if(order!=0){
		table.processDatasetMessage(__Dataset_MSG_CURRENT_CHANGED,dataset,[dataset._current]);
		
	};
	return (order==0);
	
};
function _$Table_showPropertiesWindow(){
	if(!this._supportsPropertiesWindow)return ;
	var viewModel=this._viewModel;
	var subWindow=this._propertiesWindow;
	if(subWindow==null){
		var namespace=viewModel._namespace;
		subWindow=KingfisherFactory.create("SubWindow",namespace,this._originId+"_PropertiesWindow");
		subWindow.setShowMenuButton(false);
		subWindow.setShowMinimizeButton(false);
		subWindow.setShowMaximizeButton(false);
		subWindow.setShowCloseButton(true);
		subWindow.style.position="absolute";
//		subWindow.style.width=220;
		subWindow.style.width=320;//add by chw
		subWindow.style.height=230;
		var offsetElement=this._fixedDataGrid;
		if(offsetElement==null){
			offsetElement=this._dataGrid;
			
		};
		var absPos=_$getAbsolutePosition(offsetElement);
		subWindow.style.left=absPos[0]+2;
		subWindow.style.top=absPos[1]-8;
		subWindow.setTitle(__DATATABLE_PROPERTIES_TITLE);
		subWindow.activate();
		div=$$("DIV");
		div.style.width="100%";
		div.style.height="100%";		
		var html="<TABLE cellPadding=\"0\" cellSpacing=\"1\" style=\"width: 100%; height: 100%\">"+"<TR style=\"height: 100%\"><TD>"+"<DIV id=\""+subWindow.id+"_PropertiesTable\" style=\"width: 100%; height: 100%;\"></DIV>"+"</TD></TR>"+"<TR><TD align=\"right\">"+"<TABLE style=\"width: 100%\" cellPadding=\"0\" cellSpacing=\"0\"><TR><TD noWrap>"+"&nbsp;"+__DATATABLE_FIXED_COLUMN+"</TD><TD>"+"<INPUT id=\""+subWindow.id+"_LockNumber\" type=\"text\" size=\"4\">"+"</TD><TD noWrap>"+"&nbsp;"+__DATATABLE_PAGE_SIZE+"</TD><TD>"+"<INPUT id=\""+subWindow.id+"_PageSizeNumber\" type=\"text\" size=\"4\">"+"</TD><TD width=\"100%\" align=\"right\">"+"<BUTTON id=\""+subWindow.id+"_BtnOK\" style=\"width: 80\">OK</BUTTON>"+"</TD></TR></TABLE></TD><TR></TABLE>";
		div.innerHTML=html;
		subWindow.getContentContainer().appendChild(div);
		document.body.appendChild(subWindow);
		var dataset=KingfisherFactory.create("Dataset",null,subWindow.id+"_PropertiesDataset");
		with(dataset){
			var field;
			field=addField("select","boolean");
			field=addField("label","string");
			field.setLabel(__DATATABLE_PROPERTIES_LABEL);
			field=addField("name","string");
			field.setLabel(__DATATABLE_PROPERTIES_NAME);
			//add by chw
			field=addField("align","string");
			field.setLabel(__DATATABLE_PROPERTIES_ALIGN);
			
			var pagesizeSelect=KingfisherFactory.create("ListDropDown",null,null);
			pagesizeSelect.setMapValue(false);
			pagesizeSelect.setAutoDropDown(true);
			var dropdownList2=pagesizeSelect.getDataset();
			dropdownList2.moveLast();
			while(!dropdownList2.isFirst()){
				dropdownList2.deleteRecord();
				
			};
			var __PAGE_SIZE_ARRAY1 = new Array();
			__PAGE_SIZE_ARRAY1.push("����");
			__PAGE_SIZE_ARRAY1.push("����");
			__PAGE_SIZE_ARRAY1.push("����");
			for(var m=0;m<__PAGE_SIZE_ARRAY1.length;m++){
				dropdownList2.insertRecord();
				dropdownList2.setValue("value",__PAGE_SIZE_ARRAY1[m]);
				dropdownList2.postRecord();			
				
			};
			dropdownList2.moveFirst();
			field.setDropDown(pagesizeSelect);
		};
		var fieldList=KingfisherFactory.create("DataTable",null,subWindow.id+"_PropertiesTable");
		with(fieldList){
			setShowIndicator(false);
			setShowHScrollBar(false);
			setDataset(dataset);
			var column;
			column=addColumn("select");
			column=addColumn("label");
			column=addColumn("name");
			column.setReadOnly(true);
			column=addColumn("align");
			activate();
			
		};
		var lockupSelect=KingfisherFactory.create("ListDropDown",null,null);
		lockupSelect.setMapValue(false);
		lockupSelect.setAutoDropDown(true);
		var dropdownList=lockupSelect.getDataset();
		dropdownList.moveLast();
		while(!dropdownList.isFirst()){
			dropdownList.deleteRecord();
			
		};
		var columnCount=this._columns.size();
		for(var i=0;i<columnCount;i++){
			dropdownList.insertRecord();
			dropdownList.setValue("value",i);
			dropdownList.postRecord();			
			
		};
		dropdownList.moveFirst();
		var lockupNum=KingfisherFactory.create("TextEditor",null,subWindow.id+"_LockNumber");
		lockupNum.setDropDown(lockupSelect);
		
		//add by chw start
		var pagesizeSelect=KingfisherFactory.create("ListDropDown",null,null);
		pagesizeSelect.setMapValue(false);
		pagesizeSelect.setAutoDropDown(true);
		var dropdownList1=pagesizeSelect.getDataset();
		dropdownList1.moveLast();
		while(!dropdownList1.isFirst()){
			dropdownList1.deleteRecord();
			
		};
		var __PAGE_SIZE_ARRAY = new Array();
		__PAGE_SIZE_ARRAY.push(20);
		__PAGE_SIZE_ARRAY.push(30);
		__PAGE_SIZE_ARRAY.push(50);
		__PAGE_SIZE_ARRAY.push(100);
		for(var i=0;i<__PAGE_SIZE_ARRAY.length;i++){
			dropdownList1.insertRecord();
			dropdownList1.setValue("value",__PAGE_SIZE_ARRAY[i]);
			dropdownList1.postRecord();			
			
		};
		dropdownList1.moveFirst();
		var pagesizeNum=KingfisherFactory.create("TextEditor",null,subWindow.id+"_PageSizeNumber");
		pagesizeNum.setDropDown(pagesizeSelect);
		//add by chw end
		
		var btnOK=KingfisherFactory.create("Button",null,subWindow.id+"_BtnOK");
		var table=this;
		EventManager.addSystemEvent(btnOK,"onclick",function (){
			_$Table$Properties$Button_onClick(table);
			
		});
		subWindow._outlineTable=this;
		this._propertiesWindow=subWindow;
		
	}else {
		subWindow.setStatus(__SubWindow_STATUS_NORMAL);
		
	};
	var editor=kingfisher.feather.getControl(subWindow.id+"_LockNumber");
	editor.value=this._fixedColumnCount;
	editor.disabled=(this._fixedColumnCount==0&&!this._showIndicator);
	//add by chw start
	var editor1=kingfisher.feather.getControl(subWindow.id+"_PageSizeNumber");
	editor1.value = this.getDataset().getPageSize();
	editor1.setEnabled(this.getDataset().getPageSize() != 0);
	//add by chw end
	var dataset=kingfisher.feather.getDataset(subWindow.id+"_PropertiesDataset");
	dataset.disableControls();
	try{
		dataset.moveLast();
		while(!dataset.isFirst()){
			dataset.deleteRecord();
			
		};
		var columns=this._columns;
		var columnCount=columns.size();
		for(var i=0;i<columnCount;i++){
			var column=columns.get(i);
			if(column.getType() == 'group'){
				dataset.insertRecord();
				dataset.setValue("select",column.isVisible());
				var name=column._name;
				dataset.setValue("name",name);
				var label=column._label;
				if(!label&&column._field){
					var field=this._dataset.getField(column._field);
					if(field!=null){
						label=field._label;
						
					}
				};
				label = label.replace('\r','\\r');
				label = label.replace('\n','\\n');
				dataset.setValue("label",label);
				//dataset.setValue("align",column.getAlign());
				dataset.postRecord();
				for(var j=0;j<column.getColumnCount();j++){
					var __column = column.getColumn(j);
					dataset.insertRecord();
					dataset.setValue("select",__column.isVisible());
					var __name=__column._name;
					dataset.setValue("name",__name);
					var __label=__column._label;
					if(!__label&&__column._field){
						var __field=this._dataset.getField(__column._field);
						if(__field!=null){
							__label=__field._label;
							
						}
					};
					__label = __label.replace('\r','\\r');
					__label = __label.replace('\n','\\n');
					dataset.setValue("label",__label);
					dataset.setValue("align",__column.getAlign()=='left'?'����':(__column.getAlign()=='center'?'����':'����'));
					dataset.postRecord();
				}
			}
			else{
				dataset.insertRecord();
				dataset.setValue("select",column.isVisible());
				var name=column._name;
				dataset.setValue("name",name);
				var label=column._label;
				if(!label&&column._field){
					var field=this._dataset.getField(column._field);
					if(field!=null){
						label=field._label;
						
					}
				};
				label = label.replace('\r','\\r');
				label = label.replace('\n','\\n');
				dataset.setValue("label",label);
				dataset.setValue("align",column.getAlign()=='left'?'����':(column.getAlign()=='center'?'����':'����'));
				dataset.postRecord();
			}
		};
		dataset.moveFirst();
		
	}finally{
		dataset.enableControls();
		dataset.refreshControls();
		
	}
	
};
function _$Table$Properties$Button_onClick(table){
	//add by chw start
	var __found = false;
	var __align_changed = false;
	var __pagesize_changed = false;
	//add by chw end
	var subWindow=table._propertiesWindow;
	if(subWindow==null)return ;
	var editor=kingfisher.feather.getControl(subWindow.id+"_LockNumber");
	var num=parseInt(editor.value);
	//add by chw start
	if(num != table.getFixedColumn()){
		__USER_CHANGED_DT.add(table.getId());
	}
	table.setFixedColumn((num>=0)?num:0);
	editor = kingfisher.feather.getControl(subWindow.id+"_PageSizeNumber");
	num = parseInt(editor.value);
	if(num != table.getDataset().getPageSize()){
		__pagesize_changed = true;
		__USER_CHANGED_DT.add(table.getId());
	}
	table.getDataset().setPageSize(num);
	//add by chw end
	var dataset=kingfisher.feather.getDataset(subWindow.id+"_PropertiesDataset");
	dataset.postRecord();
	dataset.disableControls();
	try{
		dataset.moveFirst();
		while(!dataset.isLast()){
			var name=dataset.getValue("name");
			var column = table.getColumn(name);
			if(!column){
				for(var i=0;i<table.getColumnCount();i++){
					var _column = table.getColumn(i);
					if(_column.getType() == 'group'){
						column = _column.getColumn(name);
						if(column)
							break;
					}
				}
			}
			if(column!=null){
				//add by chw start
				if(!__found){
					if(column.isVisible() != dataset.getValue("select")){
						__USER_CHANGED_DT.add(table.getId());
						__found = true;
					}else{
						if(column.getType() != 'group'){
							if(column.getAlign() != dataset.getValue('align')){
								__USER_CHANGED_DT.add(table.getId());
								__align_changed = true;
								__found = true;
							}
						}
						if(column.getLabel()){
							if(column.getLabel() != dataset.getValue("label")){
								__USER_CHANGED_DT.add(table.getId());
								__found = true;
							}
						}
						else if(table.getDataset().getField(column.getField()).getLabel() != dataset.getValue("label")){
							__USER_CHANGED_DT.add(table.getId());
							__found = true;
						}
					}
				}
				//add by chw end
				column.setVisible(dataset.getValue("select"));
				var __TMP_LABEL = dataset.getValue("label");
				__TMP_LABEL = __TMP_LABEL.replace('\\r','\r');
				__TMP_LABEL = __TMP_LABEL.replace('\\n','\n');
				column.setLabel(__TMP_LABEL);
				if(column.getType() != 'group'){
					column.setAlign(dataset.getValue("align") == '����'?'left':
						(dataset.getValue("align") == '����'?'center':'right'));//add by chw
				}
			};
			dataset.moveNext();
			
		}
	}finally{
		dataset.enableControls();
		dataset.refreshControls();
	};
	if(__align_changed)//������ı䣬��Ҫrebuild
		table.rebuild();//add by chw
	table.refresh();
	if(__pagesize_changed){//���ÿҳ����ı�,��������ҳ�Ĳ�ѯ����
		//��ȡURL����
		var __str=window.location.href;
		var __num=__str.indexOf("?")
		__str=__str.substr(__num+1);
		var __arrtmp=__str.split("&");
		var __tmp_map = new Map();
		for(n=0;n < __arrtmp.length;n++){
			__num=__arrtmp[n].indexOf("=");
			if(__num>0){
				__tmp_map.put(__arrtmp[n].substring(0,__num),__arrtmp[n].substr(__num+1));
			}
		}
		var __param_window = parent.frames['tab_param_'
              +__tmp_map.get('ModuleID')+'_'+__tmp_map.get('ActionID')];
		if(__param_window.paramSearch){
			__param_window.paramSearch();
		}else if(__param_window.btnClick){
			__param_window.btnClick();
		}
	}
	subWindow.setStatus(__SubWindow_STATUS_HIDDEN);
};


function _$parseViewProperties(xmlRoot,properties){
	var viewPropsNode,propertyNodes;
	if(browserType==__Browser_IE){
		viewPropsNode=xmlRoot.selectSingleNode("viewproperties");
		propertyNodes=viewPropsNode.childNodes;
		
	}else {
		viewPropsNode=xmlRoot.getElementsByTagName("viewproperties")[0];
		propertyNodes=viewPropsNode.getElementsByTagName("p");
		
	};
	for(var i=0;i<propertyNodes.length;i++){
		var propertyNode=propertyNodes.item(i);
		var name=propertyNode.getAttribute("name");
		properties.setValue(name,unescape(propertyNode.getAttribute("value")));		
		properties.setDataType(name,parseInt(propertyNode.getAttribute("datatype")));
		
	}
};
Date.prototype.toString =function (){
	return this.getTime()+"";
	
};
function Command(){
	this._disabled=false;
	
};
Command.prototype=new KingfisherComponent();
Command.prototype.isDisabled=function (){
	return this._disabled;
	
};
Command.prototype.setDisabled=function (disabled){
	this._disabled=disabled;
	
};
Command.prototype._$fireBeforeExecute=function (){
	var result=_$fireKingfisherEvent(this,"beforeExecute",[this]);
	if (result) throw result;
//	if(typeof(result)!="undefined"){
//		throw result;
		
//	}
};
Command.prototype._$fireOnSuccess=function (){
	var result=_$fireKingfisherEvent(this,"onSuccess",[this]);
	if(typeof(result)=="undefined"){
		return true;
		
	}else {
		return result;
		
	}
};
Command.prototype._$fireOnFailure=function (){
	var result=_$fireKingfisherEvent(this,"onFailure",[this]);
	if(typeof(result)=="undefined"){
		return true;
		
	}else {
		return result;
		
	}
};
function CommandQueue(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._commands=new Collection();
	
};
CommandQueue.prototype=new Command();
KingfisherFactory._$registerComponentType("CommandQueue",function (id,viewModel){
	return new CommandQueue(id,viewModel);
	
});
CommandQueue.prototype.addCommand=function (command){
	this._commands.insert(command);
	
};
CommandQueue.prototype.getCommands=function (){
	return this._commands;
	
};
CommandQueue.prototype.execute=function (){
	if(this._disabled){
		alert("Command \""+this.id+"\" is disabled!");
		return ;
		
	};
	try{
		this._$fireBeforeExecute();
		var succeed=true;
		var element=this._commands._first;
		while(element!=null){
			var command=element._data;
			if(!command.execute()){
				succeed=false;
				break;
				
			}
		};
		if(succeed){
			this._$fireOnSuccess();
			
		};
		return succeed;
		
	}catch(e){
		if(this._$fireOnFailure()){
			_$processException(e);
			
		};
		return false;
		
	}
};
var __Frame_TARGET_SELF="_self";
var __Frame_TARGET_BLANK="_blank";
var __Frame_TARGET_PARENT="_parent";
var __Frame_TARGET_TOP="_top";
var __Frame_TARGET_MODAL_DIALOG="_modal_dialog";
var __Frame_TARGET_MODELESS_DIALOG="_modeless_dialog";
var __Frame_TARGET_SUBWINDOW="_subwindow";
var __Frame_TARGET_EXCLUSIVE_SUBWINDOW="_exclusive_subwindow";
function Frame(){
	this._target=__Frame_TARGET_SELF;
	this._left=0;
	this._top=0;
	this._width=0;
	this._height=0;
	this._center=true;
	this._resizable=false;
	this._statusbar=false;
	this._scroll = false;
	
};
Frame.prototype.getTarget=function (){
	return this._target;
	
};
Frame.prototype.setTarget=function (targ){
	this._target=targ;
	
};
Frame.prototype.getLeft=function (){
	return this._left;
	
};
Frame.prototype.setLeft=function (left){
	this._left=left;
	
};
Frame.prototype.getTop=function (){
	return this._top;
	
};
Frame.prototype.setTop=function (top){
	this._top=top;
	
};
Frame.prototype.getWidth=function (){
	return this._width;
	
};
Frame.prototype.setWidth=function (width){
	this._width=width;
	
};
Frame.prototype.getHeight=function (){
	return this._height;
	
};
Frame.prototype.setHeight=function (height){
	this._height=height;
	
};
Frame.prototype.isCenter=function (){
	return this._center;
	
};
Frame.prototype.setCenter=function (center){
	this._center=center;
	
};
Frame.prototype.isResizable=function (){
	return this._resizable;
	
};
Frame.prototype.setResizable=function (resizable){
	this._resizable=resizable;	
	
};
Frame.prototype.isStatusbar=function (){
	return this._statusbar;
	
};
Frame.prototype.setStatusbar=function (statusbar){
	this._statusbar=statusbar;
	
};
Frame.prototype.isScroll = function() {
	return this._scroll;
};
Frame.prototype.setScroll = function(scroll) {
	this._scroll = scroll;
};
Frame.prototype._$getOpenWindowParams=function (){
	var top=this._top;
	var left=this._left;
	var width=this._width;
	var height=this._height;
	if(this._center){
		left=(window.screen.width-width)/2;
		top=(window.screen.height-height)/2;
		
	};
	var features="";
	features+="resizable="+(this._resizable?"yes":"no")+",";
	features+="scrollbars="+(this._scroll?"yes":"no")+",";
	features+="status="+(this._statusbar?"yes":"no")+",";
	features+="left="+left+",";
	features+="top="+top+",";
	if(width>0){
		features+="width="+width+",";
		
	};
	if(height>0){
		features+="height="+height+",";
		
	};
	return features;
	
};
Frame.prototype._$getDialogParams=function (){
	var features="";
	features+="resizable:"+((this._resizable)?"yes":"no")+";";
	features+="status:"+((this._statusbar)?"yes":"no")+";";
	features+="center:"+((this._center)?"yes":"no")+";";
	features+="scroll:" + ((this._scroll)?"1":"0") + ";";
	var top=this._top;
	var left=this._left;
	var width=this._width;
	var height=this._height;
	if(left>0){
		features+="dialogLeft:"+left+"px;";
		
	};
	if(top>0){
		features+="dialogTop:"+top+"px;";
		
	};
	if(width>0){
		features+="dialogWidth:"+width+"px;";
		
	}
	if(height>0){
		features+="dialogHeight:"+height+"px;";
		
	};
	return features;
	
};
function AbstractRequestCommand(){
	this._path=null;
	this._method="get";
	
};
AbstractRequestCommand.prototype=new Command();
AbstractRequestCommand.prototype.getPath=function (){
	return this._path;
	
};
AbstractRequestCommand.prototype.setPath=function (path){
	if ((path.length>0) && (path.substr(0,4)=='http'))
	{

	}
	else if(path.length>0&&path.charAt(0)=='/'){
		path=__CONTEXT_PATH+path;
		
	};
	
	this._path=path;
	
};
AbstractRequestCommand.prototype.getMethod=function (){
	return this._method;
	
};
AbstractRequestCommand.prototype.setMethod=function (method){
	this._method=method;
	
};
AbstractRequestCommand.prototype.getFrame=function (){
	return this._frame;
	
};
AbstractRequestCommand.prototype.parameters=function (){
	return this._parameters;
	
};
AbstractRequestCommand.prototype._$execute=function (commandParams,dialogParam){
	var result;
	var frame=this._frame;
	var targ=frame.getTarget();
	if(targ==__Frame_TARGET_SUBWINDOW){
		result=this._$showSubWindow(commandParams,frame);
		
	}else if(targ==__Frame_TARGET_EXCLUSIVE_SUBWINDOW){
		result=this._$showExclusiveSubWindow(commandParams,frame);
		
	}else if(targ==__Frame_TARGET_MODAL_DIALOG||targ==__Frame_TARGET_MODELESS_DIALOG){
		result=this._$showDialog(commandParams,frame,dialogParam);
		this._$fireOnSuccess();
		
	}else {
		this._$showOpenWindow(commandParams,frame);
		result=true;
		this._$fireOnSuccess();
		
	}
	return result;
	
};
AbstractRequestCommand.prototype.pathJoinParameter=function (commandParams, param2){
	var path=this._path;

	if ((path) && (path.length >= 4) && (path.substr(0,4) == 'http'))
	{
		return path;
	}

	if(path!=null){
		var i=path.indexOf("?");
		if(i<0){
			path+="?";
			
		}else if(i<(path.length-1)){
			path+="&";
			
		}
	};
	var size=commandParams.size();
	for(var i=0;i<size;i++){
		var param=commandParams.getParameter(i);
		path+=param._name+"="+_$encode(param._value)+"&";
		
	};
	if(!param2)
		path+="__x="+Math.random();
	return path;
	
};
AbstractRequestCommand.prototype._$postSubmit=function (commandParams,targ){
	var form=$$("FORM");
	form.action=this._path;
	form.method="post";
	form.targ=targ;
	var div=$$("DIV");
	var size=commandParams.size();
	for(var i=0;i<size;i++){
		var param=commandParams.getParameter(i);
		div.innerHTML="<INPUT name=\""+param._name+"\" type=\"hidden\">";
		var dateInput=div.firstChild;
		dateInput.value=param._value;
		div.removeChild(dateInput);
		form.appendChild(dateInput);
		
	};
	form.style.display="none";
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
	delete form;
	
};
AbstractRequestCommand.prototype._$showOpenWindow=function (commandParams,frame){
	if(this._method==null||this._method.toLowerCase()=="get"){
		var features=frame._$getOpenWindowParams();
		return window.open(this.pathJoinParameter(commandParams),frame.getTarget(),features);
		
	}else {
		return this._$postSubmit(commandParams,frame.getTarget());		
		
	}
};
AbstractRequestCommand.prototype._$showDialog=function (commandParams,frame,dialogParam){
	var features=frame._$getDialogParams();
	var path=this.pathJoinParameter(commandParams);
	if(frame.getTarget()==__Frame_TARGET_MODAL_DIALOG){
		return window.showModalDialog(path,dialogParam,features);
		
	}else {
		window.showModelessDialog(path,dialogParam,features);
		return true;
		
	}
};
AbstractRequestCommand.prototype._$showSubWindow=function (commandParams,frame){
	var subWindow=this._$createSubWindow();
	var windowContent=subWindow.getContentContainer().firstChild;
	var windowBody=windowContent.nextSibling;
	windowBody.style.display="";
	subWindow.style.top=frame.getTop();
	subWindow.style.left=frame.getLeft();
	var width=frame.getWidth();
	var height=frame.getHeight();
	if(width>0)subWindow.style.width=width;
	if(height>0)subWindow.style.height=height;
	var targ="__frame_"+subWindow.id;
	if(this._method==null||this._method.toLowerCase()=="get"){
		window.open(this.pathJoinParameter(commandParams),targ);
		
	}else {
		this._$postSubmit(commandParams,targ);
		
	};
	subWindow.show(false,frame.isCenter());
	this._$fireOnSuccess();
	
};
AbstractRequestCommand.prototype._$showExclusiveSubWindow=function (commandParams,frame){
	var subWindow=this._subwindow;
	if(subWindow==null){
		subWindow=this._$createSubWindow();
		this._subwindow=subWindow;
		
	};
	var windowContent=subWindow.getContentContainer().firstChild;
	var windowBody=windowContent.nextSibling;
	windowBody.style.display="";
	subWindow.style.top=frame.getTop();
	subWindow.style.left=frame.getLeft();
	subWindow.style.width=frame.getWidth();	
	subWindow.style.height=frame.getHeight();
	var targ="__frame_"+subWindow.id;
	if(this._method==null||this._method.toLowerCase()=="get"){
		window.open(this.pathJoinParameter(commandParams),targ);
		
	}else {
		this._$postSubmit(commandParams,targ);
		
	};
	subWindow.show(true,frame.isCenter());
	
};
AbstractRequestCommand.prototype._$createSubWindow=function (){
	var subWindow=KingfisherFactory.create("SubWindow",null,null,__SubWindow_STATUS_HIDDEN);
	subWindow.style.width=400;
	subWindow.style.height=300;
	subWindow.setShowMinimizeButton(false);
	subWindow.setShowMaximizeButton(false);
	subWindow.setShowCloseButton(true);
	subWindow.activate();
	var windowContainer=subWindow.getContentContainer();
	windowContainer.style.position="relative";
	windowContainer.innerHTML="<IFRAME name=\"__frame_"+subWindow.id+"\" "+"onload=\"setSubWindowTitle($('"+subWindow.id+"'));\" "+"frameBorder=\"0\" marginWidth=\"0\" marginHeight=\"0\" scrolling=\"no\" style=\"width: 100%; height: 100%\"></IFRAME>"+"<DIV style=\"left:0;top:0;width:100%;height:100%;position:absolute;background-color:white\">"+"<CENTER><TABLE style=\"height:100%\"><TR><TD><IMG src=\""+__SKIN_PATH+"/loading.gif\"></TD><TD>"+__LOADING_TIP+"</TD></TR></TABLE></CENTER></DIV>";
	subWindow.style.position="absolute";
	document.body.appendChild(subWindow);
	var command=this;
	EventManager.addKingfisherEvent(subWindow,"afterHide",function (subWindow){
		if(subWindow._exclusive){
			command._$fireOnSuccess();
			
		}else {
			subWindow.parentNode.removeChild(subWindow);
			subWindow.destroy();
			
		}
	});
	return subWindow;
	
};
function setSubWindowTitle(subWindow){
	var windowContent=subWindow.getContentContainer().firstChild;
	try{
		var windowContent=subWindow.getContentContainer().firstChild;
		var windowBody=windowContent.nextSibling;
		windowBody.style.display="none";
		var title=windowContent.contentWindow.document.title;
		if(!title){
			
			title=windowContent.contentWindow.location.href;
			
		};
		subWindow.setTitle(title);
		
	}catch(e){
		
	}
};


//RequestCommand����
function RequestCommand(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._dataset=null;
	this._parameterFields=null;
	this._frame=new Frame();
	this._parameters=new ParameterSet();
	
};
RequestCommand.prototype=new AbstractRequestCommand();
KingfisherFactory._$registerComponentType("RequestCommand",function (id,viewModel){
	return new RequestCommand(id,viewModel);
	
});
RequestCommand.prototype.destroy=function (){
	this._subwindow=null;
	
};
RequestCommand.prototype.getDataset=function (){
	return this._dataset;
	
};
RequestCommand.prototype.setDataset=function (dataset){
	this._dataset=kingfisher.feather.getDataset(dataset);
	
};
RequestCommand.prototype.getParameterFields=function (){
	return this._parameterFields;
	
};
RequestCommand.prototype.setParameterFields=function (parameterFields){
	this._parameterFields=parameterFields;
	
};
RequestCommand.prototype.execute=function (dialogParam){
	if(this._disabled){
		alert("Command \""+this.id+"\" is disabled!");
		return ;
		
	};
	try{
		this._$fireBeforeExecute();
		var commandParams=new ParameterSet();
		var dataset=this._dataset;		
		if(dataset!=null){
			var parameterFields=this._parameterFields;
			if(parameterFields!=null){
				var fields=parameterFields.split(",");
				for(var i=0;i<fields.length;i++){
					var value=dataset.getValue(fields[i]);
					if(value==null)value="";
					commandParams.setValue(fields[i],value);
					
				}
			}else {
				var fieldCount=dataset._fields.size();
				for(var i=0;i<fieldCount;i++){
					var field=dataset._fields.get(i);
					var value=dataset.getValue(i);
					if(value==null)value="";
					commandParams.setValue(field._name,value);
					
				}
			}
		};
		commandParams.assign(this._parameters);
		return this._$execute(commandParams,dialogParam);
		
	}catch(e){
		_$processException(e);
		
	}
};


//RPCCommand����//
function RPCCommand(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._action=null;
	this._method=null;
	this._async=false;
	this._showLoadingTip=__SHOW_LOADING_TIP;
	this._parameters=new ParameterSet();
	this._outParameters=new ParameterSet();
	
};
RPCCommand.prototype=new Command();
KingfisherFactory._$registerComponentType("RPCCommand",function (id,viewModel){
	return new RPCCommand(id,viewModel);
	
});
RPCCommand.prototype.getAction=function (){
	return this._action;
	
};
RPCCommand.prototype.setAction=function (action){
	if(action.length>0&&action.charAt(0)=='/'){
		
		action=__CONTEXT_PATH+action;
		
	};
	this._action=action;
	
};
RPCCommand.prototype.getMethod=function (){
	return this._method;
	
};
RPCCommand.prototype.setMethod=function (method){
	this._method=method;
	
};
RPCCommand.prototype.isShowLoadingTip=function (){
	return this._showLoadingTip;
	
};
RPCCommand.prototype.setShowLoadingTip=function (showLoadingTip){
	this._showLoadingTip=showLoadingTip;
	
};
RPCCommand.prototype.isAsync=function (){
	return this._async;
	
};
RPCCommand.prototype.setAsync=function (async){
	this._async=async;
	
};
RPCCommand.prototype.parameters=function (){
	return this._parameters;
	
};
RPCCommand.prototype.outParameters=function (){
	return this._outParameters;
	
};
RPCCommand.prototype.execute=function (asyncFunc){
	if(this._disabled){
		alert("Command \""+this.id+"\" is disabled!");
		return ;
		
	};
	try{
		this._outParameters.clear();
		this._$fireBeforeExecute();
		var xml=_$populateRPCXml(this);
		if(!this._async){
			var xmlDoc=_$remoteRequest(this._viewModel,this._action,"base",xml,this._showLoadingTip,this.id);
			if(xmlDoc!=null){
				return this._$processResult(xmlDoc);
				
			}
		}else {
			var command=this;
			_$asyncRequest(this._viewModel,this._action,"base",xml,this._showLoadingTip,this.id,function (asyncSucceed,xmlDoc){
				if(asyncSucceed){
					try{
						command._$fireOnSuccess();
						var result=command._$processResult(xmlDoc);
						if(asyncFunc!=null)asyncFunc(command,result);
						
					}catch(e){
						_$processException(e);
						
					};
				}
			});
			return true;
			
		}
	}catch(e){
		_$processException(e);
		
	};
	return false;
	
};
RPCCommand.prototype._$processResult=function (xmlDoc){
	try{
		var xmlRoot=xmlDoc.documentElement;
		if(xmlRoot!=null){
			var succeed=parseBoolean(xmlRoot.getAttribute("succeed"));
			if(succeed){
				_$parseRPCOutParameters(this._outParameters,xmlRoot);
				_$parseViewProperties(xmlRoot,this.getViewModel().properties());
				var message;
				if(browserType==__Browser_IE){
					var msgNode=xmlRoot.selectSingleNode("message");
					if(msgNode!=null)
						message=msgNode.text;
					
				}else {
					var msgNode=xmlRoot.getElementsByTagName("message")[0];
					if(msgNode!=null){
						var node=msgNode.firstChild;
						if(node!=null)message=node.nodeValue;
					}
					
				};
				if(this._$fireOnSuccess()){
					if(message){
						alert(unescape(message));
						
					}
				}
			}else {
				var message;
				if(browserType==__Browser_IE){
					var msgNode=xmlRoot.selectSingleNode("message");
					if(msgNode!=null)
						message=msgNode.text;
					
				}else {
					var msgNode=xmlRoot.getElementsByTagName("message")[0];
					if(msgNode!=null){
						var node=msgNode.firstChild;
						if(node!=null)message=node.nodeValue;
					}
					
				};
				if(this._$fireOnFailure()){
					alert(unescape(message));
					
				}
			};
			return succeed;
			
		}
	}catch(e){
		_$processException(e);
		
	}
};
function _$populateRPCXml(command){
	var xmlDoc,domDoc;
	if(browserType==__Browser_IE){
		
		xmlDoc=new ActiveXObject("Msxml.DOMDocument");
		domDoc=xmlDoc;
		
	}else {
		xmlDoc=$$("DOM");
		domDoc=document;
		
	};
	var rpcNode=domDoc.createElement("rpc");
	xmlDoc.appendChild(rpcNode);
	if(command._method!=null){
		rpcNode.setAttribute("method",command._method);
		
	};
	var paramNode=_$populateParameXML(domDoc,command._parameters);
	if(paramNode!=null)rpcNode.appendChild(paramNode);
	var propNode=_$populateViewPropertiesXML(domDoc,command._viewModel._properties);
	if(propNode!=null)rpcNode.appendChild(propNode);
	var xml;
	if(browserType==__Browser_IE){
		xml=xmlDoc.xml;
		
	}else {
		xml=xmlDoc.innerHTML;
		
	};
	delete xmlDoc;
	xmlDoc=null;
	return xml;
	
};
function _$populateParameXML(xmlDoc,elementParams){
	var parameters=elementParams._parameters;
	var size=parameters.size();
	if(size>0){
		var paramNode=xmlDoc.createElement("parameters");
		for(var i=0;i<size;i++){
			var parameter=parameters._objectArray[i];
			var pNode=xmlDoc.createElement("p");
			paramNode.appendChild(pNode);
			pNode.setAttribute("name",parameter._name);
			var dataType=parameter._dataType;
			if(dataType!=1){
				pNode.setAttribute("dataType",dataType);
				
			};
			var value=parameter._value;
			if(value!=null){
				if(browserType==__Browser_IE){
					pNode.text=_$encode(value);
					
				}
				else {
					pNode.innerText=_$encode(value);
					
				}
			}
		};
		return paramNode;
		
	}else {
		return null;
		
	}
};
function _$populateRPCOrderXML(xmlDoc,dataorders){
	var size=dataorders.size();
	if(size>0){
		var ordersNode=xmlDoc.createElement("orders");
		for(var i=0;i<size;i++){
			var byNode=xmlDoc.createElement("by");
			ordersNode.appendChild(byNode);
			byNode.setAttribute("field",dataorders._objectArray[i]._name);
			byNode.setAttribute("ascend",dataorders._objectArray[i]._ordered);
		};
		return ordersNode;
		
	}else {
		return null;
		
	}
};
function _$populateViewPropertiesXML(xmlDoc,properties){
	var parameters=properties._parameters;
	var size=parameters.size();
	if(size>0){
		var paramNode=xmlDoc.createElement("viewProperties");
		for(var i=0;i<size;i++){
			var parameter=parameters._objectArray[i];
			var pNode=xmlDoc.createElement("p");
			paramNode.appendChild(pNode);
			pNode.setAttribute("name",parameter._name);
			var dataType=parameter._dataType;
			if(dataType!=1){
				pNode.setAttribute("dataType",dataType);
				
			};
			var value=parameter._value;
			if(value!=null){
				if(browserType==__Browser_IE){
					pNode.text=_$encode(value);
					
				}else {
					pNode.innerText=_$encode(value);
					
				}
			}
		};
		return paramNode;
		
	}else {
		return null;
		
	}
};
function _$parseRPCOutParameters(parameters,xmlRoot){
	var outParameters,propertyNodes;
	if(browserType==__Browser_IE){
		outParameters=xmlRoot.selectSingleNode("outparameters");
		if(!outParameters)return;
		propertyNodes=outParameters.childNodes;
		
	}else {
		outParameters=xmlRoot.getElementsByTagName("outparameters")[0];		
		if(!outParameters)return;
		propertyNodes=outParameters.getElementsByTagName("p");
		
	};
	for(var i=0;i<propertyNodes.length;i++){
		var propertyNode=propertyNodes.item(i);
		var name=propertyNode.getAttribute("name");
		parameters.setValue(name,unescape(propertyNode.getAttribute("value")),parseInt(propertyNode.getAttribute("datatype")));
		
	}
};
function _$parseCountParameters(parameters,xmlRoot){
	var outParameters,propertyNodes;
	if(browserType==__Browser_IE){
		outParameters=xmlRoot.selectSingleNode("count");
		if(!outParameters)return;
		propertyNodes=outParameters.childNodes;
		
	}else {
		outParameters=xmlRoot.getElementsByTagName("count")[0];		
		if(!outParameters)return;
		propertyNodes=outParameters.getElementsByTagName("p");
		
	};
	for(var i=0;i<propertyNodes.length;i++){
		var propertyNode=propertyNodes.item(i);
		var name=propertyNode.getAttribute("name");
		parameters.setValue(name,unescape(propertyNode.getAttribute("value")));
		parameters.setDataType(name,parseInt(propertyNode.getAttribute("datatype")));
		
	}
};



var __DatasetInfo_SUBMITSCOPE_ALL="all";
var __DatasetInfo_SUBMITSCOPE_ALL_VISIBLE="all-visible";
var __DatasetInfo_SUBMITSCOPE_ALL_CHANGE="all-change";
var __DatasetInfo_SUBMITSCOPE_CURRENT="current";
var __DatasetInfo_SUBMITSCOPE_SELECTED="selected";
function DatasetInfo(){
	this._dataset=null;
	this._submitScope=__DatasetInfo_SUBMITSCOPE_ALL_CHANGE;
	this._flushDataOnSuccess=false;
	this._clearSelectionOnSuccess=false;
	this._clearDirtyOnSuccess=true;
	
};
DatasetInfo.prototype.getDataset=function (){
	return this._dataset;
	
};
DatasetInfo.prototype.setDataset=function (dataset){
	this._dataset=kingfisher.feather.getDataset(dataset);
	
};
DatasetInfo.prototype.getSubmitScope=function (){
	return this._submitScope;
	
};
DatasetInfo.prototype.setSubmitScope=function (submitScope){
	this._submitScope=submitScope;
	
};
DatasetInfo.prototype.isFlushDataOnSuccess=function (){
	return this._flushDataOnSuccess;
	
};
DatasetInfo.prototype.setFlushDataOnSuccess=function (flushDataOnSuccess){
	this._flushDataOnSuccess=flushDataOnSuccess;
	
};
DatasetInfo.prototype.isClearSelectionOnSuccess=function (){
	return this._clearSelectionOnSuccess;
	
};
DatasetInfo.prototype.setClearSelectionOnSuccess=function (deleteSelectionOnSuccess){
	this._clearSelectionOnSuccess=deleteSelectionOnSuccess;
	
};
DatasetInfo.prototype.isDeleteSelectionOnSuccess=function (){
	return this._deleteSelectionOnSuccess;
	
};
DatasetInfo.prototype.setDeleteSelectionOnSuccess=function (deleteSelectionOnSuccess){
	
	this._deleteSelectionOnSuccess=deleteSelectionOnSuccess;
	
};
DatasetInfo.prototype.isClearDirtyOnSuccess=function (){
	return this._clearDirtyOnSuccess;
	
};
DatasetInfo.prototype.setClearDirtyOnSuccess=function (clearDirtyOnSuccess){
	
	this._clearDirtyOnSuccess=clearDirtyOnSuccess;
	
};



var __UpdateCommand_TRANSACTION_NOT_SUPPORTED=1;
var __UpdateCommand_TRANSACTION_SUPPORTS=5;
var __UpdateCommand_TRANSACTION_REQUIRED=10;
var __UpdateCommand_TRANSACTION_REQUIRES_NEW=20;
function UpdateCommand(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._transactionMode=__UpdateCommand_TRANSACTION_REQUIRED;
	this._alwaysPerform=false;
	this._datasetInfos=new HashList();
	this._parameters=new ParameterSet();
	
};
UpdateCommand.prototype=new RPCCommand();
KingfisherFactory._$registerComponentType("UpdateCommand",function (id,viewModel){
	return new UpdateCommand(id,viewModel);
	
});
UpdateCommand.prototype.getTransactionMode=function (){
	return this._transactionMode;
	
};
UpdateCommand.prototype.setTransactionMode=function (transactionMode){
	this._transactionMode=transactionMode;
	
};
UpdateCommand.prototype.isAlwaysPerform=function (){
	return this._alwaysPerform;
	
};
UpdateCommand.prototype.setAlwaysPerform=function (alwaysPerform){
	this._alwaysPerform=alwaysPerform;
	
};
UpdateCommand.prototype.addDatasetInfo=function (dataset,submitScope){
	var datasetId;
	if(typeof(dataset)=="string"){
		datasetId=dataset;
		
	}else {
		datasetId=dataset.id;
		
	};
	var datasetInfo=new DatasetInfo();
	datasetInfo.setDataset(datasetId);
	if(submitScope!=null){
		datasetInfo.setSubmitScope(submitScope);
		
	};
	this._datasetInfos.put(datasetId,datasetInfo);
	return datasetInfo;	
	
};
UpdateCommand.prototype.clearDatasetInfos=function (){
	this._datasetInfos.clear();
	
};
UpdateCommand.prototype.getDatasetInfos=function (){
	return this._datasetInfos;
	
};
UpdateCommand.prototype.isDirty=function (){
	if(!this._$postDatasets()){
		return false;
		
	};
	var datasetInfos=this._datasetInfos;
	var datasetCount=datasetInfos.size();
	for(var i=0;i<datasetCount;i++){
		var datasetInfo=datasetInfos.get(i);
		var dataset=datasetInfo._dataset;
		if(dataset._masterDetailLink!=null){
			var masterDataset=dataset._masterDetailLink._masterDataset;
			if(masterDataset!=null&&this._datasetInfos.get(masterDataset.id)!=null){
				continue;
				
			}
		};
		if(this._$hasSubmitRecord(datasetInfo,dataset._recordset)){
			return true;
			
		}
	};
	return false;
	
};
UpdateCommand.prototype._$hasSubmitRecord=function (datasetInfo,recordset){
	var submitScope=datasetInfo.getSubmitScope();
	var dataset=recordset._dataset;
	switch(submitScope){
		case __DatasetInfo_SUBMITSCOPE_ALL:
		case __DatasetInfo_SUBMITSCOPE_ALL_VISIBLE:{
			return true;
			break;
			
		};
		case __DatasetInfo_SUBMITSCOPE_ALL_CHANGE:{
			var record=recordset._first;
			while(record!=null){
				var dirty=this._$detailIsUpdate(record);
				if(dirty)return true;
				if(record._state==__Record_STATE_INSERT||record._state==__Record_STATE_MODIFY||record._state==__Record_STATE_DELETE){
					return true;
					
				};
				record=record._next;
				
			};
			break;			
			
		};
		case __DatasetInfo_SUBMITSCOPE_CURRENT:{
			var current=dataset._current;
			if(current!=null&&current._recordset==recordset){
				return true;
				
			};
			break;
			
		};
		case __DatasetInfo_SUBMITSCOPE_SELECTED:{
			var record=recordset._first;
			while(record!=null){
				var dirty=this._$detailIsUpdate(record);
				if(dirty)return true;
				if(parseBoolean(record.getValue("select"))&&dataset.isRecordVisible(record)){
					return true;
					
				};
				record=record._next;
				
			};
			break;
			
		}
	};
	return false;
	
};
UpdateCommand.prototype._$detailIsUpdate=function (record){
	var dataset=record._dataset;
	var detailRecSets=record._detailRecordSets;
	if(detailRecSets!=null){
		
		for(var i=0;i<detailRecSets.size();i++){
			var recordset=detailRecSets.get(i);
			var detailDataset=recordset._dataset;
			
			if(detailDataset._masterDetailLink!=null&&detailDataset._masterDetailLink._masterDataset==dataset){
				
				var detailDsInfo=this._datasetInfos.get(detailDataset.id);
				if(detailDsInfo!=null&&this._$hasSubmitRecord(detailDsInfo,recordset)){
					return true;
					
				}
			}
		}
	};
	return false;
	
};
UpdateCommand.prototype.execute=function (asyncFunc){
	if(this._disabled){
		alert("Command \""+this.id+"\" is disabled!");
		return ;
		
	};
	if(!this._$postDatasets()){
		return false;
		
	};
	if(!this._alwaysPerform&&!this.isDirty()){
		
		return true;
		
	};
	try{
		this._outParameters.clear();
		this._$fireBeforeExecute();
		var recordMapping=new HashList();
		var xml=this._$populateUpdateXml(recordMapping);
		if(!this._async){
			var xmlDoc=_$remoteRequest(this._viewModel,this._action,"updateData",xml,this._showLoadingTip,this.id);
			if(xmlDoc!=null){
				var result=this._$processResult(xmlDoc,recordMapping);
				return result;
				
			}
		}else {
			var command=this;
			_$asyncRequest(this._viewModel,this._action,"updateData",xml,this._showLoadingTip,this.id,function (asyncSucceed,xmlDoc){
				if(asyncSucceed){
					try{
						command._$fireOnSuccess();
						var result=command._$processResult(xmlDoc,recordMapping);
						if(asyncFunc!=null)asyncFunc(command,result);

					}catch(e){
						_$processException(e);
						
					};
				}
				
			});
			return true;
			
		}
	}catch(e){
		_$processException(e);
		
	};
	return false;
	
};
UpdateCommand.prototype._$processResult=function (xmlDoc,recordMapping){
	try{
		var xmlRoot=xmlDoc.documentElement;
		if(xmlRoot!=null){
			var succeed=parseBoolean(xmlRoot.getAttribute("succeed"));
			if(succeed){
				var requeryPath;
				if(browserType==__Browser_IE){
					requeryPath=xmlRoot.selectSingleNode("requerypath").text;
					
				}else {
					var node=xmlRoot.getElementsByTagName("requerypath")[0].firstChild;
					if(node!=null)requeryPath=node.nodeValue;
					
				};
				var recordsNode;
				if(browserType==__Browser_IE){
					recordsNode=xmlRoot.selectSingleNode("rs");
					
				}else {
					
					recordsNode=xmlRoot.getElementsByTagName("rs")[0];
					
				};
		
				_$parseRPCOutParameters(this._outParameters,xmlRoot);
				_$parseViewProperties(xmlRoot,this.getViewModel().properties());
				
				var mesNode;
				var message;
				if(browserType==__Browser_IE){
					mesNode = xmlRoot.selectSingleNode("message");
					if (mesNode!=null)
					{
						message=xmlRoot.selectSingleNode("message").text;
					}
				}else {
					var node=xmlRoot.getElementsByTagName("message")[0].firstChild;
					if(node!=null)message=node.nodeValue;
					
				};

				var $zS=this._$getDsMapping(recordsNode,recordMapping);
				recordMapping.clear();
				delete recordMapping;
				
				var datasetInfos=this._datasetInfos;
				var count=datasetInfos.size();
				for(var i=0;i<count;i++){
					var datasetInfo=datasetInfos.get(i);
					var dataset=datasetInfo._dataset;
					if(dataset!=null){
						if(datasetInfo.isFlushDataOnSuccess()){
							dataset.flushData();
							var index=$zS.indexOf(dataset);
							if(index>=0){
								$zS.splice(index,1);
								
							}
						}
						else if(datasetInfo.isClearDirtyOnSuccess()){
							this._$clearDirtyRecord(datasetInfo,dataset._recordset);
						}
						else {
							if(datasetInfo.isDeleteSelectionOnSuccess()&&dataset.getField("select")!=null){
								dataset.disableControls();
								try{
									var record=dataset.getFirstRecord();
									while(record!=null){
										var $I8=record.getNextRecord();
										if(record.getValue("select")){
											if(dataset._current==record){
												var currentRecord=record.getNextRecord();
												if(currentRecord==null){
													currentRecord=record.getPrevRecord();
													
												};
												dataset._current=currentRecord;
												
											};
											record._recordset.removeElement(record);
											record.destroy();
											
										};
										record=$I8;
										
									}
								}finally{
									dataset.enableControls();
									if($zS.indexOf(dataset)<0)$zS.push(dataset);
									
								}
								
							}else if(datasetInfo.isClearSelectionOnSuccess()&&dataset.getField("select")!=null){
								dataset.disableControls();
								try{
									var record=dataset.getFirstRecord();
									while(record!=null){
										if(record.getValue("select")){
											record.setValue("select","false");
											record.setDirty(false);
											
										};
										record=record.getNextRecord();
										
									}
								}finally{
									dataset.enableControls();
									if($zS.indexOf(dataset)<0)$zS.push(dataset);
									
								}
							}
						}
					}
				};
				for(var i=0;i<$zS.length;i++){
					$zS[i].refreshControls();
					
				};
				if(this._$fireOnSuccess()){
					if(message){
						alert(unescape(message));
						
					}
				};
				if(requeryPath){
					window.open(requeryPath,"_self");
					
				}
			}else {
				var message;
				var mesNode;
				if(browserType==__Browser_IE){

					mesNode = xmlRoot.selectSingleNode("message");
					if (mesNode!=null)
					{
						message=xmlRoot.selectSingleNode("message").text;
					}
					
				}else {
					var node=xmlRoot.getElementsByTagName("message")[0].firstChild;
					if(node!=null)message=node.nodeValue;
					
				};
				if(this._$fireOnFailure() && (message)){
					
					alert(__UPDATECOMMAND_FAILED+"\n"+unescape(message));
					
				}
			};
			return succeed;			
			
		}
	}catch(e){
		_$processException(e);
		
	};
	return false;
	
};
UpdateCommand.prototype._$postDatasets=function (){
	var datasetInfos=this._datasetInfos;
	var count=datasetInfos.size();
	for(var i=0;i<count;i++){
		var datasetInfo=datasetInfos.get(i);
		var dataset=datasetInfo._dataset;
		if(dataset!=null&&dataset._current!=null){
			if(!dataset.postRecord()){
				return false;
				
			}
		}
	};
	return true;
	
};
UpdateCommand.prototype._$populateUpdateDatasetInfoXml=function (xmlDoc,datasetInfo){
	var dataset=datasetInfo._dataset;
	var fields=new Array();
	var fieldDataTypes=new Array();
	var fieldKeys=new Array();
	var indexs=new Array();
	var fieldNum=dataset.getFieldCount();
	for(var i=0;i<fieldNum;i++){
		var field=dataset.getField(i);
		fields.push(field._name);
		fieldDataTypes.push(field._dataType);
		fieldKeys.push(field._isKey);
		indexs.push(i);
		
	};
	datasetInfo._fields=fields;
	datasetInfo._fieldDataTypes=fieldDataTypes;
	datasetInfo._fieldKeys=fieldKeys;
	datasetInfo._indexs=indexs;
	var datasetNode=xmlDoc.createElement("dataset");
	datasetNode.setAttribute("type",dataset._type);
	datasetNode.setAttribute("id",dataset.id);
	for(var i=0;i<fields.length;i++){
		var fNode=xmlDoc.createElement("f");
		datasetNode.appendChild(fNode);
		fNode.setAttribute("name",fields[i]);
		var dataType=fieldDataTypes[i];
		if(dataType!=1){
			fNode.setAttribute("datatype",dataType);
			
		}
		fNode.setAttribute("isKey",Math.abs(fieldKeys[i]));
	}
	var paramNode=_$populateParameXML(xmlDoc,dataset._parameters);
	if(paramNode!=null)datasetNode.appendChild(paramNode);
	return datasetNode;
	
};
UpdateCommand.prototype._$populateSubmitXML=function (xmlDoc,datasetInfo,recordset,recordMapping){
	var submitScope=datasetInfo.getSubmitScope();
	var dataset=recordset._dataset;
	var rsNode=xmlDoc.createElement("rs");
	rsNode.setAttribute("dataset",dataset.id);
	switch(submitScope){
		case __DatasetInfo_SUBMITSCOPE_ALL:{
			var record=recordset._first;
			while(record!=null){
				var detNode=this._$populateUpdateDetailXml(xmlDoc,record,recordMapping);
				var rNode=this._$populateUpdateRecordXML(xmlDoc,datasetInfo,record,recordMapping);
				if(detNode!=null)rNode.appendChild(detNode);
				rsNode.appendChild(rNode);
				record=record._next;
				
			};
			break;
			
		};
		case __DatasetInfo_SUBMITSCOPE_ALL_VISIBLE:{
			var record=recordset._first;
			while(record!=null){
				if(dataset.isRecordVisible(record)){
					var detNode=this._$populateUpdateDetailXml(xmlDoc,record,recordMapping);
					var rNode=this._$populateUpdateRecordXML(xmlDoc,datasetInfo,record,recordMapping);
					if(detNode!=null)rNode.appendChild(detNode);
					rsNode.appendChild(rNode);
				}
				record=record._next;
				
			};
			break;
			
		};
		case __DatasetInfo_SUBMITSCOPE_ALL_CHANGE:{
			var record=recordset._first;
			while(record!=null){
				var detNode=this._$populateUpdateDetailXml(xmlDoc,record,recordMapping);
				if(detNode!=null||record._state==__Record_STATE_INSERT||record._state==__Record_STATE_MODIFY||record._state==__Record_STATE_DELETE){
					var rNode=this._$populateUpdateRecordXML(xmlDoc,datasetInfo,record,recordMapping);
					if(detNode!=null)rNode.appendChild(detNode);
					rsNode.appendChild(rNode);
					
				};
				record=record._next;
				
			};
			break;
			
		};
		case __DatasetInfo_SUBMITSCOPE_CURRENT:{
			var current=dataset._current;
			if(current!=null&&current._recordset==recordset){
				var detNode=this._$populateUpdateDetailXml(xmlDoc,current,recordMapping);
				var rNode=this._$populateUpdateRecordXML(xmlDoc,datasetInfo,current,recordMapping);
				if(detNode!=null)rNode.appendChild(detNode);
				rsNode.appendChild(rNode);
				
			};
			break;
			
		};
		case __DatasetInfo_SUBMITSCOPE_SELECTED:{
			
			var record=recordset._first;
			while(record!=null){
				if(parseBoolean(record.getValue("select"))&&dataset.isRecordVisible(record)){
					var detNode=this._$populateUpdateDetailXml(xmlDoc,record,recordMapping);
					var rNode=this._$populateUpdateRecordXML(xmlDoc,datasetInfo,record,recordMapping);
					if(detNode!=null)rNode.appendChild(detNode);
					rsNode.appendChild(rNode);
					
				};
				record=record._next;
				
			};
			break;
			
		}
	};
	if(rsNode.childNodes.length>0){
		return rsNode;
		
	}else {
		return null;
		
	}
};
UpdateCommand.prototype._$populateUpdateDetailXml=function (xmlDoc,record,recordMapping){
	var detNode;
	var dataset=record._dataset;
	var detailRecSets=record._detailRecordSets;
	if(detailRecSets!=null){
		for(var i=0;i<detailRecSets.size();i++){
			var recordset=detailRecSets.get(i);
			var detailDataset=recordset._dataset;
			if(detailDataset._masterDetailLink!=null&&detailDataset._masterDetailLink._masterDataset==dataset){
				var detailDsInfo=this._datasetInfos.get(detailDataset.id);
				if(detailDsInfo!=null){
					var rsNode=this._$populateSubmitXML(xmlDoc,detailDsInfo,recordset,recordMapping);
					if(rsNode!=null){
						if(detNode==null){
							detNode=xmlDoc.createElement("detail");
							
						};
						detNode.appendChild(rsNode);
						
					}
				}
			}
		}
	};
	return detNode;
	
};
UpdateCommand.prototype._$populateUpdateRecordXML=function (xmlDoc,datasetInfo,record,recordMapping){
	var dataset=datasetInfo._dataset;
	var indexs=datasetInfo._indexs;
	var fieldDataTypes=datasetInfo._fieldDataTypes;
	record._$loadDataFromXMLNode();	
	recordMapping.put(new String(record._publicid),record);
	var data=record._data;
	var rNode=xmlDoc.createElement("r");
//	rNode.setAttribute("id",record._publicid);
	if(record._state!=__Record_STATE_NONE){
		rNode.setAttribute("state",record._state);
		
	};
	var oldRecord;
	var oNode;
	if(record._state!=__Record_STATE_INSERT){
		oldRecord=dataset.getOldRecord(record);
		oNode=xmlDoc.createElement("o");
		
	};
	var oldDatas;
	if(oldRecord!=null){
		oldDatas=oldRecord._data;
		
	};
	var nNode=xmlDoc.createElement("n");
	rNode.appendChild(nNode);
	var oldDataIndex=0,newDataIndex=0;
	for(var i=0;i<indexs.length;i++){
		var newData=data[indexs[i]];
		if(newData!=null){
			var vNode=xmlDoc.createElement("v");
			var nodeData=(fieldDataTypes[i]==1)?_$encode(newData):((fieldDataTypes[i]==10||fieldDataTypes[i]==11||fieldDataTypes[i]==12)?newData.getTime():(fieldDataTypes[i]==9?Math.abs(newData):newData));
			if(browserType==__Browser_IE){
				vNode.text=nodeData;
				
			}else {
				vNode.innerText=nodeData;
				
			};
			if(newDataIndex>0){
				vNode.setAttribute("s",newDataIndex);
				newDataIndex=0;
				
			};
			nNode.appendChild(vNode);
			
		}else {
			newDataIndex++;
			
		};
		if(oldDatas!=null){
			var oldData=oldDatas[indexs[i]];
			if(oldData!=newData){
				var vNode=xmlDoc.createElement("v");
				var nodeData=(fieldDataTypes[i]==1)?_$encode(oldData):((fieldDataTypes[i]==10||fieldDataTypes[i]==11||fieldDataTypes[i]==12)?newData.getTime():(fieldDataTypes[i]==9?Math.abs(oldData):oldData));
				if(browserType==__Browser_IE){
					
					vNode.text=nodeData;
					
				}else {
					vNode.innerText=nodeData;
					
				};
				if(oldDataIndex>0){
					vNode.setAttribute("s",oldDataIndex);
					oldDataIndex=0;
					
				};
				oNode.appendChild(vNode);
				
			}else {
				oldDataIndex++;
				
			}
		}
	};
	rNode.appendChild(nNode);
	if(oNode!=null&&oNode.childNodes.length>0){
		rNode.appendChild(oNode);
		
	};
	return rNode;
	
};
UpdateCommand.prototype._$populateUpdateXml=function (recordMapping){
	var xmlDoc,domDoc;
	if(browserType==__Browser_IE){
		xmlDoc=new ActiveXObject("Msxml.DOMDocument");
		domDoc=xmlDoc;
		
	}else {
		xmlDoc=$$("DOM");
		domDoc=document;
		
	};
	var defNode=domDoc.createElement("def");
	var datasetInfos=this._datasetInfos;
	var datasetCount=datasetInfos.size();
	for(var i=0;i<datasetCount;i++){
		var datasetInfo=datasetInfos.get(i);
		var datasetNode=this._$populateUpdateDatasetInfoXml(domDoc,datasetInfo);
		defNode.appendChild(datasetNode);
		
	};
	var dataNode=domDoc.createElement("data");
	var datasetCount=datasetInfos.size();
	for(var i=0;i<datasetCount;i++){
		var datasetInfo=datasetInfos.get(i);
		var dataset=datasetInfo._dataset;
		if(dataset._masterDetailLink!=null){
			
			var masterDataset=dataset._masterDetailLink._masterDataset;
			if(masterDataset!=null&&this._datasetInfos.get(masterDataset.id)!=null){
				continue;
				
			}
		};
		var rsNode=this._$populateSubmitXML(domDoc,datasetInfo,dataset._recordset,recordMapping);
		if(rsNode!=null){
			dataNode.appendChild(rsNode);
			
		}
	};
	var rpcNode=domDoc.createElement("rpc");
	xmlDoc.appendChild(rpcNode);
	rpcNode.setAttribute("transaction",this._transactionMode);
	if(this._method!=null){
		rpcNode.setAttribute("method",this._method);
		
	};
	rpcNode.appendChild(defNode);
	rpcNode.appendChild(dataNode);
	var paramNode=_$populateParameXML(domDoc,this._parameters);
	if(paramNode!=null)rpcNode.appendChild(paramNode);
	var propNode=_$populateViewPropertiesXML(domDoc,this._viewModel._properties);
	if(propNode!=null)rpcNode.appendChild(propNode);
	var xml;
	if(browserType==__Browser_IE){
		xml=xmlDoc.xml;
		
	}else {
		xml=xmlDoc.innerHTML;
		
	};
	delete xmlDoc;
	xmlDoc=null;
	return xml;
	
};
UpdateCommand.prototype._$getDsMapping=function (recordsNode,recordMapping){
	var dsMapping=new Array();
	if(recordsNode==null)return dsMapping;
	var recordNodes=recordsNode.childNodes;
	
	for(var i=0;i<recordNodes.length;i++){
		var recordNode=recordNodes[i];
		if(browserType==__Browser_IE||recordNode.nodeName.charAt(0)!='#'){
			var idValue=recordNode.getAttribute("id");
			var record=recordMapping.get(idValue);
			
			if(record!=null){
				var dataset=record._dataset;
				if(dataset!=null){
					record._dataLoad=false;
					record._recordNode=recordNode;
					record._$loadDataFromXMLNode();					
					record._rowid=_$getRecordSerialId();
					var state=recordNode.getAttribute("state");
					if(state==__Record_STATE_DELETE){
						if(dataset._current==record){
							var currentRecord=record.getNextRecord();
							if(currentRecord==null){
								currentRecord=record.getPrevRecord();
								
							};
							dataset._current=currentRecord;
							
						};
						record._recordset.removeElement(record);
						record.destroy();
						
					}else {
						record._state=state;
						
					};
					if(dsMapping.indexOf(dataset)<0){
						dsMapping.push(dataset);
						
					}
				}
			}
		}
	};
	return dsMapping;
	
};
UpdateCommand.prototype._$clearDirtyRecord=function (datasetInfo,recordset){
	var submitScope=datasetInfo.getSubmitScope();
	var dataset=recordset._dataset;
	if(submitScope==__DatasetInfo_SUBMITSCOPE_ALL_CHANGE){
		var delrs=new Collection();
		var record=recordset._first;
		while(record!=null){
			this._$clearDirtyDetailRecord(record);
			if(record._state==__Record_STATE_INSERT||record._state==__Record_STATE_MODIFY){
				
				record._state=__Record_STATE_NONE;
				record._$repairOldRecord();
			}
			else if(record._state==__Record_STATE_DELETE){
			
				delrs.insert(record);
			}
			record=record._next;
				
		};
		var itr=delrs.iterator();
		while(itr.hasNext()){
			var dl=itr.next();
			recordset.removeElement(dl);
		}
	}
	
};
UpdateCommand.prototype._$clearDirtyDetailRecord=function (record){
	var dataset=record._dataset;
	var detailRecSets=record._detailRecordSets;
	if(detailRecSets!=null){
		for(var i=0;i<detailRecSets.size();i++){
			var recordset=detailRecSets.get(i);
			var detailDataset=recordset._dataset;
			if(detailDataset._masterDetailLink!=null&&detailDataset._masterDetailLink._masterDataset==dataset){
				var detailDsInfo=this._datasetInfos.get(detailDataset.id);
				if(detailDsInfo!=null){
					this._$clearDirtyRecord(detailDsInfo,recordset);
				}
			}
		}
	};
	
};



var __QueryCommand_QUERY_MODE_FLUSH="flush";
var __QueryCommand_QUERY_MODE_FORM_GET="form-get";
var __QueryCommand_QUERY_MODE_FORM_POST="form-post";
function QueryCommand(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._async=false;
	this._showLoadingTip=__SHOW_LOADING_TIP;
	this._queryMode=__QueryCommand_QUERY_MODE_FLUSH;
	this._conditionDataset=null;
	this._queryDataset=null;
	this._parameters=new ParameterSet();
	
};
QueryCommand.prototype=new Command();
KingfisherFactory._$registerComponentType("QueryCommand",function (id,viewModel){
	return new QueryCommand(id,viewModel);
	
}
);
QueryCommand.prototype.isAsync=function (){
	return this._async;
	
};
QueryCommand.prototype.setAsync=function (async){
	this._async=async;
	
};
QueryCommand.prototype.isShowLoadingTip=function (){
	return this._showLoadingTip;
	
};
QueryCommand.prototype.setShowLoadingTip=function (showLoadingTip){
	this._showLoadingTip=showLoadingTip;
	
};
QueryCommand.prototype.getQueryMode=function (){
	return this._queryMode;
	
};
QueryCommand.prototype.setQueryMode=function (queryMode){
	this._queryMode=queryMode;
	
};
QueryCommand.prototype.getConditionDataset=function (){
	return kingfisher.feather.getDataset(this._conditionDataset);
	
};
QueryCommand.prototype.setConditionDataset=function (conditionDataset){
	this._conditionDataset=conditionDataset;
	
};
QueryCommand.prototype.getQueryDataset=function (){
	return kingfisher.feather.getDataset(this._queryDataset);
	
};
QueryCommand.prototype.setQueryDataset=function (queryDataset){
	this._queryDataset=queryDataset;
	
};
QueryCommand.prototype.parameters=function (){
	return this._parameters;
	
};
QueryCommand.prototype.execute=function (asyncFunc){
	if(this._disabled){
		alert("Command \""+this.id+"\" is disabled!");
		return ;
		
	};
	try{
		this._$fireBeforeExecute();
		var conditionDataset=this.getConditionDataset();
		var queryDataset=this.getQueryDataset();
		if(queryDataset==null)return false;
		if(conditionDataset!=null&&conditionDataset._current!=null){
			if(conditionDataset._current._state==__Record_STATE_NEW){
				conditionDataset._current._dirty=true;
				
			};
			if(!conditionDataset.postRecord()){
				return false;				
				
			}
		};
		if(this._queryMode==__QueryCommand_QUERY_MODE_FLUSH){
			var parameters=queryDataset._parameters;
			if(conditionDataset!=null&&conditionDataset._current!=null){
				var fieldCount=conditionDataset.getFieldCount();
				for(var i=0;i<fieldCount;i++){
					var field=conditionDataset.getField(i);
					var name=field._name;
					var value=conditionDataset.getValue(i);
					if(parameters.getParameter(name)==null){
						parameters.setDataType(name,field._dataType);
						
					};
					parameters.setValue(name,value);
					
				}
			};
			parameters.assign(this._parameters);
			
			var oldAsync=queryDataset._async;
			var oldShowLoadingTip=queryDataset._showLoadingTip;
			try{
				queryDataset._async=this._async;
				queryDataset._showLoadingTip=this._showLoadingTip;
				queryDataset.setPageIndex(1);
				if(!this._async){
					queryDataset.flushData();
					
				}else {
					var command=this;
					queryDataset.flushData(function (asyncSucceed){
						if(asyncSucceed){
							try{
								command._$fireOnSuccess();
								if(asyncFunc!=null)asyncFunc(command,true);
								
							}catch(e){
								_$processException(e);
								
							};
						}
					});
					
				}
			}finally{
				queryDataset._async=oldAsync;
				queryDataset._showLoadingTip=oldShowLoadingTip;
				
			};
			
			if(!this._async)this._$fireOnSuccess();
			
		}else {
			var form=$$("FORM");
			form.method=((this._queryMode==__QueryCommand_QUERY_MODE_FORM_POST)?"post":"get");
			form.style.display="none";
			var html="";
			var condFieldNames=new Array();
			if(conditionDataset!=null){
				var fieldCount=conditionDataset.getFieldCount();				
				for(var i=0;i<fieldCount;i++){
					var name=conditionDataset.getField(i)._name;
					condFieldNames.push(name);
					html+="<INPUT name=\""+name+"\">";
					
				}
			};
			var parameters=this._parameters;
			var size=parameters.size();
			for(var i=0;i<size;i++){
				var name=parameters.getParameter(i)._name;
				if(condFieldNames.indexOf(name)>=0)continue;
				condFieldNames.push(name);
				html+="<INPUT name=\""+name+"\">";
				
			};
			html+="<INPUT name=\"__qd\">";
			form.innerHTML=html;
			document.body.appendChild(form);
			if(conditionDataset!=null&&conditionDataset._current!=null){
				var fieldCount=conditionDataset.getFieldCount();
				for(var i=0;i<fieldCount;i++){
					var value=conditionDataset.getValue(i);
					if(value!=null){
						form[conditionDataset.getField(i)._name].value=value;
						
					}
				}
			};
			for(var i=0;i<size;i++){
				var parameter=parameters.getParameter(i);
				var value=parameter._value;
				if(value!=null){
					form[parameter._name].value=value;
					
				}
			};
			form["__qd"].value=queryDataset.id;
			form.submit();
			form.parentNode.removeChild(form);
			delete form;
			this._$fireOnSuccess();
			
		};
		return true;
		
	}catch(e){
		if(this._$fireOnFailure()){
			_$processException(e);
			
		};
		return false;
		
	}
};



var __ExportCommand_EXPORTMODE_DOWNLOAD="download";
var __ExportCommand_EXPORTMODE_OUTPUT="output";
var __ExportCommand_EXPORTTYPE_TXT="txt";
var __ExportCommand_EXPORTTYPE_XLS="xls";
function ExportCommand(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._dataset=null;
	this._exportMode=__ExportCommand_EXPORTMODE_DOWNLOAD;
	this._exportType=__ExportCommand_EXPORTTYPE_XLS;
	this._maxRow=0;
	this._fileName=null;
	this._template=null;
	this._mapValue=false;
	this._onlyCurrentPage=false;
	this._frame=new Frame();
	this._parameters=new ParameterSet();
	
};
ExportCommand.prototype=new AbstractRequestCommand();
KingfisherFactory._$registerComponentType("ExportCommand",function (id,viewModel){
	return new ExportCommand(id,viewModel);
	
});
ExportCommand.prototype.getDataset=function (){
	return kingfisher.feather.getDataset(this._dataset);
	
};
ExportCommand.prototype.setDataset=function (dataset){
	this._dataset=dataset;
	
};
ExportCommand.prototype.getExportMode=function (){
	return this._exportMode;
	
};
ExportCommand.prototype.setExportMode=function (exportMode){
	this._exportMode=exportMode;
	
};
ExportCommand.prototype.getExportType=function (){
	return this._exportType;
	
};
ExportCommand.prototype.setExportType=function (exportType){
	this._exportType=exportType;
	
};
ExportCommand.prototype.getMaxRow=function (){
	return this._maxRow;
	
};
ExportCommand.prototype.setMaxRow=function (maxRow){
	this._maxRow=maxRow;
	
};
ExportCommand.prototype.isOnlyCurrentPage=function (){
	return this._onlyCurrentPage;
	
};
ExportCommand.prototype.setOnlyCurrentPage=function (onlyCurrentPage){
	this._onlyCurrentPage=onlyCurrentPage;
	
};
ExportCommand.prototype.isMapValue=function (){
	return this._mapValue;
	
};
ExportCommand.prototype.setMapValue=function (mapValue){
	this._mapValue=mapValue;
	
};
ExportCommand.prototype.getFileName=function (){
	return this._fileName;
	
};
ExportCommand.prototype.setFileName=function (fileName){
	this._fileName=fileName;
	
};
ExportCommand.prototype.getTemplate=function (){
	return kingfisher.feather.getControl(this._template);
	
};
ExportCommand.prototype.setTemplate=function (template){
	
	this._template=template;
	
};
ExportCommand.prototype.execute=function (dialogParam){
	function _$getColumnInfoXML(domDoc,column,dataset){
		if(column._visible&&column._type=="data"){
			var label=column._label;
			var field=dataset.getField(column._field);
			if(!label){
				if(field!=null){
					label=field._label;
					
				}
			};
			
			if(field!=null){
				var cNode=domDoc.createElement("c");
				cNode.setAttribute("field",column._field);
				cNode.setAttribute("label",_$encode(label));
				return cNode;
			}
			
		}else {
			return null;
			
		}
	};
	if(this._disabled){
		alert("Command \""+this.id+"\" is disabled!");
		return ;
		
	};
	try{
		this._$fireBeforeExecute();
		var commandParams=new ParameterSet();
		this.setPath(__CONTEXT_PATH+"/kingfisher/autoExport.do");
		commandParams.setValue("exportMode",this._exportMode);
		commandParams.setValue("exportType",this._exportType);
		commandParams.setValue("onlyCurrentPage",this._onlyCurrentPage);
		var dataset=this.getDataset();
		if(dataset!=null){
			commandParams.setValue("viewInstanceId",dataset._viewModel._instanceId);
			var xmlDoc,domDoc;
			if(browserType==__Browser_IE){
				xmlDoc=new ActiveXObject("Msxml.DOMDocument");
				domDoc=xmlDoc;
				
			}else {
				xmlDoc=$$("DOM");
				domDoc=document;
				
			};
			var rpcNode=domDoc.createElement("rpc");
			xmlDoc.appendChild(rpcNode);
			rpcNode.setAttribute("datasetId",dataset.id);
			rpcNode.setAttribute("datasetType",dataset._type);
			rpcNode.setAttribute("pageIndex",dataset._recordset._pageIndex);
			rpcNode.setAttribute("pageSize",dataset._pageSize);

			var paramNode=_$populateParameXML(domDoc,dataset._parameters);
			if(paramNode!=null)rpcNode.appendChild(paramNode);
		
			var propNode=_$populateViewPropertiesXML(domDoc,dataset._viewModel._properties);
			if(propNode!=null)rpcNode.appendChild(propNode);
		
			var orderbyNode=_$populateRPCOrderXML(domDoc,dataset._orderbys);
			if(orderbyNode!=null)rpcNode.appendChild(orderbyNode);

			commandParams.setValue("maxRow",this._maxRow);
			if(this._fileName){
				commandParams.setValue("fileName",this._fileName);
				
			};
			var table=this.getTemplate();
			if(table!=null){
				var tNode=domDoc.createElement("t");
				var columns=table._columns;
				var columnCount=columns.size();
				for(var i=0;i<columnCount;i++){
					var column=columns.get(i);
					if(column._type=="group"){
						var gNode=domDoc.createElement("g");
						gNode.setAttribute("label",_$encode(column._label));
						var subColumns=column._columns._objectArray;
						for(var j=0;j<subColumns.length;j++){
							var subColumn=subColumns[j];
							var cNode=_$getColumnInfoXML(domDoc,subColumn,dataset);
							if(cNode!=null)gNode.appendChild(cNode);
							
						}
						tNode.appendChild(gNode);
					}else {
						var cNode=_$getColumnInfoXML(domDoc,column,dataset);
						if(cNode!=null)tNode.appendChild(cNode);
						
					}
				};
				rpcNode.appendChild(tNode);
				
			}
			else{
				var tNode=domDoc.createElement("t");
				var fields=dataset._fields;
				var fieldCount=fields.size();
				for(var i=0;i<fieldCount;i++){
					var field=fields.get(i);
					var cNode=domDoc.createElement("c");
					cNode.setAttribute("field",field._name);
					cNode.setAttribute("label",_$encode(field._label));
					tNode.appendChild(cNode);
				}
				rpcNode.appendChild(tNode);
			}

			var xml;
			if(browserType==__Browser_IE){
				xml=xmlDoc.xml;
				
			}else {
				xml=xmlDoc.innerHTML;
				
			};
			delete xmlDoc;
			xmlDoc=null;
	
			commandParams.setValue("xml",xml);
		};
	
		return this._$execute(commandParams,dialogParam);
		
	}catch(e){
		_$processException(e);
		
	}
};


var __ReportCommand_EXPORTMODE_OUTPUT="output";
var __ReportCommand_EXPORTMODE_DOWNLOAD="download";
var __ReportCommand_EXPORTMODE_PRINT="print";
var __ReportCommand_EXPORTMODE_PREVIEW="preview";
var __ReportCommand_EXPORTTYPE_XLS="xls";
var __ReportCommand_EXPORTTYPE_XLS="pdf";
var __ReportCommand_EXPORTTYPE_HTML="html";
var __ReportCommand_EXPORTTYPE_RTF="rtf";
function ReportCommand(id,viewModel){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	this._exportMode=__ReportCommand_EXPORTMODE_DOWNLOAD;
	this._exportType=__ReportCommand_EXPORTTYPE_XLS;
	this._template=null;
	this._onlyCurrentPage=false;
	this._reportDatasets=null;
	this._datasetParameterNames=null;
	this._reportParameters=new ParameterSet();
	this._parameters=new ParameterSet();
	this._reportDatasetArray=new Array();
	this._datasetParameterNameArray=new Array();
	this._frame=new Frame();
	
};
ReportCommand.prototype=new AbstractRequestCommand();
KingfisherFactory._$registerComponentType("ReportCommand",function (id,viewModel){
	return new ReportCommand(id,viewModel);
	
});
ReportCommand.prototype.destroy=function (){
	
};
ReportCommand.prototype.getReportDatasets=function (){
	return this._reportDatasets;
	
};
ReportCommand.prototype.setReportDatasets=function (reportDatasets){
	this._reportDatasets=reportDatasets;
	if(reportDatasets!=null){
		this._reportDatasetArray=reportDatasets.split(",");
		
	}
	
};
ReportCommand.prototype.getDatasetParameterNames=function (){
	return this._datasetParameterNames;
	
};
ReportCommand.prototype.setDatasetParameterNames=function (datasetParameterNames){
	this._datasetParameterNames=datasetParameterNames;
	if(datasetParameterNames!=null){
		this._datasetParameterNameArray=datasetParameterNames.split(",");
		
	}
	
};
ReportCommand.prototype.getExportMode=function (){
	return this._exportMode;
	
};
ReportCommand.prototype.setExportMode=function (exportMode){
	this._exportMode=exportMode;
	
};
ReportCommand.prototype.getExportType=function (){
	return this._exportType;
	
};
ReportCommand.prototype.setExportType=function (exportType){
	this._exportType=exportType;
	
};
ReportCommand.prototype.isOnlyCurrentPage=function (){
	return this._onlyCurrentPage;
	
};
ReportCommand.prototype.setOnlyCurrentPage=function (onlyCurrentPage){
	this._onlyCurrentPage=onlyCurrentPage;
	
};
ReportCommand.prototype.getFileName=function (){
	return this._fileName;
	
};
ReportCommand.prototype.setFileName=function (fileName){
	this._fileName=fileName;
	
};
ReportCommand.prototype.getTemplate=function (){
	return kingfisher.feather.getControl(this._template);
	
};
ReportCommand.prototype.setTemplate=function (template){
	
	this._template=template;
	
};
ReportCommand.prototype.parameters=function (){
	return this._parameters;
	
};
ReportCommand.prototype.reportParameters=function (){
	return this._reportParameters;
	
};
ReportCommand.prototype._$populateReportParameXML=function(xmlDoc,elementParams){
	var parameters=elementParams._parameters;
	var size=parameters.size();
	if(size>0){
		var paramNode=xmlDoc.createElement("reportParameters");
		for(var i=0;i<size;i++){
			var parameter=parameters._objectArray[i];
			var pNode=xmlDoc.createElement("p");
			paramNode.appendChild(pNode);
			pNode.setAttribute("name",parameter._name);
			var dataType=parameter._dataType;
			if(dataType!=1){
				pNode.setAttribute("dataType",dataType);
				
			};
			var value=parameter._value;
			if(value!=null){
				if(browserType==__Browser_IE){
					pNode.text=_$encode(value);
					
				}
				else {
					pNode.innerText=_$encode(value);
					
				}
			}
		};
		return paramNode;
		
	}else {
		return null;
		
	}
};
ReportCommand.prototype.populateParam=function(){
	if(this._disabled){
		alert("Command \""+this.id+"\" is disabled!");
		return false;
		
	};
	if(this._template==null){
		alert("Command \""+this.id+"\" the template property is not setter!");
		return false;
	}

	var commandParams=this._parameters;
	this.setPath(__CONTEXT_PATH+"/kingfisher/exportReport.do");
	

	if(this._reportDatasetArray.length>0){
		var xmlDoc,domDoc;
		if(browserType==__Browser_IE){
			xmlDoc=new ActiveXObject("Msxml.DOMDocument");
			domDoc=xmlDoc;
				
		}else {
			xmlDoc=$$("DOM");
			domDoc=document;
				
		};
		var rpcNode=domDoc.createElement("rpc");
		xmlDoc.appendChild(rpcNode);

		//2010 03 25 ����� Add
		var paramsNode=this._$populateReportParameXML(domDoc,this._parameters);
		//alert('XXX:' + paramsNode);
		if(paramsNode!=null) rpcNode.appendChild(paramsNode);
		//End qwj
		commandParams.clear();

		commandParams.setValue("exportMode",this._exportMode);
		commandParams.setValue("exportType",this._exportType);
		commandParams.setValue("onlyCurrentPage",this._onlyCurrentPage);
		commandParams.setValue("template",this._template);
		commandParams.setValue("idcard",this.id);
		if(this._fileName){
			commandParams.setValue("fileName",this._fileName);
					
		};
		commandParams.setValue("viewInstanceId",this._viewModel._instanceId);
			
		var defNode=domDoc.createElement("def");
		rpcNode.appendChild(defNode);
		for(var i=0;i<this._reportDatasetArray.length;i++){
			
			var dataset=kingfisher.feather.getDataset(this._reportDatasetArray[i]);
			if(dataset){
				var datasetNode=domDoc.createElement("dataset");
				defNode.appendChild(datasetNode);
				datasetNode.setAttribute("datasetId",dataset.id);
				datasetNode.setAttribute("datasetType",dataset._type);
				datasetNode.setAttribute("pageIndex",dataset._recordset._pageIndex);
				datasetNode.setAttribute("pageSize",dataset._pageSize);
				if(this._datasetParameterNameArray.length > i)
					datasetNode.setAttribute("datasetParameterName",this._datasetParameterNameArray[i]);
		
				var paramNode=_$populateParameXML(domDoc,dataset._parameters);
				if(paramNode!=null)datasetNode.appendChild(paramNode);
				
				var propNode=_$populateViewPropertiesXML(domDoc,dataset._viewModel._properties);
				if(propNode!=null)datasetNode.appendChild(propNode);
				
				var orderbyNode=_$populateRPCOrderXML(domDoc,dataset._orderbys);
				if(orderbyNode!=null)datasetNode.appendChild(orderbyNode);
			}
		}
		
		var paramNode=this._$populateReportParameXML(domDoc,this._reportParameters);
		if(paramNode!=null)rpcNode.appendChild(paramNode);

		var xml;
		if(browserType==__Browser_IE){
			xml=xmlDoc.xml;
			
		}else {
			xml=xmlDoc.innerHTML;
			
		};
		delete xmlDoc;
		xmlDoc=null;
		//alert("XML:" +xml);
		//alert(xml.length);
		commandParams.setValue("xml",xml);
	}
	else {
		commandParams.setValue("exportMode",this._exportMode);
		commandParams.setValue("exportType",this._exportType);
		commandParams.setValue("onlyCurrentPage",this._onlyCurrentPage);
		commandParams.setValue("template",this._template);
		commandParams.setValue("idcard",this.id);
		if(this._fileName){
			commandParams.setValue("fileName",this._fileName);
					
		};
		commandParams.setValue("viewInstanceId",this._viewModel._instanceId);
	}

	return true;
};

/*
var __Loading_APPLET=null;
ReportCommand.prototype._$loadingApplet=function (){
	if(__Loading_APPLET==null){
		__Loading_APPLET=$$("DIV");
		__Loading_APPLET._appletId="reportApplet"+_$genControlId();
		__Loading_APPLET.style.position="absolute";
		__Loading_APPLET.style.left=0;
		__Loading_APPLET.style.top=0;
		__Loading_APPLET.innerHTML="<applet name=\""+__Loading_APPLET._appletId+"\" code=\"com.keem.kingfisher.feather.views.jasperreports.applet.PrintReport\" archive=\"" + __CONTEXT_PATH + "/exhibit/lib/jasperreports-applet.jar\" width=0 height=0 MAYSCRIPT></applet>";
		document.body.appendChild(__Loading_APPLET);
		
	};
	
	return __Loading_APPLET._appletId;
};
*/
ReportCommand.prototype.execute=function (dialogParam){
	
	try{
		this._$fireBeforeExecute();

		if((this._exportMode==__ReportCommand_EXPORTMODE_PREVIEW && this._exportType==__ReportCommand_EXPORTTYPE_HTML) ||
				this._exportMode==__ReportCommand_EXPORTMODE_OUTPUT){
			//��ɱ���url
			if(!this.populateParam())	return;
			//alert(this._parameters);
			this._method="get";
			var frame=this._frame;
			frame.setTarget(__Frame_TARGET_BLANK);
			//frame.setTarget(__Frame_TARGET_TOP);
			frame.setWidth(window.screen.width - 10);
			frame.setHeight(window.screen.height - 58);
			frame.setCenter(false);
			frame.setResizable(true);
			frame.setScroll(true);
					
			this._$showOpenWindow(this._parameters, frame);
			
			return true;
		}
		/*
		else{
			if(this._exportMode==__ReportCommand_EXPORTMODE_PRINT){
				if(!kingfisher.utils.checkJVM()){
					alert(__REPORTCOMMAND_FAILED);
					return false;
				}
					
				var printControlId=this._$loadingApplet();
				eval("var obj=document.all."+printControlId);
				if(!obj){
					alert("report applet is invalid. please install JRE version 5.0 or upper");
					return false;
				}
				else{
					eval("obj.printAction('"+ this.id +"');");
					
					return true;
				}
			}
			else if(this._exportMode==__ReportCommand_EXPORTMODE_PREVIEW){
				if(!kingfisher.utils.checkJVM()){
					alert(__REPORTCOMMAND_FAILED);
					return false;
				}
					
				var printControlId=this._$loadingApplet();
				eval("var obj=document.all."+printControlId);
				if(!obj){
					alert("report applet is invalid. please install JRE version 5.0 or upper");
					return false;
				}
				else{
					eval("obj.viewAction('"+ this.id +"');");
					
					return true;
				}
			}
			else{
				this._frame.setTarget(__Frame_TARGET_SELF);
				if(!this.populateParam())	return;
		
				return this._$execute(this._parameters,dialogParam);
			}
		}
		*/
		
	}catch(e){
		_$processException(e);
		
	}
};


// SubmitFormDatasetCommand
function SubmitFormDatasetCommand(id,viewModel) {
	if(!id)id=_$genControlId();
	this.id = id;
	this._viewModel=viewModel;
	this._action="";
	this._method="get";
	this._target="_self";
	this._dataset=null;
};

SubmitFormDatasetCommand.prototype = new Command();
KingfisherFactory._$registerComponentType("SubmitFormDatasetCommand",function (id,viewModel){
	return new SubmitFormDatasetCommand(id,viewModel);
	
});
SubmitFormDatasetCommand.prototype.getAction=function() {
	return this._action;
};

SubmitFormDatasetCommand.prototype.setAction=function(action) {
	this._action = action;
};

SubmitFormDatasetCommand.prototype.getMethod=function() {
	return this._method;
};

SubmitFormDatasetCommand.prototype.setMethod=function(method) {
	this._method = method;
};

SubmitFormDatasetCommand.prototype.getTarget=function() {
	return this._target;
};

SubmitFormDatasetCommand.prototype.setTarget=function(targ) {
	this._target = targ;
};

SubmitFormDatasetCommand.prototype.getDataset=function() {
	return this._dataset;
};

SubmitFormDatasetCommand.prototype.setDataset=function(dataset) {
	this._dataset = dataset;
};

// Methods
SubmitFormDatasetCommand.prototype.execute=function() {
	var form = null;
	try {
		this._$fireBeforeExecute();

		var _dataset = this.getDataset();
		var _action = this.getAction();
		var _method = this.getMethod();
		var _target = this.getTarget();

		form = $$("<form style=\"visibility: hidden\"></form>");
		form.insertAdjacentHTML("beforeEnd", "<input name=\"viewInstanceId\" value=\"" + this._viewModel._instanceId + "\">");
		form.insertAdjacentHTML("beforeEnd", "<input name=\"idcard\" value=\"" + this.id + "\">");

		if(_action.lastIndexOf("?") != -1){
			var paras=_action.substr(_action.lastIndexOf("?")+1);
			_action=_action.substr(0,_action.lastIndexOf("?"));
			var paraList = paras.split("&");
			if(paraList != null){
				for(var i=0; i<paraList.length;i++){
					var subpara = paraList[i].split("=");
					form.insertAdjacentHTML("beforeEnd", "<input name=\""+subpara[0]+"\" value=\"" + subpara[1] + "\">");
				}
			}
		}

		if (_dataset) {
			if(typeof(_dataset) == "string")
				_dataset=kingfisher.feather.getDataset(_dataset);
			if (!_dataset.postRecord()) {
				return false;
			}
			
			var count = _dataset.getFieldCount();
			_dataset.disableControls();
			try {
			  _dataset.moveFirst();
			  var record = _dataset.getFirstRecord();
			  while (record) {
					for (var i=0; i<count; i++){
						form.insertAdjacentHTML("beforeEnd", "<input name=\"" + _dataset.getField(i).getName() + "\" value=\"" + _dataset.getValue(i) + "\">");
					}
			    record = record.getNextRecord();
			  }  
			}
			finally {
			  _dataset.enableControls();
			}
			document.body.appendChild(form);
		}
		else
			document.body.appendChild(form);
		form.action=__CONTEXT_PATH + _action;;
		form.method=_method;
		form.submit();

		this._$fireOnSuccess();
		
		return true;
	}
	catch(e) {
		if (this._$fireOnFailure()) {
			_$processException(e);
		}
		return false;
	}
  finally {
		if(form) form.removeNode(true);
  }
};



var __Menu_List=new Array();
var __Standard_MenuItem=null;
var __Standard_MenuBreak=null;
var __Standard_Outlookbar_IconGroup=null;
var __Standard_Outlookbar_ListGroup=null;
function _$getStandardMenuItem(){
	if(__Standard_MenuItem==null){
		var row,cell;
		row=$$("TR");
		row.className="MenuItem";
		cell=$$("TD");
		cell.className="LeftTD";
		cell.style.width="20";
		row.appendChild(cell);
		cell=$$("TD");
		cell.className="CenterTD";
		cell.style.width="4";
		cell.innerText="��";
		row.appendChild(cell);
		cell=$$("TD");
		cell.className="CenterTD";
		cell.style.whiteSpace="nowrap";
		row.appendChild(cell);
		cell=$$("TD");
		cell.className="CenterTD";
		cell.style.whiteSpace="nowrap";
		cell.align="right";
		row.appendChild(cell);
		cell=$$("TD");
		cell.className="RightTD";
		cell.style.width="16";
		row.appendChild(cell);
		__Standard_MenuItem=row;
		
	};
	return __Standard_MenuItem;
	
};
function _$getStandardMenuBreak(){
	if(__Standard_MenuBreak==null){
		var row,cell;
		row=$$("TR");
		row.className="MenuBreak";
		cell=$$("TD");
		cell.className="LeftTD";
		cell.style.width="20";
		row.appendChild(cell);
		cell=$$("TD");
		cell.style.width="4";
		cell.innerText="��";
		row.appendChild(cell);
		cell=$$("TD");
		cell.colSpan=2;
		var hr=$$("HR");
		cell.appendChild(hr);
		row.appendChild(cell);
		__Standard_MenuBreak=row;
		
	};
	return __Standard_MenuBreak;
	
};
function _$getStandardIconGroup(){
	function _$buildGroupButton(button){
		var html="<TABLE cellPadding=\"0\" cellSpacing=\"0\" style=\"height: 100%; table-layout: fixed\">"+"<TR><TD align=\"center\" style=\"width: 100%\"><IMG class=\"SubIcon\"></TD>"+"<TD rowSpan=\"2\" style=\"width: 4\"></TD></TR>"+"<TR><TD align=\"center\"><DIV class=\"SubLabel\"></TD></TR></TABLE>";
		button.innerHTML=html;
		
	};
	if(__Standard_Outlookbar_IconGroup==null){
		var button=$$("DIV");
		_$buildGroupButton(button);
		var cell=$$("TD");
		cell.align="center";		
		cell.appendChild(button);
		var row=$$("TR");
		row.appendChild(cell);
		__Standard_Outlookbar_IconGroup=row;
		
	};
	return __Standard_Outlookbar_IconGroup;
	
};
function _$getStandardListGroup(){
	function _$buildGroupButton(button){
		var html="<TABLE cellPadding=\"0\" cellSpacing=\"0\" style=\"width: 100%; height: 100%\">"+"<TR><TD align=\"center\" style=\"width: 1\"><IMG class=\"SubIcon\"></TD>"+"<TD><DIV class=\"SubLabel\"></TD><TD style=\"width: 8\"></TD></TR></TABLE>";
		button.innerHTML=html;
		
	};
	if(__Standard_Outlookbar_ListGroup==null){
		var button=$$("DIV");
		_$buildGroupButton(button);
		var cell=$$("TD");
		cell.align="center";
		cell.appendChild(button);
		var row=$$("TR");
		row.appendChild(cell);
		__Standard_Outlookbar_ListGroup=row;
		
	};
	return __Standard_Outlookbar_ListGroup;
	
};
function _$releaseMenuPublicResource(){
	__Standard_MenuItem=null;
	__Standard_MenuBreak=null;
	__Standard_Outlookbar_IconGroup=null;
	__Standard_Outlookbar_ListGroup=null;
	delete __Menu_List;
	
};
_$registerFinalizeProcedure(_$releaseMenuPublicResource);

//����Ҽ�
function _$Document_onContextMenu(){
	var targ=_$getEventTarget();
	for(var i=0;i<__Menu_List.length;i++){
		var menu=__Menu_List[i];
		var popupContais=menu.getPopupContainer();
		if(popupContais!=null){
			var popupContai=popupContais.split(",");
			for(var j=0;j<popupContai.length;j++){
				var id=popupContai[j];
				var windowContainer=null;
				try{
					windowContainer=eval(id);
				}
				catch(e){}
				
				if(windowContainer==null){
					windowContainer=$(id);
					
				};
				if(windowContainer!=null){
					if(_$equals(windowContainer,targ)){
						menu._popupElement=windowContainer;
						var box=menu._$getPopupMenu(menu._topItem);
						if(box!=null){
							var x,y;
							if(browserType==__Browser_IE){
								x=event.clientX;
								y=event.clientY;
								
							}else {
								x=event.pageX-3;
								y=event.pageY-3;
								
							};
							box.style.left=x;
							box.style.top=y;
							box.show();
							menu._$locatePopupMenu(box,targ,"popup");
							if(browserType==__Browser_IE){
								box._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",1000);
								
							};
							event.returnValue=false;
							event.cancelBubble=true;
							break;
							
						}
					}
				}
			}
		}
	}
};
EventManager.addSystemEvent(document,"oncontextmenu",function (){
	_$Document_onContextMenu();
	
});


var __MenuItem_TYPE_MENUITEM="MenuItem";
var __MenuItem_TYPE_MENUBREAK="MenuBreak";
function MenuItem(name,label){
	this._name=name;
	this._label=(label)?label:name;
	this._icon=null;
	this._disableIcon=null;
	this._disabled=false;
	this._visible=true;
	this._path=null;
	this._command=null;	
	this._tag=null;
	this._innerMethod=null;
	this._type=__MenuItem_TYPE_MENUITEM;
	
};
MenuItem.prototype.destroy=function (){
	if(this._subPopupMenu!=null){
		if(this._subPopupMenu._opened){
			this._subPopupMenu.hide();
			
		};
		this._subPopupMenu=null;
		
	};
	var items=this.getItems();
	var size=items.size();
	for(var i=0;i<size;i++){
		var item=items.get(i);
		item.destroy();
		
	}
};
MenuItem.prototype.getName=function (){
	return this._name;
	
};
MenuItem.prototype.getType=function (){
	return this._type;
	
};
MenuItem.prototype.setType=function (itemType){
	this._type=itemType;
	
};
MenuItem.prototype.getLabel=function (){
	return this._label;
	
};
MenuItem.prototype.setLabel=function (label){
	this._label=label;
	
};
MenuItem.prototype.getIcon=function (){
	return this._icon;
	
};
MenuItem.prototype.setIcon=function (icon){
	this._icon=icon;
	
};
MenuItem.prototype.getDisableIcon=function (){
	return this._disableIcon;
	
};
MenuItem.prototype.setDisableIcon=function (disableIcon){
	this._disableIcon=disableIcon;
	
};
MenuItem.prototype.isDisabled=function (){
	return this._disabled;
	
};
MenuItem.prototype.setDisabled=function (disabled){
	this._disabled=disabled;
	
};
MenuItem.prototype.isVisible=function (){
	return this._visible;
	
};
MenuItem.prototype.setVisible=function (visible){
	this._visible=visible;
	
};
MenuItem.prototype.getPath=function (){
	
	return this._path;
	
};
MenuItem.prototype.setPath=function (path){
	if ((path.length>0) && (path.substr(0,4)=='http'))
	{

	}
	else if(path.length>0&&path.charAt(0)=='/'){
		path=__CONTEXT_PATH+path;
		
	};
	this._path=path;
	
};
MenuItem.prototype.getCommand=function (){
	return kingfisher.feather.getControl(this._command);
	
};
MenuItem.prototype.setCommand=function (command){
	this._command=command;
	
};
MenuItem.prototype._$getInnerMethod=function (){
	return this._innerMethod;
	
};
MenuItem.prototype._$setInnerMethod=function (innerMethod){
	this._innerMethod=innerMethod;
	
};
MenuItem.prototype.getTag=_$Element_getTag;
MenuItem.prototype.setTag=_$Element_setTag;
MenuItem.prototype.getItems=function (){
	if(this._items==null){
		this._items=new HashList();
		
	};
	return this._items;
	
};
MenuItem.prototype.addItem=function (item){
	item._parent=this;
	var items=this.getItems();
	items.put(item._name,item);
	item._$bindingMenu(this._menu);
	
};
MenuItem.prototype.removeItem=function (item){
	this.getItems().remove(item._name);
	item._parent=null;
	item._$bindingMenu(null);
	
};
MenuItem.prototype.getItem=function (name){
	return this._items.get(name);
	
};
MenuItem.prototype.remove=function (){
	this._parent.removeItem(this);
	
};
MenuItem.prototype.click=function (){
	var menu=this._menu;
	var popupElement=menu._popupElement;
	menu._$hiden();
	menu._popupElement=popupElement;
	var result=_$fireKingfisherEvent(menu,"onItemClick",[menu,this]);
	if(result)	return;
	menu._popupElement=null;

	var innerMethod=this._$getInnerMethod();
	if(innerMethod!=null){
		eval(innerMethod+"(menu,this)");
	}
	else{
		var command=this.getCommand();
		if(command!=null){
			command.execute();
				
		}else {
			var path=this._path;
			if(path!=null){
				if(menu._target!=null){
						
					open(path,menu._target);
					
				}else {
					open(path,"_self");
						
				}
			}
		}
	}
};
MenuItem.prototype._$bindingMenu=function (menu){
	this._menu=menu;
	var items=this.getItems();
	var size=items.size();
	for(var i=0;i<size;i++){
		var item=items.get(i);
		item._$bindingMenu(menu);
		
	}
};



function Menu(id,viewModel,loadDataAction){
	if(!id)id=_$genControlId();
	this.id=id;
	this._viewModel=viewModel;
	var topItem=new MenuItem();
	topItem._$bindingMenu(this);
	this._topItem=topItem;
	this._popupMenu=null;
	this._popupContainer=null;
	this._popupElement=null;
	this._shadowEnabled=true;
	this._viaduct=false;
	this._disabled=false;
	this._loadDataAction=loadDataAction;
	__Menu_List.push(this);
	this._$initMenu();
	
};
Menu.prototype=new KingfisherComponent();
KingfisherFactory._$registerComponentType("Menu",function (id,viewModel,loadDataAction){
	return new Menu(id,viewModel,loadDataAction);
	
});
Menu.prototype.destroy=function (){
	this._$hiden();
	this._topItem.destroy();
	this._topItem._$bindingMenu(null);
	
};
Menu.prototype.getTopItem=function (){
	return this._topItem;
	
};
Menu.prototype._$clearMenuItem=function (){
	this._topItem.getItems().clear();
	
};
Menu.prototype._$initMenu=function (){
	if(this._isParsed)return ;
	this._isParsed=true;	
	var xmlDoc=$("__"+this.id);
	if(xmlDoc==null && this._loadDataAction){

		var loadDataAction=this._loadDataAction;
		if(loadDataAction && loadDataAction.length>0&&loadDataAction.substring(0,__CONTEXT_PATH.length)!=__CONTEXT_PATH){
			loadDataAction=__CONTEXT_PATH+'/'+loadDataAction;
			
		};
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.load(loadDataAction);
	}

	if (!xmlDoc) return;
	var xmlRoot;
	if(browserType==__Browser_IE){
		xmlRoot=xmlDoc.documentElement;
			
	}else {
		xmlRoot=xmlDoc.getElementsByTagName("items")[0];
			
	};
	if(xmlRoot!=null){
		this._$initMenuItems(this._topItem,xmlRoot,1);
			
	}
};
Menu.prototype._$initMenuItems=function (item,xmlNode){
	var childXmlNodes=xmlNode.childNodes;
	for(var i=0;i<childXmlNodes.length;i++){
		var childXmlNode=childXmlNodes[i];
		if(browserType==__Browser_IE||childXmlNode.nodeName.charAt(0)!='#'){
			var newItem;
			if(childXmlNode.nodeName=="break"){
				newItem=new MenuItem("__MenuBreak"+_$autoGenIndex());
				newItem._type=__MenuItem_TYPE_MENUBREAK;
			}
			else{
				newItem=new MenuItem(childXmlNode.getAttribute("name"));
				newItem._label=unescape(childXmlNode.getAttribute("label"));
				newItem._path=childXmlNode.getAttribute("path");
				newItem._icon=childXmlNode.getAttribute("icon");
				newItem._disableIcon=childXmlNode.getAttribute("disableIcon");
				newItem._disabled=parseBoolean(childXmlNode.getAttribute("disabled"));
				var visible=childXmlNode.getAttribute("visible");
				if(visible!=null){
					newItem._visible=parseBoolean(visible);
					
				};
				newItem._command=childXmlNode.getAttribute("command");
				newItem._tag=childXmlNode.getAttribute("tag");
				
				newItem.accessKey=childXmlNode.getAttribute("accessKey");
				newItem.hotKey=childXmlNode.getAttribute("hotKey");
				if(newItem.hotKey || newItem.accessKey){
					HotKeyManager.addHotKeyElement(newItem);
				}
			}
			this._$initMenuItems(newItem,childXmlNode);
			item.addItem(newItem);
			
		}
	}
};
Menu.prototype.setTarget=function (targ){
	this._target=targ;
	
};
Menu.prototype.getTarget=function (){
	return this._target;
	
};
Menu.prototype.setShadowEnabled=function (shadowEnabled){
	this._shadowEnabled=shadowEnabled;
	
};
Menu.prototype.isShadowEnabled=function (){
	return this._shadowEnabled;
	
};
Menu.prototype.setMenuItemDisabled=function (itemname,disabled){

	this._$setItemDisabled(this._topItem,itemname,disabled);
};
Menu.prototype._$setItemDisabled=function (menuitem,itemname,disabled){
	var items=menuitem.getItems();
	var size=items.size();
	for(var i=0;i<size;i++){
		var item=items.get(i);
		if(item._name==itemname){
			item._disabled=disabled;
			return;
		};
		this._$setItemDisabled(item,itemname,disabled);
	};
	
};
Menu.prototype.setMenuItemVisible=function (itemname,visible){

	this._$setItemVisible(this._topItem,itemname,visible);
};
Menu.prototype._$setItemVisible=function (menuitem,itemname,visible){
	var items=menuitem.getItems();
	var size=items.size();
	for(var i=0;i<size;i++){
		var item=items.get(i);
		if(item._name==itemname){
			item._visible=visible;
			return;
		};
		this._$setItemVisible(item,itemname,visible);
	};
	
};
Menu.prototype.setPopupContainer=function (popupContainer){
	this._popupContainer=popupContainer;
	
};
Menu.prototype.getPopupContainer=function (){
	return this._popupContainer;
	
};
Menu.prototype.getPopupElement=function (){
	return this._popupElement;	
	
};
Menu.prototype.setItemWidth=function (itemWidth){
	this._itemWidth=itemWidth;
	
};
Menu.prototype._$getPopupMenu=function (subItem){
	var items=subItem.getItems();
	var size=items.size();
	if(size>0){
		var box=subItem._subPopupMenu;
		if(box==null){
			box=_$buildPopupMenu(subItem,this._itemWidth);
			subItem._subPopupMenu=box;
			
		};
		box.refresh();
		return box;
		
	}else {
		return null;
		
	}
};
Menu.prototype._$locatePopupMenu=function (frame,element,locateMode){
	switch (locateMode){
		case "buttonHolder":
		case "button":{
			var pos=_$getAbsolutePosition(element);
		
			if (pos[0]+frame.offsetWidth>document.body.clientWidth-2)
				frame.style.left=document.body.clientWidth-2-frame.offsetWidth;
			else
				frame.style.left=pos[0];
		
			if (pos[1]+element.offsetHeight+frame.offsetHeight>document.body.clientHeight-1)
				frame.style.top=document.body.clientHeight-1-frame.offsetHeight-1;
			else
				frame.style.top=pos[1]+element.offsetHeight+1;
			if(locateMode=="buttonHolder"){
				frame.style.left=parseInt(frame.style.left)-1;
				frame.style.top=parseInt(frame.style.top)+1;
			}
			break;
		}
		case "popup":{
			if (event.x+frame.offsetWidth>document.body.clientWidth)
				frame.style.left=event.x-frame.offsetWidth+2;
	
			if (event.y+frame.offsetHeight>document.body.clientHeight)
				frame.style.top=event.y-frame.offsetHeight+4;
			
			break;
		}
	}
};
Menu.prototype._$hiden=function (){
	if(this._popupMenu!=null){
		this._popupMenu.hide();
		this._popupMenu=null;
		
	}
};
//�Ƿ���������пؼ�֮�ϣ���applet,Ĭ����false,�����ٶ�
Menu.prototype.setViaduct=function (viaduct){
	
	this._viaduct=viaduct;
};
Menu.prototype.isViaduct=function (){
	
	return this._viaduct;
};
/**
 * ���ò˵��Ƿ����в˵���ȫ������
 * @param disabled
 */
Menu.prototype.setDisabled=function (disabled){
	
	this._disabled=disabled;
};
/**
 * ���ز˵��Ƿ����в˵���ȫ������
 */
Menu.prototype.isDisabled=function (){
	
	return this._disabled;
};


function _$buildPopupMenu(item,itemWidth){
	var table=$$("TABLE");
	table.style.width="100%";
	table.cellPadding=0;
	table.cellSpacing=0;
	var tbody=$$("TBODY");
	table.appendChild(tbody);
	box=$$("DIV");
	if(itemWidth)
		box.style.width=itemWidth;
	box.appendChild(table);
	_$setDisplay(box,false);
	document.body.appendChild(box);
	EventManager.addSystemEvent(table,"onclick",function (){
		_$PopupMenu_onClick();
		
	});
	EventManager.addSystemEvent(table,"onmouseover",function (){
		_$PopupMenu_onMouseOver();
		
	});
	EventManager.addSystemEvent(table,"onmouseout",function (){
		_$PopupMenu_onMouseOut();
		
	});	

	if(!box._iframe&&item._menu._viaduct){
		var iframe=$$("<iframe id=\"menuframe" + _$genControlId() + "\" style='DISPLAY: none; FILTER: Alpha(opacity=0);POSITION: absolute;' frameBorder='0' scrolling='no' src='javascript:false'></iframe>");
		document.body.appendChild(iframe);
		box._iframe=iframe;
	}

	box.id=_$genControlId();
	box.className="PopupMenu";
	box.style.position="absolute";
	box._kingfisherClass="PopupMenuBox";
	box._menuItem=item;
	box._opened=false;
	box._hotItem=null;
	box._expandedItem=null;
	box.refresh=_$PopupMenu_refresh;
	box.show=_$PopupMenu_show;
	box.hide=_$PopupMenu_hide;
	box._$hidePrevPopup=_$PopupMenu_hidePrevPopup;
	box.expand=_$PopupMenu_expand;
	box._$expandSubMenu=_$PopupMenu_expandSubMenu;
	box._$refreshMenuItemStyle=_$PopupMenu_refreshMenuItemStyle;
	box._$showFrame=_$PopupMenu_showFrame;
	return box;
	
};
function _$PopupMenu_refresh(){

	var menu=this._menuItem._menu;
	var result=_$fireKingfisherEvent(menu,"beforeRefreshItem",[menu]);
	if(result!=null){
		throw result;
			
	};

	var tbody=this.firstChild.tBodies[0];
	var itemCount=tbody.rows.length;
	var row,cell,button,menuItemRow;
	var items=this._menuItem.getItems();
	var size=items.size();
	for(var i=0;i<size;i++){
		var item=items.get(i);
		if(!item._visible)continue;
		if(i<itemCount){
			button=tbody.rows[i];
			menuItemRow=button;
			
		}else {
			if(item._type==__MenuItem_TYPE_MENUBREAK){
				button=_$getStandardMenuBreak().cloneNode(true);
				button._kingfisherClass="MenuBreak";
			}
			else{
				button=_$getStandardMenuItem().cloneNode(true);
				button._kingfisherClass="MenuItem";
			}
			menuItemRow=button;
			tbody.appendChild(button);
			
		};
		if(item._type!=__MenuItem_TYPE_MENUBREAK){
			var itemIcon=menuItemRow.cells[0];
			var itemLabel=menuItemRow.cells[2];
			var itemHotKey=menuItemRow.cells[3];
			var subMenuIndicator=menuItemRow.cells[4];
			var menu=item._menu;
			if(menu._onRefreshItem==null||
				_$fireKingfisherEvent(menu,"onRefreshItem",[menu,itemLabel,item])!="abort"){
				itemLabel.innerHTML=item._label;
				
			};
			var currentItemIcon;
			if((menu._disabled || item._disabled)&&item._disableIcon!=null){
				currentItemIcon=item._disableIcon;
				
			}else {
				currentItemIcon=item._icon;
				
			};
			var icon=itemIcon.firstChild;
			if(currentItemIcon!=null){
				var hasIcon=(icon!=null&&icon.src==currentItemIcon);
				if(!hasIcon){
					icon=$$("IMG");
					icon.src=currentItemIcon;
					if(itemIcon.firstChild!=null){
						itemIcon.removeChild(itemIcon.firstChild);
						
					};
					itemIcon.appendChild(icon);
					
				}
			}
			else{
				if(icon)
					itemIcon.removeChild(icon);
				itemIcon.appendChild(document.createTextNode("    "));
			}
			
			if(item.hotKey){
				itemHotKey.innerText="����Ctrl+"+item.hotKey+"��";
			}
			else if(item.accessKey){
				itemHotKey.innerText="����Alt+"+item.accessKey+"��";
			}
			else
				itemHotKey.appendChild(document.createTextNode(" "));
			
			if(item._items!=null&&item._items.size()>0){
				var icon=subMenuIndicator.firstChild;
				var hasIcon=(icon!=null);
				if(!hasIcon){
					icon=$$("IMG");
					icon.src=__SKIN_PATH+"/menu_indicator.gif";
					subMenuIndicator.appendChild(icon);
					
				}
			}else {
				if(subMenuIndicator.firstChild!=null){
					subMenuIndicator.removeChild(subMenuIndicator.firstChild);
					subMenuIndicator.innerText="��";
					
				}
				else{
					subMenuIndicator.innerText="��";
				}
			};
			
			button._menuItem=item;
			if(menu._disabled || item._disabled){
				button.className="MenuItem_Disabled";
				
			}else {
				button.className="MenuItem";
				
			}
		}
	}
	//������Ĳ˵���
	for(var i=tbody.rows.length-size;i>0;i--){
		tbody.rows[tbody.rows.length-1].removeNode(true);
	}
};
function _$PopupMenu_show(popup){
	
	var menu=this._menuItem._menu;
	if(popup==null){
		var popupMenu=menu._popupMenu;
		if(popupMenu!=null&&popupMenu._opened){
			popupMenu.hide();
			
		};
		menu._popupMenu=this;
		
	}else {
		popup._$hidePrevPopup();
		popup._prevPopup=this;
		
	};
	
	_$setElementShadow(this,menu._shadowEnabled);
	_$setDisplay(this,true);
	
	if(menu._viaduct){
		clearTimeout(this._frameTimeout);
		this._frameTimeout=setTimeout("$(\""+this.id+"\")._$showFrame($(\""+this.id+"\"));",0);
	}

	this._opened=true;
	
};
function _$PopupMenu_showFrame(box){
	if(box==null)return;
	var absPos=_$getAbsolutePosition(box);
	box._iframe.style.zIndex=_$autoGenIndex();
	box._iframe.style.left=absPos[0];
	box._iframe.style.top=absPos[1];
	box._iframe.style.width=box.offsetWidth;
	box._iframe.style.height=box.offsetHeight;
	_$setDisplay(box._iframe,true);
	box.style.zIndex=_$autoGenIndex();
};
//����ǰһ���򿪵�popup menu//
function _$PopupMenu_hidePrevPopup(){
	if(this._prevPopup!=null&&this._prevPopup._opened){
		this._prevPopup.hide();
		this._prevPopup=null;
		
	}
};
function _$PopupMenu_hide(){
	var menu=this._menuItem._menu;
	menu._popupElement=null;
	clearTimeout(menu._menuTimeout);
	clearTimeout(this._menuTimeout);
	clearTimeout(this._expandSubMenuTimeout);
	this._hotItem=null;
	this._expandedItem=null;
	this._$hidePrevPopup();
	_$setDisplay(this,false);
	if(menu._viaduct)
		_$setDisplay(this._iframe,false);

	this._opened=false;
	
};
function _$PopupMenu_refreshMenuItemStyle(button){
	var oldHotItem=this._hotItem;
	if(oldHotItem!=null){
		var menu=oldHotItem._menuItem._menu;
		if(menu._disabled || oldHotItem._menuItem._disabled){
			oldHotItem.className="MenuItem_Disabled";
			
		}else {
			oldHotItem.className="MenuItem";
			
		}
	};
	if(button==null){
		button=this._expandedItem;
		
	}
	if(button!=null){
		var menu=button._menuItem._menu;
		if(menu._disabled || button._menuItem._disabled){
			button=null;
			
		}else {
			button.className="HotMenuItem";
			
		}
	};
	this._hotItem=button;
	
};
function _$PopupMenu_expand(button){
	var item=button._menuItem;
	var menu=item._menu;
	if(menu._disabled || item._disabled)return ;
	var menu=item._menu;
	var box=menu._$getPopupMenu(item);
	if(box!=null){
		var popup=_$getKingfisherElement(button,"PopupMenuBox");
		box.show(popup);
		var absPos=_$getAbsolutePosition(button);
		var x=absPos[0]+button.offsetWidth-1;
		if(x+box.offsetWidth>document.body.clientWidth){
			x=absPos[0]-box.offsetWidth+1;
			
		};
		if(x<0)x=0;
		box.style.left=x;
		var y=absPos[1]-1;
		if(y+box.offsetHeight>document.body.clientHeight){
			y=absPos[1]+button.offsetHeight-box.offsetHeight+1;
			
		};
		if(y<0)y=0;
		box.style.top=y;
		
	};
	this._expandedItem=button;
	
};
function _$PopupMenu_expandSubMenu(){
	if(this._hotItem!=null){
		this.expand(this._hotItem);
		
	}
};
function _$PopupMenu_onClick(){
	var button=_$getKingfisherElement(_$getEventTarget(),"MenuItem");
	if(button!=null){
		var box=_$getKingfisherElement(button,"PopupMenuBox");
		if(box!=null){
			if(box._expandedItem!=button){
				box.expand(button);
				
			}
		};		
		var item=button._menuItem;
		var menu=item._menu;
		if(item!=null&&!item._disabled&&!menu._disabled){
			if(item.getItems().size()==0)
				item.click();
			
		}
	}
};
function _$PopupMenu_onMouseOver(){
	var targ=_$getEventTarget();
	var box=_$getKingfisherElement(targ,"PopupMenuBox");

	var menu=box._menuItem._menu;
	clearTimeout(menu._menuTimeout);
	clearTimeout(box._menuTimeout);
	var button=_$getKingfisherElement(targ,"MenuItem");
	if(button!=null){

		if(box._expandedItem!=button){
			box._$hidePrevPopup();
			box._expandedItem=null;
		}
		box._$refreshMenuItemStyle(button);
		if(box._expandedItem!=button){
			box._expandSubMenuTimeout=setTimeout("$(\""+box.id+"\")._$expandSubMenu();",600);
			
		}
	}
};
function _$PopupMenu_onMouseOut(){
	var targ=_$getEventTarget();
	var box=_$getKingfisherElement(targ,"PopupMenuBox");
	var menu=box._menuItem._menu;
	menu._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",1000);
	var button=_$getKingfisherElement(targ,"MenuItem");
	if(button!=null){		
		var box=_$getKingfisherElement(button,"PopupMenuBox");
		if(box!=null){
			clearTimeout(box._expandSubMenuTimeout);
			box._menuTimeout=setTimeout("$(\""+box.id+"\")._$refreshMenuItemStyle(null);",300);
			
		}
	}
};



//**************************
//�˵����ؼ�//
//**************************
function _$buildMenuBar(id,viewModel){
	var bar=null;
	if(id){
		bar=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(bar==null){
		bar=$$("TABLE");
		bar.id=id;
		
	};
	if(!bar.className)bar.className="MenuBar";
	bar.getId=_$Component_getId;
	bar.getViewModel=_$Component_getViewModel;
	bar.isActive=_$Component_isActive;
	bar.activate=_$MenuBar_activate;
	bar.destroy=_$MenuBar_destroy;
	bar.getTag=_$Element_getTag;
	bar.setTag=_$Element_setTag;
	bar.getContext=_$Element_getContext;
	bar.setContext=_$Element_setContext;
	bar.refresh=_$MenuBar_refresh;
	bar.getMenu=_$MenuBar_getMenu;
	bar.setMenu=_$MenuBar_setMenu;
	bar.isShowBorder=_$MenuBar_getShowBorder;
	bar.setShowBorder=_$MenuBar_setShowBorder;
	bar._$refreshMenuButtonStyle=_$MenuBar_refreshMenuButtonStyle;
	bar._$showPopupMenu=_$MenuBar_showPopupMenu;
	bar._$clearLeftover=_$MenuBar_clearLeftover;
	bar._$paint=_$MenuBar_paint;
	bar.getBlankPanel=_$MenuBar_getBlankPanel;
	bar._viewModel=viewModel;
	bar._menu=null;
	bar._showBorder=true;
	bar._hotItem=null;
	bar._expandedItem=null;
	return bar;
	
};
KingfisherFactory._$registerComponentType("MenuBar",_$buildMenuBar);
function _$MenuBar_destroy(){
	
	this._hotItem=null;
	this._expandedItem=null;
	this._barRow=null;
	this._blankPanel=null;
	
};
function _$MenuBar_activate(){
	if(!this._active){
		this._$paint();
		this.refresh();
		this._active=true;
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$MenuBar_getBlankPanel(){
	
	return this._blankPanel;
};
function _$MenuBar_getMenu(){
	return kingfisher.feather.getControl(this._menu);
	
};
function _$MenuBar_setMenu(menu){
	this._menu=menu;
	if(this._active){
		this.refresh();
		
	}
};
function _$MenuBar_getShowBorder(){
	return this._showBorder;
	
};
function _$MenuBar_setShowBorder(showBorder){
	this._showBorder=showBorder;
	
};
function _$MenuBar_paint(){
	this.className="MenuBodyBar";
	this.cellPadding=_$getPreferenceSetting("__BodyBar_CellPadding");
	this.cellSpacing=_$getPreferenceSetting("__BodyBar_CellSpacing");
	this.border=_$getPreferenceSetting("__BodyBar_BorderWidth");
	var tbody=$$("TBODY");
	var row=$$("TR");
	var cell=$$("TD");
	cell.vAlign="bottom";
	var table=$$("TABLE");
	table.className="MenuPlateBar";
	table.cellPadding=_$getPreferenceSetting("__MenuBar_CellPadding");
	if(this._showBorder)
		table.border=_$getPreferenceSetting("__MenuBar_BorderWidth");
	else
		table.border=0;
	table.style.borderCollapse=_$getPreferenceSetting("__MenuBar_BorderCollapse");
	table.width="100";
	var tb=$$("TBODY");
	var tbrow=$$("TR");
	var tbcell=$$("TD");
	tbcell.className="MenuBar";
	var table2=$$("TABLE");
	table2.cellPadding=_$getPreferenceSetting("__BodyBar_CellPadding");
	table2.cellSpacing=_$getPreferenceSetting("__BodyBar_CellSpacing");
	table2.border=_$getPreferenceSetting("__BodyBar_BorderWidth");
	var tb2=$$("TBODY");
	var tbrow2=$$("TR");

	tb2.appendChild(tbrow2);
	table2.appendChild(tb2);

	tbcell.appendChild(table2);
	tbrow.appendChild(tbcell);
	tb.appendChild(tbrow);
	table.appendChild(tb);

	cell.appendChild(table);
	row.appendChild(cell);
	cell=$$("TD");
	cell.width="100%";
	row.appendChild(cell);
	this._blankPanel=cell;
	this._barRow=tbrow2;

	tbody.appendChild(row);
	this.appendChild(tbody);
	var bar=this;
	EventManager.addSystemEvent(bar,"onclick",function (){
		_$MenuBar_onClick(bar);
		
	});
	EventManager.addSystemEvent(bar,"onmouseover",function (){
		_$MenuBar_onMouseOver(bar);
		
	});
	EventManager.addSystemEvent(bar,"onmouseout",function (){
		_$MenuBar_onMouseOut(bar);
		
	});
	
};
function _$MenuBar_refresh(){
	function _$refreshSubItem(menu,item,button){
		button._kingfisherClass="MenuBarButton";
		if(menu._disabled||item._disabled){
			button.className="MenuButton_Disabled";
			
		}else {
			button.className="MenuButton";
			button.style.filter="progid:DXImageTransform.Microsoft.Chroma(color=#6593CF)";
			
		};
		button.style.height="100%";
		var row,cell;
		row=$$("TR");
		cell=$$("TD");
		cell.style.whiteSpace="nowrap";
		cell.align="center";
		cell.style.width="100%";
		if(menu._onRefreshItem==null||_$fireKingfisherEvent(menu,"onRefreshItem",[menu,cell,item])){
			var label=item._label;
			if(item._icon!=null)
				label="<img border=\"0\" src=\""+item._icon+"\" align=\"absbottom\">&nbsp;"+label;
			var buttonType=parseInt(_$getPreferenceSetting("__Button_Type",1));
			if(buttonType==2&&item.getItems().size()>0)
				label+="&nbsp;<IMG src=\""+__SKIN_PATH+"/menubar_indicator.gif\" align=\"middle\">";
			cell.innerHTML=label;
			
		};
		row.appendChild(cell);
		var tbody=$$("TBODY");
		tbody.appendChild(row);
		var table=$$("TABLE");
		table.style.height="100%";
		table.cellSpacing=0;
		table.cellPadding=1;
		table.appendChild(tbody);
		button.appendChild(table);
		button._menuItem=item;		
		
	};
	var row=this._barRow;
	for(var i=row.childNodes.length-1;i>=0;i--){
		row.deleteCell(i);
		
	};
	var tbcell2=$$("TD");
	tbcell2.width="10";
	tbcell2.noWrap=true;
	var table3=$$("TABLE");
	table3.cellPadding=_$getPreferenceSetting("__ListSeparator_CellPadding");
	table3.cellSpacing=_$getPreferenceSetting("__ListSeparator_CellSpacing");
	table3.border=_$getPreferenceSetting("__ListSeparator_BorderWidth");
	var tb3=$$("TBODY");
	for(var i=1; i<=4; i++){
		var tbrow3=$$("TR");
		var tbcell3=$$("TD");
		var img=$$("IMG");
		img.className="ListSeparator";
		tbcell3.appendChild(img);
		tbrow3.appendChild(tbcell3);
		tb3.appendChild(tbrow3);
	}
	table3.appendChild(tb3);
	tbcell2.appendChild(table3);
	row.appendChild(tbcell2);
	
	var menu=this.getMenu();
	if(menu!=null){
		var items=menu._topItem.getItems();
		var size=items.size();
		for(var i=0;i<size;i++){
			var item=items.get(i);
			if(!item._visible)continue;
			var cell=$$("TD");
			var button=$$("DIV");
			_$refreshSubItem(menu,item,button);
			cell.appendChild(button);
			row.appendChild(cell);
			
		};
	}
};
function _$MenuBar_refreshMenuButtonStyle(button){
	if(this._hotItem==button)return ;
	var oldHotItem=this._hotItem;
	if(oldHotItem!=null){
		var menu=oldHotItem._menuItem._menu;
		if(menu._disabled||oldHotItem._menuItem._disabled){
			oldHotItem.className="MenuButton_Disabled";
			oldHotItem.style.filter="";
			
		}else {
			oldHotItem.className="MenuButton";
			oldHotItem.style.filter="progid:DXImageTransform.Microsoft.Chroma(color=#6593CF)";
			
		}
	};
	if(button==null){
		button=this._expandedItem;
		
	};
	if(button!=null){
		var menu=button._menuItem._menu;
		if(menu._disabled||button._menuItem._disabled){
			button=null;
			
		}
		else {
			button.className="HotMenuButton";
			button.style.filter="";
			
		}
	};
	this._hotItem=button;
	
};
function _$MenuBar_showPopupMenu(button){
	if(this._expandedItem==button)return ;
	var item=button._menuItem;
	if(item._menu._disabled||item._disabled)return ;
	clearInterval(this._leftoverTimeout);
	var menu=this.getMenu();
	menu._$hiden();
	var timeout;
	var box=menu._$getPopupMenu(item);
	if(box!=null){
		box.show();
		timeout=300;
		var absPos=_$getAbsolutePosition(button);
		var x=absPos[0];
		if(x+box.offsetWidth>document.body.clientWidth){
			x=absPos[0]+button.offsetWidth-box.offsetWidth;
			
		};
		if(x<0)x=0;
		box.style.left=x;
		var y=absPos[1]+button.offsetHeight+2;
		if(y+box.offsetHeight>document.body.clientHeight){
			y=absPos[1]-box.offsetHeight-2;
			
		};
		if(y<0)y=0;
		box.style.top=y;
		
	}else {
		timeout=1500;
		
	};
	this._leftoverTimeout=setInterval("$(\""+this.id+"\")._$clearLeftover();",timeout);
	this._expandedItem=button;
	
};
function _$MenuBar_clearLeftover(){
	var menuHidden=false;
	var menu=this.getMenu();
	var box=menu._popupMenu;
	if(box!=null){
		menuHidden=(!box._opened);
		
	}
	else {
		menuHidden=true;
		
	};
	if(menuHidden){
		clearInterval(this._leftoverTimeout);
		this._expandedItem=null;
		this._$refreshMenuButtonStyle(null);
		
	}
};
function _$MenuBar_onClick(bar){
	var targ=_$getEventTarget();
	if(targ._kingfisherClass=="MenuBarBlank"){
		return ;
		
	};
	var button=_$getKingfisherElement(targ,"MenuBarButton");
	if(button!=null){
		var menu=bar.getMenu();
		var item=button._menuItem;
		if(menu._disabled||item._disabled)return ;
		if(item.getItems().size()>0)
			bar._$showPopupMenu(button);
		else
			item.click();
		
	}
};
function _$MenuBar_onMouseOver(bar){
	var menu=bar.getMenu();
	clearTimeout(menu._menuTimeout);
	var button=_$getKingfisherElement(_$getEventTarget(),"MenuBarButton");
	if(button!=null){
		clearTimeout(bar._menuTimeout);
		bar._$refreshMenuButtonStyle(button);
		if(bar._expandedItem!=null){
			var item=button._menuItem;
			bar._$showPopupMenu(button);			
			
		}
	}
};
function _$MenuBar_onMouseOut(bar){
	var button=_$getKingfisherElement(_$getEventTarget(),"MenuBarButton");
	if(button!=null){
		bar._menuTimeout=setTimeout("$(\""+bar.id+"\")._$refreshMenuButtonStyle(null);",300);
		
	};
	var menu=bar.getMenu();
	menu._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",1000);
	
};




//**************************
//OutlookBarGroup�ؼ�//
//**************************
function OutlookBarGroup(){
	this._div=null;
	this._hasDiv=false;
	
};
OutlookBarGroup.prototype.destroy=function (){
	this._subItemRow=null;
	this._div=null;
	this._outlookBar=null;
	
};
OutlookBarGroup.prototype.getName=function (){
	return this._name;
	
};
OutlookBarGroup.prototype.setDisabled=function (disabled){
	this._disabled=disabled;
	
};
OutlookBarGroup.prototype.getDiv=function (){
	return this._div;
	
};
OutlookBarGroup.prototype.getTag=_$Element_getTag;
OutlookBarGroup.prototype.setTag=_$Element_setTag;
OutlookBarGroup.prototype.getContext=_$Element_getContext;
OutlookBarGroup.prototype.setContext=_$Element_setContext;



//**************************
//DefaultOutlookBarGroup�ؼ�//
//**************************
function DefaultOutlookBarGroup(name){
	this._kingfisherClass="DefaultOutlookBarGroup";
	this._name=name;
	this._label=name;
	this._icon=null;	
	this._disabled=false;
	this._visible=true;
	this._padding=null;
	
};
DefaultOutlookBarGroup.prototype=new OutlookBarGroup();
DefaultOutlookBarGroup.prototype.getLabel=function (){
	return this._label;
	
};
DefaultOutlookBarGroup.prototype.setLabel=function (label){
	this._label=label;
	
};
DefaultOutlookBarGroup.prototype.getIcon=function (){
	return this._icon;
	
};
DefaultOutlookBarGroup.prototype.setIcon=function (icon){
	this._icon=icon;
	
};
DefaultOutlookBarGroup.prototype.isVisible=function (){
	return this._visible;
	
};
DefaultOutlookBarGroup.prototype.setVisible=function (visible){
	this._visible=visible;
	
};
DefaultOutlookBarGroup.prototype.isDisabled=function (){
	return this._disabled;
	
};
DefaultOutlookBarGroup.prototype.setDisabled=function (disabled){
	this._disabled=disabled;
	
};
DefaultOutlookBarGroup.prototype.getPadding=function (){
	return this._padding;
	
};
DefaultOutlookBarGroup.prototype.setPadding=function (padding){
	this._padding=padding;
	
};
DefaultOutlookBarGroup.prototype._$createDiv=function (){
	if(this._hasDiv)return ;
	var div=$(this._outlookBar.id+"_"+this._name);
	if(div==null){
		div=$$("DIV");
		div.id = this._outlookBar.id+"_"+this._name;
	};
	div.className="Group";
	div.style.overflow="hidden";
	div.style.width="100%";
	div.style.height="100%";
	div.style.display="";
	if(this._padding!=null){
		div.style.padding=this._padding;
		
	};
	this._div=div;	
	_$initContainerObject(this._initChildren);
	this._initChildren=null;
	this._hasDiv=true;
	
};



//**************************
//MenuOutlookBarGroup�ؼ�//
//**************************
var __MenuOutlookBarGroup_VIEWMODE_ICON="icon";
var __MenuOutlookBarGroup_VIEWMODE_LIST="list";
function MenuOutlookBarGroup(name){
	this._kingfisherClass="MenuOutlookBarGroup";
	this._name=name;
	this._menuItem=null;
	this._viewMode=__MenuOutlookBarGroup_VIEWMODE_LIST;
	
};
MenuOutlookBarGroup.prototype=new OutlookBarGroup();
MenuOutlookBarGroup.prototype.getMenuItem=function (){
	return this._menuItem;
	
};
MenuOutlookBarGroup.prototype.setMenuItem=function (item){
	this._menuItem=item;
	
};
MenuOutlookBarGroup.prototype.getLabel=function (){
	return this._menuItem._label;
	
};
MenuOutlookBarGroup.prototype.setLabel=function (label){
	this._menuItem._label=label;
	
};
MenuOutlookBarGroup.prototype.getIcon=function (){
	return this._menuItem._icon;
	
};
MenuOutlookBarGroup.prototype.setIcon=function (icon){
	this._menuItem._icon=icon;
	
};
MenuOutlookBarGroup.prototype.isVisible=function (){
	return this._menuItem._visible;
	
};
MenuOutlookBarGroup.prototype.setVisible=function (visible){
	this._menuItem._visible=visible;
	
};
MenuOutlookBarGroup.prototype.isDisabled=function (){
	return this._menuItem._disabled;
	
};
MenuOutlookBarGroup.prototype.setDisabled=function (disabled){
	this._menuItem._disabled=disabled;
	
};
MenuOutlookBarGroup.prototype.getViewMode=function (){
	return this._viewMode;
	
};
MenuOutlookBarGroup.prototype.setViewMode=function (viewMode){
	this._viewMode=viewMode;	
	
};
MenuOutlookBarGroup.prototype.refresh=function (){
	var div=this._div;
	//2010.08.30 Add By qwj
	if (div.children(0))
		div.removeChild(div.children(0));
	//End
	var subItem=this._menuItem;
	var row,cell,button,image,label;
	var tbody=$$("TBODY");
	var items=subItem.getItems();
	var size=items.size();
	for(var i=0;i<size;i++){
		var item=items.get(i);
		if(!item._visible)continue;
		var row;
		if(this._viewMode==__MenuOutlookBarGroup_VIEWMODE_ICON){
			row=_$getStandardIconGroup().cloneNode(true);
			
		}else {
			row=_$getStandardListGroup().cloneNode(true);
			
		};
		var button=row.firstChild.firstChild;
		button._kingfisherClass="OutlookBarSubButton";
		button._menuItem=item;
		if(item._disabled){
			button.className="SubButton_Disabled";
			
		}else {
			button.className="SubButton";
			
		};
		var menu=item._menu;
		if(this._viewMode==__MenuOutlookBarGroup_VIEWMODE_ICON){
			var groupButon=button.firstChild.tBodies[0];
			var label=groupButon.rows[1].cells[0].firstChild;
			if(menu._onRefreshItem==null||_$fireKingfisherEvent(menu,"onRefreshItem",[menu,label,item])){
				label.innerText=item._label;
				
			};
			var icon=groupButon.rows[0].cells[0].firstChild;
			if(item._icon!=null){
				icon.src=item._icon;
				
			}else {
				icon.src=__SKIN_PATH+"/outlookbar/defaulticon.gif";
				
			};
			var subMenuIndicator=groupButon.rows[0].cells[1];
			if(item._items!=null&&item._items.size()>0){
				
				var icon=subMenuIndicator.firstChild;
				var hasIcon=(icon!=null);
				if(!hasIcon){
					icon=$$("IMG");
					icon.src=__SKIN_PATH+"/outlookbar/indicator.gif";
					subMenuIndicator.appendChild(icon);
					
				}
			}else {
				if(subMenuIndicator.firstChild!=null){
					subMenuIndicator.removeChild(subMenuIndicator.firstChild);
					
				}
			}
		}else {
			var groupButon=button.firstChild.tBodies[0];
			var label=groupButon.rows[0].cells[1].firstChild;
			if(menu._onRefreshItem==null||_$fireKingfisherEvent(menu,"onRefreshItem",[menu,label,item])){
				label.innerText=item._label;
				
			};
			var icon=groupButon.rows[0].cells[0].firstChild;
			if(item._icon!=null){
				icon.src=item._icon;
				icon.style.display="";
				
			}else {
				icon.style.display="none";
				
			};
			var subMenuIndicator=groupButon.rows[0].cells[2];
			if(item._items!=null&&item._items.size()>0){
				var icon=subMenuIndicator.firstChild;
				var hasIcon=(icon!=null);
				if(!hasIcon){
					icon=$$("IMG");
					icon.src=__SKIN_PATH+"/outlookbar/indicator.gif";
					subMenuIndicator.appendChild(icon);
					
				}
			}else {
				if(subMenuIndicator.firstChild!=null){
					subMenuIndicator.removeChild(subMenuIndicator.firstChild);
					
				}
			}
		};
		tbody.appendChild(row);
		
	}
	var table=$$("TABLE");
	table.style.width="100%";
	table.appendChild(tbody);
	div.appendChild(table);
	
};
MenuOutlookBarGroup.prototype._$createDiv=function (){
	if(this._hasDiv)return ;
	var div=$$("DIV");
	div.className=(this._viewMode==__MenuOutlookBarGroup_VIEWMODE_ICON)?"IconGroup":"ListGroup";
	div.style.overflow="hidden";
	div.style.width="100%";
	div.style.height="100%";
	this._div=div;
	this.refresh();
	this._hasDiv=true;
	
};



//**************************
//OutlookBar�ؼ�//
//**************************
function _$buildOutlookBar(id,viewModel){
	var bar=null;
	if(id){
		bar=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(bar==null){
		bar=$$("TABLE");
		bar.id=id;
		
	};
	if(!bar.className)bar.className="OutlookBar";
	bar.getId=_$Component_getId;
	bar.getViewModel=_$Component_getViewModel;
	bar.isActive=_$Component_isActive;
	bar.activate=_$OutlookBar_activate;
	bar.destroy=_$OutlookBar_destroy;
	bar.isAnimated=_$OutlookBar_getAnimated;
	bar.setAnimated=_$OutlookBar_setAnimated;
	bar.getTag=_$Element_getTag;
	bar.setTag=_$Element_setTag;
	bar.getContext=_$Element_getContext;
	bar.setContext=_$Element_setContext;
	bar.refresh=_$OutlookBar_refresh;
	bar.getMenu=_$OutlookBar_getMenu;
	bar.setMenu=_$OutlookBar_setMenu;
	bar.addGroup=_$OutlookBar_addGroup;
	bar.removeGroup=_$OutlookBar_removeGroup;
	bar.getGroup=_$OutlookBar_getGroup;
	bar.getGroupCount=_$OutlookBar_getGroupCount;
	bar.setCurrentGroup=_$OutlookBar_setCurrentGroup;
	bar.onResize=_$OutlookBar_onResize;	
	bar._$paint=_$OutlookBar_paint;
	bar._$initGroup=_$OutlookBar_initGroup;
	bar._$getScrollButtons=_$OutlookBar_getScrollButtons;
	bar._$showScrollButton=_$OutlookBar_showScrollButton;
	bar._$$resize=_$OutlookBar_doResize;
	bar._viewModel=viewModel;
	bar._menu=null;
	bar._groups=new HashList();
	bar._currentGroup=null;
	bar._animated=true;
	bar._afterChange = null;
	bar._beforeChange = null;
	bar._beforeActivate = null;
//	if(browserType==__Browser_IE){
//		EventManager.addSystemEvent(bar,"onresize",function (){
//			bar.onResize();
			
//		});
		
//	};
	return bar;
	
};
KingfisherFactory._$registerComponentType("OutlookBar",_$buildOutlookBar);
function _$OutlookBar_destroy(){
	var groups=this._groups._objectArray;
	for(var i=0;i<groups.length;i++){
		var group=groups[i];
		group.destroy();
		
	};
	this._groups.clear();
	this._btnScrollUp=null;
	this._btnScrollDown=null;
	this._tbody=null;
	
};
function _$OutlookBar_activate(){
	if(!this._active){
		if (this._beforeActivate!==null)
			_$fireKingfisherEvent(this,"beforeActivate",[this]);
		
		this._$initGroup();
		this._$paint();
		this.refresh();
		this._active=true;
		var group=this._currentGroup;
		this._currentGroup=null;
		this.setCurrentGroup(group);
		_$fireKingfisherEvent(this,"onActive",[this]);
		
		if (this._afterChange!==null)
			_$fireKingfisherEvent(this,"afterChange",[this, null, group]);	
		
	}
};
function _$OutlookBar_getMenu(){
	return kingfisher.feather.getControl(this._menu);
	
};
function _$OutlookBar_setMenu(menu){
	this._menu=menu;	
	if(this._active){
		this.refresh();
		
	}
};
function _$OutlookBar_addGroup(group){
	var size=this._groups.size();
	this._groups.put(group._name,group);
	group._outlookBar=this;
	if(size==0){
		this.setCurrentGroup(group);
		
	};
	return group;
	
};
function _$OutlookBar_getGroup(name){
	return this._groups.get(name);
	
};
function _$OutlookBar_removeGroup(group){
	if(typeof(group)=="string"){
		group=this.getGroup(group);
		if(group==null)return null;
		
	};
	this._groups.remove(group._name);
	return group;
	
};
function _$OutlookBar_getGroupCount(){
	return this._groups.size();
	
};
function _$OutlookBar_initGroup(){
	var groups=new HashList();
	var oldGroups=this._groups;
	var prevActiGroup=this._currentGroup;
	var isOtherGroup=false;
	var menu=this.getMenu();
	if(menu!=null){
		var items=menu._topItem.getItems();
		var size=items.size();
		for(var i=0;i<size;i++){
			var item=items.get(i);
			var group=oldGroups.remove(item._name);
			if(group==null){
				
				group=new MenuOutlookBarGroup(item._name);
				group._outlookBar=this;
				
			};
			if(typeof(prevActiGroup)=="string"){
				if(prevActiGroup==item._name)isOtherGroup=true;
				
			}else if(prevActiGroup==group){
				isOtherGroup=true;
				
			};
			if(typeof(group.setMenuItem)=="function"){
				group.setMenuItem(item);
				
			};
			groups.put(group._name,group);
			
		}
	};
	var objectArray=oldGroups._objectArray;
	for(var i=0;i<objectArray.length;i++){
		var group=objectArray[i];
		if(group._kingfisherClass=="DefaultOutlookBarGroup"){
			groups.put(group._name,group);

			if(prevActiGroup==group){
				isOtherGroup=true;
				
			};			
		}else {
			group.destroy();
			
		}
	};
	oldGroups.clear();
	if(!isOtherGroup){
		this.setCurrentGroup(groups.get(0));
		
	};
	this._groups=groups;
	
};
function _$OutlookBar_paint(){
	this.className="OutlookBar";
	this.cellPadding=0;
	this.cellSpacing=0;
	var tbody=$$("TBODY");
	this._tbody=tbody;
	this.appendChild(tbody);
	var bar=this;
	EventManager.addSystemEvent(bar,"onclick",function (){
		_$OutlookBar_onClick(bar);
		
	});
	EventManager.addSystemEvent(bar,"onmouseover",function (){
		_$OutlookBar_onMouseOver(bar);
		
	}
	);
	EventManager.addSystemEvent(bar,"onmouseout",function (){
		_$OutlookBar_onMouseOut(bar);
		
	});
	
};
function _$OutlookBar_getAnimated(){
	return this._animated;
	
};
function _$OutlookBar_setAnimated(animated){
	this._animated=animated;
	
};
function _$OutlookBar_refresh(){
	var tbody=this._tbody;
	for(var i=tbody.childNodes.length-1;i>=0;i--){
		tbody.removeChild(tbody.childNodes[i]);
		
	};
	var menu=this.getMenu();
	var topItem=null;
	if(menu!=null)topItem=menu._topItem;
	var groups=this._groups._objectArray;
	for(var i=0;i<groups.length;i++){
		var group=groups[i];
		var row=$$("TR");
		var cell=$$("TD");
		cell.className="Button_Outer";
		var button=$$("DIV");
		button._kingfisherClass="OutlookBarButton";
		button.className="GroupButton";
		button.style.width="100%";
		button.style.height="100%";
		button.style.whiteSpace="nowrap";
		
		var buttonCell;
		var buttonTable=$$("TABLE");
		buttonTable.width="100%";
		var buttonTbody=$$("TBODY");
		var buttonRow=$$("TR");
		if(group.getIcon()){
			buttonCell=$$("TD");
			var icon=$$("IMG");
			icon.src=group.getIcon();
			buttonCell.appendChild(icon);
			buttonRow.appendChild(buttonCell);
		}
		buttonCell=$$("TD");
		buttonCell.width=4;
		buttonRow.appendChild(buttonCell);
		buttonCell=$$("TD");
		buttonCell.className="ButtonLable";	
		if(menu!=null){
			var item=topItem.getItem(group._name);
			if(menu._onRefreshItem==null||_$fireKingfisherEvent(menu,"onRefreshItem",[menu,button,item])){
				buttonCell.innerText=group.getLabel();
				
			}
		}else {
			buttonCell.innerText=group.getLabel();
			
		};
		buttonRow.appendChild(buttonCell);
		buttonTbody.appendChild(buttonRow);
		buttonTable.appendChild(buttonTbody);
		button.appendChild(buttonTable);		
		
		button._group=group;
		cell.appendChild(button);
		row.appendChild(cell);
		tbody.appendChild(row);
		var row=$$("TR");
		row.id=_$genControlId();
		var cell=$$("TD");
		if(this._currentGroup==group){
			row.style.display="";
			row.style.height="100%";
			
		}else {
			row.style.display="none";
			row.style.height="0%";
			
		};
		row.appendChild(cell);
		tbody.appendChild(row);
		group._subItemRow=row;
		this._$showScrollButton();
		
	}
};
function _$OutlookBar_setCurrentGroup(group){
	if(this._active){
		var prevActiGroup=this._currentGroup;
		var oldActiveGroup;
		if(typeof(prevActiGroup)=="string"){
			oldActiveGroup=this._groups.get(prevActiGroup);
			
		}else {
			oldActiveGroup=prevActiGroup;
			
		};
		var activeGroup;
		if(typeof(group)=="string"){
			activeGroup=this._groups.get(group);
			
		}else {
			activeGroup=group;
			
		};
		if(activeGroup!=null){
			if(activeGroup.isDisabled())return ;
			var subItemRow;
			if(!activeGroup._hasDiv){
				activeGroup._$createDiv();
				subItemRow=activeGroup._subItemRow;
				var div=activeGroup.getDiv();
				subItemRow.cells[0].appendChild(div);
				
			}else {
				subItemRow=activeGroup._subItemRow;
				
			};
			if(activeGroup!=oldActiveGroup){
				if(oldActiveGroup!=null){
					
					if(this._furlTimeout){
						clearTimeout(this._furlTimeout);
						this._furlTimeout=0;
						
					};
					var oldActiveRow=oldActiveGroup._subItemRow;
					subItemRow.style.display="";
					if(this._animated){
						this._furlTimeout=setTimeout("_$furl("+"$(\""+this.id+"\"), "+"$(\""+oldActiveRow.id+"\"), "+"$(\""+subItemRow.id+"\"), 1)",0);
						
					}else {
						oldActiveRow.style.display="none";
						oldActiveRow.style.height="0%";
						subItemRow.style.display="";
						subItemRow.style.height="100%";
						this._$showScrollButton();
						
					}
				}else {
					subItemRow.style.display="";
					subItemRow.style.height="100%";
					this._$showScrollButton();
					
				}
			}
		};
		this._currentGroup=activeGroup;
		
	}else {
		this._currentGroup=group;
		
	}
};
//����Ч��//
function _$furl(bar,oldActiveRow,subItemRow,absPos){
	if(absPos>=100){
		oldActiveRow.style.display="none";
		oldActiveRow.style.height="0%";
		subItemRow.style.display="";
		subItemRow.style.height="100%";
		bar._$showScrollButton();
		
	}else {
		oldActiveRow.style.height=(100-absPos)+"%";
		subItemRow.style.height=absPos+"%";
		this._furlTimeout=setTimeout("_$furl("+"$(\""+bar.id+"\"), "+"$(\""+oldActiveRow.id+"\"), "+"$(\""+subItemRow.id+"\"), "+(absPos+3)+")",5);
		
	}
};
function _$OutlookBar_getScrollButtons(){
	var btnLeftUp,btnRightDown;
	if(this._btnScrollUp==null){
		btnLeftUp=$$("DIV");
		btnLeftUp._kingfisherClass="OutlookBarScrollButton1";
		btnLeftUp.className="ScrollButton";
		btnLeftUp.style.position="absolute";
		btnLeftUp.style.zIndex=_$autoGenIndex();
		_$setVisible(btnLeftUp,false);
		btnLeftUp.innerHTML="<IMG src=\""+__SKIN_PATH+"/outlookbar/btn1.gif\">";
		var bar=this;
		EventManager.addSystemEvent(btnLeftUp,"onclick",function (){
			_$OutlookBar$ScrollButton_onClick(bar,btnLeftUp);
			
		});
		this._btnScrollUp=btnLeftUp;
		
	};
	if(this._btnScrollDown==null){
		btnRightDown=$$("DIV");
		btnRightDown._kingfisherClass="OutlookBarScrollButton2";
		btnRightDown.className="ScrollButton";
		btnRightDown.style.position="absolute";
		btnRightDown.style.zIndex=_$autoGenIndex();
		_$setVisible(btnRightDown,false);
		btnRightDown.innerHTML="<IMG src=\""+__SKIN_PATH+"/outlookbar/btn2.gif\">";
		var bar=this;
		EventManager.addSystemEvent(btnRightDown,"onclick",function (){
			_$OutlookBar$ScrollButton_onClick(bar,btnRightDown);
			
		});
		this._btnScrollDown=btnRightDown;
		
	};
	return [this._btnScrollUp,this._btnScrollDown];
	
};
function _$OutlookBar_showScrollButton(){
	if(!this._active)return ;
	var buttons=this._$getScrollButtons();
	var btnLeftUp=buttons[0];
	var btnRightDown=buttons[1];
	if(this._currentGroup!=null){
		var windowContainer=this._currentGroup._subItemRow.cells[0].firstChild;
		if(windowContainer==null)return ;
		if(windowContainer.offsetHeight<windowContainer.scrollHeight){
			
			if(windowContainer.scrollTop>0){
				windowContainer.appendChild(btnLeftUp);
				_$setVisible(btnLeftUp,true);
				btnLeftUp.style.left=windowContainer.offsetWidth-btnLeftUp.offsetWidth-1;
				btnLeftUp.style.top=windowContainer.scrollTop+2;
				
			}else {
				_$setVisible(btnLeftUp,false);
				
			};
			if(windowContainer.scrollTop+windowContainer.clientHeight<windowContainer.scrollHeight){
				windowContainer.appendChild(btnRightDown);
				_$setVisible(btnRightDown,true);
				btnRightDown.style.left=windowContainer.offsetWidth-btnRightDown.offsetWidth-1;
				btnRightDown.style.top=windowContainer.scrollTop+windowContainer.offsetHeight-btnRightDown.offsetHeight-1;
				
			}else {
				_$setVisible(btnRightDown,false);
				
			}
		}else {
			_$setVisible(btnLeftUp,false);
			_$setVisible(btnRightDown,false);
			
		}
	}
};
function _$OutlookBar_onResize(){
	if(!this._active)return ;
	if(this._resizeTimeout)clearTimeout(this._resizeTimeout);
	this._resizeTimeout=setTimeout("var bar = $(\""+this.id+"\");"+"if (bar != null) bar._$$resize()",150);
	
};
function _$OutlookBar_doResize(){
	this._$showScrollButton();
	
};
function _$OutlookBar$ScrollButton_onClick(bar,button){
	if(bar._currentGroup!=null){
		var windowContainer=bar._currentGroup._subItemRow.cells[0].firstChild;
		if(button._kingfisherClass=="OutlookBarScrollButton1"){
			windowContainer.scrollTop=windowContainer.scrollTop-100;
			
		}else {
			windowContainer.scrollTop=windowContainer.scrollTop+100;
			
		}
	};
	bar._$showScrollButton();
	
};
function _$OutlookBar_onClick(bar){
	var targ=_$getEventTarget();	
	var button=_$getKingfisherElement(targ,"OutlookBarButton");
	var oldGroup = null;
	if(button!=null){
		var group=button._group;
		if(group!=bar._currentGroup){
			//����� 2014.07.29����beforeChange/afterChange�¼�
			if (bar._beforeChange!==null)
				_$fireKingfisherEvent(bar,"beforeChange",[bar, bar._currentGroup, group]);
			oldGroup = bar._currentGroup;
			bar.setCurrentGroup(group);
			var item=group._menuItem;
			if(item!=null){
				item.click();
			}
			if (bar._afterChange!==null)
				_$fireKingfisherEvent(bar,"afterChange",[bar, oldGroup, group]);
			//End
		}
	}else {
		button=_$getKingfisherElement(targ,"OutlookBarSubButton");
		if(button!=null){
			var item=button._menuItem;
			if(item._disabled)return ;
			var menu=item._menu;
			var box=menu._$getPopupMenu(item);
			if(box!=null){
				box.show();
				var absPos=_$getAbsolutePosition(button);
				var x=absPos[0]+button.offsetWidth-2;
				if(x+box.offsetWidth>document.body.clientWidth){
					x=absPos[0]-box.offsetWidth+2;
					
				};
				if(x<0)x=0;
				box.style.left=x;
				var y=absPos[1];
				if(y+box.offsetHeight>document.body.clientHeight){
					y=absPos[1]+button.offsetHeight-box.offsetHeight;
					if(y+box.offsetHeight>document.body.clientHeight){
						y=document.body.clientHeight-box.offsetHeight;
						
					}
				};
				if(y<0)y=0;
				box.style.top=y;
				box._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",600);
				
			};
			if(item.getItems().size()==0)
				item.click();			
			
		}
	}
};
function _$OutlookBar_onMouseOver(bar){
	var targ=_$getEventTarget();
	var button=_$getKingfisherElement(targ,"OutlookBarButton");
	if(button!=null){
		button.className="HotGroupButton";
		
	}else {
		button=_$getKingfisherElement(targ,"OutlookBarSubButton");
		if(button!=null&&!button._menuItem._disabled){
			button.className="HotSubButton";
			
		}
	}
};
function _$OutlookBar_onMouseOut(bar){
	var targ=_$getEventTarget();
	var button=_$getKingfisherElement(targ,"OutlookBarButton");
	if(button!=null){
		button.className="GroupButton";
		
	}else {
		button=_$getKingfisherElement(targ,"OutlookBarSubButton");
		if(button!=null){
			if(button._menuItem._disabled){
				button.className="SubButton_Disabled";
				
			}else {
				button.className="SubButton";
				
			}
		}
	}
};



//**************************
//���ڵ�Ļ���//
//**************************
function TreeNode(){
	this._icon=null;
	this._expandedIcon=null;
	this._checkable=false;
	this._checked=false;
	this._tag=null;
	this._nodes=null;
	this._hasChild=true;
	this._expanded=false;
	this._parent=null;
	this._tree=null;
	this._activeCell=null;
	this._hasExpanded=false;
	this._type=null;
	this._hint=null;
	
};
TreeNode.prototype=new Element();
TreeNode.prototype.toString =function (){
	return this.getLabel()+"\nlevel: "+this.getLevel();
	
};
TreeNode.prototype.destroy=function (){
	if(this._nodes!=null){
		var node=this._nodes._first;
		while(node!=null){
			node.destroy();
			node=node._next;
			
		}
	};
	this._parent=null;
	this._activeCell=null;
	this._treeLevel=null;
	this._tree=null;
	
};
TreeNode.prototype.getLevel=function (){
	var treeLevel=0;
	var _parent=this._parent;
	while(_parent!=null){
		_parent=_parent._parent;
		treeLevel++;
		
	};
	return treeLevel;
	
};
TreeNode.prototype.getType=function (){
	return this._type;
	
};
TreeNode.prototype.setType=function (type){
	this._type=type;
	
};
TreeNode.prototype.getIcon=function (){
	return this._icon;
	
};
TreeNode.prototype.setIcon=function (icon){
	this._icon=icon;
	
};
TreeNode.prototype.getHint=function (){
	return this._hint;
	
};
TreeNode.prototype.setHint=function (hint){
	this._hint=hint;
	
};
TreeNode.prototype.getExpandedIcon=function (){
	return this._expandedIcon;
	
};
TreeNode.prototype.setExpandedIcon=function (expandedIcon){
	
	this._expandedIcon=expandedIcon;
	
};
TreeNode.prototype.isCheckable=function (){
	return this._checkable;
	
};
TreeNode.prototype.setCheckable=function (checkable){
	this._checkable=checkable;
	
};
/**
 * ���ظ�ѡ���Ƿ�ֻ��
 */
TreeNode.prototype.isCheckableReadOnly=function (){
	return this._checkableReadOnly;
	
};
/**
 * ���ø�ѡ���Ƿ�ֻ��
 */
TreeNode.prototype.setCheckableReadOnly=function (checkableReadOnly){
	this._checkableReadOnly=checkableReadOnly;
	
};
TreeNode.prototype.isChecked=function (){
	return this._checked;
	
};
TreeNode.prototype.setChecked=function (checked){
	this._checked=checked;
	
};
/**
*	���ýڵ��Ƿ���԰�ѡ��ʾ
*/
TreeNode.prototype.isHalfmoon=function (){
	if(typeof(this._halfmoon) == 'undefined')
		return false;
	else
		return this._halfmoon;
	
};
TreeNode.prototype.setHalfmoon=function (halfmoon){
	this._halfmoon=halfmoon;
	
};
TreeNode.prototype.isHasChild=function (){
	return this._hasChild;
	
};
TreeNode.prototype.setHasChild=function (hasChild){
	this._hasChild=hasChild;
	
};
TreeNode.prototype.getTag=_$Element_getTag;
TreeNode.prototype.setTag=_$Element_setTag;
TreeNode.prototype.isExpanded=function (){
	return this._expanded;
	
};
TreeNode.prototype._$$setExpanded=function (expanded){
	this._expanded=expanded;
	if(expanded)this._hasExpanded=true;
	
};
TreeNode.prototype.setExpanded=function (expanded){
	var tree=this._tree;
	if(tree!=null){
		if(expanded){
			tree.expandNode(this);
			
		}else {
			tree.collapseNode(this);
			
		}
	}else {
		this._$$setExpanded(expanded);
		
	}
};
TreeNode.prototype.getParent=function (){
	return this._parent;
	
};
TreeNode.prototype.getTree=function (){
	return this._tree;
	
};
TreeNode.prototype.getNodes=function (){
	if(this._nodes==null){
		
		this._nodes=new Collection();
		
	};
	return this._nodes;
	
};
TreeNode.prototype.addNode=function (node){
	if(node._parent!=null){
		node.remove();
		
	};
	var nodes=this.getNodes();
	nodes.insertElement(node);
	node._data=node;
	node._parent=this;
	if(this._tree!=null){
		var tree=this._tree;
		tree._nextNode=tree._$getNextNode(this);
		try{
			tree._$addNode(node);
			
		}finally{
			tree._nextNode=null;
			
		}
	}
};
TreeNode.prototype.removeNode=function (node){
	this.getNodes().removeElement(node);
	if(this._tree!=null){
		this._tree._$removeTreeNode(node);
		
	}
};
TreeNode.prototype.remove=function (){
	this._parent.removeNode(this);
	
};
TreeNode.prototype.hasExpanded=function (){
	return this._hasExpanded;
	
};
TreeNode.prototype.refresh=function (){
	if(this._tree!=null){
		this._tree.refreshNode(this);
		
	}
};
TreeNode.prototype.getPerviousSibling=TreeNode.prototype.getPrevious;
TreeNode.prototype.getNextSibling=TreeNode.prototype.getNext;
TreeNode.prototype.getFirstChild=function (){
	return this._nodes._first;
	
};
TreeNode.prototype.getLastChild=function (){
	return this._nodes._last;
	
};
TreeNode.prototype.getNextNode=function (){
	function _$getParentNextNode(node){	//ȡ�����ͬ������һ���
		
		var parent=node._parent;
		if(parent!=null&&parent._expanded){
			var next=parent._next;
			if(next==null){
				next=_$getParentNextNode(parent);
				
			};
			return next;
			
		};
		return null;
		
	};
	if(this._expanded&&this._nodes!=null){
		var next=this._nodes._first;
		if(next!=null){
			return next;
			
		}
	};
	var next=this._next;
	if(next==null){
		next=_$getParentNextNode(this);
		
	};
	return next;
	
};
//ȡ��һ�����һ������һ���
TreeNode.prototype._$getPrevNodeNextLevelLastNode=function (){
	if(this._expanded&&this._nodes!=null){
		var lastNode=this._nodes._last;
		if(lastNode!=null){
			var previousNode=lastNode;
			previousNode=previousNode._$getPrevNodeNextLevelLastNode();
			if(previousNode!=null){
				return previousNode;
				
			}else {
				return lastNode;
				
			}
		}
	};
	return null;
	
};
TreeNode.prototype.getPrevNode=function (){
	var previousNode=this._previous;
	if(previousNode==null){
		previousNode=this._parent;
		
	}else if(previousNode._expanded){
		var lastNode=previousNode._$getPrevNodeNextLevelLastNode();
		if(lastNode!=null)previousNode=lastNode;
		
	};
	return previousNode;
	
};



//**************************
//Ĭ�ϵ����ڵ����//
//**************************
function DefaultTreeNode(label){
	this._publicid=_$getPublicId();
	this._kingfisherClass="DefaultTreeNode";
	this._label=label;
	this._path=null;
	this._type="simple";
	
};
DefaultTreeNode.prototype=new TreeNode();
DefaultTreeNode.prototype.getLabel=function (){
	return this._label;
	
};
DefaultTreeNode.prototype.setLabel=function (label){
	this._label=label;
	
};
DefaultTreeNode.prototype.getPath=function (){
	return this._path;
	
};
DefaultTreeNode.prototype.setPath=function (path){
	if ((path.length>0) && (path.substr(0,4)=='http'))
	{

	}
	else if(path.length>0&&path.charAt(0)=='/'){
		path=__CONTEXT_PATH+path;
		
	};
	this._path=path;
	
};
DefaultTreeNode.prototype.getTreeLevel=function (){
	return this._treeLevel;
	
};



//**************************
//�򵥵�������//
//**************************
function _$buildSimpleTree(id){
	var tree=null;
	if(id){
		tree=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(tree==null){
		tree=$$("DIV");
		tree.style.width="100%";
		tree.id=id;
		
	};
	tree.getId=_$Component_getId;
	tree.getViewModel=_$Component_getViewModel;
	tree.isActive=_$Component_isActive;
	tree.getTag=_$Element_getTag;
	tree.setTag=_$Element_setTag;
	tree.getContext=_$Element_getContext;
	tree.setContext=_$Element_setContext;
	tree.activate=_$SimpleTree_activate;
	tree.destroy=_$SimpleTree_destroy;
	tree.isDraggable=_$SimpleTree_getDraggable;
	tree.setDraggable=_$SimpleTree_setDraggable;
	tree.getTopNode=_$SimpleTree_getTopNode;
	tree.getFirstRootNode=_$SimpleTree_getFirstRootNode;
	tree.getLastRootNode=_$SimpleTree_getLastRootNode;
	tree.addRootNode=_$SimpleTree_addRootNode;
	tree.refreshNode=_$SimpleTree_refreshNode;
	tree.expandNode=_$SimpleTree_expandNode;	
	tree.collapseNode=_$SimpleTree_collapseNode;
	tree.getCurrentNode=_$SimpleTree_getCurrentNode;
	tree.setCurrentNode=_$SimpleTree_setCurrentNode;
	tree._$initTree=_$SimpleTree_initTree;
	tree.getTarget=_$SimpleTree_getTarget;
	tree.setTarget=_$SimpleTree_setTarget;
	tree.isHighlightSelection=_$SimpleTree_getHighlightSelection;
	tree.setHighlightSelection=_$SimpleTree_setHighlightSelection;
	tree.getAllCheckedNodes=_$SimpleTree_getAllCheckedNodes;
	tree.clearAllCheckedState=_$SimpleTree_clearAllCheckedState;
	tree._$getNextNode=_$SimpleTree_getNextNode;
	tree._$addNode=_$SimpleTree_addNode;
	tree.addNode=_$SimpleTree_do_addNode;
	tree._$removeTreeNode=_$SimpleTree_removeTreeNode;
	tree._$initNode=_$SimpleTree_initNode;
	tree._$disableBindingTree=_$SimpleTree_disableBindingTree;
	tree._$refreshNodeActiveCell=_$SimpleTree_refreshNodeActiveCell;
	tree._$paintNodeRow=_$SimpleTree_paintNodeRow;
	tree._$removeNodeCell=_$SimpleTree_removeNodeCell;
	tree._$paint=_$SimpleTree_paint;
	tree._$getDraggingCursor=_$SimpleTree_getDraggingCursor;
	tree._$highlightDraggingTarget=_$SimpleTree_highlightDraggingTarget;
	tree._$scrollContent=_$SimpleTree_scrollContent;
	tree._$initTreeNodes=_$SimpleTree_initTreeNodes;
	tree._$nodeChanged=_$SimpleTree_nodeChanged;
	tree.onKeyDown=_$SimpleTree_onKeyDown;
	tree._$paint();
	tree.refresh=_$SimpleTree_refresh;
	tree.clearAllNodes=_$SimpleTree_refresh;	//����2.0
	tree.setDisabled=_$SimpleTree_setDisabled;
	tree.getDisabled=_$SimpleTree_getDisabled;
	tree.setCheckableLinkage=_$SimpleTree_setCheckableLinkage;	//��ѡ���Ƿ�����
	tree.isCheckableLinkage=_$SimpleTree_getCheckableLinkage;
	var treeNode=new DefaultTreeNode();
	treeNode._tree=tree;
	treeNode._visible=true;
	treeNode._label="TOP_NODE";
	tree._topNode=treeNode;
	tree._draggable=false;
	tree._currentNode=null;
	tree._scrollTimeout=0;
	tree._target=null;
	tree._localize=true;
	tree._highlightSelection=true;
	tree._checkableLinkage=true;
	tree._cascadeTrigger=true;		//�����Լ��������¼�
	tree._leftPadding=_$getPreferenceSetting("__Tree_LeftPadding");
	if(!(tree._leftPadding>=0))tree._leftPadding=0;
	return tree;
	
};



//**************************
//��״�б�//
//**************************
function _$buildTree(id,viewModel){
	var tree=_$buildSimpleTree(id);
	tree._$checkNodeRecord=_$Tree_checkNodeRecord;	
	tree._$showNextLevelRecordNode=_$Tree_showNextLevelRecordNode;
	tree._$isSameTreeLevel=_$Tree_isSameTreeLevel;
	tree._$beforeDragEnd=_$Tree_beforeDragEnd;
	tree._viewModel=viewModel;
	if(!tree.className)tree.className="Tree";
	return tree;
	
};
KingfisherFactory._$registerComponentType("Tree",_$buildTree);
function _$SimpleTree_activate(){
	if(!this._active){
		this._$initTree();
		this._active=true;
		this._topNode.setExpanded(true);
		_$fireKingfisherEvent(this,"onActive",[this]);
		this._$nodeChanged();
		//setTimeout("$(\""+this.id+"\")._$nodeChanged()",0);
		
	}
};
function _$SimpleTree_destroy(){
	this._currentNode=null;
	this._draggingNode=null;
	this._targetNode=null;
	this._topNode.destroy();
	this._draggingCursor=null;
	this._rowTemplet=null;
	this._tbody=null;
	
};
function _$SimpleTree_paint(){
	this.style.overflow="auto";
	this.innerHTML="<TABLE><TBODY></TBODY></TABLE>";
	var table=this.firstChild;
	table.cellPadding=0;
	table.cellSpacing=0;
	table.style.width="100%";
	this._tbody=table.tBodies[0];
	var button=$$("IMG");
	button.className="TreeNodeButton";
	button.style.marginLeft=4;
	button.style.marginRight=4;
	button.align="middle";
	var cell=$$("TD");
	var row=$$("TR");
	cell.className="TreeNode";
	cell.style.width="100%";
	cell.style.whiteSpace="nowrap";
	cell.appendChild(button);
	row.appendChild(cell);
	this._rowTemplet=row;
	var tree=this;
	EventManager.addSystemEvent(tree,"onmousedown",function (){
		
		_$SimpleTree_onMouseDown(tree);
		event.cancelBubble=true;
		
	});
	EventManager.addSystemEvent(tree,"onmousemove",function (){
		_$SimpleTree_onMouseMove(tree);
		
	});
	EventManager.addSystemEvent(tree,"onmouseup",function (){
		_$SimpleTree_onMouseUp(tree);
		
	});
	EventManager.addSystemEvent(tree,"onclick",function (){
		_$SimpleTree_onClick(tree);
		
	});
	EventManager.addSystemEvent(tree,"ondblclick",function (){
		_$SimpleTree_onDblClick(tree);
		
	});
	
};
function _$SimpleTree_setCheckableLinkage(checkableLinkage){
	
	this._checkableLinkage=checkableLinkage
};
function _$SimpleTree_getCheckableLinkage(){
	
	return this._checkableLinkage;
};
function _$SimpleTree_setDisabled(disabled){
	
	this.disabled=disabled;
};
function _$SimpleTree_getDisabled(){
	
	return this.disabled;
};
function _$SimpleTree_getDraggable(){
	return this._draggable;
	
};
function _$SimpleTree_setDraggable(draggable){
	this._draggable=draggable;
	
};
function _$SimpleTree_getTopNode(){
	return this._topNode;
	
};
function _$SimpleTree_getFirstRootNode(){
	return this._topNode.getFirstChild();
	
};
function _$SimpleTree_getLastRootNode(){
	return this._topNode.getLastChild();
	
};
function _$SimpleTree_addRootNode(node){
	this._topNode.addNode(node);
	
};
function _$SimpleTree_refresh(){
	var nodes=this._topNode.getNodes();
	var itr=nodes.iterator();
	while(itr.hasNext()){
		var node=itr.next();
		node.remove();			
	};
	
	this._topNode._expanded=false;
	this._topNode._hasChild=true;
	this.expandNode(this._topNode);
};
function _$SimpleTree_getNextNode(node){
	function _$getParentNextNode(node){
		var parent=node._parent;
		if(parent!=null&&parent._expanded){
			var next=parent._next;
			if(next==null){
				next=_$getParentNextNode(parent);
				
			};
			return next;
			
		}
		return null;
		
	};
	var next=node._next;
	if(next==null){
		next=_$getParentNextNode(node);
		
	};
	return next;
	
};
function _$SimpleTree_addNode(node){
	this._$initNode(node);
	this._$paintNodeRow(node);
	if(this._currentNode==null){
		this.setCurrentNode(node);
		
	};
	if(this._active){
		this.refreshNode(node._parent);
		
	}
};
//����2.0
function _$SimpleTree_do_addNode(node,label){
	var newTreeNode=new DefaultTreeNode(label);
	node.addNode(newTreeNode);
	
	return newTreeNode;
};
function _$SimpleTree_initNode(node){
	node._tree=this;
	_$fireKingfisherEvent(this,"onInitNode",[this,node]);
	if(node._nodes!=null){
		var element=node._nodes._first;
		while(element!=null){
			this._$initNode(element._data);
			element=element._next;
			
		}
	}
};
function _$SimpleTree_removeTreeNode(node){
	this._$removeNodeCell(node);
	this._$disableBindingTree(node);
	
};
function _$SimpleTree_disableBindingTree(node){
	if(node._nodes!=null){
		var element=node._nodes._first;
		while(element!=null){
			this._$disableBindingTree(element._data);
			element=element._next;
			
		}
	};
	node._activeCell=null;
	node._tree=null;
	
};
function _$SimpleTree_refreshNodeActiveCell(cell,node){
	var hasNodeIcon=(node.getIcon()!=null||node.getExpandedIcon()!=null);
	if(cell._hasNodeIcon==hasNodeIcon&&cell._checkable==node._checkable)return ;
	for(var i=cell.childNodes.length-1;i>=1;i--){
		
		cell.removeChild(cell.childNodes[i]);
		
	};
	if(node._checkable){
		var container=$$("SPAN");
		container._kingfisherClass="TreeNodeCheckBoxContainer";
		var checkbox=$$("INPUT");
		checkbox.type="checkbox";
		checkbox._kingfisherClass="TreeNodeCheckBox";
		checkbox.id=_$genControlId();
		checkbox._node=node;
		checkbox.disabled=(node._checkableReadOnly) ? true : false;
		container.appendChild(checkbox);

		//��checkbox�����Զ���ͼƬ
		var label=$$("<LABEL hideFocus=\"true\" for=\""+checkbox.id+"\">");
		label.innerHTML="&nbsp;&nbsp;&nbsp;";
		var styleclass="CheckBoxOff";
		var parentnode=node.getParent();
		
		node.setChecked((parentnode!=null&&parentnode._checkable&&parentnode.isChecked()&&!parentnode._halfmoon&&parentnode._tree._checkableLinkage)||node._checked);

		//node.setChecked((parentnode!=null&&parentnode._checkable&&parentnode.isChecked()&&!parentnode._halfmoon)||node._checked);
		container.appendChild(label);
	
		checkbox.style.position="absolute";
		checkbox.style.left = "-1000px";
		checkbox.checked=node.isChecked();

		cell.appendChild(container);
		
	};
	if(hasNodeIcon){
		var image=$$("IMG");
		image.align="texttop";
		image._kingfisherClass="TreeNodeIcon";
		if(browserType==__Browser_IE){
			image.unselectable=true;
			
		}else {
			image.style.MozUserSelect="none";
			
		};
		image.style.marginRight=4;
		//tree node image was fixed by 16*16 --chex227
		image.width = 16;
		image.height = 16;
		cell.appendChild(image);
		
	};
	var label=$$("LABEL");
	label._kingfisherClass="TreeNodeLabel";
	label.className="NodeLabel";
	if(browserType==__Browser_IE){
		label.unselectable=true;
		
	}else {
		label.style.MozUserSelect="none";
		
	};
	cell.appendChild(label);
	var button=cell.firstChild;
	button._kingfisherClass="TreeNodeButton";
	cell._hasNodeIcon=hasNodeIcon;
	cell._checkable=node._checkable;
	
};
function _$SimpleTree_paintNodeRow(node){
	var _parent=node._parent;
	if(_parent._visible==true&&_parent._expanded){
		var oldRow=null;
		var nextNode=this._nextNode;
		if(nextNode!=null&&nextNode._activeCell){
			oldRow=nextNode._activeCell.parentNode;
			
		};
		var row=this._rowTemplet.cloneNode(true);
		//////////////
		if (node.getHint())
		{
			row.title = node.getHint();
		}
		////////////////
		row._node=node;
		var cell=row.firstChild;
		cell._kingfisherClass="DefaultTreeNode";
		if(browserType==__Browser_IE){
			
			cell.unselectable=true;
			
		}else {
			cell.style.MozUserSelect="none";
			
		};
		if(oldRow==null){
			this._tbody.appendChild(row);
			
		}else {
			this._tbody.insertBefore(row,oldRow);
			
		};
		node._activeCell=cell;
		node._visible=true;
		this.refreshNode(node);
		if(node._expanded){
			if(node._nodes!=null){
				var element=node._nodes._first;
				while(element!=null){
					this._$paintNodeRow(element._data);
					element=element._next;
					
				}
			}
		}
	}
};
function _$SimpleTree_removeNodeCell(node){
	if(node._expanded){
		if(node._nodes!=null){
			var element=node._nodes._first;
			while(element!=null){
				this._$removeNodeCell(element._data);
				element=element._next;
				
			}
		}
	};
	if(this._currentNode==node){
		var newCurrentNode=null;
		var element=node._parent._nodes.findElement(node);
		if(element!=null){
			if(element._next!=null){
				newCurrentNode=element._next._data;
				
			}else if(element._previous!=null){
				newCurrentNode=element._previous._data;
				
			}else if(node._parent!=this._topNode){
				newCurrentNode=node._parent;
				
			};
			if(newCurrentNode!=null){
				this.setCurrentNode(newCurrentNode);				
				
			}
		}
	};
	this._tbody.removeChild(node._activeCell.parentNode);
	node._activeCell=null;
	node._visible=false;
	
};
function _$SimpleTree_refreshNode(node){
	var cell=node._activeCell;
	if(!cell)return ;
	this._$refreshNodeActiveCell(cell,node);
	cell.style.paddingLeft=this._leftPadding+(node.getLevel()-1)*16;
	var button=cell.firstChild;
	if(node._hasChild||(node._nodes!=null&&node._nodes.size()>0)){
		if(node._expanded){
			button.src=__SKIN_PATH+"/tree/collapse.gif";
			
		}else {
			button.src=__SKIN_PATH+"/tree/expand.gif";
			
		}
	}else {
		button.src=__SKIN_PATH+"/tree/nochild.gif";
		
	};
	var icon,checkbox,label,newcheckbox;
	var childNodes=cell.childNodes;
	for(var i=1;i<childNodes.length;i++){
		var element=childNodes[i];
		switch(element._kingfisherClass){
			case "TreeNodeCheckBoxContainer":{
				checkbox=element.firstChild;
				newcheckbox=element.lastChild;
				break;
				
			};
			case "TreeNodeIcon":{
				icon=element;
				break;
				
			};
			case "TreeNodeLabel":{
				label=element;
				break;
				
			}
		}
	};
	if(label!=null){
		var text=node.getLabel();
		if(this._onRefreshNode==null||_$fireKingfisherEvent(this,"onRefreshNode",[this,label,text,node])){
			label.innerText=text;
			
		}
		
	};
	if(checkbox!=null){
		checkbox.checked=node.isChecked();
		if(newcheckbox!=null){
			var styleclass;
			var readOnly=(node._checkableReadOnly) ? "Read" : "";
			if(checkbox.checked&&!node._halfmoon){
				styleclass=readOnly + "CheckBoxOn";
			}
			else if(checkbox.checked&&node._halfmoon){
				styleclass=readOnly + "CheckBoxPOn";
			}
			else if(!checkbox.checked){
				styleclass=readOnly + "CheckBoxOff";
			};
			_$setElementStyle(newcheckbox, styleclass);
		}
		
	};
	if(icon!=null){
		icon.src=(node._expanded)?node.getExpandedIcon():node.getIcon();
		
	}
};
function _$Tree_showNextLevelRecordNode(node){
	
};
function _$SimpleTree_expandNode(node){
	if(node._expanded||(!node._hasChild&&(node._nodes==null||node._nodes.size()==0))){
		return ;
		
	};
	try{
		var result=_$fireKingfisherEvent(this,"beforeExpandNode",[this,node]);
		if(result!=null){
			throw result;
			
		};
		this._$showNextLevelRecordNode(node);
		node._$$setExpanded(true);
		var hasChild=false;
		var nodes=node._nodes;
		if(nodes!=null){
			this._nextNode=this._$getNextNode(node);
			try{
				var element=nodes._first;
				while(element!=null){
					var childNode=element._data;
					this._$paintNodeRow(childNode);
					hasChild=true;
					element=element._next;
					
				}
			}finally{
				this._nextNode=null;
				
			}
		};
		node._hasChild=hasChild;
		this.refreshNode(node);
		_$fireKingfisherEvent(this,"afterExpandNode",[this,node]);
		
	}catch(e){
		_$processException(e);
		
	}
};
function _$SimpleTree_collapseNode(node){
	if(!node._expanded){
		return ;
		
	};
	try{
		var result=_$fireKingfisherEvent(this,"beforeCollapseNode",[this,node]);
		if(result!=null){
			throw result;
			
		};
		var currentNode=this._currentNode;
		if(currentNode!=null){
			do{
				currentNode=currentNode._parent;
				if(currentNode==node){
					this.setCurrentNode(node);
					break;
					
				}
			}while(currentNode!=null&&currentNode!=this._topNode);
			
		};
		node._$$setExpanded(false);
		var nodes=node._nodes;
		if(nodes!=null){
			var element=nodes._first;
			while(element!=null){
				var childNode=element._data;
				this._$removeNodeCell(childNode);
				element=element._next;
				
			}
		};
		this.refreshNode(node);
		_$fireKingfisherEvent(this,"afterCollapseNode",[this,node]);
		
	}catch(e){
		_$processException(e);
		
	}
};
function _$SimpleTree_getCurrentNode(){
	return this._currentNode;
	
};
function _$Tree_checkNodeRecord(node){
	return true;
	
};
function _$SimpleTree_nodeChanged(){
	if(!this._active)return ;
	if(this._currentNode==null)return ;	
	var cell=this._currentNode._activeCell;
	var row=null;
	if(cell!=null){
		row=cell.parentNode;
		
	};
	if(row==null)return ;
	var absPos=_$getAbsolutePosition(row,this);
	var top=absPos[1];
	var bottom=top+row.offsetHeight;
	var scrollTop=this.scrollTop;
	var sourceTop=scrollTop+this.clientHeight;
	if(top<scrollTop){
		this.scrollTop=top;
		
	}else if(bottom>sourceTop){
		this.scrollTop=this.scrollTop+(bottom-sourceTop);
		
	}
};
function _$SimpleTree_setCurrentNode(node){
	try{
		if(node==this._currentNode){
			var cell=this._currentNode._activeCell;
			if(cell!=null&&cell.className!="CurrentTreeNode"){
				cell.className="CurrentTreeNode";
					
			}
			return ;
		}
		
		var result=_$fireKingfisherEvent(this,"beforeCurrentChange",[this,node]);
		if(result!=null){
			throw result;
			
		};
		if(!this._$checkNodeRecord(node)){
			throw "abort";
			
		};
		if(this._highlightSelection){
			if(this._currentNode!=null){
				var cell=this._currentNode._activeCell;
				if(cell!=null){
					cell.className="TreeNode";
					
				}
			};
			if(node!=null){
				var cell=node._activeCell;
				if(cell!=null){
					cell.className="CurrentTreeNode";
					
				}
			}
		};
		this._currentNode=node;
		_$fireKingfisherEvent(this,"afterCurrentChange",[this,node]);
		this._$nodeChanged();		
		
	}catch(e){
		_$processException(e);
		
	}
};
function _$SimpleTree_getDraggingCursor(nodeCell){
	var row=$$("TR");
	var cell=nodeCell.cloneNode(true);
	cell.firstChild.parentNode.removeChild(cell.firstChild);
	cell.style.paddingLeft=0;
	row.appendChild(cell);
	var tbody=$$("TBODY");
	tbody.appendChild(row);
	var cursor=$$("TABLE");
	cursor.appendChild(tbody);
	cursor.cellPadding=0;
	cursor.cellSpacing=0;
	cursor.className="TreeDraggingCursor";
	cursor.style.position="absolute";
	_$setVisible(cursor,false);
	document.body.appendChild(cursor);
	return cursor;
	
};
function _$SimpleTree_highlightDraggingTarget(node){
	if(this._targetNode!=null){
		var cell=this._targetNode._activeCell;
		if(cell!=null){
			cell.className="TreeNode";
			
		}
	};
	var validTarget=true;
	var parentNode=node;
	while(parentNode){
		if(this._draggingNode==parentNode){
			validTarget=false;
			break;
			
		};
		parentNode=parentNode._parent;
		
	};
	if(validTarget){
		this._targetNode=node;
		if(node!=null){
			var cell=node._activeCell;
			if(cell!=null){
				cell.className="DraggingTarget";
				
			}
		}
	}else {
		this._targetNode=null;
		
	}
	
};
function _$Tree_isSameTreeLevel(draggingNode,targetNode){
	return true;
	
};
function _$Tree_beforeDragEnd(draggingNode,targetNode){
	
};
//���������ɼ�Χ������
function _$SimpleTree_scrollContent(x,y){
	this.scrollLeft+=x*2;
	this.scrollTop+=y*2;

};
function _$SimpleTree_onMouseDown(tree){
	_$Element_onFocus(tree);
	var targ=_$getEventTarget();
	if(targ._kingfisherClass!="TreeNodeButton"){
		var cell=null;
		var element=targ;
		while(element!=null){
			if(element._kingfisherClass=="DefaultTreeNode"){
				cell=element;
				break;
				
			};
			element=element.parentNode;
			
		};
		if(cell!=null){
			var row=cell.parentNode;
			var node=row._node;
			tree.setCurrentNode(node);
			if(tree._currentNode!=node)return ;
			tree._draggingNode=node;
			tree._moueseDown=true;
			var x,y;
			if(browserType==__Browser_IE){
				x=event.clientX+document.body.scrollLeft;
				y=event.clientY+document.body.scrollTop;
				
			}else {
				x=event.pageX;
				y=event.pageY;
				
			};
			tree._xPosition=x;			
			tree._yPosition=y;
			
		}
	}
};
function _$SimpleTree_onMouseMove(tree){
	var x,y;
	if(browserType==__Browser_IE){
		x=event.clientX+document.body.scrollLeft;
		y=event.clientY+document.body.scrollTop;
		
	}else {
		x=event.pageX;
		y=event.pageY;
		
	};
	if(tree._draggable&&!tree._redispose&&tree._moueseDown){
		var draggingNode=tree._draggingNode;
		if(tree._onDragStart==null||_$fireKingfisherEvent(tree,"onDragStart",[tree,draggingNode])){
			if(Math.abs(x-tree._xPosition)>5||Math.abs(y-tree._yPosition)>5){
				if(draggingNode!=null){
					tree._redispose=true;
					var cursor=tree._$getDraggingCursor(draggingNode._activeCell);
					tree._draggingCursor=cursor;
					_$setVisible(cursor,true);
					tree.setCapture(true);
					
				}
			}
		}
	};
	if(tree._redispose){
		var cursor=tree._draggingCursor;
		var absPos=_$getAbsolutePosition(tree);
		cursor.style.left=x-(cursor.offsetWidth/2);
		cursor.style.top=y-(cursor.offsetHeight/2);
		if(parseInt(cursor.style.left) < absPos[0])
			cursor.style.left=absPos[0];
		else if(parseInt(cursor.style.left) + cursor.offsetWidth > absPos[0] + tree.offsetWidth)
			cursor.style.left=absPos[0] + tree.offsetWidth - cursor.offsetWidth;
		if(parseInt(cursor.style.top) < absPos[1])
			cursor.style.top=absPos[1];
		else if(parseInt(cursor.style.top) + cursor.offsetHeight > absPos[1] + tree.offsetHeight)
			cursor.style.top=absPos[1] + tree.offsetHeight - cursor.offsetHeight;

		var rows=tree._tbody.rows;
		var leftBound=0,topBound=0;
		if(x<absPos[0]){
			leftBound=-1;
			
		}else if(x>(absPos[0]+tree.offsetWidth)){
			leftBound=1;
			
		};
		if(y<absPos[1]){
			topBound=-1;			
			
		}else if(y>(absPos[1]+tree.offsetHeight)){
			topBound=1;
			
		};
		if(leftBound==0&&topBound==0){	//���û�������ķ�Χ
			clearInterval(tree._scrollTimeout);
			tree._scrollTimeout=0;
			var table=tree._tbody.parentNode;
			absPos=_$getAbsolutePosition(table);
			var index=((y-absPos[1])/table.offsetHeight)*rows.length;
			if(index>=0&&index<rows.length){
				var row=rows[index];
				var draggingNode=tree._draggingNode;
				var targetNode=row._node;
				var droppable=false;
				if(tree._onDragOver==null&&tree._$isSameTreeLevel(draggingNode,targetNode)){
					droppable=true;
					
				}else if(_$fireKingfisherEvent(tree,"onDragOver",[tree,draggingNode,targetNode])){
					droppable=true;
					
				};
				if(droppable){
					tree._$highlightDraggingTarget(targetNode);
					
				}else {
					tree._$highlightDraggingTarget(null);
					
				}
			}
		}else {
			//������������
			tree._$highlightDraggingTarget(null);
			if(tree._scrollTimeout==0){
				tree._scrollTimeout=setInterval("$(\""+tree.id+"\")._$scrollContent("+leftBound+", "+topBound+")",10);
				
			}
		}
	}
};
function _$SimpleTree_onMouseUp(tree){
	tree._moueseDown=false;
	if(tree._redispose){
		
		clearInterval(tree._scrollTimeout);
		tree._scrollTimeout=0;
		if(browserType==__Browser_IE){
			tree.releaseCapture();
			
		}else {
			
		};
		if(tree._draggingCursor!=null){
			tree._draggingCursor.parentNode.removeChild(tree._draggingCursor);
			
		};
		tree._draggingCursor=null;
		tree._redispose=false;
		var draggingNode=tree._draggingNode;
		var targetNode=tree._targetNode;
		if(draggingNode!=null&&targetNode!=null){
			if(tree._onDragEnd==null||_$fireKingfisherEvent(tree,"onDragEnd",[tree,draggingNode,targetNode])){
				tree._$beforeDragEnd(draggingNode,targetNode);
				tree.expandNode(targetNode);
				tree._currentNode=null;
				targetNode.addNode(draggingNode);
				tree.setCurrentNode(draggingNode);
				
			}
		};
		tree._$highlightDraggingTarget(null);
		
	}
};
function _$SimpleTree_onClick(tree){
	function _$cascadeSubNode(node){
		var subnodes=node.children();
		var itr=subnodes.iterator();
		while(itr.hasNext()){
			var subnode=itr.next();
			if(node._checkable)
				subnode.setChecked(node.isChecked());
			_$cascadeSubNode(subnode);
		};
		node._halfmoon=false;
		node.refresh();
	};
	function _$cascadeParentNode(node){
		var parentnode=node.getParent();
		if(parentnode!=null){
			var hasChecked=0;
			var hasHalf=false;
			var subnodes=parentnode.children();
			var itr=subnodes.iterator();
			while(itr.hasNext()){
				var subnode=itr.next();
				if(subnode._checkable && subnode.isChecked()){
					hasChecked++;
					hasHalf=hasHalf||(subnode._halfmoon==true);
				}
			};
			if(hasChecked==0){
				parentnode.setChecked(false);
			}
			else if(hasChecked>0 && hasChecked<subnodes.size()){
				parentnode.setChecked(true);
				parentnode._halfmoon=true;
			}
			else if(hasChecked==subnodes.size()){
				parentnode.setChecked(true);
				parentnode._halfmoon=false||hasHalf;
			};
			parentnode.refresh();
			
			_$cascadeParentNode(parentnode);
		}
	};

	var targ=_$getEventTarget();
	if(targ._kingfisherClass=="TreeNodeCheckBox"){
		var row=targ.parentNode.parentNode.parentNode;
		var node=row._node;
		node.setChecked(targ.checked);
		if(tree._onCheckStateChanged!=null&&!_$fireKingfisherEvent(tree,"onCheckStateChanged",[tree,node])){
			return ;
			
		}
		
		if(tree._checkableLinkage){
			_$cascadeSubNode(node);		//�����仯�ӽڵ�
			_$cascadeParentNode(node);	//�����仯���ڵ�
		}
		else
			node.refresh();
		
	}else if(targ._kingfisherClass=="TreeNodeButton"){
		var row=targ.parentNode.parentNode;
		var node=row._node;
		var tree=node._tree;		
		if(node._expanded){
			tree.collapseNode(node);
			
		}else {
			tree.expandNode(node);
			
		};
		event.cancelBubble=true;
		
	}else {
		var cell=null;
		var element=targ;
		while(element!=null){
			if(element._kingfisherClass=="DefaultTreeNode"){
				cell=element;
				break;
				
			};
			element=element.parentNode;
			
		};
		if(cell!=null){
			var row=cell.parentNode;
			var node=row._node;
			if(node._path!=null){
				if(tree._target==null){
					window.open(node._path,"_self");
					
				}else {
					window.open(node._path,tree._target);
					
				}
			};
			_$fireKingfisherEvent(tree,"onClick",[tree,node]);
			
		}
	}
};
function _$SimpleTree_onDblClick(tree){
	var cell=null;
	var targ=_$getEventTarget();
	while(targ!=null){
		if(targ._kingfisherClass=="DefaultTreeNode"){
			cell=targ;
			break;
			
		};
		targ=targ.parentNode;		
		
	};
	if(cell!=null){
		var row=cell.parentNode;
		var node=row._node;
		if(node._expanded){
			tree.collapseNode(node);
			
		}else {
			tree.expandNode(node);
			
		};
		_$fireKingfisherEvent(tree,"onDblClick",[tree,node]);
		
	}
};
function _$SimpleTree_initTree(){
	if(this._isParsed)return ;
	this._isParsed=true;
	var xmlDoc=$("__"+this.id);
	if(xmlDoc!=null){
		var xmlRoot;
		if(browserType==__Browser_IE){
			xmlRoot=xmlDoc.documentElement;
			
		}else {
			xmlRoot=xmlDoc.getElementsByTagName("nodes")[0];
			
		};
		if(xmlRoot!=null){
			this._$initTreeNodes(this._topNode,xmlRoot);
			
		}
	}
};
function _$SimpleTree_initTreeNodes(superiorNode,xmlNode,treeLevel){
	var childXmlNodes=xmlNode.childNodes;
	for(var i=0;i<childXmlNodes.length;i++){
		var childXmlNode=childXmlNodes[i];
		if(browserType==__Browser_IE||childXmlNode.nodeName.charAt(0)!='#'){
			var newTreeNode=new DefaultTreeNode(childXmlNode.getAttribute("label"));
			newTreeNode._$$setExpanded(parseBoolean(childXmlNode.getAttribute("expanded")));
			newTreeNode._hasChild=parseBoolean(childXmlNode.getAttribute("hasChild"));
			newTreeNode._icon=childXmlNode.getAttribute("icon");
			newTreeNode._expandedIcon=childXmlNode.getAttribute("expandedIcon");
			newTreeNode._checkable=parseBoolean(childXmlNode.getAttribute("checkable"));
			newTreeNode._checked=parseBoolean(childXmlNode.getAttribute("checked"));
			newTreeNode._path=childXmlNode.getAttribute("path");
			newTreeNode._tag=childXmlNode.getAttribute("tag");
			this._$initTreeNodes(newTreeNode,childXmlNode,treeLevel+1);
			superiorNode.addNode(newTreeNode);
			
		}
	}
	
};
function _$SimpleTree_getTarget(){
	return this._target;
	
};
function _$SimpleTree_setTarget(targ){
	this._target=targ;
	
};
function _$SimpleTree_getHighlightSelection(){
	return this._highlightSelection;
	
};
function _$SimpleTree_setHighlightSelection(highlightSelection){
	this._highlightSelection=highlightSelection;
	
};
function _$SimpleTree_getAllCheckedNodes(){
	function _$pushCheckedNode(parentNode,nodes){
		if(parentNode._nodes!=null){
			var element=parentNode._nodes._first;
			while(element!=null){
				var node=element._data;
				if(node.isChecked()){
					nodes.push(node);
					
				};
				_$pushCheckedNode(node,nodes);
				element=element._next;
				
			}
		};
		return null;
		
	};
	var nodes=new Array();
	_$pushCheckedNode(this._topNode,nodes);
	return nodes;
	
};
function _$SimpleTree_clearAllCheckedState(){
	var nodes=this.getAllCheckedNodes();
	for(var i=0;i<nodes.length;i++){
		var node=nodes[i];
		node.setChecked(false);
		node.refresh();
		
	}
};
function _$SimpleTree_onKeyDown(){
	switch(event.keyCode){
		case 37:{			//LEFT ARROW ��
			if(this._currentNode!=null){
				this.collapseNode(this._currentNode);
				
			};
			event.returnValue=false;
			break;
			
		};
		case 39:{			//RIGHT ARROW ��
			if(this._currentNode!=null){
				
				this.expandNode(this._currentNode);
				
			};
			event.returnValue=false;
			break;
			
		};
		case 38:{			//UP ARROW ��
			if(this._currentNode!=null){
				var cell=this._currentNode._activeCell;
				if(cell!=null){
					var nodeRow=cell.parentNode.previousSibling;
					if(nodeRow!=null){
						this.setCurrentNode(nodeRow._node);
						
					}
				}
			};
			event.returnValue=false;
			break;
			
		};
		case 40:{			//DOWN ARROW ��
			if(this._currentNode!=null){
				var cell=this._currentNode._activeCell;
				if(cell!=null){
					var nodeRow=cell.parentNode.nextSibling;
					if(nodeRow!=null){
						this.setCurrentNode(nodeRow._node);
						
					}
				}
			};
			event.returnValue=false;
			break;
			
		}
	}
};




//**************************
//���¼�󶨵����ڵ�//
//**************************
function RecordTreeNode(record,treeLevel){
	this._publicid=_$getPublicId();
	this._kingfisherClass="RecordTreeNode";
	this._record=record;
	this._treeLevel=treeLevel;
	this._icon=treeLevel._icon;
	this._expandedIcon=treeLevel._expandedIcon;
	this._hasChild=treeLevel._hasChild;
	this._checkable=treeLevel._checkable;
	this._type="record";
	
};
RecordTreeNode.prototype=new TreeNode();
RecordTreeNode.prototype.setRecord=function (record){
	this._record=record;
	
};
RecordTreeNode.prototype.getRecord=function (){
	return this._record;
	
};
RecordTreeNode.prototype.setTreeLevel=function (treeLevel){
	this._treeLevel=treeLevel;
	
};
RecordTreeNode.prototype.getTreeLevel=function (){
	return this._treeLevel;
	
};
RecordTreeNode.prototype.getLabel=function (){
	return this._record.getString(this._treeLevel._labelField);
	
};
RecordTreeNode.prototype.setLabel=function (label){
	this._record.setValue(this._treeLevel._labelField,label);
	
};
RecordTreeNode.prototype.isChecked=function (){
	var checked=false;
	if(this._treeLevel._checkedField!=null){
		checked=this._record.getValue(this._treeLevel._checkedField);
		
	}else {
		checked=this._checked;
		
	};
	return checked;
	
};
RecordTreeNode.prototype.setChecked=function (checked){
	if(this._treeLevel._checkedField!=null){
		this._record.setValue(this._treeLevel._checkedField,checked);
		
	}else {
		this._checked=checked;
		
	}
};
RecordTreeNode.prototype.getIcon=function (){
	var icon=null;
	if(this._treeLevel._iconField!=null){
		icon=this._record.getString(this._treeLevel._iconField);
		
	};
	if(icon==null)icon=this._icon;
	return icon;
	
};
RecordTreeNode.prototype.setIcon=function (icon){
	if(this._treeLevel._iconField!=null){
		this._record.setValue(this._treeLevel._iconField,icon);
		
	}else {
		this._icon=icon;
		
	}
};
RecordTreeNode.prototype.getExpandedIcon=function (){
	var expandedIcon=null;
	if(this._treeLevel._expandedIconField!=null){
		expandedIcon=this._record.getString(this._treeLevel._expandedIconField);
		
	}
	if(expandedIcon==null)expandedIcon=this._expandedIcon;
	return expandedIcon;
	
};
RecordTreeNode.prototype.setExpandedIcon=function (expandedIcon){
	if(this._treeLevel._expandedIconField!=null){
		this._record.setValue(this._treeLevel._expandedIconField,expandedIcon);
		
	}else {
		this._expandedIcon=expandedIcon;
		
	}
};
RecordTreeNode.prototype.getPath=function (){
	return this._record.getString(this._treeLevel._pathField);
	
};
RecordTreeNode.prototype.setPath=function (path){
	if ((path.length>0) && (path.substr(0,4)=='http'))
	{

	}
	else if(path.length>0&&path.charAt(0)=='/'){
		path=__CONTEXT_PATH+path;
		
	};
	if(this._treeLevel._pathField!=null){
		this._record.setValue(this._treeLevel._pathField,path);
		
	}else {
		this._path=path;
		
	}
};




//**************************
//�ڵ��Ļ���//
//**************************
function TreeLevel(name){
	this._name=name;
	this._hasChild=true;
	this._expanded=false;
	this._dataset=null;
	this._labelField=null;
	this._icon=null;
	this._iconField=null;
	this._expandedIcon=null;
	this._expandedIconField=null;
	this._pathField=null;
	this._checkedField=null;
	this._checkable=false;
	this._autoSyncRecordWithDragging=false;
	this._treeLevels=new HashList();
	
};
TreeLevel.prototype.addTreeLevel=function (treeLevel){
	this._treeLevels.put(treeLevel._name,treeLevel);
	
};
TreeLevel.prototype.getTreeLevel=function (name){
	return this._treeLevels.get(name);
	
};
TreeLevel.prototype.getTreeLevels=function (){
	return this._treeLevels;	
	
};
TreeLevel.prototype.getName=function (){
	return this._name;
	
};
TreeLevel.prototype.getDataset=function (){
	return this._dataset;
	
};
TreeLevel.prototype.setDataset=function (dataset){
	this._dataset=kingfisher.feather.getDataset(dataset);
	
};
TreeLevel.prototype.getLabelField=function (){
	return this._labelField;
	
};
TreeLevel.prototype.setLabelField=function (labelField){
	this._labelField=labelField;
	
};
TreeLevel.prototype.getIcon=function (){
	return this._icon;
	
};
TreeLevel.prototype.setIcon=function (icon){
	this._icon=icon;
	
};
TreeLevel.prototype.getIconField=function (){
	return this._iconField;
	
};
TreeLevel.prototype.setIconField=function (iconField){
	this._iconField=iconField;
	
};
TreeLevel.prototype.getExpandedIcon=function (){
	return this._expandedIcon;
	
};
TreeLevel.prototype.setExpandedIcon=function (expandedIcon){
	this._expandedIcon=expandedIcon;
	
};
TreeLevel.prototype.getExpandedIconField=function (){
	return this._expandedIconField;
	
};
TreeLevel.prototype.setExpandedIconField=function (expandedIconField){
	this._expandedIconField=expandedIconField;
	
};
TreeLevel.prototype.getPathField=function (){
	return this._pathField;
	
};
TreeLevel.prototype.setPathField=function (pathField){
	this._pathField=pathField;
	
};
TreeLevel.prototype.getCheckedField=function (){
	return this._checkedField;
	
};
TreeLevel.prototype.setCheckedField=function (checkedField){
	this._checkedField=checkedField;	
	
};
TreeLevel.prototype.isCheckable=function (){
	return this._checkable;
	
};
TreeLevel.prototype.setCheckable=function (checkable){
	this._checkable=checkable;
	
};
TreeLevel.prototype.isAutoSyncRecordWithDragging=function (){
	return this._autoSyncRecordWithDragging;
	
};
TreeLevel.prototype.setAutoSyncRecordWithDragging=function (autoSyncRecordWithDragging){
	this._autoSyncRecordWithDragging=autoSyncRecordWithDragging;
	
};



//**************************
//������еļ򵥲����������//
//**************************
function SimpleTreeLevel(name){
	this._name=name;
	this._kingfisherClass="SimpleTreeLevel";
	this._treeLevels=new HashList();
	this._masterKeyFields=null;
	this._detailKeyParameters=null;
	this._masterKeyFieldArray=null;
	this._detailKeyParameterArray=null;
	
};
SimpleTreeLevel.prototype=new TreeLevel();
SimpleTreeLevel.prototype.isHasChild=function (){
	return this._hasChild;
	
};
SimpleTreeLevel.prototype.setHasChild=function (hasChild){
	this._hasChild=hasChild;
	
};
SimpleTreeLevel.prototype.isExpanded=function (){
	return this._expanded;
	
};
SimpleTreeLevel.prototype.setExpanded=function (expanded){
	this._expanded=expanded;
	
};
SimpleTreeLevel.prototype.getMasterKeyFields=function (){
	return this._masterKeyFields;
	
};
SimpleTreeLevel.prototype.setMasterKeyFields=function (masterKeyFields){
	this._masterKeyFields=masterKeyFields;
	if(masterKeyFields!=null){
		this._masterKeyFieldArray=masterKeyFields.split(",");
		
	}
};
SimpleTreeLevel.prototype.getDetailKeyParameters=function (){
	return this._detailKeyParameters;
	
};
SimpleTreeLevel.prototype.setDetailKeyParameters=function (detailKeyParameters){
	this._detailKeyParameters=detailKeyParameters;	
	if(detailKeyParameters!=null){
		this._detailKeyParameterArray=detailKeyParameters.split(",");
		
	}
};
SimpleTreeLevel.prototype.getMasterKeyFieldArray=function (){
	return this._masterKeyFieldArray;
	
};
SimpleTreeLevel.prototype.getDetailKeyParameterArray=function (){
	return this._detailKeyParameterArray;
	
};



//**************************
//������еĵݹ�����������
//**************************
function RecursiveTreeLevel(name){
	this._name=name;
	this._kingfisherClass="RecursiveTreeLevel";
	this._treeLevels=new HashList();
	this._masterKeyFields=null;
	this._detailKeyParameters=null;
	this._recursiveKeyFields=null;
	this._recursiveKeyParameters=null;
	this._masterKeyFieldArray=null;
	this._detailKeyParameterArray=null;
	this._recursiveKeyFieldArray=null;
	this._recursiveKeyParameterArray=null;
	this._hasChildField=null;
	
};
RecursiveTreeLevel.prototype=new TreeLevel();
RecursiveTreeLevel.prototype.getHasChildField==function (){
	
	return this._hasChildField;
};
RecursiveTreeLevel.prototype.setHasChildField=function (hasChildField){
	
	this._hasChildField = hasChildField;
};
RecursiveTreeLevel.prototype.getMasterKeyFields=function (){
	return this._masterKeyFields;
	
};
RecursiveTreeLevel.prototype.setMasterKeyFields=function (masterKeyFields){
	this._masterKeyFields=masterKeyFields;
	if(masterKeyFields!=null){
		this._masterKeyFieldArray=masterKeyFields.split(",");
		
	}
};
RecursiveTreeLevel.prototype.getDetailKeyParameters=function (){
	return this._detailKeyParameters;
	
};
RecursiveTreeLevel.prototype.setDetailKeyParameters=function (detailKeyParameters){
	this._detailKeyParameters=detailKeyParameters;
	if(detailKeyParameters!=null){
		this._detailKeyParameterArray=detailKeyParameters.split(",");
		
	}
};
RecursiveTreeLevel.prototype.getRecursiveKeyFields=function (){
	return this._recursiveKeyFields;
	
};
RecursiveTreeLevel.prototype.setRecursiveKeyFields=function (recursiveKeyFields){
	this._recursiveKeyFields=recursiveKeyFields;
	if(recursiveKeyFields!=null){
		this._recursiveKeyFieldArray=recursiveKeyFields.split(",");		
		
	}
};
RecursiveTreeLevel.prototype.getRecursiveKeyParameters=function (){
	return this._recursiveKeyParameters;
	
};
RecursiveTreeLevel.prototype.setRecursiveKeyParameters=function (recursiveKeyParameters){
	this._recursiveKeyParameters=recursiveKeyParameters;
	if(recursiveKeyParameters!=null){
		this._recursiveKeyParameterArray=recursiveKeyParameters.split(",");
		
	}
};
RecursiveTreeLevel.prototype.getMasterKeyFieldArray=function (){
	return this._masterKeyFieldArray;
	
};
RecursiveTreeLevel.prototype.getDetailKeyParameterArray=function (){
	return this._detailKeyParameterArray;
	
};
RecursiveTreeLevel.prototype.getRecursiveKeyFieldArray=function (){
	return this._recursiveKeyFieldArray;
	
};
RecursiveTreeLevel.prototype.getRecursiveKeyParameterArray=function (){
	return this._recursiveKeyParameterArray;
	
};



//**************************
//������ؼ�//
//**************************
function _$buildDataTree(id,viewModel){
	var tree=_$buildSimpleTree(id);
	tree.processDatasetMessage=_$DataTree_processDatasetMessage;
	tree.activate=_$DataTree_activate;
	tree._$destroy=_$SimpleTree_destroy;
	tree.destroy=_$DataTree_destroy;
	tree.establishBinding=_$DataTree_establishBinding;
	tree._$abolishBinding=_$DataControl_abolishBinding;
	tree.disableBinding=_$DataControl_disableBinding;
	tree.enableBinding=_$DataControl_enableBinding;
	tree.refresh=_$DataTree_refresh;
	tree._$initDataTree=_$DataTree_initDataTree;
	tree.findNodeByRecord=_$DataTree_findNodeByRecord;
	tree.refreshNodeByRecord=_$DataTree_refreshNodeByRecord;
	tree.setCurrentNodeByRecord=_$DataTree_setCurrentNodeByRecord;
	tree._$initTreeLevels=_$DataTree_initTreeLevels;
	tree._$initTreeNodes=_$DataTree_initTreeNodes;
	tree._$checkNodeRecord=_$DataTree_checkNodeRecord;
	tree._$showNextLevelRecordNode=_$DataTree_showNextLevelRecordNode;
	tree._$isSameTreeLevel=_$DataTree_isSameTreeLevel;
	tree._$beforeDragEnd=_$DataTree_beforeDragEnd;
	tree.addTreeLevel=_$DataTree_addTreeLevel;
	tree.getTreeLevel=_$DataTree_getTreeLevel;
	tree.getTreeLevels=_$DataTree_getTreeLevels;
	tree._viewModel=viewModel;	
	tree._topLevel=new TreeLevel("__toplevel");
	tree._topNode._treeLevel=tree._topLevel;
	if(!tree.className)tree.className="Tree";
	return tree;
	
};
KingfisherFactory._$registerComponentType("DataTree",_$buildDataTree);
function _$DataTree_destroy(){
	this._$abolishBinding();
	this._$destroy();
	this._topLevel=null;
	
};
function _$DataTree_processDatasetMessage(message,dataset,args){
	switch(message){
		case __Dataset_MSG_REFRESH:{
			this.refresh(dataset);
			break;
			
		};
		case __Dataset_MSG_DATA_CHANGED:{
			this.refreshNodeByRecord(dataset._current);
			break;
			
		};
		case __Dataset_MSG_RECORD_DELETED:{
			var record=args[0];
			var node=this.findNodeByRecord(record);
			if(node!=null){
				node.remove();
				var dataset=record._dataset;
				if(dataset._current!=null){
					node=this.findNodeByRecord(dataset._current);
					if(node!=null)this.setCurrentNode(node);
					
				}
			};
			break;
			
		}
	}
};
function _$DataTree_activate(){
	if(!this._active){
		this._$initDataTree();
		this._$initTree();
		this.establishBinding();
		this._active=true;
		this._topNode.setExpanded(true);
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$DataTree_establishBinding(){
	function addObserver(tree,treeLevel){
		var objectArray=treeLevel._treeLevels._objectArray;		
		for(var i=0;i<objectArray.length;i++){
			var newTreeLevel=objectArray[i];
			var dataset=newTreeLevel._dataset;
			if(dataset!=null){
				tree._disableBindingCount=0;
				dataset.addObserver(tree);
				
			}
			addObserver(tree,newTreeLevel);
		}
	};
	addObserver(this,this._topLevel);
	
};
function _$DataTree_refresh(dataset){
	function _$refreshDataNode(parentNode,dataset,deletedNodes){
		if(parentNode._nodes!=null){
			var element=parentNode._nodes._first;
			while(element!=null){
				var node=element._data;
				if(dataset!=null){
					if(node._kingfisherClass=="RecordTreeNode"){
						var record=node._record;
						if(record!=null){
							if(record._state==__Record_STATE_DELETE||record._dataset==null){
								deletedNodes.push(node);
								
							}else if(record._dataset==dataset){
								if(node._rowid!=record._rowid){
									node.refresh();
									node._rowid=record._rowid;
									
								}
							}
						}
					}else {
						node.refresh();
						
					}
				}else {
					node.refresh();
					
				};
				if(node._expanded&&node._tree!=null){
					_$refreshDataNode(node,dataset,deletedNodes);
					
				};
				element=element._next;
				
			}
		}
	};
	
	var deletedNodes=new Array();
	_$refreshDataNode(this._topNode,dataset,deletedNodes);	
	for(var i=0;i<deletedNodes.length;i++){
		deletedNodes[i].remove();
			
	};
	delete deletedNodes;
	
};
function _$DataTree_findNodeByRecord(record){
	function findNode(parentNode,record){
		if(parentNode._nodes!=null){
			var element=parentNode._nodes._first;
			while(element!=null){
				var node=element._data;
				if(node._record==record){
					return node;
					
				};
				if(node._tree!=null){
					var childNode=findNode(node,record);
					if(childNode!=null){
						return childNode;
						
					}
				};
				element=element._next;
				
			}
		};
		return null;
		
	};
	return findNode(this._topNode,record);
	
};
function _$DataTree_refreshNodeByRecord(record){
	function findNode(parentNode,record){
		if(parentNode._nodes!=null){
			var element=parentNode._nodes._first;
			while(element!=null){
				var node=element._data;
				if(node._record==record){
					return node;
					
				};
				if(node._expanded&&node._tree!=null){
					var childNode=findNode(node,record);
					if(childNode!=null){
						return childNode;
						
					}
				};
				element=element._next;
				
			}
		};
		return null;
		
	};
	if(record==null)return ;
	if(this._currentNode!=null&&this._currentNode._record==record){
		this._currentNode.refresh();
		
	}
	var node=findNode(this._topNode,record);
	if(node!=null)node.refresh();
	
};
function _$DataTree_setCurrentNodeByRecord(record){
	var node=this.findNodeByRecord(record);
	if(node!=null)this.setCurrentNode(node);
	
};
function _$DataTree_addTreeLevel(treeLevel){
	this._topLevel.addTreeLevel(treeLevel);
	
};
function _$DataTree_getTreeLevel(name){
	return this._topLevel.getTreeLevel(name);
	
};
function _$DataTree_getTreeLevels(){
	return this._topLevel.getTreeLevels();
	
};
function _$DataTree_initDataTree(){
	var xmlDoc=$("__"+this.id+"$levels");
	if(xmlDoc!=null){
		var xmlRoot;
		if(browserType==__Browser_IE){
			xmlRoot=xmlDoc.documentElement;
			
		}else {
			xmlRoot=xmlDoc.getElementsByTagName("levels")[0];
			
		};
		if(xmlRoot!=null){
			this._$initTreeLevels(this._topLevel,xmlRoot);
			
		}
	}
};
function _$DataTree_initTreeLevels(treeLevel,node){
	var childNodes=node.childNodes;
	for(var i=0;i<childNodes.length;i++){
		var childNode=childNodes[i];
		if(browserType==__Browser_IE||childNode.nodeName.charAt(0)!='#'){
			var type=childNode.getAttribute("type");
			var name=childNode.getAttribute("name");
			var newTreeLevel;
			if(type=="recursive"){
				newTreeLevel=new RecursiveTreeLevel(name);
				newTreeLevel.setRecursiveKeyFields(childNode.getAttribute("recursiveKeyFields"));
				newTreeLevel.setRecursiveKeyParameters(childNode.getAttribute("recursiveKeyParameters"));
				newTreeLevel.setHasChildField(childNode.getAttribute("hasChildField"));
				
			}else {
				newTreeLevel=new SimpleTreeLevel(name);
				newTreeLevel._hasChild=parseBoolean(childNode.getAttribute("hasChild"));
				newTreeLevel._expanded=parseBoolean(childNode.getAttribute("expanded"));
				
			}
			newTreeLevel.setMasterKeyFields(childNode.getAttribute("masterKeyFields"));
			newTreeLevel.setDetailKeyParameters(childNode.getAttribute("detailKeyParameters"));
			newTreeLevel._dataset=kingfisher.feather.getDataset(childNode.getAttribute("dataset"));
			newTreeLevel._labelField=childNode.getAttribute("labelField");
			newTreeLevel._icon=childNode.getAttribute("icon");
			newTreeLevel._iconField=childNode.getAttribute("iconField");
			newTreeLevel._expandedIcon=childNode.getAttribute("expandedIcon");
			newTreeLevel._expandedIconField=childNode.getAttribute("expandedIconField");
			newTreeLevel._pathField=childNode.getAttribute("pathField");
			newTreeLevel._checkedField=childNode.getAttribute("checkedField");
			newTreeLevel._checkable=parseBoolean(childNode.getAttribute("checkable"));
			newTreeLevel._autoSyncRecordWithDragging=parseBoolean(childNode.getAttribute("autoSyncRecordWithDragging"));
			this._$initTreeLevels(newTreeLevel,childNode);
			treeLevel.addTreeLevel(newTreeLevel);
			
		}
	}
};
function _$DataTree_initTreeNodes(superiorNode,xmlNode){
	var viewModel=this._viewModel;
	var recordMapping=viewModel._recordMapping;
	if(recordMapping==null)	return ;
	var childXmlNodes=xmlNode.childNodes;
	if(browserType==__Browser_IE){
		superiorNode.setExpanded(childXmlNodes.length>0);
		
	}else {
		var hasChild=false;
		for(var i=0;i<childXmlNodes.length;i++){
			if(childXmlNodes[i].nodeName.charAt(0)!='#'){
				hasChild=true;
				break;
				
			}
		};
		superiorNode.setExpanded(hasChild);
		
	};
	for(var i=0;i<childXmlNodes.length;i++){
		var childXmlNode=childXmlNodes[i];
		if(browserType==__Browser_IE||childXmlNode.nodeName.charAt(0)!='#'){
			var newTreeNode=null;
			var idValue=childXmlNode.getAttribute("record");
			if(idValue!=null){
				var record=recordMapping[idValue];
				if(record!=null){
					var level=childXmlNode.getAttribute("level");
					var treeLevel=null;
					var superiorLevel=superiorNode._treeLevel;
					if(superiorLevel!=null){
						if(superiorLevel._kingfisherClass=="RecursiveTreeLevel"&&superiorLevel._name==level){
							treeLevel=superiorLevel;							
							
						}else {
							treeLevel=superiorLevel.getTreeLevel(level);
							
						}
					};
					if(treeLevel==null){
						alert("Could not found a suitable TreeLevel! ["+level+"]");
						return ;
						
					};
					record._$loadDataFromXMLNode();
					
					newTreeNode=new RecordTreeNode(record,treeLevel);
					if(treeLevel._kingfisherClass=="RecursiveTreeLevel"){
						if(treeLevel._hasChildField!=null)
							newTreeNode._hasChild=(record.getValue(treeLevel._hasChildField)>0);
					}
					else{
						var hasChild=childXmlNode.getAttribute("hasChild");
						if(hasChild!=null){
							newTreeNode._hasChild=parseBoolean(hasChild);
							
						}
					}
				}else {
					alert("Could not found a matching Record! ["+idValue+"]");
					return ;
					
				}
			}else {
				newTreeNode=new DefaultTreeNode(childXmlNode.getAttribute("label"));
				newTreeNode._$$setExpanded(parseBoolean(childXmlNode.getAttribute("expanded")));
				newTreeNode._hasChild=parseBoolean(childXmlNode.getAttribute("hasChild"));
				newTreeNode._icon=childXmlNode.getAttribute("icon");
				newTreeNode._expandedIcon=childXmlNode.getAttribute("expandedIcon");
				newTreeNode._checkable=parseBoolean(childXmlNode.getAttribute("checkable"));
				newTreeNode._checked=parseBoolean(childXmlNode.getAttribute("checked"));
				newTreeNode._path=childXmlNode.getAttribute("path");
				newTreeNode._tag=childXmlNode.getAttribute("tag");
				var superiorLevel=superiorNode._treeLevel;
				if(superiorLevel!=null)
					newTreeNode._treeLevel=superiorLevel.getTreeLevel(childXmlNode.getAttribute("level"));
				
			};
			if(newTreeNode!=null){
				this._$initTreeNodes(newTreeNode,childXmlNode);
				superiorNode.addNode(newTreeNode);
				
			}
		}
	};
	if(superiorNode==this._topNode){
		var recordMapRef=viewModel._properties.getValue("__recordMapRef");
		if(recordMapRef>1){
			viewModel._properties.setValue("__recordMapRef",--recordMapRef);
			
		}else {
			
			viewModel._properties.removeParameter("__recordMapRef");
			viewModel._recordMapping=null;
			
		}
	}
};
function _$DataTree_checkNodeRecord(node){
	if(node==null)return true;
	if(this._currentNode!=null){
		if(this._currentNode._tree!=null){
			var record=this._currentNode._record;
			if(record!=null&&record._dataset!=null){
				if(!record.post()){
					return false;
					
				}
			}
		}
	};
	var recordSet=new Array();
	var currentNode=node;
	var nodeDs=null;
	do{
		var record=currentNode.getRecord();
		if(record._dataset!=nodeDs){
			recordSet.push(record);
			nodeDs=record._dataset;
			
		};
		currentNode=currentNode.getParent();
		
	}while(currentNode!=this._topNode&&currentNode!=null&&currentNode._kingfisherClass=="RecordTreeNode");
	var messages=new Array();
	for(var i=0;i<recordSet.length;i++){
		var record=recordSet[i];
		var dataset=record._dataset;
		var message=null;
		if(record!=dataset._current){
			if(record._recordset==dataset._recordset){
				message=__Dataset_MSG_CURRENT_CHANGED;
				
			}else {
				message=__Dataset_MSG_REFRESH;
				
			}
		};
		messages.push(message);
		dataset.disableControls();
		
	};
	for(var i=messages.length-1;i>=0;i--){
		var record=recordSet[i];
		var dataset=record._dataset;
		var message=messages[i];
		if(message!=null){
			
			if(message==__Dataset_MSG_REFRESH){
				dataset._$replaceRecordSet(record._recordset);
				
			};
			dataset.setCurrent(record);
			
		};
		dataset.enableControls();
		if(message!=null){
			this.disableBinding();
			try{
				if(message==__Dataset_MSG_REFRESH){
					dataset.broadcastDatasetMessage(__Dataset_MSG_REFRESH,null);
					
				}else {
					dataset.broadcastDatasetMessage(__Dataset_MSG_CURRENT_CHANGED,null);
					
				}
			}finally{
				this.enableBinding();
				
			}
		}
	};
	return true;
	
};
function _$DataTree_showNextLevelRecordNode(node){
	function _$expandNextLevel(parentNode,superiorLevel,treeLevel){
		var superiorLevelDs=superiorLevel._dataset;
		var parentNodeRecord=parentNode.getRecord();
		var dataset=treeLevel._dataset;
		var levelRecord=dataset._current;
		var oldRecordset=dataset._recordset;
		dataset.disableControls();
		try{
			if(treeLevel._kingfisherClass=="SimpleTreeLevel"){
				var hasLink=(dataset._masterDetailLink!=null&&dataset._masterDetailLink._masterDataset!=null);
				var count=0;
				if(superiorLevelDs!=null){
					var async=dataset._async;
					dataset._async=false;
					if(hasLink){
						dataset._$relatingRecord(superiorLevelDs,parentNodeRecord);
						
					}else {
						var keyFields=treeLevel._masterKeyFieldArray;
						var keyParameters=treeLevel._detailKeyParameterArray;
						var parameters=dataset.parameters();
						for(var i=0;i<keyFields.length;i++){
							parameters.setValue(keyParameters[i],parentNodeRecord.getValue(keyFields[i]));
							
						}
						count=dataset.loadData("after");
						
					};
					dataset._async=async;
					
				};
				if(hasLink){
					var record=dataset.getFirstRecord();
					while(record!=null){
						var childNode=new RecordTreeNode(record,treeLevel);
						parentNode.addNode(childNode);
						record=record.getNextRecord();
						
					}
				}else {
					var i=0;
					var record=dataset._current;
					while(record!=null&&i<count){
						var childNode=new RecordTreeNode(record,treeLevel);
						parentNode.addNode(childNode);
						record=record.getNextRecord();
						i++;
						
					}
				}
			}else if(treeLevel._kingfisherClass=="RecursiveTreeLevel"){
				if(superiorLevelDs!=null){
					superiorLevelDs.setCurrent(parentNodeRecord);
					var parameters=dataset.parameters();
					var keyFields,keyParameters;
					if(superiorLevel!=treeLevel){
						keyFields=treeLevel._masterKeyFieldArray;
						keyParameters=treeLevel._detailKeyParameterArray;
						
					}else {
						keyFields=treeLevel._recursiveKeyFieldArray;
						keyParameters=treeLevel._recursiveKeyParameterArray;
						
					};
					for(var i=0;i<keyFields.length;i++){
						parameters.setValue(keyParameters[i],superiorLevelDs.getValue(keyFields[i]));
						
					};
					var async=dataset._async;
					dataset._async=false;
					var count=dataset.loadData("after");
					dataset._async=async;
					var i=0;
					var record=dataset._current;
					if(record!=null){
						record=record.getNextRecord();
						while(record!=null&&i<count){
							
							var childNode=new RecordTreeNode(record,treeLevel);
							if(treeLevel._hasChildField!=null)
								childNode._hasChild=(record.getValue(treeLevel._hasChildField)>0);
							parentNode.addNode(childNode);
							record=record.getNextRecord();
							i++;
							
						}
					}
				}
			};
			if(oldRecordset!=dataset._recordset){
				dataset._recordset=oldRecordset;
				
			};
			if(levelRecord!=dataset._current){
				dataset._current=levelRecord;
				
			}
		}finally{
			dataset.enableControls();
			
		}
	};
	if(node._hasExpanded||node._record==null)return ;
	var treeLevel=node._treeLevel;
	if(treeLevel==null)return ;
	if(treeLevel._kingfisherClass=="RecursiveTreeLevel"){
		_$expandNextLevel(node,treeLevel,treeLevel);
		
	};
	var objectArray=treeLevel._treeLevels._objectArray;
	for(var i=0;i<objectArray.length;i++){
		var newTreeLevel=objectArray[i];
		_$expandNextLevel(node,treeLevel,newTreeLevel);
		
	}
};
function _$DataTree_isSameTreeLevel(draggingNode,targetNode){
	var dragParentNodeLevel=null,targetNodeLevel=null;
	var draggingParentNode=draggingNode.getParent();
	if(draggingParentNode!=null&&typeof(draggingParentNode.getTreeLevel)=="function"){
		dragParentNodeLevel=draggingParentNode.getTreeLevel();
		
	};
	if(typeof(targetNode.getTreeLevel)=="function"){
		targetNodeLevel=targetNode.getTreeLevel();
		
	};
	
	return (dragParentNodeLevel==targetNodeLevel);
	
};
function _$DataTree_beforeDragEnd(draggingNode,targetNode){
	var dragNodeLevel=null,dragParentNodeLevel=null,targetNodeLevel=null;
	if(typeof(draggingNode.getTreeLevel)=="function"){
		dragNodeLevel=draggingNode.getTreeLevel();
		
	};
	var draggingParentNode=draggingNode.getParent();	
	if(draggingParentNode!=this._topNode){
		if(typeof(draggingParentNode.getTreeLevel)=="function"){
			dragParentNodeLevel=draggingParentNode.getTreeLevel();
			
		}
	}else {
		if(dragNodeLevel._kingfisherClass=="RecursiveTreeLevel"){
			dragParentNodeLevel=dragNodeLevel;
			
		}
	};
	if(typeof(targetNode.getTreeLevel)=="function"){
		targetNodeLevel=targetNode.getTreeLevel();
		
	};
	var autoSyncEnd=false;
	if(dragNodeLevel._autoSyncRecordWithDragging&&dragParentNodeLevel==targetNodeLevel){
		var dragNodeRecord=draggingNode.getRecord();
		var dragNodeDataset=dragNodeRecord._dataset;
		var targetNodeRecord=targetNode.getRecord();
		var targetNodeDataset=targetNodeRecord._dataset;
		if(dragNodeLevel._kingfisherClass=="SimpleTreeLevel"&&targetNodeLevel._kingfisherClass=="SimpleTreeLevel"&&dragNodeDataset._masterDetailLink!=null){
			dragNodeDataset.disableControls();
			targetNodeDataset.setCurrent(targetNodeRecord);
			
			var newInsRecord=dragNodeDataset.insertRecord();
			newInsRecord.copyRecord(dragNodeRecord);
			dragNodeRecord.setState(__Record_STATE_NEW);
			dragNodeDataset.deleteRecord(dragNodeRecord);
			
			var masterDetailLink=dragNodeDataset._masterDetailLink;
			var masterKeyFieldArray=masterDetailLink.getMasterKeyFieldArray();
			var detailKeyFieldArray=masterDetailLink.getDetailKeyFieldArray();
			if(masterKeyFieldArray.length==detailKeyFieldArray.length){
				for(var i=0;i<masterKeyFieldArray.length;i++){
					newInsRecord.setValue(detailKeyFieldArray[i],targetNodeRecord.getValue(masterKeyFieldArray[i]));
					
				}
			};
			newInsRecord.setState(__Record_STATE_MODIFY);
			dragNodeDataset.enableControls();
			dragNodeDataset.broadcastDatasetMessage(__Dataset_MSG_CURRENT_CHANGED,null);
			draggingNode.setRecord(newInsRecord);
			autoSyncEnd=true;
			
		}
	};
	if(dragNodeLevel._autoSyncRecordWithDragging&&!autoSyncEnd){
		alert("Can not synchronize record with draggin automatically! Please process it manually.");
		return ;		
		
	}
};



//**************************
//���ͱ���еĽڵ�//
//**************************
function TreeGridNode(record){
	this._publicid=_$getPublicId();
	this._kingfisherClass="TreeGridNode";
	this._record=record;
	this._hasChild=true;
	
};
TreeGridNode.prototype=new TreeNode();
TreeGridNode.prototype.getLabel=function (){
	return this._kingfisherClass+"\n"+this._record.toString ();
	
};
TreeGridNode.prototype.setLabel=function (label){
	
};
TreeGridNode.prototype.setRecord=function (record){
	this._record=record;
	
};
TreeGridNode.prototype.getRecord=function (){
	return this._record;
	
};
TreeGridNode.prototype._$setExpanded=TreeNode.prototype.setExpanded;
TreeGridNode.prototype.setExpanded=function (expanded){
	if(this._expanded!=expanded){
		this._record._rowid=_$getRecordSerialId();
		
	};
	this._$setExpanded(expanded);
	
};



//**************************
//���ͱ��ؼ�//
//**************************
function _$buildTreeGrid(id,viewModel){
	var table=_$buildTable(id,viewModel);
	table.activate=_$TreeGrid_activate;
	table.getTopNode=_$SimpleTree_getTopNode;
	table.getFirstRootNode=_$SimpleTree_getFirstRootNode;
	table.getLastRootNode=_$SimpleTree_getLastRootNode;
	table._$initTree=_$TreeGrid_initTree;
	table.expandNode=_$TreeGrid_expandNode;
	table.refreshNode=_$TreeGrid_refreshNode;
	table.collapseNode=_$TreeGrid_collapseNode;
	table.getCurrentNode=_$TreeGrid_getCurrentNode;
	table.setCurrentNode=_$TreeGrid_setCurrentNode;
	table.getTreeColumn=_$TreeGrid_getTreeColumn;
	table.setTreeColumn=_$TreeGrid_setTreeColumn;
	table.getHasChildField=_$TreeGrid_getHasChildField;
	table.setHasChildField=_$TreeGrid_setHasChildField;
	table.getRecursiveKeyFields=_$TreeGrid_getRecursiveKeyFields;
	table.setRecursiveKeyFields=_$TreeGrid_setRecursiveKeyFields;
	table.getRecursiveKeyParameters=_$TreeGrid_getRecursiveKeyParameters;
	table.setRecursiveKeyParameters=_$TreeGrid_setRecursiveKeyParameters;
	table.getRecursiveKeyFieldArray=_$TreeGrid_getRecursiveKeyFieldArray;	
	table.getRecursiveKeyParameterArray=_$TreeGrid_getRecursiveKeyParameterArray;
	table._$destroy=table.destroy;
	table.destroy=_$TreeGrid_destroy;
	table._$processDatasetMessage=table.processDatasetMessage;
	table.processDatasetMessage=_$TreeGrid_processDatasetMessage;
	table._$$onMouseDown=table._$onMouseDown;
	table._$onMouseDown=_$TreeGrid_onMouseDown;
	table._$$sizeCellEditor=table._$sizeCellEditor;
	table._$sizeCellEditor=_$TreeGrid_sizeCellEditor;
	table._$$onRecordClick=table._$onRecordClick;
	table._$onRecordClick=_$TreeGrid_onRecordClick;
	table._$addColumn=table.addColumn;
	table.addColumn=_$TreeGrid_addColumn;
	table.getVisibleCount=_$TreeGrid_getVisibleCount;
	table._$getNextNode=_$TreeGrid_getNextNode;
	table._$addNode=_$SimpleTree_addNode;
	table._$$initNode=_$SimpleTree_initNode;
	table._$initNode=_$TreeGrid_initNode;
	table._$removeTreeNode=_$SimpleTree_removeTreeNode;
	table._$$disableBindingTree=_$SimpleTree_disableBindingTree;
	table._$disableBindingTree=_$TreeGrid_disableBindingTree;
	table._$paintNodeRow=_$TreeGrid_paintNodeRow;
	table._$removeNodeCell=_$TreeGrid_removeNodeCell;
	table._$showNextLevelRecordNode=_$TreeGrid_showNextLevelRecordNode;
	table._$getDatasetFirstRecord=_$TreeGrid_getDatasetFirstRecord;
	table._$getDatasetLastRecord=_$TreeGrid_getDatasetLastRecord;
	table._$getDatasetPrevRecord=_$TreeGrid_getDatasetPrevRecord;
	table._$getDatasetNextRecord=_$TreeGrid_getDatasetNextRecord;
	table._$moveFirst=_$TreeGrid_moveFirst;
	table._$movePrev=_$TreeGrid_movePrev;
	table._$moveNext=_$TreeGrid_moveNext;
	table._$moveLast=_$TreeGrid_moveLast;
	table._$move=_$TreeGrid_move;
	table._$insertRecord=_$TreeGrid_insertRecord;
	table._$initTreeNodes=_$TreeGrid_initTreeNodes;
	table.setExpandLevel=_$TreeGrid_setExpandLevel;
	var treeNode=new DefaultTreeNode();
	treeNode._$$setExpanded(true);
	treeNode._tree=table;
	treeNode._visible=true;
	table._topNode=treeNode;
	table._recordMapping=new HashList();
	table._treeColumn=null;
	table._hasChildField=null;
	table._recursiveKeyFields=null;
	table._recursiveKeyParameters=null;
	table._recursiveKeyFieldArray=null;
	table._recursiveKeyParameterArray=null;
	table._visibleCount=0;
	table._sortable=false;	
	table._expandLevel=1;
	if(!table.className)table.className="DataTable";
	return table;
	
};
KingfisherFactory._$registerComponentType("TreeGrid",_$buildTreeGrid);
function _$TreeGrid_activate(){
	if(!this._active){
		if(this._treeColumn!=null){
			var column=this.getColumn(this._treeColumn);
			if(column!=null){
				var table=this;
				EventManager.addKingfisherEvent(column,"onRefresh",function (column,row,cell,value,record){
					return _$refreshTreeColumn(table,column,row,cell,value,record);
					
				});
				if(typeof(column._onRefresh.length)=="object"){
					column._onRefresh=column._onRefresh.reverse();
					
				}
			}
		};
		this._$initTree();
		this.establishBinding();
		this._topNode.setExpanded(true);
		this._active=true;
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$TreeGrid_destroy(){
	this._$destroy();
	this._currentNode=null;
	this._topNode.destroy();
	
};
function _$TreeGrid_setExpandLevel(expandLevel){	
	this._expandLevel=expandLevel;
	
};
function _$TreeGrid_getTreeColumn(){
	return this._treeColumn;
	
};
function _$TreeGrid_setTreeColumn(treeColumn){
	this._treeColumn=treeColumn;
	
};
function _$TreeGrid_getHasChildField(){
	return this._hasChildField;
	
};
function _$TreeGrid_setHasChildField(hasChildField){
	this._hasChildField=hasChildField;
	
};
function _$TreeGrid_getRecursiveKeyFields(){
	return this._recursiveKeyFields;
	
};
function _$TreeGrid_setRecursiveKeyFields(recursiveKeyFields){
	this._recursiveKeyFields=recursiveKeyFields;
	this._recursiveKeyFieldArray=recursiveKeyFields.split(",");
	
};
function _$TreeGrid_getRecursiveKeyParameters(){
	return this._recursiveKeyParameters;
	
};
function _$TreeGrid_setRecursiveKeyParameters(recursiveKeyParameters){
	
	this._recursiveKeyParameters=recursiveKeyParameters;
	this._recursiveKeyParameterArray=recursiveKeyParameters.split(",");
	
};
function _$TreeGrid_getRecursiveKeyFieldArray(){
	return this._recursiveKeyFieldArray;
	
};
function _$TreeGrid_getRecursiveKeyParameterArray(){
	return this._recursiveKeyParameterArray;
	
};
function _$TreeGrid_initTree(){
	if(this._isParsed)return ;
	this._isParsed=true;
	var xmlDoc=$("__"+this.id);
	if(xmlDoc!=null){
		var xmlRoot;
		if(browserType==__Browser_IE && browserVersion < 9){
			xmlRoot=xmlDoc.documentElement;
			
		}else {
			xmlRoot=xmlDoc.getElementsByTagName("nodes")[0];
			
		};
		if(xmlRoot!=null){
			this._$initTreeNodes(this._topNode,xmlRoot);
			
		}
	}
};
function _$TreeGrid_initTreeNodes(superiorNode,xmlNode){
	var viewModel=this._viewModel;
	var recordMapping=viewModel._recordMapping;
	if(recordMapping==null)return ;
	var childXmlNodes=xmlNode.childNodes;
	if(browserType==__Browser_IE){
		superiorNode.setExpanded(childXmlNodes.length>0);
		
	}else {
		var hasChild=false;
		for(var i=0;i<childXmlNodes.length;i++){
			if(childXmlNodes[i].nodeName.charAt(0)!='#'){
				hasChild=true;
				break;
				
			}
		};
		superiorNode.setExpanded(hasChild);
		
	};
	for(var i=0;i<childXmlNodes.length;i++){
		var childXmlNode=childXmlNodes[i];
		if(browserType==__Browser_IE||childXmlNode.nodeName.charAt(0)!='#'){
			var newTreeNode=null;
			var idValue=childXmlNode.getAttribute("record");			
			if(idValue!=null){
				var record=recordMapping[idValue];
				if(record!=null){
					record._$loadDataFromXMLNode();
					newTreeNode=new TreeGridNode(record);
					if(this._hasChildField!=null)
						newTreeNode._hasChild=(record.getValue(this._hasChildField)>0);
					this._$initTreeNodes(newTreeNode,childXmlNode);
					superiorNode.addNode(newTreeNode);
					
				}
			}
		}
	};
	if(superiorNode==this._topNode){
		var recordMapRef=viewModel._properties.getValue("__recordMapRef");
		if(recordMapRef>1){
			viewModel._properties.setValue("__recordMapRef",--recordMapRef);
			
		}else {
			viewModel._properties.removeParameter("__recordMapRef");
			viewModel._recordMapping=null;
			
		}
	}
};
function _$TreeGrid_getNextNode(node){
	
};
function _$TreeGrid_initNode(node){
	this._$$initNode(node);
	if(node._record!=null){
		this._recordMapping.put(node._record._publicid,node);
		
	}
};
function _$TreeGrid_disableBindingTree(node){
	this._$$disableBindingTree(node);
	if(node._record!=null){
		this._recordMapping.remove(node._record._publicid);
		
	}
};
function _$TreeGrid_paintNodeRow(node){
	var _parent=node._parent;
	if(_parent._visible==true&&_parent._expanded){
		this._visibleCount++;
		node._visible=true;
		if(node._expanded){
			if(node._nodes!=null){
				var element=node._nodes._first;
				while(element!=null){
					
					this._$paintNodeRow(element._data);
					element=element._next;
					
				}
			}
		}
	}
};
function _$TreeGrid_removeNodeCell(node){
	if(node._expanded){
		if(node._nodes!=null){
			var element=node._nodes._first;
			while(element!=null){
				this._$removeNodeCell(element._data);
				element=element._next;
				
			}
		}
	};
	node._visible=false;
	this._visibleCount--;
	
};
function _$TreeGrid_expandNode(node){
	if(node._expanded||(!node._hasChild&&(node._nodes==null||node._nodes.size()==0))){
		return ;
		
	};
	try{
		var result=_$fireKingfisherEvent(this,"beforeExpandNode",[this,node]);
		if(result!=null){
			throw result;
			
		};
		this._$showNextLevelRecordNode(node);
		var nextTreeGridRecord=this._$getDatasetNextRecord(node._record);
		var nodes=node._nodes;
		if(nodes!=null){
			var downRecordCount=0;		//��ǰ�ڵ�������ʾ���ļ�¼���������㣩
			var record=nextTreeGridRecord;
			var lastTreeGridRecord=this.getLastRecord();
			while(record!=null&&record!=lastTreeGridRecord){
				record=this._$getDatasetNextRecord(record);
				downRecordCount++;
				
			}
		};
		var oldVisibleCount=this._visibleCount;
		node._$$setExpanded(true);
		var hasChild=false;
		if(nodes!=null){
			var element=nodes._first;			
			while(element!=null){
				hasChild=true;
				var childNode=element._data;
				this._$paintNodeRow(childNode);
				element=element._next;
				
			}
		};
		node._hasChild=hasChild;
		var dataset=this._dataset;
		var expandNodeCount=this._visibleCount-oldVisibleCount;
		if(expandNodeCount>0){
			if(downRecordCount-expandNodeCount>0){
				for(i=0;i<expandNodeCount;i++){
					//����ǰչ���Ľ����һ����¼����Ų
					if(this._fixedDataGrid!=null){
						this._fixedDataGrid.processDatasetMessage(__Dataset_MSG_RECORD_INSERTED,dataset,[null,"before",nextTreeGridRecord]);
						
					};
					this._dataGrid.processDatasetMessage(__Dataset_MSG_RECORD_INSERTED,dataset,[null,"before",nextTreeGridRecord]);
					
				}
			}
		};
		this.refresh();
		_$fireKingfisherEvent(this,"afterExpandNode",[this,node]);
		
	}catch(e){
		_$processException(e);
		
	}
};
function _$TreeGrid_refreshNode(node){
	
};
function _$TreeGrid_collapseNode(node){
	if(!node._expanded){
		return ;
		
	};
	try{
		var result=_$fireKingfisherEvent(this,"beforeCollapseNode",[this,node]);
		if(result!=null){
			throw result;
			
		};
		var currentNode=this._currentNode;
		if(currentNode!=null){
			do{
				currentNode=currentNode._parent;
				if(currentNode==node){
					this.setCurrentNode(node);
					break;
					
				}
			}while(currentNode!=null&&currentNode!=this._topNode);
			
		}
		var nextTreeGridRecord=this._$getDatasetNextRecord(node._record);
		var nodes=node._nodes;
		if(nodes!=null){
			var downRecordCount=0;
			var record=nextTreeGridRecord;
			var lastTreeGridRecord=this.getLastRecord();
			while(record!=null&&record!=lastTreeGridRecord){
				record=this._$getDatasetNextRecord(record);
				downRecordCount++;
				
			}
		};
		var oldVisibleCount=this._visibleCount;
		node._$$setExpanded(false);
		if(nodes!=null){
			var element=nodes._first;
			while(element!=null){
				var childNode=element._data;
				this._$removeNodeCell(childNode);
				element=element._next;
				
			};
			
		};
		var dataset=this._dataset;
		var collapseNodeCount=oldVisibleCount-this._visibleCount;
		if(false&&collapseNodeCount>0){
			if(downRecordCount-collapseNodeCount>3){
				var record=nextTreeGridRecord;
				for(i=0;i<collapseNodeCount;i++){
					if(this._fixedDataGrid!=null){
						this._fixedDataGrid.processDatasetMessage(__Dataset_MSG_RECORD_DELETED,dataset,[record]);
						
					};
					this._dataGrid.processDatasetMessage(__Dataset_MSG_RECORD_DELETED,dataset,[record]);
					record=this._$getDatasetNextRecord(record);
					
				}
			}
		};
		this.refresh();
		_$fireKingfisherEvent(this,"afterCollapseNode",[this,node]);
		
	}catch(e){
		_$processException(e);
		
	}
};
function _$TreeGrid_getCurrentNode(node){
	return this._currentNode;
	
};
function _$TreeGrid_setCurrentNode(node){
	try{
		this._currentNode=node;		
		if(node!=null&&node._record!=null){
			var result=_$fireKingfisherEvent(this,"beforeCurrentChange",[this,node]);
			if(result!=null){
				throw result;
				
			};
			var dataset=this._dataset;
			dataset.setCurrent(node._record);
			_$fireKingfisherEvent(this,"afterCurrentChange",[this,node]);
			
		}
	}catch(e){
		_$processException(e);
		
	}
};
function _$TreeGrid_getDatasetFirstRecord(){
	var node=this._topNode.getNextNode();
	if(node!=null){
		return node._record;
		
	}else {
		return null;
		
	}
};
function _$TreeGrid_getDatasetLastRecord(){
	var node=this._topNode._$getPrevNodeNextLevelLastNode();
	if(node!=null){
		return node._record;
		
	}else {
		return null;
		
	}
};
function _$TreeGrid_getDatasetPrevRecord(record){
	var node=this._recordMapping.get(record._publicid);
	if(node!=null){
		node=node.getPrevNode();
		if(node!=null){
			return node._record;
			
		}
	};
	return null;
	
};
function _$TreeGrid_getDatasetNextRecord(record){
	var node=this._recordMapping.get(record._publicid);
	if(node!=null){
		node=node.getNextNode();
		if(node!=null){
			return node._record;
			
		}
		
	};
	return null;
	
};
function _$refreshTreeColumn(table,column,row,cell,value,record){
	cell.parentNode.vAlign="middle";
	cell.style.height="";
	cell.innerText="";
	var node=table._recordMapping.get(record._publicid);
	if(node==null)return true;
	cell.style.paddingLeft=(node.getLevel()-1)*16;
	var button=$$("IMG");
	if(node._hasChild||(node._nodes!=null&&node._nodes.size()>0)){
		if(node._expanded){
			button.src=__SKIN_PATH+"/tree/collapse.gif";
			
		}else {
			button.src=__SKIN_PATH+"/tree/expand.gif";
			
		}
	}else {
		button.src=__SKIN_PATH+"/tree/nochild.gif";
		
	};
	button._kingfisherClass="TreeNodeButton";
	button.className="TreeNodeButton";
	button.style.marginLeft=4;
	button.style.marginRight=4;
	button.align="middle";
	if(browserType==__Browser_IE){
		button.unselectable=true;
		
	}else {
		button.style.MozUserSelect="none";
		
	};
	button._node=node;
	cell.appendChild(button);
	var label=$$("LABEL");
	label._kingfisherClass="TreeNodeLabel";
	label.style.width="100%";
	cell.appendChild(label);
	if(typeof(column._onRefresh)=="object"){
		var eventInfo=column._onRefresh;
		if(eventInfo.length>1){
			column._onRefresh=eventInfo.slice(1);
			try{
				if(!_$fireKingfisherEvent(column,"onRefresh",[column,row,label,value,record],false)){
					return false;
					
				}
			}finally{
				column._onRefresh=eventInfo;				
				
			}
		}
	};
	label.innerText=value;
	return false;
	
};
function _$TreeGrid_addColumn(name){
	var column=this._$addColumn(name);
	return column;
	
};
function _$TreeGrid_getVisibleCount(){
	return this._visibleCount;
	
};
function _$TreeGrid_onMouseDown(dataGrid){
	var table=dataGrid._outlineTable;
	if(_$getEventTarget()._kingfisherClass=="TreeNodeButton"){
		_$Element_onFocus(table);
		return ;
		
	}else {
		table._$$onMouseDown(dataGrid);
		
	}
};
function _$TreeGrid_onRecordClick(dataGrid){
	var targ=_$getEventTarget();
	var table=dataGrid._outlineTable;
	if(targ._kingfisherClass=="TreeNodeButton"){
		var table=dataGrid._outlineTable;
		var node=targ._node;
		if(node!=null){
			node.setExpanded(!node._expanded);
			
		}
	}else {
		table._$$onRecordClick(dataGrid);
		
	}
};
function _$TreeGrid_processDatasetMessage(message,dataset,args){
	function _$expandNextLevelNode(tree,parentNode){
		var nodes=parentNode.getNodes();
		var itr=nodes.iterator();
		while(itr.hasNext()){
			var node=itr.next();
			if(node.getLevel()<=tree._expandLevel){
				tree.expandNode(node);
				_$expandNextLevelNode(tree,node);
			}
		};
	};
	
	if(!this._active)return ;	
	switch(message){
		case __Dataset_MSG_REFRESH:{
			var current=dataset._current;
			if(current==null){
				this._currentNode=null;
				
			}else {
				this._currentNode=this._recordMapping.get(current._publicid);
				
			};

			//����û�е�ǰ�ڵ㣬ͨ��dataset����
			if(!this._currentNode){
				var topNode=this._topNode;
				var nodes=topNode.getNodes();
				var itr=nodes.iterator();
				while(itr.hasNext()){
					var node=itr.next();
					node.remove();			
				};
				var record=dataset.getFirstRecord();
				while(record){
					var childNode=new TreeGridNode(record);
					if(this._hasChildField!=null)
						childNode._hasChild=(record.getValue(this._hasChildField)>0);
					topNode.addNode(childNode);
					record=record.getNextRecord();
				}
				_$expandNextLevelNode(this,topNode);
				
			}

			this._$processDatasetMessage(message,dataset,args);
			break;
			
		};
		case __Dataset_MSG_CURRENT_CHANGED:{
			var current=dataset._current;
			if(current==null){
				this._currentNode=null;
				
			}else {
				var node=this._recordMapping.get(current._publicid);
				this.setCurrentNode(node);
				
			};
			this._$processDatasetMessage(message,dataset,args);
			break;
			
		};
		case __Dataset_MSG_REFRESH_RECORD:;
		case __Dataset_MSG_DATA_CHANGED:;
		case __Dataset_MSG_RECORD_STATE_CHANGED:{
			this._$processDatasetMessage(message,dataset,args);
			break;
			
		};
		case __Dataset_MSG_GAINING_CHANGE:{
			this._$processDatasetMessage(message,dataset,args);
			break;
			
		};
		case __Dataset_MSG_RECORD_INSERTED:{
			break;
			
		};
		case __Dataset_MSG_RECORD_DELETED:{
			this._$processDatasetMessage(message,dataset,args);
			break;
			
		};
		default:{
			this._$processDatasetMessage(message,dataset,args);
			break;
			
		}
	}
};
function _$TreeGrid_moveFirst(){
	this._dataset.setCurrent(this._$getDatasetFirstRecord());	
	
};
function _$TreeGrid_movePrev(){
	var dataset=this._dataset;
	var record=null;
	if(this._currentNode!=null){
		var node=this._currentNode.getPrevNode();
		if(node!=null){
			record=node._record;
			
		}
	};
	if(record!=null){
		dataset.setCurrent(record);
		
	}else {
		this._$moveFirst();
		
	}
};
function _$TreeGrid_moveNext(){
	var dataset=this._dataset;
	var record=null;
	if(this._currentNode!=null){
		var node=this._currentNode.getNextNode();
		if(node!=null){
			record=node._record;
			
		}
	};
	if(record!=null){
		dataset.setCurrent(record);
		
	}else {
		this._$moveLast();
		
	}
};
function _$TreeGrid_moveLast(){
	this._dataset.setCurrent(this._$getDatasetLastRecord());
	
};
function _$TreeGrid_move(count){
	if(count==0)return ;
	var dataset=this._dataset;
	var record=null;
	if(this._currentNode!=null){
		var node=this._currentNode;
		if(count>0){
			for(var i=0;node!=null&&i<count;i++){
				node=node.getNextNode();
				
			}
		}else {
			
			for(var i=0;node!=null&&i>count;i--){
				node=node.getPrevNode();
				
			}
		};
		if(node!=null){
			record=node._record;
			if(record!=null)dataset.setCurrent(record);
			
		}
	}else {
		if(count>0){
			this._$moveLast();
			
		}else {
			this._$moveFirst();
			
		}
	}
};
function _$TreeGrid_insertRecord(mode){
	
};
function _$TreeGrid_showNextLevelRecordNode(node){
	if(node._hasExpanded||node._record==null)return ;
	
	var dataset=this._dataset;
	var current=dataset._current;
	dataset.disableControls();
	
	var current=dataset._current;
	dataset.setCurrent(node._record);
	
	var parameters=dataset.parameters();
	var keyFields=this._recursiveKeyFieldArray;
	var keyParameters=this._recursiveKeyParameterArray;
	if(keyFields!=null&&keyParameters!=null){
		for(var i=0;i<keyFields.length;i++){
			parameters.setValue(keyParameters[i],dataset.getValue(keyFields[i]));
			
		}
	};
	var async=dataset._async;
	dataset._async=false;
	
	var count=dataset.loadData("after");
	dataset._async=async;
	
	var i=0;
	var record=dataset._current;
	if(record!=null){
		record=record.getNextRecord();
		while(record!=null&&i<count){
			var childNode=new TreeGridNode(record);
			if(this._hasChildField!=null)
				childNode._hasChild=(record.getValue(this._hasChildField)>0);
			node.addNode(childNode);
			record=record.getNextRecord();		
			i++;
			
		};
	}
	node._hasChild=(i>0);
	if(current!=null){
		dataset.setCurrent(current);
		
	}else {
		dataset.setCurrent(node._record);
		
	};
	dataset.enableControls();
	dataset.refreshControls();
	
};
function _$TreeGrid_sizeCellEditor(editor){
	var cell=null;
	if(editor!=null)cell=editor._activeCell;
	if(cell!=null){
		var column=cell._column;
		if(column._name==this._treeColumn){
			var label=null;
			var ele=cell.firstChild;
			for(var i=0;i<ele.childNodes.length;i++){
				var childNode=ele.childNodes[i];
				if(childNode._kingfisherClass=="TreeNodeLabel"){
					label=childNode;
					break;
					
				}
			};
			if(label!=null){
				var labelPos=_$getAbsolutePosition(label);
				var cellPos=_$getAbsolutePosition(cell);
				if(browserType==__Browser_IE){
					editor.style.left=labelPos[0];
					editor.style.top=cellPos[1];
					
				}else {
					editor.style.left=labelPos[0]-1;
					editor.style.top=cellPos[1]-1;
					
				};
				var width=cell.offsetWidth+1-(labelPos[0]-cellPos[0]);
				var height=cell.offsetHeight+1;
				if(editor._defaultWidth>0&&width<editor._defaultWidth)width=editor._defaultWidth;
				if(editor._defaultHeight>0&&height<editor._defaultHeight)height=editor._defaultHeight;
				editor.style.width=width;
				editor.style.height=height;
				editor._$sizeDropDownBtn();
				return ;
				
			}
			
		};
		this._$$sizeCellEditor(editor);
		
	}
};


function AbstractTab(){
	this._tabSet=null;
	this._div=null;
	this._visible=true;
	this._disabled=false;
	this._padding=2;
	this._tag=null;
	this._hasExpanded=false;
	this._added=false;
	this._closable=null;
	this.id=_$getPublicId();
	
};
AbstractTab.prototype.destroy=function (){
	if(this._autoCreateDiv&&this._div!=null){
		this._div.parentNode.removeChild(this._div);
		
	};
	this._tabSet=null;
	this._div=null;
	
};
AbstractTab.prototype.getName=function (){
	return this._name;
	
};
AbstractTab.prototype.getLabel=function (){
	return this._label;
	
};
AbstractTab.prototype.setLabel=function (label){
	this._label=label;
	if(this._tabSet!=null&&this._tabSet._active){
		
		this._tabSet._$rebuild();
		this._tabSet._$switch();
		
	}
};
AbstractTab.prototype.isVisible=function (){
	return this._visible;
	
};
AbstractTab.prototype.setVisible=function (visible){
	this._visible=visible;
	if(this._tabSet!=null&&this._tabSet._active){
		this._tabSet.refresh();
		
	}
};
AbstractTab.prototype.isDisabled=function (){
	return this._visible;
	
};
AbstractTab.prototype.setDisabled=function (disabled){
	this._disabled=disabled;
	if(this._tabSet!=null&&this._tabSet._active){
		this._tabSet.refresh();
		
	}
};
AbstractTab.prototype.getPadding=function (){
	return this._padding;
	
};
AbstractTab.prototype.setPadding=function (padding){
	this._padding=padding;
	if(this._tabSet!=null&&this._tabSet._active){
		this._div.style.padding=padding;
		
	}
};
AbstractTab.prototype.getDiv=function (){
	return this._div;
	
};
AbstractTab.prototype.getHtmlCont=function (){
	return this._div;

};
AbstractTab.prototype.isAutoScroll=function (){
	return this._autoScroll;	
	
};
AbstractTab.prototype.setAutoScroll=function (autoScroll){
	this._autoScroll=autoScroll;
	
};
AbstractTab.prototype.getPreviousVisibleTab=function (){
	var tabset=this._tabSet;
	if(tabset!=null&&tabset._active){
		var i=tabset._visibleTabs.indexOf(this);
		if(i>0)
			return tabset._visibleTabs[i-1];
	}
	return null;
};
AbstractTab.prototype.getNextVisibleTab=function (){
	var tabset=this._tabSet;
	if(tabset!=null&&tabset._active){
		var i=tabset._visibleTabs.indexOf(this);
		if(i!=-1&&i<tabset._visibleTabs.length-1)
			return tabset._visibleTabs[i+1];
	}
	return null;
};
AbstractTab.prototype.getClosable=function (){
	return this._closable;
	
};
AbstractTab.prototype.setClosable=function (closable){
	this._closable=closable;
	
};
AbstractTab.prototype.getTag=_$Element_getTag;
AbstractTab.prototype.setTag=_$Element_setTag;

function Tab(name,label){
	this._name=name;
	if(label){
		this._label=label;
		
	}else {
		this._label=name;
		
	};
	this._autoCreateDiv=false;
	this._autoScroll=true;
	
};
Tab.prototype=new AbstractTab();
Tab.prototype._$createDiv=function (){
	if(this._hasDiv)return ;
	var tabSet=this._tabSet;
	if(this._autoCreateDiv){
		div=$$("DIV");
		var tabContainer=$$("DIV");
		if(this._padding)tabContainer.style.padding=this._padding;
		tabContainer.style.width="100%";
		tabContainer.style.height="100%";
		div.appendChild(tabContainer);
		tabSet._contentContainer.appendChild(div);
		
	}else {
		div=$(tabSet.id+"_"+this._name);
		div.style.padding=this._padding;
		
	};
	if(div!=null){
		if(!div.id){
			div.id="tab"+this.id;
			
		};
		_$setDisplay(div,false);
		_$setElementStyle(div,tabSet._class+"ContentContainer");
		if(document.body.bgColor!="")	div.style.backgroundColor=document.body.bgColor;
		if(document.body.style.backgroundColor!="")	div.style.backgroundColor=document.body.style.backgroundColor;
		if(this._autoScroll){
			div.style.overflow="auto";
			if(tabSet._oldHeight)
				div.style.height=tabSet._oldHeight;
			
		}else {
			div.style.overflow="hidden";
			
		};
	};
	this._div=div;	
	this._hasDiv=true;
	
};
Tab.prototype.activate=function (){
	if(this._div!=null){
		_$setDisplay(this._div,true);
		_$Window_onResize();
		
	}
};
Tab.prototype.deactivate=function (){
	if(this._div!=null){
		for(var i=0;i<__Menu_List.length;i++){
			var menu=__Menu_List[i];
			menu._$hiden();
		}
		QuickHelp._$closeHelp();
	
		_$setDisplay(this._div,false);
		
	}
};
Tab.prototype.getDiv=function (){
	if(this._div!=null){
		return this._div.firstChild;
		
	}else {
		return null;
		
	}
};

/* �����2013.07.10ע��
function FrameTab(name,label){
	this._name=name;
	if(label){
		this._label=label;
		
	}else {
		this._label=name;
		
	};
	this._path=null;
	this._cachable=true;
	this._activate=false;
	
};*/

function FrameTab(name,label){
	this._tabType = "FrameTab";
	this._name=name;
	this._title = label;		
	if(label){
		//�������޸� start
		//this._label=label;		
		if (label.length > 6)
			this._label = label.substr(0,5)+'...';
		else
			this._label = label;
		//�������޸� end
	}else {
		
		this._label=name;
		
	};
	this._path=null;
	this._cachable=true;
	this._activate=false;
	
};

FrameTab.prototype=new AbstractTab();
FrameTab.prototype._$destroy=AbstractTab.prototype.destroy;
FrameTab.prototype.destroy=function (){

	if(this._div!=null){
		var subpages=this._div.firstChild.getElementsByTagName("IFRAME");
		for(var i=0;i<subpages.length;i++){
			if(subpages[i].contentWindow)
				subpages[i].src="about:blank";
		}
	}
	this._$destroy();
	
};
FrameTab.prototype.getTabType=function (){
	return this._tabType;
	
};
FrameTab.prototype.setTabType=function (tabType){
	this._tabType = tabType;
	
};
FrameTab.prototype.getPath=function (){
	return this._path;
	
};
FrameTab.prototype.setPath=function (path){
	if ((path.length>0) && (path.substr(0,4)=='http'))
	{

	}
	else if(path.length>0&&path.charAt(0)=='/'){
		path=__CONTEXT_PATH+path;
		
	};
	this._path=path;	
	
	if(this._tabSet&&this._tabSet._active&&
			this._tabSet._tablist.get(this._name)!=null&&!this._activate)
		this.activate();
};
FrameTab.prototype.isCachable=function (){
	return this._cachable;
	
};
FrameTab.prototype.setCachable=function (cachable){
	this._cachable=cachable;
	
};
FrameTab.prototype._$createDiv=function (){
	if(this._hasDiv)return ;
	var tabSet=this._tabSet;
	var frameName=tabSet.id+"_"+this._name;
	var div=$(frameName);
	if(div==null){
		div=$$("DIV");
		var isScroll=(!this._autoScroll)?" scrolling=\"no\" " : "";
		div.innerHTML="<IFRAME name=\""+frameName+"\" "+" frameborder=\"0\" border=\"0\" " + isScroll + " style=\"width: 100%; height: 100%;padding : "+this._padding+"\"></IFRAME>";
		tabSet._contentContainer.appendChild(div);
		
	};
	if(!div.id){
		div.id="tab"+_$getPublicId();
		
	};
	_$setElementStyle(div,tabSet._class+"ContentContainer");
	if(document.body.bgColor!="")	div.style.backgroundColor=document.body.bgColor;
	if(document.body.style.backgroundColor!="")	div.style.backgroundColor=document.body.style.backgroundColor;
	div.style.padding=0;
	div.style.width="100%";
	div.style.height="100%";
	_$setDisplay(div,false);
	this._div=div;
	this._hasDiv=true;
	
};
FrameTab.prototype.activate=function (){
	if(this._path!=null){
		if(!this._cachable||!this._activate){

			var path=this._path;
			var frame=this.getFrame();
			frame.contentWindow.location.href=path;
			this._activate=true;
			
		}
	};
	if(this._div!=null){
		
		if(browserType==__Browser_IE){
			_$setDisplay(this._div,true);
			_$Window_onResize();
			
		}else if(browserType==__Browser_OPERA){
			_$setDisplay(this._div,true);
			setTimeout("var div = $(\""+this._div.id+"\");"+"_$setDisplay(div, false);",0);
			setTimeout("var div = $(\""+this._div.id+"\");"+"_$setDisplay(div, true);_$Window_onResize();",100);
			
		}else {
			_$setDisplay(this._div,true);
			_$setDisplay(this._div,false);
			_$setDisplay(this._div,true);
			_$Window_onResize();
			
		}
	}
};
FrameTab.prototype.deactivate=function (){
	if(!this._cachable&&this._activate){
		var dropdownContent=this.getFrame().contentWindow;
		dropdownContent.location.href="about:blank";
		
	};
	if(this._div!=null){
		_$setDisplay(this._div,false);
		
	}
};
FrameTab.prototype.getFrame=function (){
	return this._div.firstChild;
	
};


//2��ҳ���FrameTab
function Frame2Tab(name,label){
	this._tabType = "Frame2Tab";
	this._name=name;
	this._title = label;		
	if(label){
		//�������޸� start
		//this._label=label;		
		if (label.length > 6)
			this._label = label.substr(0,5)+'...';
		else
			this._label = label;
		//�������޸� end
	}else {
		
		this._label=name;
		
	};
	this._path1=null;
	this._path2=null;
	this._cachable=true;
	this._activate=false;
	
};

Frame2Tab.prototype=new AbstractTab();
//Frame2Tab.prototype._$destroy=AbstractTab.prototype.destroy;
Frame2Tab.prototype.destroy=function (){

	if(this._div1!=null){
		var subpages=this._div1.firstChild.getElementsByTagName("IFRAME");
		for(var i=0;i<subpages.length;i++){
			if(subpages[i].contentWindow)
				subpages[i].src="about:blank";
		}
	}
	if(this._div2!=null){
		var subpages=this._div2.firstChild.getElementsByTagName("IFRAME");
		for(var i=0;i<subpages.length;i++){
			if(subpages[i].contentWindow)
				subpages[i].src="about:blank";
		}
	}
	if(this._autoCreateDiv&&this._div1!=null){
		this._div1.parentNode.removeChild(this._div1);
		
	};
	this._div1=null;
	if(this._autoCreateDiv&&this._div2!=null){
		this._div2.parentNode.removeChild(this._div2);
		
	};
	this._div2=null;
	this._tabSet=null;
	
};
Frame2Tab.prototype.getTabType=function (){
	return this._tabType;
	
};
Frame2Tab.prototype.setTabType=function (tabType){
	this._tabType = tabType;
	
};
Frame2Tab.prototype.getPath1=function (){
	return this._path1;
	
};
Frame2Tab.prototype.getPath2=function (){
	return this._path2;
	
};
Frame2Tab.prototype.setPath=function (path1,path2){
	if ((path1.length>0) && (path1.substr(0,4)=='http'))
	{

	}
	else if(path1.length>0&&path1.charAt(0)=='/'){
		path1=__CONTEXT_PATH+path1;
		
	};
	this._path1=path1;	
	if ((path2.length>0) && (path2.substr(0,4)=='http'))
	{
		
	}
	else if(path2.length>0&&path2.charAt(0)=='/'){
		path2=__CONTEXT_PATH+path2;
		
	};
	this._path2=path2;	
	
	if(this._tabSet&&this._tabSet._active&&
			this._tabSet._tablist.get(this._name)!=null&&!this._activate)
		this.activate();
};
Frame2Tab.prototype.isCachable=function (){
	return this._cachable;
	
};
Frame2Tab.prototype.setCachable=function (cachable){
	this._cachable=cachable;
	
};
Frame2Tab.prototype._$createDiv=function (){
	if(this._hasDiv)return ;
	var tabSet=this._tabSet;
	var frameName1=tabSet.id+"_"+this._name+'_param';
	var frameName2=tabSet.id+"_"+this._name+'_module';
	var div1=$(frameName1);
	var div2=$(frameName2);
	if(div1==null){
		div1=$$("DIV");
		var isScroll=(!this._autoScroll)?" scrolling=\"no\" " : "";
		div1.innerHTML="<IFRAME width=\"17%\" type=\"searchFrame\" name=\""+frameName1+"\" "+" frameborder=\"0\" border=\"0\" " + isScroll + " style=\"width: 100%; height: 100%;padding : "+this._padding+"\"></IFRAME>";
		tabSet._contentContainer.appendChild(div1);
		
	};
	if(div2==null){
		div2=$$("DIV");
		var isScroll=(!this._autoScroll)?" scrolling=\"no\" " : "";
		div2.innerHTML="<IFRAME width=\"83%\" name=\""+frameName2+"\" "+" frameborder=\"0\" border=\"0\" " + isScroll + " style=\"width: 100%; height: 100%;padding : "+this._padding+"\"></IFRAME>";
		tabSet._contentContainer.appendChild(div2);
		
	};
	if(!div1.id){
		div1.id="tab"+_$getPublicId()+"_param";
		
	};
	if(!div2.id){
		div2.id="tab"+_$getPublicId()+"_param";
		
	};
	_$setElementStyle(div1,tabSet._class+"ContentContainer1");
	_$setElementStyle(div2,tabSet._class+"ContentContainer2");
	if(document.body.bgColor!="")	div1.style.backgroundColor=document.body.bgColor;
	if(document.body.bgColor!="")	div2.style.backgroundColor=document.body.bgColor;
	if(document.body.style.backgroundColor!="")	div1.style.backgroundColor=document.body.style.backgroundColor;
	if(document.body.style.backgroundColor!="")	div2.style.backgroundColor=document.body.style.backgroundColor;
	div1.style.padding=0;
	div1.style.width="17%";
	div1.style.height="100%";
	_$setDisplay(div1,false);
	this._div1=div1;
	div2.style.padding=0;
	div2.style.width="83%";
	div2.style.height="100%";
	_$setDisplay(div2,false);
	this._div2=div2;
	this._hasDiv=true;
	
};
Frame2Tab.prototype.activate=function (){
	if(this._path1!=null && this._path2!=null){
		if(!this._cachable||!this._activate){

			var path1=this._path1;
			var frame1=this.getFrame1();
			frame1.contentWindow.location.href=path1;
			var path2=this._path2;
			var frame2=this.getFrame2();
			frame2.contentWindow.location.href=path2;
			this._activate=true;
			
		}
	};
	if(this._div1!=null){
		
		if(browserType==__Browser_IE){
			_$setDisplay(this._div1,true);
			_$Window_onResize();
			
		}else if(browserType==__Browser_OPERA){
			_$setDisplay(this._div1,true);
			setTimeout("var div1 = $(\""+this._div1.id+"\");"+"_$setDisplay(div1, false);",0);
			setTimeout("var div1 = $(\""+this._div1.id+"\");"+"_$setDisplay(div1, true);_$Window_onResize();",100);
			
		}else {
			_$setDisplay(this._div1,true);
			_$setDisplay(this._div1,false);
			_$setDisplay(this._div1,true);
			_$Window_onResize();
			
		}
	}
	if(this._div2!=null){
		
		if(browserType==__Browser_IE){
			_$setDisplay(this._div2,true);
			_$Window_onResize();
			
		}else if(browserType==__Browser_OPERA){
			_$setDisplay(this._div2,true);
			setTimeout("var div2 = $(\""+this._div2.id+"\");"+"_$setDisplay(div2, false);",0);
			setTimeout("var div2 = $(\""+this._div2.id+"\");"+"_$setDisplay(div2, true);_$Window_onResize();",100);
			
		}else {
			_$setDisplay(this._div2,true);
			_$setDisplay(this._div2,false);
			_$setDisplay(this._div2,true);
			_$Window_onResize();
			
		}
	}
};
Frame2Tab.prototype.deactivate=function (){
	if(!this._cachable&&this._activate){
		var dropdownContent1=this.getFrame1().contentWindow;
		dropdownContent1.location.href="about:blank";
		var dropdownContent2=this.getFrame2().contentWindow;
		dropdownContent2.location.href="about:blank";
		
	};
	if(this._div1!=null){
		_$setDisplay(this._div1,false);
		
	}
	if(this._div2!=null){
		_$setDisplay(this._div2,false);
		
	}
};
Frame2Tab.prototype.getFrame1=function (){
	return this._div1.firstChild;
	
};
Frame2Tab.prototype.getFrame2=function (){
	return this._div2.firstChild;
	
};


function _$buildTabSet(id,viewModel){
	var tabSet=null;
	if(id){
		tabSet=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(tabSet==null){
		tabSet=$$("DIV");
		tabSet.style.width="100%";
		tabSet.style.height="100%";
		tabSet.id=id;
		
	};
	if(!tabSet.className)tabSet.className="TabSet";
	tabSet._class=tabSet.className;
	tabSet.getId=_$Component_getId;
	tabSet.getViewModel=_$Component_getViewModel;
	tabSet.isActive=_$Component_isActive;
	tabSet.activate=_$TabSet_activate;
	tabSet.destroy=_$TabSet_destroy;
	tabSet.getTag=_$Element_getTag;
	tabSet.setTag=_$Element_setTag;
	tabSet.addTab=_$TabSet_addTab;
	tabSet.addTabItem=_$TabSet_addTabItem;
	tabSet.getTab=_$TabSet_getTab;
	tabSet.removeTab=_$TabSet_removeTab;
	tabSet.removeTabByName=_$TabSet_removeTabByName;
	tabSet.removeAllTabs=_$TabSet_removeAllTabs;
	tabSet.getTabCount=_$TabSet_getTabCount;
	tabSet.getMaxTabQuota=_$TabSet_getMaxTabQuota;
	tabSet.setMaxTabQuota=_$TabSet_setMaxTabQuota;
	tabSet.getWidthTabName=_$TabSet_getWidthTabName;
	tabSet.setWidthTabName=_$TabSet_setWidthTabName;
	tabSet.isClosable=_$TabSet_getClosable;
	tabSet.setClosable=_$TabSet_setClosable;
	tabSet.getContentContainer=_$TabSet_getContentContainer;
	tabSet._$paint=_$TabSet_paint;
	tabSet.refresh=_$TabSet_refresh;
	tabSet.tabExist=_$TabSet_tabExist;
	tabSet.getCurrentTab=_$TabSet_getCurrentTab;
	tabSet.setCurrentTab=_$TabSet_setCurrentTab;
	tabSet.activeTab=_$TabSet_activeTab;
	tabSet.activeTabByName=_$TabSet_activeTabByName;
	tabSet._$do_activeTab=_$TabSet_do_activeTab;
	tabSet.setTabVisible=_$TabSet_setTabVisible;
	tabSet.setTabVisibleByName=_$TabSet_setTabVisibleByName;
	tabSet.setTabEnable=_$TabSet_setTabEnable;
	tabSet._$switch=_$TabSet_switch;
	tabSet._$getPaddedTab=_$TabSet_getPaddedTab;
	tabSet._$calaVisibleIndex=_$TabSet_calaVisibleIndex;
	tabSet._$calaContainerHeight=_$TabSet_calaContainerHeight;
	tabSet._$buildScrollButton=_$TabSet_buildScrollButton;
	tabSet._$locateScrollButton=_$TabSet_locateScrollButton;
	tabSet.onResize=_$TabSet_onResize;
	tabSet._$getTabClosePict=_$TabSet_getTabClosePict;
	tabSet._$rebuild=_$TabSet_rebuild;
	tabSet.onKeyDown=_$tabSet_onKeyDown;
	tabSet._$isTabClosable=_$TabSet_getTabClosable;
	tabSet._viewModel=viewModel;
	tabSet._tablist=new HashList();
	tabSet._currentTab=null;
	tabSet._showCount=0;
	tabSet._startIndex=0;
	tabSet._showTabs=new Array();
	tabSet._maxTabQuota=10;
	tabSet._closable=false;
	tabSet._widthTabName=60;
	tabSet._selectWidthTabName=64;
	tabSet._localize=true;
	
//	if(browserType==__Browser_IE){
//		EventManager.addSystemEvent(tabSet,"onresize",function (){
//			tabSet.onResize();
				
//		});
			
//	};
	return tabSet;
	
};
KingfisherFactory._$registerComponentType("TabSet",_$buildTabSet);
function _$TabSet_destroy(){
	var tablist=this._tablist;
	var tabCount=tablist.size();
	for(var i=0;i<tabCount;i++){
		var currentTab=tablist._objectArray[i];
		currentTab.destroy();
		
	};
	this._tablist.clear();
	this._puckerDiv=null;
	this._contentContainer=null;
	this._scrollPane=null;
	this._visibleTabs=null;
	this._showTabs=null;
	
};
function _$TabSet_activate(){
	if(!this._active){
		this._$paint();
		this._active=true;
		this.refresh();
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$tabSet_onKeyDown(){
	switch(event.keyCode){
		case 37:{			//LEFT ARROW ��
			if(this._currentTab!=null){
				var currentTab=this._currentTab.getPreviousVisibleTab();
				if(currentTab!=null)	this.activeTab(currentTab);
				
			};			
			event.returnValue=false;
			break;
			
		};
		case 39:{			//RIGHT ARROW ��
			if(this._currentTab!=null){
				var currentTab=this._currentTab.getNextVisibleTab();
				if(currentTab!=null)	this.activeTab(currentTab);
				
			};
			event.returnValue=false;
			break;
			
		};
	}
};
//ȡ��һ��Tab,���ȡ��������ȡ��һ��
function _$TabSet_getPaddedTab(currentTab){
	var showTabs=this._showTabs;
	var tablist=this._tablist;
	var index=-1;
	if(currentTab!=null){
		index=tablist.indexOf(currentTab._name);
		
	};
	var size=tablist.size();
	for(var i=index+1;i<size;i++){
		var currentTab=tablist.get(i);
		if(currentTab._visible&&!currentTab._disabled&&showTabs.indexOf(currentTab)!=-1){
			return currentTab;
			
		}
	};
	for(var i=index-1;i>=0;i--){
		var currentTab=tablist.get(i);		
		if(currentTab._visible&&!currentTab._disabled&&showTabs.indexOf(currentTab)!=-1){
			return currentTab;
			
		}
	};
	return null;
	
};
//ȡ��tab�Ƿ���Թر�
function _$TabSet_getTabClosable(currentTab){
	var closable=currentTab._closable;
	if(this._closable)
	 	return closable == null || closable==true;
	else
		return closable == true;
};
function _$TabSet_tabExist(tabname){
	return this._tablist.get(tabname)!=null;
	
};
//ȡ��tab�ġ��رա�ͼƬ
function _$TabSet_getTabClosePict(card){
	var tbody=card.firstChild.tBodies[0];
	var row=tbody.rows[0];
	if(row.cells.length==3)
		return row.cells[2].firstChild;
	else
		return null;
};
function _$TabSet_calaVisibleIndex(currentTab){
	var visibles=this._showCount;
	this._visibleTabs=new Array();
	var size=this._tablist.size();
	for(var i=0;i<size;i++){
		var tabElement=this._tablist.get(i);
		if(!tabElement._hasDiv)tabElement._$createDiv();
		if(this._contentContainer&&!tabElement._added){
			tabElement._added=true;
			if(tabElement._div1){
				this._contentContainer.appendChild(tabElement._div1);
				this._contentContainer.appendChild(tabElement._div2);
			}
			else{
				this._contentContainer.appendChild(tabElement._div);
			}
		}
		if(tabElement._visible){
			this._visibleTabs.push(tabElement);
			
		}
	};
		
	var index=-1;
	if(currentTab!=null){
		index=this._visibleTabs.indexOf(currentTab);

	};

	if(index<0||index<visibles)	return 0;

	var start=this._visibleTabs.length-index;
	var surplus=visibles-start;
	var start=index-surplus;
	return start;
};
function _$TabSet_switch(){
	var paddedTab=this._currentTab;
	if(paddedTab==null||paddedTab._disabled||this._showTabs.indexOf(paddedTab)==-1){
		paddedTab=this._$getPaddedTab(paddedTab);
		
	};
	this._$do_activeTab(paddedTab);
};
function _$TabSet_refresh(){
	function _$calaVisibleTabs(tabSet){
		var puckerDiv=tabSet._puckerDiv;
		var scrollBlock=tabSet._$buildScrollButton();
		//��������ʾ����tab
		_$setDisplay(scrollBlock,true);
		var width=puckerDiv.offsetWidth-scrollBlock.offsetWidth-25;
		
		var visibles=Math.floor((width-tabSet._selectWidthTabName)/tabSet._widthTabName)+1;
		if(visibles<0)	visibles=0;
		return visibles;
	};
	
	this._showCount=_$calaVisibleTabs(this);
	this._startIndex=this._$calaVisibleIndex(this._currentTab);

	for(var i=0;i<this._visibleTabs.length;i++){
		var currentTab=this._visibleTabs[i];		
		if(!currentTab._hasExpanded){
			_$initContainerObject(currentTab._initChildren);
			currentTab._initChildren=null;
			
		};
		currentTab._hasExpanded=true;
	}

	this._$rebuild();
	this._$switch();
};
function _$TabSet_rebuild(startIndex){

	var oldHeight=this.style.height;
	if(oldHeight.indexOf("%")!=-1&&this.offsetHeight>0){
		this._$calaContainerHeight();
		this._contentContainer.style.height=this._oldHeight;
	};
	
	var visibles=this._showCount;
	var startIndex=this._startIndex;
	var puckerDiv=this._puckerDiv;
	var itemCount=puckerDiv.childNodes.length;
	while(itemCount>visibles||itemCount>this._visibleTabs.length){
		puckerDiv.removeChild(puckerDiv.childNodes[itemCount-1]);
		itemCount--;
		
	};

	var cell,label;
	var index=0;
//	alert(visibles);
	this._showTabs=new Array();
	for(var i=startIndex;i<this._visibleTabs.length;i++){
		var currentTab=this._visibleTabs[i];		

		if(index<itemCount){
			cell=puckerDiv.childNodes[index];
			
			//�������޸� start
			//���TabSet title��ʾ����
			if(typeof(currentTab._title) != 'undefined')
				cell.title = currentTab._title;
			//�������޸� end
			
			var tbody=cell.firstChild.tBodies[0];
			var row=tbody.rows[0];
			label=row.cells[0].firstChild;
			if(this._$isTabClosable(currentTab)){
				var img=this._$getTabClosePict(cell);
				if(img!=null)
					_$setVisible(img,false);
			}
			
		}else {
			cell=$$("DIV");
			
			//�������޸� start
			//���TabSet title��ʾ����
			if(typeof(currentTab._title) != 'undefined')
				cell.title = currentTab._title;
			//�������޸� end
			
			var tabSet=this;
			var table=$$("TABLE");
			table.cellPadding=0;
			table.cellSpacing=0;
			table.style.width=this._widthTabName-6;
			table.style.height="100%";
			var tbody=$$("TBODY");
			var row,td;
			td=$$("TD");	
			td.style.width="100%";
			td.align="center";
			label=$$("DIV");
			td.appendChild(label);
			row=$$("TR");
			row.appendChild(td);
			td=$$("TD");
			td.innerHTML="&nbsp;";
			td.style.width="5px";
			row.appendChild(td);
			if(this._$isTabClosable(currentTab)){
				if(currentTab.getName() != "tabWelcome"){
					td=$$("TD");
					var img=$$("IMG");
					_$setElementImage(img,__SKIN_PATH+"/tabset/close.gif");
					td.appendChild(img);
					_$setVisible(img,false);
					row.appendChild(td);
				}
			}
			tbody.appendChild(row);
			table.appendChild(tbody);
			
			cell.appendChild(table);

			puckerDiv.appendChild(cell);

			if(table.offsetWidth){
				label.style.width=table.offsetWidth-5;
				if(this._$isTabClosable(currentTab)){
					if(currentTab.getName() != "tabWelcome"){
						label.style.width=label.offsetWidth-img.offsetWidth;
					}
				}
			}
		};
		index++;

		this._showTabs.push(currentTab);
		
		cell.className="tab";
		cell.style.width=this._widthTabName;
		cell.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=\""+__SKIN_PATH+"/tabset/tab.gif\",sizingMethod=\"scale\")";
		cell._tab=currentTab;
		cell._kingfisherClass="Tab";
		label.innerText=currentTab._label;
		//�������޸� ����TabSet��title,ȥ��ԭ��title 2014-03-20
		//label.title=currentTab._label;
		
		if(index>=visibles)	break;
		
	};
	
	this._$locateScrollButton();
	
};
function _$TabSet_paint(){
	function _$buildPucker(tabSet){
		var puckerDiv=$$("DIV");
		puckerDiv.style.width="100%";
		puckerDiv.className=tabSet._class+"Pucker";
		EventManager.addSystemEvent(puckerDiv,"onclick",function (){
			_$TabSet_Pucker_onClick(tabSet);
			
		}
		);
		EventManager.addSystemEvent(puckerDiv,"onmouseover",function (){
			_$TabSet_Pucker_onMouseOver(tabSet);
			
		}
		);
		EventManager.addSystemEvent(puckerDiv,"onmouseout",function (){
			_$TabSet_Pucker_onMouseOut(tabSet);
			
		}
		);
		EventManager.addSystemEvent(puckerDiv,"onmousemove",function (){
			_$TabSet_Pucker_onMouseMove(tabSet);
			
		}
		);
		tabSet._puckerDiv=puckerDiv;
		tabSet.appendChild(puckerDiv);
		
	};
	function _$buildContentContainer(tabSet){
		var contentContainer=$$("DIV");
		contentContainer.style.width="100%";
		contentContainer.style.height=tabSet._oldHeight;
		tabSet._contentContainer=contentContainer;
		tabSet.appendChild(contentContainer);
		
	};
	
	this._oldHeight=this.style.height;
	if(this._oldHeight.indexOf("%")!=-1&&this.offsetHeight>0){
		this._$calaContainerHeight();
	};

	_$buildPucker(this);
	_$buildContentContainer(this);
};
function _$TabSet_calaContainerHeight(){
	
	var offsetElement=this.parentElement;
	var offsetObj=(offsetElement!=null)?offsetElement:document.body;
	var height=this.offsetHeight>offsetObj.offsetHeight?offsetObj.offsetHeight:this.offsetHeight;
	this._oldHeight=height*(parseInt(this.style.height.replace(/\px/g,""))/100)-21;
	
};
function _$TabSet_addTab(currentTab){
	if(this._tablist.size()>=this._maxTabQuota){
		alert(__TABSET_MAX_TAB_QUOTA);
		return ;
		
	};
	
	var name=currentTab._name;
	var tabitemcontent=$(this.id+"_"+name);
	if(!tabitemcontent)
		currentTab._autoCreateDiv=true;

	this._tablist.put(name,currentTab);
	currentTab._tabSet=this;	
	
	if(this._active){
		this.refresh();
		
	};
	return currentTab;
	
};
function _$TabSet_addTabItem(itemname,label,enable,type){
	
	var tab;
	if(type!=null&&type=="FrameTab"){
		tab=new FrameTab(itemname,label);
	}
	else if(type!=null&&type=="Frame2Tab"){
		tab=new Frame2Tab(itemname,label);
	}
	else
		tab=new Tab(itemname,label);
	tab._disabled=!enable;
	
	this.addTab(tab);

	if(tab._visible&&!tab._disabled)
		this._$do_activeTab(tab);
	
	return tab;
};
function _$TabSet_getTab(name){
	return this._tablist.get(name);
	
};
function _$TabSet_removeTabByName(name){
	this.removeTab(this.getTab(name));
	
};
function _$TabSet_removeTab(currentTab){
	//add by chw start
	var __CHANGED_DT;
	var __tabFrame;
	if(currentTab.getTabType() == 'Frame2Tab'){
		__tabFrame = currentTab.getFrame2();
	}
	else{
		__tabFrame = currentTab.getFrame();
	}
	__CHANGED_DT = __tabFrame.contentWindow.__USER_CHANGED_DT;
	var __TEMP_DT;
	var __TEMP_COLUMNS;
	var __TEMP_COLUMN;
	var __TEMP_LABEL;
	if(__CHANGED_DT && __CHANGED_DT.size() > 0){
		var __TABLES = '<tables moduleid="'+currentTab._name.split('_')[2]+'" actionid="'+currentTab._name.split('_')[3]+'">';
		if(confirm('ҳ�������Ѹı�,��Ҫ������')){
			for(var i=0;i<__CHANGED_DT.size();i++){
				__TEMP_DT = __tabFrame.contentWindow.__View_Control_Resources.get(__CHANGED_DT.values()[i]);
				__TEMP_COLUMNS = __TEMP_DT._columns._objectArray;
				__TABLES += '<table id="'+__TEMP_DT.getId()+'" fixed="'+__TEMP_DT.getFixedColumn()+'" '
						 +'pagesize="'+__TEMP_DT.getDataset().getPageSize()+'">';
				for(var j=0;j<__TEMP_DT._columns.size();j++){
					__TEMP_COLUMN = __TEMP_COLUMNS[j];
					__TABLES += '<column type="'+__TEMP_COLUMN.getType()+'"';
					__TEMP_LABEL = __TEMP_COLUMN.getLabel();
					if(!__TEMP_LABEL){
						__TEMP_LABEL = __TEMP_DT.getDataset().getField(__TEMP_COLUMN.getField()).getLabel();
						if(!__TEMP_LABEL){
							__TEMP_LABEL = '';
						}
					}
					__TEMP_LABEL = __TEMP_LABEL.replace('\r','\\r');
					__TEMP_LABEL = __TEMP_LABEL.replace('\n','\\n');
					if(__TEMP_COLUMN.getType() == 'data'){//DataColumn
						__TABLES += ' name="'+__TEMP_COLUMN.getName()+'"'
							+' label="'+__TEMP_LABEL+'"'
							+' visible="'+__TEMP_COLUMN.isVisible()+'"'
							+' width="'+__TEMP_COLUMN.getWidth()+'"'
							+' align="'+__TEMP_COLUMN.getAlign()+'"'
							+' parent=""'
							+' order="'+j+'"></column>';
					}
					else{//GroupColumn
						__TABLES += ' name="'+__TEMP_COLUMN.getName()+'"'
							+' label="'+__TEMP_LABEL+'"'
							+' visible="'+__TEMP_COLUMN.isVisible()+'"'
							+' width=""'
							+' align=""'
							+' parent=""'
							+' order="'+j+'"></column>';
						for(var k=0;k<__TEMP_COLUMN.getColumnCount();k++){
							__TEMP_LABEL = __TEMP_COLUMN.getColumn(k).getLabel();
							if(!__TEMP_LABEL){
								__TEMP_LABEL = __TEMP_DT.getDataset().getField(__TEMP_COLUMN.getColumn(k)
										.getField()).getLabel();
								if(!__TEMP_LABEL){
									__TEMP_LABEL = '';
								}
							}
							__TEMP_LABEL = __TEMP_LABEL.replace('\r','\\r');
							__TEMP_LABEL = __TEMP_LABEL.replace('\n','\\n');
							
							__TABLES += '<column type="'+__TEMP_COLUMN.getColumn(k).getType()+'"'
								+ ' name="'+__TEMP_COLUMN.getColumn(k).getName()+'"'
								+' label="'+__TEMP_LABEL+'"'
								+' visible="'+__TEMP_COLUMN.getColumn(k).isVisible()+'"'
								+' width="'+__TEMP_COLUMN.getColumn(k).getWidth()+'"'
								+' align="'+__TEMP_COLUMN.getColumn(k).getAlign()+'"'
								+' parent="'+__TEMP_COLUMN.getName()+'"'
								+' order="'+k+'"></column>';
						}
					}
				}
				__TABLES += '</table>';
			}
		}
		__TABLES += '</tables>';
		var _cmdSysCustom =  buildKingfisherElement("RPCCommand",null,"cmdSysCustom");
		_cmdSysCustom.setAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=set&method=saveSysCustom");
		_cmdSysCustom.setShowLoadingTip(false);
		_cmdSysCustom.parameters().setValue("tables", __TABLES);
		_cmdSysCustom.execute();
		__tabFrame.contentWindow.__USER_CHANGED_DT = new Set();
	}
	//add by chw end
	var result=_$fireKingfisherEvent(this,"onClose",[this,currentTab]);
	if(result)return ;

	if(typeof(currentTab)=="string"){
		
		currentTab=this.getTab(currentTab);
		if(currentTab==null)return null;
		
	};
	if(this._currentTab==currentTab){
		this._$do_activeTab(this._$getPaddedTab(currentTab));
		
	};
	this._tablist.remove(currentTab._name);
	if(this._active){
		this.refresh();
		
	};
	currentTab.destroy();
	
	_$fireKingfisherEvent(this,"afterClose",[this,currentTab]);

	return currentTab;
	
};
function _$TabSet_removeAllTabs(){
	var active=this._active;
	this._active=false;
	var count=this.getTabCount();
	for(var i=count-1;i>=0;i--){
		var currentTab=this.getTab(i);
		this.removeTab(currentTab);
		
	};
	this._active=active;
	if(this._active){
		this.refresh();
		
	}
};
function _$TabSet_getTabCount(){
	return this._tablist.size();
	
};
function _$TabSet_getCurrentTab(){
	return this._currentTab;
	
};
function _$TabSet_setCurrentTab(currentTab){
	if(typeof(currentTab)!="object"){
		currentTab=this._tablist.get(currentTab);
		
	};
	if(this._currentTab!=currentTab){
		this._$do_activeTab(currentTab);
		
	};
	return currentTab;
	
};
function _$TabSet_getMaxTabQuota(){
	return this._maxTabQuota;
	
};
function _$TabSet_setMaxTabQuota(maxTabQuota){
	this._maxTabQuota=maxTabQuota;
	
};
function _$TabSet_getWidthTabName(){
	return this._widthTabName;
	
};
function _$TabSet_setWidthTabName(widthTabName){
	this._widthTabName=widthTabName;
	this._selectWidthTabName=widthTabName+4;
	
};
function _$TabSet_getClosable(){
	return this._closable;
	
};
function _$TabSet_setClosable(closable){
	this._closable=closable;
	
};
function _$TabSet_getContentContainer(){
	return this._contentContainer;
	
};
function _$TabSet_setTabVisibleByName(name,visible){
	var tab=this.getTab(name);
	this.setTabVisible(tab,visible);
};
function _$TabSet_setTabVisible(tab,visible){
	if(tab!=null)
		tab.setVisible(visible);
};
function _$TabSet_setTabEnable(name,enabled){
	var tab=this.getTab(name);
	if(tab!=null)
		tab.setDisabled(!enabled);
};
function _$TabSet_activeTabByName(name){
	this._$do_activeTab(this.getTab(name));

};
function _$TabSet_activeTab(currentTab){
	if(typeof(currentTab)=="number")
		currentTab=this._tablist.get(currentTab);
	if(this._showTabs.indexOf(currentTab)==-1&&this._active){
		this._startIndex=this._$calaVisibleIndex(currentTab);
		this._$rebuild();
		this._$do_activeTab(currentTab);
	}
	else{
		this._$do_activeTab(currentTab);
	}
};
function _$TabSet_do_activeTab(currentTab){

	if(this._active){
		var isNewCurTab=(this._unemployed||(this._currentTab!=currentTab));
		if(currentTab!=null&&(currentTab._disabled))return ;
		try{
			var tablist=this._tablist;
			var showTabs=this._showTabs;
			var puckerDiv=this._puckerDiv;
			var oldCurTab=this._currentTab;
			if(isNewCurTab&&this._beforeTabChange!=null){
				if(currentTab!=null){
					var result=_$fireKingfisherEvent(this,"beforeTabChange",[this,oldCurTab,currentTab]);
					if(result!=null)throw result;
				}
				
			};
			if(oldCurTab!=null){
				var index=showTabs.indexOf(oldCurTab);
				if(index>=0){
					var cell=puckerDiv.childNodes[index];
					_$setElementStyle(cell,"tab");
					cell.style.width=this._widthTabName;
					cell.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=\""+__SKIN_PATH+"/tabset/tab.gif\",sizingMethod=\"scale\")";
					if(this._$isTabClosable(oldCurTab)){
						var img=this._$getTabClosePict(cell);
						if(img!=null)
							_$setVisible(img,false);
					}
				};
				if(isNewCurTab)oldCurTab.deactivate();
				
			};
			oldCurTab=currentTab;
			if(currentTab!=null){

				var index=showTabs.indexOf(currentTab);
				if(index>=0){
					var cell=puckerDiv.childNodes[index];
					_$setElementStyle(cell,"tab selected");
					cell.style.width=this._selectWidthTabName;
					cell.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=\""+__SKIN_PATH+"/tabset/tab.active.gif\",sizingMethod=\"scale\")";
					if(this._$isTabClosable(currentTab)){
						var img=this._$getTabClosePict(cell);
						if(img!=null)
							_$setVisible(img,true);
					}
				};
				if(isNewCurTab)currentTab.activate();
				
			};
			if(isNewCurTab){
				this._currentTab=currentTab;
				this._unemployed=false;
				
				//����δ��ȷ��ʾ������ť���ı���
				var refreshElement=__Need_showPutDropDownBtn_Elements._first;
				while(refreshElement!=null){
					var observer=refreshElement._data;
					refreshElement=refreshElement._next;

					if(typeof(observer._$showPutDropDownBtn)=="function"){
						observer._$showPutDropDownBtn();
							
					}
				}
				
				if(oldCurTab!=null&&currentTab!=null)
					_$fireKingfisherEvent(this,"afterTabChange",[this,oldCurTab,currentTab]);
				
			}
		}catch(e){
			_$processException(e);
			
		}
	}else {
		this._currentTab=currentTab;
		this._unemployed=true;
		
	}
};
function _$TabSet_Pucker_onClick(tabSet){
	var card=_$getKingfisherElement(_$getEventTarget(),"Tab");
	if(card!=null){
		var img=tabSet._$getTabClosePict(card);
		if(img!=null){
			var pos=_$getAbsolutePosition(img,card);

             //2012.09.17½Ӿע�ͣ�����IE9 
             if(event.x>=pos[0]&&event.x<=pos[0]+img.clientWidth&&
			   event.y>=pos[1]&&event.y<=pos[1]+img.clientHeight)
			 //if(event.offsetX>=pos[0]&&event.offsetX<=pos[0]+img.clientWidth&&
			 //		event.offsetY>=pos[1]&&event.offsetY<=pos[1]+img.clientHeight)
				tabSet.removeTab(card._tab);
			else{
				var currentTab=card._tab;
				tabSet._$do_activeTab(currentTab);
			}
		}
		else{
			var currentTab=card._tab;
			tabSet._$do_activeTab(currentTab);
		}
	}
};
function _$TabSet_Pucker_onMouseOver(tabSet){
	var card=_$getKingfisherElement(_$getEventTarget(),"Tab");
	
	//�������޸� 2013-08-21 start
	if(card != null && card.title == ''){
		card.title = card.firstChild.firstChild.firstChild.firstChild.innerText;
	}
	//�������޸� 2013-08-21 end
	//tabSet._puckerDiv.title = card.title;
	if(card!=null&&card._tab!=tabSet._currentTab){
		_$setElementStyle(card,"tab hover");
		card.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=\""+__SKIN_PATH+"/tabset/tab.hover.gif\",sizingMethod=\"scale\")";
		var img=tabSet._$getTabClosePict(card);
		if(img!=null)
			_$setVisible(img,true);
	}
};
function _$TabSet_Pucker_onMouseOut(tabSet){
	var card=_$getKingfisherElement(_$getEventTarget(),"Tab");

	if(card!=null&&card._tab!=tabSet._currentTab){
		_$setElementStyle(card,"tab");
		card.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=\""+__SKIN_PATH+"/tabset/tab.gif\",sizingMethod=\"scale\")";
		var img=tabSet._$getTabClosePict(card);
		if(img!=null)
			_$setVisible(img,false);
	}
};
function _$TabSet_Pucker_onMouseMove(tabSet){
	var card=_$getKingfisherElement(_$getEventTarget(),"Tab");
	
	if(card!=null){
		var img=tabSet._$getTabClosePict(card);
		if(img!=null){
			var pos=_$getAbsolutePosition(img,card);
			if(event.offsetX>=pos[0]&&event.offsetX<=pos[0]+img.clientWidth&&
					event.offsetY>=pos[1]&&event.offsetY<=pos[1]+img.clientHeight)
				_$setElementImage(img,__SKIN_PATH+"/tabset/close.active.gif");
			else
				_$setElementImage(img,__SKIN_PATH+"/tabset/close.gif");
		}
	}
};
function _$TabSet_onResize(){
	if(!this._active)return ;
	
	this.refresh();
//	if(this._resizeTimeout)clearTimeout(this._resizeTimeout);
//	this._resizeTimeout=setTimeout("var tabSet = $(\""+this.id+"\");"+"if (tabSet != null) tabSet.refresh()",150);
	
};
function _$TabSet_locateScrollButton(){
	var puckerDiv=this._puckerDiv;
	var scrollBlock=this._$buildScrollButton();
	if(this._showTabs.length<this._visibleTabs.length){
		scrollBlock.style.left=puckerDiv.scrollLeft+puckerDiv.offsetWidth-scrollBlock.offsetWidth-4;
		scrollBlock.style.top=4;

		var tbody=scrollBlock.firstChild.tBodies[0];
		var row=tbody.rows[0];
		var leftButton=row.cells[0].firstChild;
		var rightButton=row.cells[1].firstChild;
		var dispalyTabs=puckerDiv.childNodes;
		var visibleTabs=this._visibleTabs;
		if(dispalyTabs.length>0&&visibleTabs.length>0){
			if(dispalyTabs[0]._tab==visibleTabs[0]){
				_$setElementImage(leftButton,__SKIN_PATH+"/tabset/tabset_scroll_dis1.gif");
				leftButton.style.cursor="default";
			}
			else{
				_$setElementImage(leftButton,__SKIN_PATH+"/tabset/tabset_scroll1.gif");
				leftButton.style.cursor="hand";
			}
				
			if(dispalyTabs[dispalyTabs.length-1]._tab==visibleTabs[visibleTabs.length-1]){
				_$setElementImage(rightButton,__SKIN_PATH+"/tabset/tabset_scroll_dis2.gif");
				rightButton.style.cursor="default";
			}
			else{
				_$setElementImage(rightButton,__SKIN_PATH+"/tabset/tabset_scroll2.gif");
				rightButton.style.cursor="hand";
			}
		}
		else{
			_$setElementImage(leftButton,__SKIN_PATH+"/tabset/tabset_scroll_dis1.gif");
			_$setElementImage(rightButton,__SKIN_PATH+"/tabset/tabset_scroll_dis2.gif");
			leftButton.style.cursor="default";
			rightButton.style.cursor="default";
		}
			
	}else {
		_$setDisplay(scrollBlock,false);
	}
	
};
function _$TabSet_buildScrollButton(){
	var scrollPane=this._scrollPane;
	if(scrollPane==null){
		var tbody=$$("TBODY");
		var row=$$("TR");
		var tabSet=this;
		var cell,button;
		cell=$$("TD");
		button=$$("IMG");
		_$setElementImage(button,__SKIN_PATH+"/tabset/tabset_scroll1.gif");
		button._type="LeftButton";
		cell.appendChild(button);
		row.appendChild(cell);
		EventManager.addSystemEvent(button,"onclick",function (){
			_$TabSet_TabScroll_onClick(tabSet);			
			
		});
		cell=$$("TD");
		button=$$("IMG");
		_$setElementImage(button,__SKIN_PATH+"/tabset/tabset_scroll2.gif");
		button._type="RightButton";
		cell.appendChild(button);
		row.appendChild(cell);
		EventManager.addSystemEvent(button,"onclick",function (){
			_$TabSet_TabScroll_onClick(tabSet);
			
		});
		tbody.appendChild(row);
		var table=$$("TABLE");
		table.appendChild(tbody);
		table.cellPadding=0;
		table.cellSpacing=0;		
		scrollPane=$$("DIV");
		scrollPane.style.position="absolute";
		scrollPane.appendChild(table);
		this.appendChild(scrollPane);
		this._scrollPane=scrollPane;
		
	};
	return scrollPane;
	
};
function _$TabSet_TabScroll_onClick(tabSet){
	var targ=_$getEventTarget();
	var puckerDiv=tabSet._puckerDiv;
	if(targ._type=="LeftButton"){
		tabSet._startIndex--;
		
		if(tabSet._startIndex<0) tabSet._startIndex=0;
		var cell=puckerDiv.childNodes[tabSet._startIndex];
		if(tabSet._visibleTabs[tabSet._startIndex]!=cell._tab){
			tabSet._$rebuild();
			tabSet._$switch();
		}
	}	
	else if(targ._type=="RightButton"){
		var cell=puckerDiv.childNodes[puckerDiv.childNodes.length-1];
		if(tabSet._visibleTabs[tabSet._visibleTabs.length-1]!=cell._tab){
			tabSet._startIndex++;
			tabSet._$rebuild();
			tabSet._$switch();
		}
	}	
};




//**************************
//��������ť�ĳ�����
//**************************
function Tool(name,label,hotKey){
	this._tag=null;
	this._kingfisherClass="iconTool";
	this._name=name;
	this._label=label;
	this._toolTip=label;
	this._visible=true;
	this._disabled=false;
	this._showLabel=false;
	this._menu=null;
	this._icon=null;
	this._disabledIcon=null;
	this._downIcon=null;
	this._isDown=false;
	this._command=null;
	if(hotKey!=null){
		var keys=hotKey.toUpperCase().split("+");
		if(keys.length==2){
			if(keys[0]=="CTRL")
				this.hotKey=keys[1];
			if(keys[0]=="ALT")
				this.accessKey=keys[1];
		}
	}
	
};
Tool.prototype.destroy=function (){
	this._toolbar=null;
	this._button=null;
	
};
Tool.prototype.getName=function (){
	return this._name;
	
};
Tool.prototype.setLabel=function (label){
	this._label=label;
	
};
Tool.prototype.getLabel=function (){
	return this._label;
	
};
Tool.prototype.isVisible=function (){
	return this._visible;
	
};
Tool.prototype.setVisible=function (visible){
	this._visible=visible;
	if(this._toolbar!=null&&this._toolbar._active){
		this._button.style.display=visible?"":"none";
		
	}
	
};
Tool.prototype.isDisabled=function (){
	return this._disabled;
	
};
Tool.prototype.setDisabled=function (disabled){
	this._disabled=disabled;
	if(this._toolbar!=null&&this._toolbar._active){
		this._toolbar._$refreshStyle(this._button);
		
	}
	
};
Tool.prototype.isShowLabel=function (){
	return this._showLabel;
	
};
Tool.prototype.setShowLabel=function (showLabel){
	this._showLabel=showLabel;
	
};
Tool.prototype.getCommand=function (){
	return kingfisher.feather.getControl(this._command);
	
};
Tool.prototype.setCommand=function (command){
	this._command=command;
	
};
Tool.prototype.getMenu=function (){
	return kingfisher.feather.getControl(this._menu);
	
};
Tool.prototype.setMenu=function (menu){
	this._menu=menu;
	
};
Tool.prototype.getIcon=function (){
	return this._icon;
	
};
Tool.prototype.setIcon=function (icon){
	this._icon=icon;
	
};
Tool.prototype.getDisabledIcon=function (){
	return this._disabledIcon;
	
};
Tool.prototype.setDisabledIcon=function (disabledIcon){
	this._disabledIcon=disabledIcon;
	
};
Tool.prototype.getDownIcon=function (){
	return this._downIcon;
	
};
Tool.prototype.setDownIcon=function (downIcon){
	this._downIcon=downIcon;
	
};
Tool.prototype.click=function (){
	
	var bar=this._toolbar;

	if(bar._disabled || this._group._disabled || this._disabled) return;

	var result=_$fireKingfisherEvent(bar,"beforeButtonClick",[bar,this]);
	if(result!=null)throw result;

	var button=this._button;
	if(button==null)	return;

	var menu=this.getMenu();
	if(menu!=null){
		var box=menu._$getPopupMenu(menu._topItem);
		if(box!=null){
			box.show();
			menu._$locatePopupMenu(box,button,"button");
			box._menuTimeout=setTimeout("kingfisher.feather.getControl(\""+menu.id+"\")._$hiden();",1000);
				
		}
	}
	
	var img=button.firstChild.tBodies[0].rows[0].cells[0].firstChild;
	if(this._group._type==__ToolGroup_TYPE_DOWN){
		if(!this._isDown){
			_$setElementStyle(button, "ToolButton_Down");
			_$setElementImage(img,this._downIcon? this._downIcon : this._icon);
			this._isDown=true;
		}
		else{
			_$setElementStyle(button, "ToolButton");
			_$setElementImage(img,this._icon);
			this._isDown=false;
		}
	}
	else if(this._group._type==__ToolGroup_TYPE_POP){
		var tool=this._group._tools._first;
		while(tool!=null){
			if(tool!=this&&tool._isDown){
				_$setElementStyle(tool._button, "ToolButton");
				_$setElementImage(img,tool._icon);
				tool._isDown=false;
			}
			tool=tool._next;
			
		};
		if(!this._isDown){
			_$setElementStyle(button, "ToolButton_Down");
			_$setElementImage(img,this._downIcon? this._downIcon : this._icon);
			this._isDown=true;
		}
		else{
			_$setElementStyle(button, "ToolButton");
			_$setElementImage(img,this._icon);
			this._isDown=false;
		}
	}

	var result=_$fireKingfisherEvent(bar,"onButtonClick",[bar,this]);
	if(result)	return;


	var command=this.getCommand();
	if(command!=null)
		command.execute();
};
Tool.prototype.getTag=_$Element_getTag;
Tool.prototype.setTag=_$Element_setTag;
Tool.prototype.isShowQuickHelp=_$Element_getShowQuickHelp;
Tool.prototype.setShowQuickHelp=_$Element_setShowQuickHelp;
Tool.prototype.getToolTip=_$Element_getToolTip;
Tool.prototype.setToolTip=_$Element_setToolTip;
Tool.prototype.getHelpDelay=_$Element_getHelpDelay;
Tool.prototype.setHelpDelay=_$Element_setHelpDelay;


function ToolRenderer(renderer){
	if(renderer._kingfisherClass!="Button"&&renderer._kingfisherClass!="Editor"){
		alert("Renderer type needs are Button or Editor.");
		return;
	}

	this._kingfisherClass="renderer";
	this._visible=true;
	this._renderer=renderer;
	this._name=renderer.id;
	renderer.style.height="20px";
};
ToolRenderer.prototype.destroy=function (){
	this._toolbar=null;
	this._renderer.destroy();
};
ToolRenderer.prototype.getRenderer=function (){
	return this._renderer;
	
};
ToolRenderer.prototype.isVisible=function (){
	return this._visible;
	
};
ToolRenderer.prototype.setVisible=function (visible){
	this._visible=visible;
	if(this._toolbar!=null&&this._toolbar._active){
		this._button.style.display=visible?"":"none";
		
	}
	
};
ToolRenderer.prototype.getTag=_$Element_getTag;
ToolRenderer.prototype.setTag=_$Element_setTag;


var __ToolGroup_TYPE_DEFAULT="default";
var __ToolGroup_TYPE_DOWN="down";
var __ToolGroup_TYPE_POP="pop";
function ToolGroup(name){
	this._kingfisherClass="toolgroup";
	this._name=name;
	this._visible=true;
	this._disabled=false;
	this._type=__ToolGroup_TYPE_DEFAULT;
	this._tools=new Collection();
};
ToolGroup.prototype.destroy=function (){
	var tool=this._tools._first;
	while(tool!=null){
		tool._group=null;
		tool.destroy();
		tool=tool._next;
		
	};
	
	this._tools.clear();
	this._toolbar=null;
	this._separator=null;
};
ToolGroup.prototype.addTool=function (tool,mode,refElement){
	if(tool._kingfisherClass!="iconTool"&&tool._kingfisherClass!="renderer")	return;
	tool._group=this;
	
	this._tools.insertElement(tool,mode,refElement);	
	
	if(tool.hotKey || tool.accessKey){
		HotKeyManager.addHotKeyElement(tool);
	}

	if(this._toolbar!=null&&this._toolbar._active){
		this._toolbar.refresh();
		
	}
	return tool;
	
};
ToolGroup.prototype.getTool=function (name){
	var tool=this._tools._first;
	while(tool!=null){
		if(tool._name==name)
			return tool;
		tool=tool._next;
		
	};
	return null;
	
};
ToolGroup.prototype.removeTool=function (name){
	var tool=this.getTool(name);
	if(tool==null)	return null;
	
	this._tools.removeElement(tool);
	if(this._toolbar!=null&&this._toolbar._active){
		this._toolbar.refresh();
		
	}

	return tool;
	
};
ToolGroup.prototype.getToolCount=function (){
	
	return this._tools.size();
	
};
ToolGroup.prototype.isVisible=function (){
	return this._visible;
	
};
ToolGroup.prototype.setVisible=function (visible){
	this._visible=visible;
	var tool=this._tools._first;
	while(tool!=null){
		tool.setVisible(visible);
		tool=tool._next;
		
	};

	if(this._toolbar!=null&&this._toolbar._active&&this._separator){
		this._separator.style.display=visible?"":"none";
		
	}
	
};
ToolGroup.prototype.isDisabled=function (){
	return this._disabled;
	
};
ToolGroup.prototype.setDisabled=function (disabled){
	this._disabled=disabled;
	var tool=this._tools._first;
	while(tool!=null){
		this._toolbar._$refreshStyle(tool._button);
		tool=tool._next;
		
	};
	
};
ToolGroup.prototype.getType=function (){
	return this._type;
	
};
ToolGroup.prototype.setType=function (type){
	this._type=type;
	
};


function SubToolBar(name){
	this._name=name;
	this._visible=true;
	this._inline=false;
	this._groups=new HashList();
	
};
SubToolBar.prototype.destroy=function (){
	var groupCount=this._groups.size();
	for(var i=0;i<groupCount;i++){
		var group=this._groups.get(i);
		group.destroy();
		
	};
	this._subItemTable=null;
	this._groups=null;
	this._toolbar=null;
};
SubToolBar.prototype.addToolGroup=function (group){
	group._subbar=this;
	this._groups.put(group._name.toLowerCase(),group);
	if(this._toolbar!=null&&this._toolbar._active){
		this._toolbar.refresh();
		
	}

	return group;
	
};
SubToolBar.prototype.getToolGroup=function (name){
	if(typeof(name)=="string"){
		name=name.toLowerCase();
		
	};
	return this._groups.get(name);
	
};
SubToolBar.prototype.removeToolGroup=function (name){
	if(typeof(name)=="string"){
		name=name.toLowerCase();
		
	};
	var group=this._groups.remove(name);
	if(this._toolbar!=null&&this._toolbar._active){
		this._toolbar.refresh();
		
	};

	return group;
	
};
SubToolBar.prototype.getToolGroupCount=function (){
	
	return this._groups.size();
	
};
SubToolBar.prototype.isVisible=function (){
	return this._visible;
	
};
SubToolBar.prototype.setVisible=function (visible){
	this._visible=visible;
	if(this._toolbar!=null&&this._toolbar._active){
		this._subItemTable.style.display=visible?"":"none";
		
	}
	
};
SubToolBar.prototype.isInline=function (){
	return this._inline;
	
};
SubToolBar.prototype.setInline=function (inline){
	this._inline=inline;
	
};


function _$buildToolBar(id,viewModel){
	var bar=null;
	if(id){
		bar=$(id);
		
	}else {
		id=_$genControlId();
		
	};
	if(bar==null){
		bar=$$("TABLE");
		bar.id=id;
		bar.cellPadding=0;
		bar.cellSpacing=0;
		
	};
	if(!bar.className)bar.className="ToolBar";
	bar.getId=_$Component_getId;
	bar.getViewModel=_$Component_getViewModel;
	bar.isActive=_$Component_isActive;
	bar.activate=_$ToolBar_activate;
	bar.destroy=_$ToolBar_destroy;
	bar.getTag=_$Element_getTag;
	bar.setTag=_$Element_setTag;
	bar.getContext=_$Element_getContext;
	bar.setContext=_$Element_setContext;
	bar.refresh=_$ToolBar_refresh;
	bar._$paint=_$ToolBar_paint;
	bar.getTool=_$ToolBar_getTool;
	bar.getToolGroup=_$ToolBar_getToolGroup;
	bar.getSubBars=_$ToolBar_getSubBars;
	bar._$refreshToolButtonStyle=_$ToolBar_refreshToolButtonStyle;
	bar._$refreshStyle=_$ToolBar_refreshStyle;
	bar.addSubBar=_$ToolBar_addSubBar;
	bar.getBlankPanel=_$ToolBar_getBlankPanel;
	bar.setDisabled=_$ToolBar_setDisabled;
	bar.getDisabled=_$ToolBar_getDisabled;
	bar._viewModel=viewModel;
	bar._subbars=new HashList();
	return bar;
	
};
KingfisherFactory._$registerComponentType("ToolBar",_$buildToolBar);
function _$ToolBar_destroy(){
	
	var barCount=this._subbars.size();
	for(var i=0;i<barCount;i++){
		var subbar=this._subbars.get(i);
		subbar.destroy();
		
	};
	this._hotItem=null;
	this._subbars=null;
	this._blankPanel=null;
	
};
function _$ToolBar_activate(){
	if(!this._active){		
		this._$paint();
		this.refresh();
		this._active=true;
		_$fireKingfisherEvent(this,"onActive",[this]);
		
	}
};
function _$ToolBar_getTool(name, subbarName, groupname){
	var barCount=this._subbars.size();
	for(var i=0;i<barCount;i++){
		var subbar=this._subbars.get(i);
		if(typeof(subbarName)=="undefined" || (typeof(subbarName)!="undefined"&&subbar._name==subbarName)){
			var groupCount=subbar._groups.size();
			for(var j=0;j<groupCount;j++){
				var group=subbar._groups.get(j);
				if(typeof(groupname)=="undefined" || (typeof(groupname)!="undefined"&&group._name==groupname)){
					var tool=group.getTool(name);
					if(tool!=null)	return tool;
				}			
			};
		}
		
	};
};
function _$ToolBar_getToolGroup(name, subbarName){
	var barCount=this._subbars.size();
	for(var i=0;i<barCount;i++){
		var subbar=this._subbars.get(i);
		if(typeof(subbarName)=="undefined" || (typeof(subbarName)!="undefined"&&subbar._name==subbarName)){
			var groupCount=subbar._groups.size();
			for(var j=0;j<groupCount;j++){
				var group=subbar._groups.get(j);
				if(group!=null)	return group;
				
			};
		}
		
	};
};
function _$ToolBar_setDisabled(disabled){
	this._disabled=disabled;
	
	var barCount=this._subbars.size();
	for(var i=0;i<barCount;i++){
		var subbar=this._subbars.get(i);
		var groupCount=subbar._groups.size();
		for(var j=0;j<groupCount;j++){
			var group=subbar._groups.get(j);
			var tool=group._tools._first;
			while(tool!=null){
				this._$refreshStyle(tool._button);
				
				tool=tool._next;
				
			};
				
		};
		
	};
};
function _$ToolBar_getDisabled(){
	return this._disabled;
	
};
function _$ToolBar_getSubBars(){
	
	return this._subbars;
};
function _$ToolBar_addSubBar(subbar){
	this._subbars.put(subbar._name.toLowerCase(),subbar);

};
function _$ToolBar_getBlankPanel(){
	
	return this._blankPanel;
};
function _$ToolBar_paint(){
	_$fireKingfisherEvent(this,"onInitToolBar",[this]);
	
	this.className="ToolBodyBar";
	this.cellPadding=_$getPreferenceSetting("__BodyBar_CellPadding");
	this.cellSpacing=_$getPreferenceSetting("__BodyBar_CellSpacing");
	this.border=_$getPreferenceSetting("__BodyBar_BorderWidth");
	var tbody=$$("TBODY");
	this.appendChild(tbody);
	var bar=this;
	EventManager.addSystemEvent(bar,"onclick",function (){
		_$ToolBar_onClick(bar);
		
	});
	EventManager.addSystemEvent(bar,"onmouseover",function (){
		_$ToolBar_onMouseOver(bar);
		
	});
	EventManager.addSystemEvent(bar,"onmouseout",function (){
		_$ToolBar_onMouseOut(bar);
		
	});
	
};
function _$ToolBar_refresh(){
	function _$builderSubBar(subbar,tbrow){
		var cell=$$("TD");
		cell.vAlign="bottom";
		var table=$$("TABLE");
		table.className="ToolPlateBar";
		table.cellPadding=0;
		table.cellSpacing=0;
		table.cellPadding=_$getPreferenceSetting("__ToolBar_CellPadding");
		if(this._showBorder)
			table.border=_$getPreferenceSetting("__ToolBar_BorderWidth");
		else
			table.border=0;
		table.style.borderCollapse=_$getPreferenceSetting("__ToolBar_BorderCollapse");
		var tb=$$("TBODY");
		var tr=$$("TR");
		

		var tbcell=$$("TD");
		tbcell.className="ToolBar";
		var table2=$$("TABLE");
		table2.cellPadding=0;
		table2.cellSpacing=0;
		table2.border=_$getPreferenceSetting("__BodyBar_BorderWidth");
		var tb2=$$("TBODY");
		var tbrow2=$$("TR");
		subbar._subItemTable=table2;

		var tbcell2=$$("TD");
		tbcell2.width="8";
		tbcell2.align="center";
		tbcell2.noWrap=true;
		var table3=$$("TABLE");
		table3.cellPadding=0;
		table3.cellSpacing=1;
		table3.border=_$getPreferenceSetting("__ListSeparator_BorderWidth");
		var tb3=$$("TBODY");
		for(var i=1; i<=4; i++){
			var tbrow3=$$("TR");
			var tbcell3=$$("TD");
			var img=$$("IMG");
			img.className="ListSeparator";
			tbcell3.appendChild(img);
			tbrow3.appendChild(tbcell3);
			tb3.appendChild(tbrow3);
		};
		table3.appendChild(tb3);
		tbcell2.appendChild(table3);
		tbrow2.appendChild(tbcell2);
	
		tb2.appendChild(tbrow2);
		table2.appendChild(tb2);
	
		tbcell.appendChild(table2);
		tr.appendChild(tbcell);
		
		tb.appendChild(tr);
		table.appendChild(tb);
		cell.appendChild(table);
		tbrow.appendChild(cell);

		if(!subbar._visible)
			table2.style.display="none";

		return tbrow2;
	};
	function _$refreshTool(tool,button){
		if(tool._kingfisherClass=="iconTool"){
			button._kingfisherClass="ToolBarButton";
			var img=$$("IMG");
			img.align="absbottom";
			img.style.width="16px";
			img.style.height="16px";
			if(tool._disabled){
				_$setElementStyle(button, "ToolButton_Disabled");
				_$setElementImage(img,tool._disabledIcon? tool._disabledIcon : tool._icon);
				img.style.filter="gray";
				
			}else {
				_$setElementStyle(button, "ToolButton");
				_$setElementImage(img,tool._icon);
				img.style.filter="";
				
			};
			var iconCell=$$("TD");
			iconCell.style.whiteSpace="nowrap";
			iconCell.align="center";
			iconCell.style.width="100%";
			iconCell.appendChild(img);
			if(tool._toolTip){
				var toolTip=tool._toolTip;
				if(tool.hotKey){
					toolTip=(toolTip?toolTip+" ": "")+"Ctrl+"+tool.hotKey;
				};
				if(tool.accessKey){
					toolTip=(toolTip?toolTip+" ": "")+"Alt+"+tool.accessKey;
				};
				img.title=toolTip;

				if(tool._showQuickHelp){
			    QuickHelp.add(new HelpItem(button, toolTip, tool._helpDelay));
				}
			}
			if(tool._showLabel){
				var lable=$$("LABEL");
				lable.innerText=tool._label;
				iconCell.appendChild(document.createTextNode(" "));
				iconCell.appendChild(lable);
			}
			
			if(tool._menu){
				iconCell.appendChild(document.createTextNode(" "));
				iconCell.appendChild($$("<IMG src=\""+__SKIN_PATH+"/menubar_indicator.gif\" align=\"middle\">"));
			}
			
			var row=$$("TR");
			row.appendChild(iconCell);
			var tbody=$$("TBODY");
			tbody.appendChild(row);
			var table=$$("TABLE");
			table.style.height="100%";
			table.cellSpacing=0;
			table.cellPadding=0;
			table.appendChild(tbody);
			button.appendChild(table);
		}
		else{
			button.style.paddingLeft="2px";
			button.style.paddingRight="3px";
			if(tool.getRenderer()._kingfisherClass=="Editor"){
				var cell=$$("TD");
				cell.style.width="100%";
				cell.appendChild(tool.getRenderer());
				var row=$$("TR");
				row.appendChild(cell);
				var tbody=$$("TBODY");
				tbody.appendChild(row);
				var table=$$("TABLE");
				table.style.height="100%";
				table.cellSpacing=0;
				table.cellPadding=0;
				table.appendChild(tbody);
				button.appendChild(table);
			}
			else{
				button.appendChild(tool.getRenderer());
			}
		}
		button._tool=tool;
		
		if(!tool._visible||!tool._group._visible)
			button.style.display="none";
		
	};
	
	var i=this.tBodies[0].childNodes.length;
	while(i>0){
		this.tBodies[0].removeChild(this.tBodies[0].childNodes[i-1]);
		i--;
		
	};
	
	var tbrow;
	var barCount=this._subbars.size();
	for(var i=0;i<barCount;i++){
		var subbar=this._subbars.get(i);
		subbar._toolbar=this;
		if(!subbar._inline){
			tbrow=$$("TR");
			this.tBodies[0].appendChild(tbrow);
		}
		var row=_$builderSubBar(subbar,tbrow);

		var groupCount=subbar._groups.size();
		for(var j=0;j<groupCount;j++){
			var group=subbar._groups.get(j);
			group._toolbar=this;
			var tool=group._tools._first;
			while(tool!=null){
				var cell=$$("TD");
				var button=$$("DIV");
				button._group=group;
				tool._toolbar=this;
				tool._button=button;
				_$refreshTool(tool,button);
				cell.appendChild(button);
				row.appendChild(cell);

				tool=tool._next;
				
			};
			if(j<groupCount-1){
				var cell=$$("TD");
				cell.style.paddingTop="3";
				cell.style.paddingLeft="3";
				cell.style.paddingRight="3";
				var button=$$("DIV");
				button.className="Separator";
				button.style.height="100%";
				button.style.width="1px";
				cell.appendChild(button);
				row.appendChild(cell);
				group._separator=cell;
			}
			
		};

		if(i+1==barCount||!this._subbars.get(i+1)._inline){
			//var td=$$("<TD width=\"100%\">");
			var td=$$("td");
			td.innerHTML="&nbsp;";
			td.width = "100%";
			td.innerHTML="&nbsp;";
			tbrow.appendChild(td);
			this._blankPanel=td;
		}
	}
};
function _$ToolBar_onClick(bar){
	var button=_$getKingfisherElement(_$getEventTarget(),"ToolBarButton");
	if(button!=null){
		button._tool.click();
	};
};
function _$ToolBar_onMouseOver(bar){
	var button=_$getKingfisherElement(_$getEventTarget(),"ToolBarButton");
	if(button!=null){
		clearTimeout(bar._toolTimeout);
		bar._$refreshToolButtonStyle(button);
	};
};
function _$ToolBar_onMouseOut(bar){
	var button=_$getKingfisherElement(_$getEventTarget(),"ToolBarButton");
	if(button!=null){
		bar._toolTimeout=setTimeout("$(\""+bar.id+"\")._$refreshToolButtonStyle(null);",300);
		
	};
};
function _$ToolBar_refreshToolButtonStyle(button){
	if(this._hotItem==button)return ;
	var oldHotItem=this._hotItem;
	if(oldHotItem!=null){
		this._$refreshStyle(oldHotItem);
	};
	if(button!=null){
		var tool=button._tool;
		if(this._disabled||tool._group._disabled||tool._disabled){
			button=null;
				
		}
		else {
			_$setElementStyle(button,(!button._tool._isDown ? "HotToolButton" : "HotToolButton_Down"));
			
		}
	};
	this._hotItem=button;
	
};
function _$ToolBar_refreshStyle(button){
	if(button!=null){
		var img=button.firstChild.tBodies[0].rows[0].cells[0].firstChild;
		var tool=button._tool;
		var group=tool._group;
		if(this._disabled || group._disabled || tool._disabled){
			_$setElementStyle(button, "ToolButton_Disabled");
			if(button._tool._disabledIcon)
				_$setElementImage(img,button._tool._disabledIcon);
			else
				img.style.filter="gray";
			
		}else{
			_$setElementStyle(button,(!button._tool._isDown ? "ToolButton" : "ToolButton_Down"));
			if(button._tool._isDown&&button._tool._downIcon)
				_$setElementImage(img,button._tool._downIcon);
			else
				_$setElementImage(img,button._tool._icon);
			img.style.filter="";
			
		}
	};
	
};

var QuickHelp={
	_items : null,
	
	destroy:function (){
		if(this._items!=null){
			var len=this._items.length;
	    for( var i=0; i<len; i++ ){
	        var item = this._items[i];
	        item.destroy();
	    }
  	}
		this._items=null;
	},
	_$initialise:function (){
		if(this._items==null){
			this._items=[];
			_$registerFinalizeProcedure(this.destroy);
			
		}
	},
	add : function(helpItem){
		this._$initialise();

		if(this._items.indexOf(helpItem) == -1)
  		this._items.push(helpItem);
  },
	showHelp : function(){
		if(this._items!=null){
			var len=this._items.length;
	    for( var i=0; i<len; i++ ){
	        var item = this._items[i];
	        item.show();
	    }
  	}
  },
  _$closeHelp : function(helpItem){
		if(this._items!=null){
			var len=this._items.length;
	    for( var i=0; i<len; i++ ){
	        var item = this._items[i];
	        if(!helpItem || item.id==helpItem)
	        	item._$closeHelp();
	    }
	  }
	}
};


function HelpItem(objElement, text, helpDelay) {
	this.id=_$genControlId();
	if(objElement._kingfisherClass=="iconTool"){
		objElement=objElement._button;
	}
  this._oElement = objElement;
  this._text = text;
  if(parseInt(helpDelay) > 0)
  	this._helpDelay=parseInt(helpDelay);
  else
  	this._helpDelay=3;
};
HelpItem.prototype.destroy = function(){
  this._oElement = null;
  this._text = null;
  this._element = null;
};
HelpItem.prototype.show = function(){
	
  var div = this._element;
  var textDiv;
  var arrow;
  if(!div){
  	div = $$("DIV");
	  this._element = div;
  	document.body.appendChild(div);
  	div.className = "QuickHelp";
	  
	  arrow = $$("DIV");
	  div.appendChild(arrow);
	  arrow.className = "ArrowTopRight";
	  arrow.innerHTML = "&nbsp;";

	  textDiv = $$("DIV");
	  div.appendChild(textDiv);
	  textDiv.onmouseover = function()
	  {
	      if( !this.closeObj )
	      {
	          var closeBtn = $$("IMG");
	          textDiv.appendChild(closeBtn);
	          closeBtn.src = __SKIN_PATH+"/quickhelp/helpclose.jpg";
	          closeBtn.style.position = "absolute";
	          closeBtn.style.right = "3px";
	          closeBtn.style.top = "3px";    
	          closeBtn.Object = this;
	          closeBtn.title = __HELPITEM_CLOSE_BUTTON;
	          
	          closeBtn.onclick = function()
	          {
	              this.Object.parentNode.style.display = "none";
	          };
	          
	          this.closeObj = closeBtn;           
	      }
	      this.closeObj.style.display = '';
	  };
	  
	  textDiv.onmouseout = function()
	  {
	      this.closeObj.style.display = 'none';
	  };
  }
	else{
		arrow=this._element.childNodes[0];
		textDiv=this._element.childNodes[1];
	}
 
  textDiv.innerText = this._text;    
  textDiv.className = "TextDown";

	var arrowOrientation="Top";
	var arrowDirection="Right";
	
	var pos=_$getAbsolutePosition(this._oElement);
	var otop=pos[1]+this._oElement.offsetHeight+arrow.offsetHeight;
	if(otop+arrow.offsetHeight+textDiv.offsetHeight>=document.body.clientHeight){
	  textDiv.className = "TextUp";
	  arrowOrientation="Down";
		otop=pos[1]-textDiv.offsetHeight-arrow.offsetHeight;
	}
	var oleft=pos[0]+10-textDiv.offsetWidth;
	if(oleft<0){
		oleft=pos[0]+this._oElement.offsetWidth-10;
		arrowDirection="Left";
		if(oleft+textDiv.offsetWidth>document.body.clientWidth){
			oleft=0;
			if(pos[0] > document.body.clientWidth / 2)
				arrowDirection="Right";
		}
	}
	
  div.style.top = otop;
  div.style.left = oleft;
  arrow.className = "Arrow"+arrowOrientation+arrowDirection;
  div.style.display = '';

	setTimeout("QuickHelp._$closeHelp('"+this.id+"')", this._helpDelay*1000);
};  
HelpItem.prototype._$closeHelp = function(){
	
	try{
  	this._element.style.display = "none";
  }
  catch(e){
  }
};


var __Standard_MessageTip=null;
function _$getStandardMessageTip(){
	if(__Standard_MessageTip==null){
		var div;
		div=$$("DIV");
		div.className="MessageTip";
		var table=$$("TABLE");
		table.className="OuterTable";
		table.cellSpacing=0;
		table.cellPadding=0;
		
		var tbody=$$("TBODY");
		var tr=$$("TR");
		var titleLeft=$$("TD");
		titleLeft.className="TitleLeft";
		tr.appendChild(titleLeft);
		
		var titleCenter=$$("TD");
		titleCenter.className="TitleCenter";
		titleCenter.vAlign="center";
		tr.appendChild(titleCenter);
		
		var titleRight=$$("TD");
		titleRight.className="TitleRight";
		titleRight.vAlign="center";
		titleRight.align="right";
		var closeButton=$$("SPAN");
		closeButton.className="CloseButton";
		closeButton.title=__SUBWINDOW_TIP_CLOSE;
		closeButton.innerText="��";
		closeButton._kingfisherClass="MessageTipButton";
		titleRight.appendChild(closeButton);
		
		tr.appendChild(titleRight);
		tbody.appendChild(tr);

		var tr=$$("TR");
		var contextContainer=$$("TD");
		contextContainer.className="ContextContainer";
		contextContainer.colSpan=3;
		var contaiDiv=$$("DIV");
		contaiDiv.className="ContainerDiv";
		contextContainer.appendChild(contaiDiv);
		tr.appendChild(contextContainer);
		
		tbody.appendChild(tr);
		table.appendChild(tbody);
		div.appendChild(table);
		
		__Standard_MessageTip=div;
	};
	return __Standard_MessageTip;
	
};

function _$PopupMessage_onClick(){
	var button=_$getKingfisherElement(_$getEventTarget(),"MessageTipButton");
	var me=button._messageTip;
	if(me){
		me._close=true;
		me.hide(true);
	}
};

//����msn����ʾ��Ϣ
function MessageTip(title, context)   
{   
	var box=_$getStandardMessageTip().cloneNode(true);
	var tbody=box.firstChild.tBodies[0];
	var titleRow=tbody.rows[0];
	var contextRow=tbody.rows[1];
	titleRow.cells[1].innerHTML=title;
	var closeButton=titleRow.cells[2].firstChild;
	closeButton._messageTip=this;
	EventManager.addSystemEvent(closeButton,"onclick",function (){
		_$PopupMessage_onClick();
		
	});
		
	var contextRow=tbody.rows[1];
	contextRow.firstChild.firstChild.innerHTML=context;
		
	document.body.appendChild(box);
		
  this._obj = box;   
  this._divHeight = this._obj.offsetHeight;   
  this._divWidth = this._obj.offsetWidth;   
  this._docWidth = document.body.clientWidth;   
  this._docHeight = document.body.clientHeight;   
  this._timeout= 9000;   
  this._speed = 20;   
  this._step = 3;   
  this._timer = 0;   
  this._pause = false;   
  this._close = false;   
  this._autoClose = true;
  this._$add(this);   
};   
  
MessageTip.prototype._$tips = new Array();   
  
MessageTip.prototype._$add = function(mt)   
{   
    this._$tips.push(mt);   
};   
  
MessageTip.prototype.show = function()   
{   
	if(this.onload()){
   
	    var me = this;   
	    var mess = this._obj;   
    	mess.onmouseover = function(){me._pause=true;};   
    	mess.onmouseout = function(){me._pause=false;};   
    	mess.style.top = parseInt(document.body.scrollTop) + this._docHeight + 10;   
    	mess.style.left = parseInt(document.body.scrollLeft) + this._docWidth - this._divWidth;    
   	 	mess.style.visibility = 'visible';   
    
    	var moveUp = function()   
    	{   
        	var tHeight = me._divHeight;   
	        var t = me._$tips;   
	        for(var i=0; i<t.length; i++){   
	            var tt = t[i];   
	            if(tt==me){   
	                break;   
	            }else{   
	                tHeight += tt._divHeight + 3;   
	            }   
	        };
	         
	        if(parseInt(mess.style.top) <= (me._docHeight - tHeight + parseInt(document.body.scrollTop))){   
		        me._timeout--;    
		        if(me._timeout==0){   
	              clearInterval(me._timer);   
	              if(me._autoClose){   
	                 me.hide();   
	              }   
	          }   
	        } else {   
	            mess.style.top = parseInt(mess.style.top) - me._step;   
      		}   
    	};
    	this._timer = setInterval(moveUp,this._speed);   
  }   
};   
  
MessageTip.prototype.hide = function(immediately)   
{   
    var me = this;   
    var mess = this._obj;   
		if(immediately==true){
       clearInterval(me._timer);
       mess.removeNode(true); 
       me._$tips.remove(me);  
		}
		else{
	    if(this.onunload()){   
			  if(this._timer>0){   
			    clearInterval(me._timer);   
			  };
		    
	      var moveDown = function()   
	      {   
	            if(me._pause==false || me._close){   
	                if(parseInt(mess.style.top) >= (parseInt(document.body.scrollTop) + me._docHeight + 10)){   
		                clearInterval(me._timer);
		                mess.removeNode(true); 
		                me._$tips.remove(me);  
	                               
	                } else {   
	                	mess.style.top = parseInt(mess.style.top) + me._step;   
	            		}   
	          }   
	      };   
	      this._timer = setInterval(moveDown,this._speed);   
	  }   
	}
};   
  
MessageTip.prototype.onload = function()   
{   
    return true;   
};   
  
MessageTip.prototype.onunload = function()   
{   
    return true;   
};


//�˲��������ڸ߼�������ĲŴ��ڵ�
var __DROPDOWN_Page_Opened=false;
var __CURRENT_AdvanceDropDown=null;
var __CURRENT_DropDown_Window=null;
_$registerInitializeProcedure(function (){
	__DROPDOWN_Page_Opened=true;
	
});
function _$registerAdvanceDropDown(advanceDropDown,_window){
	__CURRENT_AdvanceDropDown=advanceDropDown;
	__CURRENT_DropDown_Window=_window;
	if(browserType==__Browser_OTHER){
		EventManager.addSystemEvent(window,"onmousedown",function (){
			_window._$Element_onFocus(advanceDropDown._frame);
			
		});
		
	}
};
function _$releaseAdvanceDropDown(){
	if(__CURRENT_AdvanceDropDown!=null){
		__CURRENT_AdvanceDropDown=null;
		__CURRENT_DropDown_Window=null;
		
	}
};
_$registerFinalizeProcedure(_$releaseAdvanceDropDown);
var DropDown=((typeof(DropDown)=="object")?DropDown:new Object());
DropDown.closeFrame=function (selectedRecord){
	__CURRENT_AdvanceDropDown.close(selectedRecord);
	
};
