import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Icon } from '@circleco/compass/components/Icon';
import { Modal } from '@circleco/compass/components/Modal';
import { TextArea } from '@circleco/compass/components/TextArea';
import { AvatarGroup } from '@circleco/compass/components/AvatarGroup';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Menu } from '@circleco/compass/components/Menu';
import type {
  LaunchProjectData,
  ProjectThread,
} from './launchProjectData';

/* ── Chat scenarios with conversation content ────────────────────── */

interface ChatScenario {
  id: string;
  title: string;
  preview: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: 'lc1',
    title: 'Weekly new member onboarding report',
    preview: 'I recommend a 3-tier model based on competitor analysis...',
    messages: [
      { role: 'user', content: 'How are this week\'s new members doing?' },
      { role: 'assistant', content: "This week we had **12 new signups**. **8 have completed onboarding** (67% completion rate), and **3 have already posted introductions**.\n\nThe biggest drop-off is still at the goals survey step — I've been testing a shorter version that's showing 15% better completion in the last batch." },
      { role: 'user', content: 'Should we remove the goals survey entirely?' },
      { role: 'assistant', content: "I wouldn't remove it — the data it collects is valuable for personalization. Instead, I'd shorten it to 2 questions:\n\n1. \"What are you hoping to get from this community?\"\n2. \"How much experience do you have with [topic]?\"\n\nThis gives you enough to segment without creating friction. Communities that ask 2 questions vs 5 see 40% higher completion with only 12% less data quality." },
    ],
  },
  {
    id: 'lc2',
    title: 'Members at risk of churning this month',
    preview: 'The webhook endpoints are configured and tested...',
    messages: [
      { role: 'user', content: 'Which members are at risk of churning?' },
      { role: 'assistant', content: "I flagged **14 members** inactive for 21+ days. Here's the breakdown:\n\n**High risk (no activity in 30+ days):** 5 members\n**Medium risk (no activity in 21–30 days):** 9 members\n\nOf the high-risk group, 3 joined in the last 60 days — they likely never activated. The other 2 were previously active and dropped off after week 6.\n\nI've drafted a re-engagement plan for each segment. Want me to walk through it?" },
      { role: 'user', content: 'Yes, what do you recommend for the high-risk group?' },
      { role: 'assistant', content: "For the **5 high-risk members**, I'd do a personal outreach sequence:\n\n**Day 1:** Personal DM from you — \"Hey [name], noticed you haven't been around. Anything I can help with?\"\n**Day 3:** If no reply, send an email highlighting the 2 most relevant recent discussions based on their profile\n**Day 7:** Final touch — invite them to the next live event with a personal note\n\nFor the 3 who never activated, the DM should acknowledge they're new: \"Hey [name], I know the community can feel overwhelming at first. Here's the one thing I'd start with...\"\n\nWant me to draft these messages?" },
    ],
  },
  {
    id: 'lc3',
    title: 'Re-engagement campaign for January dropoffs',
    preview: "Here's the 5-email welcome series draft...",
    messages: [
      { role: 'user', content: 'Draft a re-engagement campaign for members who dropped off in January' },
      { role: 'assistant', content: "Here's a 5-email sequence for January dropoffs:\n\n**Email 1 (Day 1):** \"We've missed you\" — personal tone, mention 1 specific thing that happened since they left\n**Email 2 (Day 4):** \"Here's what you missed\" — top 3 discussions + 1 new resource\n**Email 3 (Day 8):** \"Quick question\" — ask what would bring them back (reply-optimized)\n**Email 4 (Day 14):** \"Special invitation\" — invite to next live event + mention it's recorded\n**Email 5 (Day 21):** \"Your community is here\" — social proof (X members joined this month, Y discussions)\n\nOpen rate benchmark for re-engagement: 18–25%. Reply rate on Email 3: aim for 8–12%." },
    ],
  },
];

