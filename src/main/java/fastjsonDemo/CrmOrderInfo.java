package fastjsonDemo;

/**
 "tranid": "4390000000019040900024200",
 "customCardNo": "",
 "mcid": "",
 "max": 0,
 "orderid": "2019040916350800136194",
 "cashpledge": "10",
 "type": "2",
 "cardno": "10000290917",
 "operator": "",
 "ordertime1": "",
 "ordertime2": "",
 "min": 0,
 "branid": "b136223c8960474983099ae742d51e97",
 "cardid": "1000098492",
 "tel": "18221500006",
 "cpTime": "2019-04-09 16:33:51",
 "id": "",
 "paytype": "现金支付"
 */
public class CrmOrderInfo {

    private String tranid;

    private String customCardNo;

    private String mcid ;

    private int max;

    private  String orderid;

    private String cashpledge;

    private String type;

    private String cardno;

    /*"operator": "",
            "ordertime1": "",
            "ordertime2": "",
            "min": 0,
            "branid": "b136223c8960474983099ae742d51e97",
            "cardid": "1000098492",
            "tel": "18221500006",
            "cpTime": "2019-04-09 16:33:51",
            "id": "",
            "paytype": "现金支付"*/

    private String operator;
    private  String ordertime1;
    private String ordertime2;
    private  String branid;
    private int min;
    private String cardid;
    private String tel;
    private  String cpTime;
    private String id;
    private String paytype;

    public String getTranid() {
        return tranid;
    }

    public void setTranid(String tranid) {
        this.tranid = tranid;
    }

    public String getCustomCardNo() {
        return customCardNo;
    }

    public void setCustomCardNo(String customCardNo) {
        this.customCardNo = customCardNo;
    }

    public String getMcid() {
        return mcid;
    }

    public void setMcid(String mcid) {
        this.mcid = mcid;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }

    public String getOrderid() {
        return orderid;
    }

    public void setOrderid(String orderid) {
        this.orderid = orderid;
    }

    public String getCashpledge() {
        return cashpledge;
    }

    public void setCashpledge(String cashpledge) {
        this.cashpledge = cashpledge;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCardno() {
        return cardno;
    }

    public void setCardno(String cardno) {
        this.cardno = cardno;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getOrdertime1() {
        return ordertime1;
    }

    public void setOrdertime1(String ordertime1) {
        this.ordertime1 = ordertime1;
    }

    public String getOrdertime2() {
        return ordertime2;
    }

    public void setOrdertime2(String ordertime2) {
        this.ordertime2 = ordertime2;
    }

    public String getBranid() {
        return branid;
    }

    public void setBranid(String branid) {
        this.branid = branid;
    }

    public int getMin() {
        return min;
    }

    public void setMin(int min) {
        this.min = min;
    }

    public String getCardid() {
        return cardid;
    }

    public void setCardid(String cardid) {
        this.cardid = cardid;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getCpTime() {
        return cpTime;
    }

    public void setCpTime(String cpTime) {
        this.cpTime = cpTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPaytype() {
        return paytype;
    }

    public void setPaytype(String paytype) {
        this.paytype = paytype;
    }

    @Override
    public String toString() {
        return "CrmOrderInfo{" +
                "tranid='" + tranid + '\'' +
                ", customCardNo='" + customCardNo + '\'' +
                ", mcid='" + mcid + '\'' +
                ", max=" + max +
                ", orderid='" + orderid + '\'' +
                ", cashpledge='" + cashpledge + '\'' +
                ", type='" + type + '\'' +
                ", cardno='" + cardno + '\'' +
                ", operator='" + operator + '\'' +
                ", ordertime1='" + ordertime1 + '\'' +
                ", ordertime2='" + ordertime2 + '\'' +
                ", branid='" + branid + '\'' +
                ", min=" + min +
                ", cardid='" + cardid + '\'' +
                ", tel='" + tel + '\'' +
                ", cpTime='" + cpTime + '\'' +
                ", id='" + id + '\'' +
                ", paytype='" + paytype + '\'' +
                '}';
    }
}
