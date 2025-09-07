package com.monsite;

import com.monsite.Database.Database;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import java.sql.Connection;

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(App.class, args);
        Database database = context.getBean(Database.class);
        try(Connection conn = database.getConnection()){
            database.PrintTableUsers();
            String folderPathDocuments = "src/main/resources/static/documents";
            String folderPathCompétences = "src/main/resources/static/compétences";
            String table_documents = "documents";
            String table_compétences = "compétences";
            database.insertFileToFolder(folderPathDocuments, conn, table_documents);
            database.insertFileToFolder(folderPathCompétences, conn, table_compétences);
        }catch(Exception e){
            e.printStackTrace();
        }
        
    }
}
