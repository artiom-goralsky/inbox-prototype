import React from 'react';
import { Divider } from '@circleco/compass/components/Divider';

// Parse inline bold: **text**
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
          : p || null
      )}
    </>
  );
}

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // Split into major sections by --- (horizontal rule)
  const sectionTexts = content.split(/\n---\n/);

  return (
    <div className="flex flex-col gap-8 w-full">
      {sectionTexts.map((sectionText, si) => {
        const paragraphs = sectionText
          .split(/\n\n+/)
          .map(p => p.trim())
          .filter(Boolean);

        const blocks = paragraphs.map((para, pi) => {
          // H1
          if (para.startsWith('# ')) {
            return (
              <p key={pi} className="text-[20px] font-semibold leading-[28px] tracking-[-0.4px] text-[#191b1f]">
                {renderInline(para.slice(2))}
              </p>
            );
          }
          // H2
          if (para.startsWith('## ')) {
            return (
              <p key={pi} className="text-[16px] font-semibold leading-[24px] tracking-[-0.3px] text-[#191b1f]">
                {renderInline(para.slice(3))}
              </p>
            );
          }
          // H3
          if (para.startsWith('### ')) {
            return (
              <p key={pi} className="text-[14px] font-semibold leading-[20px] text-[#191b1f]">
                {renderInline(para.slice(4))}
              </p>
            );
          }
          // Blockquote
          if (para.startsWith('> ')) {
            return (
              <div key={pi} className="border-l-[3px] border-[#e4e7eb] pl-4">
                <p className="text-[16px] font-normal leading-[24px] text-[#191b1f]">
                  {renderInline(para.slice(2))}
                </p>
              </div>
            );
          }
          // Bullet list (every line starts with - * or •)
          const lines = para.split('\n');
          if (lines.length > 1 && lines.every(l => /^[-*•] /.test(l.trim()))) {
            return (
              <ul key={pi} className="list-disc flex flex-col">
                {lines.map((l, li) => (
                  <li key={li} className="ms-[24px] text-[16px] leading-[24px] text-[#191b1f]">
                    {renderInline(l.trim().replace(/^[-*•] /, ''))}
                  </li>
                ))}
              </ul>
            );
          }
          // Ordered list (every line starts with N.)
          if (lines.length > 1 && lines.every(l => /^\d+\. /.test(l.trim()))) {
            return (
              <ol key={pi} className="list-decimal flex flex-col">
                {lines.map((l, li) => (
                  <li key={li} className="ms-[24px] text-[16px] leading-[24px] text-[#191b1f]">
                    {renderInline(l.trim().replace(/^\d+\. /, ''))}
                  </li>
                ))}
              </ol>
            );
          }
          // Regular paragraph — preserve \n line breaks within the block
          return (
            <p key={pi} className="text-[16px] font-normal leading-[24px] text-[#191b1f] whitespace-pre-line">
              {renderInline(para)}
            </p>
          );
        });

        return (
          <React.Fragment key={si}>
            {si > 0 && <Divider orientation="horizontal" />}
            <div className="flex flex-col gap-3">
              {blocks}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
