
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

// Hook do subskrypcji aktualizacji konwersacji (nowe konwersacje, nowe wiadomości)
export const useConversationsSubscription = (
  onUpdate: () => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) {
      console.log('Brak użytkownika, pomijanie subskrypcji konwersacji');
      return () => {};
    }

    console.log('Konfigurowanie subskrypcji dla aktualizacji konwersacji');
    
    // Subskrybuj tabele direct_conversations i direct_messages
    const channel = supabase
      .channel('conversation_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_conversations'
        },
        (payload) => {
          console.log('Wykryto zmianę tabeli konwersacji:', payload);
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          console.log('Wykryto nową wiadomość:', payload);
          
          if (payload.new && payload.new.sender_id !== user.id) {
            // Pokaż powiadomienie toast dla nowych wiadomości
            toast({
              title: "Nowa wiadomość",
              description: "Otrzymałeś nową wiadomość",
              duration: 3000,
            });
            onUpdate();
          } else {
            onUpdate();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Dodano do nowej konwersacji:', payload);
          onUpdate();
        }
      )
      .subscribe();

    console.log('Subskrypcja konwersacji skonfigurowana pomyślnie');

    // Wyczyść subskrypcję przy odmontowaniu
    return () => {
      console.log('Czyszczenie subskrypcji konwersacji');
      channel.unsubscribe();
    };
  }, [user, onUpdate, toast]);

  return { 
    subscription: user ? 
      supabase.channel('conversation_updates') : 
      null 
  };
};
