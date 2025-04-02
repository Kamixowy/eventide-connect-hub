
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { CollaborationFilters } from '@/components/collaborations/CollaborationFilters';
import { CollaborationsList } from '@/components/collaborations/CollaborationsList';
import { sampleCollaborations } from '@/data/collaborationsData';

const Collaborations = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  
  // Determine user type from authentication context
  const userType = user?.user_metadata?.userType === 'organization' ? 'organization' : 'sponsor';

  // Filtering collaborations
  const filteredCollaborations = sampleCollaborations.filter((collaboration) => {
    const matchesSearch = searchQuery === '' || 
      collaboration.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaboration.event.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaboration.sponsor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || collaboration.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Współprace</h1>
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
        />
      </div>
    </Layout>
  );
};

export default Collaborations;
