
import { supabase } from '@/lib/supabase';
import { CollaborationDetailsResponse } from './types';

/**
 * Subscribe to real-time changes for a specific collaboration
 * 
 * @param id - Collaboration ID to subscribe to
 * @param callback - Function to run when collaboration changes
 * @returns Subscription that can be used to unsubscribe
 */
export const subscribeToCollaboration = (
  id: string,
  callback: (payload: { new: CollaborationDetailsResponse; old: CollaborationDetailsResponse }) => void
) => {
  const channel = supabase
    .channel(`collaboration:${id}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'collaborations',
        filter: `id=eq.${id}`,
      },
      (payload) => {
        console.log('Collaboration updated:', payload);
        callback(payload as any);
      }
    )
    .subscribe((status) => {
      console.log('Collaboration subscription status:', status);
    });

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    },
  };
};

/**
 * Subscribe to all collaboration changes for the current user
 * 
 * @param userType - Type of user (organization or sponsor)
 * @param userId - User ID to filter collaborations
 * @param callback - Function to run when collaborations change
 * @returns Subscription that can be used to unsubscribe
 */
export const subscribeToUserCollaborations = (
  userType: 'organization' | 'sponsor',
  userId: string,
  callback: (payload: any) => void
) => {
  // Determine filter based on user type
  const filter = userType === 'organization'
    ? `organization_id=eq.${userId}`
    : `sponsor_id=eq.${userId}`;

  const channel = supabase
    .channel(`user-collaborations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'collaborations',
        filter,
      },
      (payload) => {
        console.log('User collaborations changed:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('User collaborations subscription status:', status);
    });

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    },
  };
};
