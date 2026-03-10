package com.monsite.Database;


import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monsite.models.Document;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

@Repository
public class DocumentRepository {
    private final Database database;

    public DocumentRepository(Database database){
        this.database = database;
    }

    public ArrayList<Document> getDocumentsTable() throws SQLException, IOException{
        String sql = "SELECT id, filename, type, data, keys FROM documents";
        ArrayList<Document> list_documents = new ArrayList<>();
        ObjectMapper obj = new ObjectMapper();
        try (Connection conn = this.database.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)){
                while(rs.next()){
                    Document document = new Document();
                    document.setId(rs.getLong("id"));
                    document.setFilename(rs.getString("filename"));
                    document.setType(rs.getString("type"));
                    document.setData(rs.getBytes("data"));
                    String keysJson = rs.getString("keys");
                    if (keysJson != null) {
                        JsonNode root = obj.readTree(keysJson);
                        JsonNode keysNode = root.get("Keys");
                        if (keysNode != null && keysNode.isArray()) {
                            String[] keys = new String[keysNode.size()];
                            for (int i = 0; i < keysNode.size(); i++) {
                                keys[i] = keysNode.get(i).asText();
                            }
                            document.setKeys(keys);
                        }
                    }
                    list_documents.add(document);
                }
        }
        return list_documents; 
    }

    public Document getDocumentFile(String filename) throws SQLException, IOException{
        String sql = "SELECT id, filename, type, data, keys FROM documents WHERE filename = ?";
        ObjectMapper obj = new ObjectMapper();
        try (Connection conn = this.database.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
                ps.setString(1, filename);
                try(ResultSet rs = ps.executeQuery()){
                    if(rs.next()){
                        Document document = new Document();
                        document.setId(rs.getLong("id"));
                        document.setFilename(rs.getString("filename"));
                        document.setType(rs.getString("type"));
                        document.setData(rs.getBytes("data"));
                        String keysJson = rs.getString("keys");
                        if (keysJson != null) {
                            JsonNode root = obj.readTree(keysJson);
                            JsonNode keysNode = root.get("Keys");
                            if (keysNode != null && keysNode.isArray()) {
                                String[] keys = new String[keysNode.size()];
                                for (int i = 0; i < keysNode.size(); i++) {
                                    keys[i] = keysNode.get(i).asText();
                                }
                                document.setKeys(keys);
                            }
                        }
                        return document;
                    }
                }
            }
        return null;
    }

    public boolean isDocumentsFile(String filename) throws Exception{
        String sql = "SELECT 1 FROM documents WHERE filename = ?";
        try (Connection conn = database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
                pstmt.setString(1, filename);
                return pstmt.executeQuery().next();
        }
    }

    public void clearTable() throws SQLException {
        String sql = "TRUNCATE TABLE documents RESTART IDENTITY";
        try(Connection conn = this.database.getConnection()){
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.executeUpdate();
        }catch(SQLException e){
            e.printStackTrace();
        }
    }

    public void insertFileDocuments(String path_file, String filename, MediaType type) throws Exception{
        byte[] fileContent = Files.readAllBytes(Paths.get(path_file));
        String sqlCheck = "SELECT COUNT(*) FROM documents WHERE filename = ?";
        try (Connection conn = database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sqlCheck)) {
            pstmt.setString(1, filename);
            ResultSet rs = pstmt.executeQuery();
            if(rs.next() && rs.getInt(1) > 0){
                System.out.println("⚠️  Le fichier " + filename + " existe déjà dans documents");
                return;
            }
        }
        String sql = "INSERT INTO documents (id, filename, type, data, keys) VALUES (DEFAULT, ?, ?::jsonb, ?, ?::jsonb)";
        try(Connection conn = database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
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

    public void insertFileToFolder(String path_folder)throws Exception{
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
                    insertFileDocuments(file.getAbsolutePath(), filename, type);
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

    public void exportAllFiles(String path_folder) throws Exception {
        String sql = "SELECT filename, data FROM documents" ;
        File folder = new File(path_folder);
        if(!folder.exists()){
            System.err.println(" ERREUR: le chemin du dossier : " + path_folder + " n'existe pas, vérifiée le chemin et l'existence du dossier.");
        }
        try (Connection conn = database.getConnection(); 
             PreparedStatement pstmt = conn.prepareStatement(sql);
              ResultSet rs = pstmt.executeQuery()) {
                while(rs.next()){
                    String filename = rs.getString("filename");
                    byte[] data = rs.getBytes("data");
                    if(data != null && data.length > 0 && !alreadyExists(path_folder, filename)){
                        File file = new File(folder, filename);
                        Files.write(file.toPath(), data);
                        System.out.println("✅ Le document " + filename + " a bien été mise à jour dans le dossier documents local !");
                    }
                }
        }catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Erreur lors de l’export des documents !");
        }
    }
}
