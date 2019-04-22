//*****************************************
//	系统动态菜单
//	乔武军设计      
//	2013.03.01  
//*****************************************

//保存上次动态菜单的内容
var g_LastMenuContext = "";
var g_ReportPrintName = "sysGetPrintReports";
var g_ExportName = "sysGetExports";

function isAcrobatPluginInstall() {
	// 如果是firefox浏览器
	if (browserType == __Browser_OTHER){
		if (navigator.plugins && navigator.plugins.length) {
			for (x = 0; x < navigator.plugins.length; x++) {
				if (navigator.plugins[x].name == 'Adobe Acrobat')
					return true;
			}
		}
	}
	// 下面代码都是处理IE浏览器的情况
	else if (browserType == __Browser_IE) {
		for (x = 2; x < 10; x++) {
			try {
				oAcro = eval("new ActiveXObject('PDF.PdfCtrl." + x + "');");
				if (oAcro) {
					return true;
				}
			} catch (e) {
			}
		}
		try {
			oAcro4 = new ActiveXObject('PDF.PdfCtrl.1');
			if (oAcro4)
				return true;
		} catch (e) {
		}

		try {
			oAcro7 = new ActiveXObject('AcroPDF.PDF.1');
			if (oAcro7)
				return true;
		} catch (e) {
		}
	}
	else if (browserType == __Browser_CHROME) 
		return true;
}

function downloadPDFToolsFile(url) {
	var elemIF = document.createElement("iframe");
	elemIF.src = url;
	elemIF.style.display = "none";
	document.body.appendChild(elemIF);
}
/*
 * function isFoxitPluginInstall(){
 * 
 * try { oFoxit=new ActiveXObject('FoxitReader.Document'); if (oFoxit) return
 * true; } catch(e) {} }
 */

function setToolbarTitle(tb, lbl) {
	var toolbarTitle = tb.getBlankPanel();
	if (toolbarTitle != null) {
		toolbarTitle.align = "right";
		toolbarTitle.innerHTML = lbl;
	}
}

// --------------------------------------------
// 动态菜单
// --------------------------------------------
// 菜单执行
function executeSysDynamicMenu(item) {

	if ((item.ModuleID && item.ActionID && (parseInt(item.ModuleID) > 0) && (parseInt(item.ActionID) > 0))
			|| item.isReport) {
		// 检查是否报表
		if (item.isReport) {
			try {
				var func = eval(item.getName());
			} catch (e) {
			}
			if (typeof (func) !== "function") {
				smoke.alert("没有定义方法【" + item.getName() + "】");
				return false;
			}

//			if (!(isAcrobatPluginInstall())) {
//				alert("请安装PDF打印工具！");
//				downloadPDFToolsFile(__CONTEXT_PATH + "/tools/PDFReader.exe");
//				return false;
//			}

			// 调用方法
			eval(item.getName() + "()");
		} else
			item.mainObj.callSysModuleByID(window, item.DataSet, item.DBGrid,
					parseInt(item.ModuleID), parseInt(item.ActionID));
	}
}

