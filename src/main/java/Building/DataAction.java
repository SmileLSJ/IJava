package Building;

import java.util.HashMap;

/**
 * Created by Gxy on 2019/3/5.
 */
public class DataAction {

    private static final HashMap<String,String> buildMap = new HashMap<>();
    private static final HashMap<String,String> floorMap = new HashMap<>();
    private static final HashMap<String,String> deptMap = new HashMap<>();
    private static final HashMap<String,String> roomMap = new HashMap<>();

    /**
     * 处理数据
     * @param buildName
     * @param floorName
     * @param deptName
     * @param roomName
     */
    public static void handleData(String buildName,String floorName,String deptName,String roomName){
        String bKey = buildName;
        String fKey = bKey+floorName;
        String dKey = fKey+deptName;
        String rKey = dKey+roomName;

        //不存在建筑物信息，说明没有进行操作
        if(!buildMap.containsKey(bKey)){
            //数据库根据mcid和buildName去查询
            String buildCode = insertBuilding(buildName);
            buildMap.put(bKey,buildCode);
        }

        if(!floorMap.containsKey(fKey)){
            String floorCode = insertFloor(buildMap.get(bKey),floorName);
            floorMap.put(fKey,floorCode);
        }

        if(!deptMap.containsKey(dKey)){
            String deptCode = insertDept(buildMap.get(bKey),floorMap.get(fKey),deptName);
            deptMap.put(dKey,deptCode);
        }

        if(!roomMap.containsKey(rKey)){
            String roomCode = insertRoom(buildMap.get(bKey),floorMap.get(fKey),deptMap.get(dKey),roomName);
            roomMap.put(rKey,roomCode);
        }
    }


    /**
     * 插入房间信息
     * @return 房间编码
     */
    private static String insertRoom(String buildCode, String floorCode, String deptCode, String roomName) {
        System.out.println("                房间【"+roomName+"】插入数据库");
        return null;
    }

    /**
     * 插入部门信息
     * @return 部门编码
     */
    private static String insertDept(String buildCode, String floorCode, String deptName) {
        System.out.println("           部门【"+deptName+"】插入数据库");
        return null;
    }

    /**
     * 插入楼层信息
     * @return 楼层编码
     */
    private static String insertFloor(String buildCode, String floorName) {
        System.out.println("       楼层【"+floorName+"】插入数据库");
        return null;
    }

    /**
     * 插入建筑物信息
     * @return 建筑物编码
     */
    private static String insertBuilding(String buildName) {
        System.out.println("  建筑物【"+buildName+"】插入数据库");
        String sql = "";
        String code = "";

        //数据库查询
        //查询到code
        if(true){
            code="11111";
        }else{
            code = UUIDUtils.getUUID();
            sql = "insert table ....";
            System.out.println("建筑物插入数据库"+sql);
        }
        return code;
    }
}
