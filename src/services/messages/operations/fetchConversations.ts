
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '../types';
import { enhanceParticipantsWithProfiles, getLastMessage, getUnreadCount } from '../utils/conversationUtils';

// Funkcja do pobierania wszystkich konwersacji dla bieżącego użytkownika
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Użytkownik nie zalogowany');

    console.log('Pobieranie konwersacji dla użytkownika:', user.id);

    // Bezpośrednie podejście z użyciem direct_conversations i conversation_participants
    try {
      // Pobierz wszystkie konwersacje, w których użytkownik jest uczestnikiem
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantsError) {
        console.error('Błąd podczas pobierania uczestników konwersacji:', participantsError);
        throw participantsError;
      }

      if (!participantsData || participantsData.length === 0) {
        console.log('Nie znaleziono konwersacji przez uczestników');
        return [];
      }

      const conversationIds = participantsData.map(p => p.conversation_id);
      console.log('Znaleziono ID konwersacji przez uczestników:', conversationIds);

      // Pobierz konwersacje z uczestnikami
      const { data: conversations, error: conversationsError } = await supabase
        .from('direct_conversations')
        .select(`
          *,
          participants:conversation_participants(
            id, 
            user_id
          )
        `)
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (conversationsError) {
        console.error('Błąd podczas pobierania konwersacji:', conversationsError);
        throw conversationsError;
      }

      console.log('Pobrano konwersacje z uczestnikami:', conversations?.length || 0);

      if (!conversations || conversations.length === 0) return [];

      // Wzbogać konwersacje o profile i wiadomości
      return await enhanceConversations(conversations, user.id);
    } catch (participantsError) {
      // Jeśli wystąpił błąd z podejściem uczestników, spróbuj podejścia z wiadomościami
      console.log('Przełączenie na podejście z wiadomościami z powodu błędu:', participantsError.message);
      
      // Alternatywne podejście: Pobierz konwersacje z wiadomości
      return await fetchConversationsFromMessages(user.id);
    }
  } catch (error) {
    console.error('Błąd w fetchConversations:', error);
    return [];
  }
};

// Funkcja pomocnicza do wzbogacania konwersacji o profile i inne dane
const enhanceConversations = async (conversations: any[], userId: string): Promise<Conversation[]> => {
  return await Promise.all(
    conversations.map(async (conversation) => {
      const enhancedParticipants = await enhanceParticipantsWithProfiles(
        conversation.participants || [], 
        supabase
      );

      const lastMessage = await getLastMessage(conversation.id, supabase);
      const unreadCount = await getUnreadCount(conversation.id, userId, supabase);

      return {
        ...conversation,
        participants: enhancedParticipants,
        lastMessage,
        unreadCount,
      } as Conversation;
    })
  );
};

// Zapasowa metoda pobierania konwersacji przez wiadomości
const fetchConversationsFromMessages = async (userId: string): Promise<Conversation[]> => {
  try {
    // Najpierw pobierz wszystkie wysłane wiadomości, aby znaleźć konwersacje
    const { data: sentMessages, error: sentError } = await supabase
      .from('direct_messages')
      .select('conversation_id')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (sentError) {
      console.error('Błąd podczas pobierania wysłanych wiadomości:', sentError);
      throw sentError;
    }

    // Następnie pobierz wszystkie otrzymane wiadomości, aby znaleźć konwersacje
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('direct_messages')
      .select('conversation_id, sender_id')
      .neq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (receivedError) {
      console.error('Błąd podczas pobierania otrzymanych wiadomości:', receivedError);
      throw receivedError;
    }

    // Połącz i pobierz unikalne ID konwersacji
    const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
    if (allMessages.length === 0) {
      console.log('Nie znaleziono wiadomości dla użytkownika');
      return [];
    }

    const conversationIds = [...new Set(allMessages.map(m => m.conversation_id))];
    console.log('Znaleziono ID konwersacji z wiadomości:', conversationIds);

    // Pobierz konwersacje z tymi ID
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select('*')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      console.error('Błąd podczas pobierania konwersacji:', conversationsError);
      throw conversationsError;
    }

    console.log('Pobrano konwersacje metodą wiadomości:', conversations?.length || 0);
    
    if (!conversations || conversations.length === 0) return [];

    // Dla każdej konwersacji ręcznie pobierz uczestników, ponieważ złączenie może powodować problemy z RLS
    const enhancedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Pobierz uczestników tej konwersacji
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('id, user_id')
          .eq('conversation_id', conversation.id);

        if (participantsError) {
          console.error(`Błąd podczas pobierania uczestników konwersacji ${conversation.id}:`, participantsError);
          // Kontynuuj z pustymi uczestnikami zamiast niepowodzenia
          conversation.participants = [];
        } else {
          conversation.participants = participants || [];
        }

        // Wzbogać o profile, itp.
        const enhancedParticipants = await enhanceParticipantsWithProfiles(
          conversation.participants, 
          supabase
        );

        const lastMessage = await getLastMessage(conversation.id, supabase);
        const unreadCount = await getUnreadCount(conversation.id, userId, supabase);

        return {
          ...conversation,
          participants: enhancedParticipants,
          lastMessage,
          unreadCount,
        } as Conversation;
      })
    );

    return enhancedConversations;
  } catch (error) {
    console.error('Błąd w fetchConversationsFromMessages:', error);
    return [];
  }
};
