package com.monsite.Controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.monsite.Database.Database;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.MediaType;;

@Controller
public class HomeController {

    private final Database database;

    public HomeController(Database database) {
        this.database = database;
    }

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

    @GetMapping("/compétences")
    public String Competences(){
        return "compétences";
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
        File cv = new File("src/main/resources/static/compétences/CV_Lucas_Rivoal.pdf");
        if(!cv.exists()){
            return new ResponseEntity<>("Le fichier n'a pas été trouvée!",HttpStatus.NOT_FOUND);
        }
        InputStreamResource filReader = new InputStreamResource(new FileInputStream(cv));
        return ResponseEntity.ok()
            .contentLength(cv.length())
            .contentType(MediaType.APPLICATION_PDF).body(filReader);
    }

    @GetMapping("/users")
    @ResponseBody
    public List<Map<String, Object>> getUsers(){
        JsonNode users = database.getDatabase("users");
        List<Map<String, Object>> usernames = new ArrayList<>();
        for (JsonNode user : users){
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.get("id").asInt());
            map.put("username", user.get("username").asText());
            map.put("password", user.get("password").asText());
            usernames.add(map);
        }
        return usernames;
    }

}