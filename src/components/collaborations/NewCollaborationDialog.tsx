
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCollaborationForm } from './hooks/useCollaborationForm';
import CollaborationDialogContent from './dialog-content/CollaborationDialogContent';
import { NewCollaborationDialogProps } from './types';

const NewCollaborationDialog: React.FC<NewCollaborationDialogProps> = ({
  eventId,
  organizationId,
  children
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Pass initialEventId and initialOrganizationId to useCollaborationForm
  const collaborationFormProps = useCollaborationForm(eventId, organizationId);
  
  const handleSubmit = async () => {
    try {
      // Create a new collaboration using the form props
      const collaborationId = await collaborationFormProps.createNewCollaboration();
      
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
        
        <CollaborationDialogContent 
          {...collaborationFormProps}
          handleSubmit={handleSubmit}
          eventId={eventId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewCollaborationDialog;
