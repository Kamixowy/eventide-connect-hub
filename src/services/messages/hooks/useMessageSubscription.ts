
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/services/messages/types';
import { useEffect } from 'react';

// Hook do subskrypcji nowych wiadomości w określonej konwersacji
export const useMessageSubscription = (
  conversationId: string | null,
  onNewMessage: (message: Message) => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user || !conversationId) {
      console.log('Brak użytkownika lub ID konwersacji, pomijanie subskrypcji wiadomości');
      return () => {};
    }

    console.log('Konfigurowanie subskrypcji wiadomości w konwersacji:', conversationId);
    
    // Subskrybuj tabelę direct_messages dla nowych wiadomości w tej konwersacji
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Wykryto nową wiadomość:', payload);
          
          if (payload.new) {
            const newMessage = payload.new as Message;
            console.log('Przetwarzanie nowej wiadomości:', newMessage);
            // Upewnij się, że przekazujesz wiadomość do callbacka
            onNewMessage(newMessage);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Status subskrypcji wiadomości dla konwersacji ${conversationId}:`, status);
      });

    console.log('Subskrypcja wiadomości skonfigurowana pomyślnie dla konwersacji:', conversationId);

    // Wyczyść subskrypcję przy odmontowaniu
    return () => {
      console.log('Czyszczenie subskrypcji wiadomości dla konwersacji:', conversationId);
      channel.unsubscribe();
    };
  }, [user, conversationId, onNewMessage]);

  return { 
    subscription: (user && conversationId) 
      ? supabase.channel(`messages-${conversationId}`) 
      : null 
  };
};
