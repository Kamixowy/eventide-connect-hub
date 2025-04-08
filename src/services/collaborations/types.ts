
import { Message } from '@/services/messages/types';

export interface Collaboration {
  id: string;
  sponsor_id: string;
  organization_id: string;
  event_id: string;
  status: string;
  message?: string;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface CollaborationOption {
  title: string;
  description?: string | null;
  amount: number;
  is_custom: boolean;
  sponsorship_option_id?: string;
}

export interface SponsorshipOptionWithSelection extends SponsorshipOption {
  selected?: boolean;
}

export interface CollaborationFilters {
  status?: string;
  organization?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

// Add this to make the existing Message component work with collaborations
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
  sender?: {
    id: string;
    name?: string;
    avatar_url?: string;
  };
}
