module.exports = {
  up: `
    CREATE UNIQUE INDEX users_accountId_uIndex ON users (accountId);
  `,
  down: `
    DROP INDEX users_accountId_uIndex ON users;
  `
}
