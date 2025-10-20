package com.monsite.Database;

import com.monsite.Controller.Document;
import com.monsite.Controller.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;

import javax.print.attribute.standard.Media;
import javax.sql.DataSource;

@Component
public class Database {
    @Autowired
    private DataSource dataSource;

    public ArrayList<String> listTable = new ArrayList<>(
        Arrays.asList("users","documents","compétences")
    );

    public final ObjectMapper obj = new ObjectMapper();
    public JsonNode getDatabase(String table) {
        ArrayNode arrayNode = obj.createArrayNode();
        String sql = "SELECT * FROM " + table;
        try (Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)) {

            ResultSetMetaData meta = rs.getMetaData();
            int columnCount = meta.getColumnCount();

            while (rs.next()) {
                ObjectNode row = obj.createObjectNode();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = meta.getColumnName(i);
                    Object value = rs.getObject(i);
                    if (value instanceof byte[]) {
                        row.put(columnName, java.util.Base64.getEncoder().encodeToString((byte[]) value));
                    } else if (value != null) {
                        row.put(columnName, value.toString());
                    } else {
                        row.putNull(columnName);
                    }
                }
                arrayNode.add(row);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return arrayNode;
    }

    public void clearTable(String table) throws SQLException {
        for(String tbl : this.listTable){
            if(table.equals(tbl)){
                String sql = "TRUNCATE TABLE " + table + " RESTART IDENTITY";
                try(Connection conn = dataSource.getConnection()){
                    PreparedStatement pstmt = conn.prepareStatement(sql);
                    pstmt.executeUpdate();
                    break;
                }catch(SQLException e){
                    e.printStackTrace();
                }
            }
        }
    }

    public Connection getConnection() throws SQLException{
        return dataSource.getConnection();
    }

    public void PrintTableUsers(){
        JsonNode tableUsers = getDatabase("users");
        if(tableUsers != null){
            ArrayList<Integer> listID = new ArrayList<>();
            ArrayList<String> listUsername = new ArrayList<>();
            ArrayList<String> listPassword = new ArrayList<>();
            for (JsonNode user : tableUsers) {
                int id = user.get("id").asInt();
                String name = user.get("username").asText();
                String password = user.get("password").asText();
                listID.add(id);
                listUsername.add(name);
                listPassword.add(password);
            }
            for (int i = 0; i < tableUsers.size(); i++) {
                System.out.println("ID: " + listID.get(i) + " | Username: " + listUsername.get(i) + " | Password: " + listPassword.get(i));
            }
        } else {
            System.out.println("⚠️  Attention la table users est vide !");
        }
    }

    public ArrayList<User> getUsersTable(){
        JsonNode tableUsers = getDatabase("users");
        ArrayList<User> list_users = new ArrayList<>();
        if(tableUsers != null){
            for(JsonNode u : tableUsers){
                User user = new User();
                user.setUsername(u.get("username").asText());
                user.setPassword(u.get("password").asText());
                list_users.add(user);
            }
        }
        return list_users; 
    }

    public boolean isDocumentsFile(String filename){
        JsonNode documents = getDatabase("documents");
        if(documents != null){
            for(JsonNode element : documents){
                if(element.get("filename").asText().equals(filename)){
                    return true;
                }
            }
        }
        return false;
    }

