
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Message } from '../types';

export const useMessageSubscription = (
  conversationId: string | null,
  handleNewMessage: (message: Message) => void
) => {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!conversationId) {
      console.log('Brak użytkownika lub ID konwersacji, pomijanie subskrypcji wiadomości');
      return;
    }

    console.log('Konfigurowanie subskrypcji wiadomości dla konwersacji:', conversationId);

    const messageChannel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        console.log('Odebrano nową wiadomość:', payload);
        const newMessage = payload.new as Message;
        handleNewMessage(newMessage);
      })
      .subscribe((status) => {
        console.log('Status subskrypcji wiadomości:', status);
      });

    setSubscription(messageChannel);

    return () => {
      console.log('Czyszczenie subskrypcji wiadomości');
      supabase.removeChannel(messageChannel);
    };
  }, [conversationId, handleNewMessage]);

  return { subscription };
};
