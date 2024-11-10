'use client'

import { useState, useEffect } from 'react';
import JournalEntryForm from '@/components/JournalEntryForm';
import JournalEntryList from '@/components/JournalEntryList';
import { JournalEntry } from '@/lib/types';
import { generateMarkdown, downloadMarkdown } from '@/lib/exportUtils';
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // 从 localStorage 加载数据
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  // 删除 fetchEntries 函数，因为我们现在直接从 localStorage 读取数据

  // 修改 saveEntries 函数
  function saveEntries(newEntries: JournalEntry[]) {
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
    setEntries(newEntries);
  }

  const addLog = (date: Date, content: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: date.toISOString(), // 已经是字符串，无需更改
      content,
      timestamp: new Date().toISOString()
    };
    const updatedEntries = [newEntry, ...entries];
    saveEntries(updatedEntries);
  };

  const handleExport = () => {
    const markdown = generateMarkdown(entries);
    const filename = `心流日志_${new Date().toLocaleDateString('zh-CN')}.md`;
    downloadMarkdown(markdown, filename);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">心流日志</h1>
        <ThemeToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <JournalEntryForm onAddLog={addLog} />
        <JournalEntryList entries={entries} />
      </div>
    </div>
  );
}
