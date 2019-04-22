package Regex.HighUse;

import Regex.BaseUtils;

/**
 * 反向引用
 */
public class BackwardReference {


    public static void main(String[] args) {
        String str = "aabbbbgbddesddfiid";
        String regex = "(\\w)\\1";

        //BaseUtils.match(regex,str);
        //BaseUtils.groupMatch(regex,str);

        replaceWord();

    }


    public static void replaceWord(){
        //通过正则表达式的，反向引用也可以实现将原有的字符串中的字符替换成请求中的字符
        String test = "abcbbabcbcgbddesddfiid";
        String reg="(a)(b)c";  //存在两个分组，第一个为a， 第二个为b,使用$1代表第一个分组
        //结果          a  bb a bcgbddesddfiid
        System.out.println(test.replaceAll(reg, "$1"));

        //结果          b  bb b bcgbddesddfiid
        System.out.println(test.replaceAll(reg, "$2"));

        //当选择没有的分组时，直接报错Exception in thread "main" java.lang.IndexOutOfBoundsException: No group 3
        System.out.println(test.replaceAll(reg, "$3"));
    }
}
