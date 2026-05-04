import React, { useState } from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import { Icon } from '@circleco/compass/components/Icon';
import { IconButton } from '@circleco/compass/components/IconButton';
import { Button } from '@circleco/compass/components/Button';

export interface PlanSection {
  title: string;
  description: string;
  details?: string[];
  /** Marks this step as requiring explicit confirmation before execution */
  sensitive?: boolean;
}

export interface PlanData {
  title: string;
  icon?: string;
  iconColor?: string;
  sections: PlanSection[];
}

interface PlanCardProps {
  plan: PlanData;
  onBuild?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onBuild }) => {
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      {/* Card */}
      <div className="bg-primary rounded-xl border border-secondary shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-0 flex flex-col gap-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-royal-blue-100 flex items-center justify-center">
                <Icon name="pencil" size="lg" />
              </div>
              {plan.title && (
                <Typography variant="heading-lg" color="primary">
                  <span className="font-bold">{plan.title}</span>
                </Typography>
              )}
            </div>
            <Button type="button" variant="outline" size="md" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {plan.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-1 pb-2">
                <Typography variant="heading-sm" color="primary">
                  <span className="font-semibold">{section.title}</span>
                </Typography>
                {section.details && section.details.length > 0 ? (
                  <>
                    <div
                      className="grid transition-[grid-template-rows] duration-[250ms]"
                      style={{
                        gridTemplateRows: expanded ? '1fr' : '0fr',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <div className="overflow-hidden">
                        <ul className="list-disc ml-5 mt-1 flex flex-col gap-0.5">
                          {section.details.map((detail, j) => (
                            <li key={j}>
                              <Typography variant="body-sm" color="secondary">{detail}</Typography>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div
                      className="transition-[opacity,transform] duration-[200ms]"
                      style={{
                        opacity: expanded ? 0 : 1,
                        maxHeight: expanded ? 0 : 'none',
                        overflow: 'hidden',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <Typography variant="body-sm" color="secondary">{section.description}</Typography>
                    </div>
                  </>
                ) : (
                  <Typography variant="body-sm" color="secondary">{section.description}</Typography>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Build it */}
        <div className="px-5 py-4">
          <Button type="button" variant="primary" size="md" startIcon="sparkle" onClick={onBuild}>
            Build it
          </Button>
        </div>
      </div>

      {/* Feedback row */}
      <div className="flex items-center gap-[5px]">
        <Typography variant="body-sm" color="secondary" className="flex-1">
          How does the plan look?
        </Typography>
        <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Looks good" />
        <div className="-scale-y-100">
          <IconButton type="button" variant="ghost" size="sm" icon="thumbup" aria-label="Needs changes" />
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setHidden(true)}>
          Hide
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
