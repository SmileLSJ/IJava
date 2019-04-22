package Collections;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Gxy on 2018/12/21.
 */
public class MapTest {

    public static void main(String[] args) throws Exception {


        Map<String,Object> result = new HashMap<String,Object>();

        changeMapValue(result);
        System.out.println("result"+result);
        changeMapValue2(result);
        System.out.println("result"+result);
        System.out.println(changeMapValue2(result));
    }

    public static void changeMapValue(Map<String,Object> result){

        result .put("Hello","hello");
    }

    public static String changeMapValue2(Map<String,Object> result) throws Exception {

        String a = "";
        try {
            result .put("Hello","hello2");
            a="1";
            int i = 1/0;
        }catch (Exception e){
            a = "exception";
//            throw  new Exception();
        }
        a="3";
        return a;

    }


}
