import React from 'react';
import { Icon } from '@circleco/compass/components/Icon';
import { Typography } from '@circleco/compass/components/Typography';
import { settingsNavDataV5 } from '../SidebarV2/navDataV2';

type ConfigureScreenProps = {
  onSelectItem: (id: string) => void;
  onToggleSidebar?: () => void;
};

export default function ConfigureScreen({
  onSelectItem,
}: ConfigureScreenProps) {
  return (
    <div className="h-full overflow-auto bg-primary px-16">
      <div className="max-w-[1280px] mx-auto pt-16 pb-10">
        <Typography
          color="primary"
          component="h1"
          variant="heading-2xl"
          className="mb-8"
        >
          Configure
        </Typography>

        <div className="flex flex-col gap-10">
          {settingsNavDataV5.map(section => (
            <section key={section.heading}>
              <h2 className="text-[14px] font-semibold text-primary mb-4">
                {section.heading}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItem(item.id)}
                    className="flex items-start gap-3 h-auto min-h-[72px] p-4 rounded-[12px] text-left border border-secondary hover:bg-secondary hover:border-tertiary transition-colors"
                  >
                    <span className="shrink-0 w-10 h-10 mb-2 rounded-[10px] bg-secondary flex items-center justify-center">
                      <div className="w-5 h-5 text-secondary">
                        <Icon
                          name={item.iconName as any}
                          size="md"
                        />
                      </div>
                    </span>
                    <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-[14px] font-medium text-primary">
                        {item.label}
                      </span>
                      <span className="text-[13px] text-secondary leading-snug">
                        {item.description ??
                          `Manage ${item.label.toLowerCase()} and related options.`}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