const DEFAULT_INSTRUCTIONS = 'You are now a world-class SaaS product design leader with decades of experience building billion-dollar ARR product teams. Your communication style is direct, concise, and no-nonsense—you cut through fluff and focus on substance.';
const DEFAULT_MEMORY = 'This project involved leading a high-impact SaaS product team focused on delivering scalable solutions that drive significant revenue growth. The approach emphasized clear, straightforward communication and a results-driven mindset to ensure efficient progress and impactful outcomes.';

/* ── Component ───────────────────────────────────────────────────── */

interface LaunchProjectViewProps {
  project: LaunchProjectData;
  onBack: () => void;
  onOpenThread?: (thread: ProjectThread) => void;
  onNewConversation?: () => void;
  onOpenChat?: (chatId: string, title: string, messages: { role: 'user' | 'assistant'; content: string }[]) => void;
  onEntryPointChange?: (label: string) => void;
  shimmerProgress?: boolean;
}

const LaunchProjectView: React.FC<LaunchProjectViewProps> = ({ project, onBack, onOpenThread, onNewConversation, onOpenChat, onEntryPointChange, shimmerProgress = false }) => {
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [instructionsDraft, setInstructionsDraft] = useState(DEFAULT_INSTRUCTIONS);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);

  const handleStepClick = (step: typeof project.steps[0]) => {
    onEntryPointChange?.(project.title);
    if (onOpenChat) {
      onOpenChat(`step-${step.id}`, step.title, []);
    } else if (onOpenThread) {
      onOpenThread({ id: `step-${step.id}`, title: step.title, messages: [], createdAt: Date.now() });
    }
  };

  return (
    <div className="bg-primary h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-16">
        <div className="flex flex-col max-w-[1280px] mx-auto w-full pb-10">
          {/* Avatar Group */}
          <div className="pt-10">
            <AvatarGroup size="md" spacing={-6} aria-label="Project agents">
              <Avatar size="md" src="/images/avatars/1.png" name="Agent 1" />
              <Avatar size="md" src="/images/avatars/4.png" name="Agent 2" />
              <Avatar size="md" src="/images/avatars/6.png" name="Agent 3" />
            </AvatarGroup>
          </div>

          {/* Back to projects */}
          <button onClick={onBack} className="text-sm text-secondary hover:text-primary transition-colors cursor-pointer self-start mt-4">
            Projects
          </button>

          {/* Title + menu */}
          <div className="flex items-start justify-between mt-2">
            <Typography variant="heading-2xl" color="primary">
              <span className="font-bold">{project.title}</span>
            </Typography>
            <Menu
              options={[
                { label: 'Edit project', icon: 'edit-ai', onClick: () => {} },
                { label: 'Archive project', icon: 'folder', onClick: () => {} },
                { label: 'Delete project', icon: 'trash-can', onClick: () => {}, danger: true },
              ]}
              trigger={
                <IconButton variant="ghost" size="sm" icon="dot-menu" aria-label="Project options" />
              }
              side="bottom"
              align="end"
              sideOffset={4}
            />
          </div>

          {/* Two-column layout */}
          <div className="flex gap-4 items-start mt-6">

            {/* Left column: Project progress + Recent chats */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Project progress card */}
              {project.steps.length > 0 && (
                <div className={`bg-primary rounded-2xl shadow-2xs border border-[#E4E7EB] progress-shimmer ${shimmerProgress ? 'shimmer-active' : ''}`}>
                  {/* Header */}
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F0F3F5]">
                    <Icon name="checklist" size="md" className="text-primary" />
                    <Typography variant="heading-sm" color="primary">Project progress</Typography>
                  </div>
                  {/* Steps */}
                  <div className="flex flex-col py-1">
                    {shimmerProgress ? (
                      <div className="flex flex-col skeleton-pulse">
                        {project.steps.map((step, i) => (
                          <div key={step.id} className="flex items-center gap-3 px-6 py-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#E4E7EB] shrink-0" />
                            <div className="h-4 rounded bg-[#E4E7EB]" style={{ width: `${[55, 42, 65, 48, 70, 50][i % 6]}%` }} />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {!shimmerProgress && project.steps.map((step) => {
                      const isDone = step.status === 'complete';
                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => handleStepClick(step)}
                          className="flex items-center gap-3 px-6 py-2.5 text-left hover:bg-hover transition-colors cursor-pointer"
                        >
                          {isDone ? (
                            <span className="w-5 h-5 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0">
                              <Icon name="checkmark-small" size="sm" className="text-white" />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full border-[1.5px] border-[#D1D5DB] shrink-0" />
                          )}
                          <Typography variant="body-sm" color={isDone ? 'tertiary' : 'primary'}>
                            {step.title}
                          </Typography>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent chats */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Typography variant="heading-sm" color="primary" className="flex-1">Recent chats</Typography>
                  <Button variant="primary" size="sm" onClick={() => { onEntryPointChange?.(project.title); onNewConversation?.(); }}>New chat</Button>
                </div>
                {CHAT_SCENARIOS.map(chat => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => { onEntryPointChange?.(project.title); onOpenChat ? onOpenChat(chat.id, chat.title, chat.messages) : onOpenThread?.({ id: chat.id, title: chat.title, messages: [], createdAt: Date.now() }); }}
                    className="w-full text-left bg-primary border border-[#F0F3F5] rounded-lg px-5 py-4 shadow-2xs hover:bg-hover transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <Typography variant="label-sm" color="primary">{chat.title}</Typography>
                      <Typography variant="body-sm" color="tertiary">{chat.preview}</Typography>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right column: Instructions, Memory, Files */}
            <div className="w-[368px] shrink-0 flex flex-col gap-4">

              {/* Project instructions */}
              <div className="bg-primary border border-[#E4E7EB] rounded-2xl shadow-2xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F3F5]">
                  <Typography variant="heading-sm" color="primary">Project instructions</Typography>
                  <IconButton variant="ghost" size="sm" icon="edit-ai" aria-label="Edit instructions" onClick={() => { setInstructionsDraft(instructions); setInstructionsModalOpen(true); }} />
                </div>
                <div className="px-6 py-6">
                  <Typography variant="body-sm" color="primary">{instructions}</Typography>
                </div>
              </div>

              {/* Project memory */}
              <div className="bg-primary border border-[#E4E7EB] rounded-2xl shadow-2xs overflow-hidden relative">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F3F5]">
                  <Typography variant="heading-sm" color="primary">Project memory</Typography>
                  <IconButton variant="ghost" size="sm" icon="edit-ai" aria-label="Edit memory" />
                </div>
                <div className="px-6 py-6" style={{ maxHeight: 128, overflow: 'hidden' }}>
                  <Typography variant="body-sm" color="primary">{DEFAULT_MEMORY}</Typography>
                </div>
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 112, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 88%)' }} />
              </div>

              {/* Files */}
              <div className="bg-primary border border-[#E4E7EB] rounded-2xl shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F0F3F5]">
                  <Typography variant="heading-sm" color="primary">Files</Typography>
                </div>
                <div className="px-6 py-4">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-active transition-colors">
                    <Icon name="arrow-box-up" size="md" className="text-tertiary mb-1" />
                    <span className="text-sm text-tertiary">Drop files here or click to upload</span>
                    <input type="file" multiple accept="image/*,application/pdf,text/*" className="sr-only" onChange={() => {}} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal.Root open={instructionsModalOpen} onOpenChange={setInstructionsModalOpen} size="md">
        <Modal.Content>
          <Modal.Header
            title="Edit instructions"
            description="Instructions tell Circle AI how to behave in this project — its tone, focus areas, and constraints."
          />
          <Modal.Body>
            <TextArea
              value={instructionsDraft}
              onChange={e => setInstructionsDraft(e.target.value)}
              rows={6}
              resize="vertical"
              placeholder="Add instructions for Circle AI..."
            />
          </Modal.Body>
          <Modal.Footer
            secondaryAction={{ label: 'Cancel' }}
            primaryAction={{
              label: 'Save',
              onClick: () => { setInstructions(instructionsDraft); setInstructionsModalOpen(false); },
              shouldCloseModal: true,
            }}
          />
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default LaunchProjectView;
