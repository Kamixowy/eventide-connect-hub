
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizationsData } from './useOrganizationsData';
import { useEventsData } from './useEventsData';
import { useSponsorshipOptions } from './useSponsorshipOptions';
import { useCollaborationOptions } from './useCollaborationOptions';
import { useCollaborationSubmit } from './useCollaborationSubmit';

export const useCollaborationForm = (initialEventId?: string, initialOrganizationId?: string) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  
  // Use organization data hook with initial value if provided
  const {
    organizations,
    selectedOrganizationId,
    handleOrganizationChange
  } = useOrganizationsData(initialOrganizationId);
  
  // Use events data hook with initial value if provided
  const {
    events,
    selectedEventIds,
    toggleEvent
  } = useEventsData(selectedOrganizationId, initialEventId);
  
  // Use sponsorship options hook based on selected events
  const { sponsorshipOptions } = useSponsorshipOptions(selectedEventIds);
  
  // Use collaboration options hook to manage selected options
  const {
    selectedOptions,
    toggleOption,
    addCustomOption,
    removeCustomOption,
    updateCustomOption,
    calculateTotalAmount
  } = useCollaborationOptions();
  
  // Use collaboration submission hook for submitting the collaboration
  const { isLoading, submitCollaboration } = useCollaborationSubmit();
  
  // Calculate total amount from selected options
  const totalAmount = calculateTotalAmount();
  
  // Function to create a new collaboration
  const createNewCollaboration = async () => {
    console.log("Creating new collaboration with organization:", selectedOrganizationId);
    
    // We don't pass sponsorId here as it will be determined from the current user in submitCollaboration
    return await submitCollaboration({
      sponsorId: '', // This will be overridden in useCollaborationSubmit to use the current user ID
      organizationId: selectedOrganizationId,
      eventId: selectedEventIds.length > 0 ? selectedEventIds[0] : '',
      message,
      totalAmount,
      selectedOptions,
      selectedEventIds
    });
  };

  return {
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
  };
};
