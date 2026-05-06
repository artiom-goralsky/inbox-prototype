export const clarificationWidgetCopy = {
  question: "I'll connect you with our team — which works best?",
  options: {
    liveChat: {
      label: 'Live Chat',
      waitTime: 'Wait ~15 min',
      avatars: ['/images/avatars/3.png', '/images/avatars/5.png'],
    },
    email: {
      label: 'Email',
      waitTime: 'Reply within 1 business day',
    },
  },
} as const;

export type ClarificationChoice = 'live_chat' | 'email';
