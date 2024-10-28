module.exports = {
  up: `
    CREATE UNIQUE INDEX terms_uuid_uIndex ON terms (uuid);
  `,
  down: `
    DROP INDEX terms_uuid_uIndex ON terms;
  `
}
