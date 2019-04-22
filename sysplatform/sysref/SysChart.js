//“˝»ÎChart JS
document.write("<script type='text/javascript' src='" + __CONTEXT_PATH + "/exhibit/sysref/chart/FusionCharts.js'></sc"+"ript>");
			
//BarÕº
function bar2DChart(target, width, height, caption, dataset, xAxisName, yAxisName)
{
	this.target = target;
	this.width = width;
	this.height = height;
	this.caption = caption;
	this.dataset = dataset;
	this.xAxisName = xAxisName;
	this.yAxisName = yAxisName;
	
	this.chart = new FusionCharts(__CONTEXT_PATH + "/exhibit/sysref/chart/Bar2D.swf", "BarChart"+target.id, width, height, "0", "0");
	this.xmlHeader = "<chart bgColor='#F1F4FA' bgAlpha='100' baseFont='Arial' baseFontSize ='12' showBorder = '0' " +
   			"borderThickness='1' canvasBorderColor='#83B6DC' showAboutMenuItem='0'  " +
   			" caption='" + caption + "' xAxisName='" + dataset.getField(xAxisName).getLabel() + 
   			"' yAxisName='" + dataset.getField(yAxisName).getLabel() + 
   			"' showValues='1' decimals='2' formatNumberScale='0' lineColor='FCB541' " +
			"chartRightMargin='20' chartTopMargin='2' chartBottomMargin='2' xAxisNamePadding='2' yAxisNamePadding='2' captionPadding='2'>";
	
	this.flush = function()
	{
		xmlDetail = "";
	   	rd = this.dataset.getFirstRecord();
		while (rd)
		{
			xmlDetail += "<set label='" +  rd.getValue(this.xAxisName) + "' value='" + rd.getValue(this.yAxisName) + 
				"' toolText='" + rd.getValue(this.xAxisName) + "£∫" + rd.getValue(this.yAxisName) + "'/>";
			rd = rd.getNextRecord();
		}
		xmlDetail += "<styles><definition>"+
			   "<style name='myToolTipFont' type='font' font='Arial' size='12' color='005555'/>"+
			   "<style name='myCaptionFont' type='font' font='Arial' size='16' color='000000' bold='1'/>"+
			   "</definition>"+
			   "<application>"+
			   "<apply toObject='ToolTip' styles='myToolTipFont' />"+
			   "<apply toObject='Caption' styles='myCaptionFont' />"+
			   "</application></styles>";
		xmlDetail +="</chart>";
		this.chart.setDataXML(this.xmlHeader+xmlDetail);		   
	}
	
	this.flush();
	this.chart.render(target);
}

//PieÕº
function pie2DChart(target, width, height, caption, dataset, xAxisName, yAxisName)
{
	this.target = target;
	this.width = width;
	this.height = height;
	this.caption = caption;
	this.dataset = dataset;
	this.xAxisName = xAxisName;
	this.yAxisName = yAxisName;
	
	this.chart = new FusionCharts(__CONTEXT_PATH + "/exhibit/sysref/chart/Pie2D.swf", "PieChart"+target.id, width, height, "0", "0");
	this.xmlHeader = "<chart showPercentValues = '1' showPercentInToolTip = '1' showValues = '1' showBorder = '0' canvasbgColor='#F1F4FA' bgColor='#F1F4FA' " +
   			" bgAlpha='100' baseFont='Arial' baseFontSize ='12' decimals='2' formatNumberScale='0'  showAboutMenuItem='0' " +
   			" caption='" + caption + "' xAxisName='" + dataset.getField(xAxisName).getLabel() + 
   			"' yAxisName='" + dataset.getField(yAxisName).getLabel() + 
   			"' chartRightMargin='20' chartTopMargin='2' chartBottomMargin='2' xAxisNamePadding='2' yAxisNamePadding='2' captionPadding='2'>";
	
	this.flush = function()
	{
		xmlDetail = "";
	   	rd = this.dataset.getFirstRecord();
		while (rd)
		{
			xmlDetail += "<set label='" +  rd.getValue(this.xAxisName) + "' value='" + rd.getValue(this.yAxisName) + 
				"' toolText='" + rd.getValue(this.xAxisName) + "£∫" + rd.getValue(this.yAxisName) + "'/>";
			rd = rd.getNextRecord();
		}
		xmlDetail += "<styles><definition>"+
			   "<style name='myToolTipFont' type='font' font='Arial' size='12' color='005555'/>"+
			   "<style name='myCaptionFont' type='font' font='Arial' size='16' color='000000' bold='1'/>"+
			   "</definition>"+
			   "<application>"+
			   "<apply toObject='ToolTip' styles='myToolTipFont' />"+
			   "<apply toObject='Caption' styles='myCaptionFont' />"+
			   "</application></styles>";
		xmlDetail +="</chart>";
		this.chart.setDataXML(this.xmlHeader+xmlDetail);		   
	}
	
	this.flush();
	this.chart.render(target);
}

