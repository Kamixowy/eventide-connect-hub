
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { SortOption, FilterOption } from '@/components/common/EventsFilter';
import type { OrganizationCardProps } from './OrganizationCard';

// Przykładowe dane dla demonstracji
const demoOrganizations = [
  {
    id: 'org-1',
    name: 'Fundacja Szczęśliwe Dzieciństwo',
    description: 'Wspieramy dzieci w trudnej sytuacji życiowej, organizując różne formy pomocy.',
    logo_url: null,
    category: 'Charytatywne',
    followers: 120
  },
  {
    id: 'org-2',
    name: 'Stowarzyszenie Młodych Artystów',
    description: 'Promujemy młode talenty i organizujemy warsztaty artystyczne dla dzieci i młodzieży.',
    logo_url: null,
    category: 'Kulturalne',
    followers: 85
  },
  {
    id: 'org-3',
    name: 'Fundacja Zielona Przyszłość',
    description: 'Działamy na rzecz ochrony środowiska i edukacji ekologicznej społeczeństwa.',
    logo_url: null,
    category: 'Ekologiczne',
    followers: 210
  },
  {
    id: 'org-4',
    name: 'Stowarzyszenie Sportowe "Volley"',
    description: 'Promujemy aktywność fizyczną wśród młodzieży i organizujemy turnieje sportowe.',
    logo_url: null,
    category: 'Sportowe',
    followers: 150
  }
];

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
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      
      // Demo user or testing environment
      if (user && user.id.startsWith('demo-')) {
        setOrganizations(demoOrganizations);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setOrganizations(data.length > 0 ? data : demoOrganizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać listy organizacji. Wyświetlamy przykładowe dane.",
          variant: "destructive"
        });
        setOrganizations(demoOrganizations);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizations();
  }, [user, toast]);

  // Handle organization click
  const handleOrganizationClick = (orgId: string) => {
    navigate(`/organizacje/${orgId}`);
  };

  // Filter and sort organizations
  const processOrganizations = () => {
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

  const processedOrganizations = processOrganizations();

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ładowanie organizacji...</p>
      </div>
    );
  }

  if (processedOrganizations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Nie znaleziono żadnych organizacji</h3>
        <p className="text-muted-foreground">
          Spróbuj zmienić kryteria wyszukiwania lub wróć później
        </p>
      </div>
    );
  }

  return viewType === 'grid' ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {processedOrganizations.map((org) => (
        <div 
          key={org.id} 
          onClick={() => handleOrganizationClick(org.id)}
          className="cursor-pointer"
        >
          <OrganizationCardComponent organization={org} />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      {processedOrganizations.map((org) => (
        <div 
          key={org.id} 
          onClick={() => handleOrganizationClick(org.id)}
          className="cursor-pointer"
        >
          <OrganizationListItemComponent organization={org} />
        </div>
      ))}
    </div>
  );
};
