
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCollaborationForm } from './hooks/useCollaborationForm';
import CollaborationDialogContent from './dialog-content/CollaborationDialogContent';
import { NewCollaborationDialogProps } from './types';

const NewCollaborationDialog: React.FC<NewCollaborationDialogProps> = ({
  eventId,
  organizationId,
  children,
  open,
  onOpenChange,
  selectedOptions
}) => {
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Sync external state if provided
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;
  
  // Pass initialEventId and initialOrganizationId to useCollaborationForm
  const collaborationFormProps = useCollaborationForm(eventId, organizationId);
  
  // If selectedOptions are provided, we could handle them here in the future
  
  const handleSubmit = async () => {
    try {
      // Create a new collaboration using the form props
      const collaborationId = await collaborationFormProps.createNewCollaboration();
      
      if (collaborationId) {
        setIsOpen(false);
        navigate(`/wspolprace/${collaborationId}`);
      }
    } catch (error) {
      console.error('Error creating collaboration:', error);
      // Error handling is done in useCollaborationForm
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
