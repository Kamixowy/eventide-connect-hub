
// Utility functions and constants for collaborations

export const COLLABORATION_STATUSES = {
  PENDING: 'pending',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  NEGOTIATION: 'negotiation',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const COLLABORATION_STATUS_NAMES = {
  pending: 'W przygotowaniu',
  sent: 'Przesłana',
  accepted: 'Zaakceptowana',
  rejected: 'Odrzucona',
  negotiation: 'Negocjacje',
  completed: 'Zakończona',
  cancelled: 'Anulowana'
};

export const COLLABORATION_STATUS_COLORS = {
  pending: 'blue',
  sent: 'yellow',
  accepted: 'green',
  rejected: 'red',
  negotiation: 'purple',
  completed: 'green',
  cancelled: 'gray'
};

/**
 * Get available actions based on collaboration status and user type
 * 
 * @param status - Current collaboration status
 * @param userType - Type of user (sponsor or organization)
 * @returns Array of available action types
 */
export const getAvailableActions = (status: string, userType: 'sponsor' | 'organization'): string[] => {
  if (!status) return [];
  
  if (userType === 'sponsor') {
    switch (status) {
      case 'pending':
        return ['edit', 'send'];
      case 'sent':
        return ['cancel'];
      case 'negotiation':
        return ['accept', 'cancel'];
      case 'accepted':
        return [];
      case 'rejected':
        return [];
      case 'completed':
        return [];
      case 'cancelled':
        return [];
      default:
        return [];
    }
  } else {
    // Organization
    switch (status) {
      case 'pending':
        return [];
      case 'sent':
        return ['accept', 'reject', 'negotiate'];
      case 'negotiation':
        return ['accept', 'reject'];
      case 'accepted':
        return ['complete'];
      case 'rejected':
        return [];
      case 'completed':
        return [];
      case 'cancelled':
        return [];
      default:
        return [];
    }
  }
};
