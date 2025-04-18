
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizationsData } from './useOrganizationsData';
import { useEventsData } from './useEventsData';
import { useSponsorshipOptions } from './useSponsorshipOptions';
import { useCollaborationOptions } from './useCollaborationOptions';
import { useCollaborationSubmit } from './useCollaborationSubmit';

export const useCollaborationForm = (initialEventId?: string, initialOrganizationId?: string) => {
  const { user } = useAuth();
  
  const {
    organizations,
    selectedOrganizationId,
    handleOrganizationChange
  } = useOrganizationsData(initialOrganizationId);
  
  const {
    events,
    selectedEventIds,
    toggleEvent
  } = useEventsData(selectedOrganizationId, initialEventId);
  
  const { sponsorshipOptions } = useSponsorshipOptions(selectedEventIds);
  
  const {
    selectedOptions,
    toggleOption,
    addCustomOption,
    removeCustomOption,
    updateCustomOption,
    calculateTotalAmount
  } = useCollaborationOptions();
  
  const { isLoading, submitCollaboration } = useCollaborationSubmit();
  
  const totalAmount = calculateTotalAmount();
  
  const createNewCollaboration = async () => {
    console.log("Creating new collaboration with organization:", selectedOrganizationId);
    
    return await submitCollaboration({
      organizationId: selectedOrganizationId,
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
    totalAmount,
    toggleOption,
    addCustomOption,
    removeCustomOption,
    updateCustomOption,
    toggleEvent,
    handleOrganizationChange,
    createNewCollaboration
  };
};
