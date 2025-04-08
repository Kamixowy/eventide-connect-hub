
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface OrganizationSelectorProps {
  organizations: any[];
  selectedOrganizationId: string;
  handleOrganizationChange: (value: string) => void;
  isDisabled: boolean;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  organizations,
  selectedOrganizationId,
  handleOrganizationChange,
  isDisabled
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Wybierz organizację</h3>
      
      <div className="space-y-4">
        <Select 
          value={selectedOrganizationId}
          onValueChange={handleOrganizationChange}
          disabled={isDisabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Wybierz organizację" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrganizationSelector;
