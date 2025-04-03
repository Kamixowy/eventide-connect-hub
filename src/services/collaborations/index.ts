
import { supabase } from '@/lib/supabase';
import type { CollaborationType } from '@/types/collaboration';

export interface NewCollaboration {
  sponsor_id: string;
  organization_id: string;
  status: string;
  message?: string;
  total_amount: number;
}

export interface CollaborationOption {
  title: string;
  description?: string;
  amount: number;
  is_custom: boolean;
  sponsorship_option_id?: string;
}

// Pobranie wszystkich współprac użytkownika (jako sponsor lub organizacja)
export const fetchUserCollaborations = async (): Promise<CollaborationType[]> => {
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('Użytkownik nie jest zalogowany');
  }
  
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', userProfile.user.id)
    .single();
    
  if (profileError) {
    throw new Error(`Błąd podczas pobierania typu użytkownika: ${profileError.message}`);
  }
  
  let collaborationsQuery;
  
  if (profileData.user_type === 'organization') {
    // Dla organizacji pobieramy współprace skierowane do ich organizacji
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('user_id', userProfile.user.id);
      
    if (orgError) {
      throw new Error(`Błąd podczas pobierania organizacji: ${orgError.message}`);
    }
    
    if (!organizations.length) {
      throw new Error('Nie znaleziono organizacji dla tego użytkownika');
    }
    
    const orgIds = organizations.map(org => org.id);
    
    collaborationsQuery = supabase
      .from('collaborations')
      .select(`
        *,
        events:collaboration_events(event:events(*)),
        options:collaboration_options(*),
        sponsor:profiles!collaborations_sponsor_id_fkey(*)
      `)
      .in('organization_id', orgIds);
  } else {
    // Dla sponsorów pobieramy współprace, które oni stworzyli
    collaborationsQuery = supabase
      .from('collaborations')
      .select(`
        *,
        events:collaboration_events(event:events(*)),
        options:collaboration_options(*),
        organization:organizations(*)
      `)
      .eq('sponsor_id', userProfile.user.id);
  }
  
  const { data, error } = await collaborationsQuery;
  
  if (error) {
    throw new Error(`Błąd podczas pobierania współprac: ${error.message}`);
  }
  
  return transformCollaborationsData(data, profileData.user_type);
};

