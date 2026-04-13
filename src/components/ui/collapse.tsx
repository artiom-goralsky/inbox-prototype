import React from 'react';
import { Accordion } from '@circleco/compass/components/Accordion';

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Collapse: React.FC<CollapseProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
}) => {
  // Generate a unique ID for this accordion item
  const itemId = React.useMemo(
    () => `collapse-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  return (
    <Accordion.Root
      defaultValue={defaultOpen ? [itemId] : []}
      className={`border border-primary rounded-lg ${className}`}
    >
      <Accordion.Item value={itemId}>
        <Accordion.Trigger>
          <div className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-secondary transition-colors">
            <span className="font-medium text-primary">{title}</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content>
          <div className="px-4 pb-3">
            <div className="text-sm text-secondary">{children}</div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default Collapse;
