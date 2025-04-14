
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
      try {
        // Najpierw pobierz konwersacje organizacji
        const { data: orgConversations, error: orgError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('organization_id', recipientUserId)
          .eq('is_organization', true);
        
        if (orgError) throw orgError;
        
        if (orgConversations && Array.isArray(orgConversations) && orgConversations.length > 0) {
          // Utwórz tablicę identyfikatorów konwersacji
          const conversationIds = orgConversations.map(item => item.conversation_id);
          
          // Teraz wyszukaj, czy użytkownik jest uczestnikiem którejś z tych konwersacji
          const { data: userConversations, error: userError } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', user.id)
            .eq('is_organization', false)
            .in('conversation_id', conversationIds);
          
          if (userError) throw userError;
          
          if (userConversations && Array.isArray(userConversations) && userConversations.length > 0) {
            conversationId = userConversations[0].conversation_id;
          }
        }
      } catch (err) {
        console.error("Error finding conversation with organization:", err);
      }
    } else {
      // Szukaj konwersacji między dwoma użytkownikami
      try {
        const { data } = await supabase
          .rpc('find_conversation_between_users', { 
            user_one: user.id, 
            user_two: recipientUserId 
          });
        
        if (data && Array.isArray(data) && data.length > 0) {
          conversationId = data[0].conversation_id;
        }
      } catch (err) {
        console.error("Error finding conversation between users:", err);
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
