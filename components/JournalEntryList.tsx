"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"

interface JournalEntry {
  id: string;
  date: Date | string;
  content: string;
  timestamp: Date | string;
}

interface JournalEntryListProps {
  entries: JournalEntry[];
}

// 添加URL解析函数
const parseURLs = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

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
        <CardTitle>最近的日志</CardTitle>
        <div className="flex space-x-2 mt-2">
          <Button
            variant={isAscending ? "default" : "outline"}
            onClick={() => setIsAscending(true)}
          >
            正序排列
          </Button>
          <Button
            variant={!isAscending ? "default" : "outline"}
            onClick={() => setIsAscending(false)}
          >
            倒序排列
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
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {format(entryTimestamp, "HH:mm:ss")}{" "}
                      <span>{parseURLs(entry.content)}</span>
                    </p>
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
