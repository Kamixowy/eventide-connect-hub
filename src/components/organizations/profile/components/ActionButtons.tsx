
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Edit } from 'lucide-react';

interface ActionButtonsProps {
  isLoggedIn: boolean;
  isOwner: boolean;
  isOrganizationUser: boolean;
  following: boolean;
  onFollowClick: () => void;
  onContactClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoggedIn,
  isOwner,
  isOrganizationUser,
  following,
  onFollowClick,
  onContactClick
}) => {
  return (
    <div className="mt-4 md:mt-0 flex gap-3">
      {isLoggedIn && !isOrganizationUser && !isOwner && (
        <Button 
          variant={following ? "default" : "outline"} 
          onClick={onFollowClick}
          className={following ? "bg-ngo hover:bg-ngo/90" : ""}
        >
          {following ? (
            <>
              <Heart size={16} className="mr-2 fill-current" /> Obserwujesz
            </>
          ) : (
            <>
              <Heart size={16} className="mr-2" /> Obserwuj
            </>
          )}
        </Button>
      )}
      
      {isLoggedIn && !isOrganizationUser && !isOwner && (
        <Button 
          variant="outline" 
          onClick={onContactClick}
        >
          <MessageSquare size={16} className="mr-2" /> Kontakt
        </Button>
      )}
      
      {isOwner && (
        <Link to="/profil">
          <Button>
            <Edit size={16} className="mr-2" /> Edytuj profil
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ActionButtons;