//Column2DÕº
function column2DChart(target, width, height, caption, dataset, xAxisName, yAxisName)
{
	this.target = target;
	this.width = width;
	this.height = height;
	this.caption = caption;
	this.dataset = dataset;
	this.xAxisName = xAxisName;
	this.yAxisName = yAxisName;
	
	this.chart = new FusionCharts(__CONTEXT_PATH + "/exhibit/sysref/chart/Column2D.swf", "ColumnChart"+target.id, width, height, "0", "0");
	this.xmlHeader = "<chart bgColor='#F1F4FA' bgAlpha='100' baseFont='Arial' baseFontSize ='12' showBorder = '0' " +
   			"borderThickness='1' canvasBorderColor='#83B6DC' showAboutMenuItem='0'  " +
   			" caption='" + caption + "' xAxisName='" + dataset.getField(xAxisName).getLabel() + 
   			"' yAxisName='" + dataset.getField(yAxisName).getLabel() + 
   			"' showValues='1' decimals='2' formatNumberScale='0' " +
   			"chartRightMargin='20' chartTopMargin='2' chartBottomMargin='2' xAxisNamePadding='2' yAxisNamePadding='2' captionPadding='2'>";
	
	this.flush = function()
	{
		xmlDetail = "";
	   	rd = this.dataset.getFirstRecord();
		while (rd)
		{
			xmlDetail += "<set label='" +  rd.getValue(this.xAxisName) + "' value='" + rd.getValue(this.yAxisName) + 
				"' toolText='" + rd.getValue(this.xAxisName) + "£∫" + rd.getValue(this.yAxisName) + "'/>";
			rd = rd.getNextRecord();
		}
		xmlDetail += "<styles><definition>"+
			   "<style name='myToolTipFont' type='font' font='Arial' size='12' color='005555'/>"+
			   "<style name='myCaptionFont' type='font' font='Arial' size='16' color='000000' bold='1'/>"+
			   "</definition>"+
			   "<application>"+
			   "<apply toObject='ToolTip' styles='myToolTipFont' />"+
			   "<apply toObject='Caption' styles='myCaptionFont' />"+
			   "</application></styles>";
		xmlDetail +="</chart>";
		this.chart.setDataXML(this.xmlHeader+xmlDetail);		   
	}
	
	this.flush();
	this.chart.render(target);
}

