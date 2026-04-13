import React, { useState } from 'react';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Switch } from '@circleco/compass/components/Switch';
import ContentContainer from '../ContentContainer';
import { Button } from '@circleco/compass/components/Button';

interface GamificationProps {
  onToggleSidebar: () => void;
  onBack?: () => void;
}

const Gamification: React.FC<GamificationProps> = ({ onToggleSidebar, onBack }) => {
  const [isEnabled, setEnabled] = useState(true);
  const [levels, setLevels] = useState([
    { id: 1, name: 'Newbie', points: 0 },
    { id: 2, name: 'Amateur', points: 10 },
    { id: 3, name: 'Beignner', points: 50 },
    { id: 4, name: 'Intermediate', points: 100 },
    { id: 5, name: 'Advanced', points: 150 },
    { id: 6, name: 'Professional', points: 160 },
    { id: 7, name: 'Elite', points: 320 },
    { id: 8, name: 'Ultimate', points: 640 },
    { id: 9, name: 'Godlike', points: 1280 },
  ]);
  const [settings, setSettings] = useState({
    includeAdmins: true,
    includeModerators: true,
    makeRewardsVisible: true,
  });

  const handleLevelChange = (
    id: number,
    field: 'name' | 'points',
    value: string
  ) => {
    setLevels(prev =>
      prev.map(level =>
        level.id === id
          ? {
              ...level,
              [field]: field === 'points' ? parseInt(value) || 0 : value,
            }
          : level
      )
    );
  };

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const renderToggleButton = (isEnabled: boolean, onChange: () => void) => (
    <Switch checked={isEnabled} onCheckedChange={onChange} label="" />
  );

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Gamification"
      breadcrumb="Configure"
      onBreadcrumbClick={onBack}
      actions={
        <Button size="sm" variant="primary">
          Save changes
        </Button>
      }
    >
      {/* Gamification Overview */}

      <div className="max-w-2xl mx-auto w-full pt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Gamification
        </h2>
        <p className="text-secondary mb-6">
          Celebrate engagement and reward your members with gamification.
        </p>

        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-primary">
              Enable gamification
            </span>
            <svg
              className="w-4 h-4 text-disabled"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          {renderToggleButton(isEnabled, () => setEnabled(!isEnabled))}
        </div>
      </div>

      {isEnabled && (
        <>
          {/* Customize Levels */}
          <div className="max-w-2xl mx-auto w-full pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Customize levels
                </h3>
                <p className="text-sm text-secondary">
                  Customize the name and points of each gamification level.
                </p>
              </div>
              <button className="p-2 hover:bg-active rounded-lg">
                <svg
                  className="w-5 h-5 text-disabled"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {levels.slice(0, 8).map(level => (
                <div key={level.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">
                      Level {level.id}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-secondary">
                        Points required
                      </span>
                      {level.id === 1 && (
                        <svg
                          className="w-4 h-4 text-disabled"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <TextInput
                        value={level.name}
                        onChange={e =>
                          handleLevelChange(level.id, 'name', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-hover rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Level name"
                      />
                    </div>
                    <div className="shrink-0">
                      <TextInput
                        value={level.points}
                        onChange={e =>
                          handleLevelChange(level.id, 'points', e.target.value)
                        }
                        className="w-20 px-3 py-2 border border-hover rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* Level 9 on its own row */}
              <div className="md:col-span-2">
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">
                      Level 9
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-secondary">
                        Points required
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <TextInput
                        value={levels[8].name}
                        onChange={e =>
                          handleLevelChange(9, 'name', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-hover rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Level name"
                      />
                    </div>
                    <div className="shrink-0">
                      <TextInput
                        value={levels[8].points}
                        onChange={e =>
                          handleLevelChange(9, 'points', e.target.value)
                        }
                        className="w-20 px-3 py-2 border border-hover rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="max-w-2xl mx-auto w-full pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Leaderboard and Visibility Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <span className="text-sm font-medium text-primary">
                  Include admins on the leaderboard
                </span>
                {renderToggleButton(settings.includeAdmins, () =>
                  handleSettingChange('includeAdmins')
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <span className="text-sm font-medium text-primary">
                  Include moderators on the leaderboard
                </span>
                {renderToggleButton(settings.includeModerators, () =>
                  handleSettingChange('includeModerators')
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <span className="text-sm font-medium text-primary">
                  Make member rewards visible to other members
                </span>
                {renderToggleButton(settings.makeRewardsVisible, () =>
                  handleSettingChange('makeRewardsVisible')
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {!isEnabled && (
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Leaderboard and Visibility Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <span className="text-sm font-medium text-primary">
                Include admins on the leaderboard
              </span>
              {renderToggleButton(settings.includeAdmins, () =>
                handleSettingChange('includeAdmins')
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <span className="text-sm font-medium text-primary">
                Include moderators on the leaderboard
              </span>
              {renderToggleButton(settings.includeModerators, () =>
                handleSettingChange('includeModerators')
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <span className="text-sm font-medium text-primary">
                Make member rewards visible to other members
              </span>
              {renderToggleButton(settings.makeRewardsVisible, () =>
                handleSettingChange('makeRewardsVisible')
              )}
            </div>
          </div>
        </div>
      )}
    </ContentContainer>
  );
};

export default Gamification;
