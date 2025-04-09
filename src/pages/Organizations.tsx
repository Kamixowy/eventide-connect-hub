
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useViewPreference } from '@/hooks/useViewPreference';
import EventsFilter, { SortOption, FilterOption } from '@/components/common/EventsFilter';
import { OrganizationsList } from '@/components/organizations/OrganizationsList';
import OrganizationCard from '@/components/organizations/OrganizationCard';
import OrganizationListItem from '@/components/organizations/OrganizationListItem';
import CookieConsent from '@/components/common/CookieConsent';

const Organizations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('title-asc');
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const { viewType, setViewPreference } = useViewPreference('organizations', 'grid');

  // Dostępne filtry dla strony organizacji
  const availableFilters = [
    { label: 'Sportowe', value: 'category:Sportowe' },
    { label: 'Kulturalne', value: 'category:Kulturalne' },
    { label: 'Charytatywne', value: 'category:Charytatywne' },
    { label: 'Edukacyjne', value: 'category:Edukacyjne' },
    { label: 'Społeczne', value: 'category:Społeczne' }
  ];
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Organizacje</h1>
            <p className="text-muted-foreground">
              Przeglądaj organizacje i ich wydarzenia
            </p>
          </div>
        </div>
        
        <EventsFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewType={viewType}
          setViewType={setViewPreference}
          sortOption={sortOption}
          setSortOption={setSortOption}
          availableFilters={availableFilters}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
        
        <OrganizationsList 
          searchQuery={searchQuery}
          sortOption={sortOption}
          activeFilters={activeFilters}
          viewType={viewType}
          OrganizationCardComponent={OrganizationCard}
          OrganizationListItemComponent={OrganizationListItem}
        />
      </div>
      
      <CookieConsent />
    </Layout>
  );
};

export default Organizations;
