import React, { useRef, useState } from 'react';
import { Menu } from '@circleco/compass/components/Menu';
import { Avatar } from '@circleco/compass/components/Avatar';
import { Icon } from '@circleco/compass/components/Icon';
import { SegmentedControl } from '@circleco/compass/components/SegmentedControl';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_AVATAR_SRC = '/images/avatars/1.png';

interface AvatarDropdownProps {
  /** Avatar image URL */
  avatarSrc?: string;
  /** Avatar name for alt/aria */
  avatarName?: string;
  /** Optional custom trigger (if not provided, uses default avatar button) */
  trigger?: React.ReactElement;
  /** Optional class for the default trigger wrapper */
  triggerClassName?: string;
  /** Menu placement side */
  menuSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Menu alignment */
  menuAlign?: 'start' | 'center' | 'end';
}

/**
 * Dropdown menu on avatar click (Figma: Circle 4.0 – profile menu).
 * Uses Compass Menu with: View profile, Edit profile, Notifications,
 * Authentication, Theme (ikona levo + SegmentedControl sun/moon), Shortcuts, horizontal line, Sign out.
 * Toggle: click avatar again when open to close.
 * Same fade in/out animation as community admin dropdown (opacity only).
 */
const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  avatarSrc = DEFAULT_AVATAR_SRC,
  avatarName = 'Profile',
  trigger,
  triggerClassName = 'p-2 rounded-full flex items-center hover:bg-secondary',
  menuSide = 'bottom',
  menuAlign = 'end',
}) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLElement | null>(null);

  const noop = (): void => undefined;

  const menuOptions = [
    { label: 'View profile', icon: 'people' as const, onClick: noop },
    { label: 'Edit profile', icon: 'edit' as const, onClick: noop },
    { label: 'Notifications', icon: 'bell' as const, onClick: noop },
    { label: 'Authentication', icon: 'lock' as const, onClick: noop },
    {
      label: '',
      prefix: (
        <div
          className="flex items-center justify-between w-full min-w-0 gap-3"
          data-theme-row
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 shrink-0">
            <Icon name="section" size="sm" />
            <span className="text-body-sm text-primary">Theme</span>
          </div>
          <div className="shrink-0 ml-auto">
            <SegmentedControl
              options={[
                { value: 'light', label: '', icon: 'sun' },
                { value: 'dark', label: '', icon: 'moon' },
              ]}
              value={theme}
              onValueChange={value => setTheme(value as 'light' | 'dark')}
              required
            />
          </div>
        </div>
      ),
      onClick: (e: React.MouseEvent<HTMLElement>) => e.preventDefault(),
      closeOnClick: false,
    },
    { label: 'Shortcuts', icon: 'keyboard' as const, onClick: noop },
    'divider' as const,
    { label: 'Sign out', icon: 'arrow-box-left' as const, onClick: noop },
  ];

  const defaultTrigger = (
    <button
      type="button"
      className={triggerClassName}
      aria-label="Profile menu"
    >
      <div className="ring-2 ring-purple-500/50 rounded-full">
        <Avatar src={avatarSrc} name={avatarName} size="sm" />
      </div>
    </button>
  );

  const handleOpenChange = (nextOpen: boolean): void => {
    if (nextOpen) {
      setOpen(true);
      setTimeout(() => {
        const menus = document.querySelectorAll('[role="menu"]');
        const menu = menus.length ? menus[menus.length - 1] : null;
        const popup = menu?.parentElement;
        if (popup instanceof HTMLElement) {
          popup.classList.add('avatar-menu-popup');
          popupRef.current = popup;
          const duration = 200;
          popup.style.opacity = '0';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              popup.style.transition = `opacity ${duration}ms ease-out`;
              popup.style.opacity = '1';
            });
          });
        }
      }, 0);
    } else {
      const popup = popupRef.current;
      if (popup) {
        const duration = 160;
        popup.style.transition = `opacity ${duration}ms ease-in`;
        popup.style.opacity = '0';
        window.setTimeout(() => {
          setOpen(false);
          popup.classList.remove('avatar-menu-popup');
          popupRef.current = null;
        }, duration);
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <Menu
      options={menuOptions}
      trigger={trigger ?? defaultTrigger}
      open={open}
      onOpenChange={handleOpenChange}
      side={menuSide}
      align={menuAlign}
      sideOffset={6}
    />
  );
};

export default AvatarDropdown;
