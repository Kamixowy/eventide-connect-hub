
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Types for our messaging system
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

// Helper function to get the other participant in a conversation
export const getRecipient = (conversation: Conversation, currentUserId: string): ConversationParticipant | undefined => {
  return conversation.participants?.find(p => p.user_id !== currentUserId);
};

// Function to fetch all conversations for the current user
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get all conversations the user is part of
    const { data: participantsData, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (participantsError) throw participantsError;
    if (!participantsData.length) return [];

    const conversationIds = participantsData.map(p => p.conversation_id);

    // Get conversations with their participants
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select(`
        *,
        participants:conversation_participants(
          id, 
          user_id,
          profile:profiles(
            id, 
            name, 
            avatar_url, 
            user_type,
            email
          ),
          organization:organizations(
            id,
            name,
            logo_url,
            category
          )
        )
      `)
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (conversationsError) throw conversationsError;

    // For each conversation, get the last message
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const { data: messages, error: messagesError } = await supabase
          .from('direct_messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (messagesError) throw messagesError;

        // Get unread count
        const { data: unreadCount, error: unreadError } = await supabase
          .from('direct_messages')
          .select('id', { count: 'exact' })
          .eq('conversation_id', conversation.id)
          .eq('read_at', null)
          .neq('sender_id', user.id);

        if (unreadError) throw unreadError;

        return {
          ...conversation,
          lastMessage: messages[0] || null,
          unreadCount: unreadCount.length || 0,
        };
      })
    );

    return conversationsWithLastMessage;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

// Function to fetch messages for a specific conversation
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    // Mark messages as read when fetching them
    await supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });

    const { data, error } = await supabase
      .from('direct_messages')
      .select(`
        *,
        sender:profiles!direct_messages_sender_id_fkey(
          id,
          name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Function to send a new message
export const sendMessage = async (conversationId: string, content: string): Promise<Message | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

// Function to start a new conversation with an organization
export const startConversation = async (organizationUserId: string, initialMessage: string): Promise<{ conversationId: string } | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if conversation already exists
    const { data: existingParticipants, error: existingError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (existingError) throw existingError;

    // Get all conversations where the organization is a participant
    if (existingParticipants.length > 0) {
      const conversationIds = existingParticipants.map(p => p.conversation_id);
      
      const { data: orgParticipants, error: orgError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', organizationUserId)
        .in('conversation_id', conversationIds);

      if (orgError) throw orgError;

      // If there's an existing conversation between these two users, use it
      if (orgParticipants.length > 0) {
        const existingConversationId = orgParticipants[0].conversation_id;
        
        // Send the initial message in the existing conversation
        if (initialMessage.trim()) {
          await sendMessage(existingConversationId, initialMessage);
        }
        
        return { conversationId: existingConversationId };
      }
    }

    // Create a new conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('direct_conversations')
      .insert({})
      .select()
      .single();

    if (conversationError) throw conversationError;

    // Add current user as participant
    const { error: userParticipantError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversation.id,
        user_id: user.id,
      });

    if (userParticipantError) throw userParticipantError;

    // Add organization as participant
    const { error: orgParticipantError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversation.id,
        user_id: organizationUserId,
      });

    if (orgParticipantError) throw orgParticipantError;

    // Send the initial message
    if (initialMessage.trim()) {
      await sendMessage(conversation.id, initialMessage);
    }

    return { conversationId: conversation.id };
  } catch (error) {
    console.error('Error starting conversation:', error);
    return null;
  }
};

// Function to fetch all organizations (for the new message dialog)
export const fetchOrganizations = async (): Promise<any[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: organizations, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        avatar_url,
        email,
        organization:organizations(
          id,
          name,
          logo_url,
          category,
          description
        )
      `)
      .eq('user_type', 'organization');

    if (error) throw error;

    // Filter out the current user if they are an organization
    return organizations.filter(org => org.id !== user.id) || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
};

// Hook for subscribing to new messages in a conversation
export const useMessageSubscription = (
  conversationId: string | null, 
  onNewMessage: (message: Message) => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  
  if (!conversationId || !user) {
    return { subscription: null };
  }

  // Subscribe to new messages
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        if (payload.new && payload.new.sender_id !== user.id) {
          // Mark the message as read if the conversation is open
          supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });
          
          // Add the sender info
          const newMessage = payload.new as Message;
          onNewMessage(newMessage);
        }
      }
    )
    .subscribe();

  return { subscription: channel };
};

// Hook to subscribe to conversation updates (new conversations, new messages)
export const useConversationsSubscription = (
  onUpdate: () => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  if (!user) {
    return { subscription: null };
  }

  // Subscribe to direct_conversations and direct_messages tables
  const channel = supabase
    .channel('conversation_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'direct_conversations'
      },
      () => {
        onUpdate();
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      },
      (payload) => {
        if (payload.new && payload.new.sender_id !== user.id) {
          // Show a toast notification for new messages
          toast({
            title: "Nowa wiadomość",
            description: "Otrzymałeś nową wiadomość",
            duration: 3000,
          });
          onUpdate();
        } else {
          onUpdate();
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_participants',
        filter: `user_id=eq.${user.id}`
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return { subscription: channel };
};
