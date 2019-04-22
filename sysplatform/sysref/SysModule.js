var _IsLoadingModulePage = false;
var _IsReCallParamPage = false;
var _ExchangeParams;

var cmdSysCallModule = buildKingfisherElement("RPCCommand", null, "cmdSysCallModule");
cmdSysCallModule.setAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=set&method=getCallModuleInfo");
cmdSysCallModule.setShowLoadingTip(false);

var cmdSysCallFavorite = buildKingfisherElement("RPCCommand", null, "cmdSysCallFavorite");
cmdSysCallFavorite.setAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=set&method=addFavorite");
cmdSysCallFavorite.setShowLoadingTip(false);

var cmdSysCallWindow = buildKingfisherElement("RequestCommand", null, "cmdSysCallWindow");
cmdSysCallWindow.setPath("null");

var cmdSysCallWindowFrame = cmdSysCallWindow.getFrame();
cmdSysCallWindowFrame.setTarget("_modal_dialog");
cmdSysCallWindowFrame.setWidth(0);
cmdSysCallWindowFrame.setHeight(0);
//add by 楚洪武start
var cmdCheckResource = buildKingfisherElement("RPCCommand", null, "cmdCheckResource");
cmdCheckResource.setAction("/retrieve.do?className=action.CheckResource&ferry=set&method=check");
cmdCheckResource.setShowLoadingTip(false);
//add by 楚洪武end
var __moduleFilterName;
var __moduleFilterValue;
//var __uiStyle

function setModuleFilterCondition(name, value) {
    __moduleFilterName = name;
    __moduleFilterValue = value;
}

var dsSysMessage = buildKingfisherElement("Dataset", null, "dsSysMessage", "Reference");
dsSysMessage.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getSysMessageInfo");
dsSysMessage.setPageSize(0);
dsSysMessage.addField("CNT", 4, false);

var dsSysUI = buildKingfisherElement("Dataset", null, "dsSysUI", "Reference");
dsSysUI.setPageSize(0);
dsSysUI.addField("NodeID", 4, false);
dsSysUI.addField("NodeCode", 1, false);
dsSysUI.addField("NodeName", 1, false);
dsSysUI.addField("IsDIR", 1, false);
dsSysUI.addField("NodeBMP", 1, false);
dsSysUI.addField("NodeLBMP", 1, false);
dsSysUI.addField("ModuleID", 4, false);
dsSysUI.addField("ActionID", 4, false);
dsSysUI.addField("SNO", 4, false);
dsSysUI.addField("ActionNo", 1, false);
dsSysUI.addField("NodeLevel", 4, false);

var dsSysModule = buildKingfisherElement("Dataset", null, "dsSysModule", "Reference");
dsSysModule.setPageSize(0);
dsSysModule.addField("ModuleID", 4, false);
dsSysModule.addField("ModuleCode", 1, false);
dsSysModule.addField("ModuleName", 1, false);
dsSysModule.addField("Context", 1, false);
dsSysModule.addField("Visibled", 1, false);
dsSysModule.addField("Valided", 1, false);
dsSysModule.addField("Checked", 1, false);
dsSysModule.addField("BMP", 1, false);

var dsSysAction = buildKingfisherElement("Dataset", null, "dsSysAction", "Reference");
dsSysAction.setPageSize(0);
dsSysAction.addField("ModuleID", 4, false);
dsSysAction.addField("ActionID", 4, false);
dsSysAction.addField("ActionCode", 1, false);
dsSysAction.addField("ActionName", 1, false);
dsSysAction.addField("Visibled", 1, false);
dsSysAction.addField("Valided", 1, false);
dsSysAction.addField("Checked", 1, false);
dsSysAction.addField("IsDIV", 1, false);
dsSysAction.addField("BMP", 1, false);
dsSysAction.addField("NeedParam", 1, false);
dsSysAction.addField("ParamName", 1, false);
dsSysAction.addField("SNO", 4, false);

var dsSysFav = buildKingfisherElement("Dataset", null, "dsSysFav", "Reference");
dsSysFav.setPageSize(0);
dsSysFav.addField("NodeID", 4, false);
dsSysFav.addField("NodeCode", 1, false);
dsSysFav.addField("NodeName", 1, false);
dsSysFav.addField("IsDIR", 1, false);
dsSysFav.addField("NodeBMP", 1, false);
dsSysFav.addField("NodeLBMP", 1, false);
dsSysFav.addField("ModuleID", 4, false);
dsSysFav.addField("ActionID", 4, false);
dsSysFav.addField("SNO", 4, false);

addKingfisherEvent(dsSysAction, "onFilterRecord",
    function (dataset, record) {
        if (__moduleFilterName && __moduleFilterValue)
            return (record.getValue(__moduleFilterName) == __moduleFilterValue);
        else
            return true;
    }
);

/*
 function transfer(objPar)
 {
 if(self.tsOuter){
 var currentTab = self.tsOuter.getCurrentTab();
 var frame = currentTab.getFrame2();
 frame.contentWindow.search(objPar);
 }
 else{
 var currentTab = tsSysModule.getCurrentTab();
 var frame = currentTab.getFrame();
 frame.contentWindow.search(objPar);
 }
 }
 */



function getSysCurTab() {
    if ((tsSysModule) && (tsSysModule.getCurrentTab())) {
        return tsSysModule.getCurrentTab()
    }
    else
        return null;
}

function getSysCurParam() {
    return window.frames[getSysCurTab().moduleInfo.tabParamName];
}

