package com.monsite.Database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.sql.*;

import javax.sql.DataSource;

@Component
public class Database {
    @Autowired
    private DataSource dataSource;

    public Connection getConnection() throws SQLException{
        return dataSource.getConnection();
    }

}


