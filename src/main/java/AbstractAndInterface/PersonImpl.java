package AbstractAndInterface;

/**
 * Created by Gxy on 2019/3/27.
 */
public class PersonImpl implements PersonInterface {

    @Override
    public void hello() {
        System.out.println("PersonInterface is hello");
    }

    @Override
    public void print() {
        System.out.println("PersonInterface is print");
    }
}
