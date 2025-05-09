
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
import { COLLABORATION_STATUS_NAMES } from '@/services/collaborations/types';

const Collaborations = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Determine user type from authentication context
  const userType = user?.user_metadata?.userType === 'organization' ? 'organization' : 'sponsor';

  // Fetch user collaborations
  useEffect(() => {
    const getCollaborations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching collaborations with user type:', userType);
        
        const collabData = await fetchCollaborations(userType);
        setCollaborations(collabData);
        
        console.log('Fetched collaborations:', collabData);
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
  }, [user, toast, userType]);
  
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