// 准备动态菜单
function prepareSysDynamicMenu(mainObj, menuObj, datasetModule, datasetAction) {
	// Local Var Define
	var ModuleID;
	var ActionID;
	var ModuleName;
	var ModuleCode;
	var ActionCode;
	var ActionName;
	var ModuleBMP;
	var ActionBMP;
	var ActionIsDIV;
	var ActionVisibled;
	var Dataset;
	var DBGrid;
	var context;

	var popupElement = menuObj.getPopupElement();

	if (!popupElement)
		return;

	var moduleInfo;

	if ((popupElement && popupElement.getId() !== menuObj.getTag())
			|| (popupElement.getContext() !== g_LastMenuContext)) {
		context = popupElement.getContext();
		g_LastMenuContext = context;

		Dataset = popupElement.getDataset();
		DBGrid = popupElement;

		// Delete Last Bind Menu
		menuObj.getTopItem().getItems().clear();

		// add public menu item
		var items = new Array();

		// Add Globe Menu et.Print Export
		var record = datasetModule.find( [ "ModuleCode" ],
				[ "SysGlobeManager" ]);
		if (record) {
			ModuleID = record.getValue("ModuleID");
			ModuleCode = record.getValue("ModuleCode");
			mainObj.setModuleFilterCondition("ModuleID", ModuleID);
			var actionRd = datasetAction.getFirstRecord();
			var count = 0;
			while (actionRd) {
				ActionVisibled = parseInt(actionRd.getValue("Visibled"))
				if (ActionVisibled === 1) {
					count++;
					ActionCode = actionRd.getValue("ActionCode");
					ActionIsDIV = parseInt(actionRd.getValue("IsDIV"));
					ActionName = actionRd.getValue("ActionName");
					ActionID = actionRd.getValue("ActionID");
					ActionBMP = actionRd.getValue("BMP");

					if (ActionIsDIV !== 1) {
						var item = new MenuItem(ModuleCode + "_" + ActionCode,
								ActionName);
						if (ActionBMP.length > 0)
							item.setIcon(__CONTEXT_PATH + '/' + ActionBMP);
						menuObj.getTopItem().addItem(item);

						// 打印和预览
						if ((ActionCode === 'AC_PRINT')) {
							// 如果没有报表，则屏蔽打印按钮
							try {
								var func = eval(g_ReportPrintName + "()");

								for ( var i = 0; i < func.Count; i++) {
									var subitem = new MenuItem(
											func.Reports[i].Name,
											func.Reports[i].Label);
									item.addItem(subitem);
									subitem
											.setIcon(__CONTEXT_PATH + '/exhibit/sysimgs/report7.gif');
									subitem.ModuleID = 0;
									subitem.ActionID = 0;
									subitem.isReport = true;
								}
							} catch (e) {
							}
							if (typeof (func) !== "object") {
								item.setEnabled(false);
							}
							item.ModuleID = 0;
							item.ActionID = 0;
						} else {
							item.ModuleID = ModuleID;
							item.ActionID = ActionID;
							item.ActionCode = ActionCode;
							item.DataSet = Dataset;
							item.DBGrid = DBGrid;
							item.mainObj = mainObj;

							try {
								DBGrid.getTreeColumn(1);
								item.setEnabled(false);
							} catch (e) {
							}
						}
					} else {
						var menubreak = new MenuItem("__" + ModuleCode + "_"
								+ ActionCode + "_" + count);
						menubreak.setType("MenuBreak");
						menuObj.getTopItem().addItem(menubreak);
					}
				}
				actionRd = actionRd.getNextRecord();
			}
			if ((count > 0) && (context) && (context.length > 0)) {
				var break1 = new MenuItem("__level1_break");
				break1.setType("MenuBreak");
				menuObj.getTopItem().addItem(break1);
			}
		}

		// var context=popupElement.getContext();
		if (context) {
			var arrs = context.split(",");
			for ( var i = 0; i < arrs.length; i++) {
				var record = datasetModule.find( [ "Context" ], [ arrs[i] ]);
				if (record) {
					// Make First Menu
					ModuleCode = record.getValue("ModuleCode");
					ModuleName = record.getValue("ModuleName");
					ModuleID = record.getValue("ModuleID");
					ModuleBMP = record.getValue("BMP");

					var item = new MenuItem(ModuleCode, ModuleName);
					// item.ModuleID = ModuleID;
					// item.ActionID = -1;
					// item.DataSet = Dataset;
					if (ModuleBMP.length > 0)
						item.setIcon(__CONTEXT_PATH + '/' + ModuleBMP);

					// Make Children Menu
					// Set Filter Param
					mainObj.setModuleFilterCondition("ModuleID", ModuleID);
					var actionRd = datasetAction.getFirstRecord();
					var count = 0;

					while (actionRd) {
						ActionVisibled = parseInt(actionRd.getValue("Visibled"))
						if (ActionVisibled === 1) {
							count++;
							ActionCode = actionRd.getValue("ActionCode");
							ActionIsDIV = parseInt(actionRd.getValue("IsDIV"));
							ActionName = actionRd.getValue("ActionName");
							ActionID = actionRd.getValue("ActionID");
							ActionBMP = actionRd.getValue("BMP");
							ActionID = actionRd.getValue("ActionID");

							if (ActionIsDIV !== 1) {
								var subitem = new MenuItem(ModuleCode + "_"
										+ ActionCode, ActionName);
								if (ActionBMP.length > 0)
									subitem.setIcon(__CONTEXT_PATH + '/'
											+ ActionBMP);
								item.addItem(subitem);
								subitem.ModuleID = ModuleID;
								subitem.ActionID = ActionID;
								subitem.ActionCode = ActionCode;
								subitem.DataSet = Dataset;
								subitem.DBGrid = DBGrid;
								subitem.mainObj = mainObj;
							} else {
								var temp = item.getItems().values();
								if (temp.length > 0
										&& temp[temp.length - 1].getType() !== "MenuBreak") {
									var menubreak = new MenuItem("__"
											+ ModuleCode + "_" + ActionCode
											+ "_" + count);
									menubreak.setType("MenuBreak");
									item.addItem(menubreak);
								}
							}
						}
						actionRd = actionRd.getNextRecord();
					}

					// Delete Last DIV
					var temp = item.getItems().values();
					if (temp.length > 0
							&& temp[temp.length - 1].getType() === "MenuBreak")
						temp[temp.length - 1].remove();
					if (temp.length > 0)
						menuObj.getTopItem().addItem(item);
				}
			}

			var temp = menuObj.getTopItem().getItems().values();
			if (temp.length > 0
					&& temp[temp.length - 1].getType() === "MenuBreak")
				temp[temp.length - 1].remove();
		}
		menuObj.setTag(popupElement.getId());
	}
}