//MultiLineÕº
function msLineChart(target, width, height, caption, dataset, xAxisName, yAxisValues)
{
	this.target = target;
	this.width = width;
	this.height = height;
	this.caption = caption;
	this.dataset = dataset;
	this.xAxisName = xAxisName;
	this.yAxisValues = yAxisValues;
	
	this.chart = new FusionCharts(__CONTEXT_PATH + "/exhibit/sysref/chart/MSLine.swf", "MSLineChart"+target.id, width, height, "0", "0");
	this.xmlHeader = "<chart showAboutMenuItem='0' connectNullData='1' lineDashGap='6' canvasPadding='30' lineThickness='2' " +
   			" bgColor='#F1F4FA' bgAlpha='100' baseFont='Arial' baseFontSize ='12' showBorder = '0' borderThickness='1' canvasBorderColor='#83B6DC' " +
   			" caption='" + caption + "' xAxisName='" + dataset.getField(xAxisName).getLabel() + 
   			"' yAxisName='' showValues='1' formatNumberScale='0' " +
   			"chartRightMargin='20' chartTopMargin='2' chartBottomMargin='2' xAxisNamePadding='2' yAxisNamePadding='2' captionPadding='2'>";
	
	this.flush = function()
	{
		xmlDetail = "";
		
		xmlDetail += "<categories>";
		rd = this.dataset.getFirstRecord();
		while (rd)
		{
			xmlDetail += "<category label='" + rd.getValue(this.xAxisName) + "'/>";
			rd = rd.getNextRecord();
		}
		xmlDetail += "</categories>";
		
		for (i=0;i<this.yAxisValues.length;i++)
		{
			if (i == 0)
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"' color='F1683C' >";
			else if (i == 1)
			xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"' color='2AD62A' >";
			else if (i == 2)
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"' color='0372AB' >";
			else
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"'>";
			
			rd = this.dataset.getFirstRecord();
			while (rd)
			{
				xmlDetail += "<set value='" + rd.getValue(this.yAxisValues[i]) + "'/>"; 
				rd = rd.getNextRecord();
			}
			xmlDetail += "</dataset>";
		}
		
		xmlDetail += "<styles><definition>"+
			   "<style name='myToolTipFont' type='font' font='Arial' size='12' color='005555'/>"+
			   "<style name='myCaptionFont' type='font' font='Arial' size='16' color='000000' bold='1'/>"+
			   "</definition>"+
			   "<application>"+
			   "<apply toObject='ToolTip' styles='myToolTipFont' />"+
			   "<apply toObject='Caption' styles='myCaptionFont' />"+
			   "</application></styles>";
		xmlDetail +="</chart>";
		this.chart.setDataXML(this.xmlHeader+xmlDetail);		   
	}
	
	this.flush();
	this.chart.render(target);
}

//Stack2DÕº
function stackColumn2DChart(target, width, height, caption, dataset, xAxisName, yAxisValues)
{
	this.target = target;
	this.width = width;
	this.height = height;
	this.caption = caption;
	this.dataset = dataset;
	this.xAxisName = xAxisName;
	this.yAxisValues = yAxisValues;
	
	this.chart = new FusionCharts(__CONTEXT_PATH + "/exhibit/sysref/chart/StackedColumn2D.swf", "StackedColumn2D"+target.id, width, height, "0", "0");
	this.xmlHeader = "<chart showAboutMenuItem='0' connectNullData='1' lineDashGap='6' canvasPadding='30' lineThickness='2' " +
   			" bgColor='#F1F4FA' bgAlpha='100' baseFont='Arial' baseFontSize ='12' showBorder = '0' borderThickness='1' canvasBorderColor='#83B6DC' " +
   			" caption='" + caption + "' xAxisName='" + dataset.getField(xAxisName).getLabel() + 
   			"' yAxisName='' showValues='1' decimals='2' formatNumberScale='0' " +
   			"chartRightMargin='20' chartTopMargin='2' chartBottomMargin='2' xAxisNamePadding='2' yAxisNamePadding='2' captionPadding='2'>";
	
	this.flush = function()
	{
		xmlDetail = "";
		
		xmlDetail += "<categories>";
		rd = this.dataset.getFirstRecord();
		while (rd)
		{
			xmlDetail += "<category label='" + rd.getValue(this.xAxisName) + "'/>";
			rd = rd.getNextRecord();
		}
		xmlDetail += "</categories>";
		
		for (i=0;i<this.yAxisValues.length;i++)
		{
			if (i == 0)
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"' color='F1683C' >";
			else if (i == 1)
			xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"' color='2AD62A' >";
			else if (i == 2)
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"' color='0372AB' >";
			else
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"'>";
			
			//xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"'>";
			rd = this.dataset.getFirstRecord();
			while (rd)
			{
				xmlDetail += "<set value='" + rd.getValue(this.yAxisValues[i]) + "'/>"; 
				rd = rd.getNextRecord();
			}
			xmlDetail += "</dataset>";
		}
		
		xmlDetail += "<styles><definition>"+
			   "<style name='myToolTipFont' type='font' font='Arial' size='12' color='005555'/>"+
			   "<style name='myCaptionFont' type='font' font='Arial' size='16' color='000000' bold='1'/>"+
			   "</definition>"+
			   "<application>"+
			   "<apply toObject='ToolTip' styles='myToolTipFont' />"+
			   "<apply toObject='Caption' styles='myCaptionFont' />"+
			   "</application></styles>";
		xmlDetail +="</chart>";
		this.chart.setDataXML(this.xmlHeader+xmlDetail);		   
	}
	
	this.flush();
	this.chart.render(target);
}

