import copy
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import urllib.error

import content_db as content


class ContentDatabaseTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.db = content.connect(Path(self.directory.name) / 'test.sqlite3')
        self.addCleanup(self.db.close)
        self.rows = {name: json.loads((content.ROOT / 'src/data' / f'{name}.json').read_text())
                     for name in content.COLLECTIONS}
        content.save(self.db, self.rows, 'test')

    def test_all_existing_fields_types_and_order_survive_database_round_trip(self):
        self.assertEqual(content.read(self.db), self.rows)
        self.assertEqual(self.db.execute('PRAGMA integrity_check').fetchone()[0], 'ok')
        content.validate(content.read(self.db), content.ROOT / 'src/data')

    def test_failed_replacement_rolls_back_previous_content(self):
        invalid = copy.deepcopy(self.rows)
        invalid['tarotCards'].append(invalid['tarotCards'][0])
        with self.assertRaises(sqlite3.IntegrityError):
            content.save(self.db, invalid, 'invalid')
        self.assertEqual(content.read(self.db), self.rows)

    def test_browser_catalogue_keeps_search_fields_without_long_readings(self):
        destination = Path(self.directory.name)
        for rows in self.rows.values():
            for row in rows:
                (destination / row['image']).touch()
        content.export(self.db, destination)
        catalogue = json.loads((destination / 'tarotCatalog.json').read_text())
        self.assertEqual([row['id'] for row in catalogue],
                         [row['id'] for row in self.rows['tarotCards']])
        self.assertTrue(all('name' in row and 'image' in row for row in catalogue))
        self.assertTrue(all('basicMeaning' not in row for row in catalogue))
        self.assertEqual(json.loads((destination / 'tarotCards.json').read_text()),
                         self.rows['tarotCards'])

    def test_rejected_airtable_token_keeps_existing_data(self):
        error = urllib.error.HTTPError('https://api.airtable.com', 401, 'Unauthorized', {}, None)
        with patch.object(content, 'credentials', return_value=('test', 'test')):
            with patch.object(content, 'fetch_records', side_effect=error):
                with self.assertRaises(urllib.error.HTTPError):
                    content.import_airtable(self.db, Path(self.directory.name))
        self.assertEqual(content.read(self.db), self.rows)

    def test_pagination_keeps_more_than_one_hundred_records(self):
        from io import BytesIO
        pages = [BytesIO(json.dumps({'records': [{'id': str(i)} for i in range(100)],
                                    'offset': 'next page'}).encode()),
                 BytesIO(json.dumps({'records': [{'id': '100'}]}).encode())]
        with patch.object(content.urllib.request, 'urlopen', side_effect=pages) as request:
            with patch.object(content.time, 'sleep'):
                rows = content.fetch_records('TarotCards', 'test', 'test')
        self.assertEqual(len(rows), 101)
        self.assertIn('offset=next+page', request.call_args_list[1].args[0].full_url)


if __name__ == '__main__':
    unittest.main()
