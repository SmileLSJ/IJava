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
