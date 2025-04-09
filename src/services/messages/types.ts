
export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  lastMessage?: Message | null;
  unreadCount?: number;
  title?: string;
  subtitle?: string;
  collaboration_id?: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id?: string;
  organization_id?: string;
  is_organization?: boolean;
  created_at: string;
  profile?: UserProfile;
  organization?: Organization;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  user_type: string;
}

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  user_id: string;
}

export interface NewMessageData {
  content: string;
  recipient_id?: string;
  organization_id?: string;
}
