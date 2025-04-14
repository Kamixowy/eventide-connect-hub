
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
  
  // Use organization data hook
  const {
    organizations,
    selectedOrganizationId,
    handleOrganizationChange
  } = useOrganizationsData(initialOrganizationId);
  
  // Use events data hook
  const {
    events,
    selectedEventIds,
    toggleEvent
  } = useEventsData(selectedOrganizationId, initialEventId);
  
  // Use sponsorship options hook
  const { sponsorshipOptions } = useSponsorshipOptions(selectedEventIds);
  
  // Use collaboration options hook
  const {
    selectedOptions,
    toggleOption,
    addCustomOption,
    removeCustomOption,
    updateCustomOption,
    calculateTotalAmount
  } = useCollaborationOptions();
  
  // Use collaboration submission hook
  const { isLoading, submitCollaboration } = useCollaborationSubmit();
  
  // Calculate total amount from selected options
  const totalAmount = calculateTotalAmount();
  
  const createNewCollaboration = async () => {
    return await submitCollaboration({
      sponsorId: user?.id || '',
      organizationId: selectedOrganizationId,
      eventId: selectedEventIds[0],
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
