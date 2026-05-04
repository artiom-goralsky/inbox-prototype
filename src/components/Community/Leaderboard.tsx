import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Badge } from '@circleco/compass/components/Badge';
import { EmojiIcon } from '@circleco/compass/components/EmojiIcon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { Divider } from '@circleco/compass/components/Divider';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  title: string;
  points: string;
  avatar?: string;
  avatarBg?: string;
}

interface Level {
  number: number;
  name: string;
  percentage: string;
  color: string;
  textColor: string;
  isLocked?: boolean;
}

const Leaderboard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setIsScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const [activeFilter, setActiveFilter] = useState<
    '7 days' | '30 days' | 'All time'
  >('7 days');

  // Mock data for current user
  const currentUser = {
    name: 'Melissa Emberson',
    points: '8,828 points',
    avatar: '/images/avatars/1.png',
    currentLevel: 8,
    levelName: 'Advanced',
    progress: 32,
    progressToNext: '32 likes to level up',
  };

  // Levels data
  const levels: Level[] = [
    {
      number: 1,
      name: 'Basic',
      percentage: '24% members',
      color: '#f8efdd',
      textColor: '#d69b29',
    },
    {
      number: 2,
      name: 'Student',
      percentage: '12% members',
      color: '#f8efdd',
      textColor: '#d69b29',
    },
    {
      number: 3,
      name: 'Rising Star',
      percentage: '8% members',
      color: '#f8efdd',
      textColor: '#d69b29',
    },
    {
      number: 4,
      name: 'Community Guru',
      percentage: '7% members',
      color: '#eaedfd',
      textColor: '#506cf0',
    },
    {
      number: 5,
      name: 'Creator',
      percentage: '7% members',
      color: '#eaedfd',
      textColor: '#506cf0',
    },
    {
      number: 6,
      name: 'Knowledge Hero',
      percentage: '5% members',
      color: '#eaedfd',
      textColor: '#506cf0',
    },
    {
      number: 7,
      name: 'Famous',
      percentage: '3% members',
      color: '#f5ecfc',
      textColor: '#ac61e7',
    },
    {
      number: 8,
      name: 'Advanced',
      percentage: '2% members',
      color: '#f5ecfc',
      textColor: '#ac61e7',
    },
    {
      number: 9,
      name: 'Pro creator',
      percentage: '1% members',
      color: '#f5ecfc',
      textColor: '#ac61e7',
      isLocked: true,
    },
  ];

  // Leaderboard entries
  const leaderboardEntries: LeaderboardEntry[] = [
    {
      id: '1',
      rank: 1,
      name: 'Corina McCoy',
      title: 'Mindfulness and yoga host',
      points: '+1,237',
      avatarBg: '#66ffff',
    },
    {
      id: '2',
      rank: 2,
      name: 'Jammie Jhonson',
      title: 'Meditation and mindfulness video creator',
      points: '+983',
      avatarBg: '#ffed4c',
    },
    {
      id: '3',
      rank: 3,
      name: 'Judith Rodriguez',
      title: 'Mindfulness teacher',
      points: '+432',
      avatarBg: '#b9e191',
    },
    {
      id: '4',
      rank: 4,
      name: 'Daniel Hamilton',
      title: 'Head of Mindfulness',
      points: '18,902',
      avatarBg: '#fab8c4',
    },
    {
      id: '5',
      rank: 5,
      name: 'Ricky Smith',
      title:
        'CMO and Marketing Coach for building effective internal marketing teams',
      points: '15,452',
      avatar: '/images/avatars/2.png',
    },
    {
      id: '6',
      rank: 6,
      name: 'Jesica Willow',
      title: 'Community Builder at Millers&k',
      points: '14,221',
      avatar: '/images/avatars/3.png',
    },
    {
      id: '7',
      rank: 7,
      name: 'Paula Mora',
      title: 'Community Manager',
      points: '13,212',
      avatar: '/images/avatars/4.png',
    },
    {
      id: '8',
      rank: 8,
      name: 'Jerry Helfer',
      title: 'Professional Learner',
      points: '3,421',
      avatar: '/images/avatars/5.png',
    },
    {
      id: '9',
      rank: 9,
      name: 'Dennis Callis',
      title: 'Community Lead, #GirlDadx2, Connecting Homeschool Parents',
      points: '898',
      avatar: '/images/avatars/6.png',
    },
    {
      id: '10',
      rank: 10,
      name: 'Laura Peterson',
      title: 'Product Designer',
      points: '23',
      avatar: '/images/avatars/7.png',
    },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="shrink-0 size-8 flex items-center justify-center">
          <Badge label="1" variant="warning" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="shrink-0 size-8 flex items-center justify-center">
          <Badge label="2" variant="secondary" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="shrink-0 size-8 flex items-center justify-center">
          <Badge label="3" variant="almond" />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start relative shrink-0">
          <div className="flex flex-col gap-[11px] items-center justify-center overflow-hidden px-[11px] py-1.5 rounded-full shrink-0 size-8">
            <Typography
              component="p"
              variant="label-md"
              color="tertiary"
            >
              <span className="leading-5 tracking-[-0.15px]">{rank}</span>
            </Typography>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-secondary overflow-hidden min-w-0">
      {/* Sticky header */}
      <div className={`shrink-0 bg-secondary z-10 transition-all duration-200 ${isScrolled ? 'border-b border-secondary' : 'pt-3'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div className="max-w-[1280px] mx-auto px-9">
          <div className={`flex items-center justify-between gap-3 transition-all duration-200 ${isScrolled ? 'py-3' : 'py-6'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <Typography variant={isScrolled ? 'heading-sm' : 'heading-xl'} color="primary">Leaderboard</Typography>
            <div className="flex items-center gap-2">
              <IconButton variant="outline" size="sm" icon="dot-menu" aria-label="More options" />
            </div>
          </div>
        </div>
        {isScrolled && <Divider orientation="horizontal" />}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center gap-6 px-9 pt-4 max-w-[1280px] mx-auto w-full">
      {/* Main Content */}
      <div className="flex flex-col gap-9 items-start max-w-[1280px] w-full">
        {/* Profile Progress Card */}
        <div className="bg-primary rounded-2xl shadow-2xs w-full p-6">
          {/* Top Section: Avatar, Name & Points, Progress Bar */}
          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200 to-purple-300" />
                <div className="absolute inset-[4px] overflow-hidden rounded-full">
                  <div className="w-full h-full">
                    <Avatar
                      src={currentUser.avatar}
                      name={currentUser.name}
                    />
                  </div>
                </div>
                {/* Level Badge on Avatar */}
                <div className="absolute bg-level-top flex items-center justify-center rounded-full -bottom-1 -right-1 w-8 h-8">
                  <Typography
                    component="p"
                    variant="label-md"
                  >
                    <span className="leading-5 text-[#ac61e7] text-center">{currentUser.currentLevel}</span>
                  </Typography>
                </div>
              </div>
            </div>

            {/* Name & Points */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <Typography
                component="p"
                variant="heading-md"
                color="primary"
              >
                <span className="leading-7 tracking-[-0.4px]">{currentUser.name}</span>
              </Typography>
              <Typography
                component="p"
                variant="body-sm"
                color="secondary"
              >
                <span className="leading-5">{currentUser.points}</span>
              </Typography>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="bg-secondary w-px h-[52px]" />
              <div className="flex flex-col gap-2">
                <div className="bg-level-top flex gap-2.5 items-center justify-center px-3 py-1 rounded-full">
                  <div className="text-[#dfa430]"><EmojiIcon emoji="🏆" size="xs" aria-label="Trophy" /></div>
                  <div className="bg-[#e9d6f9] h-3 rounded-full shrink-0 w-px" />
                  <Typography component="p" variant="label-md">
                    <span className="leading-5 text-[#ac61e7]">{currentUser.levelName}</span>
                  </Typography>
                </div>
                <div className="flex gap-1 items-center">
                  <Typography component="p" variant="label-sm" color="tertiary">
                    <span className="leading-[18px]">{currentUser.progress}</span>
                  </Typography>
                  <Typography component="p" variant="label-sm" color="tertiary">
                    <span className="leading-[18px]">{currentUser.progressToNext}</span>
                  </Typography>
                  <div className="w-3 h-3 text-tertiary"><Icon name="clock" size="sm" /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Levels Section: 3 Columns */}
          <div className="grid grid-cols-3 gap-5">
            {/* Column 1 */}
            <div className="flex flex-col gap-5">
              {levels.slice(0, 3).map(level => (
                <div key={level.number} className="flex items-start gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 w-8 h-8"
                    style={{ backgroundColor: level.color }}
                  >
                    <Typography
                      component="p"
                      variant="label-md"
                    >
                      <span className="leading-5 text-center" style={{ color: level.textColor }}>{level.number}</span>
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <Typography component="p" variant="label-md" color="primary">
                      <span className="leading-5">{level.name}</span>
                    </Typography>
                    <Typography component="p" variant="label-sm" color="tertiary">
                      <span className="leading-[18px]">{level.percentage}</span>
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-5">
              {levels.slice(3, 6).map(level => (
                <div key={level.number} className="flex items-start gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 w-8 h-8"
                    style={{ backgroundColor: level.color }}
                  >
                    <Typography
                      component="p"
                      variant="label-md"
                    >
                      <span className="leading-5 text-center" style={{ color: level.textColor }}>{level.number}</span>
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <Typography component="p" variant="label-md" color="primary">
                      <span className="leading-5">{level.name}</span>
                    </Typography>
                    <Typography component="p" variant="label-sm" color="tertiary">
                      <span className="leading-[18px]">{level.percentage}</span>
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-5">
              {levels.slice(6).map(level => (
                <div key={level.number} className="flex items-start gap-2.5">
                  {level.isLocked ? (
                    <div className="bg-primary border border-[#d2d7db] flex items-center justify-center rounded-full shrink-0 w-8 h-8">
                      <div className="w-4 h-4 text-tertiary"><Icon name="lock" size="sm" /></div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-full shrink-0 w-8 h-8"
                      style={{ backgroundColor: level.color }}
                    >
                      <Typography
                        component="p"
                        variant="label-md"
                      >
                        <span className="leading-5 text-center" style={{ color: level.textColor }}>{level.number}</span>
                      </Typography>
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <Typography
                      component="p"
                      variant="label-md"
                      color={level.isLocked ? 'tertiary' : 'primary'}
                    >
                      <span className="leading-5">{level.name}</span>
                    </Typography>
                    <Typography
                      component="p"
                      variant="label-sm"
                      color={level.isLocked ? 'disabled' : 'tertiary'}
                    >
                      <span className="leading-[18px]">{level.percentage}</span>
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="flex flex-col gap-4 items-start w-full">
          {/* Filters */}
          <div className="flex gap-2 items-center w-full">
            <div className="flex flex-1 gap-2 items-center">
              {(['7 days', '30 days', 'All time'] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`h-9 px-[18px] rounded-full text-sm font-medium transition-colors ${activeFilter === filter ? 'border border-primary bg-primary' : 'hover:bg-hover'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex gap-2.5 items-center justify-end">
              <Typography component="p" variant="label-sm" color="secondary">
                <span className="leading-[18px]">POINTS</span>
              </Typography>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="bg-primary flex flex-col gap-4 items-center justify-center overflow-hidden px-0 py-6 rounded-2xl shadow-2xs w-full">
            {leaderboardEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between w-full px-6 ${
                  index < leaderboardEntries.length - 1
                    ? 'border-b border-secondary pb-4'
                    : ''
                }`}
              >
                <div className="flex flex-1 gap-6 items-center justify-center">
                  {getRankBadge(entry.rank)}
                  <div className="flex flex-1 gap-3 h-full items-start">
                    <div className="shrink-0 size-14" style={entry.avatarBg ? { backgroundColor: entry.avatarBg, borderRadius: '9999px' } : undefined}>
                      <Avatar
                        src={entry.avatar}
                        name={entry.name}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 h-full items-start">
                      <Typography
                        component="p"
                        variant="label-lg"
                        color="primary"
                      >
                        <span className="leading-6 tracking-[-0.3px]">{entry.name}</span>
                      </Typography>
                      <div className="flex flex-col gap-2 items-start justify-center">
                        <Typography
                          component="p"
                          variant="body-sm"
                          color="secondary"
                        >
                          <span className="leading-5 tracking-[-0.15px]">{entry.title}</span>
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-center rounded-lg shrink-0">
                  <Typography component="p" variant="label-md" color="primary">
                    <span className="leading-5 text-center">{entry.points}</span>
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Leaderboard;
