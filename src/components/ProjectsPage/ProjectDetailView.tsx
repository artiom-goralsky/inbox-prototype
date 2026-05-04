import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';
import { Icon } from '@circleco/compass/components/Icon';
import { AvatarGroup } from '@circleco/compass/components/AvatarGroup';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Modal } from '@circleco/compass/components/Modal';
import { TextArea } from '@circleco/compass/components/TextArea';
import type { Project } from './ProjectsPage';

/* ── Conversation scenarios (from step scenarios) ────────────────── */

interface ChatScenario {
  id: string;
  title: string;
  preview: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: 'c1',
    title: 'Why are members leaving after week 2?',
    preview: "Based on the data, the biggest drop-off happens between day 10 and day 14...",
    messages: [
      { role: 'user', content: 'Why are members leaving after week 2?' },
      { role: 'assistant', content: "Based on the data, the biggest drop-off happens between day 10 and day 14. Here's what I found:\n\n**67% of churned members** never posted or commented after their first day. They joined, looked around, and left.\n\n**The onboarding flow stops too early.** Your current flow ends after the welcome DM. Members who receive a follow-up prompt on day 3 are 2.4× more likely to still be active on day 14.\n\n**No social hooks.** Members who connect with at least 2 other members in their first week have 80% retention at 30 days. Members who don't connect have 23%." },
      { role: 'user', content: "What's the fastest fix?" },
      { role: 'assistant', content: "Add a **day-3 nudge** — a DM that says: \"Hey [name], noticed you joined a few days ago. Have you checked out [most active space]? There's a great discussion happening about [topic].\"\n\nThis one change typically moves the needle 15–20% on week-2 retention. It's low effort, high impact, and you can automate it with a workflow.\n\nWant me to set up that workflow?" },
    ],
  },
  {
    id: 'c2',
    title: 'Re-engagement email sequence draft',
    preview: "Here's a 5-email sequence targeting members who haven't logged in for 14+ days...",
    messages: [
      { role: 'user', content: 'Can you draft a re-engagement email sequence for members who stopped logging in?' },
      { role: 'assistant', content: "Here's a 5-email sequence targeting members who haven't logged in for 14+ days:\n\n**Email 1 (Day 14):** \"We miss you\" — personal note from you, mention what they're missing\n**Email 2 (Day 17):** \"Here's what happened\" — digest of top 3 discussions + 1 new piece of content\n**Email 3 (Day 21):** \"Quick question\" — ask what would make the community more useful to them\n**Email 4 (Day 28):** \"Last chance\" — mention their access is still active, link to their profile\n**Email 5 (Day 35):** \"We'd love you back\" — special offer or personal invitation to an upcoming event\n\nSubject lines are critical — I'd A/B test Email 1 with \"We noticed you've been away\" vs \"[Name], your community misses you\"." },
      { role: 'user', content: 'Draft the full copy for email 1' },
      { role: 'assistant', content: "**Subject:** We noticed you've been away, [Name]\n\n---\n\nHey [Name],\n\nI noticed you haven't been in the community lately, and I wanted to reach out personally.\n\nSince you've been gone, a few things happened:\n- We had a live Q&A about [topic] with 40+ members\n- [Member name] shared a breakdown of their results that got 50+ comments\n- I posted a new resource on [topic] that might help with what you're working on\n\nNo pressure — but if there's something we could do differently to make this more useful for you, I'd genuinely love to hear it. Just reply to this email.\n\nHope to see you back soon.\n\n[Your name]" },
    ],
  },
  {
    id: 'c3',
    title: 'Compare our churn to industry benchmarks',
    preview: 'Your 8.2% monthly churn is above the SaaS community average of 5.4%...',
    messages: [
      { role: 'user', content: 'How does our churn rate compare to industry benchmarks?' },
      { role: 'assistant', content: "Your 8.2% monthly churn is above the SaaS community average of 5.4%. Here's the breakdown:\n\n| Metric | Your Community | Industry Avg | Top 10% |\n|--------|---------------|-------------|----------|\n| Monthly churn | 8.2% | 5.4% | 2.1% |\n| 90-day retention | 61% | 74% | 89% |\n| First-week activation | 34% | 52% | 71% |\n\nThe gap is largest in **first-week activation** — only 34% of new members take a meaningful action in their first 7 days. The industry average is 52%. This is your biggest lever.\n\nCommunities that close this activation gap typically see churn drop by 30–40% within 60 days." },
      { role: 'user', content: 'What counts as a meaningful action?' },
      { role: 'assistant', content: "For community benchmarks, a **meaningful action** is any of:\n\n1. **Posted or commented** in any space\n2. **Completed a lesson** or course module\n3. **Attended a live event** or watched a replay\n4. **Connected with another member** (DM, follow, or reply)\n\nYour community currently tracks #1 and #2. I'd recommend also tracking #3 and #4 — they're strong predictors of long-term retention.\n\nWant me to set up tracking for all four?" },
    ],
  },
];

/* ── Building blocks content ─────────────────────────────────────── */

const DEFAULT_INSTRUCTIONS = 'You are now a world-class SaaS product design leader with decades of experience building billion-dollar ARR product teams. Your communication style is direct, concise, and no-nonsense—you cut through fluff and focus on substance.';
const DEFAULT_MEMORY = 'This project involved leading a high-impact SaaS product team focused on delivering scalable solutions that drive significant revenue growth. The approach emphasized clear, straightforward communication and a results-driven mindset to ensure efficient progress and impactful outcomes.';

