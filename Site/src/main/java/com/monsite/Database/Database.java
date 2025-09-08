package com.monsite.Database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import javax.sql.DataSource;

@Component
public class Database {
    @Autowired
    private DataSource dataSource;

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

    public void PrintTableDocuments(){
        JsonNode tableDocuments = getDatabase("documents");
        if(tableDocuments != null){
            ArrayList<Integer> listID = new ArrayList<>();
            ArrayList<String> listFilename = new ArrayList<>();
            ArrayList<MediaType> listType = new ArrayList<>();
            ArrayList<byte[]> listData = new ArrayList<>();
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
                listID.add(id);
                listFilename.add(name);
                listType.add(type);
                listData.add(data);
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

    public void insertFile(String path_file, Connection conn, String table, int id ,String filename, MediaType type) throws Exception{
        // Lecture du Fichier 
        byte[] fileContent = Files.readAllBytes(Paths.get(path_file));
        if(table.equals("documents") || table.equals("compétences")){
            String sql = "INSERT INTO "+ table +" (id, filename, type, data) VALUES (?, ?, ?::jsonb, ?)";
                    try(PreparedStatement pstmt = conn.prepareStatement(sql)){
                        pstmt.setInt(1, id);
                        pstmt.setString(2, filename);
                        String jsonType = "{\"mediaType\":\"" + type.toString() + "\"}";
                        pstmt.setString(3, jsonType);
                        pstmt.setBytes(4, fileContent);
                        int rows = pstmt.executeUpdate();
                        if(rows > 0){
                            System.out.println("✅ Le document " + filename + "a bien été ajouté !");
                        }else{
                            System.out.println("⚠️  L'insertion du document "+ filename + " a échoué !");
                        }
                    }
        }else{
            System.out.println("⚠️  La table nommé "+ table +" n'existe pas au bataillon de cette base de données");
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
        int id = 0;
        if(files == null || files.length == 0){
            System.out.println("⚠️  Le dossier "+ folder + " est vide !");
            return;
        }else{
            for(File file : files){
                if(file.isFile()){
                    String filename = file.getName();
                    MediaType type = detectMediaType(file);
                    insertFile(file.getAbsolutePath(), conn, table, id, filename, type);
                }
                id++;
            }
        }
    }
}


