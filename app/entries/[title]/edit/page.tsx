'use client'

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export default function EditEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const title = decodeURIComponent(params.title as string);
  const [content, setContent] = useState('');

  const handleSave = () => {
    const storedEntries = localStorage.getItem('journalEntries');
    const entries: JournalEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: `关于 [[${title}]] 的笔记：\n${content}`,
      timestamp: new Date().toISOString()
    };
    
    const updatedEntries = [newEntry, ...entries];
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    toast({
      title: "保存成功",
      description: "笔记已保存",
    });
    
    router.push(`/entries/${encodeURIComponent(title)}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          返回
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">编辑：{title}</h1>
        <p className="text-muted-foreground">
          创建一个新的笔记，将自动添加到相关条目中
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`在这里写下关于 ${title} 的笔记...`}
          className="min-h-[300px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            保存笔记
          </Button>
        </div>
      </div>
    </div>
  );
}
