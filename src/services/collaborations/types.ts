
export const COLLABORATION_STATUSES = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
  negotiation: 'negotiation',
  in_progress: 'in_progress',
  settlement: 'settlement',
  settlement_rejected: 'settlement_rejected',
  completed: 'completed',
  canceled: 'canceled'
} as const;

export type CollaborationStatus = (typeof COLLABORATION_STATUSES)[keyof typeof COLLABORATION_STATUSES];

export interface CollaborationOption {
  title: string;
  description?: string | null;
  amount: number;
  is_custom: boolean;
  sponsorship_option_id?: string;
}

export interface Message {
  id: string;
  collaboration_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface CollaborationDetailsResponse {
  id: string;
  sponsor_id: string;
  organization_id: string;
  status: CollaborationStatus;
  message: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
  organization?: any;
  profiles?: any[];
  events?: any;
}

export const COLLABORATION_STATUS_NAMES = {
  pending: 'Oczekująca',
  accepted: 'Zaakceptowana',
  rejected: 'Odrzucona',
  negotiation: 'W negocjacji',
  in_progress: 'W realizacji',
  settlement: 'W rozliczeniu',
  settlement_rejected: 'Rozliczenie odrzucone',
  completed: 'Zrealizowana',
  canceled: 'Anulowana'
};

export const COLLABORATION_STATUS_COLORS = {
  pending: 'yellow',
  accepted: 'green',
  rejected: 'red',
  negotiation: 'orange',
  in_progress: 'blue',
  settlement: 'purple',
  settlement_rejected: 'red',
  completed: 'green',
  canceled: 'gray'
};
