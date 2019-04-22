package Regex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 6 中重复限定符
 */
public class RepeatingQualifier {

    //. 匹配任意字符
    public static void match(String regex,String str) {

        Pattern pattern = Pattern.compile(regex);
        Matcher match = pattern.matcher(str);
        while (match.find()) {
            //输出的是匹配的内容，不匹配的不显示 例如  abc   ->  /ba   只返回a,如果全部返回的话使用 /babc
            System.out.printf("["+match.group()+"]");
        }
    }

    public static void main(String[] args) {
        // * 重复零次或更多次
        String regex = "\\w*"; //字母零次或多次
        String str = "abcdcd"; //[abcdcd]

        // + 重复一次或更多次
        regex = "\\w+";        //[abcdcd]

        // ?重复零次或1次
        regex = "\\w?";        //[a][b][c][d][c][d][] 因为空也是匹配0次，所以打出了空，从下面{n}也可以看出来


        // {n} 重复n次
        regex = "\\w{1}";      //[a][b][c][d][c][d]
        regex = "\\w{0}";      //[][][][][][][]

        //  {n,}重复n次或者更多次
        regex = "\\w{1,}";     //[abcdcd]
        regex = "\\w{0,}";     //[abcdcd][]

        // {n,m}重复n次到m次，包含n次也包含m次
        regex = "\\w{2,4}";    //[abcd][cd]
        regex = "\\w{3,4}";    //[abcd] 剩下的两位不在n~m的范围之内


        match(regex,str);
    }
}