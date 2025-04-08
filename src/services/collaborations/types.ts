
// Types for collaboration services

export interface CollaborationOption {
  title: string;
  description?: string | null;
  amount: number;
  is_custom: boolean;
  sponsorship_option_id?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface Collaboration {
  id: string;
  sponsor_id: string;
  organization_id: string;
  event_id: string;
  status: string;
  message?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CollaborationDetailsResponse extends Collaboration {
  events?: {
    id: string;
    title: string;
    start_date: string;
    end_date?: string;
    date?: string;
  };
  event?: {
    id: string;
    title: string;
    date?: string;
    organization?: string;
  };
  organization?: {
    id: string;
    name: string;
    description?: string;
    logo_url?: string;
  };
  sponsor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  options?: any[];
  profiles?: any[];
  sponsorshipOptions?: any[];
}
