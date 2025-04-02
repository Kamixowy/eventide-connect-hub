
import { supabase } from '@/lib/supabase';
import { EventCreateValues } from '@/components/events/create/EventCreateSchema';
import { SponsorshipOption } from '@/components/events/create/EventCreateSchema';

export const createEvent = async (
  data: EventCreateValues,
  organizationId: string,
  imageUrl: string | null,
  sponsorshipOptions: SponsorshipOption[]
) => {
  // Prepare location
  const location = `${data.city}, ${data.voivodeship}`;
  
  // Prepare social media links
  const socialMedia = {
    facebook: data.facebook || '',
    linkedin: data.linkedin || '',
    instagram: data.instagram || '',
  };
  
  // Create event payload
  const eventPayload = {
    title: data.title,
    category: data.category,
    description: data.description,
    start_date: data.start_date.toISOString(),
    end_date: data.end_date ? data.end_date.toISOString() : null,
    location,
    detailed_location: data.detailed_location || null,
    expected_participants: data.expected_participants ? parseInt(data.expected_participants) : null,
    organization_id: organizationId,
    audience: data.audience || [],
    tags: data.tags || [],
    image_url: imageUrl,
    social_media: socialMedia
  };

  // Create event in database
  const { data: eventResult, error: eventError } = await supabase
    .from('events')
    .insert(eventPayload)
    .select('id')
    .single();

  if (eventError) {
    throw eventError;
  }

  // Add sponsorship options if any exists
  if (sponsorshipOptions.length > 0) {
    const sponsorshipData = sponsorshipOptions
      .filter(option => option.title.trim() !== '')
      .map(option => ({
        title: option.title,
        description: option.description,
        price: parseFloat(option.priceFrom) || 0,
        event_id: eventResult.id
      }));

    if (sponsorshipData.length > 0) {
      const { error: sponsorshipError } = await supabase
        .from('sponsorship_options')
        .insert(sponsorshipData);

      if (sponsorshipError) {
        console.error('Error creating sponsorship options:', sponsorshipError);
        // We continue despite sponsorship errors since the event was created
      }
    }
  }

  return eventResult.id;
};

export const getOrganizationByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const uploadEventBanner = async (file: File): Promise<string | null> => {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `event-banners/${fileName}`;

  // Upload to events bucket
  const { error: uploadError } = await supabase.storage
    .from('events')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from('events')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};
