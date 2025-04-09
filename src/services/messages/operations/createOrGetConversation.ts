
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
    
    // Sprawdź czy aktualny użytkownik jest już uczestnikiem konwersacji
    const { count: userParticipantCount, error: countUserError } = await supabase
      .from('conversation_participants')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', data[0].conversation_id)
      .eq('user_id', user.id);
    
    if (countUserError) {
      console.error('Błąd podczas sprawdzania uczestnictwa użytkownika:', countUserError);
    } else if (userParticipantCount === 0) {
      console.log('Dodawanie użytkownika jako uczestnika...');
      
      // Sprawdź czy użytkownik istnieje w bazie auth.users
      const { data: authUserData, error: authUserError } = await supabase.auth.getUser(user.id);
      
      if (!authUserError && authUserData.user) {
        const { error: insertError } = await supabase
          .from('conversation_participants')
          .insert({
            conversation_id: data[0].conversation_id,
            user_id: user.id,
            is_organization: false
          });
        
        if (insertError) {
          console.error('Błąd podczas dodawania uczestnika-użytkownika:', insertError);
        }
      } else {
        console.error('Użytkownik nie istnieje w bazie auth.users:', authUserError);
      }
    }
    
    // Sprawdź czy organizacja jest już uczestnikiem konwersacji
    if (isOrganizationRecipient) {
      const { count: orgParticipantCount, error: countOrgError } = await supabase
        .from('conversation_participants')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', data[0].conversation_id)
        .eq('organization_id', recipientUserId);
      
      if (countOrgError) {
        console.error('Błąd podczas sprawdzania uczestnictwa organizacji:', countOrgError);
      } else if (orgParticipantCount === 0) {
        console.log('Dodawanie organizacji jako uczestnika...');
        const { error: insertError } = await supabase
          .from('conversation_participants')
          .insert({
            conversation_id: data[0].conversation_id,
            organization_id: recipientUserId,
            is_organization: true,
            user_id: null // Explicitly set user_id to null for organization participants
          });
        
        if (insertError) {
          console.error('Błąd podczas dodawania uczestnika-organizacji:', insertError);
        }
      }
    }

    return data[0].conversation_id;
  } catch (error) {
    console.error('Błąd w createOrGetConversation:', error);
    throw error;
  }
};
