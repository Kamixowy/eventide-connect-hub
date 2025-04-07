
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { CollaborationFilters } from '@/components/collaborations/CollaborationFilters';
import { CollaborationsList } from '@/components/collaborations/CollaborationsList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import NewCollaborationDialog from '@/components/collaborations/NewCollaborationDialog';
import { fetchCollaborations } from '@/services/collaborations';
import { COLLABORATION_STATUS_NAMES } from '@/services/collaborations/utils';
import { supabase } from '@/lib/supabase';

const Collaborations = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationsData, setOrganizationsData] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Determine user type from authentication context
  const userType = user?.user_metadata?.userType === 'organization' ? 'organization' : 'sponsor';

  // Fetch organizations for the current user if they're an organization user
  useEffect(() => {
    const getOrganizationsData = async () => {
      if (user && userType === 'organization') {
        try {
          // First get organization memberships for the current user
          const { data: memberships, error: membershipError } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', user.id);
            
          if (membershipError) {
            console.error('Error fetching organization memberships:', membershipError);
            return;
          }

          if (!memberships || memberships.length === 0) {
            console.log('No organization memberships found for user');
            return;
          }
          
          console.log('Organization memberships:', memberships);
          
          // Get organization data for each membership
          const organizationIds = memberships.map(m => m.organization_id);
          const { data: organizations, error: organizationsError } = await supabase
            .from('organizations')
            .select('*')
            .in('id', organizationIds);
            
          if (organizationsError) {
            console.error('Error fetching organizations:', organizationsError);
          } else {
            console.log('Organizations data:', organizations);
            setOrganizationsData(organizations || []);
          }
        } catch (err) {
          console.error('Failed to fetch organizations data:', err);
        }
      }
    };
    
    getOrganizationsData();
  }, [user, userType]);

  // Fetch user collaborations
  useEffect(() => {
    const getCollaborations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching collaborations with user type:', userType);
        console.log('Current user ID:', user.id);
        console.log('User metadata:', user.user_metadata);
        console.log('Organizations data:', organizationsData);

        const data = await fetchCollaborations(userType, organizationsData);
        console.log('Fetched collaborations:', data); 
        setCollaborations(data);
      } catch (error: any) {
        console.error('Error fetching collaborations:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać danych współprac: " + (error.message || error),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (organizationsData.length > 0 || userType === 'sponsor') {
      getCollaborations();
    }
  }, [user, toast, userType, organizationsData]);
  
  // Filtering collaborations
  const filteredCollaborations = collaborations.filter((collaboration) => {
    if (!collaboration) return false;
    
    const matchesSearch = searchQuery === '' || 
      collaboration.events?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaboration.organization?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (collaboration.profiles && Array.isArray(collaboration.profiles) && 
       collaboration.profiles.some(profile => 
         profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         profile.username?.toLowerCase().includes(searchQuery.toLowerCase())
       ));
    
    const matchesStatus = statusFilter === '' || 
      COLLABORATION_STATUS_NAMES[collaboration.status] === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Współprace</h1>
          
          {userType === 'sponsor' && (
            <NewCollaborationDialog>
              <Button className="btn-gradient">
                <Plus size={16} className="mr-2" /> Nowa propozycja
              </Button>
            </NewCollaborationDialog>
          )}
        </div>
        
        <CollaborationFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        
        <CollaborationsList 
          collaborations={filteredCollaborations}
          viewMode={viewMode}
          userType={userType}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default Collaborations;
