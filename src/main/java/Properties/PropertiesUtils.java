package Properties;

import java.io.*;
import java.util.Properties;

/**
 * Created by Gxy on 2019/4/3.
 */
public class PropertiesUtils {

    private static Long lastModified = 0L;

    private static String PROPERTIES_PATH = "db.properties";

    private static String path;

    private Properties properties = new Properties();

    static {
        path = PropertiesUtils.class.getClassLoader().getResource(PROPERTIES_PATH).getPath();
    }

    public Object getValue(String key) throws Exception {
        System.out.println("lastModified="+lastModified+",currentModified="+isModified());
        if(isModified() || properties.isEmpty()){
            refresh();
        }
        return properties.get(key);
    }


    private boolean isModified() throws Exception {
        File file = new File(PropertiesUtils.class.getClassLoader().getResource(PROPERTIES_PATH).getPath());
        if(file.lastModified()>lastModified) {
            lastModified = file.lastModified();
            return true;
        }
        return false;
    }


    private void refresh() throws Exception {
        properties.load(new FileInputStream(PropertiesUtils.class.getClassLoader().getResource(PROPERTIES_PATH).getPath()));
    }
}
