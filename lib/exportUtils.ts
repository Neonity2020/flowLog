import { JournalEntry } from '@/lib/types';

export function generateMarkdown(entries: JournalEntry[]): string {
  const markdown = entries.map(entry => {
    const date = new Date(entry.date).toLocaleDateString('zh-CN');
    return `## ${date}\n\n${entry.content}\n\n---\n`;
  }).join('\n');

  return `# 心流日志\n\n${markdown}`;
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importMarkdown(file: File): Promise<JournalEntry[]> {
  const text = await file.text();
  const entries: JournalEntry[] = [];
  const sections = text.split('## ').filter(Boolean);
  
  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const dateStr = lines[0].trim();
    const content = lines.slice(1).join('\n').replace(/\n---\n$/, '').trim();
    
    if (dateStr && content) {
      entries.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        content: content,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return entries;
}
