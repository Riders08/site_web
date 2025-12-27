package com.monsite.models;

public class VerifyRequest {

    private String mail_phone;
    private String code;

    public VerifyRequest() {}

    public String getMail_phone() {
        return mail_phone;
    }

    public void setMailPhone(String mailPhone) {
        this.mail_phone = mailPhone;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
