
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { OrganizationCardProps } from './OrganizationCard';

const OrganizationListItem = ({ organization }: OrganizationCardProps) => {
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarImage src={organization.logo_url || ''} alt={organization.name} />
            <AvatarFallback className="text-xl bg-ngo/10 text-ngo">
              {organization.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
              <div>
                <h3 className="font-semibold text-lg">{organization.name}</h3>
                {organization.category && (
                  <Badge variant="outline" className="mr-2 bg-ngo/10 text-ngo border-ngo/20">
                    {organization.category}
                  </Badge>
                )}
              </div>
              
              <div className="mt-2 sm:mt-0">
                <Link to={`/organizacje/${organization.id}`}>
                  <Button variant="outline">Profil</Button>
                </Link>
              </div>
            </div>
            
            {organization.description && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {organization.description}
              </p>
            )}
            
            {organization.followers !== undefined && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users size={16} className="mr-1" />
                <span>{organization.followers} obserwujących</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationListItem;
