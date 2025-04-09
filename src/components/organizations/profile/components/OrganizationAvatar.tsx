
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OrganizationAvatarProps {
  logoUrl: string;
  name: string;
}

const OrganizationAvatar: React.FC<OrganizationAvatarProps> = ({ logoUrl, name }) => {
  return (
    <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-white">
      <AvatarImage src={logoUrl} alt={name} />
      <AvatarFallback className="text-3xl">{name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default OrganizationAvatar;
