import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CopyCodeButtonProps {
  codeText: string;
}

const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({ codeText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(codeText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = codeText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy code snippet:", err);
    }
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 text-xs py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
        copied
          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-medium"
          : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
      onClick={handleCopy}
      title="Copy code to clipboard"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

interface FormattedMessageProps {
  text?: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ text }) => {
  if (!text) return null;

  return (
    <div className="prose-dark flex flex-col gap-2 text-sm leading-relaxed text-inherit">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-3 mb-1.5 pb-1 border-b border-white/10">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight mt-3 mb-1.5 pb-1 border-b border-white/5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-indigo-300 tracking-tight mt-2.5 mb-1 flex items-center gap-1.5">
              <span className="text-indigo-400 font-mono text-sm">#</span>
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm sm:text-base font-semibold text-purple-300 tracking-tight mt-2 mb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-slate-200 my-1 break-words">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-1.5 flex flex-col gap-1 text-sm text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-1.5 flex flex-col gap-1 text-sm text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-slate-200">{children}</li>
          ),
          hr: () => <hr className="my-3 border-white/10" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-indigo-500 pl-3.5 py-1.5 my-2 bg-indigo-500/10 rounded-r-lg text-slate-300 text-sm italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-200">{children}</em>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-white/10 bg-slate-950/60 shadow-md">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2 bg-white/5 font-semibold text-white border-b border-white/10">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 border-b border-white/5 text-slate-300">
              {children}
            </td>
          ),
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const hasMultipleLines = codeString.includes("\n");

            if (match || hasMultipleLines) {
              const lang = match ? match[1] : "CODE";
              return (
                <div className="my-2.5 rounded-xl overflow-hidden border border-white/15 bg-slate-950 shadow-xl">
                  <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-white/10 text-xs font-mono text-slate-400 uppercase tracking-wider">
                    <span className="font-semibold text-indigo-300">{lang}</span>
                    <CopyCodeButton codeText={codeString} />
                  </div>
                  <pre className="p-3.5 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-100 bg-slate-950/90 m-0">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-slate-950/80 border border-white/15 text-cyan-300 font-mono text-xs"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default FormattedMessage;
