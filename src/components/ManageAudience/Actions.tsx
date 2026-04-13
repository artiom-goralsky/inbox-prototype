import React from 'react';

interface ActionsProps {
  currentUsersCount: number;
  selectedUsersCount: number;
  hasUnsavedChanges: boolean;
  showSaveSuccess: boolean;
  showBulkActions: boolean;
  showMoreActions: boolean;
  onSaveSegment: () => void;
  onToggleBulkActions: () => void;
  onToggleMoreActions: () => void;
  onBulkEmailMarketing: (enabled: boolean) => void;
  onBulkRoleChange: (role: 'Member' | 'Moderator' | 'Admin') => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  onEditSelectedUser: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  currentUsersCount,
  selectedUsersCount,
  hasUnsavedChanges,
  showSaveSuccess,
  showBulkActions,
  showMoreActions,
  onSaveSegment,
  onToggleBulkActions,
  onToggleMoreActions,
  onBulkEmailMarketing,
  onBulkRoleChange,
  onBulkDelete,
  onClearSelection,
  onEditSelectedUser,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-secondary">
        {currentUsersCount.toLocaleString()} people
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onSaveSegment}
          className={`px-4 py-2 border border-hover rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${
            hasUnsavedChanges
              ? 'bg-black text-white hover:bg-black/80'
              : 'text-gray-700 hover:bg-disabled'
          }`}
        >
          <span>Save segment</span>
          {hasUnsavedChanges && (
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          )}
        </button>
        {showSaveSuccess && (
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm animate-fadeIn">
            ✓ Saved successfully!
          </div>
        )}
        <div className="relative">
          <button
            onClick={onToggleBulkActions}
            className="px-4 py-2 border border-hover rounded-lg text-sm text-gray-700 hover:bg-disabled transition-colors duration-200 flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedUsersCount === 0}
          >
            <span>Bulk actions ({selectedUsersCount})</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showBulkActions ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Bulk Actions Dropdown */}
          {showBulkActions && selectedUsersCount > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-primary border border-primary rounded-lg shadow-lg z-10 animate-modalSlideIn">
              <div className="p-4">
                <h3 className="text-sm font-medium text-primary mb-3">
                  Bulk actions for {selectedUsersCount} selected users
                </h3>

                {/* Email Marketing Section */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Email Marketing
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => onBulkEmailMarketing(true)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                    >
                      ✓ Enable email marketing
                    </button>
                    <button
                      onClick={() => onBulkEmailMarketing(false)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                    >
                      ✗ Disable email marketing
                    </button>
                  </div>
                </div>

                {/* Role Section */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Change Role
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => onBulkRoleChange('Member')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                    >
                      Set as Member
                    </button>
                    <button
                      onClick={() => onBulkRoleChange('Moderator')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                    >
                      Set as Moderator
                    </button>
                    <button
                      onClick={() => onBulkRoleChange('Admin')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                    >
                      Set as Admin
                    </button>
                  </div>
                </div>

                {/* Delete Section */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Delete
                  </h4>
                  <button
                    onClick={onBulkDelete}
                    className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    Delete selected users
                  </button>
                </div>

                {/* Clear Selection */}
                <button
                  onClick={onClearSelection}
                  className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={onToggleMoreActions}
            className="px-4 py-2 border border-hover rounded-lg text-sm text-gray-700 hover:bg-disabled transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <span>More</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showMoreActions ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* More Actions Dropdown */}
          {showMoreActions && (
            <div className="absolute right-0 mt-2 w-48 bg-primary border border-primary rounded-lg shadow-lg z-10 animate-modalSlideIn">
              <div className="p-2">
                {selectedUsersCount === 1 ? (
                  <button
                    onClick={onEditSelectedUser}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                  >
                    Edit selected user
                  </button>
                ) : selectedUsersCount > 1 ? (
                  <div className="px-3 py-2 text-sm text-tertiary">
                    Select only one user to edit
                  </div>
                ) : (
                  <div className="px-3 py-2 text-sm text-tertiary">
                    Select a user to edit
                  </div>
                )}
                <button
                  onClick={onToggleMoreActions}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                >
                  Export data
                </button>
                <button
                  onClick={onToggleMoreActions}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-active rounded-md transition-colors duration-200"
                >
                  Import data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;