function getSysCurWindow() {
    if ((tsSysModule) && (tsSysModule.getCurrentTab())) {
        return tsSysModule.getCurrentTab().getFrame().contentWindow;
    }
    else
        return null;
}

function getSysBrowserHeightOffset() {
    var _ua = navigator.userAgent.toLowerCase();
    var isOpera = _ua.indexOf("opera") > -1;
    var isIE = !isOpera && _ua.indexOf("msie") > -1;
    var isIE6 = !isOpera && _ua.indexOf("msie 6") > -1;
    var isIE7 = !isOpera && _ua.indexOf("msie 7") > -1;
    var isIE8 = !isOpera && _ua.indexOf("msie 8") > -1;

    if (isIE6) {
        return 45;
    }
    else
        return 0;
}

function setSysFavMenuStatus(item) {
    var tr = eval(muSysFav.getPopupContainer());

    if (item.getName() == 'miAddFav') {
        if ((tr.getCurrentNode()) && (tr.getCurrentNode().ModuleID > 0) && (tr.getCurrentNode().isFav == 0))
            item.setEnabled(true);
        else
            item.setEnabled(false);
    }
    else if (item.getName() == 'miDelFav') {
        if ((tr.getCurrentNode()) && (tr.getCurrentNode().ModuleID > 0) && (tr.getCurrentNode().isFav == 1))
            item.setEnabled(true);
        else
            item.setEnabled(false);
    }
}

function callSysFavMenuAction(item) {
    var tr = eval(muSysFav.getPopupContainer());

    if (item.getName() == 'miAddFav') {
        cmdSysCallFavorite.parameters().setValue("ActionType", 0);
        cmdSysCallFavorite.parameters().setValue("ModuleID", tr.getCurrentNode().ModuleID);
        cmdSysCallFavorite.parameters().setValue("ActionID", tr.getCurrentNode().ActionID);
        //Succeed
        var CallSucceed = cmdSysCallFavorite.execute();
        if (CallSucceed) {
            var Succeed = cmdSysCallFavorite.outParameters().getValue("Succeed");
            if (Succeed !== "1") {
                smoke.alert(cmdSysCallFavorite.outParameters().getValue("ErrMes"));
            }
            else {
                smoke.alert("添加成功！");
                tr.clearAllNodes();
            }
        }
    }
    else if (item.getName() == 'miDelFav') {
        cmdSysCallFavorite.parameters().setValue("ActionType", 1);
        cmdSysCallFavorite.parameters().setValue("ModuleID", tr.getCurrentNode().ModuleID);
        cmdSysCallFavorite.parameters().setValue("ActionID", tr.getCurrentNode().ActionID);
        //Succeed
        var CallSucceed = cmdSysCallFavorite.execute();
        if (CallSucceed) {
            var Succeed = cmdSysCallFavorite.outParameters().getValue("Succeed");
            if (Succeed !== "1") {
                smoke.alert(cmdSysCallFavorite.outParameters().getValue("ErrMes"));
            }
            else {
                tr.clearAllNodes();
                smoke.alert("删除成功！");
            }
        }
    }
    else if (item.getName() == 'miRefresh') {
        dsSysUI.setShowLoadingTip(true);
        tr.clearAllNodes();
        dsSysUI.setShowLoadingTip(false);
    }
}

