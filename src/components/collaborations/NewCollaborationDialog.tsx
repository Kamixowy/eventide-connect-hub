
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCollaborationForm } from './hooks/useCollaborationForm';

// Import smaller components
import OrganizationSelector from './dialogs/OrganizationSelector';
import EventSelector from './dialogs/EventSelector';
import SponsorshipOptions from './dialogs/SponsorshipOptions';
import CustomOptions from './dialogs/CustomOptions';
import MessageInput from './dialogs/MessageInput';
import CollaborationSummary from './dialogs/CollaborationSummary';
import { NewCollaborationDialogProps } from './types';

const NewCollaborationDialog: React.FC<NewCollaborationDialogProps> = ({
  eventId,
  organizationId,
  children
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const {
    isLoading,
    selectedOptions,
    sponsorshipOptions,
    organizations,
    events,
    selectedEventIds,
    selectedOrganizationId,
    message,
    totalAmount,
    toggleOption,
    addCustomOption,
    removeCustomOption,
    updateCustomOption,
    toggleEvent,
    handleOrganizationChange,
    setMessage,
    createNewCollaboration
  } = useCollaborationForm(eventId, organizationId);
  
  const handleSubmit = async () => {
    try {
      const collaborationId = await createNewCollaboration();
      
      if (collaborationId) {
        setOpen(false);
        navigate(`/wspolprace/${collaborationId}`);
      }
    } catch (error) {
      console.error('Error creating collaboration:', error);
      // Error handling is done in useCollaborationForm
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nowa propozycja współpracy</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-6">
            <OrganizationSelector 
              organizations={organizations}
              selectedOrganizationId={selectedOrganizationId}
              handleOrganizationChange={handleOrganizationChange}
              isDisabled={!!organizationId}
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
            
            <MessageInput 
              message={message}
              setMessage={setMessage}
              required={false}
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
      </DialogContent>
    </Dialog>
  );
};

export default NewCollaborationDialog;
