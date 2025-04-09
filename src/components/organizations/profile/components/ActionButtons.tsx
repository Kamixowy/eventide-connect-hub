
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ActionButtonsProps {
  isOwner: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOwner
}) => {
  return (
    <div className="mt-4 md:mt-0 flex gap-3">
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
