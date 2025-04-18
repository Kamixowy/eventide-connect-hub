
import { CollaborationStatus } from './types';

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
        actions.push('accept', 'edit', 'cancel');
        break;
      case 'accepted':
        actions.push('complete');
        break;
    }
  } else if (userType === 'organization') {
    switch (status) {
      case 'pending':
        actions.push('accept', 'reject', 'negotiate');
        break;
      case 'negotiation':
        actions.push('accept', 'reject');
        break;
      case 'accepted':
        actions.push('complete');
        break;
    }
  }
  
  return actions;
};

// Re-export these from types to maintain compatibility with existing imports
export { 
  COLLABORATION_STATUS_NAMES, 
  COLLABORATION_STATUS_COLORS 
} from './types';
