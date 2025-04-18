
import { CollaborationType } from '@/types/collaboration';

export interface Collaboration {
  id: string;
  sponsor_id: string;
  organization_id: string;
  status: string;
  message: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CollaborationOption {
  title: string;
  description?: string | null;
  amount: number;
  is_custom: boolean;
  sponsorship_option_id?: string;
}

export interface CollaborationDetailsResponse extends CollaborationType {}

// Message interface for collaboration messages
export interface Message {
  id: string;
  collaboration_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

// Export this symbol to avoid circular references
export const COLLABORATION_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  NEGOTIATION: 'negotiation',
  CANCELED: 'canceled'
};

export const COLLABORATION_STATUS_NAMES = {
  [COLLABORATION_STATUSES.PENDING]: 'Oczekująca',
  [COLLABORATION_STATUSES.ACCEPTED]: 'Zaakceptowana',
  [COLLABORATION_STATUSES.REJECTED]: 'Odrzucona',
  [COLLABORATION_STATUSES.COMPLETED]: 'Zakończona',
  [COLLABORATION_STATUSES.NEGOTIATION]: 'W negocjacji',
  [COLLABORATION_STATUSES.CANCELED]: 'Anulowana'
};

export const COLLABORATION_STATUS_COLORS = {
  [COLLABORATION_STATUSES.PENDING]: 'yellow',
  [COLLABORATION_STATUSES.ACCEPTED]: 'green',
  [COLLABORATION_STATUSES.REJECTED]: 'red',
  [COLLABORATION_STATUSES.COMPLETED]: 'blue',
  [COLLABORATION_STATUSES.NEGOTIATION]: 'orange',
  [COLLABORATION_STATUSES.CANCELED]: 'gray'
};
