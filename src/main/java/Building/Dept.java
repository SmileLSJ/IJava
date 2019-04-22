package Building;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Gxy on 2019/3/4.
 */
public class Dept {

    private boolean isInsert = false;

    private String deptID;

    private String deptName;

    private HashMap<String,Room> roomMap = new HashMap<String, Room>();


    public Dept(String deptName) {
        this.deptName = deptName;
        deptID = UUIDUtils.getUUID();
    }

    public Room addRoom(String roomName){
        Room r;
        /*if(roomMap.containsKey(roomName)){
            r=roomMap.get(roomName);
        }else{*/
            r=new Room(roomName);
            roomMap.put(roomName,r);
        return r;
    }

    public Room addRoom(String buildName,String floorName,String deptName,String roomName){
        Room r;
        /*if(roomMap.containsKey(roomName)){
            r=roomMap.get(roomName);
        }else{*/
        r=new Room(roomName);
        roomMap.put(roomName,r);
        return r;
    }

    public void insertDB(String buildId,String floorId){
        if(isInsert){
            //System.out.println(deptName+"�Ѿ��������ݿ�");
        }else{
            isInsert=true;
            //���Ų������ݿ�
            System.out.println("���š�"+deptName+"���������ݿ�");
        }

        insertRoom(buildId,floorId);
    }


    public void insertRoom(String buildId,String floorId){
        Collection<Room> values = roomMap.values();
        for (Room r:values) {
            r.insertDB(buildId,floorId,deptID);
        }
    }
}