// End
function prepareSysDynamicToolbar(mainObj, toolbar, datasetModule,
		datasetAction) {
	// Local Var Define
	var ModuleID;
	var ActionID;
	var ModuleName;
	var ModuleCode;
	var ActionCode;
	var ActionName;
	var ModuleBMP;
	var ActionBMP;
	var ActionIsDIV;
	var ActionVisibled;
	var DBGrid;
	var context = toolbar.getContext();

	var moduleInfo;

	var subbar = new SubToolBar("SysGlobeManager");
	var groupIndex = 1;
	var toolgroup = new ToolGroup("group" + groupIndex);

	// Add Globe Menu et.Print Export
	var record = datasetModule.find( [ "ModuleCode" ], [ "SysGlobeManager" ]);
	if (record) {
		ModuleID = record.getValue("ModuleID");
		ModuleCode = record.getValue("ModuleCode");
		mainObj.setModuleFilterCondition("ModuleID", ModuleID);
		var actionRd = datasetAction.getFirstRecord();
		var count = 0;
		while (actionRd) {
			ActionVisibled = parseInt(actionRd.getValue("Visibled"))
			if (ActionVisibled === 1) {
				count++;
				ActionCode = actionRd.getValue("ActionCode");
				ActionIsDIV = parseInt(actionRd.getValue("IsDIV"));
				ActionName = actionRd.getValue("ActionName");
				ActionID = actionRd.getValue("ActionID");
				ActionBMP = actionRd.getValue("BMP");

				if (ActionIsDIV !== 1) {
					var item = new Tool(ActionCode, ActionName, null);
					item.setShowLabel(true);
					if (ActionBMP.length > 0)
						item.setIcon(__CONTEXT_PATH + '/' + ActionBMP);
					toolgroup.addTool(item);

					// 打印和预览
					if ((ActionCode === 'AC_PRINT')) {
						try {
							var func = eval(g_ReportPrintName + "()");
							menuSysDynamicPrint.getTopItem().getItems().clear();
							for ( var i = 0; i < func.Count; i++) {
								var subitem = new MenuItem(
										func.Reports[i].Name,
										func.Reports[i].Label);
								menuSysDynamicPrint.getTopItem().addItem(
										subitem);
								subitem
										.setIcon(__CONTEXT_PATH + '/exhibit/sysimgs/report7.gif');
								subitem.ModuleID = 0;
								subitem.ActionID = 0;
								subitem.isReport = true;
							}
							item.setMenu(menuSysDynamicPrint);
						} catch (e) {
						}
						if (typeof (func) !== "object") {
							item.setDisabled(true);
						}
						item.ModuleID = 0;
						item.ActionID = 0;
					}
					else if ((ActionCode === 'AC_EXP')) {
						try {
							var func = eval(g_ExportName + "()");
							
							if (func.Count <= 1){
								item.ModuleID = ModuleID;
								item.ActionID = ActionID;
								item.mainObj = mainObj;
								item.DataSet = eval(func.Exports[0].Name);
								item.isReport = false;
							}
							else {
								menuSysDynamicExport.getTopItem().getItems().clear();
								for ( var i = 0; i < func.Count; i++) {
									var subitem = new MenuItem(
											func.Exports[i].Name,
											func.Exports[i].Label);
									menuSysDynamicExport.getTopItem().addItem(
											subitem);
									subitem
											.setIcon(__CONTEXT_PATH + '/exhibit/sysimgs/export1.gif');
									subitem.ModuleID = ModuleID;
									subitem.ActionID = ActionID;
									subitem.DataSet = eval(func.Exports[i].Name);
									subitem.mainObj = mainObj;
									subitem.isReport = false;
								}
								item.setMenu(menuSysDynamicExport);
								item.ModuleID = 0;
								item.ActionID = 0;
							}
						} catch (e) {
							item.ModuleID = ModuleID;
							item.ActionID = ActionID;
							item.mainObj = mainObj;
							if (toolbar.Relating) {
								var relating = toolbar.Relating
										.get("SysGlobeManager");
								if (relating) {
									item.DataSet = relating.Dataset;
									item.DBGrid = relating.DBGrid;

									try {
										relating.DBGrid.getTreeColumn(1);
										item.setDisabled(true);
									} catch (e) {
									}
								}
							}
						}
					} 
					else {
						item.ModuleID = ModuleID;
						item.ActionID = ActionID;
						item.mainObj = mainObj;
						if (toolbar.Relating) {
							var relating = toolbar.Relating
									.get("SysGlobeManager");
							if (relating) {
								item.DataSet = relating.Dataset;
								item.DBGrid = relating.DBGrid;

								try {
									relating.DBGrid.getTreeColumn(1);
									item.setDisabled(true);
								} catch (e) {
								}
								if(typeof(disableExportBtn)=="function"){
									item.setDisabled(disableExportBtn());
								}
							}
						}
					}
				} else {
					if (toolgroup.getToolCount() > 0)
						subbar.addToolGroup(toolgroup);
					groupIndex++;
					toolgroup = new ToolGroup("group" + groupIndex);
				}
			}
			actionRd = actionRd.getNextRecord();
		}

		if ((count > 0) && (context) && (context.length > 0)) {
			if (toolgroup.getToolCount() > 0)
				subbar.addToolGroup(toolgroup);
			groupIndex++;
			toolgroup = new ToolGroup("group" + groupIndex);
		}

		// var context=popupElement.getContext();
		if (context) {
			var arrs = context.split(",");
			var len = arrs.length;
			for ( var i = 0; i < len; i++) {
				var record = datasetModule.find( [ "Context" ], [ arrs[i] ]);
				if (record) {
					// alert(subbar.getToolGroupCount());
					if (subbar.getToolGroupCount() > 0)
						toolbar.addSubBar(subbar);
					subbar = new SubToolBar(arrs[i]);
					subbar.setInline(true);

					// Make First Menu
					ModuleCode = record.getValue("ModuleCode");
					ModuleName = record.getValue("ModuleName");
					ModuleID = record.getValue("ModuleID");
					ModuleBMP = record.getValue("BMP");

					// Make Children Menu
					// Set Filter Param
					mainObj.setModuleFilterCondition("ModuleID", ModuleID);
					var actionRd = datasetAction.getFirstRecord();
					var count = 0;

					while (actionRd) {
						ActionVisibled = parseInt(actionRd.getValue("Visibled"))
						if (ActionVisibled === 1) {
							count++;
							ActionCode = actionRd.getValue("ActionCode");
							ActionIsDIV = parseInt(actionRd.getValue("IsDIV"));
							ActionName = actionRd.getValue("ActionName");
							ActionID = actionRd.getValue("ActionID");
							ActionBMP = actionRd.getValue("BMP");
							ActionID = actionRd.getValue("ActionID");

							if (ActionIsDIV !== 1) {
								var subitem = new Tool(ActionCode, ActionName
										+ (len > 1 ? ' (' + ModuleName + ')'
												: ''), null);
								subitem.setShowLabel(true);
								if (ActionBMP.length > 0) {
									subitem.setIcon(__CONTEXT_PATH + '/'
											+ ActionBMP);
									toolgroup.addTool(subitem);
								}
								subitem.ModuleID = ModuleID;
								subitem.ActionID = ActionID;
								subitem.mainObj = mainObj;
								if (toolbar.Relating) {
									var relating = toolbar.Relating
											.get(arrs[i]);
									if (relating) {
										subitem.DataSet = relating.Dataset;
										subitem.DBGrid = relating.DBGrid;
									}
								}
							} else {
								if (toolgroup.getToolCount() > 0)
									subbar.addToolGroup(toolgroup);
								groupIndex++;
								toolgroup = new ToolGroup("group" + groupIndex);
							}
						}
						actionRd = actionRd.getNextRecord();
					}

					if (toolgroup.getToolCount() > 0)
						subbar.addToolGroup(toolgroup);
					groupIndex++;
					toolgroup = new ToolGroup("group" + groupIndex);
				}
			}
		}
		if (toolgroup.getToolCount() > 0)
			subbar.addToolGroup(toolgroup);
		if (subbar.getToolGroupCount() > 0)
			toolbar.addSubBar(subbar);
	}
}
// End
