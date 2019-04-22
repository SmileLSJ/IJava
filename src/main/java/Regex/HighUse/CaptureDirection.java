package Regex.HighUse;

import Regex.BaseUtils;

/**
 * 捕获和非捕获:有几个括号代表几个分组
 */
public class CaptureDirection {

    public static void main(String[] args) {


        String regex = "";
        String str = "";


        //数字编码获取组
        str = "020-85653333";
        /**
         *  第0分组，内容：020-85653333
            第1分组，内容：020
            第2分组，内容：85653333
         */
        regex="(0\\d{2})-(\\d{8})";


        //命名编号捕获组
        regex = "(<first>0\\d{2})-(<third>\\d{8})";

        //非捕获组:将原本的第一分组，排除
        /*
           分组个数：2
                第0分组，内容：020-85653333，索引为：0
                第1分组，内容：020，索引为：0
                第2分组，内容：85653333，索引为：0
         */
        regex = "(?:0\\d{2})-(\\d{8})";

        /*
            分组个数：3 虽然分组为三个，但是整体不匹配，所以没有值
         */
        regex="(0\\d{2})-(\\d{8})-()";

        BaseUtils.groupMatch(regex,str);
    }

}
