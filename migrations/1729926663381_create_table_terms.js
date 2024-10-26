module.exports = {
  up: `
    CREATE TABLE terms (
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      folderId INT NOT NULL,
      sort INT NOT NULL,
      question VARCHAR(255) NULL,
      answer VARCHAR(255) NULL,
      createdAt DATETIME NULL,
      updatedAt DATETIME NULL,
      constraint terms_folders_fk FOREIGN KEY (folderId)  REFERENCES folders (id)
    );
  `,
  down: `DROP TABLE terms;`
}
