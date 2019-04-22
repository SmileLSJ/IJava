package Building;

import com.sun.deploy.util.StringUtils;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Gxy on 2019/3/4.
 */
public class Building {


    private boolean isInsert = false;

    private String buildId;

    private String buildName;

    private HashMap<String,Floor> floorMap = new HashMap<String, Floor>();


    public Building(String buildName) {
        this.buildName = buildName;
        this.buildId=UUIDUtils.getUUID();
    }

    public Floor addFloor(String floorName){
        Floor f;

        if(floorMap.containsKey(floorName)){
            f=floorMap.get(floorName);
        }else{
            f=new Floor(floorName);
            floorMap.put(floorName,f);
        }
        return f;
    }


    public Floor addFloor(String buildName,String floorName,String deptName){
        Floor f;

        if(floorMap.containsKey(floorName)){
            f=floorMap.get(floorName);
        }else{
            f=new Floor(floorName);
            floorMap.put(floorName,f);
        }
        return f;
    }


    public void insertDB(){
        if(isInsert){
            //System.out.println(buildName+"�Ѿ��������ݿ�");
        }else{
            isInsert=true;
            //������������ݿ�
            System.out.println("�����"+buildName+"���������ݿ�");
        }


        insertFloor();
    }

    /**
     * ��¥�����ݲ������ݿ�
     */
    public void insertFloor(){
        Collection<Floor> values = floorMap.values();
        for (Floor f:values) {
            f.insertDB(buildId);
        }
    }
}
