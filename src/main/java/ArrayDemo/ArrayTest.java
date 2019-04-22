package ArrayDemo;

import java.util.Arrays;

/**
 * Created by Gxy on 2019/3/27.
 */
public class ArrayTest {

    private static int[] nums=new int[3];

    public static void main(String[] args) {
        int[] nn = nums;

        nn[0]=1;

        Arrays.stream(nums).forEach((i)-> System.out.println(nums[i]));
        System.out.println("--------------");
        Arrays.stream(nums).forEach((i)-> System.out.println(nn[i]));

    }
}