function callSysModulePage(moduleInfo, callObjectInfo) {
    var tabset = null;//new style
    if (self.tsSysModule)
        tabset = tsSysModule;//old style
    //var tabset = tsSysModule;
    //Modal Module
    if (moduleInfo && moduleInfo.dialog) {
        if (moduleInfo.modalParam) {
            var cmd = cmdSysCallWindow;
            var frame = cmd.getFrame();
            cmd.setPath(moduleInfo.urlModule);

            //居中
            if (moduleInfo.modalParam.align == '1')
                frame.setCenter(true);
            else
                frame.setCenter(false);

            if (moduleInfo.modalParam.resize == '1')
                frame.setResizable(true);
            else
                frame.setResizable(false);

            if (moduleInfo.modalParam.scroll == '1')
                frame.setScroll(true);
            else
                frame.setScroll(false);

            /*
             if (moduleInfo.modalParam.isModal == '1')
             frame.setTarget("_modal_dialog");
             else
             frame.setTarget("_modeless_dialog");
             */
            frame.setTarget("_exclusive_subwindow");

            if (moduleInfo.modalParam.status == '1')
                frame.statusbar = true;
            else
                frame.statusbar = false;

            var v_Left = 0;
            var v_Top = 0;

            //左上
            if (moduleInfo.modalParam.align == '2') {
                v_Left = moduleInfo.modalParam.left;
                v_Top = moduleInfo.modalParam.top;
            }
            //右下
            else if (moduleInfo.modalParam.align == '3') {
                v_Top = screen.availHeight - moduleInfo.modalParam.bottom - moduleInfo.modalParam.height;
                v_Left = screen.availWidth - moduleInfo.modalParam.right - moduleInfo.modalParam.width;
            }
            //左下
            else if (moduleInfo.modalParam.align == '4') {
                v_Top = screen.availHeight - moduleInfo.modalParam.bottom - moduleInfo.modalParam.height;
                v_Left = moduleInfo.modalParam.left;
            }
            //右上
            else if (moduleInfo.modalParam.align == '5') {
                v_Top = moduleInfo.modalParam.top;
                v_Left = screen.availWidth - moduleInfo.modalParam.right - moduleInfo.modalParam.width;
            }

            frame.setLeft(v_Left);
            frame.setTop(v_Top);
            frame.setWidth(moduleInfo.modalParam.width);
            if (cmd.getFrame().getTarget() == "_exclusive_subwindow")
                frame.setHeight(parseInt(moduleInfo.modalParam.height, 10) + getSysBrowserHeightOffset() + 20)
            else
                frame.setHeight(parseInt(moduleInfo.modalParam.height, 10) + getSysBrowserHeightOffset());

            if (moduleInfo.modalParam.isModal == '1') {
                if (cmd.getFrame().getTarget() == "_exclusive_subwindow") {
                    _ExchangeParams = callObjectInfo
                    cmd.execute();
                    if ((callObjectInfo) && (callObjectInfo.RValue) && (callObjectInfo.Dataset) && (callObjectInfo.Dataset.getVisibleCount() > 0)) {
                        var bookMark = callObjectInfo.Dataset.getBookmark();
                        callObjectInfo.Dataset.flushData();
                        callObjectInfo.Dataset.setBookmark(bookMark);
                        delete callObjectInfo;
                        _ExchangeParams = null;
                    }
                }
                else {
                    var rvalue = cmd.execute(callObjectInfo);
                    if ((rvalue) && (callObjectInfo.Dataset) && (callObjectInfo.Dataset.getVisibleCount() > 0)) {
                        var bookMark = callObjectInfo.Dataset.getBookmark();
                        callObjectInfo.Dataset.flushData();
                        callObjectInfo.Dataset.setBookmark(bookMark);
                        delete callObjectInfo;
                    }
                    return rvalue;
                }
            }
            else
                cmd.execute(callObjectInfo);
        }
    }
    //Normal Module
    else {
        var tabName = moduleInfo.tabModuleName;
        var curWindow;
        if (tabset.tabExist(tabName)) {
            _IsReCallParamPage = true;
            //如果已经是活动的则不激活
            if (tabset.getCurrentTab().getName() !== tabName)
                tabset.activeTabByName(tabName);
            curWindow = tabset.getCurrentTab().getFrame().contentWindow;
            _IsReCallParamPage = false;
        }
        else {
            _IsLoadingModulePage = true;

            //由于Tabset控件已经在SetPath时候增加过ContextPath，增加依据是判断第一个是否是'/'
            //if (moduleInfo.urlModule.charAt(0) !== '/')
            //	moduleInfo.urlModule = '/' + moduleInfo.urlModule;

            if (moduleInfo.moduleCode == "SysWelcome") {
                //对于首页要屏蔽关闭按钮
                var modulePage = new FrameTab("WelcomePage", moduleInfo.displayName);
                modulePage.setPath(moduleInfo.urlModule);
                modulePage.moduleInfo = moduleInfo;

                modulePage.callObjectInfo = callObjectInfo;
                modulePage.setClosable(false);
                tabset.addTab(modulePage);
            }
            else {

                //楚洪武修改  去掉tab label截取，改为在FrameTab里面截取
                //if (moduleInfo.displayName.length > 6)
                //var dsname = moduleInfo.displayName.substr(0,5)+'...';
                //else
                var dsname = moduleInfo.displayName;
                var modulePage = tabset.addTabItem(tabName, dsname, true, "FrameTab");
                //modulePage.setAutoScroll(true);
                //modulePage.title = moduleInfo.displayName;
                modulePage.setPath(moduleInfo.urlModule);
                /*
                 //在moduleurl加上UserID、ModuleID、ActionID 用于后台创建dataTable时获取用户个性化定义 --by 楚洪武
                 var path = moduleInfo.urlModule;
                 if(path.indexOf('?')> -1){
                 modulePage.setPath(path+'&UserID='+__LOGIN_INFO.UserID+
                 '&ModuleID='+moduleInfo.moduleID+'&ActionID='+moduleInfo.actionID);
                 }
                 else{
                 modulePage.setPath(path+'?UserID='+__LOGIN_INFO.UserID+
                 '&ModuleID='+moduleInfo.moduleID+'&ActionID='+moduleInfo.actionID);
                 }*/
                modulePage.moduleInfo = moduleInfo;
                modulePage.callObjectInfo = callObjectInfo;
            }
            _IsLoadingModulePage = false;
        }
    }
}

//第一次运行时候加载欢迎页
function addWelcomePage() {
    var record = dsSysModule.find(["ModuleCode"], ["SysWelcome"]);
    if (record) {
        ModuleID = record.getValue("ModuleID");
        setModuleFilterCondition("ModuleID", ModuleID);
        var actionRd = dsSysAction.getFirstRecord();
        if (actionRd) {
            callSysModuleByID(window, null, null, ModuleID, actionRd.getValue("ActionID"));
        }
    }
}

