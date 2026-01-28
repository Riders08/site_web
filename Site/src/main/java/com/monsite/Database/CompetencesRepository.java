package com.monsite.Database;


import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;

@Repository
public class CompetencesRepository {
    
    private final Database database;
    
    public CompetencesRepository(Database database){
        this.database = database;
    }

    public void insertFileCompétences(String path_file, String filename, MediaType type) throws Exception{
        byte[] fileContent = Files.readAllBytes(Paths.get(path_file));
        String sqlCheck = "SELECT COUNT(*) FROM compétences WHERE filename = ?";
        try (Connection conn = database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sqlCheck)) {
            pstmt.setString(1, filename);
            ResultSet rs = pstmt.executeQuery();
            if(rs.next() && rs.getInt(1) > 0){
                System.out.println("⚠️  Le fichier " + filename + " existe déjà dans compétences");
                return;
            }
        }
        String sql = "INSERT INTO compétences (id, filename, type, data) VALUES (DEFAULT, ?, ?::jsonb, ?)";
        try(Connection conn = database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
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

    public void clearTable() throws SQLException {
        String sql = "TRUNCATE TABLE compétences RESTART IDENTITY";
        try(Connection conn = this.database.getConnection()){
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.executeUpdate();
        }catch(SQLException e){
            e.printStackTrace();
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
                    insertFileCompétences(file.getAbsolutePath(), filename, type);
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
        String sql = "SELECT filename, data FROM compétences";
        File folder = new File(path_folder);
        if(!folder.exists()){
            System.err.println(" ERREUR: le chemin du dossier : " + path_folder + " n'existe pas, vérifiée le chemin et l'existence du dossier.");
        }
        try ( Connection conn = database.getConnection(); 
            PreparedStatement pstmt = conn.prepareStatement(sql);
              ResultSet rs = pstmt.executeQuery()) {
                while(rs.next()){
                    String filename = rs.getString("filename");
                    byte[] data = rs.getBytes("data");
                    if(data != null && data.length > 0 && !alreadyExists(path_folder, filename)){
                        File file = new File(folder, filename);
                        Files.write(file.toPath(), data);
                        System.out.println("✅ Le document " + filename + " a bien été mise à jour dans le dossier compétences local !");
                    }
                }
        }catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Erreur lors de l’export des compétences !");
        }
    }
}
