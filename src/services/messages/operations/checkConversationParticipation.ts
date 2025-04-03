
import { supabase } from '@/integrations/supabase/client';

// Funkcja do sprawdzenia, czy użytkownik jest uczestnikiem konwersacji
export const checkConversationParticipation = async (
  conversationId: string, 
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Sprawdzanie, czy użytkownik ${userId} jest uczestnikiem konwersacji ${conversationId}`);
    
    // Bezpośrednie sprawdzenie w tabeli uczestników
    const { data, error } = await supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Błąd podczas sprawdzania uczestnictwa w konwersacji:', error);
      return false;
    }
    
    const isParticipant = !!data;
    console.log(`Użytkownik ${userId} ${isParticipant ? 'jest' : 'nie jest'} uczestnikiem konwersacji ${conversationId}`);
    
    return isParticipant;
  } catch (error) {
    console.error('Wyjątek podczas sprawdzania uczestnictwa w konwersacji:', error);
    return false;
  }
};
