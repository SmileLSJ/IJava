package Building;

import java.util.UUID;

/**
 * Created by Gxy on 2019/3/5.
 */
public class UUIDUtils {

    public static String getUUID(){
        return UUID.randomUUID().toString().replaceAll("-","");
    }
}
