import React, { useState, useEffect } from 'react';
import { TableEnhanced as Table, TableColumn } from '../ui';
import ContentContainer from '../ContentContainer';
import { FilterCondition } from '../ui/filter-modal';
import Actions from '../ui/actions';
import Pagination from '../ui/pagination';
import { Button } from '@circleco/compass/components/Button';
import { applyFilters } from '../../utils/filterHelpers';
import { exportToCSV } from '../../utils/csvExport';
import { Badge } from '@circleco/compass/components/Badge';

interface Post {
  id: string;
  title: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  author: {
    name: string;
    initials: string;
    color: string;
  };
  space: string;
  likes: number;
  comments: number;
  updated: string;
}

interface PostsProps {
  onToggleSidebar: () => void;
}

const Posts: React.FC<PostsProps> = ({ onToggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedPosts([]);
  }, [activeTab]);

  // Mock data for posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Getting Started with Circle',
      status: 'Published',
      author: {
        name: 'John Doe',
        initials: 'JD',
        color: 'bg-blue-500',
      },
      space: 'General Discussion',
      likes: 45,
      comments: 12,
      updated: '2 hours ago',
    },
    {
      id: '2',
      title: 'Community Guidelines',
      status: 'Published',
      author: {
        name: 'Jane Smith',
        initials: 'JS',
        color: 'bg-green-500',
      },
      space: 'Announcements',
      likes: 23,
      comments: 5,
      updated: '1 day ago',
    },
    {
      id: '3',
      title: 'Upcoming Features Preview',
      status: 'Draft',
      author: {
        name: 'Mike Johnson',
        initials: 'MJ',
        color: 'bg-purple-500',
      },
      space: 'Product Updates',
      likes: 0,
      comments: 0,
      updated: '3 days ago',
    },
    {
      id: '4',
      title: 'Monthly Newsletter',
      status: 'Scheduled',
      author: {
        name: 'Sarah Wilson',
        initials: 'SW',
        color: 'bg-orange-500',
      },
      space: 'Newsletter',
      likes: 0,
      comments: 0,
      updated: '1 week ago',
    },
  ]);

  // Filter data based on active tab and filters
  const getFilteredData = () => {
    let filtered = posts;

    // First filter by tab
    switch (activeTab) {
      case 'drafts':
        filtered = posts.filter(post => post.status === 'Draft');
        break;
      case 'scheduled':
        filtered = posts.filter(post => post.status === 'Scheduled');
        break;
      case 'published':
        filtered = posts.filter(post => post.status === 'Published');
        break;
      default:
        filtered = posts;
    }

    // Then apply additional filters
    return applyFilters(filtered, activeFilters);
  };

  const filteredData = getFilteredData();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedPosts.length === paginatedData.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(paginatedData.map(post => post.id));
    }
  };

  const handleSelectItem = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedPosts.length === 0) return;
    setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)));
    setSelectedPosts([]);
  };

  const handlePublishSelected = () => {
    if (selectedPosts.length === 0) return;
    setPosts(prev =>
      prev.map(post =>
        selectedPosts.includes(post.id)
          ? { ...post, status: 'Published' as const }
          : post
      )
    );
    setSelectedPosts([]);
  };

  const handleDraftSelected = () => {
    if (selectedPosts.length === 0) return;
    setPosts(prev =>
      prev.map(post =>
        selectedPosts.includes(post.id)
          ? { ...post, status: 'Draft' as const }
          : post
      )
    );
    setSelectedPosts([]);
  };

  const handleScheduleSelected = () => {
    if (selectedPosts.length === 0) return;
    setPosts(prev =>
      prev.map(post =>
        selectedPosts.includes(post.id)
          ? { ...post, status: 'Scheduled' as const }
          : post
      )
    );
    setSelectedPosts([]);
  };

  const tableColumns: TableColumn<Post>[] = [
    {
      key: 'title',
      label: 'TITLE',
      render: (post: Post) => (
        <span className="text-sm text-primary font-medium">{post.title}</span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (post: Post) => {
        let variant: 'success' | 'warning' | 'info' = 'info';
        if (post.status === 'Published') variant = 'success';
        else if (post.status === 'Draft') variant = 'warning';
        return <Badge label={post.status} variant={variant} />;
      },
    },
    {
      key: 'author',
      label: 'AUTHOR',
      render: (post: Post) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full ${post.author.color} flex items-center justify-center`}
          >
            <span className="text-xs text-white font-medium">
              {post.author.initials}
            </span>
          </div>
          <span className="text-sm text-primary">{post.author.name}</span>
        </div>
      ),
    },
    {
      key: 'space',
      label: 'SPACE',
      render: (post: Post) => (
        <span className="text-sm text-secondary">{post.space}</span>
      ),
    },
    {
      key: 'likes',
      label: 'LIKES',
      render: (post: Post) => (
        <span className="text-sm text-secondary">{post.likes}</span>
      ),
    },
    {
      key: 'comments',
      label: 'COMMENTS',
      render: (post: Post) => (
        <span className="text-sm text-secondary">{post.comments}</span>
      ),
    },
    {
      key: 'updated',
      label: 'UPDATED',
      render: (post: Post) => (
        <span className="text-sm text-secondary">{post.updated}</span>
      ),
    },
  ];

  const tabs = [
    { label: 'All', value: 'all', badge: posts.length.toString() },
    {
      label: 'Published',
      value: 'published',
      badge: posts.filter(p => p.status === 'Published').length.toString(),
    },
    {
      label: 'Drafts',
      value: 'drafts',
      badge: posts.filter(p => p.status === 'Draft').length.toString(),
    },
    {
      label: 'Scheduled',
      value: 'scheduled',
      badge: posts.filter(p => p.status === 'Scheduled').length.toString(),
    },
  ];

  const filters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Published', 'Draft', 'Scheduled'],
    },
    {
      id: 'title',
      label: 'Title',
      type: 'text' as const,
    },
    {
      id: 'author',
      label: 'Author',
      type: 'text' as const,
    },
    {
      id: 'space',
      label: 'Space',
      type: 'text' as const,
    },
  ];

  return (
    <ContentContainer
      onToggleSidebar={onToggleSidebar}
      title="Posts"
      actions={<Button variant="primary">New post</Button>}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={setActiveFilters}
      showAllFilters={showAllFilters}
      onShowAllFiltersChange={setShowAllFilters}
    >
      {/* Actions */}
      <Actions
        selectedCount={selectedPosts.length}
        totalCount={paginatedData.length}
        onDeleteSelected={handleDeleteSelected}
        selectedData={paginatedData.filter(post =>
          selectedPosts.includes(post.id)
        )}
        exportFilename="posts.csv"
        onShowAllFilters={() => setShowAllFilters(!showAllFilters)}
        bulkActions={[
          {
            id: 'export',
            label: 'Export selected',
            onClick: () => {
              const selectedData = paginatedData.filter(post =>
                selectedPosts.includes(post.id)
              );
              exportToCSV(selectedData, 'posts.csv');
            },
            disabled: selectedPosts.length === 0,
          },
          {
            id: 'publish',
            label: 'Publish selected',
            onClick: handlePublishSelected,
            disabled: selectedPosts.length === 0,
          },
          {
            id: 'draft',
            label: 'Move to draft',
            onClick: handleDraftSelected,
            disabled: selectedPosts.length === 0,
          },
          {
            id: 'schedule',
            label: 'Schedule selected',
            onClick: handleScheduleSelected,
            disabled: selectedPosts.length === 0,
          },
          {
            id: 'delete',
            label: 'Delete selected',
            onClick: handleDeleteSelected,
            disabled: selectedPosts.length === 0,
          },
        ]}
      />

      {/* Table */}
      <Table
        columns={tableColumns}
        data={paginatedData}
        selectedItems={selectedPosts}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
      />

      {/* Pagination */}
      <Pagination
        count={filteredData.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </ContentContainer>
  );
};

export default Posts;
