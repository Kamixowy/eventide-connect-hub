
import type { Organization } from '@/hooks/useOrganizations';
import type { SortOption, FilterOption } from '@/components/common/EventsFilter';

export const processOrganizations = (
  organizations: Organization[],
  searchQuery: string = '',
  sortOption: SortOption = 'title-asc',
  activeFilters: FilterOption[] = []
): Organization[] => {
  // Filter by search query
  let filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.description && org.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (org.category && org.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Apply category filters
  if (activeFilters.length > 0) {
    filteredOrgs = filteredOrgs.filter(org => 
      activeFilters.some(filter => {
        if (filter.startsWith('category:')) {
          const category = filter.replace('category:', '');
          return org.category === category;
        }
        return true;
      })
    );
  }
  
  // Sort organizations
  return [...filteredOrgs].sort((a, b) => {
    switch (sortOption) {
      case 'title-asc':
        return a.name.localeCompare(b.name);
      case 'title-desc':
        return b.name.localeCompare(a.name);
      case 'date-asc': // Sort by followers count as fallback since created_at isn't available
        return (a.followers || 0) - (b.followers || 0);
      case 'date-desc':
        return (b.followers || 0) - (a.followers || 0);
      case 'participants-asc': 
        return (a.followers || 0) - (b.followers || 0);
      case 'participants-desc':
        return (b.followers || 0) - (a.followers || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });
};
