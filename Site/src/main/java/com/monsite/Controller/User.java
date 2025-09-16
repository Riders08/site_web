package com.monsite.Controller;

public class User {
    private String username;
    private String password;

    public String getUsername(){
        return this.username;
    }

    public String getPassword(){
        return this.password;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public boolean compUser(User user){
        if(this.username.equals(user.getUsername()) && this.password.equals(user.getPassword())){
            return true;
        }
        return false;
    }
}
