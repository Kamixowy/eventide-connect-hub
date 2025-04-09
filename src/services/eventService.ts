
import { supabase } from '@/lib/supabase';
import { EventFormValues, SponsorshipOption } from '@/components/events/edit/EventEditSchema';

export const fetchEventById = async (id: string) => {
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*, organizations(id, user_id)')
    .eq('id', id)
    .single();
    
  if (eventError) {
    throw eventError;
  }
  
  // Fetch sponsorship options for the event
  const { data: sponsorshipData, error: sponsorshipError } = await supabase
    .from('sponsorship_options')
    .select('*')
    .eq('event_id', id);
    
  if (sponsorshipError) {
    console.error('Error fetching sponsorship options:', sponsorshipError);
  }
  
  // Fetch event posts using the "from" method with the any type to bypass type checking
  const { data: postsData, error: postsError } = await supabase
    .from('event_posts')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false });
    
  if (postsError) {
    console.error('Error fetching event posts:', postsError);
  }
  
  // Add sponsorship options and posts to the event data
  const fullEventData = {
    ...eventData,
    sponsorshipOptions: sponsorshipData || [],
    posts: postsData || []
  };
  
  return fullEventData;
};

// Add function to update event status
export const updateEventStatus = async (eventId: string, newStatus: string) => {
  const { error } = await supabase
    .from('events')
    .update({ status: newStatus })
    .eq('id', eventId);
    
  if (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
  
  return true;
};

// Add event post functions
export const addEventPost = async (eventId: string, title: string, content: string) => {
  const { data, error } = await supabase
    .from('event_posts')
    .insert([
      { event_id: eventId, title, content }
    ])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding event post:', error);
    throw error;
  }
  
  return data;
};

export const deleteEventPost = async (postId: string) => {
  const { error } = await supabase
    .from('event_posts')
    .delete()
    .eq('id', postId);
    
  if (error) {
    console.error('Error deleting event post:', error);
    throw error;
  }
  
  return true;
};

// Add function to delete an event
export const deleteEvent = async (eventId: string) => {
  try {
    // First delete all sponsorship options
    const { error: sponsorshipError } = await supabase
      .from('sponsorship_options')
      .delete()
      .eq('event_id', eventId);
      
    if (sponsorshipError) {
      console.error('Error deleting sponsorship options:', sponsorshipError);
      throw sponsorshipError;
    }
    
    // Then delete all event posts
    const { error: postsError } = await supabase
      .from('event_posts')
      .delete()
      .eq('event_id', eventId);
      
    if (postsError) {
      console.error('Error deleting event posts:', postsError);
      throw postsError;
    }
    
    // Finally delete the event
    const { error: eventError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
      
    if (eventError) {
      console.error('Error deleting event:', eventError);
      throw eventError;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    throw error;
  }
};

// Update event with sponsorship options
export const updateEvent = async (
  eventId: string, 
  data: EventFormValues, 
  imageUrl: string | null,
  sponsorshipOptions: SponsorshipOption[]
) => {
  // Prepare social media data
  const socialMedia = {
    facebook: data.facebook || '',
    instagram: data.instagram || '',
    linkedin: data.linkedin || '',
  };
  
  // Format audience and tags fields (if they are comma-separated strings)
  const audience = typeof data.audience === 'string' 
    ? data.audience.split(',').map(item => item.trim()).filter(Boolean)
    : data.audience || [];
    
  const tags = typeof data.tags === 'string'
    ? data.tags.split(',').map(item => item.trim()).filter(Boolean)
    : data.tags || [];
  
  // Convert expected_participants to number
  const expectedParticipants = data.expected_participants 
    ? parseInt(data.expected_participants, 10) 
    : null;
  
  // Update event
  const { error: eventError } = await supabase
    .from('events')
    .update({
      title: data.title,
      description: data.description,
      start_date: data.start_date instanceof Date ? data.start_date.toISOString() : data.start_date,
      end_date: data.end_date ? (data.end_date instanceof Date ? data.end_date.toISOString() : data.end_date) : null,
      location: data.location,
      detailed_location: data.detailed_location,
      expected_participants: expectedParticipants,
      category: data.category,
      audience: audience,
      tags: tags,
      image_url: imageUrl,
      social_media: socialMedia,
      status: data.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId);
  
  if (eventError) {
    console.error('Error updating event:', eventError);
    throw eventError;
  }
  
  // Handle sponsorship options
  // First delete existing options
  const { error: deleteError } = await supabase
    .from('sponsorship_options')
    .delete()
    .eq('event_id', eventId);
  
  if (deleteError) {
    console.error('Error deleting sponsorship options:', deleteError);
    throw deleteError;
  }
  
  // Add new sponsorship options if any
  if (sponsorshipOptions && sponsorshipOptions.length > 0) {
    const sponsorshipData = sponsorshipOptions.map(option => ({
      event_id: eventId,
      title: option.title,
      description: option.description,
      price: parseFloat(option.priceFrom) || 0,
      price_to: parseFloat(option.priceTo) || 0,
      benefits: option.benefits
    }));
    
    const { error: insertError } = await supabase
      .from('sponsorship_options')
      .insert(sponsorshipData);
    
    if (insertError) {
      console.error('Error adding sponsorship options:', insertError);
      throw insertError;
    }
  }
  
  return true;
};
