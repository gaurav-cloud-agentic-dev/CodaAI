import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ inline, className, children, ...props }) {
          const isInline = inline ?? !(className || String(children).includes('\n'));
          return isInline ? (
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          ) : (
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto my-3 text-sm">
              <code className={className} {...props}>{children}</code>
            </pre>
          );
        },
        p: ({ children }) => {
          const hasBlock = Array.isArray(children)
            ? children.some(child => child?.type === 'pre' || child?.type === 'div')
            : children?.type === 'pre' || children?.type === 'div';
          return hasBlock
            ? <div className="mb-3 leading-7">{children}</div>
            : <p className="mb-3 leading-7">{children}</p>;
        },
        ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mt-4 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-1">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}