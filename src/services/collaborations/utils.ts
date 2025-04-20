
import { CollaborationStatus, COLLABORATION_STATUS_NAMES, COLLABORATION_STATUS_COLORS } from './types';

export const getAvailableActions = (
  status: CollaborationStatus,
  userType: 'organization' | 'sponsor'
): string[] => {
  const actions: string[] = [];
  
  if (userType === 'sponsor') {
    switch (status) {
      case 'pending':
        actions.push('edit', 'cancel');
        break;
      case 'negotiation':
        actions.push('edit', 'accept_terms', 'cancel');
        break;
      case 'in_progress':
        // No actions for sponsor during in_progress
        break;
      case 'settlement':
        actions.push('accept_settlement', 'reject_settlement');
        break;
      case 'settlement_rejected':
        // No actions, waiting for organization to upload new settlement
        break;
    }
  } else if (userType === 'organization') {
    switch (status) {
      case 'pending':
        actions.push('accept', 'negotiate', 'cancel');
        break;
      case 'negotiation':
        actions.push('edit', 'accept_terms', 'cancel');
        break;
      case 'in_progress':
        actions.push('settle');
        break;
      case 'settlement':
        // No actions, waiting for sponsor response
        break;
      case 'settlement_rejected':
        actions.push('settle'); // Can upload new settlement
        break;
    }
  }
  
  return actions;
};

// Export types and constants
export type { CollaborationStatus };
export { COLLABORATION_STATUS_NAMES, COLLABORATION_STATUS_COLORS };
