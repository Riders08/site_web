package com.monsite.Controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class User {
    private String username;

    @JsonIgnore
    private String passwordHash;
    
    private transient String password;

    public User(){}

    public User(String username, String password){
        this.username = username;
        this.password = password;
        this.passwordHash = new BCryptPasswordEncoder().encode(password);
    }

    public String getUsername(){
        return this.username;
    }

    public String getPassword(){
        return this.password;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public void setPasswordHash(String passwordHash){
        this.passwordHash = passwordHash;
    }

    public void setPassword(String password){
        this.password = password;
        if(password != null){
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            this.passwordHash = encoder.encode(password);
        }
    }

    public boolean checkPassword(String password){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(password, this.passwordHash);
    }
}
