package Building;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Gxy on 2019/3/4.
 */
public class Test {

    public static void main(String[] args) {

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


        HashMap<String,Building> buildMap = new HashMap<>();

        for (int i=0;i<a.length;i++){

            String[] b = a[i];

            String buildName = b[0];
            String floorName = b[1];
            String deptName = b[2];
            String roomName = b[3];

            Building building;
            if(buildMap.keySet().contains(buildName)){
                building = buildMap.get(buildName);
            }else{
                building =  new Building(buildName);
                buildMap.put(buildName,building);
            }
            building
                    .addFloor(buildName,floorName,deptName)
                    .addDept(buildName,floorName,deptName,roomName)
                    .addRoom(buildName,floorName,deptName,roomName);

        }
    }
}
