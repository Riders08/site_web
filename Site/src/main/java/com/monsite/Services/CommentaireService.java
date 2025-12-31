package com.monsite.Services;

import java.sql.SQLException;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.monsite.Database.CommentaireRepository;
import com.monsite.models.Commentaire;
import com.monsite.models.User;


@Service
public class CommentaireService {
    private CommentaireRepository commentaireRepository;
    
    public CommentaireService(CommentaireRepository commentaireRepository){
        this.commentaireRepository = commentaireRepository;
    }

    public void AddCommentaire(String username, String commentaire){

        if(username == null || username == ""){
            System.out.println("Le nom de l'utilisateur qui a essayé d'écrire un commentaire n'a pas pu être récupérer.");
            return;
        }
        if(commentaire == null || commentaire == "" || commentaire.trim().length() <= 0){
            System.out.println("Le commentaire est vide.");
            return;
        }
        Commentaire newCommentaire = new Commentaire();
        newCommentaire.setCommentaire(commentaire);
        newCommentaire.setUser(username);
        try{
            this.commentaireRepository.AddCommentaire(newCommentaire);
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    public void DeleteCommentaire(User user, String commentaire) throws SQLException{
        Commentaire SelectedComment = getCommentaire(commentaire);
        if(SelectedComment == null){
            throw new IllegalArgumentException("Le commentaire recupéré n'existe pas dans la base de donnée.");
        }
        if(PermissionToDelete(user, commentaire)){
            this.commentaireRepository.DeleteCommentaire(SelectedComment.getID());
        }else{
            throw new IllegalArgumentException("L'utilisateur qui cherche a supprimé ce commentaire n'a pas les droits.");
        }
    }

    public boolean PermissionToDelete(User user, String commentaire) throws SQLException{
        if(user.getUsername().equals("Admin") && user.getEmailPhone().equals("0000000000")){
            return true;
        }
        Commentaire selectedCommentaire = getCommentaire(commentaire);
        if(selectedCommentaire.getUser().equals(user.getUsername())){
            return true;
        }
        return false;
    }

    public Commentaire getCommentaire(String commentaire) throws SQLException{
        for(Commentaire comment : this.commentaireRepository.getCommentaires()){
            if(comment.getCommentaire().equals(commentaire)){
                return comment;
            }
        }   
        return null;
    }
}
