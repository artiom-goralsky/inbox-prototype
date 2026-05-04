export const clarificationWidgetCopy = {
  question:
    'Ok! What method of contact do you prefer based on the estimated waiting times?',
  options: {
    liveChat: {
      label: 'Live chat',
      waitTime: 'wait time: 15 min',
      avatars: ['/images/avatars/3.png', '/images/avatars/5.png'],
    },
    email: {
      label: 'Email',
      waitTime: 'wait time: 22 hrs',
    },
  },
} as const;

export type ClarificationChoice = 'live_chat' | 'email';
