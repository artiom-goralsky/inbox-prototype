import React, { useState, useEffect } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { Button } from '@circleco/compass/components/Button';
import { useTheme } from '../../context/ThemeContext';

export interface CreatorData {
  id: number;
  title: string;
  creator: string;
  category: string;
  price: string;
  image: string;
  description?: string;
  memberCount?: string;
  rating?: number;
  products?: { name: string; type: string; price: string }[];
}

interface CreatorProfilePageProps {
  creator: CreatorData;
  onBack: () => void;
}

const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({
  creator,
  onBack,
}) => {
  const { setTheme } = useTheme();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'creator'; text: string }[]
  >([]);
  const [showThinking, setShowThinking] = useState(false);

  // Force dark mode on mount, restore on unmount
  useEffect(() => {
    setTheme('dark');
    return () => {
      setTheme('light');
    };
  }, [setTheme]);

  const handleSend = () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessage('');
    setShowThinking(true);

    // Simulate creator response
    setTimeout(() => {
      setShowThinking(false);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'creator',
          text: `Thanks for your interest! ${creator.title} is a great fit for anyone looking to level up in ${creator.category.toLowerCase()}. Would you like to know more about our membership benefits?`,
        },
      ]);
    }, 1500);
  };

  const products = creator.products ?? [
    { name: `${creator.title} Community`, type: 'Community', price: creator.price },
    { name: `${creator.category} Masterclass`, type: 'Course', price: '$199' },
    { name: 'Weekly Office Hours', type: 'Event', price: 'Included' },
  ];

  return (
    <div className="h-full flex flex-col bg-primary overflow-hidden">
      {/* Hero banner */}
      <div className="relative shrink-0" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 50%, #3b82f6 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto px-6 pt-8 pb-10 flex flex-col items-center gap-5">
          {/* Back button */}
          <div className="absolute top-4 left-4">
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              icon="arrow-left"
              aria-label="Back"
              onClick={onBack}
              className="text-white/70 hover:text-white"
            />
          </div>

          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/10 shadow-lg">
            <img
              src={creator.image}
              alt={creator.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <div className="text-center flex flex-col items-center gap-2">
            <h1 className="text-[28px] font-bold text-white">{creator.title}</h1>
            <div className="flex items-center gap-3 text-white/60 text-[14px]">
              <span>{creator.creator}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{creator.category}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{creator.memberCount ?? '2.4k members'}</span>
            </div>
          </div>

          {/* CTA */}
          <button type="button" className="rounded-xl px-8 py-2 text-sm font-medium text-white bg-[#111827] hover:opacity-90 transition-opacity">
            Join for {creator.price}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-8">
          {/* About */}
          <div className="flex flex-col gap-3">
            <Typography variant="label-lg" color="primary">
              <span className="font-semibold">About</span>
            </Typography>
            <Typography variant="body-md" color="secondary" className="leading-relaxed">
              {creator.description ??
                `${creator.title} is a thriving community for ${creator.category.toLowerCase()} professionals looking to connect, learn, and grow together. Led by ${creator.creator}, members get access to exclusive content, live events, and a supportive network of peers.`}
            </Typography>
          </div>

          {/* What you get */}
          <div className="flex flex-col gap-3">
            <Typography variant="label-lg" color="primary">
              <span className="font-semibold">What you get</span>
            </Typography>
            <div className="flex flex-col gap-2">
              {products.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-secondary p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <Icon
                        name={product.type === 'Community' ? 'group' : product.type === 'Course' ? 'video' : 'calendar'}
                        size="sm"
                        className="text-tertiary"
                      />
                    </div>
                    <div>
                      <Typography variant="label-md" color="primary">
                        <span className="font-medium">{product.name}</span>
                      </Typography>
                      <Typography variant="body-sm" color="tertiary">
                        {product.type}
                      </Typography>
                    </div>
                  </div>
                  <Typography variant="label-sm" color="secondary">
                    {product.price}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Thought section (expandable) */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-2 text-left group">
              <Typography variant="body-sm" color="tertiary">
                <span className="group-hover:text-primary transition-colors">Thought</span>
              </Typography>
              <Icon name="chevron-right" size="sm" className="text-tertiary" />
            </button>
            <Typography variant="body-md" color="secondary" className="leading-relaxed">
              I&apos;ll get your {creator.title} experience set up now — let me configure it right away.
            </Typography>
          </div>

          {/* Chat messages */}
          {chatMessages.length > 0 && (
            <div className="flex flex-col gap-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'creator' && (
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-1 shrink-0">
                      <img src={creator.image} alt={creator.creator} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#3b82f6] text-white rounded-tr-sm'
                        : 'bg-secondary text-primary'
                    }`}
                  >
                    <Typography variant="body-md" color={msg.role === 'user' ? undefined : 'primary'} className={msg.role === 'user' ? 'text-white' : ''}>
                      {msg.text}
                    </Typography>
                  </div>
                </div>
              ))}
              {showThinking && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                    <img src={creator.image} alt={creator.creator} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-1 px-3 py-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-[bounce_1s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-[bounce_1s_cubic-bezier(0.65,0,0.35,1)_0.15s_infinite]" />
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-[bounce_1s_cubic-bezier(0.65,0,0.35,1)_0.3s_infinite]" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating chat input */}
      <div className="shrink-0 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex flex-col min-h-[120px] rounded-2xl bg-secondary overflow-hidden px-4 py-3 justify-between"
          >
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Ask ${creator.creator}...`}
              rows={3}
              className="flex-1 bg-transparent text-[15px] text-primary placeholder:text-tertiary resize-none border-0 outline-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon="plus"
                  aria-label="Add"
                  className="text-tertiary"
                />
              </div>
              <IconButton
                type="submit"
                variant="primary"
                size="sm"
                icon="arrow-up"
                aria-label="Send"
                className="shrink-0 rounded-lg"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfilePage;
