package Number;

import java.math.BigDecimal;

/**
 * double功能验证
 */
public class S001_Double {

    public static void main(String[] args) {


        //比较大小
        Double zero = new Double(0.01);
        System.out.printf("zero=0:"+(zero==0));

        System.out.printf("zero 0"+(Double.compare(zero,0)==0));

        System.out.println("");
        double d = 1.1;

        BigDecimal bigDecimal2 = new BigDecimal(d + "");
        System.out.println(bigDecimal2);

        BigDecimal bigDecimal = new BigDecimal(d);
        System.out.println(bigDecimal);

        BigDecimal bigDecimal1 = BigDecimal.valueOf(d);
        System.out.println(bigDecimal1);
    }
}
