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
        User SelectedUser = getUser(username, password);
        if(SelectedUser == null){
            throw new IllegalArgumentException("L'utilisateur recupéré n'existe pas.");
        }
        this.userRepository.deleteUser(SelectedUser.getId());
    }

    public User getUser(String username, String password) throws SQLException {
        for(User user : userRepository.getUsersTable()){
            if(user.getUsername().equals(username) && passwordEncoder.matches(password, user.getPasswordHash())){
                return user;
            }
        }
        return null;
    }

    public String findEmailByUsername(String username) throws SQLException{
        for(User user: userRepository.getUsersTable()){
            if(user.getUsername().equals(username)){
                return user.getEmailPhone();
            }
        }
        return null;
    }

    public User getUserByUsername(String username) throws SQLException{
        for(User user: userRepository.getUsersTable()){
            if(user.getUsername().equals(username)){
                return user;
            }
        }
        return null;
    }

    public boolean authentification(String username, String password) throws SQLException{
        for(User user : userRepository.getUsersTable()){
            if(user.getUsername().equals(username) && passwordEncoder.matches(password, user.getPasswordHash())){
                return passwordEncoder.matches(password, user.getPasswordHash());
            }
        }
        return false;
    }

}