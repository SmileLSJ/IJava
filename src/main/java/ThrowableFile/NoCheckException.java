package ThrowableFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

/**
 * Created by Gxy on 2019/2/15.
 *
 * ����ѧϰ���ܲ��쳣�Ƿ����
 */
public class NoCheckException {

    public static void main(String[] args) {

        File f = new File("");

        //IOExceptionδ�ܲ��쳣����������ͨ��
        try {
            FileInputStream fis = new FileInputStream(f);
        } catch (FileNotFoundException e) {
            System.out.println("fis is not find");
        }

        //NullPointExceptionΪ���ܲ��쳣������ʱ�쳣��������ͨ��������Ҳ����ʹ��try catch������
        String s = null;
        try {
            s.length();
        }catch (NullPointerException e){
            System.out.println("s is null");
        }
        //���ܼ��쳣����������쳣����
        String s2 = null;

        //�Զ����䵼�µĿ�ָ��
        Integer number = null;
        int i = number;
    }
}
