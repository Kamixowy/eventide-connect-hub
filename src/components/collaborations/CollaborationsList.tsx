import { Loader2 } from 'lucide-react';
import { CollaborationCardGrid } from './CollaborationCardGrid';
import { CollaborationCardList } from './CollaborationCardList';
import { CollaborationType } from '@/types/collaboration';

interface CollaborationsListProps {
  collaborations: CollaborationType[];
  viewMode: 'grid' | 'list';
  userType: 'organization' | 'sponsor';
  isLoading?: boolean;
}

export const CollaborationsList = ({ 
  collaborations, 
  viewMode, 
  userType,
  isLoading = false
}: CollaborationsListProps) => {
  
  console.log('Rendering collaborations list:', collaborations);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={36} className="animate-spin text-primary" />
      </div>
    );
  }
  
  if (collaborations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nie znaleziono żadnych współprac.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <CollaborationCardGrid 
        collaborations={collaborations}
        userType={userType}
      />
    );
  }

  return (
    <CollaborationCardList 
      collaborations={collaborations}
      userType={userType}
    />
  );
};
