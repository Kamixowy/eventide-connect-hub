
import React from 'react';
import type { Organization } from '@/hooks/useOrganizations';
import type { OrganizationCardProps } from './OrganizationCard';

interface OrganizationsGridProps {
  organizations: Organization[];
  onOrganizationClick: (orgId: string) => void;
  OrganizationCardComponent: React.ComponentType<OrganizationCardProps>;
}

const OrganizationsGrid = ({ 
  organizations, 
  onOrganizationClick, 
  OrganizationCardComponent 
}: OrganizationsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizations.map((org) => (
        <div 
          key={org.id} 
          onClick={() => onOrganizationClick(org.id)}
          className="cursor-pointer"
        >
          <OrganizationCardComponent organization={org} />
        </div>
      ))}
    </div>
  );
};

export default OrganizationsGrid;
