import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Badge } from '@circleco/compass/components/Badge';
import { TextInput } from '@circleco/compass/components/TextInput';
import { TextArea } from '@circleco/compass/components/TextArea';
import { Select, type SelectOption } from '@circleco/compass/components/Select';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { Tabs } from '@circleco/compass/components/Tabs';
import { Divider } from '@circleco/compass/components/Divider';
import { SegmentedControl } from '@circleco/compass/components/SegmentedControl';
import { mergeClasses } from '../../lib/utils';

interface EventData {
  title: string;
  description: string;
  topics: string[];
  host: string;
  space: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const INITIAL_EVENT: EventData = {
  title: 'UX Mastery Bootcamp: Crafting Seamless Digital Experiences',
  description:
    'Join us for our October Show & Tell with MXF, a community of practice for museum professionals interested in creating more inclusive and innovative cultural organizations through audience research.\n\nAfter a virtual tour of their community, you\'ll hear about:\n\n🎤 Their approach to designing beautifully branded community spaces\n🎤 Fun ways they\'re engaging their community members\n🎤 What they learned migrating their established community to Circle\n\nClick the RSVP button in the top right-hand corner, and add this event to your calendar to receive event reminders.',
  topics: ['Topic 1', 'Topic 2', 'Topic 3'],
  host: 'Artiom Goralsky',
  space: 'EventSpaceName',
  startDate: 'dec-26-2025',
  startTime: '17:00',
  endDate: 'dec-26-2025',
  endTime: '18:00',
};

const HOST_OPTIONS: SelectOption<string>[] = [
  { value: 'artiom', label: 'Artiom Goralsky' },
  { value: 'mathilde', label: 'Mathilde Lee' },
  { value: 'jorge', label: 'Jorge Silva' },
];

const SPACE_OPTIONS: SelectOption<string>[] = [
  { value: 'events', label: 'EventSpaceName' },
  { value: 'general', label: 'General' },
  { value: 'members', label: 'Members' },
];

const DATE_OPTIONS: SelectOption<string>[] = [
  { value: 'dec-26-2025', label: 'Dec 26, 2025' },
  { value: 'dec-27-2025', label: 'Dec 27, 2025' },
  { value: 'jan-5-2026', label: 'Jan 5, 2026' },
];

const TIMEZONE_OPTIONS: SelectOption<string>[] = [
  { value: 'gmt0', label: 'GMT+0 Lisbon' },
  { value: 'gmt1', label: 'GMT+1 Paris' },
  { value: 'est', label: 'EST New York' },
];

const REPEAT_OPTIONS: SelectOption<string>[] = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

const LOCATION_OPTIONS: SelectOption<string>[] = [
  { value: 'live', label: 'Live room' },
  { value: 'in-person', label: 'In person' },
  { value: 'external', label: 'External link' },
];

const ATTENDEES = [
  { name: 'Jorge Silva', initials: 'JS' },
  { name: 'Maria Williams', initials: 'MW' },
  { name: 'Robert Miles', initials: 'RM' },
  { name: 'Rui Silveira', initials: 'RS' },
];

const NAV_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'details', label: 'Details' },
  { value: 'guests', label: 'Guests' },
  { value: 'reminders', label: 'Reminders' },
  { value: 'payment', label: 'Payment' },
  { value: 'advanced', label: 'Advanced' },
];

interface EventDetailPanelProps {
  onClose: () => void;
  onSeeAllEvents?: () => void;
}

