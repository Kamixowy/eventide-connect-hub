
import { supabase } from '@/integrations/supabase/client';

/**
 * Oznacza wiadomości w konwersacji jako przeczytane
 */
export const markMessagesAsRead = async (conversationId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    await supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });
    return true;
  } catch (error) {
    console.error('Błąd podczas oznaczania wiadomości jako przeczytane:', error);
    return false;
  }
};
