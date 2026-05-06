import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@circleco/compass/components/Button';
import {
  mockSupportThreads,
  transitionThreadToActive,
  QUEUE_INITIAL_PEOPLE_AHEAD,
  QUEUE_TICK_MS,
} from './data/supportThreads';

interface QueueCardProps {
  threadId: string;
  onOpenConversation?: () => void;
}

const QueueCard: React.FC<QueueCardProps> = ({ threadId, onOpenConversation }) => {
  const thread = mockSupportThreads.find(t => t.id === threadId);
  const elapsed = thread?.queueState ? Math.max(0, Date.now() - thread.queueState.startedAt) : 0;
  const initial = Math.max(0, QUEUE_INITIAL_PEOPLE_AHEAD - Math.floor(elapsed / QUEUE_TICK_MS));

  const [peopleAhead, setPeopleAhead] = useState(initial);
  const [isReady, setIsReady] = useState(initial === 0);
  const currentRef = useRef(initial);

  useEffect(() => {
    if (isReady) return;
    const id = setInterval(() => {
      currentRef.current -= 1;
      if (currentRef.current <= 0) {
        clearInterval(id);
        setPeopleAhead(0);
        setIsReady(true);
        transitionThreadToActive(threadId);
      } else {
        setPeopleAhead(currentRef.current);
      }
    }, QUEUE_TICK_MS);
    return () => clearInterval(id);
  }, []); // intentionally empty — run once

  const label = peopleAhead === 1 ? '1 person ahead of you' : `${peopleAhead} people ahead of you`;

  if (!isReady) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-white border border-[#e4e7eb] rounded-2xl w-full max-w-[678px] animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="flex shrink-0">
          <img src="/images/avatars/2.png" className="size-5 rounded-full border-2 border-white" />
          <img src="/images/avatars/3.png" className="size-5 rounded-full border-2 border-white -ml-1" />
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-sm font-medium text-[#191b1f]">{label}</span>
          <span className="text-xs text-[#717680]">Estimated wait ~10 min</span>
        </div>
        <div className="shrink-0 size-4">
          <svg className="animate-spin" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#e4e7eb" strokeWidth="2"/>
            <path d="M14 8a6 6 0 0 0-6-6" stroke="#191b1f" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-[#e4e7eb] rounded-2xl w-full max-w-[678px] animate-[fadeInSlide_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      <img src="/images/avatars/3.png" className="size-5 rounded-full border-2 border-white shrink-0" />
      <span className="text-sm font-medium text-[#191b1f] flex-1 min-w-0 truncate">Lucy joined the chat</span>
      {onOpenConversation && (
        <Button variant="outline" size="sm" onClick={onOpenConversation}>
          Open conversation
        </Button>
      )}
    </div>
  );
};

export default QueueCard;
