
import React from 'react';
import type { Organization } from '@/hooks/useOrganizations';
import type { OrganizationCardProps } from './OrganizationCard';

interface OrganizationsListViewProps {
  organizations: Organization[];
  onOrganizationClick: (orgId: string) => void;
  OrganizationListItemComponent: React.ComponentType<OrganizationCardProps>;
}

const OrganizationsListView = ({ 
  organizations, 
  onOrganizationClick, 
  OrganizationListItemComponent 
}: OrganizationsListViewProps) => {
  return (
    <div className="flex flex-col gap-4">
      {organizations.map((org) => (
        <div 
          key={org.id} 
          onClick={() => onOrganizationClick(org.id)}
          className="cursor-pointer"
        >
          <OrganizationListItemComponent organization={org} />
        </div>
      ))}
    </div>
  );
};

export default OrganizationsListView;
