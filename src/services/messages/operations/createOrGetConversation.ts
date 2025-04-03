
import { supabase } from '@/integrations/supabase/client';

/**
 * Find or create a conversation between two users
 * Returns the conversation ID
 */
export const createOrGetConversation = async (
  otherUserId: string
): Promise<string | null> => {
  try {
    console.log("Finding or creating conversation with user:", otherUserId);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      throw new Error("You must be logged in to create a conversation");
    }
    
    // Use the database function to find or create a conversation
    const { data, error } = await supabase.rpc(
      'create_conversation_and_participants',
      {
        user_one: user.id,
        user_two: otherUserId
      }
    );
    
    if (error) {
      console.error("Error creating or finding conversation:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error("No conversation ID returned");
      return null;
    }
    
    const conversationId = data[0].conversation_id;
    console.log("Found or created conversation:", conversationId);
    return conversationId;
  } catch (error) {
    console.error("Error in createOrGetConversation:", error);
    throw error;
  }
};
