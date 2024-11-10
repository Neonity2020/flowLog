"use client"

import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface JournalEntryFormProps {
  onAddLog: (date: Date, content: string) => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onAddLog }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [entry, setEntry] = useState('');
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !entry.trim()) {
      toast({
        title: "错误",
        description: "请填写所有字段",
        variant: "destructive",
      })
      return;
    }
    
    console.log('保存日志:', { date, entry });
    toast({
      title: "日志已保存",
      description: "您的日志已成功保存。",
    })
    onAddLog(date, entry);
    setEntry('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Textarea
        placeholder="在此输入日志内容...(win端按ctrl+enter保存日志；Mac端按cmd+enter保存日志)"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[200px]"
      />
      <div className="flex justify-end">
        <Button type="submit">
          保存日志
          <Send className="ml-2 h-4 w-4 rotate-45" />
        </Button>
      </div>
    </form>
  );
};

export default JournalEntryForm;
