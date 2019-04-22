importPackage(com.keem.commons.kit.lang);
importPackage(com.keem.kingfisher.beak.sql);
importPackage(com.keem.kingfisher.beak.jdbc);
importPackage(com.keem.kingfisher.beak.utils);
importPackage(com.keem.kingfisher.feather.data);
importPackage(com.keem.kingfisher.feather.data.load);
importPackage(com.license);
importPackage(java.lang);

function process() {
	var feedback = new Feedback();
	feedback.setDefaultMessage(false);
	feedback.setSucceed(false);

	var ll = new License();
	var li = ll.getLicense();

	feedback.addOutParameter("BranCount", li[1]);
	feedback.addOutParameter("BranUserCount", li[3]);
	feedback.addOutParameter("HqUserCount", li[2]);
	feedback.addOutParameter("TotalUserCount", Integer.parseInt(li[1].trim())*Integer.parseInt(li[3].trim())+Integer.parseInt(li[2].trim()));
	feedback.addOutParameter("ValidDate", li[4]);
	feedback.addOutParameter("MCName", li[5]);
	
	feedback.addOutParameter("JavaVer", System.getProperty("java.version") + " (VM：" + System.getProperty("java.vm.version") + ")");
	feedback.addOutParameter("OS", System.getProperty("os.name") + " ("
			+ System.getProperty("os.arch") + ") "
			+ System.getProperty("os.version"));
	
	feedback.addOutParameter("FreeMem", "已使用"
			+ parseInt(Runtime.getRuntime().totalMemory() / 1024 / 1024, 10)
			+ "M   剩余"
			+ parseInt(Runtime.getRuntime().freeMemory() / 1024 / 1024, 10)
			+ "M   最大剩余"
			+ parseInt(Runtime.getRuntime().maxMemory() / 1024 / 1024, 10)
			+ "M");
	
	feedback.setSucceed(true);
	return feedback;
}

process();