package com.monsite.Database;

import org.springframework.stereotype.Repository;
import com.monsite.models.Commentaire;
import java.util.ArrayList;
import java.sql.*;

@Repository
public class CommentaireRepository {
    private final Database database;

    public CommentaireRepository(Database database){
        this.database = database;
    }

    public ArrayList<Commentaire> getCommentaires() throws SQLException{
        String sql = "SELECT id, users, commentaire FROM commentaire";
        ArrayList<Commentaire> ListCommentaire = new ArrayList<>();
        try(Connection conn= this.database.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
            ) {
            ResultSet rs = ps.executeQuery();
            while(rs.next()){
                Commentaire newCommentaire = new Commentaire();
                newCommentaire.setID(rs.getLong("id"));
                newCommentaire.setUser(rs.getString("users"));
                newCommentaire.setCommentaire(rs.getString("commentaire")); 
                ListCommentaire.add(newCommentaire);
            }
        }
        return ListCommentaire;
    }

    public void clearTable() throws SQLException{
        String sql = "TRUNCATE TABLE commentaire RESTART IDENTITY";
        try(Connection conn = this.database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
                pstmt.executeUpdate();
        }catch(SQLException e) {
            e.printStackTrace();
        }
    }

    public void AddCommentaire(Commentaire commentaire)throws SQLException{
        String sql = "INSERT INTO commentaire (users, commentaire) VALUES (?, ?)";
        try(Connection conn = this.database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
                pstmt.setString(1, commentaire.getUser());
                pstmt.setString(2, commentaire.getCommentaire());
                int rows = pstmt.executeUpdate();
                if(rows > 0){
                    System.out.println("✅ L'insertion du commentaire de l'utilisateur "+ commentaire.getUser() + " a été effectué avec succès !");
                }else{
                    System.out.println("⚠️  L'insertion du commentaire de l'utilisateur "+ commentaire.getUser() + " a échoué !");
                }
            }
    }

    public void DeleteCommentaire(long id) throws SQLException {
        String sql = "DELETE FROM commentaire WHERE id = ?";
        try(Connection conn = this.database.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
                pstmt.setLong(1,id);
                pstmt.executeUpdate();
        }
    }
}
