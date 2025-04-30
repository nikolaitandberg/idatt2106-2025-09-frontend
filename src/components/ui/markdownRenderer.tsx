"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const cleanContent = content.replace(/\\n/g, "\n");

  return (
    <div className="space-y-4 text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-3xl font-bold text-black" {...props} />,
          h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-2" {...props} />,
          h3: (props) => <h3 className="text-xl font-semibold mt-4 mb-1" {...props} />,
          p: (props) => <p className="text-base leading-relaxed" {...props} />,
          ul: (props) => <ul className="list-disc list-inside pl-4 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal list-inside pl-4 space-y-1" {...props} />,
          li: (props) => <li className="text-base leading-relaxed" {...props} />,
          a: (props) => <a className="text-blue-600 underline hover:text-blue-800" {...props} />,
          code: ({ inline, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => (
            <code
              className={`bg-muted px-1 py-0.5 rounded text-sm font-mono ${inline ? "inline" : "block my-2"}`}
              {...props}>
              {children}
            </code>
          ),
          blockquote: (props) => (
            <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground" {...props} />
          ),
        }}>
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
