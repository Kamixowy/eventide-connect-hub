
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

    // Check if the recipient is an organization
    const { data: orgData } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', organizationUserId)
      .single();

    const isOrganization = !!orgData;

    // Create new conversation
    const { data: conversationData, error: conversationError } = await supabase
      .from('direct_conversations')
      .insert({})
      .select()
      .single();
    
    if (conversationError) {
      console.error('Błąd podczas tworzenia konwersacji:', conversationError);
      throw new Error('Nie udało się utworzyć konwersacji: ' + conversationError.message);
    }
    
    if (!conversationData) {
      console.error('Nie zwrócono ID konwersacji');
      throw new Error('Nie udało się utworzyć konwersacji: Nie zwrócono ID');
    }
    
    const conversationId = conversationData.id;
    console.log('Utworzono konwersację z ID:', conversationId);

    // Add current user as participant
    const { error: userParticipantError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        is_organization: false
      });

    if (userParticipantError) {
      console.error('Błąd podczas dodawania użytkownika jako uczestnika:', userParticipantError);
      throw userParticipantError;
    }

    // Add recipient as participant (either organization or user)
    if (isOrganization) {
      const { error: orgParticipantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          organization_id: organizationUserId,
          is_organization: true,
          user_id: null // Explicitly set user_id to null for organization participants
        });

      if (orgParticipantError) {
        console.error('Błąd podczas dodawania organizacji jako uczestnika:', orgParticipantError);
        throw orgParticipantError;
      }
    } else {
      const { error: recipientParticipantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: organizationUserId,
          is_organization: false
        });

      if (recipientParticipantError) {
        console.error('Błąd podczas dodawania odbiorcy jako uczestnika:', recipientParticipantError);
        throw recipientParticipantError;
      }
    }
    
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
