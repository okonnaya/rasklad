PRAGMA foreign_keys = ON;

-- JSON retains optional content fields and their original types without loss.
CREATE TABLE IF NOT EXISTS content (
  collection TEXT NOT NULL CHECK (collection IN ('tarotCards', 'fortuneTellings', 'articles')),
  id TEXT NOT NULL,
  position INTEGER NOT NULL,
  data TEXT NOT NULL CHECK (json_valid(data)),
  PRIMARY KEY (collection, id),
  UNIQUE (collection, position)
);
CREATE TABLE IF NOT EXISTS airtable_records (
  collection TEXT NOT NULL,
  record_id TEXT NOT NULL,
  data TEXT NOT NULL CHECK (json_valid(data)),
  PRIMARY KEY (collection, record_id)
);
CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE VIEW IF NOT EXISTS tarot_cards AS
  SELECT id, json_extract(data, '$.name') AS name,
         json_extract(data, '$.arcana') AS arcana, data
  FROM content WHERE collection = 'tarotCards' ORDER BY position;
CREATE VIEW IF NOT EXISTS articles AS
  SELECT id, json_extract(data, '$.title') AS title, data
  FROM content WHERE collection = 'articles' ORDER BY position;
CREATE VIEW IF NOT EXISTS fortune_tellings AS
  SELECT id, data FROM content WHERE collection = 'fortuneTellings' ORDER BY position;
