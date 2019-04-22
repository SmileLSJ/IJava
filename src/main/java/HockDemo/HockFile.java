package HockDemo;

/**
 * Created by Gxy on 2019/4/12.
 */
import java.io.File;
import java.io.IOException;
import java.sql.Time;
import java.util.concurrent.TimeUnit;

import static java.util.concurrent.TimeUnit.*;

/**
 * @author ȮС����΢�ź�: С��ѧJava��
 * @date 2019/4/10
 * @time ����9:56
 * @discription
 **/
public class HockFile {

    /** .lock �ļ����·�� */
    private static final String LOCK_FILE_PATH = "./";

    /** .lock �ļ����� */
    private static final String LOCK_FILE_NAME = ".lock";

    public static void main(String[] args) {

        // У�� .lock �ļ��Ƿ��Ѿ�����
        checkLockFile();

        // ע�� Hook �߳�
        addShutdownHook();

        // ģ�����һֱ����
        for (;;) {
            try {
                SECONDS.sleep(1);
                System.out.println("The program is running ...");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * ע�� Hook �߳�
     */
    private static void addShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            // ���ܵ����˳��ź�
            System.out.println("The program received kill signal.");
            // ɾ�� .lock �ļ�
            deleteLockFile();
        }));
    }

    /**
     * У�� .lock �ļ��Ƿ��Ѿ�����
     */
    private static void checkLockFile() {
        if (isLockFileExisted()) {
            // .lock �ļ��Ѵ���, �׳��쳣, �˳�����
            throw new RuntimeException("The program already running.");
        }

        // �����ڣ��򴴽� .lock �ļ�
        createLockFile();
    }

    /**
     * ���� .lock �ļ�
     */
    private static void createLockFile() {
        File file = new File(LOCK_FILE_PATH + LOCK_FILE_NAME);
        try {
            file.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * .lock �ļ� �Ƿ����
     * @return
     */
    private static boolean isLockFileExisted() {
        File file = new File(LOCK_FILE_PATH + LOCK_FILE_NAME);
        System.out.println(file.getAbsolutePath());
        return file.exists();
    }

    /**
     * ɾ�� .lock �ļ�
     */
    private static void deleteLockFile() {
        File file = new File(LOCK_FILE_PATH + LOCK_FILE_NAME);
        file.delete();
    }
}

