
import { useNavigate } from 'react-router-dom';
import { useOrganizations } from '@/hooks/useOrganizations';
import { processOrganizations } from '@/utils/organizationUtils';
import OrganizationsGrid from './OrganizationsGrid';
import OrganizationsListView from './OrganizationsListView';
import OrganizationsLoadingState from './OrganizationsLoadingState';
import OrganizationsEmptyState from './OrganizationsEmptyState';
import type { SortOption, FilterOption } from '@/components/common/EventsFilter';
import type { OrganizationCardProps } from './OrganizationCard';

interface OrganizationsListProps {
  searchQuery?: string;
  sortOption?: SortOption;
  activeFilters?: FilterOption[];
  viewType?: 'grid' | 'list';
  OrganizationCardComponent: React.ComponentType<OrganizationCardProps>;
  OrganizationListItemComponent: React.ComponentType<OrganizationCardProps>;
}

export const OrganizationsList = ({
  searchQuery = '',
  sortOption = 'title-asc',
  activeFilters = [],
  viewType = 'grid',
  OrganizationCardComponent,
  OrganizationListItemComponent
}: OrganizationsListProps) => {
  const { organizations, loading } = useOrganizations();
  const navigate = useNavigate();

  // Handle organization click
  const handleOrganizationClick = (orgId: string) => {
    navigate(`/organizacje/${orgId}`);
  };

  // Process organizations based on search, sort, and filter
  const processedOrganizations = processOrganizations(
    organizations,
    searchQuery,
    sortOption,
    activeFilters
  );

  if (loading) {
    return <OrganizationsLoadingState />;
  }

  if (processedOrganizations.length === 0) {
    return <OrganizationsEmptyState />;
  }

  return viewType === 'grid' ? (
    <OrganizationsGrid
      organizations={processedOrganizations}
      onOrganizationClick={handleOrganizationClick}
      OrganizationCardComponent={OrganizationCardComponent}
    />
  ) : (
    <OrganizationsListView
      organizations={processedOrganizations}
      onOrganizationClick={handleOrganizationClick}
      OrganizationListItemComponent={OrganizationListItemComponent}
    />
  );
};