function callSysParamPage(moduleInfo) {
    var tabset = tsSysParam;
    var hasExists = false;

    if (_IsLoadingModulePage)
        return;

    if ((!moduleInfo) || moduleInfo.dialog)
        return;

    var tabParam = "tabSysParam";
    if (!moduleInfo.existParam) {
        tabset.activeTab(0);
        tabset.setTabVisibleByName(tabParam, false);
        //tabset.setTabEnable(tabParam,false);
        return;
    }

    var tab = tabset.getTab(tabParam);
    var iframeHTML = window.frames[moduleInfo.tabParamName];

    tabset.setTabVisibleByName(tabParam, true);
    tabset.activeTabByName(tabParam);

    if (!iframeHTML) {
        iframeHTML = _createElement('<iframe border="0" id="' + moduleInfo.tabParamName + '" type="searchFrame" frameborder="0" scrolling="no" height="100%" width="100%">');
        iframeHTML.src = moduleInfo.urlParam;
        if (browserType == __Browser_IE && browserVersion < 8) {
            tab.getHtmlCont().firstChild.appendChild(iframeHTML);
            //var a=tab.getHtmlCont().firstChild;
            //$(a).append(iframeHTML);
        } else {
            tab.getHtmlCont().children[0].appendChild(iframeHTML);
        }
    }
    else {
        hasExists = true;

    }
    if (browserType == __Browser_IE && browserVersion < 8) {
        var iframeNodes = tab.getHtmlCont().firstChild.childNodes;
    } else {
        var iframeNodes = tab.getHtmlCont().children[0].childNodes;
    }
    for (var i = 0; i < iframeNodes.length; i++) {
        if (iframeNodes.item(i).type == "searchFrame") {
            if (iframeNodes.item(i).id !== moduleInfo.tabParamName) {
                iframeNodes.item(i).style.height = "0px";
            }
            else {
                iframeNodes.item(i).style.height = "100%";
            }
        }
    }
    if (hasExists) {
        //重新调用页方法
        if (typeof(iframeHTML.reCallModule) == "function") {
            iframeHTML.reCallModule();
        }
    }
}

function activeSysParamPage(moduleInfo) {
    if (_IsReCallParamPage)
        return;

    var tabset = tsSysParam;

    if ((!moduleInfo) || moduleInfo.dialog)
        return;

    var tabParam = "tabSysParam";
    if (!moduleInfo.existParam) {
        tabset.activeTab(0);
        tabset.setTabVisibleByName(tabParam, false);
        return;
    }

    var tab = tabset.getTab(tabParam);
    var iframeHTML = window.frames[moduleInfo.tabParamName];

    tabset.setTabVisibleByName(tabParam, true);
    tabset.activeTabByName(tabParam);

    var iframeNodes = tab.getHtmlCont().firstChild.childNodes;
    for (var i = 0; i < iframeNodes.length; i++) {
        if (iframeNodes.item(i).type == "searchFrame") {
            if (iframeNodes.item(i).id !== moduleInfo.tabParamName) {
                iframeNodes.item(i).style.height = "0px";
            }
            else {
                iframeNodes.item(i).style.height = "100%";
            }
        }
    }
}

function closeSysParamPage(tab) {
    var tabsetParam = tsSysParam;
    if (tab && tab.moduleInfo.existParam) {
        var paramTab = tabsetParam.getTab("tabSysParam");
        var iframeNodes = paramTab.getHtmlCont().firstChild.childNodes;

        for (var i = 0; i < iframeNodes.length; i++) {

            if (iframeNodes.item(i).id == tab.moduleInfo.tabParamName) {
                iframeNodes.item(i).parentNode.removeChild(iframeNodes.item(i));
                //iframeNodes.item(i).removeNode(true);
                break;
            }
        }
        if (iframeNodes.length <= 0) {
            tabsetParam.activeTab(0);
            tabsetParam.setTabVisibleByName("tabSysParam", false);
        }
    }
}

function closeModule() {
    tsSysModule.removeTab(tsSysModule.getCurrentTab());
}

function closeModuleAll() {
    while (tsSysModule.getTabCount() > 0) {
        tsSysModule.removeTab(tsSysModule.getCurrentTab());
    }
}

function sysCheckParam(callerDataset, moduleInfo) {
    if (!moduleInfo.needParam)
        return true;
    else if (!callerDataset) {
        smoke.alert("此模块需要相应的参数传递，但是无法获取！\r\n请检查此模块是否挂接错误或者修改模块调用参数");
        return false;
    }
    else if (moduleInfo.paramName.length <= 1)
        return true;

    else if (callerDataset.getVisibleCount() <= 0) {
        return false;
    }
    else {
        var arrs = moduleInfo.paramName.split(",");

        for (var i = 0; i < arrs.length; i++) {
            if ((!callerDataset.getField(arrs[i])) || (!callerDataset.getValue(arrs[i]))) {
                return false;
            }
        }
        return true;
    }
}

function callSysModuleByShortcut(shortcut) {
    if (shortcut.length <= 0) {
        smoke.alert("请输入功能编号！");
        return;
    }
    return callSysModule(null, cmdSysCallModule, null, null, tsSysModule, tsSysParam, shortcut, shortcut, "2", "");
}

function callSysModuleByUI(node) {
    return callSysModule(null, cmdSysCallModule, null, null, tsSysModule, tsSysParam, node.ModuleID, node.ActionID, "0", node.getLabel());
}

//Public CallModule
function callSysModuleByID(callerWindow, callerDataset, callerDBGrid, moduleID, actionID) {
    if (parent.tsOuter) {
        return callSysModule_win8(callerWindow, cmdSysCallModule, callerDataset, callerDBGrid, parent.tsOuter, parent.tsOuter, moduleID, actionID, "0", "");
    }
    else {
        if (parent.tsSysModule && parent.tsSysParam) {//old style
            return callSysModule(callerWindow, cmdSysCallModule, callerDataset, callerDBGrid, tsSysModule, tsSysParam, moduleID, actionID, "0", "");
        }
        else {//new style
            return callSysModule(callerWindow, cmdSysCallModule, callerDataset, callerDBGrid, null, null, moduleID, actionID, "0", "");
        }
    }
}

function callSysModuleByCode(callerWindow, callerDataset, callerDBGrid, moduleCode, actionCode) {
    return callSysModule(callerWindow, cmdSysCallModule, callerDataset, callerDBGrid, tsSysModule, tsSysParam, moduleCode, actionCode, "1", "");
}

