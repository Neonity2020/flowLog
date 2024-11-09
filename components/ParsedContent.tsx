import Link from 'next/link';

interface ParsedContentProps {
  content: string;
}

export function ParsedContent({ content }: ParsedContentProps) {
  const parseContent = (text: string) => {
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = [];
    let lastIndex = 0;

    // 处理 [[]] 语法
    let match;
    while ((match = wikiLinkRegex.exec(text)) !== null) {
      // 添加匹配前的普通文本
      if (match.index > lastIndex) {
        const plainText = text.slice(lastIndex, match.index);
        parts.push(processUrls(plainText));
      }

      const title = match[1];
      parts.push(
        <Link
          key={`wiki-${match.index}`}
          href={`/entries/${encodeURIComponent(title)}/edit`}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          {title}
        </Link>
      );

      lastIndex = wikiLinkRegex.lastIndex;
    }

    // 添加剩余文本
    if (lastIndex < text.length) {
      parts.push(processUrls(text.slice(lastIndex)));
    }

    return parts;
  };

  // 处理 URL
  const processUrls = (text: string) => {
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

  return <div>{parseContent(content)}</div>;
}
