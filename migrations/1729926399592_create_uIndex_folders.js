module.exports = {
  up: `
    CREATE UNIQUE INDEX folders_uuid_uIndex ON folders (uuid);
  `,
  down: `
    DROP INDEX folders_uuid_uIndex ON folders;
  `
}
