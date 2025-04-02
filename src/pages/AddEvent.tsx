
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { EventCreateValues, eventCreateSchema, SponsorshipOption } from '@/components/events/create/EventCreateSchema';
import { createEvent, getOrganizationByUserId, uploadEventBanner } from '@/services/eventCreateService';
import EventCreateForm from '@/components/events/create/EventCreateForm';

const AddEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const [sponsorshipOptions, setSponsorshipOptions] = useState<SponsorshipOption[]>([
    {
      id: '1',
      title: '',
      description: '',
      priceFrom: '',
      priceTo: '',
      benefits: []
    }
  ]);

  // Initialize form with resolver
  const methods = useForm<EventCreateValues>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: new Date(),
      city: '',
      voivodeship: '',
      detailed_location: '',
      expected_participants: '',
      category: '',
      audience: [],
      tags: [],
      facebook: '',
      linkedin: '',
    }
  });

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const resetBannerImage = () => {
    setBannerImage(null);
    setBannerPreview(null);
  };
  
  const handleAddSponsorshipOption = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const newOption: SponsorshipOption = {
      id: Date.now().toString(),
      title: '',
      description: '',
      priceFrom: '',
      priceTo: '',
      benefits: []
    };
    setSponsorshipOptions([...sponsorshipOptions, newOption]);
  };
  
  const handleRemoveSponsorshipOption = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSponsorshipOptions(sponsorshipOptions.filter(option => option.id !== id));
  };
  
  const handleSponsorshipOptionChange = (id: string, field: keyof SponsorshipOption, value: string | string[]) => {
    setSponsorshipOptions(sponsorshipOptions.map(option => {
      if (option.id === id) {
        return { ...option, [field]: value };
      }
      return option;
    }));
  };
  
  const handleAddBenefit = (id: string, benefit: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    setSponsorshipOptions(sponsorshipOptions.map(option => {
      if (option.id === id) {
        return { ...option, benefits: [...option.benefits, benefit] };
      }
      return option;
    }));
  };
  
  const handleRemoveBenefit = (id: string, benefit: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    setSponsorshipOptions(sponsorshipOptions.map(option => {
      if (option.id === id) {
        return { ...option, benefits: option.benefits.filter(b => b !== benefit) };
      }
      return option;
    }));
  };
  
  const handleSponsorshipNumberChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleSponsorshipOptionChange(id, field, value);
  };
  
  const onSubmit = async (data: EventCreateValues) => {
    if (!user) {
      toast({
        title: "Błąd autoryzacji",
        description: "Musisz być zalogowany, aby dodać wydarzenie",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get organization ID
      const organization = await getOrganizationByUserId(user.id);
      
      if (!organization) {
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać danych organizacji. Upewnij się, że jesteś zalogowany jako organizacja.",
          variant: "destructive"
        });
        return;
      }

      // Upload banner image if provided
      let imageUrl = null;
      if (bannerImage) {
        imageUrl = await uploadEventBanner(bannerImage);
      }

      // Create event
      const eventId = await createEvent(data, organization.id, imageUrl, sponsorshipOptions);

      toast({
        title: "Wydarzenie dodane",
        description: "Twoje wydarzenie zostało pomyślnie dodane",
      });
      
      // Navigate to the event details page
      navigate(`/wydarzenia/${eventId}`);
    } catch (error) {
      console.error('Error in event creation:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas dodawania wydarzenia",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dodaj nowe wydarzenie</h1>
          <p className="text-muted-foreground">
            Wypełnij formularz, aby dodać nowe wydarzenie i znaleźć sponsorów
          </p>
        </div>
        
        <EventCreateForm 
          methods={methods}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          bannerImage={bannerImage}
          bannerPreview={bannerPreview}
          handleBannerUpload={handleBannerUpload}
          resetBannerImage={resetBannerImage}
          sponsorshipOptions={sponsorshipOptions}
          handleAddSponsorshipOption={handleAddSponsorshipOption}
          handleRemoveSponsorshipOption={handleRemoveSponsorshipOption}
          handleSponsorshipOptionChange={handleSponsorshipOptionChange}
          handleAddBenefit={handleAddBenefit}
          handleRemoveBenefit={handleRemoveBenefit}
          handleSponsorshipNumberChange={handleSponsorshipNumberChange}
        />
      </div>
    </Layout>
  );
};

export default AddEvent;
