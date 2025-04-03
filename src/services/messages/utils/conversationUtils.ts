
import { Conversation, ConversationParticipant } from '../types';
import { supabase } from '@/integrations/supabase/client';

// Helper function to get the other participant in a conversation
export const getRecipient = (conversation: Conversation, currentUserId: string): ConversationParticipant | undefined => {
  return conversation.participants?.find(p => p.user_id !== currentUserId);
};

// Helper function to enhance participants with profile and organization data
export const enhanceParticipantsWithProfiles = async (
  participants: any[], 
  supabaseClient: any
): Promise<ConversationParticipant[]> => {
  try {
    return await Promise.all(
      participants.map(async (participant) => {
        // Get profile for this participant
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id, name, avatar_url, user_type, email')
          .eq('id', participant.user_id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Get organization for this participant (if they are an organization)
        const { data: organization, error: organizationError } = await supabaseClient
          .from('organizations')
          .select('id, name, logo_url, category')
          .eq('user_id', participant.user_id)
          .maybeSingle();

        if (organizationError && organizationError.code !== 'PGRST116') {
          console.error('Error fetching organization:', organizationError);
        }

        // Return enhanced participant
        return {
          id: participant.id,
          conversation_id: participant.conversation_id,
          user_id: participant.user_id,
          profile: profile || undefined,
          organization: organization || undefined
        } as ConversationParticipant;
      })
    );
  } catch (error) {
    console.error('Error enhancing participants:', error);
    return [];
  }
};

// Helper function to calculate unread count for a conversation
export const getUnreadCount = async (
  conversationId: string, 
  userId: string,
  supabaseClient: any
): Promise<number> => {
  try {
    const { data: unreadMessages, error: unreadError } = await supabaseClient
      .from('direct_messages')
      .select('id', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .eq('read_at', null)
      .neq('sender_id', userId);

    if (unreadError) {
      console.error('Error fetching unread count:', unreadError);
      throw unreadError;
    }

    return unreadMessages ? unreadMessages.length : 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Helper function to get the last message for a conversation
export const getLastMessage = async (
  conversationId: string,
  supabaseClient: any
) => {
  try {
    const { data: messages, error: messagesError } = await supabaseClient
      .from('direct_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (messagesError) {
      console.error('Error fetching last message:', messagesError);
      throw messagesError;
    }

    return messages && messages.length > 0 ? messages[0] : null;
  } catch (error) {
    console.error('Error getting last message:', error);
    return null;
  }
};
