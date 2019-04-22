package Regex.HighUse;

import Regex.BaseUtils;

/**
 * 正则表达式的高级用法
 *
 */
public class HighDirection {


    public static void main(String[] args) {

        //正向先行断言
        //匹配</span>之前的一个或多个任意字符
        String regex=".+(?=</span>)";  //[<span class="read-count">阅读数：641]
        String str = "<span class=\"read-count\">阅读数：641</span><span class=\"read-count\">阅读数：641</span>";

        regex="\\d+(?=</span>)";  //[<span class="read-count">阅读数：641]
        str = "<span class=\"read-count\">阅读数：641</span><span class=\"read-count\">阅读数：641</span>";//[641][641]

        regex = "\\d+(?=</span>)"; //[641]

        //正向后行断言
        //匹配<span class="read-count">之后的内容
        regex = "(?<=(<span class=\"read-count\">阅读数：)).+";  //[641</span>]
        regex = "(?<=(<span class=\"read-count\">阅读数：))\\w+";  //[641]

        //负向先行断言
        //获取到不是"的花朵"前面的所有祖国
        regex = "祖国(?!的花朵)";
        str = "woai祖国，我爱祖国，我是祖国的花朵";  //[祖国]start4[祖国]start9

        //负向后行断言
        //返回不是  "我是"后面的祖国 start代表索引下标
        regex = "(?<!我是)祖国"; //[祖国]start4[祖国]start9



        BaseUtils.match(regex,str);
    }
}
