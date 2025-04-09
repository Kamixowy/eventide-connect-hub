
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface OrganizationCardProps {
  organization: {
    id: string;
    name: string;
    description?: string;
    logo_url?: string | null;
    category?: string;
    followers?: number;
    isCurrentUserOrg?: boolean;
  };
}

const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  return (
    <Card className={`h-full transition-all hover:shadow-md overflow-hidden ${organization.isCurrentUserOrg ? 'border-ngo border-2' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={organization.logo_url || ''} alt={organization.name} />
            <AvatarFallback className="text-xl bg-ngo/10 text-ngo">
              {organization.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{organization.name}</h3>
              {organization.isCurrentUserOrg && (
                <Badge className="bg-ngo hover:bg-ngo">
                  <CheckCircle className="h-3 w-3 mr-1" /> Twoja
                </Badge>
              )}
            </div>
            {organization.category && (
              <span className="text-sm text-muted-foreground">{organization.category}</span>
            )}
          </div>
        </div>
        
        {organization.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {organization.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          {organization.followers !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users size={16} className="mr-1" />
              <span>{organization.followers} obserwujących</span>
            </div>
          )}
          
          <Link to={`/organizacje/${organization.id}`}>
            <Button variant="outline">Profil</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;
