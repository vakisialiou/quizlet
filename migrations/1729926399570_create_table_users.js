module.exports = {
  up: `
    CREATE TABLE users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NULL,
      createdAt DATETIME NULL,
      updatedAt DATETIME NULL,
      constraint users_pk primary key (id)
    );
  `,
  down: `DROP TABLE users;`
}
