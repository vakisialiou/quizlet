module.exports = {
  up: `
    CREATE TABLE folders (
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      userId INT NOT NULL,
      uuid VARCHAR(36) NOT NULL,
      name VARCHAR(255) NULL,
      createdAt DATETIME NULL,
      updatedAt DATETIME NULL,
      constraint folders_users_fk FOREIGN KEY (userId)  REFERENCES users (id)
    );
  `,
  down: `DROP TABLE folders;`
}