//Stack2DÕº
function msCombiDY2DChart(target, width, height, caption, dataset, xAxisName, yAxisValues)
{
	this.target = target;
	this.width = width;
	this.height = height;
	this.caption = caption;
	this.dataset = dataset;
	this.xAxisName = xAxisName;
	this.yAxisValues = yAxisValues;
	
	this.chart = new FusionCharts(__CONTEXT_PATH + "/exhibit/sysref/chart/MSCombiDY2D.swf", "MSCombiDY2D"+target.id, width, height, "0", "0");
	this.xmlHeader = "<chart showAboutMenuItem='0' connectNullData='1' lineDashGap='6' canvasPadding='30' lineThickness='2' " +
   			" bgColor='#F1F4FA' bgAlpha='100' baseFont='Arial' baseFontSize ='12' showBorder = '0' borderThickness='1' canvasBorderColor='#83B6DC' " +
   			" caption='" + caption + "' xAxisName='" + dataset.getField(xAxisName).getLabel() + 
   			"' yAxisName='' showValues='1' decimals='2' formatNumberScale='0' " + 
   			"chartRightMargin='20' chartTopMargin='2' chartBottomMargin='2' xAxisNamePadding='2' yAxisNamePadding='2' captionPadding='2'>";
	
	this.flush = function()
	{
		xmlDetail = "";
		
		xmlDetail += "<categories>";
		rd = this.dataset.getFirstRecord();
		while (rd)
		{
			xmlDetail += "<category label='" + rd.getValue(this.xAxisName) + "'/>";
			rd = rd.getNextRecord();
		}
		xmlDetail += "</categories>";
		
		for (i=0;i<this.yAxisValues.length;i++)
		{
			if (i == 1)
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"' parentYAxis='S'>";
			else
				xmlDetail += "<dataset seriesName='" + this.dataset.getField(this.yAxisValues[i]).getLabel()+"'>";
			
			rd = this.dataset.getFirstRecord();
			while (rd)
			{
				xmlDetail += "<set value='" + rd.getValue(this.yAxisValues[i]) + "'/>"; 
				rd = rd.getNextRecord();
			}
			xmlDetail += "</dataset>";
			if (i == 1)
				break;
		}
		
		xmlDetail += "<styles><definition>"+
			   "<style name='myToolTipFont' type='font' font='Arial' size='12' color='005555'/>"+
			   "<style name='myCaptionFont' type='font' font='Arial' size='16' color='000000' bold='1'/>"+
			   "</definition>"+
			   "<application>"+
			   "<apply toObject='ToolTip' styles='myToolTipFont' />"+
			   "<apply toObject='Caption' styles='myCaptionFont' />"+
			   "</application></styles>";
		xmlDetail +="</chart>";
		this.chart.setDataXML(this.xmlHeader+xmlDetail);		   
	}
	
	this.flush();
	this.chart.render(target);
}

