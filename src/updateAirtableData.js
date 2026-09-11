// Compatibility entry point: import Airtable into SQLite, then export site JSON.
const { spawnSync } = require('child_process')
const path = require('path')
const result = spawnSync('python3', [
  path.resolve(__dirname, '../scripts/content_db.py'),
  'import-airtable'
], { stdio: 'inherit' })
if (result.error) console.error(result.error.message)
process.exit(result.status === null ? 1 : result.status)