// Pobranie pojedynczej współpracy po ID
export const fetchCollaborationById = async (id: string): Promise<CollaborationType> => {
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('Użytkownik nie jest zalogowany');
  }
  
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', userProfile.user.id)
    .single();
    
  if (profileError) {
    throw new Error(`Błąd podczas pobierania typu użytkownika: ${profileError.message}`);
  }
  
  let query;
  
  if (profileData.user_type === 'organization') {
    query = supabase
      .from('collaborations')
      .select(`
        *,
        events:collaboration_events(event:events(*)),
        options:collaboration_options(*),
        sponsor:profiles!collaborations_sponsor_id_fkey(*)
      `)
      .eq('id', id)
      .single();
  } else {
    query = supabase
      .from('collaborations')
      .select(`
        *,
        events:collaboration_events(event:events(*)),
        options:collaboration_options(*),
        organization:organizations(*)
      `)
      .eq('id', id)
      .single();
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Błąd podczas pobierania współpracy: ${error.message}`);
  }
  
  const collaborations = transformCollaborationsData([data], profileData.user_type);
  return collaborations[0];
};

// Tworzenie nowej współpracy
export const createCollaboration = async (
  collaboration: NewCollaboration,
  collaborationOptions: CollaborationOption[],
  eventIds: string[] = []
): Promise<string> => {
  // Rozpocznij transakcję
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('Użytkownik nie jest zalogowany');
  }
  
  try {
    console.log("Tworzenie współpracy z danymi:", collaboration);
    
    // 1. Dodaj współpracę
    const { data: collabData, error: collabError } = await supabase
      .from('collaborations')
      .insert({
        sponsor_id: userProfile.user.id, // Zawsze używamy zalogowanego użytkownika jako sponsora
        organization_id: collaboration.organization_id,
        status: collaboration.status,
        message: collaboration.message,
        total_amount: collaboration.total_amount
      })
      .select('id')
      .single();
      
    if (collabError) {
      throw new Error(`Błąd podczas tworzenia współpracy: ${collabError.message}`);
    }
    
    const collaborationId = collabData.id;
    console.log("Utworzono współpracę z ID:", collaborationId);
    
    // 2. Dodaj opcje współpracy
    if (collaborationOptions.length > 0) {
      const optionsToInsert = collaborationOptions.map(option => ({
        collaboration_id: collaborationId,
        title: option.title,
        description: option.description,
        amount: option.amount,
        is_custom: option.is_custom,
        sponsorship_option_id: option.sponsorship_option_id
      }));
      
      console.log("Dodawanie opcji współpracy:", optionsToInsert);
      
      const { error: optionsError } = await supabase
        .from('collaboration_options')
        .insert(optionsToInsert);
        
      if (optionsError) {
        throw new Error(`Błąd podczas dodawania opcji współpracy: ${optionsError.message}`);
      }
    }
    
    // 3. Dodaj powiązania z wydarzeniami
    if (eventIds.length > 0) {
      const eventsToInsert = eventIds.map(eventId => ({
        collaboration_id: collaborationId,
        event_id: eventId
      }));
      
      console.log("Dodawanie powiązań z wydarzeniami:", eventsToInsert);
      
      const { error: eventsError } = await supabase
        .from('collaboration_events')
        .insert(eventsToInsert);
        
      if (eventsError) {
        throw new Error(`Błąd podczas dodawania powiązań z wydarzeniami: ${eventsError.message}`);
      }
    }
    
    return collaborationId;
  } catch (error: any) {
    console.error('Błąd podczas tworzenia współpracy:', error);
    throw error;
  }
};

// Aktualizacja statusu współpracy
export const updateCollaborationStatus = async (
  collaborationId: string, 
  newStatus: string
): Promise<void> => {
  const { error } = await supabase
    .from('collaborations')
    .update({ status: newStatus })
    .eq('id', collaborationId);
    
  if (error) {
    throw new Error(`Błąd podczas aktualizacji statusu współpracy: ${error.message}`);
  }
};

// Dodanie opcji współpracy
export const addCollaborationOption = async (
  collaborationId: string,
  option: CollaborationOption
): Promise<void> => {
  const { error } = await supabase
    .from('collaboration_options')
    .insert({
      collaboration_id: collaborationId,
      title: option.title,
      description: option.description,
      amount: option.amount,
      is_custom: option.is_custom,
      sponsorship_option_id: option.sponsorship_option_id
    });
    
  if (error) {
    throw new Error(`Błąd podczas dodawania opcji współpracy: ${error.message}`);
  }
};

// Aktualizacja opcji współpracy
export const updateCollaborationOption = async (
  optionId: string,
  option: Partial<CollaborationOption>
): Promise<void> => {
  const { error } = await supabase
    .from('collaboration_options')
    .update({
      title: option.title,
      description: option.description,
      amount: option.amount
    })
    .eq('id', optionId);
    
  if (error) {
    throw new Error(`Błąd podczas aktualizacji opcji współpracy: ${error.message}`);
  }
};

// Usunięcie opcji współpracy
export const deleteCollaborationOption = async (optionId: string): Promise<void> => {
  const { error } = await supabase
    .from('collaboration_options')
    .delete()
    .eq('id', optionId);
    
  if (error) {
    throw new Error(`Błąd podczas usuwania opcji współpracy: ${error.message}`);
  }
};

// Dodanie wiadomości do współpracy
export const addCollaborationMessage = async (
  collaborationId: string,
  content: string
): Promise<void> => {
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('Użytkownik nie jest zalogowany');
  }
  
  const { error } = await supabase
    .from('collaboration_messages')
    .insert({
      collaboration_id: collaborationId,
      sender_id: userProfile.user.id,
      content: content
    });
    
  if (error) {
    throw new Error(`Błąd podczas dodawania wiadomości: ${error.message}`);
  }
};

// Pobranie wiadomości dla współpracy
export const fetchCollaborationMessages = async (collaborationId: string) => {
  const { data, error } = await supabase
    .from('collaboration_messages')
    .select(`
      *,
      sender:profiles(*)
    `)
    .eq('collaboration_id', collaborationId)
    .order('created_at', { ascending: true });
    
  if (error) {
    throw new Error(`Błąd podczas pobierania wiadomości: ${error.message}`);
  }
  
  return data;
};

// Oznaczenie wiadomości jako przeczytanych
export const markCollaborationMessagesAsRead = async (collaborationId: string): Promise<void> => {
  const { error } = await supabase
    .rpc('mark_collaboration_messages_as_read', {
      collaboration_id: collaborationId
    });
    
  if (error) {
    throw new Error(`Błąd podczas oznaczania wiadomości jako przeczytanych: ${error.message}`);
  }
};

// Funkcja pomocnicza do transformacji danych współprac
const transformCollaborationsData = (
  data: any[], 
  userType: string
): CollaborationType[] => {
  return data.map(collab => {
    // Przygotuj dane podstawowe
    const transformedEvents = collab.events?.map((eventRel: any) => eventRel.event) || [];
    const sponsorshipOptions = collab.options || [];
    
    // Oblicz łączną kwotę ze wszystkich opcji
    const totalAmount = sponsorshipOptions.reduce(
      (sum: number, option: any) => sum + (parseFloat(option.amount) || 0), 
      0
    );
    
    // Formatuj daty
    const createdAt = new Date(collab.created_at).toLocaleDateString('pl-PL');
    const lastUpdated = new Date(collab.updated_at).toLocaleDateString('pl-PL');
    
    // Wybierz odpowiednie dane zależnie od typu użytkownika
    const eventData = transformedEvents[0] || { 
      id: 0, 
      title: "Brak wydarzenia", 
      organization: "", 
      date: "", 
      image: "" 
    };
    
    const sponsorData = userType === 'organization' 
      ? { 
          id: collab.sponsor?.id || 0, 
          name: collab.sponsor?.name || "Nieznany sponsor", 
          avatar: collab.sponsor?.avatar_url || "" 
        }
      : { 
          id: 0, 
          name: "Ty", 
          avatar: "" 
        };
    
    return {
      id: collab.id,
      event: {
        id: eventData.id,
        title: eventData.title,
        organization: eventData.organization_id ? "Organizacja" : "",
        date: eventData.start_date ? new Date(eventData.start_date).toLocaleDateString('pl-PL') : "",
        image: eventData.image_url || ""
      },
      sponsor: sponsorData,
      status: collab.status,
      createdAt: createdAt,
      lastUpdated: lastUpdated,
      sponsorshipOptions: sponsorshipOptions.map((option: any) => ({
        title: option.title,
        description: option.description || "",
        amount: parseFloat(option.amount) || 0
      })),
      totalAmount: totalAmount,
      message: collab.message || "",
      conversation: [] // Będziemy pobierać osobno
    };
  });
};
