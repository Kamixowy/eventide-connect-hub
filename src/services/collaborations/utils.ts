
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

// Status współpracy
export const COLLABORATION_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  NEGOTIATION: 'negotiation',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Mapowanie statusów na nazwy w języku polskim
export const COLLABORATION_STATUS_NAMES = {
  [COLLABORATION_STATUSES.DRAFT]: 'Wersja robocza',
  [COLLABORATION_STATUSES.SENT]: 'Przesłana',
  [COLLABORATION_STATUSES.NEGOTIATION]: 'Negocjacje',
  [COLLABORATION_STATUSES.ACCEPTED]: 'Zaakceptowana',
  [COLLABORATION_STATUSES.REJECTED]: 'Odrzucona',
  [COLLABORATION_STATUSES.COMPLETED]: 'Zakończona',
  [COLLABORATION_STATUSES.CANCELLED]: 'Anulowana'
};

// Mapowanie statusów na kolory
export const COLLABORATION_STATUS_COLORS = {
  [COLLABORATION_STATUSES.DRAFT]: 'gray',
  [COLLABORATION_STATUSES.SENT]: 'blue',
  [COLLABORATION_STATUSES.NEGOTIATION]: 'yellow',
  [COLLABORATION_STATUSES.ACCEPTED]: 'green',
  [COLLABORATION_STATUSES.REJECTED]: 'red',
  [COLLABORATION_STATUSES.COMPLETED]: 'purple',
  [COLLABORATION_STATUSES.CANCELLED]: 'orange'
};

// Formatowanie daty
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  return format(new Date(date), 'd MMMM yyyy', { locale: pl });
};

// Formatowanie daty i godziny
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return format(new Date(date), 'd MMMM yyyy, HH:mm', { locale: pl });
};

// Możliwe akcje dla danego statusu i typu użytkownika
export const getAvailableActions = (
  status: string,
  userType: 'organization' | 'sponsor'
): string[] => {
  const statuses = COLLABORATION_STATUSES;
  
  switch (status) {
    case statuses.DRAFT:
      return userType === 'sponsor' 
        ? ['edit', 'send', 'delete'] 
        : [];
    
    case statuses.SENT:
      return userType === 'organization'
        ? ['accept', 'reject', 'negotiate']
        : ['cancel'];
    
    case statuses.NEGOTIATION:
      return ['edit', 'accept', 'reject', 'cancel'];
    
    case statuses.ACCEPTED:
      return ['complete', 'cancel'];
    
    case statuses.REJECTED:
    case statuses.COMPLETED:
    case statuses.CANCELLED:
      return [];
      
    default:
      return [];
  }
};

// Walidacja kwoty
export const isValidAmount = (amount: number | string): boolean => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount >= 0;
};
