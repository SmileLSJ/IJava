package Collections;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Collections;
import java.util.HashMap;

/**
 * Created by Gxy on 2019/3/27.
 */
public class SerlizedDemo {

    public static void main(String args[]) throws Exception {

        HashMap<String,String> m = new HashMap<>(3);
        m.put("1","1");
        m.put("2","2");
        m.put("3","3");

        System.out.println("1.ԭʼ����\n"+m);

        ObjectOutputStream o = new ObjectOutputStream(new FileOutputStream("rectangle"));
        // ����д�����
        o.writeObject(m);
        o.close();

        // ������ȡ����
        ObjectInputStream in = new ObjectInputStream(new FileInputStream("rectangle"));
        HashMap<String, String> stringStringHashMap = (HashMap<String, String>) in.readObject();
        System.out.println("2.�����л���Ķ���\n"+stringStringHashMap.size());
        in.close();
    }
}
