package ThreadPool;

import java.util.concurrent.*;

/**
 * Created by Gxy on 2019/3/20.
 */
public class First {
    public static void main(String[] args) {

        /*public static ExecutorService newCachedThreadPool() {
            return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                    60L, TimeUnit.SECONDS,
                    new SynchronousQueue<Runnable>());
        }*/
        ExecutorService service = Executors.newCachedThreadPool();


        /*public static ExecutorService newFixedThreadPool(int nThreads) {
            return new ThreadPoolExecutor(nThreads, nThreads,
                    0L, TimeUnit.MILLISECONDS,
                    new LinkedBlockingQueue<Runnable>());
        }*/
        ExecutorService service1 = Executors.newFixedThreadPool(1);



        /*
        DelayedWorkQueue内部是数组实现

        public ScheduledThreadPoolExecutor(int corePoolSize) {
            super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
                    new DelayedWorkQueue());
        }

        public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue) {
            this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
                 Executors.defaultThreadFactory(), defaultHandler);
        }

        */
        ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);


       /* public static ExecutorService newSingleThreadExecutor() {
            return new FinalizableDelegatedExecutorService
                    (new ThreadPoolExecutor(1, 1,
                            0L, TimeUnit.MILLISECONDS,
                            new LinkedBlockingQueue<Runnable>()));
        }*/
        ExecutorService service2 = Executors.newSingleThreadExecutor();



        service.execute(new Runnable() {
            @Override
            public void run() {

            }
        });



    }
}
