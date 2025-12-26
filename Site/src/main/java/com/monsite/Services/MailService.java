package com.monsite.Services;

import org.springframework.stereotype.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;


@Service
public class MailService {
    private final JavaMailSender mailSender;
    
    public MailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    public void TestSendMail(String destinataire){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject("Merci de ne pas répondre");
        message.setText("Bonjour, merci d'avoir choisi de créer un compte chez nous, il ne vous reste plus confirmer cela en tapant le code suivant : \n ");
        mailSender.send(message);
    }
}
