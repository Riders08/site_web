package com.monsite.models;


public class Commentaire {
    private long id;
    private String user; // Je pourrais à la limite créer une clé étrangere pour relier les tables commentaire et users 
    // mais je ne pense pas parce que à l'origine l'idée de ce site n'avait même pas pour but de créer des utilisateurs après tout.
    private String commentaire;

    public Commentaire(){}

    public Commentaire(long id, String user, String commentaire){
        this.id = id;
        this.user = user;
        this.commentaire = commentaire;
    }

    public long getID(){
        return id;
    }

    public String getUser(){
        return user;
    }

    public String getCommentaire(){
        return commentaire;
    }

    public void setID(long id){
        this.id = id;
    }

    public void setUser(String user){
        this.user = user;
    }

    public void setCommentaire(String commentaire){
        this.commentaire = commentaire;
    }
}
