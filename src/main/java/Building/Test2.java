package Building;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

/**
 * Created by Gxy on 2019/3/4.
 */
public class Test2 {

    public static void main(String[] args) {


        String str = "0";
        System.out.println(str);
        System.out.println(str);

        String[][] a = {
                {"������1","1��","����1","����1"},
                {"������1","1��","����1","����2"},

                {"������1","1��","����2","����1"},
                {"������1","1��","����2","����2"},

                {"������1","2��","����1","����1"},
                {"������1","2��","����1","����2"},

                {"������1","2��","����2","����1"},
                {"������1","2��","����2","����2"},

                {"������1","2��","����3","����1"},
                {"������1","2��","����3","����2"},

                {"������1","2��","����4","����1"},
                {"������1","2��","����4","����2"},

                {"������2","1��","����1","����1"},
                {"������2","1��","����1","����2"},

                {"������2","1��","����2","����1"},
                {"������2","1��","����2","����2"}
        };



        for (int i=0;i<a.length;i++){
            String[] vals = a[i];

            String buildName = vals[0];
            String floorName = vals[1];
            String deptName = vals[2];
            String roomName =vals[3];

            DataAction.handleData(buildName,floorName,deptName,roomName);
        }
    }


    public static String print(){
        System.out.println("11111111111111");
        return  null;
    }
}
