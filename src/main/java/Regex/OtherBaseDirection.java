package Regex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *  分组、转义、
 */
public class OtherBaseDirection {


    public static void main(String[] args) {

        // ()  使用括号进行分组
        String regex = "\\b(ababab)";
        String str = "abababababab";

        regex = "^(ab)*"; //[abababababab],只是匹配字符串开头中多个ab为整体的字符串，并不能返回第二个
        str = "cabababdabab";


        // 转义，主要针对特殊字符，又有特殊含义，例如()使用/来进行转义
        regex = "^(/(abc/))*";
        str = "/(abc/)abc";  //空
        str = "(abc)abad";


        //条件或  |
        regex = "^(123|234)";
        str = "123423";   //[123]
        str = "234564";   //[234]
        str = "23s4564";

        //使用[]来代表区间
        regex = "^[1234]\\d+"; //以1或者2、3、4开头的数字
        str = "1111";     //[1111]
        str = "2345";     //[2345]
        str = "55555";    //空，没有进入while循环

        regex = "[1-4]\\d+";  //匹配1到4开头的所有数字
        str = "1111";     //[1111]
        str = "4345";     //[4345]
        //str = "55555";    //空，没有进入while循环




        match(regex,str);
    }












    //. 匹配任意字符
    public static void match(String regex,String str) {

        Pattern pattern = Pattern.compile(regex);
        Matcher match = pattern.matcher(str);
        while (match.find()) {
            //输出的是匹配的内容，不匹配的不显示 例如  abc   ->  /ba   只返回a,如果全部返回的话使用 /babc
            System.out.printf("["+match.group()+"]");
        }
    }


}
