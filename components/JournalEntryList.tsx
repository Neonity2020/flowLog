"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { JournalEntry } from '@/lib/types';
import { ParsedContent } from './ParsedContent';
import { zhCN } from 'date-fns/locale';
import { ArrowUpDown, Import, FileDown, Upload, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generateMarkdown, downloadMarkdown, importMarkdown } from '@/lib/exportUtils';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onEntriesUpdate?: (entries: JournalEntry[]) => void;
}

export default function JournalEntryList({ entries, onEntriesUpdate }: JournalEntryListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isAscending, setIsAscending] = useState(false)

  const handleExport = () => {
    const markdown = generateMarkdown(entries);
    const filename = `心流日志_${new Date().toLocaleDateString('zh-CN')}.md`;
    downloadMarkdown(markdown, filename);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedEntries = await importMarkdown(file);
      if (onEntriesUpdate) {
        onEntriesUpdate([...importedEntries, ...entries]);
      }
      toast({
        title: "导入成功",
        description: `成功导入 ${importedEntries.length} 条记录`,
      });
    } catch (error) {
      toast({
        title: "导入失败",
        description: "文件格式不正确或读取失败",
        variant: "destructive",
      });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 对所有条目进行排序
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return isAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  // 按日期分组
  const groupedEntries: { [date: string]: JournalEntry[] } = {};
  sortedEntries.forEach(entry => {
    const entryDate = typeof entry.date === 'string' ? parseISO(entry.date) : entry.date;
    const dateKey = format(entryDate, "yyyy-MM-dd");
    if (!groupedEntries[dateKey]) {
      groupedEntries[dateKey] = [];
    }
    groupedEntries[dateKey].push(entry);
  });

  // 对每一天的条目进行排序
  Object.values(groupedEntries).forEach(dayEntries => {
    dayEntries.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return isAscending ? timeA - timeB : timeB - timeA;
    });
  });

  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>最近的日志</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  导出为 Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  导入 Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".md"
              className="hidden"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAscending(!isAscending)}
            title={isAscending ? "切换为倒序" : "切换为正序"}
          >
            <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${
              isAscending ? 'rotate-0' : 'rotate-180'
            }`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {Object.entries(groupedEntries).map(([dateKey, dayEntries]) => (
            <div key={dateKey} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {format(parseISO(dateKey), "yyyy年MM月dd日")}
              </h3>
              {dayEntries.map((entry, index) => {
                const entryTimestamp = typeof entry.timestamp === 'string' ? parseISO(entry.timestamp) : entry.timestamp;
                return (
                  <div key={entry.id} className="mb-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                      <span>{new Date(entry.date).toLocaleDateString('zh-CN')}</span>
                      <span title={new Date(entry.timestamp).toLocaleString('zh-CN')}>
                        {formatDistanceToNow(new Date(entry.timestamp), { 
                          addSuffix: true,
                          locale: zhCN 
                        })}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">
                      <ParsedContent content={entry.content} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
