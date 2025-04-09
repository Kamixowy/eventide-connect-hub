
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
      case 'date-asc': // Sort by creation date if available
        return (a.created_at ? new Date(a.created_at).getTime() : 0) - 
               (b.created_at ? new Date(b.created_at).getTime() : 0);
      case 'date-desc':
        return (b.created_at ? new Date(b.created_at).getTime() : 0) - 
               (a.created_at ? new Date(a.created_at).getTime() : 0);
      case 'participants-asc': // Sort by followers count if available
        return (a.followers || 0) - (b.followers || 0);
      case 'participants-desc':
        return (b.followers || 0) - (a.followers || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });
};
