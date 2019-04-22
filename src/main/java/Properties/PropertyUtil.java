package Properties;

import org.junit.Assert;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

/**
 * Created by Gxy on 2019/4/3.
 */
public class PropertyUtil {


    /**
     *�ù���֧��properties�޸��ȼ���
     *loadFile(String fileUrl)
     *getProperty(String key, String defaultValue)
     *��������ͬ���ģ����ܲ���
     * @author acer
     * @version C10 2016��5��16��
     */

        /**
         * Ĭ�ϼ��ص�properties�ļ�
         */
        private static final String[] DEFAULT_PROPERTIES_URL = {"db.properties"};

        private static final int LOAD_INTERVAL_SECONDS = 20;

        /**
         * properties ����property������
         */
        private static Properties properties = new Properties();

        static
        {
            for (String url : DEFAULT_PROPERTIES_URL)
            {
                loadFile(url);
            }
            monitor();
        }

        private static synchronized void loadFile(String fileUrl)
        {
            // class.getResourceAsStream·������Ի�������ڱ�class����λ�á�Ҳ�����þ��Ե���/conf/business/system.properties
            // InputStream is = PropertiesUtil.class.getResourceAsStream(fileUrl);
            // �˴�ע��ClassLoader.getResourceAsStreamֻ���������classpath�ľ���·��,���Ҳ����� / ��ͷ
            InputStream is = PropertiesUtil.class.getClassLoader().getResourceAsStream(fileUrl);

            try
            {
                properties.load(is);
            }
            catch (IOException e)
            {
                System.out.println("IOException when load" + fileUrl+e);
            }
            finally
            {
                try
                {
                    is.close();
                }
                catch (IOException e)
                {
                    System.out.println("IOException when close inputStream " +fileUrl+ e);
                }
            }
        }

        /**
         * �ػ��߳�ÿ��LOAD_INTERVAL_SECONDS��ȥ����һ��properties
         */
        private static void monitor()
        {
            Thread t = new Thread(new Runnable()
            {
                @Override
                public void run()
                {
                    System.out.println("�ػ��߳�ִ��");
                    try
                    {
                        System.out.println("˯��");
                        TimeUnit.SECONDS.sleep(LOAD_INTERVAL_SECONDS);
                        System.out.println("����");
                        for (String url : DEFAULT_PROPERTIES_URL)
                        {
                            loadFile(url);
                        }
                    }
                    catch (InterruptedException e)
                    {
                        System.out.println("properties-monitor-thread Interrupted"+ e);
                    }
                }

            }, "properties-monitor-thread");
            // ����Ϊ�ػ��̺߳��û��߳̽��������߳������ж�
            t.setDaemon(true);
            t.start();
        }

        public static String getProperty(String key)
        {
            return getProperty(key, null);
        }

        public static synchronized String getProperty(String key, String defaultValue)
        {
            return properties.getProperty(key) == null ? defaultValue : properties.getProperty(key);
        }

    public static void main(String[] args) {
        while(true){
            System.out.println(getProperty("driver"));
            try {
                Thread.currentThread().sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
