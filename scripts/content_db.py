"""Local content database and optional Airtable import; Python standard library only."""
import argparse
import datetime
import json
import os
from pathlib import Path
import re
import sqlite3
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
COLLECTIONS = {'tarotCards': 'TarotCards', 'fortuneTellings': 'FortuneTellings', 'articles': 'Articles'}


def encode(value):
    return json.dumps(value, ensure_ascii=False, indent=2)


def connect(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path)
    db.executescript((ROOT / 'database/schema.sql').read_text())
    return db


def validate(collections, images):
    for collection in COLLECTIONS:
        rows = collections[collection]
        if not rows:
            raise ValueError(f'{collection}: empty import; existing data retained')
        ids = set()
        for row in rows:
            identifier = row['id']
            if not isinstance(identifier, str) or not re.fullmatch(r'[A-Za-z0-9_-]+', identifier):
                raise ValueError(f'{collection}: invalid record id')
            if identifier in ids:
                raise ValueError(f'{collection}: duplicate id {identifier}')
            ids.add(identifier)
            image = row['image']
            if Path(image).name != image or not (images / image).is_file():
                raise ValueError(f'{collection}/{identifier}: missing local image')


def save(db, collections, source, raw=None):
    with db:
        db.execute('DELETE FROM content')
        db.execute('DELETE FROM airtable_records')
        for collection, rows in collections.items():
            db.executemany('INSERT INTO content VALUES (?, ?, ?, ?)',
                           [(collection, row['id'], i, encode(row)) for i, row in enumerate(rows)])
        for collection, rows in (raw or {}).items():
            db.executemany('INSERT INTO airtable_records VALUES (?, ?, ?)',
                           [(collection, row['id'], encode(row)) for row in rows])
        for key, value in {'source': source, 'imported_at': datetime.datetime.now(datetime.timezone.utc).isoformat()}.items():
            db.execute('INSERT OR REPLACE INTO metadata VALUES (?, ?)', (key, value))


def read(db):
    return {name: [json.loads(row[0]) for row in db.execute(
        'SELECT data FROM content WHERE collection = ? ORDER BY position', (name,))]
        for name in COLLECTIONS}


def export(db, destination):
    collections = read(db)
    validate(collections, destination)
    for name, rows in collections.items():
        target = destination / f'{name}.json'
        # Avoid changing tracked JSON solely because of formatting.
        if target.exists() and json.loads(target.read_text()) == rows:
            continue
        temporary = target.with_suffix('.json.tmp')
        temporary.write_text(encode(rows) + '\n')
        temporary.replace(target)


def credentials():
    config = {}
    local = ROOT / '.env.local'
    if local.exists():
        for line in local.read_text().splitlines():
            if line.strip() and not line.lstrip().startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                config[key.strip()] = value.strip().strip('\"\'')
    config.update(os.environ)
    if not config.get('AIRTABLE_TOKEN'):
        raise ValueError('Set AIRTABLE_TOKEN in .env.local or the environment')
    return config['AIRTABLE_TOKEN'], config.get('AIRTABLE_BASE_ID', 'appcttjzPgvmm4Gdx')


def fetch_records(table, token, base):
    rows, offset = [], None
    while True:
        query = {'pageSize': 100}
        if offset:
            query['offset'] = offset
        url = f'https://api.airtable.com/v0/{urllib.parse.quote(base, safe="")}/{table}?{urllib.parse.urlencode(query)}'
        request = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(request, timeout=30) as response:
            page = json.load(response)
        rows.extend(page['records'])
        offset = page.get('offset')
        if not offset:
            return rows
        time.sleep(0.25)


def transform(collection, record, images):
    f = record['fields']
    identifier = f['id']
    if not re.fullmatch(r'[A-Za-z0-9_-]+', identifier):
        raise ValueError('Invalid Airtable content id')
    attachment = f['image'][0]
    extension = {'image/jpeg': 'jpeg', 'image/png': 'png', 'image/gif': 'gif',
                 'image/webp': 'webp', 'image/svg+xml': 'svg'}.get(attachment['type'])
    if not extension:
        raise ValueError('Unsupported attachment type')
    filename = f'{identifier}.{extension}'
    with urllib.request.urlopen(attachment['url'], timeout=60) as response:
        (images / filename).write_bytes(response.read())
    common = {'id': identifier, 'image': filename}
    if collection == 'articles':
        return {**common, **{key: f[key] for key in ('title', 'description', 'htmlPage') if key in f}}
    if collection == 'fortuneTellings':
        return {**common, 'emoji': f.get('icon', ''),
                **{key: f[key] for key in ('line1', 'line2', 'htmlPage') if key in f}}
    row = {**common, 'htmlname': f['htmlPage'], 'color': 'black' if f.get('arcana') == 'major' else 'pink',
           'emoji': f.get('icon', ''), 'line1': f.get('line1', ''), 'none': not f.get('line1'),
           'link': f'cards/{f["htmlPage"]}.html',
           'texttype': 'Antiqua' if re.search('[IVXLCDM]', f.get('icon', '')) else 'Emoji'}
    for key in ('arcana', 'line2', 'name', 'basics', 'love', 'work', 'advice', 'basicMeaning',
                'loveTelling', 'answer', 'cardOfTheDay', 'adviceLong', 'history'):
        if key in f:
            row[key] = f[key]
    return row


def import_airtable(db, data_dir):
    token, base = credentials()
    raw = {name: fetch_records(table, token, base) for name, table in COLLECTIONS.items()}
    with tempfile.TemporaryDirectory(dir=data_dir) as folder:
        staging = Path(folder)
        collections = {name: [transform(name, row, staging) for row in rows] for name, rows in raw.items()}
        validate(collections, staging)
        # Keep a consistent backup before replacing any previously imported content.
        backup_path = ROOT / 'database/before-import.sqlite3'
        with sqlite3.connect(backup_path) as backup:
            db.backup(backup)
        for file in staging.iterdir():
            file.replace(data_dir / file.name)
        save(db, collections, 'airtable', raw)
    export(db, data_dir)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['seed', 'export', 'import-airtable', 'status'])
    parser.add_argument('--database', type=Path, default=ROOT / 'database/rasklad.sqlite3')
    args = parser.parse_args()
    data_dir = ROOT / 'src/data'
    if args.command != 'seed' and not args.database.exists():
        parser.error('Database is missing; run npm run db:seed first')
    with connect(args.database) as db:
        if args.command == 'seed':
            if db.execute('SELECT COUNT(*) FROM content').fetchone()[0]:
                parser.error('Database already contains data; seed will not overwrite it')
            collections = {name: json.loads((data_dir / f'{name}.json').read_text()) for name in COLLECTIONS}
            validate(collections, data_dir)
            save(db, collections, 'existing-project-json')
        elif args.command == 'export':
            export(db, data_dir)
        elif args.command == 'import-airtable':
            import_airtable(db, data_dir)
        for name, rows in read(db).items():
            print(f'{name}: {len(rows)}')
        print('Source:', dict(db.execute('SELECT key, value FROM metadata')).get('source', 'empty'))


if __name__ == '__main__':
    try:
        main()
    except urllib.error.HTTPError as error:
        raise SystemExit(f'Airtable/attachment HTTP {error.code}. Check token and base access. Existing content retained if fetch failed.')
    except (ValueError, KeyError, OSError) as error:
        raise SystemExit(str(error))
