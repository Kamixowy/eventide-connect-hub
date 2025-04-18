
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  participants?: ConversationParticipant[];
  unread_count?: number;
}

export interface ConversationParticipant {
  id?: string;
  user_id?: string;
  organization_id?: string;
  conversation_id?: string;
  is_organization?: boolean;
  profile?: {
    id?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
    user_type?: 'organization' | 'sponsor';
  };
  organization?: {
    id?: string;
    name?: string;
    logo_url?: string;
    description?: string;
  };
}
