package JSONDemo;

import net.sf.json.JSONObject;
import org.junit.Test;

/**
 * Created by Gxy on 2019/4/17.
 */
public class JSONTest {

     @Test
     public void test(){
         JSONObject jsonObject = JSONObject.fromObject("");
         System.out.println(jsonObject==null);//false
     }
}