const PROJECT_AVATARS: Record<string, string[]> = {
  '2': ['/images/avatars/3.png', '/images/avatars/5.png', '/images/avatars/7.png'],
  '3': ['/images/avatars/2.png', '/images/avatars/4.png'],
  'pending': ['/images/avatars/1.png', '/images/avatars/6.png'],
};

/* ── Component ───────────────────────────────────────────────────── */

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onItemClick?: (item: unknown) => void;
  customTasks?: { label: string; done: boolean }[];
  onNewChat?: () => void;
  /** Open a specific chat — if copilot is already open, refresh its content; if closed, open full screen */
  onOpenChat?: (chatId: string, title: string, messages: { role: 'user' | 'assistant'; content: string }[]) => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onBack, onNewChat, onOpenChat }) => {
  const hasChats = project.chats > 0;
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [instructionsDraft, setInstructionsDraft] = useState(DEFAULT_INSTRUCTIONS);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const avatars = PROJECT_AVATARS[project.id] || ['/images/avatars/1.png', '/images/avatars/8.png', '/images/avatars/3.png'];

  const handleChatClick = (chat: ChatScenario) => {
    if (onOpenChat) {
      onOpenChat(chat.id, chat.title, chat.messages);
    } else {
      onNewChat?.();
    }
  };

  return (
    <div className="bg-primary h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-16">
        <div className="flex flex-col max-w-[1280px] mx-auto w-full pb-10">
          {/* Avatar Group */}
          <div className="pt-10">
            <AvatarGroup size="md" spacing={-6} aria-label="Project agents">
              {avatars.map((src, i) => (
                <Avatar key={i} size="md" src={src} name={`Agent ${i + 1}`} />
              ))}
            </AvatarGroup>
          </div>

          {/* Back to projects */}
          <button onClick={onBack} className="text-sm text-secondary hover:text-primary transition-colors cursor-pointer self-start mt-4">
            Projects
          </button>

          {/* Title + description */}
          <div className="flex flex-col gap-4 max-w-[1280px] mt-2">
            <Typography variant="heading-2xl" color="primary">
              <span className="font-bold">{project.title}</span>
            </Typography>
            <Typography variant="body-md" color="secondary">
              {project.description}
            </Typography>
          </div>

          {/* Two-column */}
          <div className="flex gap-4 items-start mt-6">
            {/* Left: chats */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {hasChats ? (
                <>
                  <div className="flex items-center gap-2">
                    <Typography variant="heading-sm" color="primary" className="flex-1">Recent chats</Typography>
                    <Button variant="primary" size="sm" onClick={() => onNewChat?.()}>New chat</Button>
                  </div>
                  {CHAT_SCENARIOS.map(chat => (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => handleChatClick(chat)}
                      className="w-full text-left bg-primary border border-[#F0F3F5] rounded-lg px-5 py-4 shadow-2xs hover:bg-hover transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <Typography variant="label-sm" color="primary">{chat.title}</Typography>
                        <Typography variant="body-sm" color="tertiary">{chat.preview}</Typography>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="bg-primary border border-[#E4E7EB] rounded-2xl shadow-2xs flex flex-col items-center justify-center gap-4 flex-1" style={{ minHeight: 320 }}>
                  <div className="p-3 bg-secondary rounded-2xl">
                    <Icon name="message-text" size="sm" color="primary" />
                  </div>
                  <Typography variant="label-md" color="primary">
                    <span className="font-semibold">No chats yet</span>
                  </Typography>
                  <Button variant="primary" size="sm" onClick={() => onNewChat?.()}>
                    Start a chat
                  </Button>
                </div>
              )}
            </div>

            {/* Right: building blocks (368px) */}
            <div className="w-[368px] shrink-0 flex flex-col gap-4">
              <div className="bg-primary border border-[#E4E7EB] rounded-2xl shadow-2xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F3F5]">
                  <Typography variant="heading-sm" color="primary">Project instructions</Typography>
                  <IconButton variant="ghost" size="sm" icon="edit-ai" aria-label="Edit instructions" onClick={() => { setInstructionsDraft(instructions); setInstructionsModalOpen(true); }} />
                </div>
                <div className="px-6 py-6">
                  <Typography variant="body-sm" color="primary">{instructions}</Typography>
                </div>
              </div>

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

              <div className="bg-primary border border-[#E4E7EB] rounded-2xl shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F0F3F5]">
                  <Typography variant="heading-sm" color="primary">Files</Typography>
                </div>
                <div className="px-6 py-4">
                  <div className="border border-dashed border-[#E4E7EB] rounded-xl p-6 flex flex-col items-center gap-4">
                    <div className="p-3 bg-secondary rounded-full">
                      <Icon name="arrow-box-up" size="sm" className="text-tertiary" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Typography variant="label-sm" color="primary">Upload files</Typography>
                      <Typography variant="body-sm" color="tertiary">Drag and drop or click to upload</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal.Root open={instructionsModalOpen} onOpenChange={setInstructionsModalOpen} size="md">
        <Modal.Content>
          <Modal.Header title="Edit instructions" description="Instructions tell Circle AI how to behave in this project — its tone, focus areas, and constraints." />
          <Modal.Body>
            <TextArea value={instructionsDraft} onChange={e => setInstructionsDraft(e.target.value)} rows={6} resize="vertical" placeholder="Add instructions for Circle AI..." />
          </Modal.Body>
          <Modal.Footer secondaryAction={{ label: 'Cancel' }} primaryAction={{ label: 'Save', onClick: () => { setInstructions(instructionsDraft); setInstructionsModalOpen(false); }, shouldCloseModal: true }} />
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default ProjectDetailView;
