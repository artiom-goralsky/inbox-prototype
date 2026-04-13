import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';

export interface ClarifyingQuestion {
  question: string;
  options: string[];
}

interface ClarifyingQuestionsProps {
  questions: ClarifyingQuestion[];
  onComplete: (answers: string[]) => void;
  onDismiss: () => void;
}

const ClarifyingQuestions: React.FC<ClarifyingQuestionsProps> = ({
  questions,
  onComplete,
  onDismiss,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [activeOption, setActiveOption] = useState(0);

  const current = questions[currentIndex];
  if (!current) return null;

  const totalOptions = current.options.length;

  const selectOption = (option: string) => {
    const newAnswers = [...answers, option];
    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
      setCustomText('');
      setActiveOption(0);
    } else {
      onComplete(newAnswers);
    }
  };

  const submitCustom = () => {
    if (customText.trim()) selectOption(customText.trim());
  };

  const skip = () => {
    const newAnswers = [...answers, ''];
    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
      setCustomText('');
      setActiveOption(0);
    } else {
      onComplete(newAnswers);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveOption(i => Math.min(i + 1, totalOptions - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveOption(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectOption(current.options[activeOption]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        skip();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeOption, totalOptions, current.options]);

  return (
    <div className="rounded-xl border border-secondary bg-primary shadow-sm overflow-hidden animate-[fadeInSlide_0.2s_cubic-bezier(0.16,1,0.3,1)]">
      {/* Header — question + counter + close */}
      <div className="flex items-center gap-4 px-5 py-4">
        <Typography variant="heading-sm" color="primary" className="flex-1 min-w-0 truncate">
          {current.question}
        </Typography>
        <Typography variant="body-sm" color="secondary" className="shrink-0">
          {currentIndex + 1} of {questions.length}
        </Typography>
        <IconButton
          type="button"
          variant="outline"
          size="md"
          icon="cross"
          aria-label="Close"
          onClick={onDismiss}
        />
      </div>

      {/* Options — numbered rows */}
      {current.options.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => selectOption(option)}
          onMouseEnter={() => setActiveOption(i)}
          className={`flex items-center gap-4 w-full px-5 py-4 text-left border-t border-secondary transition-colors ${
            activeOption === i ? 'bg-hover' : ''
          }`}
        >
          <div className="w-6 h-6 rounded bg-secondary border border-secondary flex items-center justify-center shrink-0">
            <Typography variant="heading-xs" color="primary">
              {i + 1}
            </Typography>
          </div>
          <Typography variant="label-sm" color="primary">
            {option}
          </Typography>
        </button>
      ))}

      {/* Something else — ghost input */}
      <div className="flex items-center px-5 py-4 border-t border-secondary">
        <input
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submitCustom(); }}
          placeholder="Something else..."
          className="flex-1 text-sm text-primary placeholder:text-disabled bg-transparent border-0 outline-none"
        />
      </div>

      {/* Footer — keyboard hints + skip */}
      <div className="flex items-center gap-6 px-5 py-4">
        <div className="flex items-center gap-2">
          <kbd className="w-6 h-6 rounded bg-secondary border border-secondary flex items-center justify-center text-[10px] font-mono text-disabled">↑</kbd>
          <kbd className="w-6 h-6 rounded bg-secondary border border-secondary flex items-center justify-center text-[10px] font-mono text-disabled">↓</kbd>
          <Typography variant="label-xs" color="tertiary">to navigate</Typography>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="h-6 px-2 rounded bg-secondary border border-secondary flex items-center justify-center text-[10px] font-mono text-disabled">Enter</kbd>
          <Typography variant="label-xs" color="tertiary">to select</Typography>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="h-6 px-2 rounded bg-secondary border border-secondary flex items-center justify-center text-[10px] font-mono text-disabled">Esc</kbd>
          <Typography variant="label-xs" color="tertiary">to skip</Typography>
        </div>
        <div className="flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={skip}>
          Skip
        </Button>
      </div>
    </div>
  );
};

export default ClarifyingQuestions;
