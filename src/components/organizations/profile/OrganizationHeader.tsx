
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import CoverImage from './components/CoverImage';
import OrganizationAvatar from './components/OrganizationAvatar';
import ProfileInfo from './components/ProfileInfo';
import ActionButtons from './components/ActionButtons';
import useOrganizationHeader from './hooks/useOrganizationHeader';

interface OrganizationHeaderProps {
  organization: {
    name: string;
    logo: string;
    cover: string;
    location: string;
    category: string;
    followers: number;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  isLoggedIn: boolean;
  isOwner: boolean;
  following: boolean;
  setFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  handleContact: () => void;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  organization,
  isLoggedIn,
  isOwner,
  following,
  setFollowing,
  handleContact
}) => {
  const { toast } = useToast();
  const { isOrganizationUser } = useOrganizationHeader();

  return (
    <>
      <CoverImage 
        coverUrl={organization.cover || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
        organizationName={organization.name} 
      />
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row -mt-16 md:-mt-24 mb-8 items-start">
          <OrganizationAvatar 
            logoUrl={organization.logo} 
            name={organization.name} 
          />
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end w-full">
            <ProfileInfo organization={organization} />
            
            <ActionButtons 
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationHeader;
