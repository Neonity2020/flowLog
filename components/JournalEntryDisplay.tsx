"use client"

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

interface JournalEntryDisplayProps {
  content: string;
}

const JournalEntryDisplay: React.FC<JournalEntryDisplayProps> = ({ content }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-muted p-4 rounded-lg font-mono text-sm">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default JournalEntryDisplay; 