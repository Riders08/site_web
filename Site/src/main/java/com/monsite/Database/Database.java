package com.monsite.Database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class Database {
    @Value("${supabase.url}")
    private String URL;

    @Value("${supabase.key}")
    private String PASSWORD;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void getDatabase() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(URL + "/rest/v1/Users?limit=1" ))
                    .header("apikey", PASSWORD)
                    .header("Authorization", "Bearer " + PASSWORD)
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                System.out.println("✅ Connexion à Supabase réussie !");
            } else {
                System.out.println("❌ Erreur de connexion : " + response.statusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
