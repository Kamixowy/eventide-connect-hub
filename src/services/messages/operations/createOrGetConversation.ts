
import { supabase } from '@/integrations/supabase/client';

/**
 * Tworzy nową konwersację lub zwraca ID istniejącej
 */
export const createOrGetConversation = async (recipientUserId: string): Promise<string | null> => {
  try {
    // Sprawdź czy mamy zalogowanego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Musisz być zalogowany, aby utworzyć konwersację');
    }

    console.log('Szukanie lub tworzenie konwersacji z użytkownikiem:', recipientUserId);

    // Użyj funkcji Supabase do utworzenia lub pobrania konwersacji
    const { data, error } = await supabase.rpc(
      'create_conversation_and_participants',
      { user_one: user.id, user_two: recipientUserId }
    );

    if (error) {
      console.error('Błąd podczas tworzenia konwersacji:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('Nie otrzymano ID konwersacji');
      return null;
    }

    console.log('Znaleziono lub utworzono konwersację:', data[0].conversation_id);
    return data[0].conversation_id;
  } catch (error) {
    console.error('Błąd w createOrGetConversation:', error);
    throw error;
  }
};
