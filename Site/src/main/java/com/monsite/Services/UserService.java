package com.monsite.Services;

import java.sql.SQLException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.monsite.Database.UserRepository;
import com.monsite.models.User;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(BCryptPasswordEncoder passwordEncoder, UserRepository uRepository){
        this.passwordEncoder = passwordEncoder;
        this.userRepository = uRepository;
    }

    public void createUser(String emailPhone, String username, String password) throws SQLException{
        String hash = passwordEncoder.encode(password);
        User newUser = new User(emailPhone,username, hash);
        this.userRepository.insertUsers(newUser);
    }

    public void deleteUser(String username, String password) throws SQLException{
        String hash = passwordEncoder.encode(password);
        User SelectedUser = getUser(username, hash);
        this.userRepository.deleteUser(SelectedUser);
    }

    public User getUser(String username, String password) throws SQLException {
        for(User user : userRepository.getUsersTable()){
            if(user.getUsername().equals(username) && passwordEncoder.matches(password, user.getPasswordHash())){
                return user;
            }
        }
        return null;
    }

    public boolean authentification(String username, String password) throws SQLException{
        for(User user : userRepository.getUsersTable()){
            if(user.getUsername().equals(username)){
                return passwordEncoder.matches(password, user.getPasswordHash());
            }
        }
        return false;
    }

}