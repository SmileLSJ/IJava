package fastjsonDemo;

import AbstractAndInterface.Person;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Gxy on 2019/4/10.
 */
public class test {

    @Test
    public void test(){
        String params = "";
        List<Map<String,Object>> paa = new ArrayList<>();

        Map<String,Object> pa = new HashMap<>(2);
        pa.put("name","xiaoming");
        pa.put("age",10);

        paa.add(pa);

        Map<String,Object> pa2 = new HashMap<>(2);
        pa2.put("name","xiaoming2");
        pa2.put("age",102);

        paa.add(pa2);

        String s1 = JSONObject.toJSONString(paa);
        System.out.println(s1);

        List<Student> students = JSONObject.parseArray(s1, Student.class);

        for (Student s :
                students) {
            System.out.println(s.getName()+"-"+s.getAge());
        }
    }


    @Test
    public void testTranid(){


        JSONArray objects = JSONArray.parseArray("[{\"tranid\":\"4390000000019040900024200\",\"customCardNo\":\"\",\"mcid\":\"\",\"max\":0,\"orderid\":\"2019040916350800136194\",\"cashpledge\":\"10\",\"type\":\"2\",\"cardno\":\"10000290917\",\"operator\":\"\",\"ordertime1\":\"\",\"ordertime2\":\"\",\"min\":0,\"branid\":\"b136223c8960474983099ae742d51e97\",\"cardid\":\"1000098492\",\"tel\":\"18221500006\",\"cpTime\":\"2019-04-09 16:33:51\",\"id\":\"\",\"paytype\":\"ÏÖ½ðÖ§¸¶\"}]\n");

        String s = JSONObject.toJSONString(objects, SerializerFeature.WriteClassName);
//        String s = JSONObject.toJSONString(objects);
        System.out.println(s);
        String s2 = JSONObject.toJSONString(objects);
        System.out.println(s2);

        List<Person> crmOrderInfos = JSONObject.parseArray(s, Person.class);

        for (Person s1 :
                crmOrderInfos) {
            System.out.println(s.toString());
        }
    }

}
