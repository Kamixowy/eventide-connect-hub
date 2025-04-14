
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

    console.log('Szukanie lub tworzenie konwersacji z użytkownikiem/organizacją:', recipientUserId);

    // Sprawdź czy odbiorca to organizacja
    const { data: organizationData } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', recipientUserId)
      .single();
    
    const isOrganizationRecipient = !!organizationData;
    
    // Sprawdź, czy konwersacja już istnieje
    let conversationId = null;
    
    if (isOrganizationRecipient) {
      // Szukaj konwersacji między użytkownikiem a organizacją
      const { data, error } = await supabase
        .from('direct_conversations')
        .select('id')
        .eq('id', supabase.rpc('find_conversation_with_organization', { 
          p_user_id: user.id, 
          p_organization_id: recipientUserId 
        }))
        .limit(1);
      
      if (!error && data && data.length > 0) {
        conversationId = data[0].id;
      }
    } else {
      // Szukaj konwersacji między dwoma użytkownikami
      const { data, error } = await supabase
        .rpc('find_conversation_between_users', { 
          user_one: user.id, 
          user_two: recipientUserId 
        });
      
      if (!error && data && data.length > 0) {
        conversationId = data[0].conversation_id;
      }
    }
    
    // Jeśli konwersacja nie istnieje, utwórz nową
    if (!conversationId) {
      // Utwórz nową konwersację
      const { data: newConversation, error: conversationError } = await supabase
        .from('direct_conversations')
        .insert({})
        .select()
        .single();
      
      if (conversationError) {
        console.error('Błąd podczas tworzenia konwersacji:', conversationError);
        throw conversationError;
      }
      
      conversationId = newConversation.id;
      
      // Dodaj aktualnego użytkownika jako uczestnika
      const { error: userParticipantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          is_organization: false
        });
      
      if (userParticipantError) {
        console.error('Błąd podczas dodawania uczestnika-użytkownika:', userParticipantError);
      }
      
      // Dodaj odbiorcę jako uczestnika (użytkownik lub organizacja)
      if (isOrganizationRecipient) {
        const { error: orgParticipantError } = await supabase
          .from('conversation_participants')
          .insert({
            conversation_id: conversationId,
            organization_id: recipientUserId,
            is_organization: true,
            user_id: null // Explicitly set user_id to null for organization participants
          });
        
        if (orgParticipantError) {
          console.error('Błąd podczas dodawania uczestnika-organizacji:', orgParticipantError);
        }
      } else {
        const { error: recipientParticipantError } = await supabase
          .from('conversation_participants')
          .insert({
            conversation_id: conversationId,
            user_id: recipientUserId,
            is_organization: false
          });
        
        if (recipientParticipantError) {
          console.error('Błąd podczas dodawania uczestnika-odbiorcy:', recipientParticipantError);
        }
      }
    }

    return conversationId;
  } catch (error) {
    console.error('Błąd w createOrGetConversation:', error);
    throw error;
  }
};