const EventDetailPanel: React.FC<EventDetailPanelProps> = ({ onClose, onSeeAllEvents }) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [publishedData, setPublishedData] = useState<EventData>(INITIAL_EVENT);
  const [editData, setEditData] = useState<EventData>(INITIAL_EVENT);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('overview');

  const handleFieldChange = (field: keyof EventData, value: string | string[]) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveTopic = (topic: string) => {
    const updated = editData.topics.filter(t => t !== topic);
    handleFieldChange('topics', updated);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setPublishedData({ ...editData });
      setIsPublishing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-primary border-l border-secondary min-w-0">

      {/* ── Panel header ─────────────────────────────────────────── */}
      <div className="shrink-0 grid grid-cols-3 items-center gap-2 px-4 py-3 border-b border-secondary">
        {/* Left — truncated title */}
        <Typography variant="label-sm" color="secondary" className="truncate font-semibold">
          Event: {publishedData.title}
        </Typography>

        {/* Center — View / Edit segmented control */}
        <div className="flex justify-center">
          <SegmentedControl
            required
            value={mode}
            onValueChange={(val) => setMode(val as 'view' | 'edit')}
            options={[
              { value: 'view', label: 'View' },
              { value: 'edit', label: 'Edit' },
            ]}
          />
        </div>

        {/* Right — See all events + close */}
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSeeAllEvents}
          >
            See all events
          </Button>
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            icon="cross"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </div>

      {/* ── Edit mode nav tabs + actions ─────────────────────────── */}
      {mode === 'edit' && (
        <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-3 border-b border-secondary">
          <Tabs.Root
            tabs={NAV_TABS}
            size="sm"
            selectedValue={activeNavTab}
            onValueChange={setActiveNavTab}
          />
          <div className="flex items-center gap-2 shrink-0">
            <IconButton type="button" variant="outline" size="sm" icon="square-arrow-top-right" aria-label="Open" />
            <IconButton type="button" variant="outline" size="sm" icon="chain-link" aria-label="Copy link" />
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={isPublishing}
              onClick={handlePublish}
            >
              Publish
            </Button>
          </div>
        </div>
      )}


