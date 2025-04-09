
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import SocialMediaButtons from './SocialMediaButtons';

interface ProfileInfoProps {
  organization: {
    name: string;
    logo: string;
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
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ organization }) => {
  return (
    <div className="mt-4 md:mt-20 md:ml-6 flex-grow">
      <div>
        <Badge className="mb-2 bg-ngo text-white">
          {organization.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold">{organization.name}</h1>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          {organization.location}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          {organization.followers || 0} obserwujących
        </div>
        
        <SocialMediaButtons socialMedia={organization.socialMedia} />
      </div>
    </div>
  );
};

export default ProfileInfo;
