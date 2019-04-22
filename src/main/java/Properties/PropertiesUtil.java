package Properties;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.Properties;

/**
 * Created by Gxy on 2019/4/3.
 */
public class PropertiesUtil {

    private static final String CONFIG_NAME = "db.properties";

    private static Properties prop;

    private static Long lastModified = 0L;

    /**
     * ��ʼ�����������ļ�
     */
    private static void init() {
        prop = new Properties();
        String filepath = PropertiesUtil.class.getClassLoader().getResource(CONFIG_NAME).getPath();
        FileInputStream fis = null;
        try {
            fis = new FileInputStream(filepath);
            prop.load(fis);
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try {
                if(fis != null){
                    fis.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * �ж������ļ��Ƿ�Ķ�
     * @return returnValue ��true:�Ķ��� ��false:û�иĶ���
     */
    private static boolean isPropertiesModified() {
        boolean returnValue = false;
        File file = new File(PropertiesUtil.class.getClassLoader().getResource(CONFIG_NAME).getPath());
        if (file.lastModified() > lastModified) {
            lastModified=file.lastModified();
            returnValue = true;
        }
        return returnValue;
    }

    /**
     * ����key��ȡ�����ļ��е�ֵ
     * @param key keyֵ
     * @return ����value
     */
    private static String getPropertyValue(String key) {

        if (prop == null || isPropertiesModified()) {
            init();
        }
        String value = prop.get(key).toString();
        return value;
    }

    /**
     * ��ȡ�����ļ������е�valueֵ
     * @return �������õ�valueֵ
     */
    private static String getPropertyAllValue() {

        if (prop == null || isPropertiesModified()) {
            init();
        }
        Collection<Object> values = prop.values();
        return values.toString();
    }

    /**
     * ��֤��¼���ֻ����Ƿ�Ϊ�����ֻ���
     * @param phoneNo ��¼�ֻ���
     * @return true: �ǲ����˻��� false:���ǲ����˻�
     */
    public static boolean validateLoginNo(String phoneNo){
        boolean flag = false;
        String allValue = getPropertyAllValue();
        if(allValue.contains(phoneNo)){
            flag = true;
        }
        return flag;
    }

    public static void main(String[] args) {
        while (true){
            try {
                System.out.println(getPropertyValue("driver"));

                Thread.sleep(2000);
                System.out.println("validateLoginNo :  " +  validateLoginNo("123456789"));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        }

    }
}
