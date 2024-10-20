import { JournalEntry } from './types';

let db: any;

if (typeof window === 'undefined') {
  const Database = require('better-sqlite3');
  db = new Database('journal.db');

  db.exec(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      date TEXT,
      content TEXT,
      timestamp TEXT
    )
  `);
}

export async function saveJournalEntries(entries: JournalEntry[]) {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot call saveJournalEntries on the client side');
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO journal_entries (id, date, content, timestamp)
    VALUES (@id, @date, @content, @timestamp)
  `);

  const insertMany = db.transaction((entries: JournalEntry[]) => {
    for (const entry of entries) {
      insert.run({
        id: entry.id,
        date: entry.date ? new Date(entry.date).toISOString() : null,
        content: entry.content,
        timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : null
      });
    }
  });

  insertMany(entries);
}

interface DBJournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: string;
}

export async function loadJournalEntries(): Promise<JournalEntry[]> {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot call loadJournalEntries on the client side');
  }

  const select = db.prepare('SELECT * FROM journal_entries ORDER BY timestamp DESC');
  const rows = select.all() as DBJournalEntry[];
  return rows.map(row => ({
    id: row.id,
    date: row.date,  // 保持为字符串
    content: row.content,
    timestamp: new Date(row.timestamp).toISOString()  // 转换为 ISO 字符串
  }));
}
