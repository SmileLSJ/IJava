package Properties;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

/**
 * Created by Gxy on 2019/4/3.
 */
public class Test {

    @org.junit.Test
    public void test(){

        while (true) {
            try {
                PropertiesUtils propertiesUtils = new PropertiesUtils();

                Properties p = new Properties();
                FileInputStream stream = new FileInputStream(
                        new File(Test.class.getClassLoader().getResource("").getPath())+"/db.properties");
                p.load(stream);

                Object driver = p.get("driver");
                p.clear();
                System.out.println(driver);
                stream.close();
                Thread.currentThread().sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
