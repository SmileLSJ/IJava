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
	feedback.addOutParameter("Succeed", "0");

	var ll = new License();
	ErrMes = ll.checkLicense();
	if (ErrMes.length() > 0) {
		return new BusinessException(ErrMes);
	}
	feedback.addOutParameter("Succeed", "1");
	feedback.setSucceed(true);
	return feedback;
}

process();