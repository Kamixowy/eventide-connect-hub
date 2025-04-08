
import { supabase } from '@/integrations/supabase/client';
import { Conversation, ConversationParticipant } from '../types';
import { enhanceParticipantsWithProfiles, getUnreadCount, getLastMessage } from '../utils/conversationUtils';

/**
 * Pobiera wszystkie konwersacje dla zalogowanego użytkownika
 * 
 * @param userType - Typ użytkownika (organizacja lub sponsor)
 * @param organizationId - ID organizacji (jeśli userType to 'organization')
 */
export const fetchConversations = async (
  userType?: string,
  organizationId?: string
): Promise<Conversation[]> => {
  try {
    // Sprawdź czy mamy zalogowanego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Brak zalogowanego użytkownika');
      return [];
    }

    console.log('Pobieranie konwersacji dla użytkownika:', user.id);
    console.log('Typ użytkownika:', userType);
    console.log('ID organizacji:', organizationId);

    // Pobierz ID konwersacji, w których użytkownik jest uczestnikiem
    const { data: participations, error: participationsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (participationsError) {
      console.error('Błąd podczas pobierania uczestnictw w konwersacjach:', participationsError);
      return [];
    }

    // Jeśli użytkownik jest organizacją, pobierz również konwersacje powiązane z organizacją
    let conversationIds: string[] = participations?.map(p => p.conversation_id) || [];
    
    if (userType === 'organization' && organizationId) {
      // Fix: First fetch collaboration IDs associated with this organization
      const { data: orgCollaborations } = await supabase
        .from('collaborations')
        .select('id')
        .eq('organization_id', organizationId);
        
      if (orgCollaborations && orgCollaborations.length > 0) {
        const collaborationIds = orgCollaborations.map(c => c.id);
        
        // Then fetch conversations linked to those collaborations
        const { data: orgConversations } = await supabase
          .from('direct_conversations')
          .select('id')
          .in('collaboration_id', collaborationIds);
        
        if (orgConversations && orgConversations.length > 0) {
          // Add these conversation IDs to the list
          const orgIds = orgConversations.map(c => c.id);
          conversationIds = [...new Set([...conversationIds, ...orgIds])];
        }
      }
    }

    if (conversationIds.length === 0) {
      console.log('Nie znaleziono konwersacji');
      return [];
    }

    // Pobierz konwersacje
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select(`
        *,
        collaboration:collaboration_id(
          id, 
          status,
          event_id,
          organization_id,
          sponsor_id,
          events:event_id(
            title
          ),
          organization:organization_id(
            name
          )
        )
      `)
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      console.error('Błąd podczas pobierania konwersacji:', conversationsError);
      return [];
    }

    // Wzbogacone konwersacje z uczestnikami, ostatnimi wiadomościami i nieprzeczytanymi
    const enhancedConversations = await Promise.all(
      (conversations || []).map(async (conversation) => {
        // Guard against null or undefined conversation data
        if (!conversation) return null;
        
        // Pobierz uczestników dla tej konwersacji
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('*')
          .eq('conversation_id', conversation.id);

        if (participantsError) {
          console.error(`Błąd podczas pobierania uczestników konwersacji ${conversation.id}:`, participantsError);
          return null;
        }

        // Wzbogać uczestników o profile i organizacje
        const enhancedParticipants = await enhanceParticipantsWithProfiles(participants || [], supabase);

        // Pobierz ostatnią wiadomość
        const lastMessage = await getLastMessage(conversation.id, supabase);

        // Pobierz liczbę nieprzeczytanych wiadomości
        const unreadCount = await getUnreadCount(conversation.id, user.id, supabase);

        // Jeśli to konwersacja dotycząca współpracy, dodaj tytuł na podstawie wydarzenia
        let title = '';
        let subtitle = '';
        
        if (conversation.collaboration) {
          // Handle potential undefined values safely
          const collaborationData = conversation.collaboration;
          title = collaborationData.events?.title || 'Współpraca';
          
          if (userType === 'organization') {
            // Znajdź nazwę sponsora
            const { data: sponsor } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', collaborationData.sponsor_id)
              .single();
            
            subtitle = sponsor?.name || 'Sponsor';
          } else {
            // Nazwa organizacji
            subtitle = collaborationData.organization?.name || 'Organizacja';
          }
        }

        return {
          ...conversation,
          participants: enhancedParticipants,
          lastMessage,
          unreadCount,
          title,
          subtitle
        } as Conversation;
      })
    );

    // Przefiltruj null (jeśli jakieś wystąpiły podczas błędów)
    return enhancedConversations.filter(Boolean) as Conversation[];
  } catch (error) {
    console.error('Błąd w fetchConversations:', error);
    return [];
  }
};
