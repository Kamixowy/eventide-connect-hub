
import { supabase } from '@/integrations/supabase/client';

// Funkcja do rozpoczęcia nowej konwersacji z organizacją
export const startConversation = async (organizationUserId: string, initialMessage: string): Promise<{ conversationId: string } | null> => {
  try {
    console.log('Rozpoczynanie nowej konwersacji z organizacją:', organizationUserId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Użytkownik nie zalogowany');
      throw new Error('Użytkownik nie zalogowany');
    }

    console.log('ID bieżącego użytkownika:', user.id);

    // Sprawdź, czy obaj użytkownicy istnieją
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .in('id', [user.id, organizationUserId]);
      
    if (usersError) {
      console.error('Błąd podczas sprawdzania użytkowników:', usersError);
      throw usersError;
    }
    
    if (!users || users.length !== 2) {
      console.error('Jeden lub obaj użytkownicy nie istnieją');
      throw new Error('Jeden lub obaj użytkownicy nie istnieją');
    }

    // Użyj funkcji create_conversation_and_participants w bazie danych, aby utworzyć konwersację
    // Obsługuje ona znalezienie istniejącej konwersacji lub utworzenie nowej z uczestnikami
    const { data, error } = await supabase.rpc('create_conversation_and_participants', {
      user_one: user.id,
      user_two: organizationUserId
    });
    
    if (error) {
      console.error('Błąd podczas tworzenia konwersacji:', error);
      throw new Error('Nie udało się utworzyć konwersacji: ' + error.message);
    }
    
    if (!data || data.length === 0) {
      console.error('Nie zwrócono ID konwersacji');
      throw new Error('Nie udało się utworzyć konwersacji: Nie zwrócono ID');
    }
    
    const conversationId = data[0].conversation_id;
    console.log('Utworzono lub znaleziono konwersację z ID:', conversationId);
    
    // Wyślij początkową wiadomość, jeśli została podana
    if (initialMessage.trim() && conversationId) {
      console.log('Wysyłanie początkowej wiadomości do konwersacji:', conversationId);
      
      // Wyślij wiadomość bezpośrednio zamiast importowania funkcji sendMessage
      // Zapobiega to potencjalnym problemom z cyklicznymi zależnościami
      const { data: message, error: messageError } = await supabase
        .from('direct_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: initialMessage
        })
        .select('*')
        .single();
      
      if (messageError) {
        console.error('Błąd podczas wysyłania początkowej wiadomości:', messageError);
        // Nie rzucaj tutaj, nadal chcemy zwrócić ID konwersacji
      } else {
        console.log('Początkowa wiadomość wysłana pomyślnie:', message);
      }
      
      // Aktualizuj znacznik czasu konwersacji
      await supabase
        .from('direct_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    }

    return conversationId ? { conversationId } : null;
  } catch (error) {
    console.error('Błąd podczas rozpoczynania konwersacji:', error);
    throw error; // Rzuć ponownie, aby umożliwić lepszą obsługę błędów w UI
  }
};
