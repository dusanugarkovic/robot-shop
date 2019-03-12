package org.steveww.spark;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public class DataSource {

    private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;

    private static String JDBC_URL = String.format("jdbc:mysql://%s/cities?useSSL=false", System.getenv("DB_HOST") != null ? System.getenv("DB_HOST") : "mysql");

    static {
        config.setJdbcUrl(JDBC_URL);
        config.setUsername("shipping");
        config.setPassword("secret");
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.setConnectionTimeout(5000);
        config.setMaximumPoolSize(100);
        ds = new HikariDataSource(config);
    }

    private DataSource() {
    }

    static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }
}
