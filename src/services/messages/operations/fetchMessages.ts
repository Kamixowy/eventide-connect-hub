
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';

/**
 * Pobiera wiadomości dla określonej konwersacji
 */
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Użytkownik nie zalogowany');

    console.log('Pobieranie wiadomości dla konwersacji:', conversationId);

    // Najpierw oznacz nieprzeczytane wiadomości jako przeczytane
    try {
      await supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });
      console.log('Oznaczono wiadomości jako przeczytane');
    } catch (error) {
      console.error('Błąd podczas oznaczania wiadomości jako przeczytane:', error);
      // Kontynuuj wykonanie nawet jeśli oznaczanie wiadomości nie powiodło się
    }

    // Pobierz wiadomości bez próby łączenia z profilami
    const { data: messages, error } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Błąd podczas pobierania wiadomości:', error);
      throw error;
    }

    console.log(`Pobrano ${messages?.length || 0} wiadomości`);
    return messages || [];
  } catch (error) {
    console.error('Błąd w fetchMessages:', error);
    throw error;
  }
};
