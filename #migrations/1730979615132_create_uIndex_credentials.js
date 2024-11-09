module.exports = {
  up: `
    CREATE UNIQUE INDEX credentials_accountId_uIndex ON credentials (accountId);
  `,
  down: `
    DROP INDEX credentials_accountId_uIndex ON credentials;
  `
}
