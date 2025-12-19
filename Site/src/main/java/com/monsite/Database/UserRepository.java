package com.monsite.Database;


import java.util.ArrayList;

import org.springframework.stereotype.Repository;

import com.monsite.models.User;

import java.sql.*;

@Repository
public class UserRepository {
    private final Database database;

    public UserRepository(Database database){
        this.database = database;
    }

    public ArrayList<User> getUsersTable() throws SQLException{
        String sql = "SELECT id, mail_phone, username, password FROM users";
        ArrayList<User> list_users = new ArrayList<>();
        try (Connection conn = this.database.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)){
                while(rs.next()){
                    User user = new User();
                    user.setId(rs.getLong("id"));
                    user.setEmailPhone(rs.getString("mail_phone"));
                    user.setUsername(rs.getString("username"));
                    user.setPasswordHash(rs.getString("password"));
                    list_users.add(user);
                }
        }
        return list_users; 
    }

    public void clearTable() throws SQLException {
        String sql = "TRUNCATE TABLE users RESTART IDENTITY";
        try(Connection conn = this.database.getConnection()){
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.executeUpdate();
        }catch(SQLException e){
            e.printStackTrace();
        }
    }

    public void insertUsers(User user) throws SQLException{
        String sql = "INSERT INTO users (mail_phone, username, password) VALUES (?, ?, ?)";
        try(Connection conn = database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
            pstmt.setString(1, user.getEmailPhone());
            pstmt.setString(2, user.getUsername());
            pstmt.setString(3, user.getPasswordHash());
            int rows = pstmt.executeUpdate();
            if(rows > 0){
                System.out.println("✅ L'utilisateur " + user.getUsername() + " a bien été ajouté !");
            }else{
                System.out.println("⚠️  L'insertion de l'utilisateur "+ user.getUsername() + " a échoué !");
            }
        }
    }

    public void PrintTableUsers() throws SQLException{
        ArrayList<User> getUsers = getUsersTable();
        ArrayList<Long> listID = new ArrayList<>();
        ArrayList<String> listEmailPhone = new ArrayList<>();
        ArrayList<String> listUsername = new ArrayList<>();
        ArrayList<String> listPassword = new ArrayList<>();
        for (User user : getUsers) {
            long id = user.getId();
            String emailPhone = user.getEmailPhone();
            String name = user.getUsername();
            String password = user.getPasswordHash();
            listID.add(id);
            listEmailPhone.add(emailPhone);
            listUsername.add(name);
            listPassword.add(password);
        }
        for (int i = 0; i < getUsers.size(); i++) {
            System.out.println(
                " | ID: " + listID.get(i) + 
                " | Email/Phone: " + listEmailPhone.get(i) + 
                " | Username: " + listUsername.get(i) + 
                " | Password: " + listPassword.get(i));
        }
    }
}
