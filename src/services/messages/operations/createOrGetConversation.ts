
import { supabase } from '@/integrations/supabase/client';

/**
 * Znajduje lub tworzy konwersację między dwoma użytkownikami
 * Zwraca ID konwersacji
 */
export const createOrGetConversation = async (
  otherUserId: string
): Promise<string | null> => {
  try {
    console.log("Szukanie lub tworzenie konwersacji z użytkownikiem:", otherUserId);
    
    // Pobierz aktualnego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("Użytkownik nie zalogowany");
      throw new Error("Musisz być zalogowany, aby utworzyć konwersację");
    }
    
    // Użyj funkcji bazodanowej do znalezienia lub utworzenia konwersacji
    const { data, error } = await supabase.rpc(
      'create_conversation_and_participants',
      {
        user_one: user.id,
        user_two: otherUserId
      }
    );
    
    if (error) {
      console.error("Błąd podczas tworzenia/wyszukiwania konwersacji:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error("Nie zwrócono ID konwersacji");
      return null;
    }
    
    const conversationId = data[0].conversation_id;
    console.log("Znaleziono lub utworzono konwersację:", conversationId);
    return conversationId;
  } catch (error) {
    console.error("Błąd w createOrGetConversation:", error);
    throw error;
  }
};
