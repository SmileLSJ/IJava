package Building;

import java.util.Collection;
import java.util.HashMap;

/**
 * Created by Gxy on 2019/3/4.
 */
public class Floor{

        private boolean isInsert = false;

        private String floorID;

        private String floorName;

        private HashMap<String,Dept> deptMap = new HashMap<String, Dept>();


        public Floor(String floorName) {
            this.floorName = floorName;
            floorID = UUIDUtils.getUUID();
        }


        public Dept addDept(String deptName){
            Dept d;
            if(deptMap.containsKey(deptName)){
                d=deptMap.get(deptName);
            }else{
                d=new Dept(deptName);
                deptMap.put(deptName,d);
            }
            return d;
        }


        public Dept addDept(String buildName,String floorName,String deptName,String roomName){
            Dept d;
            if(deptMap.containsKey(deptName)){
                d=deptMap.get(deptName);
            }else{
                d=new Dept(deptName);
                deptMap.put(deptName,d);
            }
            return d;
        }


        public void insertDB(String buildId){
            if(isInsert){
                //System.out.println(floorName+"已经插入数据库");
            }else{
                isInsert=true;
                //楼层插入数据库
                System.out.println("楼层【"+floorName+"】插入数据库");
            }
            insertDept(buildId);
        }



        public void insertDept(String buildId){
            Collection<Dept> values = deptMap.values();
            for (Dept f:values) {
                f.insertDB(buildId,floorID);
            }
        }
}
