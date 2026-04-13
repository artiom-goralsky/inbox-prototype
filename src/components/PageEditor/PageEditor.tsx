import React, { useState } from 'react';
import TemplateLibrary from './TemplateLibrary';
import PagePreview from './PagePreview';
import DesignSidebar from './DesignSidebar';
import { BreadCrumbs } from '@circleco/compass/components/BreadCrumbs';
import './PageEditor.css';

interface PageEditorProps {
  onToggleSidebar: () => void;
  onBackToList?: () => void;
  selectedPageId?: string | null;
}

const PageEditor: React.FC<PageEditorProps> = ({
  onBackToList,
  selectedPageId,
}) => {
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(
    selectedPageId || 'homepage'
  );

  const [zoom, setZoom] = useState(100);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'copilot'>('editor');
  const [showDesignSidebar, setShowDesignSidebar] = useState(false);

  const handleCreatePage = () => {
    setShowTemplateLibrary(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    setCurrentTemplate(templateId);
    setShowTemplateLibrary(false);
  };

  const handleBack = () => {
    if (onBackToList) {
      onBackToList();
    } else {
      setCurrentTemplate(null);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(25, Math.min(200, newZoom)));
  };

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setDeviceType(device);
  };

  return (
    <div
      className="h-screen overflow-hidden bg-active flex flex-col p-[6px]"
      style={{
        animation: 'slideInFromBottom 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'both',
      }}
    >
      {/* Top Header with Navigation */}
      <div className="flex items-center justify-between bg-active pb-4">
        {/* Left: Back button and breadcrumb */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-1 hover:bg-active rounded-md transition-colors"
          >
            <svg
              className="w-5 h-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <BreadCrumbs
            items={[
              { label: 'Home page', href: '#' },
              { label: currentTemplate || 'Page' },
            ]}
            maxItems={4}
          />
        </div>

        {/* Right: Editor controls and action buttons */}
        <div className="flex items-center space-x-4 rounded-lg">
          {/* Editor Icons */}
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-active rounded-md transition-colors">
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
                  d="M7.39909 1.8334C7.39909 1.50203 7.66772 1.2334 7.99909 1.2334C11.7362 1.2334 14.7658 4.26294 14.7658 8.00007C14.7658 11.7372 11.7362 14.7667 7.99909 14.7667C7.66772 14.7667 7.39909 14.4981 7.39909 14.1667C7.39909 13.8354 7.66772 13.5667 7.99909 13.5667C11.0735 13.5667 13.5658 11.0744 13.5658 8.00007C13.5658 4.92568 11.0735 2.4334 7.99909 2.4334C7.66772 2.4334 7.39909 2.16477 7.39909 1.8334ZM7.99909 4.56673C8.33046 4.56673 8.59909 4.83536 8.59909 5.16673V7.75154L10.2567 9.40913C10.491 9.64345 10.491 10.0233 10.2567 10.2577C10.0224 10.492 9.64247 10.492 9.40816 10.2577L7.57482 8.42433C7.4623 8.31181 7.39909 8.15919 7.39909 8.00007V5.16673C7.39909 4.83536 7.66772 4.56673 7.99909 4.56673Z"
                  fill="#545861"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.8658 1.32798C7.23468 1.26574 7.61334 1.2334 7.99909 1.2334C8.33046 1.2334 8.59909 1.50203 8.59909 1.8334C8.59909 2.16477 8.33046 2.4334 7.99909 2.4334C7.68051 2.4334 7.36864 2.4601 7.06545 2.51125C6.7387 2.56639 6.42912 2.3462 6.37399 2.01945C6.31885 1.69269 6.53904 1.38311 6.8658 1.32798ZM4.91942 2.62272C5.1114 2.89282 5.04808 3.2674 4.77799 3.45938C4.26772 3.82209 3.82111 4.2687 3.45841 4.77897C3.26642 5.04906 2.89184 5.11238 2.62175 4.92039C2.35166 4.72841 2.28834 4.35383 2.48032 4.08374C2.92082 3.46402 3.46304 2.9218 4.08276 2.4813C4.35285 2.28931 4.72744 2.35263 4.91942 2.62272ZM2.01847 6.37497C2.34522 6.4301 2.56541 6.73968 2.51028 7.06643C2.45912 7.36961 2.43242 7.68149 2.43242 8.00007C2.43242 8.31864 2.45912 8.63051 2.51028 8.9337C2.56541 9.26045 2.34522 9.57003 2.01847 9.62516C1.69172 9.6803 1.38214 9.46011 1.32701 9.13336C1.26476 8.76447 1.23242 8.38582 1.23242 8.00007C1.23242 7.61432 1.26476 7.23566 1.327 6.86677C1.38214 6.54002 1.69172 6.31983 2.01847 6.37497ZM2.62175 11.0797C2.89184 10.8877 3.26643 10.9511 3.45841 11.2212C3.82112 11.7314 4.26772 12.178 4.77799 12.5407C5.04809 12.7327 5.1114 13.1073 4.91942 13.3774C4.72744 13.6475 4.35285 13.7108 4.08276 13.5188C3.46305 13.0783 2.92082 12.5361 2.48033 11.9164C2.28834 11.6463 2.35166 11.2717 2.62175 11.0797ZM6.37399 13.9807C6.42912 13.6539 6.7387 13.4337 7.06545 13.4889C7.36864 13.54 7.68051 13.5667 7.99909 13.5667C8.33046 13.5667 8.59909 13.8354 8.59909 14.1667C8.59909 14.4981 8.33046 14.7667 7.99909 14.7667C7.61334 14.7667 7.23468 14.7344 6.8658 14.6721C6.53904 14.617 6.31885 14.3074 6.37399 13.9807Z"
                  fill="#545861"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-active rounded-md transition-colors">
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
                  d="M7.99909 2.4334C4.92471 2.4334 2.43242 4.92568 2.43242 8.00007C2.43242 11.0744 4.92471 13.5667 7.99909 13.5667C11.0735 13.5667 13.5658 11.0744 13.5658 8.00007C13.5658 4.92568 11.0735 2.4334 7.99909 2.4334ZM1.23242 8.00007C1.23242 4.26294 4.26196 1.2334 7.99909 1.2334C11.7362 1.2334 14.7658 4.26294 14.7658 8.00007C14.7658 11.7372 11.7362 14.7667 7.99909 14.7667C4.26196 14.7667 1.23242 11.7372 1.23242 8.00007ZM10.379 5.86902C10.6355 6.07886 10.6733 6.45687 10.4635 6.71334L7.46346 10.38C7.35612 10.5112 7.19828 10.5909 7.02898 10.5993C6.85967 10.6078 6.69469 10.5442 6.57482 10.4243L5.24149 9.091C5.00718 8.85668 5.00718 8.47678 5.24149 8.24247C5.47581 8.00815 5.8557 8.00815 6.09002 8.24247L6.95455 9.107L9.53471 5.95346C9.74455 5.69699 10.1226 5.65919 10.379 5.86902Z"
                  fill="#16A34A"
                />
              </svg>
            </button>
            <div className="p-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center">
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
                    d="M4.92465 1.74214C5.15897 1.97646 5.15897 2.35636 4.92465 2.59067L3.94892 3.56641H9.50039C12.133 3.56641 14.2671 5.70052 14.2671 8.33307C14.2671 10.9656 12.133 13.0997 9.50039 13.0997H3.83372C3.50235 13.0997 3.23372 12.8311 3.23372 12.4997C3.23372 12.1684 3.50235 11.8997 3.83372 11.8997H9.50039C11.4702 11.8997 13.0671 10.3029 13.0671 8.33307C13.0671 6.36326 11.4702 4.76641 9.50039 4.76641H3.94892L4.92465 5.74214C5.15897 5.97646 5.15897 6.35636 4.92465 6.59067C4.69034 6.82499 4.31044 6.82499 4.07613 6.59067L2.07613 4.59067C1.84181 4.35636 1.84181 3.97646 2.07613 3.74214L4.07613 1.74214C4.31044 1.50783 4.69034 1.50783 4.92465 1.74214Z"
                    fill="#545861"
                  />
                </svg>
              </div>
            </div>
            <button className="p-1 hover:bg-active rounded-md transition-colors">
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
                  d="M11.0748 1.74214C11.3091 1.50783 11.689 1.50783 11.9234 1.74214L13.9234 3.74214C14.1577 3.97646 14.1577 4.35636 13.9234 4.59067L11.9234 6.59067C11.689 6.82499 11.3091 6.82499 11.0748 6.59067C10.8405 6.35636 10.8405 5.97646 11.0748 5.74214L12.0506 4.76641H6.49909C4.52927 4.76641 2.93242 6.36326 2.93242 8.33307C2.93242 10.3029 4.52927 11.8997 6.49909 11.8997H12.1658C12.4971 11.8997 12.7658 12.1684 12.7658 12.4997C12.7658 12.8311 12.4971 13.0997 12.1658 13.0997H6.49909C3.86653 13.0997 1.73242 10.9656 1.73242 8.33307C1.73242 5.70052 3.86653 3.56641 6.49909 3.56641H12.0506L11.0748 2.59067C10.8405 2.35636 10.8405 1.97646 11.0748 1.74214Z"
                  fill="#545861"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-active rounded-md transition-colors">
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
                  d="M7.99989 2.7334C10.6069 2.73338 13.1461 4.23222 14.8471 7.08956C15.1809 7.65037 15.1809 8.34968 14.8471 8.91049L14.8471 8.91051C13.1461 11.7679 10.6069 13.2667 7.9999 13.2667C5.39292 13.2668 2.85365 11.7679 1.15272 8.91059L1.66828 8.60367L1.15272 8.91059C0.818874 8.34978 0.818902 7.65048 1.1527 7.08967L1.15272 7.08963C2.85365 4.23229 5.39291 2.73342 7.99989 2.7334ZM2.18385 7.70345C2.07516 7.88609 2.07519 8.11424 2.18385 8.29676L2.18385 8.29676C3.70786 10.8569 5.88773 12.0668 7.99989 12.0667C10.1121 12.0667 12.2919 10.8568 13.8159 8.2967C13.9246 8.11406 13.9246 7.88591 13.816 7.7034L13.8159 7.70338C12.2919 5.14325 10.1121 3.93338 7.9999 3.9334C5.88775 3.93341 3.70788 5.1433 2.18387 7.70341M7.9999 6.60007C7.22667 6.60007 6.5999 7.22684 6.5999 8.00007C6.5999 8.7733 7.22667 9.40007 7.9999 9.40007C8.77313 9.40007 9.3999 8.7733 9.3999 8.00007C9.3999 7.22684 8.77313 6.60007 7.9999 6.60007ZM5.3999 8.00007C5.3999 6.5641 6.56393 5.40007 7.9999 5.40007C9.43587 5.40007 10.5999 6.5641 10.5999 8.00007C10.5999 9.43604 9.43587 10.6001 7.9999 10.6001C6.56393 10.6001 5.3999 9.43604 5.3999 8.00007Z"
                  fill="#545861"
                />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="px-3 py-[6px] text-sm font-medium text-black bg-primary border border-hover rounded-md hover:bg-secondary transition-colors">
              Save draft
            </button>
            <button className="px-3 py-[6px] text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-inverse transition-colors">
              Publish page
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex bg-secondary overflow-hidden relative">
        {/* Left Toolbar */}
        <div className="w-[52px] bg-primary border border-primary rounded-lg flex flex-col items-center py-4 space-y-2 overflow-y-hidden">
          <button className="p-1 text-secondary hover:bg-active rounded-md transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5564 8.99999H5.44531M9.00087 12.5554V5.44434"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-1 text-secondary hover:bg-active rounded-md transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 17C4.11929 17 3 15.8807 3 14.5V6.5C3 5.11929 4.11929 4 5.5 4H18.5C19.8807 4 21 5.11929 21 6.5V14.5C21 15.8807 19.8807 17 18.5 17H5.5Z"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 8.5H13"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 11.5H10"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.5 17.5V18.5C19.5 19.6046 18.6046 20.5 17.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5L4.5 17.5"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-1 text-secondary hover:bg-active rounded-md transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.0534 5.5C19.0534 6.88071 15.8952 8 11.9994 8C8.10352 8 4.94531 6.88071 4.94531 5.5M19.0534 5.5C19.0534 4.11929 15.8952 3 11.9994 3C8.10352 3 4.94531 4.11929 4.94531 5.5M19.0534 5.5V18.5C19.0534 19.8807 15.8952 21 11.9994 21C8.10352 21 4.94531 19.8807 4.94531 18.5V5.5M19.0534 9.7424C19.0534 11.1231 15.8952 12.2424 11.9994 12.2424C8.10352 12.2424 4.94531 11.1231 4.94531 9.7424M19.0534 13.8775C19.0534 15.2582 15.8952 16.3775 11.9994 16.3775C8.10352 16.3775 4.94531 15.2582 4.94531 13.8775"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-1 text-secondary hover:bg-active rounded-md transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.86356 12.0002L4.36349 10.3501C3.21881 9.81048 3.21564 8.18316 4.35821 7.63906L10.2802 4.81897C11.3682 4.30086 12.6318 4.30086 13.7198 4.81897L19.6418 7.63906C20.7844 8.18316 20.7812 9.81048 19.6365 10.3501L16.1365 12.0002M7.86356 12.0002L10.2589 13.1583C11.3587 13.69 12.6412 13.69 13.741 13.1583L16.1365 12.0002M7.86356 12.0002L4.37152 13.6464C3.22547 14.1867 3.22404 15.8166 4.36915 16.3589L10.3363 19.1848C11.4253 19.7005 12.6889 19.6978 13.7757 19.1774L19.6524 16.3636C20.7925 15.8177 20.7876 14.1929 19.6443 13.6539L16.1365 12.0002"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowDesignSidebar(true)}
            className="p-1 text-secondary hover:bg-active rounded-md transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.75 3.5H10.25V2H4.75V3.5ZM11.5 4.75V16.5H13V4.75H11.5ZM3.5 16.5V4.75H2V16.5H3.5ZM7.5 20.5C5.29086 20.5 3.5 18.7091 3.5 16.5H2C2 19.5376 4.46243 22 7.5 22V20.5ZM11.5 16.5C11.5 18.7091 9.70914 20.5 7.5 20.5V22C10.5376 22 13 19.5376 13 16.5H11.5ZM4.75 2C3.23122 2 2 3.23122 2 4.75H3.5C3.5 4.05964 4.05964 3.5 4.75 3.5V2ZM11.6188 3.86668L16.3819 6.61668L17.1319 5.31764L12.3688 2.56764L11.6188 3.86668ZM16.8394 8.32421L10.9644 18.5L12.2635 19.25L18.1385 9.07421L16.8394 8.32421ZM17.3837 7.61843L20.1337 12.3816L21.4327 11.6316L18.6827 6.86843L17.3837 7.61843ZM19.6762 14.0891L9.50035 19.9641L10.2504 21.2631L20.4262 15.3881L19.6762 14.0891ZM20.1337 12.3816C20.4789 12.9794 20.274 13.7439 19.6762 14.0891L20.4262 15.3881C21.7415 14.6288 22.1921 12.9469 21.4327 11.6316L20.1337 12.3816ZM12.3688 2.56764C11.9939 2.3512 11.5872 2.23252 11.1802 2.20509L11.0793 3.7017C11.2627 3.71405 11.4467 3.76731 11.6188 3.86668L12.3688 2.56764ZM10.25 3.5C10.4487 3.5 10.6345 3.5458 10.7994 3.62672L11.4601 2.28006C11.0941 2.10048 10.6827 2 10.25 2V3.5ZM10.7994 3.62672C11.2159 3.83105 11.5 4.25805 11.5 4.75H13C13 3.66417 12.3706 2.72676 11.4601 2.28006L10.7994 3.62672ZM18.6827 6.86843C18.4664 6.49367 18.1736 6.18763 17.835 5.96042L16.9992 7.20595C17.1518 7.30834 17.2843 7.44638 17.3837 7.61843L18.6827 6.86843ZM16.3819 6.61668C16.5539 6.71601 16.692 6.84858 16.7944 7.00114L18.0399 6.16523C17.8126 5.82669 17.5066 5.53399 17.1319 5.31764L16.3819 6.61668ZM16.7944 7.00114C17.0529 7.38632 17.0854 7.89817 16.8394 8.32421L18.1385 9.07421C18.6814 8.13385 18.605 7.00732 18.0399 6.16523L16.7944 7.00114ZM8.5 16.5C8.5 17.0523 8.05228 17.5 7.5 17.5V19C8.88071 19 10 17.8807 10 16.5H8.5ZM7.5 17.5C6.94772 17.5 6.5 17.0523 6.5 16.5H5C5 17.8807 6.11929 19 7.5 19V17.5ZM6.5 16.5C6.5 15.9477 6.94772 15.5 7.5 15.5V14C6.11929 14 5 15.1193 5 16.5H6.5ZM7.5 15.5C8.05228 15.5 8.5 15.9477 8.5 16.5H10C10 15.1193 8.88071 14 7.5 14V15.5Z"
                fill="#717680"
              />
            </svg>
          </button>
          <button className="p-1 text-secondary hover:bg-active rounded-md transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 7H15M9 11H15M9 15H11M7.5 3H16.5C17.8807 3 19 4.11929 19 5.5V18.5C19 19.8807 17.8807 21 16.5 21H7.5C6.11929 21 5 19.8807 5 18.5V5.5C5 4.11929 6.11929 3 7.5 3Z"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-1 text-secondary hover:bg-active rounded-md transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.98941 5.39755L7.30515 5.23965C6.72652 5.10612 6.11991 5.28009 5.7 5.7C5.28009 6.11991 5.10612 6.72652 5.23965 7.30515L5.39755 7.98941C5.57957 8.7781 5.25434 9.59711 4.58086 10.0461L3.74885 10.6008C3.281 10.9127 3 11.4377 3 12C3 12.5623 3.281 13.0873 3.74885 13.3992L4.58086 13.9539C5.25434 14.4029 5.57957 15.2219 5.39755 16.0106L5.23965 16.6949C5.10612 17.2735 5.28009 17.8801 5.7 18.3C6.11991 18.7199 6.72652 18.8939 7.30515 18.7603L7.98941 18.6024C8.7781 18.4205 9.59711 18.7456 10.0461 19.4191L10.6008 20.2512C10.9127 20.719 11.4377 21 12 21C12.5623 21 13.0873 20.719 13.3992 20.2512L13.9539 19.4191C14.4029 18.7456 15.2219 18.4205 16.0106 18.6024L16.6949 18.7603C17.2735 18.8939 17.8801 18.7199 18.3 18.3C18.7199 17.8801 18.8939 17.2735 18.7603 16.6949L18.6024 16.0106C18.4205 15.2219 18.7456 14.4029 19.4191 13.9539L20.2512 13.3992C20.719 13.0873 21 12.5623 21 12C21 11.4377 20.719 10.9127 20.2512 10.6008L19.4191 10.0461C18.7456 9.59711 18.4205 8.7781 18.6024 7.98941L18.7603 7.30514C18.8939 6.72652 18.7199 6.11991 18.3 5.7C17.8801 5.28009 17.2735 5.10612 16.6949 5.23965L16.0106 5.39755C15.2219 5.57957 14.4029 5.25434 13.9539 4.58086L13.3992 3.74885C13.0873 3.281 12.5623 3 12 3C11.4377 3 10.9127 3.281 10.6008 3.74885L10.0461 4.58086C9.59711 5.25434 8.7781 5.57957 7.98941 5.39755Z"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M14.6756 11.9999C14.6756 13.4776 13.4776 14.6756 11.9999 14.6756C10.5221 14.6756 9.32422 13.4776 9.32422 11.9999C9.32422 10.5221 10.5221 9.32422 11.9999 9.32422C13.4776 9.32422 14.6756 10.5221 14.6756 11.9999Z"
                stroke="#717680"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Design Sidebar - Expandable from Left Toolbar */}
        {showDesignSidebar && (
          <DesignSidebar onClose={() => setShowDesignSidebar(false)} />
        )}

        {/* Center Editor */}

        <div className="flex-1 flex flex-col overflow-auto scrollbar-hide">
          {!currentTemplate ? (
            <div className="flex-1 flex items-center justify-center bg-secondary">
              <div className="text-center">
                <div className="w-16 h-16 bg-disabled rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-disabled"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  No page selected
                </h3>
                <p className="text-tertiary mb-4">
                  Select a page from the list to start editing
                </p>
                <button
                  onClick={handleCreatePage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Page
                </button>
              </div>
            </div>
          ) : (
            <PagePreview
              templateId={currentTemplate}
              zoom={zoom}
              deviceType={deviceType}
            />
          )}
        </div>

        {/* Right Settings Panel */}
        <div className="w-80 bg-primary border-l border-primary overflow-y-hidden rounded-lg">
          <div className="p-4 border-b border-primary">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'editor'
                    ? 'text-black bg-active'
                    : 'text-tertiary hover:text-gray-700'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('copilot')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'copilot'
                    ? 'text-black bg-active'
                    : 'text-tertiary hover:text-gray-700'
                }`}
              >
                Co-pilot
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            {activeTab === 'editor' ? (
              <>
                {/* Background Section */}
                <div className="px-5">
                  <h3 className="text-sm font-medium text-primary mb-3">
                    Background
                  </h3>
                  <div className="space-y-2 py-5">
                    <div className="flex items-center  justify-between">
                      <span className="text-sm text-primary-600 font-medium">
                        Color
                      </span>
                      <div className="w-6 h-6 bg-primary border border-hover rounded cursor-pointer"></div>
                    </div>
                    <p className="text-xs text-tertiary">
                      To see the page background, ensure the section background
                      opacity is less than 100%.
                    </p>
                  </div>
                </div>

                {/* Padding Section */}
                <div className="border-y border-primary py-5 px-5">
                  <h3 className="text-sm font-medium text-primary mb-3">
                    Padding
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Top
                      </label>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Right
                      </label>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Bottom
                      </label>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Left
                      </label>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Margin Section */}
                <div className="px-5">
                  <h3 className="text-sm font-medium text-primary mb-3">
                    Margin
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Top
                      </label>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Right
                      </label>
                      <input
                        type="number"
                        defaultValue="16"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Bottom
                      </label>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-tertiary mb-1">
                        Left
                      </label>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 text-sm border border-hover rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Co-pilot Chat Interface */}
                <div className="flex-1 flex flex-col h-full">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-disabled rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-gray-800">
                          I want to create a new access group for my beta
                          testers
                        </p>
                      </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-xs">
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-bold text-primary">
                            Circle Copilot
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-primary border rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-gray-800">
                          I&apos;ll help you create a new access group. First,
                          let me get some details:{' '}
                          <strong>
                            What would you like to name this group?
                          </strong>
                        </p>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-disabled rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-gray-800">
                          Beta Testers Q3 2025
                        </p>
                      </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-xs">
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-bold text-primary">
                            Circle Copilot
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-primary border rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-gray-800">
                          Great name! Would you like to add a description for
                          &quot;Beta Testers Q3 2025&quot;?
                        </p>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-disabled rounded-lg px-4 py-2 max-w-xs">
                        <p className="text-sm text-gray-800">
                          Filter by the &quot;beta&quot; tag
                        </p>
                      </div>
                    </div>

                    {/* AI Typing Indicator */}
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-xs">
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                              style={{ animationDelay: '0.4s' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Field */}
                  <div className="p-4 border-t border-primary">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Modify this page..."
                        className="flex-1 px-3 py-2 bg-active border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="p-2 bg-gray-600 text-white rounded-full hover:bg-inverse-hover transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-primary border border-primary px-4 py-2 absolute bottom-8 left-[40%] transform rounded-lg -translate-x-1/2">
        <div className="flex items-center justify-between space-x-4">
          {/* Device Preview Controls */}
          <div className="flex items-center">
            <div>
              <button
                className={`p-2 rounded-md transition-colors ${
                  deviceType === 'desktop'
                    ? 'bg-blue-100 text-link'
                    : 'text-secondary hover:bg-active'
                }`}
                onClick={() => handleDeviceChange('desktop')}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${
                  deviceType === 'tablet'
                    ? 'bg-blue-100 text-link'
                    : 'text-secondary hover:bg-active'
                }`}
                onClick={() => handleDeviceChange('tablet')}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${
                  deviceType === 'mobile'
                    ? 'bg-blue-100 text-link'
                    : 'text-secondary hover:bg-active'
                }`}
                onClick={() => handleDeviceChange('mobile')}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Center: Theme Toggle */}
          <div className="flex items-center">
            <button className="p-2 text-secondary hover:bg-active rounded-md transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
          </div>

          {/* Right: Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleZoomChange(zoom - 10)}
              className="p-2 text-secondary hover:bg-active rounded-md transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="text-sm text-secondary min-w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => handleZoomChange(zoom + 10)}
              className="p-2 text-secondary hover:bg-active rounded-md transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onClose={() => setShowTemplateLibrary(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      )}
    </div>
  );
};

export default PageEditor;
