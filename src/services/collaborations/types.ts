
// Types for collaboration service

import { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface CollaborationOption {
  id?: string;
  title: string;
  description?: string | null;
  amount: number;
  is_custom?: boolean;
  sponsorship_option_id?: string;
  event_id?: string;
}

export interface Collaboration {
  id?: string;
  sponsor_id: string;
  organization_id: string;
  event_id: string;
  status: string;
  message: string;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface CollaborationDetailsResponse {
  id: string;
  status: string;
  message: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  events: {
    id: string;
    title: string;
    date: string;
    [key: string]: any;
  };
  sponsor: {
    id: string;
    profiles: {
      name: string;
      avatar_url: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  organization: {
    id: string;
    name: string;
    description: string;
    logo_url: string;
    profiles: {
      [key: string]: any;
    };
    [key: string]: any;
  };
  options: {
    id: string;
    sponsorship_options: {
      id: string;
      title: string;
      description: string;
      price: number;
      [key: string]: any;
    };
    [key: string]: any;
  }[];
}

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  conversation_id: string;
}
