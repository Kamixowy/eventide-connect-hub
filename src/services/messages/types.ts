
import { RealtimeChannel } from '@supabase/supabase-js';

// Typy dla naszego systemu wiadomości
export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  profile?: {
    name: string;
    avatar_url?: string;
    user_type: string;
    email?: string;
  };
  organization?: {
    id: string;
    name: string;
    logo_url?: string;
    category?: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender?: {
    id: string;
    name?: string;
    avatar_url?: string;
  };
}
