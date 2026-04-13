export interface Page {
  id: string;
  title: string;
  status: 'Published' | 'Not published';
  author: {
    name: string;
    avatar: string;
  };
  updated: string;
}

export const mockPages: Page[] = [
  {
    id: '1',
    title: 'Coming soon',
    status: 'Published',
    author: {
      name: 'Lucas Marcellus',
      avatar: '/images/avatars/1.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '2',
    title: 'Home page',
    status: 'Published',
    author: {
      name: 'Sofia Valente',
      avatar: '/images/avatars/2.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '3',
    title: 'About us',
    status: 'Not published',
    author: {
      name: 'Nina Cortez',
      avatar: '/images/avatars/3.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '4',
    title: 'Contact us',
    status: 'Not published',
    author: {
      name: 'Jasper Lemoine',
      avatar: '/images/avatars/4.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '5',
    title: 'Course sales page #1',
    status: 'Not published',
    author: {
      name: "Clara D'Angelo",
      avatar: '/images/avatars/5.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '6',
    title: 'Course sales page #2',
    status: 'Not published',
    author: {
      name: 'Felix Montoya',
      avatar: '/images/avatars/6.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '7',
    title: 'Course sales page #3',
    status: 'Published',
    author: {
      name: 'Isabella Torres',
      avatar: '/images/avatars/7.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '8',
    title: 'Course sales page #4',
    status: 'Published',
    author: {
      name: 'Owen Sinclair',
      avatar: '/images/avatars/8.png',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '9',
    title: 'Blog post #1',
    status: 'Published',
    author: {
      name: 'Marcus Chen',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '10',
    title: 'Blog post #2',
    status: 'Not published',
    author: {
      name: 'Emma Wilson',
      avatar: '',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '11',
    title: 'Product page #1',
    status: 'Published',
    author: {
      name: 'Alex Johnson',
      avatar:
        'https://ui-avatars.com/api/?name=Alex+Johnson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '12',
    title: 'Product page #2',
    status: 'Not published',
    author: {
      name: 'Sarah Davis',
      avatar:
        'https://ui-avatars.com/api/?name=Sarah+Davis&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '13',
    title: 'FAQ page',
    status: 'Published',
    author: {
      name: 'Michael Brown',
      avatar:
        'https://ui-avatars.com/api/?name=Michael+Brown&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '14',
    title: 'Privacy Policy',
    status: 'Published',
    author: {
      name: 'Lisa Garcia',
      avatar:
        'https://ui-avatars.com/api/?name=Lisa+Garcia&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '15',
    title: 'Terms of Service',
    status: 'Published',
    author: {
      name: 'David Miller',
      avatar:
        'https://ui-avatars.com/api/?name=David+Miller&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '16',
    title: 'Landing page #1',
    status: 'Not published',
    author: {
      name: 'Jennifer Lee',
      avatar:
        'https://ui-avatars.com/api/?name=Jennifer+Lee&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '17',
    title: 'Landing page #2',
    status: 'Published',
    author: {
      name: 'Robert Wilson',
      avatar:
        'https://ui-avatars.com/api/?name=Robert+Wilson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '18',
    title: 'Newsletter signup',
    status: 'Published',
    author: {
      name: 'Amanda Taylor',
      avatar:
        'https://ui-avatars.com/api/?name=Amanda+Taylor&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '19',
    title: 'Testimonials page',
    status: 'Not published',
    author: {
      name: 'Christopher Anderson',
      avatar:
        'https://ui-avatars.com/api/?name=Christopher+Anderson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '20',
    title: 'Support page',
    status: 'Published',
    author: {
      name: 'Michelle White',
      avatar:
        'https://ui-avatars.com/api/?name=Michelle+White&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '21',
    title: 'Pricing page',
    status: 'Published',
    author: {
      name: 'Daniel Martinez',
      avatar:
        'https://ui-avatars.com/api/?name=Daniel+Martinez&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '22',
    title: 'Features overview',
    status: 'Not published',
    author: {
      name: 'Jessica Thompson',
      avatar:
        'https://ui-avatars.com/api/?name=Jessica+Thompson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '23',
    title: 'Case studies',
    status: 'Published',
    author: {
      name: 'Kevin Rodriguez',
      avatar:
        'https://ui-avatars.com/api/?name=Kevin+Rodriguez&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '24',
    title: 'Team page',
    status: 'Not published',
    author: {
      name: 'Rachel Green',
      avatar:
        'https://ui-avatars.com/api/?name=Rachel+Green&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '25',
    title: 'Careers page',
    status: 'Published',
    author: {
      name: 'Thomas Anderson',
      avatar:
        'https://ui-avatars.com/api/?name=Thomas+Anderson&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '26',
    title: 'Press kit',
    status: 'Not published',
    author: {
      name: 'Emily Davis',
      avatar:
        'https://ui-avatars.com/api/?name=Emily+Davis&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '27',
    title: 'API documentation',
    status: 'Published',
    author: {
      name: 'Ryan Cooper',
      avatar:
        'https://ui-avatars.com/api/?name=Ryan+Cooper&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '28',
    title: 'Integration guide',
    status: 'Not published',
    author: {
      name: 'Stephanie Lewis',
      avatar:
        'https://ui-avatars.com/api/?name=Stephanie+Lewis&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '29',
    title: 'Security page',
    status: 'Published',
    author: {
      name: 'Andrew Hall',
      avatar:
        'https://ui-avatars.com/api/?name=Andrew+Hall&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '30',
    title: 'Compliance page',
    status: 'Not published',
    author: {
      name: 'Nicole Young',
      avatar:
        'https://ui-avatars.com/api/?name=Nicole+Young&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '31',
    title: 'Partner program',
    status: 'Published',
    author: {
      name: 'Brandon King',
      avatar:
        'https://ui-avatars.com/api/?name=Brandon+King&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '32',
    title: 'Developer resources',
    status: 'Not published',
    author: {
      name: 'Lauren Scott',
      avatar:
        'https://ui-avatars.com/api/?name=Lauren+Scott&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
  {
    id: '33',
    title: 'Community guidelines',
    status: 'Published',
    author: {
      name: 'Gregory Adams',
      avatar:
        'https://ui-avatars.com/api/?name=Gregory+Adams&background=random&color=fff&size=128&font-size=0.5&length=2',
    },
    updated: 'Mar 26, 2024 at 11:44 PM',
  },
];
