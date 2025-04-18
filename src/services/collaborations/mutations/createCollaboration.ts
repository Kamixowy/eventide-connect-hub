
import { supabase } from '@/lib/supabase';
import { CollaborationOption } from '../types';

export const createCollaboration = async (
  sponsorId: string,
  organizationId: string,
  totalAmount: number,
  selectedOptions: CollaborationOption[],
  selectedEventIds: string[]
) => {
  try {
    // Start a Postgres transaction
    const { data: collaboration, error: collaborationError } = await supabase
      .from('collaborations')
      .insert({
        sponsor_id: sponsorId,
        organization_id: organizationId,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (collaborationError) {
      throw collaborationError;
    }

    // Link selected events to the collaboration
    const eventLinks = selectedEventIds.map(eventId => ({
      collaboration_id: collaboration.id,
      event_id: eventId
    }));

    const { error: eventsError } = await supabase
      .from('collaboration_events')
      .insert(eventLinks);

    if (eventsError) {
      throw eventsError;
    }

    // Create collaboration options
    const collaborationOptions = selectedOptions.map(option => ({
      collaboration_id: collaboration.id,
      title: option.title,
      description: option.description,
      amount: option.amount,
      is_custom: option.is_custom,
      sponsorship_option_id: option.sponsorship_option_id
    }));

    const { error: optionsError } = await supabase
      .from('collaboration_options')
      .insert(collaborationOptions);

    if (optionsError) {
      throw optionsError;
    }

    return collaboration.id;
  } catch (error) {
    console.error('Error creating collaboration:', error);
    throw error;
  }
};
