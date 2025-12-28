package com.monsite.Services;

import com.monsite.Database.VerificationCodeRepository;
import com.monsite.models.VerificationCode;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class VerificationService {

    private final VerificationCodeRepository repository;
    private final MailService mailService;

    public VerificationService(VerificationCodeRepository repository, MailService mailService) {
        this.repository = repository;
        this.mailService = mailService;
    }

    private String generateCode(){
        int code = 100000 + (int)(Math.random() * 900000);
        return String.format("%06d", code); 
    }


    public void sendCodeByEmail(String email) throws Exception {
        String code = generateCode();

        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setCode(code);
        vc.setExpiration(LocalDateTime.now().plusMinutes(5));
        vc.setVerification(false);

        repository.save(vc);
        mailService.SendCodeMail(email, code);
    }

    public boolean verifyCode(String mailPhone, String code) throws Exception {
        VerificationCode vc = repository.findLastCodeByMail(mailPhone);
        if(vc == null){
            return false;
        }
        if(vc.getVerification()){
            return false;
        } 

        if(vc.getExpiration().isBefore(LocalDateTime.now())){
            return false;
        }
        if (!vc.getCode().equals(code)){
            return false;
        } 
        repository.markVerified(vc.getID());
        return true;
    }
}