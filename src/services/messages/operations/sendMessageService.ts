
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';
import { createOrGetConversation } from './createOrGetConversation';

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
    
    // Utwórz lub pobierz konwersację
    const conversationId = await createOrGetConversation(targetUser.id);
    
    if (!conversationId) {
      throw new Error("Nie udało się utworzyć konwersacji");
    }
    
    // Dodaj testowe wiadomości bezpośrednio jako wpisy w tabeli
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
  } catch (error) {
    console.error("Błąd podczas tworzenia testowej konwersacji:", error);
    return null;
  }
};
