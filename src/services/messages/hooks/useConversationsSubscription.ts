
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

export const useConversationsSubscription = (
  handleConversationUpdate: () => void
) => {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log('Brak zalogowanego użytkownika, pomijanie subskrypcji konwersacji');
      return;
    }

    console.log('Konfigurowanie subskrypcji dla aktualizacji konwersacji');

    const conversationsChannel = supabase
      .channel('conversations-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'direct_conversations'
      }, () => {
        console.log('Wykryto zmianę w konwersacjach');
        handleConversationUpdate();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      }, () => {
        console.log('Wykryto nową wiadomość');
        handleConversationUpdate();
      })
      .subscribe((status) => {
        console.log('Status subskrypcji konwersacji:', status);
      });

    setSubscription(conversationsChannel);
    console.log('Subskrypcja konwersacji skonfigurowana pomyślnie');

    return () => {
      console.log('Czyszczenie subskrypcji konwersacji');
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, handleConversationUpdate]);

  return { subscription };
};
