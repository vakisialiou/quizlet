module.exports = {
  up: `
    CREATE TABLE users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NULL,
      email VARCHAR(255) NULL,
      givenName VARCHAR(255) NULL,
      familyName VARCHAR(255) NULL,
      picture VARCHAR(1000) NULL,
      accountId VARCHAR(255) NOT NULL,
      refreshToken VARCHAR(1000) NOT NULL,
      createdAt DATETIME NULL,
      updatedAt DATETIME NULL,
      constraint users_pk primary key (id)
    );
  `,
  down: `DROP TABLE users;`
}
