export interface Workflow {
  id: string;
  name: string;
  createdBy: {
    name: string;
    avatar: string;
  };
  isActive: boolean;
  type: 'automation' | 'bulk-action' | 'scheduled' | 'archived';
  description?: string;
  createdAt: string;
}

export const mockWorkflows: Workflow[] = [
  // Automations (1057)
  {
    id: '1',
    name: 'Email new members on joining a space',
    createdBy: {
      name: 'Lucas Marcellus',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    isActive: false,
    type: 'automation',
    description:
      'Automatically send welcome email to new members when they join a space',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '2',
    name: 'Moderate new posts',
    createdBy: {
      name: 'Sofia Valente',
      avatar:
        'https://ui-avatars.com/api/?name=Sofia+Valente&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Review and moderate all new posts before they go live',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '3',
    name: 'Curate the home feed',
    createdBy: {
      name: 'Nina Cortez',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    },
    isActive: false,
    type: 'automation',
    description: 'Automatically curate and organize content for the home feed',
    createdAt: 'Mar 26, 2024',
  },
  // Bulk Actions (705)
  {
    id: '4',
    name: 'Bulk user import',
    createdBy: {
      name: 'Jasper Lemoine',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    isActive: false,
    type: 'bulk-action',
    description: 'Import multiple users from CSV file',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '5',
    name: 'Bulk email campaign',
    createdBy: {
      name: "Clara D'Angelo",
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
    },
    isActive: false,
    type: 'bulk-action',
    description: 'Send bulk email to selected users',
    createdAt: 'Mar 26, 2024',
  },
  // Scheduled (139)
  {
    id: '6',
    name: 'Weekly digest email',
    createdBy: {
      name: 'Felix Montoya',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    },
    isActive: false,
    type: 'scheduled',
    description: 'Send weekly digest email every Monday',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '7',
    name: 'Monthly report generation',
    createdBy: {
      name: 'Isabella Torres',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
    },
    isActive: false,
    type: 'scheduled',
    description: 'Generate and send monthly reports',
    createdAt: 'Mar 26, 2024',
  },
  // Archived (46)
  {
    id: '8',
    name: 'Old welcome email',
    createdBy: {
      name: 'Owen Sinclair',
      avatar:
        'https://ui-avatars.com/api/?name=Owen+Sinclair&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'archived',
    description: 'Old welcome email workflow (deprecated)',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '9',
    name: 'Legacy moderation',
    createdBy: {
      name: 'Marcus Chen',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
    },
    isActive: false,
    type: 'archived',
    description: 'Legacy moderation workflow (replaced)',
    createdAt: 'Mar 26, 2024',
  },
  // More automations for realistic count
  {
    id: '10',
    name: 'Email new members on joining a space',
    createdBy: {
      name: 'Emma Wilson',
      avatar: '',
    },
    isActive: false,
    type: 'automation',
    description:
      'Automatically send welcome email to new members when they join a space',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '11',
    name: 'Moderate new posts',
    createdBy: {
      name: 'Alex Johnson',
      avatar:
        'https://ui-avatars.com/api/?name=Alex+Johnson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Review and moderate all new posts before they go live',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '12',
    name: 'Curate the home feed',
    createdBy: {
      name: 'Sarah Davis',
      avatar:
        'https://ui-avatars.com/api/?name=Sarah+Davis&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Automatically curate and organize content for the home feed',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '13',
    name: 'Email new members on joining a space',
    createdBy: {
      name: 'Michael Brown',
      avatar:
        'https://ui-avatars.com/api/?name=Michael+Brown&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description:
      'Automatically send welcome email to new members when they join a space',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '14',
    name: 'Moderate new posts',
    createdBy: {
      name: 'Lisa Garcia',
      avatar:
        'https://ui-avatars.com/api/?name=Lisa+Garcia&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Review and moderate all new posts before they go live',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '15',
    name: 'Curate the home feed',
    createdBy: {
      name: 'David Miller',
      avatar:
        'https://ui-avatars.com/api/?name=David+Miller&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Automatically curate and organize content for the home feed',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '16',
    name: 'Email new members on joining a space',
    createdBy: {
      name: 'Jennifer Lee',
      avatar:
        'https://ui-avatars.com/api/?name=Jennifer+Lee&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description:
      'Automatically send welcome email to new members when they join a space',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '17',
    name: 'Moderate new posts',
    createdBy: {
      name: 'Robert Wilson',
      avatar:
        'https://ui-avatars.com/api/?name=Robert+Wilson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Review and moderate all new posts before they go live',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '18',
    name: 'Curate the home feed',
    createdBy: {
      name: 'Amanda Taylor',
      avatar:
        'https://ui-avatars.com/api/?name=Amanda+Taylor&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Automatically curate and organize content for the home feed',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '19',
    name: 'Email new members on joining a space',
    createdBy: {
      name: 'Christopher Anderson',
      avatar:
        'https://ui-avatars.com/api/?name=Christopher+Anderson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description:
      'Automatically send welcome email to new members when they join a space',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '20',
    name: 'Moderate new posts',
    createdBy: {
      name: 'Michelle White',
      avatar:
        'https://ui-avatars.com/api/?name=Michelle+White&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'automation',
    description: 'Review and moderate all new posts before they go live',
    createdAt: 'Mar 26, 2024',
  },
  // More bulk actions
  {
    id: '21',
    name: 'Bulk user export',
    createdBy: {
      name: 'Daniel Martinez',
      avatar:
        'https://ui-avatars.com/api/?name=Daniel+Martinez&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'bulk-action',
    description: 'Export multiple users to CSV file',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '22',
    name: 'Bulk content moderation',
    createdBy: {
      name: 'Jessica Thompson',
      avatar:
        'https://ui-avatars.com/api/?name=Jessica+Thompson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'bulk-action',
    description: 'Moderate multiple content items at once',
    createdAt: 'Mar 26, 2024',
  },
  // More scheduled workflows
  {
    id: '23',
    name: 'Daily backup',
    createdBy: {
      name: 'Kevin Rodriguez',
      avatar:
        'https://ui-avatars.com/api/?name=Kevin+Rodriguez&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'scheduled',
    description: 'Create daily backup of system data',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '24',
    name: 'Weekly analytics',
    createdBy: {
      name: 'Rachel Green',
      avatar:
        'https://ui-avatars.com/api/?name=Rachel+Green&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'scheduled',
    description: 'Generate weekly analytics report',
    createdAt: 'Mar 26, 2024',
  },
  // More archived workflows
  {
    id: '25',
    name: 'Old notification system',
    createdBy: {
      name: 'Thomas Anderson',
      avatar:
        'https://ui-avatars.com/api/?name=Thomas+Anderson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'archived',
    description: 'Old notification system (deprecated)',
    createdAt: 'Mar 26, 2024',
  },
  {
    id: '26',
    name: 'Legacy user sync',
    createdBy: {
      name: 'Emily Davis',
      avatar:
        'https://ui-avatars.com/api/?name=Emily+Davis&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    isActive: false,
    type: 'archived',
    description: 'Legacy user synchronization (replaced)',
    createdAt: 'Mar 26, 2024',
  },
];

// Filter workflows by type
export const getWorkflowsByType = (type: string) => {
  return mockWorkflows.filter(workflow => workflow.type === type);
};

// Get counts for each type
export const getWorkflowCounts = () => {
  const automations = mockWorkflows.filter(
    workflow => workflow.type === 'automation'
  ).length;
  const bulkActions = mockWorkflows.filter(
    workflow => workflow.type === 'bulk-action'
  ).length;
  const scheduled = mockWorkflows.filter(
    workflow => workflow.type === 'scheduled'
  ).length;
  const archived = mockWorkflows.filter(
    workflow => workflow.type === 'archived'
  ).length;

  return {
    automations,
    bulkActions,
    scheduled,
    archived,
  };
};
