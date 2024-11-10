"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { JournalEntry } from '@/lib/types';
import { ParsedContent } from './ParsedContent';
import { zhCN } from 'date-fns/locale';
import { ArrowUpDown } from "lucide-react"

interface JournalEntryListProps {
  entries: JournalEntry[];
}

export default function JournalEntryList({ entries }: JournalEntryListProps) {
  const [isAscending, setIsAscending] = useState(false)

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>最近的日志</CardTitle>
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
                    <ParsedContent content={entry.content} />
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
