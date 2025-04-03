
import { supabase } from '@/integrations/supabase/client';
import { Conversation, ConversationParticipant } from '../types';
import { enhanceParticipantsWithProfiles, getUnreadCount, getLastMessage } from '../utils/conversationUtils';

/**
 * Pobiera wszystkie konwersacje dla zalogowanego użytkownika
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    // Sprawdź czy mamy zalogowanego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Brak zalogowanego użytkownika');
      return [];
    }

    console.log('Pobieranie konwersacji dla użytkownika:', user.id);

    // Pobierz ID konwersacji, w których użytkownik jest uczestnikiem
    const { data: participations, error: participationsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (participationsError) {
      console.error('Błąd podczas pobierania uczestnictw w konwersacjach:', participationsError);
      return [];
    }

    if (!participations || participations.length === 0) {
      console.log('Nie znaleziono konwersacji przez uczestników');
      return [];
    }

    const conversationIds = participations.map(p => p.conversation_id);

    // Pobierz konwersacje
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select('*')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      console.error('Błąd podczas pobierania konwersacji:', conversationsError);
      return [];
    }

    // Wzbogacone konwersacje z uczestnikami, ostatnimi wiadomościami i nieprzeczytanymi
    const enhancedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Pobierz uczestników dla tej konwersacji
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('*')
          .eq('conversation_id', conversation.id);

        if (participantsError) {
          console.error(`Błąd podczas pobierania uczestników konwersacji ${conversation.id}:`, participantsError);
          return null;
        }

        // Wzbogać uczestników o profile i organizacje
        const enhancedParticipants = await enhanceParticipantsWithProfiles(participants, supabase);

        // Pobierz ostatnią wiadomość
        const lastMessage = await getLastMessage(conversation.id, supabase);

        // Pobierz liczbę nieprzeczytanych wiadomości
        const unreadCount = await getUnreadCount(conversation.id, user.id, supabase);

        return {
          ...conversation,
          participants: enhancedParticipants,
          lastMessage,
          unreadCount
        } as Conversation;
      })
    );

    // Przefiltruj null (jeśli jakieś wystąpiły podczas błędów)
    return enhancedConversations.filter(Boolean) as Conversation[];
  } catch (error) {
    console.error('Błąd w fetchConversations:', error);
    return [];
  }
};
