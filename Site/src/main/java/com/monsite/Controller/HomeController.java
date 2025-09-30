package com.monsite.Controller;

import com.monsite.Controller.User;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monsite.Database.Database;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.Connection;
import java.util.List;
import java.util.Map;
import java.util.prefs.PreferencesFactory;
import java.util.HashMap;
import java.util.ArrayList;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

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

    @RequestMapping(value = "/BAC", method = RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<?> getBAC() throws IOException {
        File bac = new File("src/main/resources/static/compétences/BACCALAUREAT_LUCAS_RIVOAL.pdf");
        if(!bac.exists()){
            return new ResponseEntity<>("Le fichier n'a pas été trouvée!",HttpStatus.NOT_FOUND);
        }
        InputStreamResource filReader = new InputStreamResource(new FileInputStream(bac));
        return ResponseEntity.ok()
            .contentLength(bac.length())
            .contentType(MediaType.APPLICATION_PDF).body(filReader);
    }

    @RequestMapping(value = "/PIX", method = RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<?> getPIX() throws IOException {
        File pix = new File("src/main/resources/static/compétences/certification PIX.pdf");
        if(!pix.exists()){
            return new ResponseEntity<>("Le fichier n'a pas été trouvée!",HttpStatus.NOT_FOUND);
        }
        InputStreamResource filReader = new InputStreamResource(new FileInputStream(pix));
        return ResponseEntity.ok()
            .contentLength(pix.length())
            .contentType(MediaType.APPLICATION_PDF).body(filReader);
    }
    @RequestMapping(value = "/linguaskill", method = RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<?> getLinguaskill() throws IOException {
        File lig = new File("src/main/resources/static/compétences/Certification Linguaskill.pdf");
        if(!lig.exists()){
            return new ResponseEntity<>("Le fichier n'a pas été trouvée!",HttpStatus.NOT_FOUND);
        }
        InputStreamResource filReader = new InputStreamResource(new FileInputStream(lig));
        return ResponseEntity.ok()
            .contentLength(lig.length())
            .contentType(MediaType.APPLICATION_PDF).body(filReader);
    }
    @RequestMapping(value = "/attestation-licence", method = RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<?> getLicence() throws IOException {
        File lic = new File("src/main/resources/static/compétences/Attestation Licence 2 Informatique.pdf");
        if(!lic.exists()){
            return new ResponseEntity<>("Le fichier n'a pas été trouvée!",HttpStatus.NOT_FOUND);
        }
        InputStreamResource filReader = new InputStreamResource(new FileInputStream(lic));
        return ResponseEntity.ok()
            .contentLength(lic.length())
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
            usernames.add(map);
        }
        return usernames;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user){
        ArrayList<User> list_users = database.getUsersTable();
        boolean ok = false;
        for(User u : list_users){
            if (user.getUsername().equals(u.getUsername()) && u.checkPassword(user.getPassword())){
                ok = true;
            }
        }
        if(ok){
            return ResponseEntity.ok("Utilisateur connecté");
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("L'utilisateur donnée en argument n'a pas été reconnu");
        }
    }

    /*@GetMapping("/keywords")
    public List<Map<String, Object>> getKeywords() {
        JsonNode table = database.getDatabase("documents");
        if(table != null){
            System.err.println("La table "+ table + " n'existe pas !");
            return null;
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for(JsonNode element : table){
            Map<String, Object> map = new HashMap<>();
            map.put("filename", element.get("filename").asText());
            map.put("keys", element.get("keys").asText());
        }
        return result;
    }*/

    @PostMapping(value = "/addkeywords", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addKeyWords(@RequestBody Map<String, Object> content){
        String filename = (String) content.get("filename");
        List<String> keywords = (List<String>) content.get("keywords");
        if(filename == null || keywords == null){
            return ResponseEntity.badRequest().body("Attention, le nom du fichier est inconnue au bataillon ou keywords null.");
        }
        try(Connection connexion = database.getConnection()){
            String json = "{\"Keys\":" + new ObjectMapper().writeValueAsString(keywords) + "}";
            String sql = "UPDATE documents SET keys = ?::jsonb WHERE filename = ?";
            try(PreparedStatement pstmt = connexion.prepareStatement(sql)){
                pstmt.setString(1, json);
                pstmt.setString(2, filename);
                int rows = pstmt.executeUpdate();
                if (rows > 0) {
                    return ResponseEntity.ok("✅ Mots clés ajoutés au fichier " + filename);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Aucun document trouvé avec le nom " + filename);
                }
            }
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur de connection à la database ! " + e.getMessage());
        }     
    }
}