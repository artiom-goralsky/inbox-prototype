import React from 'react';
import { Typography } from '@circleco/compass/components/Typography';
import SidebarToggle from '../ui/sidebar-toggle';

interface HeaderProps {
  onToggleSidebar: () => void;
  onAddMember: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onAddMember }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <SidebarToggle onToggle={onToggleSidebar} />
        <Typography color="primary" component="h1" variant="heading-2xl">
          Manage audience
        </Typography>
      </div>
      <button
        onClick={onAddMember}
        className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm font-medium"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.00073 2.5999C7.04344 2.5999 6.26741 3.37594 6.26741 4.33324C6.26741 5.29054 7.04344 6.06657 8.00073 6.06657C8.95802 6.06657 9.73406 5.29053 9.73406 4.33324C9.73406 3.37594 8.95802 2.5999 8.00073 2.5999ZM5.06741 4.33324C5.06741 2.7132 6.38069 1.3999 8.00073 1.3999C9.62077 1.3999 10.9341 2.7132 10.9341 4.33324C10.9341 5.95327 9.62077 7.26657 8.00073 7.26657C6.38069 7.26657 5.06741 5.95327 5.06741 4.33324ZM2.75965 11.7004C3.54437 9.57856 5.47553 8.06657 8.00073 8.06657C8.51963 8.06657 9.0163 8.13058 9.48507 8.25248C9.80577 8.33588 9.99815 8.66347 9.91475 8.98417C9.83135 9.30488 9.50376 9.49725 9.18306 9.41386C8.81556 9.31829 8.4205 9.26657 8.00073 9.26657C6.00442 9.26657 4.5051 10.4403 3.88514 12.1166L3.88514 12.1166C3.8305 12.2644 3.86033 12.3967 3.95665 12.5115C4.06123 12.6362 4.24511 12.7332 4.4653 12.7332H7.33406C7.66543 12.7332 7.93406 13.0019 7.93406 13.3332C7.93406 13.6646 7.66543 13.9332 7.33406 13.9332H4.4653C3.89982 13.9332 3.37597 13.6864 3.03739 13.2829C2.69054 12.8695 2.54176 12.2895 2.75965 11.7004M12.0007 9.3999C12.3321 9.3999 12.6007 9.66853 12.6007 9.9999V11.3999H14.0007C14.3321 11.3999 14.6007 11.6685 14.6007 11.9999C14.6007 12.3313 14.3321 12.5999 14.0007 12.5999H12.6007V13.9999C12.6007 14.3313 12.3321 14.5999 12.0007 14.5999C11.6694 14.5999 11.4007 14.3313 11.4007 13.9999V12.5999H10.0007C9.66936 12.5999 9.40073 12.3313 9.40073 11.9999C9.40073 11.6685 9.66936 11.3999 10.0007 11.3999H11.4007V9.9999C11.4007 9.66853 11.6694 9.3999 12.0007 9.3999Z"
            fill="#F7F9FA"
          />
        </svg>
        <span>Add members</span>
      </button>
    </div>
  );
};

export default Header;
