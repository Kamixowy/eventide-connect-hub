
import React from 'react';

interface OrganizationSelectorProps {
  organizations: any[];
  selectedOrganizationId: string;
  handleOrganizationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
        <select
          className="w-full border border-gray-300 rounded-md p-2"
          value={selectedOrganizationId}
          onChange={handleOrganizationChange}
          disabled={isDisabled}
        >
          <option value="">Wybierz organizację</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrganizationSelector;
