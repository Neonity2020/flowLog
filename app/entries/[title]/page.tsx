'use client'

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { JournalEntry } from '@/lib/types';
import { ParsedContent } from '@/components/ParsedContent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { ChevronLeft, Hash, Calendar, Plus } from 'lucide-react';

export default function EntryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [relatedEntries, setRelatedEntries] = useState<JournalEntry[]>([]);
  const [backlinks, setBacklinks] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const title = decodeURIComponent(params.title as string);

  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      const allEntries: JournalEntry[] = JSON.parse(storedEntries);
      const filtered = allEntries.filter(entry => 
        entry.content.includes(`[[${title}]]`)
      );
      setRelatedEntries(filtered);

      const links = new Set<string>();
      const regex = /\[\[(.*?)\]\]/g;
      
      filtered.forEach(entry => {
        let match;
        while ((match = regex.exec(entry.content)) !== null) {
          if (match[1] !== title) {
            links.add(match[1]);
          }
        }
      });
      
      setBacklinks(Array.from(links));
    }
  }, [title]);

  const handleSave = () => {
    const storedEntries = localStorage.getItem('journalEntries');
    const entries: JournalEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: `关于 [[${title}]] 的笔记：\n${newContent}`,
      timestamp: new Date().toISOString()
    };
    
    const updatedEntries = [newEntry, ...entries];
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    setRelatedEntries([newEntry, ...relatedEntries]);
    setIsEditing(false);
    setNewContent('');
    
    toast({
      title: "保存成功",
      description: "笔记已保存",
    });
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

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Hash className="h-6 w-6" />
            {title}
          </h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            添加笔记
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          共有 {relatedEntries.length} 条相关记录
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {isEditing && (
            <div className="space-y-4 mb-8">
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`在这里写下关于 ${title} 的笔记...`}
                className="min-h-[200px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  保存笔记
                </Button>
              </div>
            </div>
          )}

          {relatedEntries.map(entry => (
            <div key={entry.id} className="p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                {new Date(entry.date).toLocaleDateString('zh-CN')}
              </div>
              <ParsedContent content={entry.content} />
            </div>
          ))}
          {relatedEntries.length === 0 && !isEditing && (
            <div className="text-muted-foreground p-4 border rounded-lg">
              没有找到相关日志条目
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">相关链接</h2>
            {backlinks.length > 0 ? (
              <ul className="space-y-2">
                {backlinks.map(link => (
                  <li key={link}>
                    <Link 
                      href={`/entries/${encodeURIComponent(link)}`}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">暂无相关链接</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
