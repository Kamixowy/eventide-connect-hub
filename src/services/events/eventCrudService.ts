
import { supabase } from '@/lib/supabase';
import { EventFormValues, SponsorshipOption } from '@/components/events/edit/EventEditSchema';

export const updateEvent = async (
  eventId: string, 
  data: EventFormValues, 
  imageUrl: string | null,
  sponsorshipOptions: SponsorshipOption[]
) => {
  const socialMedia = {
    facebook: data.facebook || '',
    instagram: data.instagram || '',
    linkedin: data.linkedin || '',
  };
  
  const audience = typeof data.audience === 'string' 
    ? data.audience.split(',').map(item => item.trim()).filter(Boolean)
    : data.audience || [];
    
  const tags = typeof data.tags === 'string'
    ? data.tags.split(',').map(item => item.trim()).filter(Boolean)
    : data.tags || [];
  
  const expectedParticipants = data.expected_participants 
    ? parseInt(data.expected_participants, 10) 
    : null;
  
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
  
  const { error: deleteError } = await supabase
    .from('sponsorship_options')
    .delete()
    .eq('event_id', eventId);
  
  if (deleteError) {
    console.error('Error deleting sponsorship options:', deleteError);
    throw deleteError;
  }
  
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

export const deleteEvent = async (eventId: string) => {
  try {
    const { error: sponsorshipError } = await supabase
      .from('sponsorship_options')
      .delete()
      .eq('event_id', eventId);
      
    if (sponsorshipError) {
      console.error('Error deleting sponsorship options:', sponsorshipError);
      throw sponsorshipError;
    }
    
    const { error: postsError } = await supabase
      .from('event_posts')
      .delete()
      .eq('event_id', eventId);
      
    if (postsError) {
      console.error('Error deleting event posts:', postsError);
      throw postsError;
    }
    
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
