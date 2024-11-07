module.exports = {
  up: `
    CREATE TABLE credentials (
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      accountId VARCHAR(36) NOT NULL,
      accessToken VARCHAR(1000) NOT NULL,
      refreshToken VARCHAR(1000) NOT NULL,
      createdAt DATETIME NULL,
      updatedAt DATETIME NULL,
      constraint credentials_users_fk FOREIGN KEY (userId)  REFERENCES users (id)
    )
  `,
  down: `DROP TABLE credentials;`
}
