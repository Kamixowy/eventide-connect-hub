
import { CollaborationCardGrid } from './CollaborationCardGrid';
import { CollaborationCardList } from './CollaborationCardList';
import { CollaborationType } from '@/types/collaboration';

interface CollaborationsListProps {
  collaborations: CollaborationType[];
  viewMode: 'grid' | 'list';
  userType: 'organization' | 'sponsor';
}

export const CollaborationsList = ({ collaborations, viewMode, userType }: CollaborationsListProps) => {
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
