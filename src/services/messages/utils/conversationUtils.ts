
import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { Conversation, ConversationParticipant, Message } from '../types';

/**
 * Get the recipient of a conversation (the other participant)
 * 
 * @param conversation - Conversation object
 * @param currentUserId - Current user ID
 * @returns The recipient participant
 */
export const getRecipient = (
  conversation: Conversation,
  currentUserId: string
): ConversationParticipant | undefined => {
  if (!conversation.participants) return undefined;

  // Check if we're an organization
  const currentUserParticipant = conversation.participants.find(p => p.user_id === currentUserId);
  
  if (currentUserParticipant?.is_organization) {
    // If current user is an organization, find the non-organization participant
    return conversation.participants.find(p => !p.is_organization);
  } else {
    // If current user is a regular user, find either:
    // 1. The organization participant (if any)
    const orgParticipant = conversation.participants.find(p => p.is_organization);
    if (orgParticipant) return orgParticipant;
    
    // 2. Or another user that is not the current user
    return conversation.participants.find(p => p.user_id !== currentUserId);
  }
};

/**
 * Enhance conversation participants with profile and organization data
 * 
 * @param participants - Array of participants
 * @param supabase - Supabase client
 * @returns Enhanced participants with profile/organization data
 */
export const enhanceParticipantsWithProfiles = async (
  participants: any[],
  supabase: SupabaseClient
): Promise<ConversationParticipant[]> => {
  const enhancedParticipants = [];

  for (const participant of participants) {
    let enhancedParticipant: ConversationParticipant = { ...participant };

    if (participant.is_organization && participant.organization_id) {
      // For organization participants, fetch organization data
      const { data: organizationData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', participant.organization_id)
        .single();

      if (!orgError && organizationData) {
        enhancedParticipant.organization = organizationData;
      }
    } else if (participant.user_id) {
      // For user participants, fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', participant.user_id)
        .single();

      if (!profileError && profileData) {
        enhancedParticipant.profile = profileData;
      }
    }

    enhancedParticipants.push(enhancedParticipant);
  }

  return enhancedParticipants;
};

/**
 * Get the last message for a conversation
 * 
 * @param conversationId - Conversation ID
 * @param supabase - Supabase client
 * @returns The last message, if any
 */
export const getLastMessage = async (
  conversationId: string,
  supabase: SupabaseClient
): Promise<Message | null> => {
  const { data, error } = await supabase
    .from('direct_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    if (!error?.message.includes('No rows found')) {
      console.error(`Error fetching last message for conversation ${conversationId}:`, error);
    }
    return null;
  }

  return data as Message;
};

/**
 * Get unread message count for a conversation
 * 
 * @param conversationId - Conversation ID
 * @param userId - Current user ID
 * @param supabase - Supabase client
 * @returns Count of unread messages
 */
export const getUnreadCount = async (
  conversationId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<number> => {
  // First check if user is participating as themselves or as an organization
  const { data: participantData } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', conversationId)
    .or(`user_id.eq.${userId},organization_id.in.(select id from organizations where user_id='${userId}')`)
    .single();

  if (!participantData) {
    return 0; // Not a participant, so no unread messages
  }

  // Check unread messages based on whether the user participates as themselves or as their organization
  const { count, error } = await supabase
    .from('direct_messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .is('read_at', null)
    .neq('sender_id', userId);

  if (error) {
    console.error(`Error fetching unread count for conversation ${conversationId}:`, error);
    return 0;
  }

  return count || 0;
};
