package Building;

import java.util.List;

/**
 * Created by Gxy on 2019/3/4.
 */
public class Room {

    private String roomId;

    private String roomName;

    private boolean isInsert;



    public Room(String roomName) {
        this.roomName = roomName;
        roomId = UUIDUtils.getUUID();
    }

    public void insertDB(String buildId,String floorId,String deptId){

        if(isInsert){
            //System.out.println(floorName+"�Ѿ��������ݿ�");
        }else{
            isInsert=true;
            //����������ݿ�
            System.out.println("------���䡾"+roomName+"���������ݿ�");
        }
    }
}
