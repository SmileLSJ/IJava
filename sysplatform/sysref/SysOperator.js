
var cmdSysCallEncryptData = buildKingfisherElement("RPCCommand",null,"cmdSysCallEncryptData");
cmdSysCallEncryptData.setAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=set&method=getEncryptData");
cmdSysCallEncryptData.setShowLoadingTip(false);

var cmdSysGetBalanceEncryptData = buildKingfisherElement("RPCCommand",null,"cmdSysGetBalanceEncryptData");
cmdSysGetBalanceEncryptData.setAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=set&method=getBalanceEncryptData");
cmdSysGetBalanceEncryptData.setShowLoadingTip(false);

var cmdSysSetBalanceEncryptData = buildKingfisherElement("RPCCommand",null,"cmdSysSetBalanceEncryptData");
cmdSysSetBalanceEncryptData.setAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=set&method=setBalanceEncryptData");
cmdSysSetBalanceEncryptData.setShowLoadingTip(false);

var cmdsysGetDocCode = buildKingfisherElement("RPCCommand",null,"cmdsysGetDocCode");
cmdsysGetDocCode.setAction("/retrieve.do?className=session.sys.SysManagerDAO&ferry=set&method=sysGetDocCode");
cmdsysGetDocCode.setShowLoadingTip(false);

//getEnctyptData
function sysGetEncryptData(sql,showTip)
{
	var rpcObject = cmdSysCallEncryptData;
	rpcObject.parameters().setValue("EncryptData", sql);
	var CallSucceed = rpcObject.execute();	
	if (CallSucceed)
	{
		var Succeed = rpcObject.outParameters().getValue("Succeed");
		if (Succeed == "1")
		{
			return rpcObject.outParameters().getValue("EncryptData_Str")
		}
		else
		{
			smoke.alert(rpcObject.outParameters().getValue("ErrMes"));
			return false;
		}
	}
	else
		return false;
}

function sysGetBalanceEncryptData(sql,showTip)
{
	var rpcObject = cmdSysGetBalanceEncryptData;
	rpcObject.parameters().setValue("BalanceEncrypt", sql);
	var CallSucceed = rpcObject.execute();	
	if (CallSucceed)
	{
		var Succeed = rpcObject.outParameters().getValue("Succeed");
		if (Succeed == "1")
		{
			return rpcObject.outParameters().getValue("Balance_Str")
		}
		else
		{
			smoke.alert(rpcObject.outParameters().getValue("ErrMes"));
			return false;
		}
	}
	else
		return false;
}

function sysSetBalanceEncryptData(sql,showTip)
{
	var rpcObject = cmdSysSetBalanceEncryptData;
	rpcObject.parameters().setValue("Balance", sql);
	var CallSucceed = rpcObject.execute();	
	if (CallSucceed)
	{
		var Succeed = rpcObject.outParameters().getValue("Succeed");
		if (Succeed == "1")
		{
			return rpcObject.outParameters().getValue("Encrypt_Str")
		}
		else
		{
			smoke.alert(rpcObject.outParameters().getValue("ErrMes"));
			return false;
		}
	}
	else
		return false;
}

//Execute SQL Update Command

function sysGetDocCode(type)
{
	
	var rpcObject = cmdsysGetDocCode;
	rpcObject.parameters().setValue("docType", type);
	var CallSucceed = rpcObject.execute();	
	if (CallSucceed)
	{
		var Succeed = rpcObject.outParameters().getValue("Succeed");
		if (Succeed == "1")
		{
			return rpcObject.outParameters().getValue("strNewCode")
		}
		else
		{
			smoke.alert(rpcObject.outParameters().getValue("ErrMes"));
			return false;
		}
	}
	else
		return false;
	
	/*
	
	cmdSysCallProcedure.parameters().clear();
	if (__LOGIN_INFO.DBType == "1") 
		cmdSysCallProcedure.parameters().setValue("ProcName", "p_Sys_DocCode", "string");
	else
		cmdSysCallProcedure.parameters().setValue("ProcName", "p_Sys_DocCode", "string");	
	cmdSysCallProcedure.parameters().setValue("MCID", mcid, "int");
	cmdSysCallProcedure.parameters().setValue("DocType", type, "string");
	cmdSysCallProcedure.parameters().setValue("out_DocCode", "","string");
		
	//Succeed
	var CallSucceed = cmdSysCallProcedure.execute();	
	if (CallSucceed)
	{
		var Succeed = cmdSysCallProcedure.outParameters().getValue("Succeed");
		if (Succeed == "1")
		{
			return cmdSysCallProcedure.outParameters().getValue("out_DocCode");
		}
		else
			smoke.alert(cmdSysCallProcedure.outParameters().getValue("ErrMes"));
	}
	else
	{
		smoke.alert("��ȡ���ݺ������!");
	}*/
}

