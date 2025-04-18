
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { CollaborationFilters } from '@/components/collaborations/CollaborationFilters';
import { CollaborationsList } from '@/components/collaborations/CollaborationsList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import NewCollaborationDialog from '@/components/collaborations/NewCollaborationDialog';
import { fetchCollaborations, subscribeToUserCollaborations } from '@/services/collaborations';
import { COLLABORATION_STATUS_NAMES } from '@/services/collaborations/types';
import { supabase } from '@/lib/supabase';

const Collaborations = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<any>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Determine user type from authentication context
  const userType = user?.user_metadata?.userType === 'organization' ? 'organization' : 'sponsor';

  // Fetch organization data if user is of type organization
  useEffect(() => {
    const getOrganizationData = async () => {
      if (user && userType === 'organization') {
        try {
          const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching organization:', error);
          } else {
            console.log('Organization data:', data);
            setOrganizationData(data);
          }
        } catch (err) {
          console.error('Failed to fetch organization data:', err);
        }
      }
    };
    
    getOrganizationData();
  }, [user, userType]);

  // Fetch user collaborations
  useEffect(() => {
    const getCollaborations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching collaborations with user type:', userType);
        console.log('Current user ID:', user.id);

        // For sponsors, we need to fetch collaborations where they are the sponsor
        if (userType === 'sponsor') {
          const { data, error } = await supabase
            .from('collaborations')
            .select(`
              *,
              collaboration_events (
                events:event_id (
                  id,
                  title,
                  start_date,
                  image_url
                )
              ),
              collaboration_options (
                id,
                title,
                description,
                amount,
                is_custom,
                sponsorship_option_id
              ),
              organizations (
                id,
                name,
                logo_url,
                description
              )
            `)
            .eq('sponsor_id', user.id)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching collaborations for sponsor:', error);
            throw error;
          }
          
          setCollaborations(data?.map(collab => ({
            ...collab,
            events: collab.collaboration_events?.map(ce => ce.events)[0] || [],
            options: collab.collaboration_options || [],
            organization: collab.organizations,
            profiles: [{
              name: user.user_metadata?.name || 'Unknown',
              avatar_url: user.user_metadata?.avatar_url
            }]
          })) || []);
        } 
        // For organizations, we fetch collaborations where they are the organization
        else if (userType === 'organization' && organizationData?.id) {
          const { data, error } = await supabase
            .from('collaborations')
            .select(`
              *,
              collaboration_events (
                events:event_id (
                  id,
                  title,
                  start_date,
                  image_url
                )
              ),
              collaboration_options (
                id,
                title,
                description,
                amount,
                is_custom,
                sponsorship_option_id
              ),
              profiles:sponsor_id (
                id,
                name,
                avatar_url
              )
            `)
            .eq('organization_id', organizationData.id)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching collaborations for organization:', error);
            throw error;
          }
          
          setCollaborations(data?.map(collab => ({
            ...collab,
            events: collab.collaboration_events?.map(ce => ce.events)[0] || [],
            options: collab.collaboration_options || [],
            organization: organizationData,
            profiles: collab.profiles ? [collab.profiles] : []
          })) || []);
        }
        
        console.log('Fetched collaborations:', collaborations);
        
        // Setup real-time updates subscription
        if (userType === 'organization' && organizationData?.id) {
          const subscription = subscribeToUserCollaborations(
            'organization', 
            organizationData.id,
            () => {
              // Refresh collaborations data when changes are detected
              getCollaborations();
            }
          );
          
          return () => {
            subscription.unsubscribe();
          };
        } else if (userType === 'sponsor' && user.id) {
          const subscription = subscribeToUserCollaborations(
            'sponsor', 
            user.id,
            () => {
              // Refresh collaborations data when changes are detected
              getCollaborations();
            }
          );
          
          return () => {
            subscription.unsubscribe();
          };
        }
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
    
    getCollaborations();
  }, [user, toast, userType, organizationData]);
  
  // Filtering collaborations
  const filteredCollaborations = collaborations.filter((collaboration) => {
    if (!collaboration) return false;
    
    const matchesSearch = searchQuery === '' || 
      collaboration.events?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaboration.organization?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (collaboration.profiles && Array.isArray(collaboration.profiles) && 
       collaboration.profiles.some(profile => 
         profile.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
