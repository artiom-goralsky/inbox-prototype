import React from 'react';

export interface ClarificationQA {
  question: string;
  answer: string;
}

interface ClarificationAnswersBubbleProps {
  pairs: ClarificationQA[];
}

const ClarificationAnswersBubble: React.FC<ClarificationAnswersBubbleProps> = ({ pairs }) => {
  const visible = pairs.filter(p => p.answer);
  if (visible.length === 0) return null;
  return (
    <div className="flex justify-end pl-6 animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      <div className="bg-secondary rounded-[16px] px-4 py-[10px] max-w-[75%]">
        <div className="flex flex-col gap-3">
          {visible.map((pair, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-sm font-semibold text-primary leading-5">Q: {pair.question}</span>
              <span className="text-sm text-tertiary leading-5">A: {pair.answer}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClarificationAnswersBubble;
