import { NextResponse } from 'next/server';
import { saveJournalEntries, loadJournalEntries } from '@/lib/db';
import { JournalEntry } from '@/lib/types';

export async function GET() {
  try {
    const entries = await loadJournalEntries();
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entries: JournalEntry[] = await request.json();
    await saveJournalEntries(entries);
    return NextResponse.json({ message: 'Entries saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save entries' }, { status: 500 });
  }
}
