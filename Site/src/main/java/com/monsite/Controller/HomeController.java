package com.monsite.Controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.http.MediaType;;

@Controller
public class HomeController {
    @GetMapping("/")
    public String Home(){
        return "index";
    } 

    @GetMapping("/etudes")
    public String Etudes(){
        return "etudes";
    } 

    @GetMapping("/projets")
    public String Projets(){
        return "projets";
    }

    @GetMapping("/competences")
    public String Competences(){
        return "competences";
    }

    @GetMapping("/loisirs")
    public String Loisirs(){
        return "loisirs";
    }

    @GetMapping("/informations")
    public String Informations(){
        return "informations";
    }

    @GetMapping("/documents")
    public String Documents(){
        return "documents";
    }

    @GetMapping("/admin")
    public String Admin(){
        return "admin";
    }

    @RequestMapping(value = "/CV", method = RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<?> getCV() throws IOException {
        File cv = new File("src/main/resources/static/competences/CV_Lucas_Rivoal.pdf");
        if(!cv.exists()){
            return new ResponseEntity<>("Le fichier n'a pas été trouvée!",HttpStatus.NOT_FOUND);
        }
        InputStreamResource filReader = new InputStreamResource(new FileInputStream(cv));
        return ResponseEntity.ok()
            .contentLength(cv.length())
            .contentType(MediaType.APPLICATION_PDF).body(filReader);
    }

}
