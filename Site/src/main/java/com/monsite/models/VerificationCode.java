package com.monsite.models;

import java.time.LocalDateTime;

public class VerificationCode {
    private long id;
    private String email;
    private String code;
    private LocalDateTime expiration;
    private boolean verification;

    public VerificationCode(){}

    public VerificationCode(long id, String email, String code, LocalDateTime expiration, boolean verification){
        this.id = id;
        this.email = email; 
        this.code = code;
        this.expiration = expiration;
        this.verification = verification;
    }

    public long getID(){
        return id;
    }
    
    public String getEmail(){
        return email;
    }

    public String getCode(){
        return code;
    }

    public LocalDateTime getExpiration(){
        return expiration;
    }

    public boolean getVerification(){
        return verification;
    }

    public void setID(long id){
        this.id = id;
    }
    
    public void setEmail(String email){
        this.email = email;
    }

    public void setCode(String code){
        this.code = code;
    }

    public void setExpiration(LocalDateTime expiration){
        this.expiration = expiration;
    }

    public void setVerification(boolean verification){
        this.verification = verification;
    }
}
