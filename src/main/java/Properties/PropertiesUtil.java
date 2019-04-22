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
     * 初始化加载配置文件
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
     * 判断配置文件是否改动
     * @return returnValue ：true:改动过 ，false:没有改动过
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
     * 根据key获取配置文件中的值
     * @param key key值
     * @return 返回value
     */
    private static String getPropertyValue(String key) {

        if (prop == null || isPropertiesModified()) {
            init();
        }
        String value = prop.get(key).toString();
        return value;
    }

    /**
     * 获取配置文件中所有的value值
     * @return 所有配置的value值
     */
    private static String getPropertyAllValue() {

        if (prop == null || isPropertiesModified()) {
            init();
        }
        Collection<Object> values = prop.values();
        return values.toString();
    }

    /**
     * 验证登录的手机号是否为测试手机号
     * @param phoneNo 登录手机号
     * @return true: 是测试账户， false:不是测试账户
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
