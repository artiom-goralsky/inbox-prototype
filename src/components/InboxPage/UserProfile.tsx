import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';

const RUDY_AVATAR = '/ai-avatar.png';

const CONVERSATION_ATTRS = [
  { label: 'AI Title', value: '—' },
  { label: 'ID', value: '23' },
  { label: 'Company', value: '—' },
  { label: 'Brand', value: 'Circle' },
  { label: 'Subject', value: null, addable: true },
  { label: 'CX Score rating', value: '—' },
  { label: 'CX Score explanat...', value: '—' },
];

const DetailsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'copilot'>('details');
  const [linksOpen, setLinksOpen] = useState(true);
  const [attrsOpen, setAttrsOpen] = useState(true);

  const ChevronDown: React.FC<{ open: boolean }> = ({ open }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      className={`shrink-0 transition-transform text-tertiary ${open ? '' : '-rotate-90'}`}
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="w-[300px] shrink-0 bg-primary border-l border-secondary flex flex-col h-full">
      {/* Tabs header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-secondary">
        <div className="flex items-center gap-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('details')}
            className="relative pb-2 cursor-pointer"
          >
            <Typography
              variant="label-sm"
              color={activeTab === 'details' ? 'primary' : 'tertiary'}
            >
              <span className="font-medium">Details</span>
            </Typography>
            {activeTab === 'details' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ef4444] rounded-full" />
            )}
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('copilot')}
            className="relative pb-2 cursor-pointer"
          >
            <Typography
              variant="label-sm"
              color={activeTab === 'copilot' ? 'primary' : 'tertiary'}
            >
              <span className="font-medium">Copilot</span>
            </Typography>
            {activeTab === 'copilot' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ef4444] rounded-full" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton variant="ghost" size="sm" icon="arrow-up-right" aria-label="Expand" />
          <IconButton variant="ghost" size="sm" icon="layout-left" aria-label="Layout" />
        </div>
      </div>

      {activeTab === 'details' && (
        <div className="flex-1 overflow-y-auto">
          {/* Assignee */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-secondary">
            <Typography variant="body-sm" color="tertiary">
              Assignee
            </Typography>
            <div className="flex items-center gap-2">
              <img src={RUDY_AVATAR} alt="Rudy" className="w-[22px] h-[22px] rounded-full" />
              <Typography variant="body-sm" color="primary">
                Rudy
              </Typography>
            </div>
          </div>

          {/* Team Inbox */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-secondary">
            <Typography variant="body-sm" color="tertiary">
              Team Inbox
            </Typography>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L1 5.5V13H5.5V9H8.5V13H13V5.5L7 1Z" stroke="#9ca3af" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              <Typography variant="body-sm" color="tertiary">
                Unassigned
              </Typography>
            </div>
          </div>

          {/* Links section */}
          <div className="border-b border-secondary">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setLinksOpen(v => !v)}
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.5 8.5L8.5 5.5M6 4L6.5 3.5C7.7 2.3 9.7 2.3 10.9 3.5C12.1 4.7 12.1 6.7 10.9 7.9L10.5 8.3M7.5 9.7L7 10.5C5.8 11.7 3.8 11.7 2.6 10.5C1.4 9.3 1.4 7.3 2.6 6.1L3 5.7" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <Typography variant="label-sm" color="primary">
                  <span className="font-semibold">Links</span>
                </Typography>
              </div>
              <ChevronDown open={linksOpen} />
            </div>

            {linksOpen && (
              <div className="pb-2">
                {[
                  { label: 'Tracker ticket', hasAdd: true, hasDot: false },
                  { label: 'Back-office tickets', hasAdd: true, hasDot: false },
                  { label: 'Side conversations', hasAdd: false, hasDot: true, dotCount: 1 },
                ].map(link => (
                  <div
                    key={link.label}
                    className="flex items-center justify-between px-4 py-2 hover:bg-hover transition-colors cursor-pointer"
                  >
                    <Typography variant="body-sm" color="secondary">
                      {link.label}
                    </Typography>
                    {link.hasAdd && (
                      <IconButton variant="ghost" size="sm" icon="plus" aria-label={`Add ${link.label}`} />
                    )}
                    {link.hasDot && (
                      <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center">
                        <Typography variant="caption" color="primary">
                          <span className="text-white font-medium">{link.dotCount}</span>
                        </Typography>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation attributes */}
          <div className="border-b border-secondary">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setAttrsOpen(v => !v)}
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="#374151" strokeWidth="1.2" />
                  <rect x="7.5" y="1" width="5.5" height="5.5" rx="1" stroke="#374151" strokeWidth="1.2" />
                  <rect x="1" y="7.5" width="5.5" height="5.5" rx="1" stroke="#374151" strokeWidth="1.2" />
                  <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1" stroke="#374151" strokeWidth="1.2" />
                </svg>
                <Typography variant="label-sm" color="primary">
                  <span className="font-semibold">Conversation attributes</span>
                </Typography>
              </div>
              <ChevronDown open={attrsOpen} />
            </div>

            {attrsOpen && (
              <div className="pb-2">
                {CONVERSATION_ATTRS.map(attr => (
                  <div
                    key={attr.label}
                    className="flex items-center justify-between px-4 py-2"
                  >
                    <Typography variant="body-sm" color="tertiary" className="truncate">
                      {attr.label}
                    </Typography>
                    {attr.addable ? (
                      <Typography variant="body-sm" color="tertiary" className="cursor-pointer">
                        <span className="hover:text-primary transition-colors">+ Add</span>
                      </Typography>
                    ) : (
                      <Typography variant="body-sm" color="secondary">
                        {attr.value}
                      </Typography>
                    )}
                  </div>
                ))}
                <div className="px-4 pt-1">
                  <Button variant="ghost" size="sm">
                    See all
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Edit apps */}
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-hover transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="3" cy="3" r="1.5" stroke="#374151" strokeWidth="1.2" />
              <circle cx="11" cy="3" r="1.5" stroke="#374151" strokeWidth="1.2" />
              <circle cx="3" cy="11" r="1.5" stroke="#374151" strokeWidth="1.2" />
              <circle cx="11" cy="11" r="1.5" stroke="#374151" strokeWidth="1.2" />
            </svg>
            <Typography variant="body-sm" color="primary">
              Edit apps
            </Typography>
          </div>
        </div>
      )}

      {activeTab === 'copilot' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <Typography variant="body-sm" color="tertiary">
            Copilot coming soon
          </Typography>
        </div>
      )}
    </div>
  );
};

export default DetailsPanel;