function callSysModule(callerWindow, rpcObject, callerDataset, callerDBGrid, tabsetModule, tabsetParam, moduleID, actionID, callType, displayName) {
    if ((moduleID == '-1') || (actionID == '-1') || (moduleID == '0') || (actionID == '0')) {
        return false;
    }

    rpcObject.parameters().setValue("Module", moduleID);
    rpcObject.parameters().setValue("Action", actionID);
    rpcObject.parameters().setValue("CallType", callType);

    //Succeed
    var CallSucceed = rpcObject.execute();
    if (CallSucceed) {
        var Succeed = rpcObject.outParameters().getValue("Succeed");
        if (Succeed == "1") {
            if (rpcObject.outParameters().getValue("CallType") == '1') {
                var funcs = rpcObject.outParameters().getValue("Url1");
                if (funcs == '') {
                    smoke.alert("内部方法调用没有定义！");
                    return false;
                }
                var func = eval("callerWindow." + funcs);
                if (typeof(func) !== "function") {
                    smoke.alert("没有定义方法【" + funcs + "】");
                    return false;
                }

                //调用方法
                eval("callerWindow." + funcs + "()");
                return true;
            }

            //外部方法调用
            var moduleInfo = new Object();

            moduleInfo.moduleID = moduleID;
            moduleInfo.actionID = actionID;
            moduleInfo.moduleCode = rpcObject.outParameters().getValue("ModuleCode");
            moduleInfo.actionCode = rpcObject.outParameters().getValue("ActionCode");
            moduleInfo.moduleName = rpcObject.outParameters().getValue("ModuleName");
            moduleInfo.actionName = rpcObject.outParameters().getValue("ActionName");
            moduleInfo.paramName = rpcObject.outParameters().getValue("ParamName");

            if (displayName.length <= 0)
                moduleInfo.displayName = moduleInfo.moduleName;
            else
                moduleInfo.displayName = displayName;

            //主页面
            if (rpcObject.outParameters().getValue("Url1").length <= 1)
                moduleInfo.urlModule = ""
            else if ((rpcObject.outParameters().getValue("Url1").length > 0) && (rpcObject.outParameters().getValue("Url1").substr(0, 4) == 'http')) {
                //var attParam = "UserCode="+__LOGIN_INFO.UserCode+"&BranCode="+__LOGIN_INFO.BranCode;
                //if 	(rpcObject.outParameters().getValue("Url1").indexOf("?") >= 0)
                moduleInfo.urlModule = rpcObject.outParameters().getValue("Url1"); //+ "&" + attParam;
                //else
                //	moduleInfo.urlModule = rpcObject.outParameters().getValue("Url1"); //+ "?" + attParam;
            }
            else if (rpcObject.outParameters().getValue("Url1").charAt(0) !== '/')
                moduleInfo.urlModule = '/' + rpcObject.outParameters().getValue("Url1");
            else
                moduleInfo.urlModule = rpcObject.outParameters().getValue("Url1");

            //参数页面
            if (rpcObject.outParameters().getValue("Url2").length <= 1)
                moduleInfo.urlParam = ""
            else if ((rpcObject.outParameters().getValue("Url2").length > 0) && (rpcObject.outParameters().getValue("Url2").substr(0, 4) == 'http')) {
                moduleInfo.urlParam = rpcObject.outParameters().getValue("Url2");
            }
            else
                moduleInfo.urlParam = __CONTEXT_PATH + '/' + rpcObject.outParameters().getValue("Url2");

            //窗口模式
            if (rpcObject.outParameters().getValue("IsWindow") == '1')
                moduleInfo.dialog = true;
            else {
                moduleInfo.dialog = false;

                if (tabsetModule.getTabCount() >= 10) {
                    smoke.alert("最多只可以同时打开10个页面！");
                    return false;
                }
            }

            if ((moduleInfo.urlParam.length <= 0) || moduleInfo.dialog)
                moduleInfo.existParam = false;
            else
                moduleInfo.existParam = true;

            if (rpcObject.outParameters().getValue("NeedParam") === '0')
                moduleInfo.needParam = false;
            else {
                moduleInfo.needParam = true;
                //Check CallerData Param
                if (!sysCheckParam(callerDataset, moduleInfo)) {
                    return false;
                }
            }

            //不在检查，每次都传递参数
            moduleInfo.tabModuleName = "tab_module_" + moduleID + "_" + actionID;
            moduleInfo.tabParamName = "tab_param_" + moduleID + "_" + actionID;

            //准备参数
            //Call ParamInfo
            var callObjectInfo = new Object();
            callObjectInfo.ActionID = actionID;
            callObjectInfo.ModuleID = moduleID;
            callObjectInfo.ActionCode = rpcObject.outParameters().getValue("ActionCode");
            callObjectInfo.ActionName = rpcObject.outParameters().getValue("ActionName");
            callObjectInfo.MainObject = window;
            callObjectInfo.ParentObject = callerWindow;
            callObjectInfo.Dataset = callerDataset;
            callObjectInfo.DBGrid = callerDBGrid;
            callObjectInfo.RValue = false;

            //add by 楚洪武 start
            cmdCheckResource.parameters().setValue("url", moduleInfo.urlParam);
            var _result = cmdCheckResource.execute();
            if (_result) {
                var Succeed = cmdCheckResource.outParameters().getValue("Succeed");
                if (Succeed !== "1")//替换路径
                {
                    var tmp_path = moduleInfo.urlParam;
                    tmp_path = tmp_path.replace(__CONTEXT_PATH, '');
                    tmp_path = tmp_path.replace('.jsp', '.vm');
                    tmp_path = tmp_path.replace(/\\/g, '/');
                    tmp_path = tmp_path.replace(/\/\//g, '/');
                    tmp_path = 'sysplatform.do?fileName=/sysplatform' + tmp_path;
                    moduleInfo.urlParam = tmp_path;
                }
            }

            cmdCheckResource.parameters().setValue("url", moduleInfo.urlModule);
            cmdCheckResource.execute();
            _result = cmdCheckResource.execute();
            if (_result) {
                var Succeed = cmdCheckResource.outParameters().getValue("Succeed");
                if (Succeed !== "1")//替换路径
                {
                    var tmp_path = moduleInfo.urlModule;
                    tmp_path = tmp_path.replace('.jsp', '.vm');
                    tmp_path = tmp_path.replace(/\\/g, '/');
                    tmp_path = tmp_path.replace(/\/\//g, '/');
                    tmp_path = 'sysplatform.do?fileName=/sysplatform' + tmp_path;
                    moduleInfo.urlModule = tmp_path;
                }
            }
            //add by 楚洪武 end

            //Open Modal Page
            if (moduleInfo.dialog) {
                //Prepare Modal Window Params
                var modalParamInfo = new Object();
                modalParamInfo.align = rpcObject.outParameters().getValue("AlignPosition");
                modalParamInfo.left = rpcObject.outParameters().getValue("AlignLeft");
                modalParamInfo.right = rpcObject.outParameters().getValue("AlignRight");
                modalParamInfo.top = rpcObject.outParameters().getValue("AlignTop");
                modalParamInfo.bottom = rpcObject.outParameters().getValue("AlignBottom");
                modalParamInfo.width = rpcObject.outParameters().getValue("WindowWidth");
                modalParamInfo.height = rpcObject.outParameters().getValue("WindowHeight");
                modalParamInfo.isModal = rpcObject.outParameters().getValue("IsModal");
                modalParamInfo.resize = rpcObject.outParameters().getValue("CanResize");
                modalParamInfo.scroll = rpcObject.outParameters().getValue("ShowScroll");
                modalParamInfo.status = rpcObject.outParameters().getValue("ShowStatus");
                moduleInfo.modalParam = modalParamInfo;

                addTab(moduleInfo,callObjectInfo);
//                return callSysModulePage(moduleInfo, callObjectInfo);
            }
            else {
            	addTab(moduleInfo,callObjectInfo);
            	
                //Open Normal Page
//                callSysParamPage(moduleInfo);
                //返回调用结果
//                return callSysModulePage(moduleInfo, callObjectInfo);
            }
        }
        else {
            var ErrMes = rpcObject.outParameters().getValue("ErrMes");
            smoke.alert(ErrMes);
        }
    }
}

//0、加载界面
function sysLoadUI() {
    //if (__uiStyle == '1'){
    //	menuOutlook.parentNode.removeChild(menuOutlook);
    sysLoadTreeUI();
    //} else {
    //	menuTree.parentNode.removeChild(menuTree);
    //}
}

/*
 //1、加载OutLook风格
 function sysLoadOutlookUI()
 {
 if (__uiStyle == '1') return;

 var dataset = dsSysUI;
 dataset.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getUserUIInfo");
 dataset.parameters().setValue("NodeID", 0, "int");
 dataset.flushData();

 olbSysUI.getGroup("groupFav").setIcon(__CONTEXT_PATH+"/exhibit/sysimgs/fav-alt4.png");
 olbSysUI.getGroup("groupFav").setLabel("收藏夹");

 var i = 1;
 while (!dataset.isLast())
 {
 var __obg = olbSysUI.getGroup("group"+i);

 if ((parseInt(dataset.getValue("IsDIR")) === 1) && (dataset.getValue("NodeBMP").length <= 5))
 dataset.setValue("NodeBMP", "exhibit/sysimgs/fileclose3.gif");
 __obg.setIcon(__CONTEXT_PATH+"/"+dataset.getValue("NodeBMP"));
 __obg.setTag(dataset.getString("NodeCode"));
 __obg.setLabel(dataset.getString("NodeName"));
 eval("trGroup"+i+".NodeID="+ dataset.getValue("NodeID"));

 dataset.moveNext();
 i++;
 }
 while(olbSysUI.getGroupCount()>dataset.getVisibleCount()+1){
 i = olbSysUI.getGroupCount()-1;
 olbSysUI.removeGroup("group"+i);
 }

 EventManager.addKingfisherEvent(olbSysUI, "afterChange",
 function(lookbar,oldGroup,newGroup) {
 var tr = kingfisher.feather.getControl('tr' + newGroup._name.substr(0,1).toUpperCase() + newGroup._name.substr(1,newGroup._name.length-1));
 muSysFav.setPopupContainer(tr.id);
 if (!(tr._beforeExpandNode)){
 if (tr.id == 'trGroupFav')
 EventManager.addKingfisherEvent
 (tr, "beforeExpandNode",
 function(tree,node)
 {
 sysLoadOutlookFavData(tree, node);
 }
 );
 else
 EventManager.addKingfisherEvent
 (tr, "beforeExpandNode",
 function(tree,node)
 {
 sysLoadOutlookData(tree, node);
 }
 );
 tr.clearAllNodes();
 }
 if  (!(tr._onClick))
 EventManager.addKingfisherEvent
 (tr, "onClick",
 function(tree,node)
 {
 callSysModuleByUI(node);
 }
 );
 }
 );

 }
 //2、加载OutLookTree
 function sysLoadOutlookData(tree, node)
 {
 var dataset = dsSysUI;

 if (node.children().getLength()>0) return;
 var ParentNodeID;
 if (node.getLevel() == 0)
 ParentNodeID = tree.NodeID;
 else
 ParentNodeID = node.NodeID;

 dataset.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getUserUIInfo");
 dataset.parameters().setValue("NodeID", ParentNodeID, "int");

 dataset.flushData();
 while (!dataset.isLast())
 {
 var label = dataset.getString("NodeName");
 var newNode = tree.addNode(node, label);
 newNode.isFav = 0;
 newNode.setHasChild(parseInt(dataset.getValue("IsDIR"),10) > 0);
 newNode.NodeID = dataset.getValue("NodeID");
 newNode.setTag(dataset.getString("NodeCode"));
 //DIR
 if (parseInt(dataset.getValue("IsDIR")) === 1)
 {
 newNode.ModuleID = '-1';
 newNode.ActionID = '-1';
 if (dataset.getValue("NodeBMP").length <= 5)
 dataset.setValue("NodeBMP", "exhibit/sysimgs/fileclose3.gif");
 newNode.setIcon(__CONTEXT_PATH+"/"+dataset.getValue("NodeBMP"));
 newNode.setExpandedIcon(__CONTEXT_PATH+"/"+dataset.getValue("NodeBMP"));
 }
 //Node
 else
 {
 newNode.ModuleID = dataset.getValue("ModuleID");
 newNode.ActionID = dataset.getValue("ActionID");
 newNode.setIcon(__CONTEXT_PATH+"/"+dataset.getValue("NodeBMP"));
 newNode.setExpandedIcon(__CONTEXT_PATH+"/"+dataset.getValue("NodeBMP"));
 if (dataset.getValue("ActionNo").length > 0)
 newNode.setHint('编号:'+dataset.getValue("ActionNo"));
 }
 dataset.moveNext();

 }
 }

 //3、加载OutLook收藏数据
 function sysLoadOutlookFavData(tree, node)
 {
 if (node.children().getLength()>0) return;
 var dataset = dsSysFav;
 dataset.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getUserFavoriteInfo");
 dataset.flushData();
 while (!dataset.isLast())
 {
 var label = dataset.getString("NodeName");
 var newNode = tree.addNode(node, label);
 newNode.setHasChild(false);
 newNode.isFav = 1;
 newNode.NodeID = dataset.getValue("NodeID");
 newNode.setTag(dataset.getString("NodeCode"));
 newNode.ModuleID = dataset.getValue("ModuleID");
 newNode.ActionID = dataset.getValue("ActionID");
 newNode.setIcon(__CONTEXT_PATH+"/"+dataset.getValue("NodeBMP"));
 newNode.setExpandedIcon(__CONTEXT_PATH+"/"+dataset.getValue("NodeBMP"));
 dataset.moveNext();
 }
 }
 */
//3、加载Tree型导航
function sysLoadTreeUI() {
    EventManager.addKingfisherEvent
    (trSysUI, "beforeExpandNode",
        function (tree, node) {
            sysLoadTreeData(tree, node);
        }
    );
    EventManager.addKingfisherEvent
    (trSysUI, "onClick",
        function (tree, node) {
            callSysModuleByUI(node);
        }
    );
    //muSysFav.setPopupContainer(trSysUI.id);
    trSysUI.clearAllNodes();
}

//4、加载TreeData
function sysLoadTreeData(tree, node) {
    var dataset = dsSysUI;

    if (node.children().getLength() > 0) return;
    var ParentNodeID;
    if (node.getLevel() == 0) {
        ParentNodeID = 0;
        //如果是第一层，则先增加Fav收藏
        sysLoadTreeFavData(tree, node);
    }
    else
        ParentNodeID = node.NodeID;
    if(node.isFav==1)	return;

    dataset.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getUserUIInfo");
    dataset.parameters().setValue("NodeID", ParentNodeID, "int");

    dataset.flushData();
    while (!dataset.isLast()) {
        //if ((parseInt(dataset.getValue("IsDIR")) === 1) || (!dataset.getValue("ActionNo")) || (dataset.getValue("ActionNo").length <=0))
        var label = dataset.getString("NodeName");
        //else
        //	 var label = dataset.getString("NodeName") + '-' + dataset.getValue("ActionNo");

        var newNode = tree.addNode(node, label);
        newNode.isFav = 0;
        newNode.setHasChild(parseInt(dataset.getValue("IsDIR"), 10) > 0);
        newNode.NodeID = dataset.getValue("NodeID");
        newNode.setTag(dataset.getString("NodeCode"));
        //DIR
        if (parseInt(dataset.getValue("IsDIR")) === 1) {
            newNode.ModuleID = '-1';
            newNode.ActionID = '-1';
            if (dataset.getValue("NodeBMP").length <= 5)
                dataset.setValue("NodeBMP", "exhibit/sysimgs/fileclose3.gif");
            newNode.setIcon(__CONTEXT_PATH + "/" + dataset.getValue("NodeBMP"));
            if(dataset.getValue("NodeLBMP") && dataset.getValue("NodeLBMP").trim() != "")
            	newNode._licon=__CONTEXT_PATH + "/" + dataset.getValue("NodeLBMP")
            newNode.setExpandedIcon(__CONTEXT_PATH + "/" + dataset.getValue("NodeBMP"));
        }
        //Node
        else {
            newNode.ModuleID = dataset.getValue("ModuleID");
            newNode.ActionID = dataset.getValue("ActionID");
            newNode.setIcon(__CONTEXT_PATH + "/" + dataset.getValue("NodeBMP"));
            if(dataset.getValue("NodeLBMP") && dataset.getValue("NodeLBMP").trim() != "")
            	newNode._licon=__CONTEXT_PATH + "/" + dataset.getValue("NodeLBMP")
            newNode.setExpandedIcon(__CONTEXT_PATH + "/" + dataset.getValue("NodeBMP"));
            if (dataset.getValue("ActionNo").length > 0)
                newNode.setHint('编号:' + dataset.getValue("ActionNo"));
        }
        dataset.moveNext();

    }
}

//5、加载树形的收藏数据
function sysLoadTreeFavData(tree, topNode) {
    var dataset = dsSysFav;
    dataset.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getUserFavoriteInfo");
    dataset.flushData();

    var node = tree.addNode(topNode, '收藏夹');
    node.setHasChild(dataset.getVisibleCount() > 0);
    node.NodeID = 0;
    node.setTag("FAV");
    node.isFav = 1;

    node.ModuleID = '-1';
    node.ActionID = '-1';
    node.setIcon(__CONTEXT_PATH + "/exhibit/sysimgs/fav-alt4.png");
    node.setExpandedIcon(__CONTEXT_PATH + "/exhibit/sysimgs/fav-alt4.png");

    while (!dataset.isLast()) {
        var label = dataset.getString("NodeName");
        var newNode = tree.addNode(node, label);
        newNode.setHasChild(false);
        newNode.isFav = 1;
        newNode.NodeID = dataset.getValue("NodeID");
        newNode.setTag(dataset.getString("NodeCode"));
        newNode.ModuleID = dataset.getValue("ModuleID");
        newNode.ActionID = dataset.getValue("ActionID");
        newNode.setIcon(__CONTEXT_PATH + "/" + dataset.getValue("NodeBMP"));
        if(dataset.getValue("NodeLBMP") && dataset.getValue("NodeLBMP").trim() != "")
        	newNode._licon=__CONTEXT_PATH + "/" + dataset.getValue("NodeLBMP")
        newNode.setExpandedIcon(__CONTEXT_PATH + "/" + dataset.getValue("NodeBMP"));
        dataset.moveNext();
    }
}

function sysCheckMessage() {
    dsSysMessage.flushData();
    if (dsSysMessage.getVisibleCount() <= 0) return;

    var cnt = parseInt(dsSysMessage.getValue("CNT"), 10);
    if (cnt > 0) {
//        mesNumber.innerText = cnt;
//        mesBack.style.visibility = "visible";
    }
    else {
//        mesNumber.innerText = '';
//        mesBack.style.visibility = "hidden";
    }
    setTimeout("sysCheckMessage()", 1000 * 60 * 5);
}

function callSysMessage() {
	window.open("sysplatform.do?fileName=/sysplatform/sysinfo/SysInfoQuery.vm", "", "dialogWidth:765px;dialogHeight:500px;center:yes;resizable:no;scroll:no;status:no");
    sysCheckMessage();
    return false;
}

//所有的初始化入口
function loadSysData() {
    //if (opener)
    //{
    //	opener.close();
    //	opener = false;
    //}
    //tsSysParam.setTabVisibleByName("tabSysParam", false);

    //模块数据集
    dsSysModule.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getUserModuleInfo");
    dsSysModule.flushData();

    //动作数据集
    dsSysAction.setLoadDataAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=get&method=getUserActionInfo");
    dsSysAction.flushData();

    setTimeout("addWelcomePage()", 500);

    loadSysMenuData();

    sysLoadUI();
    setTimeout("sysCheckMessage()", 1000);
}

var g_SysChangePWD_ModuleID = 0;
var g_SysChangePWD_ActionID = 0;
var g_SysReLogin_ModuleID = 0;
var g_SysReLogin_ActionID = 0;

//Load SysMenuActionInfo
function loadSysMenuData() {
    var ModuleID = 0;
    var ActionID = 0;

    var record = dsSysModule.find(["ModuleCode"], ["SysPublicManager"]);
    if (record) {
        ModuleID = record.getValue("ModuleID");
        setModuleFilterCondition("ModuleID", ModuleID);
        var actionRd = dsSysAction.getFirstRecord();
        while (actionRd) {
            if (actionRd.getValue("ActionCode") == "AC_RELOGIN") {
                g_SysReLogin_ModuleID = ModuleID;
                g_SysReLogin_ActionID = actionRd.getValue("ActionID");
            }
            else if (actionRd.getValue("ActionCode") == "AC_CHGPWD") {
                g_SysChangePWD_ModuleID = ModuleID;
                g_SysChangePWD_ActionID = actionRd.getValue("ActionID");
            }
            actionRd = actionRd.getNextRecord();
        }
    }
}

function callSysReLogin() {
    if ((g_SysReLogin_ModuleID > 0) && (g_SysReLogin_ActionID > 0))
        callSysModuleByID(null, null, null, g_SysReLogin_ModuleID, g_SysReLogin_ActionID);
}

function callSysChgPwd() {
    if ((g_SysChangePWD_ModuleID > 0) && (g_SysChangePWD_ActionID > 0))
        callSysModuleByID(null, null, null, g_SysChangePWD_ModuleID, g_SysChangePWD_ActionID);
}

function callSysClose() {
    if (window.confirm("是否退出" + window.name + "？")) {
        //if (opener)	opener = null;
        window.close();
    }
}

