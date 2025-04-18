
import React from 'react';
import OrganizationSelector from '../dialogs/OrganizationSelector';
import EventSelector from '../dialogs/EventSelector';
import SponsorshipOptions from '../dialogs/SponsorshipOptions';
import CustomOptions from '../dialogs/CustomOptions';
import CollaborationSummary from '../dialogs/CollaborationSummary';
import { CollaborationDialogContentProps } from './types';

const CollaborationDialogContent: React.FC<CollaborationDialogContentProps> = ({
  isLoading,
  selectedOptions,
  sponsorshipOptions,
  organizations,
  events,
  selectedEventIds,
  selectedOrganizationId,
  totalAmount,
  toggleOption,
  addCustomOption,
  removeCustomOption,
  updateCustomOption,
  toggleEvent,
  handleOrganizationChange,
  handleSubmit,
  eventId
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <div className="md:col-span-2 space-y-6">
        <OrganizationSelector 
          organizations={organizations}
          selectedOrganizationId={selectedOrganizationId}
          handleOrganizationChange={handleOrganizationChange}
          isDisabled={!!eventId}
        />
        
        <EventSelector 
          events={events}
          selectedEventIds={selectedEventIds}
          toggleEvent={toggleEvent}
          eventId={eventId}
          selectedOrganizationId={selectedOrganizationId}
        />
        
        <SponsorshipOptions 
          selectedEventIds={selectedEventIds}
          sponsorshipOptions={sponsorshipOptions}
          selectedOptions={selectedOptions}
          toggleOption={toggleOption}
          addCustomOption={addCustomOption}
        />
        
        <CustomOptions 
          selectedOptions={selectedOptions}
          removeCustomOption={removeCustomOption}
          updateCustomOption={updateCustomOption}
        />
      </div>
      
      <div className="space-y-6">
        <CollaborationSummary 
          organizations={organizations}
          events={events}
          selectedOrganizationId={selectedOrganizationId}
          selectedEventIds={selectedEventIds}
          selectedOptions={selectedOptions}
          totalAmount={totalAmount}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CollaborationDialogContent;
