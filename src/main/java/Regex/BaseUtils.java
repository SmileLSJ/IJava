package Regex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Gxy on 2018/12/7.
 */
public class BaseUtils {

    //. 匹配任意字符
    public static void match(String regex,String str) {

        Pattern pattern = Pattern.compile(regex);
        Matcher match = pattern.matcher(str);
        while (match.find()) {
            //输出的是匹配的内容，不匹配的不显示 例如  abc   ->  /ba   只返回a,如果全部返回的话使用 /babc
            System.out.printf("["+match.group()+"]--");
            System.out.printf("start"+match.start());
            System.out.println("");
        }
    }


    //分组匹配输出
    public static void groupMatch(String  regex ,String str){
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(str);

        //groupCount是通过正则表达式中的（）来判断的，并没有通过最后的结果判断
        System.out.println("分组个数："+matcher.groupCount());

        if (matcher.find()){
            for(int i=0;i<=matcher.groupCount();i++) {
                System.out.println("第"+i+"分组，内容："+matcher.group(i) +"，索引为："+matcher.start());
            }
        }

    }


    //根据分组名称进行分组
    public static void groupByName(String  regex ,String str,String[] groupName){
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(str);

        if (matcher.find()){
            for(int i =0;i<groupName.length;i++){

                System.out.printf("第【"+groupName[i]+"】分组，内容为："+matcher.group(i));
            }
        }

    }
}
