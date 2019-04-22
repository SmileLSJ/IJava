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
                {"建筑物1","1层","部门1","房间1"},
                {"建筑物1","1层","部门1","房间2"},

                {"建筑物1","1层","部门2","房间1"},
                {"建筑物1","1层","部门2","房间2"},

                {"建筑物1","2层","部门1","房间1"},
                {"建筑物1","2层","部门1","房间2"},

                {"建筑物1","2层","部门2","房间1"},
                {"建筑物1","2层","部门2","房间2"},

                {"建筑物1","2层","部门3","房间1"},
                {"建筑物1","2层","部门3","房间2"},

                {"建筑物1","2层","部门4","房间1"},
                {"建筑物1","2层","部门4","房间2"},

                {"建筑物2","1层","部门1","房间1"},
                {"建筑物2","1层","部门1","房间2"},

                {"建筑物2","1层","部门2","房间1"},
                {"建筑物2","1层","部门2","房间2"}
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
