package AbstractAndInterface;

/**
 * Created by Gxy on 2019/3/27.
 */
public class Test {

    public static void main(String[] args) {
        AbstractPerson ap = new Person();


        ap.hello();


        PersonInterface pi = new PersonImpl();
        pi.hello();
    }

    public PersonInterface get(){
        return new PersonInterface() {
            @Override
            public void hello() {

            }

            @Override
            public void print() {

            }
        };
    }
}
