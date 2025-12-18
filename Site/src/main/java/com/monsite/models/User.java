package com.monsite.models;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class User {
    private Long id;
    private String emailPhone;
    private String username;

    @JsonIgnore
    private String passwordHash;
    
    public User(){}

    public User(String emailPhone, String username, String passwordHash){
        this.emailPhone = emailPhone;
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public Long getId(){
        return this.id;
    }

    public String getEmailPhone(){
        return this.emailPhone;
    }

    public String getUsername(){
        return this.username;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public void setId(long id){
        this.id = id;
    }

    public void setEmailPhone(String emailPhone){
        this.emailPhone = emailPhone;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public void setPasswordHash(String passwordHash){
        this.passwordHash = passwordHash;
    }

}
