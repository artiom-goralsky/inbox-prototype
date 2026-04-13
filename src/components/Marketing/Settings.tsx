import React, { useState } from 'react';
import ContentContainer from '../ContentContainer/ContentContainer';
import { Button } from '@circleco/compass/components/Button';
import { TextInput } from '@circleco/compass/components/TextInput';
import { Select } from '@circleco/compass/components/Select';
import { Switch } from '@circleco/compass/components/Switch';
import { HelpCircle, ExternalLink } from 'lucide-react';

interface SettingsProps {
  onToggleSidebar: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onToggleSidebar }) => {
  const [senderName, setSenderName] = useState('Circle Demo');
  const [senderEmail, setSenderEmail] = useState('circle');
  const [useDifferentReplyEmail, setUseDifferentReplyEmail] = useState(false);
  const [replyEmail, setReplyEmail] = useState('');
  const [address, setAddress] = useState('228 Park Ave St');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('1003');
  const [country, setCountry] = useState('United States');

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Japan',
    'Brazil',
    'India',
    'China',
  ];

  const handleSaveChanges = () => {
    // Handle save logic here
  };

  return (
    <ContentContainer title="Settings" onToggleSidebar={onToggleSidebar}>
      <div className="overflow-auto">
        <div className="max-w-2xl space-y-8 p-5 mx-auto">
          {/* From address section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                From address
              </h3>
              <p className="text-sm text-secondary">
                This will be displayed in the &apos;From&apos; field of your
                recipient&apos;s email client. We recommend using something your
                subscribers will instantly recognise, like your own name.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender name
                </label>
                <TextInput
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="Enter sender name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender email
                </label>
                <div className="flex">
                  <TextInput
                    value={senderEmail}
                    onChange={e => setSenderEmail(e.target.value)}
                    className="rounded-r-none"
                    placeholder="Enter email"
                  />
                  <div className="flex items-center px-3 bg-secondary border border-l-0 border-hover rounded-r-md">
                    <span className="text-tertiary">@email.upfront.so</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={useDifferentReplyEmail}
                  onCheckedChange={setUseDifferentReplyEmail}
                  label=""
                />
                <label className="text-sm text-gray-700">
                  Use a different email address for replies
                </label>
              </div>

              {useDifferentReplyEmail && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Reply-to email
                    </label>
                    <HelpCircle className="w-4 h-4 text-disabled" />
                  </div>
                  <TextInput
                    value={replyEmail}
                    onChange={e => setReplyEmail(e.target.value)}
                    placeholder="Enter reply-to email"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Postal address section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Postal address
              </h3>
              <p className="text-sm text-secondary">
                To comply with anti-spam laws, every email needs to include a
                valid physical address where recipients can reach you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <TextInput
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <TextInput
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province / Region
                </label>
                <TextInput
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP / Postal code
                </label>
                <TextInput
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Select
                  aria-label="Country"
                  value={
                    countries
                      .map(countryName => ({
                        label: countryName,
                        value: countryName,
                      }))
                      .find(o => o.value === country) ?? null
                  }
                  onValueChange={option => setCountry(option?.value ?? '')}
                  options={countries.map(countryName => ({
                    label: countryName,
                    value: countryName,
                  }))}
                  placeholder="Select country"
                />
              </div>
            </div>
          </div>

          {/* Email footer section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Email footer
              </h3>
              <p className="text-sm text-secondary">
                The following footer will be appended to all your marketing
                emails to stay compliant and also provide the recipient with
                important options. The logo is taken from your community assets
                in{' '}
                <button className="text-link hover:text-blue-700 underline">
                  customize theme
                </button>
                .
              </p>
            </div>

            <div className="bg-secondary border border-primary rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-primary">Circle</div>
                <div>
                  <a href="#" className="flex items-center gap-1 text-link hover:underline">
                    circle.upfront.so
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-secondary">
                  {address}, {city}, {zipCode}, {country}
                </div>
                <div className="pt-2 space-y-1">
                  <a href="#" className="block text-link hover:underline">
                    Update your email preferences
                  </a>
                  <a href="#" className="block text-link hover:underline">
                    unsubscribe
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-6">
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Settings;
