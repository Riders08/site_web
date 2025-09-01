package com.monsite.Controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class Database {
    public static void main(String[] args) {
        String URL = "jdbc:postgresql://db.koblvmraettreqsehpmc.supabase.co:5432/postgres" ;
        String USER = "postgres";
        String PASSWORD = "hPHB16wh1qW65dzl";
        try (
            Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            Statement statement = connection.createStatement()){
            ResultSet resultat = statement.executeQuery("SELECT * FROM Documents");
            // test pour verif la table
            while (resultat.next()) {
                System.out.println(resultat.getString("id"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
