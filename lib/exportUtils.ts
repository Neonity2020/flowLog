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
