import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Checkbox } from '@circleco/compass/components/Checkbox';
import { Select } from '@circleco/compass/components/Select';

interface EditModalProps {
  user?: User | null; // Optional - if not provided, it's add mode
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  mode: 'add' | 'edit';
}

const EditModal: React.FC<EditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emailMarketing: false,
    score: 50,
    role: 'Member' as 'Member' | 'Moderator' | 'Admin',
    invitationStatus: 'Profile complete' as
      | 'Profile complete'
      | 'Invited'
      | 'Pending',
  });

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && user) {
        setFormData({
          name: user.name,
          email: user.email,
          emailMarketing: user.emailMarketing,
          score: user.score,
          role: user.role,
          invitationStatus: user.invitationStatus,
        });
      } else {
        // Add mode - reset to defaults
        setFormData({
          name: '',
          email: '',
          emailMarketing: false,
          score: 50,
          role: 'Member',
          invitationStatus: 'Profile complete',
        });
      }
    }
  }, [isOpen, user, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-primary rounded-lg p-6 w-full max-w-md mx-4 animate-modalSlideIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">
            {mode === 'add' ? 'Add New Member' : 'Edit User'}
          </h2>
          <button
            onClick={onClose}
            className="text-disabled hover:text-secondary transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-[border-color,box-shadow] duration-200"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-[border-color,box-shadow] duration-200"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Score Field - only for edit mode */}
          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={e =>
                  handleInputChange('score', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-[border-color,box-shadow] duration-200"
                required
              />
            </div>
          )}

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              aria-label="Role"
              value={
                [
                  { label: 'Member', value: 'Member' },
                  { label: 'Moderator', value: 'Moderator' },
                  { label: 'Admin', value: 'Admin' },
                ].find(o => o.value === formData.role) ?? null
              }
              onValueChange={option =>
                handleInputChange(
                  'role',
                  (option?.value ?? 'Member') as
                    | 'Member'
                    | 'Moderator'
                    | 'Admin'
                )
              }
              options={[
                { label: 'Member', value: 'Member' },
                { label: 'Moderator', value: 'Moderator' },
                { label: 'Admin', value: 'Admin' },
              ]}
              placeholder="Select role"
            />
          </div>

          {/* Invitation Status Field - only for edit mode */}
          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invitation Status
              </label>
              <Select
                aria-label="Invitation Status"
                value={
                  [
                    { label: 'Profile complete', value: 'Profile complete' },
                    { label: 'Invited', value: 'Invited' },
                    { label: 'Pending', value: 'Pending' },
                  ].find(o => o.value === formData.invitationStatus) ?? null
                }
                onValueChange={option =>
                  handleInputChange(
                    'invitationStatus',
                    (option?.value ?? 'Pending') as
                      | 'Profile complete'
                      | 'Invited'
                      | 'Pending'
                  )
                }
                options={[
                  { label: 'Profile complete', value: 'Profile complete' },
                  { label: 'Invited', value: 'Invited' },
                  { label: 'Pending', value: 'Pending' },
                ]}
                placeholder="Select status"
              />
            </div>
          )}

          {/* Email Marketing Field */}
          <div className="flex items-center">
            <Checkbox
              checked={formData.emailMarketing}
              onCheckedChange={checked =>
                handleInputChange('emailMarketing', checked === true)
              }
              label="Email marketing enabled"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-active rounded-lg hover:bg-disabled transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {mode === 'add' ? 'Add Member' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
