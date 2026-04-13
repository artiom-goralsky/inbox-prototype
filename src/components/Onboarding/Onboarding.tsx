import React, { useState } from 'react';
import { Badge } from '@circleco/compass/components/Badge';
import { Button } from '@circleco/compass/components/Button';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Select } from '@circleco/compass/components/Select';
import { Switch } from '@circleco/compass/components/Switch';
import { Tabs } from '@circleco/compass/components/Tabs';
import ContentContainer from '../ContentContainer';
import { TextArea } from '@circleco/compass/components/TextArea';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Typography } from '@circleco/compass/components/Typography';

interface OnboardingProps {
  onToggleSidebar?: () => void;
  onBack?: () => void;
}

interface ToggleSection {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ onToggleSidebar, onBack }) => {
  const [activeTab, setActiveTab] = useState('customize');
  const [toggleStates, setToggleStates] = useState({
    newUserInvitation: true,
    existingUserInvitation: true,
    onboardingPopup: true,
    onboardingEmail: true,
  });

  // Access tab states
  const [accessType, setAccessType] = useState<'groups' | 'spaces'>('groups');
  const [selectedAccessGroupId, setSelectedAccessGroupId] = useState<string | null>(null);

  // Workflows tab states
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('automations');
  const [noAccessItems, setNoAccessItems] = useState([
    {
      id: '1',
      name: 'Test Space',
      group: 'Aniket Test',
      type: 'space',
      icon: 'group',
    },
    {
      id: '2',
      name: 'jfjhgfjfg',
      group: 'Aniket Test',
      type: 'space',
      icon: 'group',
    },
    {
      id: '3',
      name: 'Posts space',
      group: 'Ivo test',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '4',
      name: 'Member space',
      group: 'Ivo test',
      type: 'space',
      icon: 'group',
    },
    {
      id: '5',
      name: "Ivo's course test",
      group: 'Ivo test',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '6',
      name: 'An event of some sort',
      group: 'Ivo test',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '7',
      name: 'Locked Screen',
      group: 'Ivo test',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '8',
      name: 'multiple payment options',
      group: 'Ivo test',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '9',
      name: 'Another',
      group: 'Ivo test',
      type: 'space',
      icon: 'group',
    },
    {
      id: '10',
      name: 'AGs - Tests - Events 01',
      group: 'AGs Tests',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '11',
      name: 'AGs - Tests - Events 03',
      group: 'AGs Tests',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '12',
      name: 'AGs - Tests - Events 04',
      group: 'AGs Tests',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '13',
      name: 'AGs - Tests - Events 05',
      group: 'AGs Tests',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '14',
      name: 'AGs - Tests - Events 06',
      group: 'AGs Tests',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '15',
      name: 'AGs - Tests - Events 08',
      group: 'AGs Tests',
      type: 'space',
      icon: 'lock',
    },
  ]);
  const [accessItems, setAccessItems] = useState([
    {
      id: '16',
      name: 'chat room',
      group: 'Ivo test',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '17',
      name: 'Image gallery',
      group: 'Ivo test',
      type: 'space',
      icon: 'lock',
    },
    {
      id: '18',
      name: 'AGs - Tests - Events 02',
      group: 'AGs Tests',
      type: 'space',
      icon: 'lock',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { label: 'Customize', value: 'customize' },
    { label: 'Access', value: 'access' },
    { label: 'Workflows', value: 'workflows' },
  ];

  const toggleSections: ToggleSection[] = [
    {
      id: 'newUserInvitation',
      title:
        "Customize invitation for emails that don't already have a Circle account",
      description:
        "Personalize the invitation email sent to someone if they haven't signed up to a Circle community before.",
      isEnabled: toggleStates.newUserInvitation,
    },
    {
      id: 'existingUserInvitation',
      title:
        'Customize invitation for emails that already have a Circle account',
      description:
        "Personalize the invitation email sent to someone if they've already signed up to a Circle community before.",
      isEnabled: toggleStates.existingUserInvitation,
    },
    {
      id: 'onboardingPopup',
      title: 'Show an onboarding popup after account sign up',
      description:
        'Present new members with an onboarding popup after they finish account creation.',
      isEnabled: toggleStates.onboardingPopup,
    },
    {
      id: 'onboardingEmail',
      title: 'Send an onboarding email after account sign up',
      description:
        'Email new members with a customized welcome after they finish account creation.',
      isEnabled: toggleStates.onboardingEmail,
    },
  ];

  const handleToggleChange = (sectionId: string) => {
    setToggleStates(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId as keyof typeof prev],
    }));
  };

  // Access tab handlers
  const handleMoveItem = (itemId: string, fromNoAccess: boolean) => {
    if (fromNoAccess) {
      const item = noAccessItems.find(item => item.id === itemId);
      if (item) {
        setNoAccessItems(prev => prev.filter(item => item.id !== itemId));
        setAccessItems(prev => [...prev, item]);
      }
    } else {
      const item = accessItems.find(item => item.id === itemId);
      if (item) {
        setAccessItems(prev => prev.filter(item => item.id !== itemId));
        setNoAccessItems(prev => [...prev, item]);
      }
    }
  };

  const handleAddAll = () => {
    setAccessItems(prev => [...prev, ...noAccessItems]);
    setNoAccessItems([]);
  };

  const handleRemoveAll = () => {
    setNoAccessItems(prev => [...prev, ...accessItems]);
    setAccessItems([]);
  };

  const renderToggleButton = (isEnabled: boolean, onChange: () => void) => (
    <Switch checked={isEnabled} onCheckedChange={onChange} label="" />
  );

  const renderNewUserInvitationForm = () => (
    <div className="space-y-4">
      <TextInput
        label="Email Subject Line"
        placeholder="{Invited_by_name} has Invited you to join the HappyTravels community on Circle"
        className="w-full"
      />
      <div className="relative">
        <TextArea
          label="Email Body Content"
          onChange={() => {}}
          placeholder={`Hey {first_name},

{Invited_by_name} ({Invited_by_email}) has invited you to join the {community_name} community on Circle.

Click here to accept your Invitation:

Accept Invitation

If you think you've received this invitation in error, please ignore this email.`}
        />
        <div className="absolute bottom-2 left-2 flex space-x-2">
          <IconButton
            variant="ghost"
            size="sm"
            icon="arrow-box-down"
            aria-label="Insert variable"
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon="image"
            aria-label="Insert image"
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon="emoji-smiley"
            aria-label="Insert emoji"
          />
        </div>
      </div>
      <button type="button" className="text-link text-sm font-medium hover:opacity-80">
        Variables
      </button>
    </div>
  );

  const renderExistingUserInvitationForm = () => (
    <div className="space-y-4">
      <TextInput
        label="Email Subject Line"
        placeholder="{Invited_by_name} has added you to the HappyTravels community on Circle"
        className="w-full"
      />
      <div className="relative">
        <TextArea
          label="Email Body Content"
          onChange={() => {}}
          placeholder="Existing member email"
        />
        <div className="absolute bottom-2 left-2 flex space-x-2">
          <IconButton variant="ghost" size="sm" icon="arrow-box-down" aria-label="Insert variable" />
          <IconButton variant="ghost" size="sm" icon="image" aria-label="Insert image" />
          <IconButton variant="ghost" size="sm" icon="emoji-smiley" aria-label="Insert emoji" />
        </div>
      </div>
      <button type="button" className="text-link text-sm font-medium hover:opacity-80">
        Variables
      </button>
    </div>
  );

  const renderOnboardingPopupForm = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="relative">
            <TextArea
              label="Popup content"
              onChange={() => {}}
              placeholder={`Hey, {first_name}!

Please remember, the content of this community is XXX`}
            />
            <div className="absolute bottom-2 left-2 flex space-x-2">
              <IconButton variant="ghost" size="sm" icon="image" aria-label="Insert image" />
              <IconButton variant="ghost" size="sm" icon="chain-link" aria-label="Insert link" />
              <IconButton variant="ghost" size="sm" icon="emoji-smiley" aria-label="Insert emoji" />
            </div>
          </div>
        </div>
        <button type="button" className="ml-4 px-4 py-2 text-sm font-medium border border-primary rounded-lg hover:bg-secondary transition-colors">
          Preview
        </button>
      </div>
      <TextInput
        label="Button Label"
        placeholder="I agree"
        className="w-full"
      />
      <TextInput
        label="Custom button URL (e.g. 'https://my-community.com/go')"
        placeholder="https://my-community.com/go"
        className="w-full"
      />
    </div>
  );

  const renderOnboardingEmailForm = () => (
    <div className="space-y-4">
      <TextInput
        label="Email Subject Line"
        placeholder="Welcome to {community_name}"
        className="w-full"
      />
      <div className="relative">
        <TextArea
          label="Email Body Content"
          onChange={() => {}}
          placeholder={`Hey {first_name},

Welcome to {community_name}! Have a look around our spaces — and when you're ready, start contributing with posts and comments.

123456789

Enjoy!`}
        />
        <div className="absolute bottom-2 left-2 flex space-x-2">
          <IconButton variant="ghost" size="sm" icon="arrow-box-down" aria-label="Insert variable" />
          <IconButton variant="ghost" size="sm" icon="image" aria-label="Insert image" />
          <IconButton variant="ghost" size="sm" icon="emoji-smiley" aria-label="Insert emoji" />
        </div>
      </div>
      <TextInput
        label="Custom button label (e.g. 'Let's go')"
        placeholder="Let's go"
        className="w-full"
      />
      <TextInput
        label="Custom button URL (e.g. 'https://my-community.com/go')"
        placeholder="https://my-community.com/go"
        className="w-full"
      />
    </div>
  );

  const renderCustomizeContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Typography component="h2" variant="heading-sm" color="primary">
            Customize
          </Typography>
        </div>
      </div>

      {toggleSections.map(section => (
        <div key={section.id} className="border border-primary rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Typography component="h3" variant="label-lg" color="primary" className="mb-2">
                {section.title}
              </Typography>
              <Typography component="p" variant="body-sm" color="secondary">
                {section.description}
              </Typography>
            </div>
            <div className="ml-4 flex items-center">
              <Badge label="" variant="success" icon="circle-check" className="mr-2" />
              {renderToggleButton(section.isEnabled, () =>
                handleToggleChange(section.id)
              )}
            </div>
          </div>

          {section.isEnabled && (
            <div className="mt-6">
              {section.id === 'newUserInvitation' &&
                renderNewUserInvitationForm()}
              {section.id === 'existingUserInvitation' &&
                renderExistingUserInvitationForm()}
              {section.id === 'onboardingPopup' && renderOnboardingPopupForm()}
              {section.id === 'onboardingEmail' && renderOnboardingEmailForm()}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <button type="button" className="px-6 py-2 text-sm font-medium text-white bg-[#111827] rounded-lg hover:opacity-90 transition-opacity">
          Save changes
        </button>
      </div>
    </div>
  );

  const renderAccessContent = () => {
    const accessGroups = [
      {
        id: '1',
        name: 'Julian access group test',
        status: 'Connected',
        members: 134,
        spaces: 7,
      },
      {
        id: '2',
        name: 'Mobile peeps',
        status: 'Connected',
        members: 45,
        spaces: 3,
      },
      {
        id: '3',
        name: 'Cohort 1',
        status: 'Connected',
        members: 89,
        spaces: 5,
      },
      {
        id: '4',
        name: 'Testing Access Changes',
        status: 'Connected',
        members: 12,
        spaces: 2,
      },
      { id: '5', name: 'Test 2', status: 'Connected', members: 23, spaces: 1 },
    ];

    const removedAccessGroups = [
      {
        id: '6',
        name: 'Design team',
        status: 'Removed',
        members: 7,
        spaces: 1,
      },
      { id: '7', name: 'hola', status: 'Removed', members: 8, spaces: 0 },
      { id: '8', name: 'Test group', status: 'Removed', members: 0, spaces: 1 },
    ];

    const filteredNoAccessItems = noAccessItems.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAccessItems = accessItems.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedNoAccessItems = filteredNoAccessItems.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    }, {} as Record<string, typeof noAccessItems>);

    const groupedAccessItems = filteredAccessItems.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    }, {} as Record<string, typeof accessItems>);

    return (
      <div className="space-y-8">
        <div>
          <Typography component="h2" variant="heading-sm" color="primary">
            Onboarding access
          </Typography>
          <Typography component="p" variant="body-md" color="secondary" className="mt-2">
            Grant complimentary access to all new members, regardless of how
            they join your community.
          </Typography>
          <button type="button" className="text-link mt-2 text-sm font-medium hover:opacity-80">
            Learn more
          </button>
        </div>

        {accessType === 'groups' ? (
          <div className="space-y-6">
            {/* Access Type Selection */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setAccessType('groups')}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center gap-2 ${(accessType as string) === 'groups' ? 'border-primary' : 'border-transparent hover:bg-secondary'}`}
              >
                <span className="flex items-center gap-2">
                  <Typography component="span" variant="label-md" color="primary">
                    Access groups
                  </Typography>
                  <Badge label="New" variant="destructive" />
                </span>
              </button>
              <Typography component="span" variant="body-sm" color="tertiary">
                OR
              </Typography>
              <button
                type="button"
                onClick={() => setAccessType('spaces')}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${(accessType as string) === 'spaces' ? 'border-primary' : 'border-transparent hover:bg-secondary'}`}
              >
                Space access
              </button>
            </div>

            {/* Access Group Selection */}
            <div className="space-y-2">
              <Select
                label="Select an access group"
                placeholder="Select an access group"
                options={accessGroups.map(group => ({
                  label: group.name,
                  value: group.id,
                }))}
                value={
                  accessGroups
                    .map(group => ({ label: group.name, value: group.id }))
                    .find(o => o.value === selectedAccessGroupId) ?? null
                }
                onValueChange={(option: { value: string } | null) =>
                  setSelectedAccessGroupId(option?.value ?? null)
                }
              />
              <button type="button" className="text-link text-sm font-medium hover:opacity-80 flex items-center gap-1">
                + Create new access group
              </button>
            </div>

            {/* Access Groups List */}
            <div className="space-y-4">
              {accessGroups.map(group => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 border border-primary rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Typography component="span" variant="label-md" color="primary">
                        {group.name}
                      </Typography>
                      <Badge label={group.status} variant="success" />
                    </div>
                    <Typography component="p" variant="body-sm" color="secondary" className="mt-1">
                      {group.members} members • {group.spaces} spaces
                    </Typography>
                  </div>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="dot-menu"
                    aria-label="Group options"
                  />
                </div>
              ))}

              {/* Removed Access Groups */}
              {removedAccessGroups.map(group => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 border border-primary rounded-lg bg-secondary"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Typography component="span" variant="label-md" color="primary">
                        {group.name}
                      </Typography>
                      <Badge label={group.status} variant="secondary" />
                    </div>
                    <Typography component="p" variant="body-sm" color="secondary" className="mt-1">
                      {group.members} members • {group.spaces} spaces
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconButton
                      variant="ghost"
                      size="sm"
                      icon="circle-info"
                      aria-label="Why removed"
                    />
                    <IconButton
                      variant="ghost"
                      size="sm"
                      icon="dot-menu"
                      aria-label="Group options"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Access Type Selection */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setAccessType('groups')}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center gap-2 ${(accessType as string) === 'groups' ? 'border-primary' : 'border-transparent hover:bg-secondary'}`}
              >
                <span className="flex items-center gap-2">
                  <Typography component="span" variant="label-md" color="primary">
                    Access groups
                  </Typography>
                  <Badge label="New" variant="destructive" />
                </span>
              </button>
              <Typography component="span" variant="body-sm" color="tertiary">
                OR
              </Typography>
              <button
                type="button"
                onClick={() => setAccessType('spaces')}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${(accessType as string) === 'spaces' ? 'border-primary' : 'border-transparent hover:bg-secondary'}`}
              >
                Space access
              </button>
            </div>

            {/* Search Bar */}
            <TextInput
              aria-label="Search"
              icon="magnifying-glass"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* NO ACCESS Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography component="h3" variant="heading-sm" color="primary">
                    NO ACCESS
                  </Typography>
                  <button
                    type="button"
                    className="text-link text-sm font-medium hover:opacity-80"
                    onClick={handleAddAll}
                  >
                    Add all
                  </button>
                </div>
                <div className="space-y-2 overflow-y-auto">
                  {Object.entries(groupedNoAccessItems).map(
                    ([groupName, items]) => (
                      <div key={groupName} className="space-y-2">
                        <Typography component="h4" variant="label-md" color="primary">
                          {groupName}
                        </Typography>
                        {items.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleMoveItem(item.id, true)}
                            className="w-full justify-start px-2 py-2 rounded text-sm font-medium text-primary hover:bg-secondary transition-colors flex items-center gap-2"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ACCESS Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography component="h3" variant="heading-sm" color="primary">
                    ACCESS
                  </Typography>
                  <button
                    type="button"
                    className="text-link text-sm font-medium hover:opacity-80"
                    onClick={handleRemoveAll}
                  >
                    Remove all
                  </button>
                </div>
                <div className="space-y-2 overflow-y-auto">
                  {Object.entries(groupedAccessItems).map(
                    ([groupName, items]) => (
                      <div key={groupName} className="space-y-2">
                        <Typography component="h4" variant="label-md" color="primary">
                          {groupName} ({items.length} spaces)
                        </Typography>
                        {items.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleMoveItem(item.id, false)}
                            className="w-full justify-start px-2 py-2 rounded text-sm font-medium text-primary hover:bg-secondary transition-colors flex items-center gap-2"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWorkflowsContent = () => {
    const workflowTabs = [
      { id: 'automations', label: 'Automations', count: 1138 },
      { id: 'bulk-actions', label: 'Bulk actions', count: 733 },
      { id: 'scheduled', label: 'Scheduled', count: 143 },
      { id: 'archived', label: 'Archived', count: 46 },
    ];

    const mockWorkflows = {
      automations: [
        {
          id: '1',
          name: 'Automation Aug 22, 2025 at 08:10 PM',
          createdBy: { name: 'Andy', avatar: 'A', color: 'bg-blue-500' },
          totalRuns: 0,
          active: false,
        },
        {
          id: '2',
          name: 'Automation Aug 21, 2025 at 01:15 PM',
          createdBy: { name: 'Will', avatar: 'W', color: 'bg-green-500' },
          totalRuns: 0,
          active: false,
        },
        {
          id: '3',
          name: 'Automation Aug 21, 2025 at 04:33 PM',
          createdBy: { name: 'Trisha', avatar: 'TD', color: 'bg-teal-500' },
          totalRuns: 1,
          active: true,
        },
        {
          id: '4',
          name: 'Course test',
          createdBy: { name: 'Trisha', avatar: 'TD', color: 'bg-teal-500' },
          totalRuns: 1,
          active: true,
        },
        {
          id: '5',
          name: 'Automation Aug 20, 2025 at 09:19 PM',
          createdBy: { name: 'Pedro', avatar: 'PH', color: 'bg-olive-500' },
          totalRuns: 0,
          active: false,
        },
      ],
      'bulk-actions': [
        {
          id: '1',
          name: 'Bulk action Aug 19, 2025 at 02:34 PM',
          status: 'Draft',
          createdBy: { name: 'Pedro', avatar: 'PH', color: 'bg-green-500' },
        },
        {
          id: '2',
          name: 'Bulk action Aug 19, 2025 at 02:09 PM',
          status: 'Draft',
          createdBy: { name: 'Pedro', avatar: 'PH', color: 'bg-green-500' },
        },
        {
          id: '3',
          name: 'Bulk action Aug 18, 2025 at 01:06 PM',
          status: 'Draft',
          createdBy: { name: 'Mehmet', avatar: 'MI', color: 'bg-red-700' },
        },
        {
          id: '4',
          name: 'Bulk action Aug 14, 2025 at 05:10 PM',
          status: 'Draft',
          createdBy: { name: 'Pedro', avatar: 'PH', color: 'bg-green-500' },
        },
        {
          id: '5',
          name: 'Email to all members of a space',
          status: 'Draft',
          createdBy: {
            name: 'Ridhwana',
            avatar: 'R',
            color: 'bg-dark-green-500',
          },
        },
      ],
      scheduled: [
        {
          id: '1',
          name: 'Scheduled bulk action Aug 22, 2025 at 04:31 PM',
          type: '',
          createdBy: { name: 'Pedro', avatar: 'PH', color: 'bg-green-700' },
        },
        {
          id: '2',
          name: 'Scheduled bulk action Aug 18, 2025 at 05:39 PM',
          type: '',
          createdBy: { name: 'Andy', avatar: 'A', color: 'bg-blue-500' },
        },
        {
          id: '3',
          name: 'Scheduled bulk action after rails upgrade',
          type: 'Recurring',
          createdBy: { name: 'Akshay', avatar: 'A', color: 'bg-purple-500' },
        },
        {
          id: '4',
          name: 'Scheduled bulk action Jul 29, 2025 at 12:30 PM',
          type: '',
          createdBy: { name: 'Hector', avatar: 'HV', color: 'bg-green-500' },
        },
        {
          id: '5',
          name: 'Scheduled bulk action Jul 09, 2025 at 09:28 AM',
          type: '',
          createdBy: { name: 'Daniel', avatar: 'D', color: 'bg-blue-600' },
        },
      ],
      archived: [
        {
          id: '1',
          name: 'TECT-982 test',
          type: 'Bulk action',
          createdBy: { name: 'Agney', avatar: 'A', color: 'bg-brown-500' },
        },
        {
          id: '2',
          name: "Rene's scheduled",
          type: 'Scheduled',
          createdBy: { name: 'Rene', avatar: 'RR', color: 'bg-pink-700' },
        },
        {
          id: '3',
          name: 'Kelsey - Live',
          type: 'Scheduled',
          createdBy: { name: 'Kelsey', avatar: 'K', color: 'bg-blue-400' },
        },
        {
          id: '4',
          name: 'Untitled workflow',
          type: 'Scheduled',
          createdBy: { name: 'Naseef', avatar: 'N', color: 'bg-blue-300' },
        },
        {
          id: '5',
          name: 'Untitled workflow',
          type: 'Bulk action',
          createdBy: { name: 'Mrinmoy', avatar: 'M', color: 'bg-green-500' },
        },
      ],
    };

    const currentWorkflows =
      mockWorkflows[activeWorkflowTab as keyof typeof mockWorkflows] || [];
    const currentTab = workflowTabs.find(tab => tab.id === activeWorkflowTab);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Typography component="h2" variant="heading-sm" color="primary">
            Workflows
          </Typography>
          <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-[#111827] rounded-lg hover:opacity-90 transition-opacity">
            New workflow
          </button>
        </div>

        {/* Workflow Sub-tabs */}
        <div className="border-b border-primary">
          <div className="flex gap-2">
            {workflowTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveWorkflowTab(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeWorkflowTab === tab.id ? 'bg-secondary text-primary' : 'text-secondary hover:bg-secondary'}`}
              >
                {tab.label} {tab.count.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Count */}
        <Typography component="p" variant="heading-sm" color="primary">
          {currentTab?.count.toLocaleString()} workflows
        </Typography>

        {/* Workflows Table */}
        <div className="border border-primary rounded-lg overflow-hidden">
          <div className="bg-secondary px-6 py-3 border-b border-primary">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-4">NAME</div>
              {activeWorkflowTab === 'automations' && (
                <>
                  <div className="col-span-3">CREATED BY</div>
                  <div className="col-span-3 text-right">TOTAL RUNS</div>
                  <div className="col-span-2 text-right">ACTIVE</div>
                </>
              )}
              {(activeWorkflowTab === 'bulk-actions' ||
                activeWorkflowTab === 'scheduled' ||
                activeWorkflowTab === 'archived') && (
                <>
                  <div className="col-span-4">STATUS</div>
                  <div className="col-span-4">CREATED BY</div>
                </>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {currentWorkflows.map(workflow => (
              <div key={workflow.id} className="px-6 py-4 hover:bg-secondary">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <Typography component="p" variant="label-md" color="primary">
                      {workflow.name}
                    </Typography>
                  </div>

                  {activeWorkflowTab === 'automations' && (
                    <>
                      <div className="col-span-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full ${workflow.createdBy.color} flex items-center justify-center text-white text-xs font-medium`}
                          >
                            {workflow.createdBy.avatar}
                          </div>
                          <Typography component="span" variant="body-sm" color="secondary">
                            {workflow.createdBy.name}
                          </Typography>
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <Typography component="span" variant="body-sm" color="secondary">
                          {(workflow as any).totalRuns}
                        </Typography>
                      </div>
                      <div className="col-span-2 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Switch
                            checked={Boolean((workflow as any).active)}
                            onCheckedChange={() => {}}
                            label=""
                          />
                          <Typography component="span" variant="label-sm" color="tertiary">
                            {(workflow as any).active ? 'On' : 'Off'}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}

                  {(activeWorkflowTab === 'bulk-actions' ||
                    activeWorkflowTab === 'scheduled' ||
                    activeWorkflowTab === 'archived') && (
                    <>
                      <div className="col-span-4">
                        <Typography component="span" variant="body-sm" color="secondary">
                          {activeWorkflowTab === 'bulk-actions'
                            ? (workflow as any).status
                            : (workflow as any).type}
                        </Typography>
                      </div>
                      <div className="col-span-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full ${workflow.createdBy.color} flex items-center justify-center text-white text-xs font-medium`}
                          >
                            {workflow.createdBy.avatar}
                          </div>
                          <Typography component="span" variant="body-sm" color="secondary">
                            {workflow.createdBy.name}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Typography component="p" variant="body-sm" color="secondary">
            Showing 1-5 of {currentTab?.count.toLocaleString()}
          </Typography>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar || (() => {})}
      title="Onboarding"
      breadcrumb="Configure"
      onBreadcrumbClick={onBack}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Tab Content - Scrollable */}
      <div className="flex-1 min-h-0">
        <div className="p-6">
          {activeTab === 'customize' && renderCustomizeContent()}
          {activeTab === 'access' && renderAccessContent()}
          {activeTab === 'workflows' && renderWorkflowsContent()}
        </div>
      </div>
    </ContentContainer>
  );
};

export default Onboarding;
