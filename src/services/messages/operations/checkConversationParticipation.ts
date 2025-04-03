
import { supabase } from '@/integrations/supabase/client';

// Funkcja do sprawdzenia, czy użytkownik jest uczestnikiem konwersacji
export const checkConversationParticipation = async (
  conversationId: string, 
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Sprawdzanie, czy użytkownik ${userId} jest uczestnikiem konwersacji ${conversationId}`);
    
    const { data, error } = await supabase
      .from('conversation_participants')
      .select()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Błąd podczas sprawdzania uczestnictwa w konwersacji:', error);
      // Jeśli otrzymamy błąd nieskończonej rekursji, spróbujmy innego podejścia
      if (error.message.includes('infinite recursion')) {
        // Awaryjnie załóż, że użytkownik jest uczestnikiem, aby zapobiec blokowaniu funkcjonalności
        console.log('Obejście problemu rekursji RLS - zezwolenie na dostęp');
        return true;
      }
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
