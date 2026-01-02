package com.monsite;

import com.monsite.Database.CompetencesRepository;
import com.monsite.Database.Database;
import com.monsite.Database.DocumentRepository;
import com.monsite.Database.UserRepository;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import java.sql.Connection;

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(App.class, args);
        Database database = context.getBean(Database.class);
        UserRepository userRepository = context.getBean(UserRepository.class);
        DocumentRepository documentRepository = context.getBean(DocumentRepository.class);
        CompetencesRepository competencesRepository = context.getBean(CompetencesRepository.class);

        String folderPathDocuments = "src/main/resources/static/documents";
        String folderPathCompétences = "src/main/resources/static/compétences";
        try(Connection conn = database.getConnection()){
            userRepository.PrintTableUsers();
            // documentRepository.clearTable();
            // competencesRepository.clearTable();
            documentRepository.insertFileToFolder(folderPathDocuments);
            documentRepository.exportAllFiles(folderPathDocuments);
            competencesRepository.insertFileToFolder(folderPathCompétences);
            competencesRepository.exportAllFiles(folderPathCompétences);
        }catch(Exception e){
            e.printStackTrace();
        }
        
    }
}
