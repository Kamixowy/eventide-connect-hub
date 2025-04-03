
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Hook to subscribe to conversation updates (new conversations, new messages)
export const useConversationsSubscription = (
  onUpdate: () => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  if (!user) {
    return { subscription: null };
  }

  // Subscribe to direct_conversations and direct_messages tables
  const channel = supabase
    .channel('conversation_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'direct_conversations'
      },
      () => {
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
        if (payload.new && payload.new.sender_id !== user.id) {
          // Show a toast notification for new messages
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
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return { subscription: channel };
};
