package StringDemo;

/**
 * Created by Gxy on 2019/2/28.
 */
public class StringLearning {

    public static void main(String[] args) {


        long l = System.currentTimeMillis();

        String str = "aaa";
        String str1 = "bbb";
        str = str+str1;

        long l1 = System.currentTimeMillis();
        System.out.println("普通字符串拼接的时间："+(l1-l));



        long l3 = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        sb.append("aaa").append("bbb");
        long l4 = System.currentTimeMillis();

        System.out.println("使用StringBuilder的时间："+(l4-l3));

    }
}
