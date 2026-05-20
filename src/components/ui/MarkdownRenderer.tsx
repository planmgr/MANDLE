import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-heading text-[24px] md:text-[28px] tracking-[1px] text-fg-primary mt-10 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-[20px] md:text-[24px] tracking-[1px] text-fg-primary mt-8 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-[17px] md:text-[19px] tracking-[0.5px] text-fg-primary mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children, node }) => {
    const hasImage = node?.children?.some(
      (child) => child.type === "element" && child.tagName === "img"
    );
    if (hasImage) return <>{children}</>;
    return (
      <p className="font-body text-[14px] md:text-[15px] text-fg-primary leading-[1.9] mb-5">
        {children}
      </p>
    );
  },
  img: ({ src, alt }) => (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
      {alt && (
        <figcaption className="font-caption text-[11px] text-fg-tertiary text-center mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-fg-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-fg-primary pl-5 my-6 italic text-fg-secondary">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="font-body text-[14px] md:text-[15px] text-fg-primary leading-[1.9] mb-5 pl-5 list-disc space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="font-body text-[14px] md:text-[15px] text-fg-primary leading-[1.9] mb-5 pl-5 list-decimal space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  hr: () => <hr className="my-8 border-border-light" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-fg-primary">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={`block bg-surface-card p-4 my-6 font-mono text-[13px] text-fg-primary leading-[1.7] overflow-x-auto ${className ?? ""}`}>
          {children}
        </code>
      );
    }
    return (
      <code className="bg-surface-card px-1.5 py-0.5 font-mono text-[13px] text-fg-primary">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-surface-card p-4 my-6 overflow-x-auto rounded-none">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse font-body text-[13px]">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border-light px-3 py-2 text-left font-semibold text-fg-primary bg-surface-card">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border-light px-3 py-2 text-fg-secondary">
      {children}
    </td>
  ),
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
