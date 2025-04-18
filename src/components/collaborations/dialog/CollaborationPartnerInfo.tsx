
import { CollaborationType } from "@/types/collaboration";

interface CollaborationPartnerInfoProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
}

const CollaborationPartnerInfo = ({ collaboration, userType }: CollaborationPartnerInfoProps) => {
  const organizationName = collaboration.organization?.name || 'Nieznana organizacja';
  const sponsorName = collaboration.profiles?.[0]?.name || 
                     collaboration.sponsor?.name || 
                     'Nieznany sponsor';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Organizacja</h3>
        <div className="p-4 border rounded-lg">
          <p className="font-medium">{organizationName}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {collaboration.organization?.description || 'Brak opisu'}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Sponsor</h3>
        <div className="p-4 border rounded-lg">
          <p className="font-medium">
            {userType === 'sponsor' ? 'Ty' : sponsorName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPartnerInfo;
