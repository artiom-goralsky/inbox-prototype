import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Button } from '@circleco/compass/components/Button';
import { SplitButton } from '@circleco/compass/components/SplitButton';
import { Alert } from '@circleco/compass/components/Alert';
import { Badge } from '@circleco/compass/components/Badge';
import { Accordion } from '@circleco/compass/components/Accordion';
import { MODERATION_THREADS, MODERATION_CARDS, INITIAL_DECISIONS, type V1Report } from './v1MockData';

function ReportRow({ report }: { report: V1Report }) {
  const status = report.status ?? 'pending';
  const badgeVariant = status === 'removed' ? 'destructive' : status === 'approved' ? 'success' : 'secondary';
  const badgeLabel = status === 'removed' ? 'Removed' : status === 'approved' ? 'Approved' : 'Pending';
  const isClickable = !!report.linkedThreadId;

  const handleClick = () => {
    if (report.linkedThreadId) {
      window.dispatchEvent(new CustomEvent('moderation-navigate', { detail: { id: report.linkedThreadId } }));
    }
  };

  return (
    <div
      className={`flex items-center gap-3 ${isClickable ? 'cursor-pointer hover:bg-hover rounded-lg -mx-2 px-2 py-1' : ''}`}
      onClick={isClickable ? handleClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && handleClick() : undefined}
    >
      <Avatar name={report.reporterName} size="lg" />
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-sm">
          <Typography variant="heading-sm" color="primary">{report.reporterName}</Typography>
          <Typography variant="body-sm" color="primary">reported for</Typography>
          <Typography variant="heading-sm" color="primary">{report.reason}</Typography>
        </div>
        <Typography variant="caption" color="secondary">{report.date}</Typography>
      </div>
      <Badge variant={badgeVariant} label={badgeLabel} />
    </div>
  );
}

interface ModerationCenterPanelV1Props {
  selectedId: string;
  onProfileOpen: (name: string) => void;
}

const ModerationCenterPanelV1: React.FC<ModerationCenterPanelV1Props> = ({ selectedId, onProfileOpen }) => {
  const thread = MODERATION_THREADS.find((t) => t.id === selectedId);
  const card = MODERATION_CARDS[selectedId];
  const [decision, setDecision] = useState<Record<string, 'approved' | 'removed'>>(() => ({ ...INITIAL_DECISIONS }));

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <Typography variant="body-sm" color="tertiary">Select a flagged item</Typography>
      </div>
    );
  }

  const data = card ?? {
    authorName: thread.name,
    postSpace: 'General Discussion',
    reportCount: 1,
    alertTitle: `${thread.name} has been reported`,
    alertDescription: '1 report pending review',
    reportStats: { posts: 1, comments: 0, connectionRequests: 0, chatMessages: 0 },
    postTitle: 'Flagged content',
    postBody: thread.preview,
    reports: [{ reporterName: 'Community Member', reason: 'Inappropriate content', date: '1 day ago', comment: 'This content violates community guidelines.' }],
  };

  const statsDescription = `${data.reportStats.posts} posts \u00b7 ${data.reportStats.comments} comments \u00b7 ${data.reportStats.connectionRequests} connection requests \u00b7 ${data.reportStats.chatMessages} chat messages`;

  const itemType = thread.badgeLabel ?? 'Post';
  const isPost = itemType === 'Post';
  const currentDecision = decision[selectedId];

  const handleAction = (action: 'approved' | 'removed') => {
    setDecision(prev => ({ ...prev, [selectedId]: action }));
    window.dispatchEvent(new CustomEvent('moderation-reviewed', { detail: { id: selectedId, action } }));
  };

  const removeSplitOption = itemType === 'Connection'
    ? 'Remove and disable connections'
    : itemType === 'Comment'
      ? 'Remove and flag member'
      : itemType === 'DM'
        ? 'Remove and disable direct messages'
        : 'Remove and moderate future posts';

  const approveEl = isPost ? (
    <SplitButton
      variant="outline"
      size="sm"
      onClick={() => handleAction('approved')}
      menuOptions={[{ label: 'Approve and moderate future posts', onClick: () => handleAction('approved') }]}
    >
      Approve
    </SplitButton>
  ) : (
    <Button variant="outline" size="sm" onClick={() => handleAction('approved')}>Approve</Button>
  );

  const removeEl = (
    <SplitButton
      variant="outline"
      size="sm"
      onClick={() => handleAction('removed')}
      menuOptions={[{ label: removeSplitOption, onClick: () => handleAction('removed') }]}
    >
      Remove
    </SplitButton>
  );

  // After a decision, show badge + opposite action
  const headerActions = !currentDecision
    ? <>{approveEl}{removeEl}</>
    : currentDecision === 'approved'
      ? <><Badge variant="success" label="Approved" />{removeEl}</>
      : <><Badge variant="destructive" label="Removed" />{approveEl}</>;

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 h-14 px-3 border-b border-[#f0f3f5] shrink-0">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-hover flex-1" onClick={() => onProfileOpen(data.authorName)}>
          <Avatar name={data.authorName} size="sm" />
          <Typography variant="heading-md" color="primary">{data.authorName}</Typography>
        </button>
        <div className="flex items-center gap-2">
          {headerActions}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-[72px] pt-6 pb-6 flex flex-col gap-6 max-w-[768px] mx-auto">
          {/* Alert banner — static, informational only */}
          <Alert
            variant="warning"
            icon="triangle-exclamation"
            title={data.alertTitle}
            description={statsDescription}
          />

          {/* Content card — only post context + content */}
          <div className="border border-secondary rounded-2xl overflow-hidden">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={data.authorName} size="lg" />
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-sm">
                    <Typography variant="heading-sm" color="primary">{data.authorName}</Typography>
                    <Typography variant="body-sm" color="primary">posted in</Typography>
                    <Typography variant="heading-sm" color="primary">{data.postSpace}</Typography>
                  </div>
                  <Typography variant="caption" color="secondary">{data.reportCount} reports</Typography>
                </div>
              </div>
              <Typography variant="label-lg" color="primary">{data.postTitle}</Typography>
              <Typography variant="body-md" color="primary">{data.postBody}</Typography>
            </div>
          </div>

          {/* Reports accordion — standalone, outside card */}
          <Accordion.Root isBoxed>
            <Accordion.Item value="reports">
              <Accordion.Trigger>{data.reports.length} reports</Accordion.Trigger>
              <Accordion.Content>
                <div className="flex flex-col py-5">
                  {/* THIS REPORT */}
                  <Typography variant="label-xs-uppercase" color="tertiary" className="mb-4">This report</Typography>
                  <ReportRow report={data.reports[0]} />

                  {/* OTHER REPORTS */}
                  {data.reports.length > 1 && (
                    <>
                      <Typography variant="label-xs-uppercase" color="tertiary" className="mt-6 mb-4">Other reports</Typography>
                      <div className="flex flex-col gap-5">
                        {data.reports.slice(1).map((report, idx) => (
                          <ReportRow key={idx} report={report} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>
    </div>
  );
};

export default ModerationCenterPanelV1;
