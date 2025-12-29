package com.monsite.Services;

import org.springframework.stereotype.Service;

import com.monsite.Database.CommentaireRepository;
import com.monsite.models.Commentaire;

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
}
