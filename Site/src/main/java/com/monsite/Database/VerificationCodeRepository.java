package com.monsite.Database;

import com.monsite.models.VerificationCode;
import org.springframework.stereotype.Repository;

import java.sql.*;

@Repository
public class VerificationCodeRepository {

    private final Database database;

    public VerificationCodeRepository(Database database) {
        this.database = database;
    }

    public void save(VerificationCode code) throws SQLException{
        String sql = "INSERT INTO email_verification (email, code, expiration, verification) VALUES (?, ?, ?, false)";
        try(Connection conn = database.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
                ps.setString(1, code.getEmail());
                ps.setString(2, code.getCode());
                ps.setTimestamp(3, Timestamp.valueOf(code.getExpiration()));
                ps.executeUpdate();
            }               
    }

    public VerificationCode findLastCodeByMail(String mail_phone)throws SQLException{
        String sql = "SELECT * FROM email_verification WHERE email = ? ORDER BY id DESC LIMIT 1";
        try(Connection conn = database.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
                ps.setString(1, mail_phone);
                ResultSet rs = ps.executeQuery();

                while(rs.next()){
                    return new VerificationCode(
                        rs.getLong("id"), 
                        rs.getString("email"), 
                        rs.getString("code"), 
                        rs.getTimestamp("expiration").toLocalDateTime(), 
                        rs.getBoolean("verification")
                    );
                }
            }
            return null;
    }

    public void markVerified(long id) throws SQLException {
        String sql = "UPDATE email_verification SET verification = true WHERE id = ?";
        try (Connection conn = database.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }
}