{/* ── Body ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {mode === 'view' ? (
          <ViewContent data={publishedData} />
        ) : (
          <EditContent
            data={editData}
            onFieldChange={handleFieldChange}
            onRemoveTopic={handleRemoveTopic}
          />
        )}
      </div>
    </div>
  );
};

/* ── View Mode ──────────────────────────────────────────────────────── */

const ViewContent: React.FC<{ data: EventData }> = ({ data }) => (
  <div className="bg-secondary min-h-full px-8 py-6">
    <div className="flex items-start gap-5">

      {/* ── Left column ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* Cover */}
        <div className="w-full h-[304px] rounded-[13px] overflow-hidden border border-primary relative shrink-0">
          <div className="absolute inset-0 bg-[#f0f3f5]" />
        </div>

        {/* Title + details card */}
        <div className="bg-primary border border-primary rounded-[13px] p-5 flex flex-col gap-5">
          <div className="self-start">
            <Badge label="Starts in 2 weeks" variant="success" />
          </div>

          <Typography variant="heading-xl" color="primary">
            <span className="font-bold leading-snug">{data.title}</span>
          </Typography>

          <div className="flex items-center gap-3">
            <Avatar size="xs" name="Mathilde Leo" initials="ML" />
            <Typography variant="body-sm" color="secondary">
              Hosted by <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Mathilde Leo</span>
            </Typography>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-primary">
            <Typography variant="heading-sm" color="primary">
              <span className="font-semibold">Details</span>
            </Typography>
            <Typography variant="body-md" color="primary" className="whitespace-pre-wrap leading-relaxed">
              {data.description}
            </Typography>
          </div>
        </div>
      </div>

      {/* ── Right column ────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 shrink-0 w-[266px]">

        {/* Overview card */}
        <div className="bg-primary border border-primary rounded-[13px] p-5 flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <div className="bg-secondary flex flex-col items-center justify-center rounded-xl shrink-0 w-14 h-[66px]">
              <Typography variant="caption" color="secondary">
                <span className="uppercase tracking-widest font-semibold text-[9px]">NOV</span>
              </Typography>
              <Typography variant="heading-xl" color="primary">
                <span className="font-bold leading-none">27</span>
              </Typography>
            </div>
            <div className="flex flex-col gap-0.5">
              <Typography variant="label-sm" color="primary">
                <span className="font-semibold">Monday, Nov 27</span>
              </Typography>
              <Typography variant="body-sm" color="secondary">
                8:00 PM – 11:00 PM BST
              </Typography>
            </div>
          </div>

          <Divider />

          <div className="flex items-center gap-3">
            <div className="bg-secondary rounded-lg flex items-center justify-center w-8 h-8 shrink-0">
              <Icon name="video" size="sm" className="text-secondary" />
            </div>
            <Typography variant="body-sm" color="primary">Live room</Typography>
          </div>

          <Button type="button" variant="primary" fullWidth>
            Register
          </Button>
        </div>

        {/* Attendees card */}
        <div className="bg-primary border border-primary rounded-[13px] p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <Typography variant="label-sm" color="primary">44 attendees</Typography>
            <button type="button" className="hover:underline">
              <Typography variant="label-sm" color="link">See all</Typography>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {ATTENDEES.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <Avatar size="xs" name={a.name} initials={a.initials} />
                <Typography variant="body-sm" color="primary">{a.name}</Typography>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
);

/* ── Edit Mode ──────────────────────────────────────────────────────── */

const EditContent: React.FC<{
  data: EventData;
  onFieldChange: (field: keyof EventData, value: string | string[]) => void;
  onRemoveTopic: (topic: string) => void;
}> = ({ data, onFieldChange, onRemoveTopic }) => (
  <div className="flex flex-col items-center py-8 px-6 gap-5">
    <div className="w-full max-w-[880px] flex flex-col gap-5">

      {/* ── Event Details card ───────────────────────────────────── */}
      <div className="bg-primary border border-primary rounded-xl">
        {/* Card heading */}
        <div className="px-6 py-5 border-b border-secondary">
          <Typography variant="label-md" color="primary">
            <span className="font-semibold">Event Details</span>
          </Typography>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Cover */}
          <div className="flex items-start gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0 pt-1.5">Cover</Typography>
            <div className="flex-1 min-w-0 border border-dashed border-secondary rounded-xl flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-hover transition-colors">
              <div className="bg-secondary rounded-full p-3 shrink-0">
                <Icon name="image" size="md" className="text-secondary" />
              </div>
              <div className="flex flex-col gap-1">
                <Typography variant="label-sm" color="primary">Upload image</Typography>
                <Typography variant="body-sm" color="secondary">Drag and drop or click to upload</Typography>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Title</Typography>
            <div className="flex-1 min-w-0">
              <TextInput
                placeholder="Enter..."
                value={data.title}
                onChange={e => onFieldChange('title', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0 pt-2">Description</Typography>
            <div className="flex-1 min-w-0 border border-secondary rounded-lg overflow-hidden shadow-[0px_1px_4px_0px_rgba(0,0,0,0.03)]">
              <TextArea
                placeholder="Enter..."
                value={data.description}
                onChange={e => onFieldChange('description', e.target.value)}
                className="border-0 rounded-none min-h-[120px]"
              />
              <div className="flex items-center gap-0.5 px-2 py-1.5 border-t border-secondary bg-secondary/30">
                <IconButton type="button" variant="ghost" size="md" icon="zap" aria-label="Zap" />
                <IconButton type="button" variant="ghost" size="md" icon="square-play" aria-label="Video" />
                <IconButton type="button" variant="ghost" size="md" icon="image" aria-label="Image" />
                <IconButton type="button" variant="ghost" size="md" icon="gif-square" aria-label="GIF" />
                <IconButton type="button" variant="ghost" size="md" icon="emoji-smiley" aria-label="Emoji" />
                <IconButton type="button" variant="ghost" size="md" icon="paperclip" aria-label="Attach" />
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Topics</Typography>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2 border border-secondary rounded-lg px-2 py-1.5 min-h-[36px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="flex items-center flex-wrap gap-1.5">
                {data.topics.map(topic => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 border border-secondary bg-primary rounded-lg px-2 h-6 text-sm text-primary"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => onRemoveTopic(topic)}
                      className="text-tertiary hover:text-primary transition-colors flex items-center"
                      aria-label={`Remove ${topic}`}
                    >
                      <Icon name="cross" size="sm" />
                    </button>
                  </span>
                ))}
              </div>
              <Icon name="chevron-down" size="sm" className="text-secondary shrink-0" />
            </div>
          </div>

          {/* Host */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Host</Typography>
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <div className="flex-1 min-w-0">
                <Select
                  options={HOST_OPTIONS}
                  value={HOST_OPTIONS.find(o => o.label === data.host) ?? null}
                  startContent={
                    <Avatar size="xxs" name={data.host} initials={data.host.split(' ').map(n => n[0]).join('')} />
                  }
                  aria-label="Host"
                  onValueChange={(opt) => { if (opt?.label) onFieldChange('host', opt.label); }}
                />
              </div>
              <Button type="button" variant="outline" size="sm">
                Add co-host
              </Button>
            </div>
          </div>

          {/* Space */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Space</Typography>
            <div className="flex-1 min-w-0">
              <Select
                options={SPACE_OPTIONS}
                value={SPACE_OPTIONS.find(o => o.value === 'events') ?? null}
                startContent={<Icon name="calendar" size="sm" className="text-secondary" />}
                aria-label="Space"
                onValueChange={(opt) => { if (opt?.label) onFieldChange('space', opt.label); }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Date & Time card ─────────────────────────────────────── */}
      <div className="bg-primary border border-primary rounded-xl">
        <div className="px-6 py-5 border-b border-secondary">
          <Typography variant="label-md" color="primary">
            <span className="font-semibold">Date &amp; Time</span>
          </Typography>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Start */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Start</Typography>
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <div className="flex-1 min-w-0">
                <Select
                  options={DATE_OPTIONS}
                  value={DATE_OPTIONS.find(o => o.value === data.startDate) ?? null}
                  icon="calendar"
                  aria-label="Start date"
                  onValueChange={(opt) => { if (opt?.value) onFieldChange('startDate', opt.value); }}
                />
              </div>
              <div className="w-24 shrink-0">
                <TextInput
                  value={data.startTime}
                  onChange={e => onFieldChange('startTime', e.target.value)}
                  placeholder="17:00"
                />
              </div>
            </div>
          </div>

          {/* End */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">End</Typography>
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <div className="flex-1 min-w-0">
                <Select
                  options={DATE_OPTIONS}
                  value={DATE_OPTIONS.find(o => o.value === data.endDate) ?? null}
                  icon="calendar"
                  aria-label="End date"
                  onValueChange={(opt) => { if (opt?.value) onFieldChange('endDate', opt.value); }}
                />
              </div>
              <div className="w-24 shrink-0">
                <TextInput
                  value={data.endTime}
                  onChange={e => onFieldChange('endTime', e.target.value)}
                  placeholder="18:00"
                />
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Timezone</Typography>
            <div className="flex-1 min-w-0">
              <Select
                options={TIMEZONE_OPTIONS}
                value={TIMEZONE_OPTIONS[0]}
                startContent={<Icon name="earth" size="sm" className="text-secondary" />}
                aria-label="Timezone"
                onValueChange={() => {}}
              />
            </div>
          </div>

          {/* Repeat */}
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Repeat</Typography>
            <div className="flex-1 min-w-0">
              <Select
                options={REPEAT_OPTIONS}
                value={REPEAT_OPTIONS[0]}
                aria-label="Repeat"
                onValueChange={() => {}}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Location card ────────────────────────────────────────── */}
      <div className="bg-primary border border-primary rounded-xl">
        <div className="px-6 py-5 border-b border-secondary">
          <Typography variant="label-md" color="primary">
            <span className="font-semibold">Location</span>
          </Typography>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <Typography variant="label-sm" color="primary" className="w-40 shrink-0">Location</Typography>
            <div className="flex-1 min-w-0">
              <Select
                options={LOCATION_OPTIONS}
                value={null}
                placeholder="Select..."
                aria-label="Location"
                onValueChange={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default EventDetailPanel;
