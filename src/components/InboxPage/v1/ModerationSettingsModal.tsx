import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { Switch } from '@circleco/compass/components/Switch';
import { Modal } from '@circleco/compass/components/Modal';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Badge } from '@circleco/compass/components/Badge';

interface ModerationSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModerationSettingsModal: React.FC<ModerationSettingsModalProps> = ({ open, onOpenChange }) => {
  const [profanityWords, setProfanityWords] = useState('Moderation, Key word');
  const [flagAfterReports, setFlagAfterReports] = useState(20);
  const [flagPostAfterReports, setFlagPostAfterReports] = useState(10);
  const [flagByAdmin, setFlagByAdmin] = useState(true);
  const [disableRepetitive, setDisableRepetitive] = useState(true);
  const [flagNewPosts, setFlagNewPosts] = useState(false);
  const [flagNewComments, setFlagNewComments] = useState(false);
  const [firstPostApproval, setFirstPostApproval] = useState(false);
  const [moderateAfterRejection, setModerateAfterRejection] = useState(true);
  const [hidePreview, setHidePreview] = useState(true);

  const [spacePosts] = useState(['Post space']);
  const [spaceComments] = useState(['Images', 'FAQ', 'Post space']);

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange} size="lg">
      <Modal.Content>
        <Modal.Header title="Moderation settings" />
        <Modal.Body>
          <div className="flex flex-col gap-8">
            {/* AI Workflows banner */}
            <div className="bg-secondary rounded-xl p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Typography variant="heading-sm" color="primary">Automate moderation with AI Workflows</Typography>
              </div>
              <Button variant="outline" size="sm">Browse templates</Button>
            </div>

            {/* Moderation settings */}
            <div className="flex flex-col gap-4">
              <Typography variant="heading-sm" color="primary">Moderation settings</Typography>
              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="primary">Profanity filter</Typography>
                <Typography variant="caption" color="secondary">
                  When a member's posts or comments include any of these words, they'll be flagged for review and hidden until approved. Separate with a comma.
                </Typography>
                <input
                  type="text"
                  value={profanityWords}
                  onChange={(e) => setProfanityWords(e.target.value)}
                  className="border border-secondary rounded-lg px-3 py-2 text-sm bg-primary outline-none focus:border-info"
                  placeholder="Moderation, Key word"
                />
              </div>
            </div>

            {/* Reported moderation */}
            <div className="flex flex-col gap-4">
              <Typography variant="heading-sm" color="primary">Reported moderation</Typography>

              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="primary">Flag all member activity after X reports</Typography>
                <Typography variant="caption" color="secondary">
                  After a member's posts or comments are reported this many times, all future posts will need admin approval until the member is un-flagged by an admin.
                </Typography>
                <input
                  type="number"
                  value={flagAfterReports}
                  onChange={(e) => setFlagAfterReports(Number(e.target.value))}
                  className="border border-secondary rounded-lg px-3 py-2 text-sm bg-primary outline-none focus:border-info w-24"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="primary">Flag a post or comment after it's reported X times</Typography>
                <Typography variant="caption" color="secondary">
                  After a post or comment is reported this many times, it will be flagged for review.
                </Typography>
                <input
                  type="number"
                  value={flagPostAfterReports}
                  onChange={(e) => setFlagPostAfterReports(Number(e.target.value))}
                  className="border border-secondary rounded-lg px-3 py-2 text-sm bg-primary outline-none focus:border-info w-24"
                />
              </div>

              <Switch
                label="Flag a post or comment if reported by an admin or moderator"
                description="When an admin or moderator reports a post or comment, it will be automatically flagged for review."
                labelPosition="start"
                checked={flagByAdmin}
                onCheckedChange={setFlagByAdmin}
              />

              <Switch
                label="Disable repetitive notifications for reported members"
                description="Stop sending repeated email notifications when the same member keeps getting reported."
                labelPosition="start"
                checked={disableRepetitive}
                onCheckedChange={setDisableRepetitive}
              />
            </div>

            {/* Preemptive moderation */}
            <div className="flex flex-col gap-4">
              <Typography variant="heading-sm" color="primary">Preemptive moderation</Typography>

              <Switch
                label="Flag all new posts"
                description="All new posts will be flagged for review and hidden until approved by an admin."
                labelPosition="start"
                checked={flagNewPosts}
                onCheckedChange={setFlagNewPosts}
              />

              <Switch
                label="Flag all new comments"
                description="All new comments will be flagged for review and hidden until approved by an admin."
                labelPosition="start"
                checked={flagNewComments}
                onCheckedChange={setFlagNewComments}
              />

              <Switch
                label="First post or comment approval"
                description="New posts and comments by members who haven't posted anything yet will be flagged for review and hidden until their first post or comment is approved."
                labelPosition="start"
                checked={firstPostApproval}
                onCheckedChange={setFirstPostApproval}
              />

              <Switch
                label="Moderate after rejection"
                description="After rejecting a post or comment, all future posts by that member will need admin approval."
                labelPosition="start"
                checked={moderateAfterRejection}
                onCheckedChange={setModerateAfterRejection}
              />
            </div>

            {/* Space moderation */}
            <div className="flex flex-col gap-4">
              <Typography variant="heading-sm" color="primary">Space moderation</Typography>

              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="primary">Flag all new posts in given spaces</Typography>
                <Typography variant="caption" color="secondary">Posts in these spaces will be automatically flagged for review.</Typography>
                <div className="flex flex-wrap gap-2">
                  {spacePosts.map((tag) => (
                    <Badge key={tag} variant="secondary" label={tag} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Typography variant="label-sm" color="primary">Flag all new comments in given spaces</Typography>
                <Typography variant="caption" color="secondary">Comments in these spaces will be automatically flagged for review.</Typography>
                <div className="flex flex-wrap gap-2">
                  {spaceComments.map((tag) => (
                    <Badge key={tag} variant="secondary" label={tag} />
                  ))}
                </div>
              </div>
            </div>

            {/* Email settings */}
            <div className="flex flex-col gap-4">
              <Typography variant="heading-sm" color="primary">Email settings</Typography>

              <Switch
                label="Hide flagged content preview in emails"
                description="Hides the preview of flagged posts or comments in email notifications."
                labelPosition="start"
                checked={hidePreview}
                onCheckedChange={setHidePreview}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{ label: 'Save changes', onClick: () => onOpenChange(false) }}
          secondaryAction={{ label: 'Cancel' }}
        />
      </Modal.Content>
    </Modal.Root>
  );
};

export default ModerationSettingsModal;
