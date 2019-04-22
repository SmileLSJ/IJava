package Lambda;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Created by Gxy on 2019/1/8.
 */
public class BaseLambda {


    public static void main(String[] args) {

        String[] atp = {"Rafael Nadal", "Novak Djokovic",
                "Stanislas Wawrinka",
                "David Ferrer","Roger Federer",
                "Andy Murray","Tomas Berdych",
                "Juan Martin Del Potro"};

//        testList();

        testBigToSmall(atp);
    }



    public static void testList(){
        String[] atp = {"Rafael Nadal", "Novak Djokovic",
                "Stanislas Wawrinka",
                "David Ferrer","Roger Federer",
                "Andy Murray","Tomas Berdych",
                "Juan Martin Del Potro"};
        List<String> players =  Arrays.asList(atp);

        //原始，单一参数
        players.forEach(new Consumer<String>() {
            public void accept(String s) {
                System.out.println(s);
            }
        });

        //一个参数时，直接使用变量即可
        players.forEach((player) -> System.out.println(player));
    }


    public static void testBigToSmall(String[] arry){
        String[] atp = {"Rafael Nadal", "Novak Djokovic",
                "Stanislas Wawrinka",
                "David Ferrer","Roger Federer",
                "Andy Murray","Tomas Berdych",
                "Juan Martin Del Potro"};

        List<String> original_attr = Arrays.asList(atp);

        List<String> big_list = original_attr.stream().map((str) -> {
            return str.toLowerCase();
        }).collect(Collectors.toList());

        big_list.forEach(str -> System.out.println(str));
    }
}
