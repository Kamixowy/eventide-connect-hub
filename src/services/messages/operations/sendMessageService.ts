
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';
import { createOrGetConversation } from './createOrGetConversation';
import { checkConversationParticipation } from './checkConversationParticipation';

/**
 * Wysyła wiadomość do istniejącej konwersacji
 */
export const sendMessageToConversation = async (
  conversationId: string,
  content: string
): Promise<Message | null> => {
  try {
    // Walidacja danych wejściowych
    if (!conversationId) throw new Error("ID konwersacji jest wymagane");
    if (!content.trim()) throw new Error("Treść wiadomości nie może być pusta");
    
    console.log(`Wysyłanie wiadomości do konwersacji ${conversationId}: ${content}`);
    
    // Pobierz aktualnego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Musisz być zalogowany, aby wysyłać wiadomości");
    }
    
    // Temporarily return null as this functionality is disabled
    console.log("sendMessageToConversation is temporarily disabled");
    return null;

    /* The code below is temporarily disabled as the tables are not defined in the schema
    // Sprawdź, czy użytkownik jest uczestnikiem konwersacji
    const isParticipant = await checkConversationParticipation(conversationId);
    
    // Jeśli użytkownik nie jest uczestnikiem, dodaj go
    if (!isParticipant) {
      console.log(`Użytkownik ${user.id} nie jest uczestnikiem konwersacji ${conversationId}, próba dodania...`);
      
      // Use direct insert approach instead of trying to use the RPC function
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: user.id
        });
      
      if (participantError) {
        console.error("Błąd podczas dodawania użytkownika jako uczestnika:", participantError);
        throw new Error("Nie masz uprawnień do wysyłania wiadomości w tej konwersacji");
      }
    }
    
    // Tworzenie i wysyłanie wiadomości
    const { data: message, error } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim()
      })
      .select('*')
      .single();
    
    if (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
      throw new Error(`Nie udało się wysłać wiadomości: ${error.message}`);
    }
    
    console.log("Wiadomość wysłana pomyślnie:", message);
    
    // Aktualizacja znacznika czasu konwersacji
    await supabase
      .from('direct_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    return message;
    */
  } catch (error) {
    console.error("Błąd w sendMessageToConversation:", error);
    throw error;
  }
};

/**
 * Rozpoczyna nową konwersację z użytkownikiem i wysyła pierwszą wiadomość
 */
export const startConversationWithMessage = async (
  recipientUserId: string,
  initialMessage: string
): Promise<{ conversationId: string, message: Message | null }> => {
  try {
    // Walidacja danych wejściowych
    if (!recipientUserId) throw new Error("ID odbiorcy jest wymagane");
    if (!initialMessage.trim()) throw new Error("Treść wiadomości nie może być pusta");
    
    console.log(`Rozpoczynanie konwersacji z użytkownikiem ${recipientUserId}: ${initialMessage}`);
    
    // Pobierz aktualnego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Musisz być zalogowany, aby rozpocząć konwersację");
    }
    
    // Temporarily return mock data as this functionality is disabled
    console.log("startConversationWithMessage is temporarily disabled");
    return {
      conversationId: "temporary-id",
      message: null
    };

    /* The code below is temporarily disabled as the tables are not defined in the schema
    // Najpierw utwórz lub pobierz konwersację
    const conversationId = await createOrGetConversation(recipientUserId);
    
    if (!conversationId) {
      throw new Error("Nie udało się utworzyć konwersacji");
    }
    
    // Następnie wyślij początkową wiadomość
    const message = await sendMessageToConversation(conversationId, initialMessage);
    
    return {
      conversationId,
      message
    };
    */
  } catch (error) {
    console.error("Błąd w startConversationWithMessage:", error);
    throw error;
  }
};

/**
 * Tworzy testową konwersację z przykładowymi wiadomościami
 */
export const createTestConversation = async (
  targetEmail: string
): Promise<{ conversationId: string } | null> => {
  try {
    // Pobierz aktualnego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Musisz być zalogowany, aby utworzyć testową konwersację");
    }
    
    // Temporarily return null as this functionality is disabled
    console.log("createTestConversation is temporarily disabled");
    return null;

    /* The code below is temporarily disabled as the tables are not defined in the schema
    // Znajdź użytkownika docelowego po adresie e-mail
    const { data: targetUser, error: userError } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('email', targetEmail)
      .maybeSingle();
    
    if (userError || !targetUser) {
      console.error("Nie znaleziono użytkownika docelowego:", userError || "Brak użytkownika o podanym adresie e-mail");
      throw new Error("Nie znaleziono użytkownika docelowego");
    }
    
    // Utwórz lub pobierz konwersację przy użyciu zabezpieczonej funkcji RPC
    const { data: conversationData, error: convError } = await supabase
      .rpc('create_conversation_and_participants', {
        user_one: user.id,
        user_two: targetUser.id
      });
    
    if (convError || !conversationData || conversationData.length === 0) {
      console.error("Błąd podczas tworzenia konwersacji:", convError || "Brak danych");
      throw new Error("Nie udało się utworzyć konwersacji");
    }
    
    const conversationId = conversationData[0].conversation_id;
    
    // Dodaj testowe wiadomości
    await supabase.from('direct_messages').insert([
      {
        conversation_id: conversationId,
        sender_id: user.id,
        content: `Witaj ${targetUser.name || 'tam'}! To jest testowa wiadomość.`
      },
      {
        conversation_id: conversationId,
        sender_id: targetUser.id,
        content: 'Cześć! To jest automatyczna odpowiedź testowa.'
      },
      {
        conversation_id: conversationId,
        sender_id: user.id,
        content: 'Jak się dziś masz?'
      }
    ]);
    
    return { conversationId };
    */
  } catch (error) {
    console.error("Błąd podczas tworzenia testowej konwersacji:", error);
    return null;
  }
};
