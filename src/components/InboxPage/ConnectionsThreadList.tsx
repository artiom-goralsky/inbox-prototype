import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Avatar } from '@circleco/compass/components/Avatar';

interface ConnectionRequest {
  id: string;
  fromName: string;
  toName: string;
  time: string;
  status: 'pending' | 'accepted';
}

const CONNECTION_REQUESTS: ConnectionRequest[] = [
  { id: 'c1', fromName: 'Sarah Kim',     toName: 'James Liu',  time: '2h',  status: 'pending' },
  { id: 'c2', fromName: 'Tom Wilson',    toName: 'Emily Park', time: '5h',  status: 'pending' },
  { id: 'c3', fromName: 'Maria Santos',  toName: 'Admin',      time: '1d',  status: 'pending' },
  { id: 'c4', fromName: 'Calvin Parks',  toName: 'Jake Miller',time: '2d',  status: 'accepted' },
];

interface ConnectionsThreadListProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const ConnectionsThreadList: React.FC<ConnectionsThreadListProps> = ({ selectedId, onSelect }) => (
  <div className="w-full h-full border-r border-secondary flex flex-col bg-primary">
    <div className="flex-1 overflow-y-auto p-2">
      {CONNECTION_REQUESTS.map(item => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(item.id)}
          onKeyDown={e => e.key === 'Enter' && onSelect(item.id)}
          className={`flex items-center gap-3 pl-3 pr-3 py-2.5 cursor-pointer transition-colors rounded-xl ${
            selectedId === item.id ? 'bg-active' : 'hover:bg-hover'
          }`}
        >
          <Avatar name={item.fromName} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <Typography variant="heading-sm" color="primary" className="truncate shrink-0 max-w-[80px]">
                {item.fromName}
              </Typography>
              <Typography variant="caption" color="tertiary" className="shrink-0">→</Typography>
              <Typography variant="body-sm" color="secondary" className="truncate">
                {item.toName}
              </Typography>
            </div>
            <Typography variant="caption" color="tertiary">
              {item.status === 'pending' ? 'Pending' : 'Accepted'}
            </Typography>
          </div>
          <Typography variant="caption" color="tertiary" className="shrink-0">{item.time}</Typography>
        </div>
      ))}
    </div>
  </div>
);

export default ConnectionsThreadList;
