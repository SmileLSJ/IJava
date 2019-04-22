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
     * ��������
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

        //�����ڽ�������Ϣ��˵��û�н��в���
        if(!buildMap.containsKey(bKey)){
            //���ݿ����mcid��buildNameȥ��ѯ
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
     * ���뷿����Ϣ
     * @return �������
     */
    private static String insertRoom(String buildCode, String floorCode, String deptCode, String roomName) {
        System.out.println("                ���䡾"+roomName+"���������ݿ�");
        return null;
    }

    /**
     * ���벿����Ϣ
     * @return ���ű���
     */
    private static String insertDept(String buildCode, String floorCode, String deptName) {
        System.out.println("           ���š�"+deptName+"���������ݿ�");
        return null;
    }

    /**
     * ����¥����Ϣ
     * @return ¥�����
     */
    private static String insertFloor(String buildCode, String floorName) {
        System.out.println("       ¥�㡾"+floorName+"���������ݿ�");
        return null;
    }

    /**
     * ���뽨������Ϣ
     * @return ���������
     */
    private static String insertBuilding(String buildName) {
        System.out.println("  �����"+buildName+"���������ݿ�");
        String sql = "";
        String code = "";

        //���ݿ��ѯ
        //��ѯ��code
        if(true){
            code="11111";
        }else{
            code = UUIDUtils.getUUID();
            sql = "insert table ....";
            System.out.println("������������ݿ�"+sql);
        }
        return code;
    }
}
