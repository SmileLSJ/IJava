package Lambda;

import java.lang.reflect.Array;
import java.util.Arrays;

/**
 * 方法引用
 *    如果某个方法的签名和接口恰好相同：签名是指：参数类型和返回值类型
 *    格式：  类名::方法名
 */
public class Sort {

    static int ignoreCase(String s1,String s2){

        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        return s1.compareTo(s2);
    }


    public static void main(String[] args) {

        String s1 = "1";
        String s2 = "2";

        String[] array = {s1,s2};

    }
}
