
/**
 * Formats the raw event data from the database into a structure used by the UI
 */
export const formatEventData = (eventData: any, sponsorshipData: any[] | null, postsData: any[] | null, demoSponsorshipOptions: any[]) => {
  return {
    id: eventData.id,
    title: eventData.title,
    organization: {
      id: eventData.organizations?.id || 'unknown',
      name: eventData.organizations?.name || 'Nieznana organizacja',
      avatar: eventData.organizations?.logo_url || null,
      userId: eventData.organizations?.user_id
    },
    date: new Date(eventData.start_date).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    start_date: eventData.start_date,
    end_date: eventData.end_date,
    location: eventData.location || 'Lokalizacja nieznana',
    detailed_location: eventData.detailed_location,
    attendees: eventData.expected_participants || 0,
    category: eventData.category || 'Inne',
    status: eventData.status || 'Planowane',
    description: eventData.description,
    banner: eventData.image_url,
    audience: eventData.audience || [],
    tags: eventData.tags || [],
    socialMedia: eventData.social_media || {},
    sponsorshipOptions: sponsorshipData ? sponsorshipData.map((option: any) => ({
      id: option.id,
      title: option.title,
      description: option.description,
      price: { 
        from: option.price, 
        to: option.price_to || option.price 
      },
      benefits: option.benefits || []
    })) : demoSponsorshipOptions,
    posts: postsData || [],
    updates: []
  };
};