    public Document getDocumentFile(String filename, Connection conn) throws Exception{
        if(isDocumentsFile(filename)){
            String sql = "SELECT data, type FROM documents WHERE filename = ?";
            try(PreparedStatement pstmt = conn.prepareStatement(sql)){
                pstmt.setString(1, filename);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        byte[] fileData = rs.getBytes("data");
                        String json = rs.getString("type");
                        MediaType fileType = MediaType.APPLICATION_OCTET_STREAM;
                        if(json != null && !json.isEmpty()){
                            JsonNode typeDocument = obj.readTree(json);
                            if(typeDocument.has("mediaType")){
                                fileType = MediaType.valueOf(typeDocument.get("mediaType").asText());
                            } else if(typeDocument.isTextual()){
                                fileType = MediaType.valueOf(typeDocument.asText());
                            }else{
                                System.out.println("⚠️  Le type du fichier " + filename + " est inexistant !");
                            }
                            return new Document(fileData, fileType.toString(), filename);
                        }
                    } 
                }
            }
        }
        return null;
    }


    public void PrintTableDocuments(){
        JsonNode tableDocuments = getDatabase("documents");
        if(tableDocuments != null){
            ArrayList<Integer> listID = new ArrayList<>();
            ArrayList<String> listFilename = new ArrayList<>();
            ArrayList<MediaType> listType = new ArrayList<>();
            ArrayList<byte[]> listData = new ArrayList<>();
            ArrayList<String[]> listKeys = new ArrayList<>();
            for (JsonNode doc : tableDocuments) {
                int id = doc.get("id").asInt();
                String name = doc.get("filename").asText();
                MediaType type;
                JsonNode typedoc = doc.get("type");
                if(typedoc != null && typedoc.has("mediaType")){
                    type = MediaType.valueOf(typedoc.get("mediaType").asText());
                }else if (typedoc != null){
                    type = MediaType.valueOf(typedoc.asText()); 
                }else{
                    System.out.println("⚠️  Le type du fichier "+ name +" est inexistant !");
                    type = null; 
                }
                byte[] data;
                try{
                    data = doc.get("data").binaryValue();
                }catch(Exception e){
                    System.out.println("⚠️  Impossible de convertir les bytea du fichier "+  name +" !");
                    data = null;
                }
                JsonNode keys = doc.get("keys");
                String[] key = null;
                if(keys != null && keys.isArray()){
                    key = new String[keys.size()];
                    for(int i = 0;i < keys.size();i++){
                        key[i] = keys.get(i).asText();
                    }
                }else{
                    System.err.println("Les keys associacié au document " + name + " sont nulles");
                }
                listID.add(id);
                listFilename.add(name);
                listType.add(type);
                listData.add(data);
                listKeys.add(key);
                for (int i = 0; i < tableDocuments.size(); i++) {
                    System.out.println("ID: " + listID.get(i) + " | filename: " + listFilename.get(i) + " | type: " + listType.get(i) + " | data length: " + (listData.get(i).length));
                }
            }
        } else {
            System.out.println("⚠️  Attention la table documents est vide !");
        }
    }

    public void PrintTableCompétences(){
        JsonNode tableCompétences = getDatabase("compétences");
        if(tableCompétences != null){
            ArrayList<Integer> listID = new ArrayList<>();
            ArrayList<String> listFilename = new ArrayList<>();
            ArrayList<MediaType> listType = new ArrayList<>();
            ArrayList<byte[]> listData = new ArrayList<>();
            for (JsonNode compétence : tableCompétences) {
                int id = compétence.get("id").asInt();
                String filename = compétence.get("filename").asText();
                MediaType type;
                JsonNode typedoc = compétence.get("type");
                if (typedoc != null && typedoc.has("mediaType")){
                    type = MediaType.valueOf(typedoc.get("mediaType").asText());
                }else if (typedoc != null){
                    type = MediaType.valueOf(typedoc.asText()); 
                }else {
                    System.out.println("⚠️  Le type du fichier "+ filename +" est inexistant !");
                    type = null;
                }
                byte[] data;
                try{
                    data = compétence.get("data").binaryValue();
                }catch(Exception e){
                    System.out.println("⚠️  Impossible de convertir les bytea du fichier "+ filename + " !");
                    data = null;
                }
                listID.add(id);
                listFilename.add(filename);
                listType.add(type);
                listData.add(data);
            }  
            for(int i = 0; i < tableCompétences.size();i++){
                System.out.println("ID: "+ listID.get(i) +" | filename: "+ listFilename.get(i) +" | type: "+ listType.get(i) +" | data length: "+ (listData.get(i).length));
            }
        } else {
            System.out.println("⚠️  Attention la table compétences est vide !");
        }
    }

    public void insertUsers(Connection conn, int id, String username, String password) throws Exception{
        String sql = "INSERT INTO users (id, username, password) VALUES (?, ?, ?)";
        try(PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setInt(1, id);
            pstmt.setString(2, username);
            pstmt.setString(3, password);
            int rows = pstmt.executeUpdate();
            if(rows > 0){
                System.out.println("✅ L'utilisateur " + username + "a bien été ajouté !");
            }else{
                System.out.println("⚠️  L'insertion de l'utilisateur "+ username + " a échoué !");
            }
        }
    }

    public void insertFileCompétences(String path_file, Connection conn, String filename, MediaType type) throws Exception{
        byte[] fileContent = Files.readAllBytes(Paths.get(path_file));
        String sqlCheck = "SELECT COUNT(*) FROM compétences WHERE filename = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sqlCheck)) {
            pstmt.setString(1, filename);
            ResultSet rs = pstmt.executeQuery();
            if(rs.next() && rs.getInt(1) > 0){
                System.out.println("⚠️  Le fichier " + filename + " existe déjà dans compétences");
                return;
            }
        }
        String sql = "INSERT INTO compétences (id, filename, type, data) VALUES (DEFAULT, ?, ?::jsonb, ?)";
        try(PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setString(1, filename);
            String jsonType = "{\"mediaType\":\"" + type.toString() + "\"}";
            pstmt.setString(2, jsonType);
            pstmt.setBytes(3, fileContent);
            int rows = pstmt.executeUpdate();
            if(rows > 0){
                System.out.println("✅ Le document " + filename + " a bien été ajouté !");
            }else{
                System.out.println("⚠️  L'insertion du document "+ filename + " a échoué !");
            }
        }
    }


    public void insertFileDocuments(String path_file, Connection conn, String filename, MediaType type) throws Exception{
        byte[] fileContent = Files.readAllBytes(Paths.get(path_file));
        String sqlCheck = "SELECT COUNT(*) FROM documents WHERE filename = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sqlCheck)) {
            pstmt.setString(1, filename);
            ResultSet rs = pstmt.executeQuery();
            if(rs.next() && rs.getInt(1) > 0){
                System.out.println("⚠️  Le fichier " + filename + " existe déjà dans documents");
                return;
            }
        }
        String sql = "INSERT INTO documents (id, filename, type, data, keys) VALUES (DEFAULT, ?, ?::jsonb, ?, ?::jsonb)";
        try(PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setString(1, filename);
            String jsonType = "{\"mediaType\":\"" + type.toString() + "\"}";
            pstmt.setString(2, jsonType);
            pstmt.setBytes(3, fileContent);
            Scanner scan = new Scanner(System.in);
            System.out.println("💡 Nouveau fichier détecté : " + filename);
            System.out.println("Souhaitez-vous ajouter des mots-clés pour ce fichier ? (oui/non)");
            String reponse = scan.nextLine().trim().toLowerCase();
            String KeysJson;
            if(reponse.equals("oui") || reponse.equals("o")){
                System.out.println("Entrez les mots-clés souhaités, veuillez les séparés par des virgules : ");
                String keys = scan.nextLine();
                String[] keyswords = Arrays.stream(keys.split(","))
                                         .map(String::trim) 
                                         .filter(c -> !c.isEmpty())
                                         .toArray(String[]::new);
                KeysJson = "{\"Keys\":" + new ObjectMapper().writeValueAsString(keyswords) + "}";
            } else {
                KeysJson = "null";
            }
            scan.close();
            pstmt.setString(4, KeysJson);
            
            int rows = pstmt.executeUpdate();
            if(rows > 0){
                System.out.println("✅ Le document " + filename + " a bien été ajouté !");

            }else{
                System.out.println("⚠️  L'insertion du document "+ filename + " a échoué !");
            }
        }
    }

    public void deleteFileDocuments(String filename, Connection conn) throws Exception{
        if(isDocumentsFile(filename)){
            String sql = "DELETE FROM documents WHERE filename = ? ";
            try(PreparedStatement pstmt = conn.prepareStatement(sql)){
                pstmt.setString(1, filename);
                int rows = pstmt.executeUpdate();
                if(rows > 0){
                    System.out.println("✅ Le document " + filename + " a bien été supprimé !");
                }else{
                    System.out.println("⚠️  La suppression du document "+ filename + " a échoué !");
                }
            }

        }       
    }

    public MediaType detectMediaType(File file) throws IOException{
        String extension = Files.probeContentType(file.toPath());
        if(extension == null){
            extension = "application/octet-stream";
        }
        System.out.println(extension);
        MediaType type_to_return = MediaType.valueOf(extension);
        return type_to_return;
    }

    public void insertFileToFolder(String path_folder, Connection conn, String table)throws Exception{
        File folder = new File(path_folder);
        if (!folder.exists() || !folder.isDirectory()){
            System.out.println("⚠️  Le dossier "+ folder +" n'existe pas !");
            return;
        }
        File[] files = folder.listFiles();
        if(files == null || files.length == 0){
            System.out.println("⚠️  Le dossier "+ folder + " est vide !");
            return;
        }else{
            for(File file : files){
                if(file.isFile()){
                    String filename = file.getName();
                    MediaType type = detectMediaType(file);
                    if(table.equals("documents")){
                        insertFileDocuments(file.getAbsolutePath(), conn, filename, type);
                    }else if(table.equals("compétences")){
                        insertFileCompétences(file.getAbsolutePath(), conn, filename, type);
                    }
                }
            }        
        }
    }

    public boolean alreadyExists(String path_folder, String filename){
        File folder = new File(path_folder);
        File[] files = folder.listFiles();
        if(!folder.exists()){
            System.err.println(" ERREUR: le chemin du dossier : " + path_folder + " n'existe pas, vérifiée le chemin et l'existence du dossier.");
            return false;
        }
        for(File file : files){
            if(file.getName().equals(filename)){
                return true;
            }
        }
        return false;
    }

    public void exportAllFiles(String path_folder, String table ,Connection conn) throws Exception {
        String sql = "SELECT filename, data FROM " + table;
        File folder = new File(path_folder);
        if(!folder.exists()){
            System.err.println(" ERREUR: le chemin du dossier : " + path_folder + " n'existe pas, vérifiée le chemin et l'existence du dossier.");
        }
        try ( PreparedStatement pstmt = conn.prepareStatement(sql);
              ResultSet rs = pstmt.executeQuery()) {
                while(rs.next()){
                    String filename = rs.getString("filename");
                    byte[] data = rs.getBytes("data");
                    if(data != null && data.length > 0 && !alreadyExists(path_folder, filename)){
                        File file = new File(folder, filename);
                        Files.write(file.toPath(), data);
                        System.out.println("✅ Le document " + filename + " a bien été mise à jour dans le dossier "+ table +" local !");
                    }
                }
        }catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Erreur lors de l’export des "+ table +" !");
        }
    }
}


