package com.monsite.Database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;

@Component
public class Database {
    @Value("${supabase.url}")
    private String URL;

    @Value("${supabase.key}")
    private String PASSWORD;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    public final ObjectMapper obj = new ObjectMapper();

    public JsonNode getDatabase(String table) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(URL + "/rest/v1/" + table ))
                    .header("apikey", PASSWORD)
                    .header("Authorization", "Bearer " + PASSWORD)
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                System.out.println("✅ Récupération de la table "+ table +"! ");
                return obj.readTree(response.body());
            } else {
                System.out.println("❌ Erreur de connexion à la table "+ table +" : " + response.statusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void PrintTableUsers(){
        JsonNode tableUsers = getDatabase("users");
        if(tableUsers != null){
            int[] listID = new int[tableUsers.size()];
            ArrayList<String> listUsername = new ArrayList<>();
            ArrayList<String> listPassword = new ArrayList<>();
            for (JsonNode user : tableUsers) {
                int id = user.get("id").asInt();
                String name = user.get("username").asText();
                String password = user.get("password").asText();
                listID[id] = id;
                listUsername.add(name);
                listPassword.add(password);
            }
            
        } else {
            System.out.println("⚠️  Attention la table Users est vide !");
        }
    }

    public void PrintTableDocuments(){
        JsonNode tableDocuments = getDatabase("documents");
        if(tableDocuments != null){
            int[] listID = new int[tableDocuments.size()];
            ArrayList<String> listFilename = new ArrayList<>();
            ArrayList<String> listType = new ArrayList<>();
            //byte[] listData;
            for (JsonNode doc : tableDocuments) {
                int id = doc.get("id").asInt();
                String name = doc.get("filename").asText();
                String type = doc.get("type").asText();
                //byte data = user.get("data").binaryValue();
                listID[id] = id;
                listFilename.add(name);
                listType.add(type);
            }
            
        } else {
            System.out.println("⚠️  Attention la table Users est vide !");
        }
    }

    public void PrintTableCompétences(){
        JsonNode tableCompétences = getDatabase("compétences");
        if(tableCompétences != null){
            int[] listID = new int[tableCompétences.size()];
            ArrayList<String> listFilename = new ArrayList<>();
            ArrayList<String> listType = new ArrayList<>();
            // byte[] ListData;
            for (JsonNode compétence : tableCompétences) {
                int id = compétence.get("id").asInt();
                String filename = compétence.get("filename").asText();
                String type = compétence.get("type").asText();
                //byte data = compétence.get("data").asBinary();
                listID[id] = id;
                listFilename.add(filename);
                listType.add(type);
            }
            
        } else {
            System.out.println("⚠️  Attention la table Users est vide !");
        }
    }

    

    /*public void insertPDF(String path_file, Connection conn, String table, String filename, String data) throws Exception{
        byte[] fileContent = Files.readAllBytes(Paths.get(path_file));
        String sql = "INSERT INTO " + table + " ( " + filename + ", "+ data +") VALUES (?, ?)";
    }*/

}


