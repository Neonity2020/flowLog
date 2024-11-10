import Link from 'next/link';

interface ParsedContentProps {
  content: string;
}

export function ParsedContent({ content }: ParsedContentProps) {
  const parseContent = (text: string) => {
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    let match;
    while ((match = wikiLinkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const plainText = text.slice(lastIndex, match.index);
        const withCode = processInlineCodeString(plainText, 'plain');
        const processed = withCode.map(part => 
          typeof part === 'string' ? processUrls(part) : part
        ).flat();
        parts.push(...processed);
      }

      parts.push(
        <Link
          key={`wiki-${match.index}`}
          href={`/entries/${encodeURIComponent(match[1])}/`}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          {match[1]}
        </Link>
      );

      lastIndex = wikiLinkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const withCode = processInlineCodeString(remainingText, 'remaining');
      const processed = withCode.map(part => 
        typeof part === 'string' ? processUrls(part) : part
      ).flat();
      parts.push(...processed);
    }

    return parts;
  };

  const processUrls = (text: string): (string | JSX.Element)[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      parts.push(
        <a
          key={`url-${match.index}`}
          href={match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          {match[0]}
        </a>
      );

      lastIndex = urlRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const processInlineCodeString = (text: string, keyPrefix: string) => {
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      parts.push(
        <code
          key={`${keyPrefix}-code-${match.index}`}
          className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm"
        >
          {match[1]}
        </code>
      );

      lastIndex = inlineCodeRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return <div>{parseContent(content)}</div>;
}
