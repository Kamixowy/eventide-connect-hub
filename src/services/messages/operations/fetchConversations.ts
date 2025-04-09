
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '../types';
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

    let conversationIds: string[] = [];

    // Różna logika pobierania konwersacji w zależności od typu użytkownika
    if (userType === 'organization' && organizationId) {
      // Dla organizacji, pobierz konwersacje, w których organizacja jest uczestnikiem
      const { data: orgParticipations, error: orgPartError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('organization_id', organizationId)
        .eq('is_organization', true);

      if (orgPartError) {
        console.error('Błąd podczas pobierania uczestnictw organizacji w konwersacjach:', orgPartError);
      } else if (orgParticipations) {
        conversationIds = orgParticipations.map(p => p.conversation_id);
      }
      
      // Dodatkowo, wciąż możemy mieć starsze konwersacje powiązane ze współpracami
      const { data: orgCollaborations } = await supabase
        .from('collaborations')
        .select('id')
        .eq('organization_id', organizationId);
        
      if (orgCollaborations && orgCollaborations.length > 0) {
        const collaborationIds = orgCollaborations.map(c => c.id);
        
        const { data: orgConversations } = await supabase
          .from('direct_conversations')
          .select('id')
          .in('collaboration_id', collaborationIds);
        
        if (orgConversations && orgConversations.length > 0) {
          const orgIds = orgConversations.map(c => c.id);
          conversationIds = [...new Set([...conversationIds, ...orgIds])];
        }
      }
    } else {
      // Dla sponsorów, pobierz konwersacje, w których użytkownik jest uczestnikiem
      const { data: participations, error: participationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)
        .eq('is_organization', false);

      if (participationsError) {
        console.error('Błąd podczas pobierania uczestnictw w konwersacjach:', participationsError);
      } else if (participations) {
        conversationIds = participations.map(p => p.conversation_id);
      }
    }

    if (conversationIds.length === 0) {
      console.log('Nie znaleziono konwersacji');
      return [];
    }

    // Pobierz konwersacje
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select('*, collaboration_id')
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
        
        if (conversation.collaboration_id) {
          // Pobierz dane o współpracy
          const { data: collaborationData } = await supabase
            .from('collaborations')
            .select(`
              id, 
              status,
              event_id,
              organization_id,
              sponsor_id,
              events:event_id(
                title
              )
            `)
            .eq('id', conversation.collaboration_id)
            .single();
          
          if (collaborationData) {
            // Ustaw tytuł na podstawie nazwy wydarzenia
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
              // Pobierz dane organizacji oddzielnie
              const { data: organization } = await supabase
                .from('organizations')
                .select('name')
                .eq('id', collaborationData.organization_id)
                .single();
              
              subtitle = organization?.name || 'Organizacja';
            }
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
