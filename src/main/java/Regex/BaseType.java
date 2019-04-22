package Regex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 7大 元类型
 */
public class BaseType {

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
        // .
        String regex = ".";
        String str = "abcdcd";


        // \w 匹配字母或数字或下划线或汉字
        regex = "/w";
        str = "/wafgad？*fds_a/w";  //  结果 /w/w
        regex = "\\w";              //  结果 wafgadfds_aw  ，每个都是单独分开的
        regex = "\\w\\w";           //  结果和上面的一样，只是两个为一组

        // \s 匹配任意的空格符
        regex = "\\s";
        str = "a b c";              //  结果为两个空格


        // \d decimal 匹配数字
        regex = "\\d";
        str = "abcdaf32da_87dsd";   //  [3][2][8][7]

        // \b begin 匹配字符串的开始
        regex = "\\babc";
        str = "abdabcadafdabcdfasd"; //无结果
        str = "abcdsfdsafdaabcdd";   //结果 [abc]
        str = "sdfsdfaabc";          //结果为空


        // ^匹配字符串的开始，从开始进行匹配
        regex = "^adc";
        str = "abcsdfasd";          //空
        str = "adcdf";              //[abc]

        // $匹配字符串的结束
        regex = "abc$";
        str = "fdasfdsaabc";        //[abc]

        match(regex,str);
    }
}