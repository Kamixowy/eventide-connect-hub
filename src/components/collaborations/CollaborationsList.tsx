
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

  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : "space-y-6"
    }>
      {collaborations.map((collaboration) => (
        viewMode === 'grid' ? (
          <CollaborationCardGrid 
            key={collaboration.id} 
            collaboration={collaboration} 
            userType={userType} 
          />
        ) : (
          <CollaborationCardList 
            key={collaboration.id} 
            collaboration={collaboration} 
            userType={userType} 
          />
        )
      ))}
    </div>
  );
};
