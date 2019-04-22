package ThrowableFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

/**
 * Created by Gxy on 2019/2/15.
 *
 * 用来学习非受查异常是否可以
 */
public class NoCheckException {

    public static void main(String[] args) {

        File f = new File("");

        //IOException未受查异常，编译器不通过
        try {
            FileInputStream fis = new FileInputStream(f);
        } catch (FileNotFoundException e) {
            System.out.println("fis is not find");
        }

        //NullPointException为非受查异常，运行时异常，编译器通过，但是也可以使用try catch来捕获
        String s = null;
        try {
            s.length();
        }catch (NullPointerException e){
            System.out.println("s is null");
        }
        //非受检异常，无需进行异常捕获
        String s2 = null;

        //自动拆箱导致的空指针
        Integer number = null;
        int i = number;
    }
}
