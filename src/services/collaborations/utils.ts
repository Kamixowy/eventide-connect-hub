
// Status options for collaborations
export const COLLABORATION_STATUSES = {
  PENDING: 'pending',    // Oczekująca
  ACCEPTED: 'accepted',  // Zaakceptowana
  REJECTED: 'rejected',  // Odrzucona
  COMPLETED: 'completed' // Zakończona
};

// Status display names in Polish
export const COLLABORATION_STATUS_NAMES = {
  'pending': 'Oczekująca',
  'accepted': 'Zaakceptowana',
  'rejected': 'Odrzucona',
  'completed': 'Zakończona'
};

// Collaboration status colors for UI
export const COLLABORATION_STATUS_COLORS = {
  'pending': 'blue',
  'accepted': 'green',
  'rejected': 'red',
  'completed': 'purple'
};

/**
 * Determines which actions are available for a collaboration based on its status and user type
 * 
 * @param status - Current status of the collaboration
 * @param userType - Type of user (organization or sponsor)
 * @returns Array of available action names
 */
export const getAvailableActions = (status: string, userType: 'organization' | 'sponsor'): string[] => {
  const actions: string[] = [];
  
  // Common actions
  if (userType === 'organization' || userType === 'sponsor') {
    // Both user types can view details
    actions.push('view');
  }
  
  // Organization-specific actions
  if (userType === 'organization') {
    switch (status) {
      case 'pending':
        actions.push('accept', 'reject', 'negotiate');
        break;
      case 'accepted':
        actions.push('complete');
        break;
      case 'rejected':
        // No additional actions for rejected state
        break;
      case 'completed':
        // No additional actions for completed state
        break;
    }
  }
  
  // Sponsor-specific actions
  if (userType === 'sponsor') {
    switch (status) {
      case 'pending':
        actions.push('edit', 'cancel');
        break;
      case 'accepted':
        // Sponsor can view but not modify accepted collaborations
        break;
      case 'rejected':
        // No additional actions for rejected state
        break;
      case 'completed':
        // No additional actions for completed state
        break;
    }
  }
  
  return actions;
};