function sysTrimDataset(dataset)
{
	var record = dataset.getFirstRecord();
	while(record)
	{
		for(var i=0; i < dataset.getFieldCount(); i++)
		{
			if (dataset.getField(i).getDataTypeName() == 'string')
			{
				//smoke.alert(dataset.getField(i).getName() + ":" + record.getString(i).trim());
				//smoke.alert(record.getString(i).trim().length);
				if (record.getValue(i))
				{
					try
					{
						record.setValue(dataset.getField(i).getName(), record.getString(i).trim());
						record.post();
					}
					catch(e)
					{
					}
				}
			}
		}
		record = record.getNextRecord();
	}
}

function sysGetPageInfo(dataset)
{
	return "��<b>&nbsp;<font color='red'>" + 	dataset.getPageIndex() +
	"</font>&nbsp;</b>ҳ&nbsp;/&nbsp;��<b>&nbsp;<font color='red'>" + dataset.getPageCount() +
	"</font>&nbsp;</b>ҳ����<b>&nbsp;<font color='red'>" + dataset.getPossibleRecordCount() +
	"</font>&nbsp;</b>�� ÿҳ<b>&nbsp;<font color='red'>" + dataset.getPageSize() +
	"</font>&nbsp;</b>��&nbsp;&nbsp;";
}

//End

//�ڿɱ༭�ı������������һ����ɫ*
function sysSetColumnHeader(tb){
	if (tb == null) return;
	
	var f = null;
	for(var i = 0; i < tb.getColumnCount(); i++){
		if (tb.getColumn(i).isReadOnly() == false) {
			f = tb.getDataset().getField(tb.getColumn(i).getField());
			if ((f) && (f.isReadOnly() == false)){
				addKingfisherEvent(tb.getColumn(i), "onHeaderRefresh", 
					function onHeaderRefresh(column,label,labelText){
					   label.innerHTML="<font color='blue'\>*</font\>"+labelText;
					   return false;
					}
				);
			}
		}
	}
}



function sysShowStatusImage(cell, record) { 
	var filename = "";
	var hint = "";
	if (record!=null) {
		if (record.getValue("STA") == "1") {
			filename = 'statusex3.png';
			hint = "¼��";
		} else if (record.getValue("STA") == "2") {
			filename = 'statusex6.png';
			hint = "ȷ��";
		} else if (record.getValue("STA") == "3") {
			filename = 'statusex7.png';
			hint = "����";
		} else if (record.getValue("STA") == "5") {
			filename = 'statusex4.png';
			hint = "���";
		} else if (record.getValue("STA") == "6") {
			filename = 'statusex1.png';
			hint = "����";
		} else if (record.getValue("STA") == "7") {
			filename = 'statusex5.png';
			hint = "��Ч";
		} else if (record.getValue("STA") == "8") {
			filename = 'statusex8.png';
			hint = "��ֹ";
		} else if (record.getValue("STA") == "9") {
			filename = 'statusex8.png';
			hint = "����";
		}	
		
		cell.innerHTML = '<div style="display: table-cell;vertical-align:middle;height:32px"><img style="vertical-align:middle;" src="' + __CONTEXT_PATH +'/exhibit/sysimgs/' + filename+'" width="12" height="12" border="0" alt="'+hint+'"></div>';

	} 
	return false;
  }

/*
 * �ַ�����ʽΪyyyy-MM-dd
 * isLastTime�ڲ�ѯ��������ʱ��������ʱ��������ڣ���ʱҪ��Ϊtrue��
 * �����ܲ鵱��00:00:00֮ǰ�ģ������ȷ������ģ��˺���������*/
function sysStrToDate(str, isLastTime) {
	var newDate;
	var arys = new Array();
	arys = str.split('-');
	if (isLastTime == false) 
		newDate = new Date(arys[0], arys[1] - 1, arys[2]);
	else 
		newDate = new Date(arys[0], arys[1] - 1, arys[2], 23, 59, 59);
	return newDate;
} 

//��ȡ���ݹ����Ķ�������
function getCallActionDatasetValue(dataset, fieldName, fieldType)
{
	var result = "";
	var v_L = "";
	var v_R = "";
	
	if (fieldType == "string")
	{
		v_L = "'";
		v_R = "'";
	};
	
	var records = dataset.getSelectRecords();
	//����
	if (records.size()>0)
	{
		var itr = records.iterator();
		while(itr.hasNext())
		{
			var record = itr.next();
			result += v_L + record.getValue(fieldName) + v_R + ",";
		}
		//ɾ�����Ķ���
		result = result.substr(0,result.length - 1);
	}
	//����
	else
	{
		result = v_L + dataset.getValue(fieldName) + v_R;
	}
	
	return result;
}

