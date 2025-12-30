package com.monsite.Services;

import org.springframework.stereotype.Service;

import com.monsite.models.User;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;


@Service
public class MailService {
    private final JavaMailSender mailSender;
    
    public MailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    public boolean isEmail(String value){
        System.out.println(value);
        
        return value.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }

    public boolean isPhone(String value){
        return value.matches("^[0-9 ]{6,7}$");
    }

    public void TestSendMail(String destinataire){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject("Merci de ne pas répondre");
        message.setText("Bonjour, merci d'avoir choisi de créer un compte chez nous, il ne vous reste plus qu'à confirmer cela en tapant le code suivant : \n ");
        mailSender.send(message);
    }

    public void SendCodeMail(String destinataire, String code){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject("Merci de ne pas répondre");
        message.setText("Bonjour, merci d'avoir choisi de créer un compte chez nous, il ne vous reste plus qu'à confirmer cela en tapant le code suivant : \n " + code + "\nAttention, ce code expirera dans 5 minutes.");
        mailSender.send(message);
    }

    public void mailNewComment(User destinataire, String commentaire){
        System.out.println(destinataire.getEmailPhone());
        System.out.println(destinataire.getUsername());
        System.out.println(commentaire);
        
        ThankMail(destinataire, commentaire);
        AlertCommentForMe(destinataire, commentaire);
    }

    public void mailProblemComment(User user, String commentaire, User user_choose_to_delete){
        String email_destinataire = user.getEmailPhone();
        String user_destinataire = user.getUsername();
        String user_choose_to_delete_name = user_choose_to_delete.getUsername();
        if(user_destinataire == user_choose_to_delete_name){
            if(isEmail(email_destinataire)){
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(email_destinataire);
                message.setSubject("Votre commentaire a bien été supprimé");
                message.setText("Bonjour " + email_destinataire +" \nNous vous informons que votre commentaire ci-dessous a bien été supprimé. \n\n" + commentaire);
                mailSender.send(message);
            }
            if(isPhone(email_destinataire)){
                System.out.println("Pour certaines raisons, la possibilité de réaliser cette fonctionnalité avec les numéros de téléphone n'est pas disponible");
            }
        }else{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email_destinataire);
            message.setSubject("Votre commentaire a été supprimé");
            message.setText("Bonjour " + email_destinataire +" \nSuite à diverses raisons," + user_choose_to_delete_name +" a pris la décision de supprimer votre commentaire ci-dessous.\n\n" + commentaire);
            mailSender.send(message);
        }
    }

    public void AlertCommentForMe(User destinataire, String commentaire){
        String utilisateur = destinataire.getUsername();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("lulurivoal@gmail.com");
        message.setSubject("Nouveau commentaire dans le site web");
        message.setText("L'utilisateur du nom de " + utilisateur + " a posté un commentaire : \n" + commentaire);
        mailSender.send(message);
    }

    public void ThankMail(User destinataire, String commentaire){
        String email_destinataire = destinataire.getEmailPhone();
        if(isEmail(email_destinataire)){
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email_destinataire);
            message.setSubject("Merci, pour votre commentaire");
            message.setText("Bonjour " + email_destinataire +" \nMerci infiniment, pour votre commentaire qui a bien été pris en compte et qui compte beaucoup pour nous, qu'il soit négatif ou positif. \n\n" + commentaire);
            mailSender.send(message);
        }
        if(isPhone(email_destinataire)){
            System.out.println("Pour certaines raisons, la possibilité de réaliser cette fonctionnalité avec les numéros de téléphone n'est pas disponible");
        }
    }
}
