package com.monsite.Controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monsite.Database.CompetencesRepository;
import com.monsite.Database.DocumentRepository;
import com.monsite.Database.Database;
import com.monsite.Database.UserRepository;
import com.monsite.Services.MailService;
import com.monsite.Services.UserService;
import com.monsite.Services.VerificationService;
import com.monsite.Services.CommentaireService;
import com.monsite.models.Document;
import com.monsite.models.User;
import com.monsite.models.VerifyRequest;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Connection;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

@Controller
public class HomeController {

    private final Database database;
    private final UserRepository userRepository;
    private final UserService userService;
    private final DocumentRepository documentRepository;
    private final CompetencesRepository competencesRepository;
    private final CommentaireService commentaireService;
    private final MailService mailService;
    private final VerificationService verificationService;

    public HomeController(Database database, UserRepository userRepository, UserService userService,DocumentRepository documentRepository, CompetencesRepository competencesRepository, CommentaireService commentaireService,MailService mailService, VerificationService verificationService) {
        this.database = database;
        this.userService = userService;
        this.userRepository = userRepository;
        this.commentaireService = commentaireService;
        this.competencesRepository = competencesRepository;
        this.documentRepository = documentRepository;
        this.mailService = mailService;
        this.verificationService = verificationService;
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

    @GetMapping("/about")
    public String About(){
        return "about";
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

    @DeleteMapping("/deleteUsers")
    public ResponseEntity<?> deleteUsers(@RequestBody Map<String, Object> content) throws SQLException{
        String username = (String) content.get("username");
        String password = (String) content.get("password");
        if(username == null || password == null ){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body("Données incorrectes");
        }
        try {
            boolean ok = userService.authentification(username, password);
            if(ok){
                userService.deleteUser(username, password);
                return ResponseEntity.ok("Compte supprimé avec succès !");
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Utilisateur non reconnu");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur lors de la suppression du compte");
        }
    }

    @DeleteMapping("/documents/{filename}")
    public ResponseEntity<?> deleteDocumentFile(@PathVariable String filename) throws IOException {
        try(Connection conn = database.getConnection()){
            if(documentRepository.isDocumentsFile(filename)){
                documentRepository.deleteFileDocuments(filename, conn);
                return new ResponseEntity<>("La suppression du fichier " + filename + " a bien été effectué." ,HttpStatus.NO_CONTENT);
            }else{
                return new ResponseEntity<>("Erreur rencontrée lors de l'obtention du fichier " + filename + " : " ,HttpStatus.NOT_FOUND);
            }
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Erreur de connection à la database ! " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }    
    }

    @GetMapping(value = "/documents/{filename}", produces = {MediaType.APPLICATION_PDF_VALUE, "application/vnd.oasis.opendocument.text"})
    public ResponseEntity<?> getDocumentFile(@PathVariable String filename) {
        try (Connection conn = database.getConnection()) {
            Document doc = documentRepository.getDocumentFile(filename);
            if (doc == null) {
                return new ResponseEntity<>("Fichier non trouvé dans la base de données.", HttpStatus.NOT_FOUND);
            }

            ByteArrayInputStream bis = new ByteArrayInputStream(doc.getData());
            InputStreamResource resource = new InputStreamResource(bis);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFilename() + "\"")
                    .contentLength(doc.getData().length)
                    .contentType(MediaType.parseMediaType(doc.getType()))
                    .body(resource);
        } catch (Exception e) {
            return new ResponseEntity<>("Erreur lors de la récupération du fichier " + filename + " : " + e.getMessage(), HttpStatus.CONFLICT);
        }
    }



    @GetMapping("/users")
    @ResponseBody
    public List<Map<String, Object>> getUsers() throws SQLException{
            List<User> users = userRepository.getUsersTable();
            List<Map<String, Object>> usernames = new ArrayList<>();
            for (User user : users){
                Map<String, Object> map = new HashMap<>();
                map.put("id", user.getId());
                map.put("mail_phone", user.getEmailPhone());
                map.put("username", user.getUsername());
                map.put("password", user.getPasswordHash());
                usernames.add(map);
            }
            return usernames;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String,String> credentials) throws SQLException{
        String username = credentials.get("username");
        String password = credentials.get("password");
        if(username == null || password == null){
            return ResponseEntity.badRequest().body("Username ou password manquant");
        }
        boolean ok = userService.authentification(username, password);
        if(ok){
            return ResponseEntity.ok("Utilisateur connecté");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Utilisateur non reconnu");
        }
    }

    @GetMapping("/keywords")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> getKeywords() throws SQLException , IOException{

        List<Document> documents = documentRepository.getDocumentsTable();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Document doc : documents) {

            Map<String, Object> map = new HashMap<>();
            map.put("filename", doc.getFilename());

            Map<String, Object> keysWrapper = new HashMap<>();

            if (doc.getKeys() == null) {
                keysWrapper.put("Keys", new String[0]);
            } else {
                keysWrapper.put("Keys", doc.getKeys());
            }

            map.put("keys", keysWrapper);
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }


    @PostMapping(value = "/addUsers", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addUsers(@RequestBody Map<String, Object> content) throws SQLException{
        String username = (String) content.get("username");
        String email_phone = (String) content.get("mail_phone");
        String password = (String) content.get("password");
        if(username == null || email_phone == null || password == null || password.length() < 5){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body("Données incorrectes ou mot de passe trop court");
        }
        try {
            userService.createUser(email_phone, username, password);
            return ResponseEntity.ok("Utilisateur ajouté avec succès !");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur lors de la création utilisateur");
        }
    }

    @PostMapping(value = "/addkeywords", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addKeyWords(@RequestBody Map<String, Object> content){
        List<String> newKeywords = (List<String>) content.get("keywords");
        String filename = (String) content.get("filename");
        if(filename == null || newKeywords == null){
            return ResponseEntity.badRequest().body("Attention, le nom du fichier est inconnue au bataillon ou keywords null.");
        }
        try(Connection connexion = database.getConnection()){
            String sql = "SELECT keys FROM documents WHERE filename = ?";
            List<String> selectSQL = new ArrayList<>();
            try(PreparedStatement pstmt = connexion.prepareStatement(sql)){
                pstmt.setString(1, filename);
                ResultSet rs = pstmt.executeQuery();
                if(rs.next()){
                    String json = rs.getString("keys");
                    if (json != null) {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(json);
                        JsonNode keysNode = root.get("Keys");
                        if (keysNode != null && keysNode.isArray()) {
                            for (JsonNode node : keysNode) {
                                selectSQL.add(node.asText());
                            }
                        }
                    }
                }
            }
            for (String k : newKeywords) {
                if (!selectSQL.contains(k)) {
                    selectSQL.add(k);
                }
            }
             String jsonToSave = "{\"Keys\":" + new ObjectMapper().writeValueAsString(selectSQL) + "}";

            String updateSql = "UPDATE documents SET keys = ?::jsonb WHERE filename = ?";
            try (PreparedStatement pstmt = connexion.prepareStatement(updateSql)) {
                pstmt.setString(1, jsonToSave);
                pstmt.setString(2, filename);
                int rows = pstmt.executeUpdate();

                if (rows > 0) {
                    return ResponseEntity.ok("✅ Mots-clés mis à jour pour " + filename + " : " + selectSQL);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Aucun document trouvé avec le nom " + filename);
                }
            }
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur de connection à la database ! " + e.getMessage());
        }     
    }

    @PostMapping(value = "/addDocumentsFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addDocumentsFile(@RequestParam("file") MultipartFile file,
                                                   @RequestParam("filename") String filename,
                                                   @RequestParam(value = "keywords", required = false) String jsonKeywords){
        try {
            String type = file.getContentType();
            byte[] data = file.getBytes();
            List<String> keywords = new ObjectMapper().readValue(
                jsonKeywords != null ? jsonKeywords : "[]",
                new TypeReference<List<String>>() {}
            );
        
            String jsonKeys = "{\"Keys\":" + new ObjectMapper().writeValueAsString(keywords) + "}";
            String jsonType = "{\"mediaType\":\"" + type + "\"}";
    
            try(Connection connexion = database.getConnection()){
                String sql = "INSERT INTO documents (filename, type, data, keys) VALUES (?, ?::jsonb, ?, ?::jsonb)";
                try(PreparedStatement pstmt = connexion.prepareStatement(sql)){
                    pstmt.setString(1, filename);
                    pstmt.setString(2, jsonType);
                    pstmt.setBytes(3, data);
                    pstmt.setString(4, jsonKeys);
                    int rows = pstmt.executeUpdate();
                    if (rows > 0) {
                        String folderPathDocument = "src/main/resources/static/documents";
                        File folder = new File(folderPathDocument);
                        if(!folder.exists()){
                            folder.mkdirs();
                        } 
                        File localFile = new File(folder, filename);
                        Files.write(localFile.toPath(), data);
                        return ResponseEntity.ok("✅ Fichier ajouté au dossier documents ");
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Aucun fichier n'as pu être ajouté ");
                    }
                }
            }catch(Exception e){
                e.printStackTrace();
                return ResponseEntity.internalServerError().body("Erreur de connection à la database ! " + e.getMessage());
            }    
        }
        catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur :" + e.getMessage());
        } 
    }

    @GetMapping("/test-mail")
    public ResponseEntity<?> testMail(){
        try {
            mailService.TestSendMail("");
            return ResponseEntity.ok("Le mail a été envoyée avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body("Erreur lors de l'envoie du mail à ");
        }
    }

    @PostMapping(value = "/mail-code-verification", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> AddCodeVerificationMail(@RequestBody Map<String, String> body){
        String mail_phone = body.get("mail_phone");
        if(mailService.isEmail(mail_phone)){
            try {
                verificationService.sendCodeByEmail(mail_phone);
                return ResponseEntity.ok("Le mail a été envoyée avec succès");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Erreur lors de l'envoie du mail à "+ mail_phone);
            }
        }
        if(mailService.isPhone(mail_phone)){
            return ResponseEntity.status(404).body("On ne peut pas encore gérer les téléphones en raison de soucis financier");
        }
        else{
            return ResponseEntity.status(404).body("Les données envoyées ne correspondent ni à un mail ni à un numéro de téléphone valide");
        }
    }

    @PostMapping(value = "/verify-code", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
        try {
            boolean ok = verificationService.verifyCode(
                request.getMail_phone(),
                request.getCode()
            );
            if(ok){
                return ResponseEntity.ok("Code validé");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Code invalide ou expiré");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur");
        }
    }

    @PostMapping(value = "/add_comment", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addCommentaire(@RequestBody Map<String, Object> content) throws SQLException{
        User user = (User) content.get("user");
        String username = user.getUsername();
        if(username == null){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("La récupération du nom de l'utilisateur n'a pas été récupérer correctement.");
        }
        String commentaire = (String) content.get("commentaire");
        try{
            commentaireService.AddCommentaire(username, commentaire);
            mailService.mailNewComment(user, commentaire);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Le commentaire a bien été ajoutée");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur lors de la création du commentaire");
        }
    }

}