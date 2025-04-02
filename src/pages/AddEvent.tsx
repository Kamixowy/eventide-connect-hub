
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Target, 
  Radio, 
  Plus, 
  Trash2, 
  Upload, 
  Check, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  "Charytatywne",
  "Sportowe",
  "Kulturalne",
  "Edukacyjne",
  "Ekologiczne",
  "Zdrowotne",
  "Społeczne",
  "Religijne",
  "Inne"
];

const audienceTypes = [
  "Dzieci",
  "Młodzież",
  "Dorośli",
  "Seniorzy",
  "Rodziny z dziećmi",
  "Osoby z niepełnosprawnościami",
  "Społeczność lokalna",
  "Sportowcy",
  "Profesjonaliści",
  "Firmy",
  "Wolontariusze"
];

type SponsorshipOption = {
  id: string;
  title: string;
  description: string;
  priceFrom: string;
  priceTo: string;
  benefits: string[];
};

const AddEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [city, setCity] = useState('');
  const [voivodeship, setVoivodeship] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [fbEvent, setFbEvent] = useState('');
  const [linkedinEvent, setLinkedinEvent] = useState('');
  
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
  
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);

  // Stop scroll at the form level
  useEffect(() => {
    const handleFormEvents = (e: Event) => {
      e.stopPropagation();
    };

    // Stop propagation for form interactions
    const formElement = formRef.current;
    
    if (formElement) {
      formElement.addEventListener('click', handleFormEvents, true);
      formElement.addEventListener('focus', handleFormEvents, true);
      formElement.addEventListener('input', handleFormEvents, true);
      formElement.addEventListener('change', handleFormEvents, true);
    }
    
    // Add global handlers for interactive elements
    const makeInteractive = (selector: string) => {
      document.querySelectorAll(selector).forEach(element => {
        element.addEventListener('click', (e) => e.stopPropagation(), true);
        element.addEventListener('focus', (e) => e.stopPropagation(), true);
      });
    };
    
    // Make sure these elements don't trigger scroll
    makeInteractive('input');
    makeInteractive('textarea');
    makeInteractive('select');
    makeInteractive('[role="combobox"]');
    makeInteractive('[role="dialog"]');
    makeInteractive('[role="checkbox"]');
    makeInteractive('.checkbox-wrapper');
    makeInteractive('.file-upload-container');
    makeInteractive('.popover-content');
    makeInteractive('.calendar');
    
    return () => {
      if (formElement) {
        formElement.removeEventListener('click', handleFormEvents, true);
        formElement.removeEventListener('focus', handleFormEvents, true);
        formElement.removeEventListener('input', handleFormEvents, true);
        formElement.removeEventListener('change', handleFormEvents, true);
      }
    };
  }, []);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
      
      // Stop event propagation to prevent scrolling
      e.stopPropagation();
    }
  };
  
  const handleAddTag = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAudienceChange = (audience: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (selectedAudience.includes(audience)) {
      setSelectedAudience(selectedAudience.filter(a => a !== audience));
    } else {
      setSelectedAudience([...selectedAudience, audience]);
    }
  };
  
  const handleAddSponsorshipOption = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
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
    if (e) e.stopPropagation();
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
    if (e) e.stopPropagation();
    
    setSponsorshipOptions(sponsorshipOptions.map(option => {
      if (option.id === id) {
        return { ...option, benefits: [...option.benefits, benefit] };
      }
      return option;
    }));
  };
  
  const handleRemoveBenefit = (id: string, benefit: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setSponsorshipOptions(sponsorshipOptions.map(option => {
      if (option.id === id) {
        return { ...option, benefits: option.benefits.filter(b => b !== benefit) };
      }
      return option;
    }));
  };
  
  const handleSponsorshipNumberChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => {
    e.stopPropagation();
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleSponsorshipOptionChange(id, field, value);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!title || !category || !description || !startDate || !city || !voivodeship) {
      toast({
        title: "Błąd formularza",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Błąd autoryzacji",
        description: "Musisz być zalogowany, aby dodać wydarzenie",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (orgError) {
        console.error('Error fetching organization:', orgError);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać danych organizacji. Upewnij się, że jesteś zalogowany jako organizacja.",
          variant: "destructive"
        });
        return;
      }

      const organizationId = orgData.id;

      let imageUrl = null;
      if (bannerImage) {
        const fileExt = bannerImage.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `event-banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, bannerImage);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "Błąd przesyłania zdjęcia",
            description: "Nie udało się przesłać zdjęcia wydarzenia",
            variant: "destructive"
          });
        } else {
          const { data } = supabase.storage
            .from('events')
            .getPublicUrl(filePath);
          
          imageUrl = data.publicUrl;
        }
      }

      const eventPayload = {
        title,
        category,
        description,
        start_date: startDate,
        end_date: endDate || null,
        location: `${city}, ${voivodeship}`,
        detailed_location: location,
        expected_participants: attendees ? parseInt(attendees) : null,
        organization_id: organizationId,
        audience: selectedAudience,
        tags,
        image_url: imageUrl,
        social_media: {
          facebook: fbEvent,
          linkedin: linkedinEvent
        }
      };

      const { data: eventResult, error: eventError } = await supabase
        .from('events')
        .insert(eventPayload)
        .select('id')
        .single();

      if (eventError) {
        console.error('Error creating event:', eventError);
        toast({
          title: "Błąd tworzenia wydarzenia",
          description: "Nie udało się utworzyć wydarzenia",
          variant: "destructive"
        });
        return;
      }

      const eventId = eventResult.id;

      if (sponsorshipOptions.length > 0) {
        const sponsorshipData = sponsorshipOptions
          .filter(option => option.title.trim() !== '')
          .map(option => ({
            title: option.title,
            description: option.description,
            price: parseFloat(option.priceFrom) || 0,
            event_id: eventId
          }));

        if (sponsorshipData.length > 0) {
          const { error: sponsorshipError } = await supabase
            .from('sponsorship_options')
            .insert(sponsorshipData);

          if (sponsorshipError) {
            console.error('Error creating sponsorship options:', sponsorshipError);
          }
        }
      }

      toast({
        title: "Wydarzenie dodane",
        description: "Twoje wydarzenie zostało pomyślnie dodane",
      });
      
      navigate(`/wydarzenia/${eventId}`);
    } catch (error) {
      console.error('Error in event creation:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas dodawania wydarzenia",
        variant: "destructive"
      });
    }
  };

  // Updated to validate numeric input only
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    e.stopPropagation();
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  return (
    <Layout scrollToTop={false} preventScroll={true}>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dodaj nowe wydarzenie</h1>
          <p className="text-muted-foreground">
            Wypełnij formularz, aby dodać nowe wydarzenie i znaleźć sponsorów
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={formRef}>
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Podstawowe informacje</CardTitle>
                  <CardDescription>
                    Podaj podstawowe informacje o Twoim wydarzeniu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Nazwa wydarzenia *</Label>
                    <Input 
                      id="title" 
                      placeholder="Np. Bieg Charytatywny 'Pomagamy Dzieciom'" 
                      value={title}
                      onChange={(e) => {
                        e.stopPropagation();
                        setTitle(e.target.value);
                      }}
                      required
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategoria *</Label>
                    <Select 
                      value={category} 
                      onValueChange={(value) => {
                        setCategory(value);
                      }}
                      required
                    >
                      <SelectTrigger 
                        id="category" 
                        onClick={(e) => e.stopPropagation()}
                        className="pointer-events-auto"
                      >
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent className="pointer-events-auto">
                        {categories.map((cat) => (
                          <SelectItem 
                            key={cat} 
                            value={cat}
                            onClick={(e) => e.stopPropagation()}
                            className="pointer-events-auto"
                          >
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Opis wydarzenia *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Opisz swoje wydarzenie. Im więcej szczegółów podasz, tym większa szansa na znalezienie odpowiednich sponsorów." 
                      className="min-h-[150px] pointer-events-auto"
                      value={description}
                      onChange={(e) => {
                        e.stopPropagation();
                        setDescription(e.target.value);
                      }}
                      required
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data i lokalizacja</CardTitle>
                  <CardDescription>
                    Określ kiedy i gdzie odbędzie się wydarzenie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data rozpoczęcia *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="startDate" 
                          type="date" 
                          className="pl-10 pointer-events-auto" 
                          value={startDate}
                          onChange={(e) => {
                            e.stopPropagation();
                            setStartDate(e.target.value);
                          }}
                          required
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data zakończenia (opcjonalnie)</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="endDate" 
                          type="date" 
                          className="pl-10 pointer-events-auto" 
                          value={endDate}
                          onChange={(e) => {
                            e.stopPropagation();
                            setEndDate(e.target.value);
                          }}
                          min={startDate}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Miasto *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                          id="city" 
                          placeholder="Np. Warszawa" 
                          className="pl-10 pointer-events-auto" 
                          value={city}
                          onChange={(e) => {
                            e.stopPropagation();
                            setCity(e.target.value);
                          }}
                          required
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="voivodeship">Województwo *</Label>
                      <Select 
                        value={voivodeship} 
                        onValueChange={(value) => {
                          setVoivodeship(value);
                        }}
                        required
                      >
                        <SelectTrigger 
                          id="voivodeship" 
                          className="pointer-events-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SelectValue placeholder="Wybierz województwo" />
                        </SelectTrigger>
                        <SelectContent className="pointer-events-auto">
                          <SelectItem value="dolnośląskie">Dolnośląskie</SelectItem>
                          <SelectItem value="kujawsko-pomorskie">Kujawsko-pomorskie</SelectItem>
                          <SelectItem value="lubelskie">Lubelskie</SelectItem>
                          <SelectItem value="lubuskie">Lubuskie</SelectItem>
                          <SelectItem value="łódzkie">Łódzkie</SelectItem>
                          <SelectItem value="małopolskie">Małopolskie</SelectItem>
                          <SelectItem value="mazowieckie">Mazowieckie</SelectItem>
                          <SelectItem value="opolskie">Opolskie</SelectItem>
                          <SelectItem value="podkarpackie">Podkarpackie</SelectItem>
                          <SelectItem value="podlaskie">Podlaskie</SelectItem>
                          <SelectItem value="pomorskie">Pomorskie</SelectItem>
                          <SelectItem value="śląskie">Śląskie</SelectItem>
                          <SelectItem value="świętokrzyskie">Świętokrzyskie</SelectItem>
                          <SelectItem value="warmińsko-mazurskie">Warmińsko-mazurskie</SelectItem>
                          <SelectItem value="wielkopolskie">Wielkopolskie</SelectItem>
                          <SelectItem value="zachodniopomorskie">Zachodniopomorskie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Dokładna lokalizacja</Label>
                    <Input 
                      id="location" 
                      placeholder="Np. Park Miejski, ul. Przykładowa 123" 
                      value={location}
                      onChange={(e) => {
                        e.stopPropagation();
                        setLocation(e.target.value);
                      }}
                      className="pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Szczegóły wydarzenia</CardTitle>
                  <CardDescription>
                    Dodaj więcej szczegółów, aby lepiej opisać swoje wydarzenie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Przewidywana liczba uczestników</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input 
                        id="attendees" 
                        type="text" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Np. 100" 
                        className="pl-10 pointer-events-auto" 
                        value={attendees}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleNumberChange(e, setAttendees);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Grupa docelowa (możesz wybrać kilka)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {audienceTypes.map((audience) => (
                        <div key={audience} className="checkbox-wrapper flex items-center space-x-2 pointer-events-auto">
                          <Checkbox 
                            id={`audience-${audience}`} 
                            checked={selectedAudience.includes(audience)}
                            onCheckedChange={() => handleAudienceChange(audience)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAudienceChange(audience, e);
                            }}
                            className="pointer-events-auto"
                          />
                          <label 
                            htmlFor={`audience-${audience}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pointer-events-auto"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAudienceChange(audience, e);
                            }}
                          >
                            {audience}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Tagi wydarzenia</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button 
                            type="button" 
                            className="ml-2 hover:text-destructive pointer-events-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTag(tag, e);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Dodaj tag" 
                        value={newTag}
                        onChange={(e) => {
                          e.stopPropagation();
                          setNewTag(e.target.value);
                        }}
                        className="pointer-events-auto"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddTag();
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTag(e);
                        }}
                        className="pointer-events-auto"
                      >
                        <Plus size={16} className="mr-2" /> Dodaj
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tagi pomogą sponsorom znaleźć Twoje wydarzenie. Np. sport, edukacja, ekologia, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Media społecznościowe</CardTitle>
                  <CardDescription>
                    Dodaj linki do wydarzenia w mediach społecznościowych
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fbEvent">Link do wydarzenia na Facebooku</Label>
                    <Input 
                      id="fbEvent" 
                      placeholder="https://facebook.com/events/..." 
                      value={fbEvent}
                      onChange={(e) => setFbEvent(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedinEvent">Link do wydarzenia na LinkedIn</Label>
                    <Input 
                      id="linkedinEvent" 
                      placeholder="https://linkedin.com/events/..." 
                      value={linkedinEvent}
                      onChange={(e) => setLinkedinEvent(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Opcje sponsorowania</CardTitle>
                  <CardDescription>
                    Określ jakie formy sponsoringu oferujesz i jakie korzyści otrzymają sponsorzy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {sponsorshipOptions.map((option, index) => (
                    <div key={option.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Opcja sponsoringu {index + 1}</h3>
                        {sponsorshipOptions.length > 1 && (
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => handleRemoveSponsorshipOption(option.id)}
                          >
                            <Trash2 size={16} className="mr-2" /> Usuń
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`option-title-${option.id}`}>Nazwa opcji</Label>
                        <Input 
                          id={`option-title-${option.id}`} 
                          placeholder="Np. Partner Główny" 
                          value={option.title}
                          onChange={(e) => handleSponsorshipOptionChange(option.id, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`option-desc-${option.id}`}>Opis</Label>
                        <Textarea 
                          id={`option-desc-${option.id}`} 
                          placeholder="Opisz na czym polega ta opcja sponsoringu" 
                          value={option.description}
                          onChange={(e) => handleSponsorshipOptionChange(option.id, 'description', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`option-price-from-${option.id}`}>Cena od (PLN)</Label>
                          <Input 
                            id={`option-price-from-${option.id}`} 
                            type="number" 
                            placeholder="Np. 1000" 
                            value={option.priceFrom}
                            onChange={(e) => handleSponsorshipNumberChange(e, option.id, 'priceFrom')}
                            min="0"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`option-price-to-${option.id}`}>Cena do (PLN)</Label>
                          <Input 
                            id={`option-price-to-${option.id}`} 
                            type="number" 
                            placeholder="Np. 5000" 
                            value={option.priceTo}
                            onChange={(e) => handleSponsorshipNumberChange(e, option.id, 'priceTo')}
                            min={option.priceFrom || "0"}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Korzyści dla sponsora</Label>
                        <div className="space-y-2">
                          {option.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center">
                              <Check size={16} className="mr-2 text-green-500" />
                              <span className="flex-grow">{benefit}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-muted-foreground"
                                onClick={() => handleRemoveBenefit(option.id, benefit)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex space-x-2 mt-2">
                          <Input 
                            placeholder="Np. Logo na koszulkach" 
                            id={`new-benefit-${option.id}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = document.getElementById(`new-benefit-${option.id}`) as HTMLInputElement;
                                if (input.value) {
                                  handleAddBenefit(option.id, input.value);
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.getElementById(`new-benefit-${option.id}`) as HTMLInputElement;
                              if (input.value) {
                                handleAddBenefit(option.id, input.value);
                                input.value = '';
                              }
                            }}
                          >
                            <Plus size={16} className="mr-2" /> Dodaj
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleAddSponsorshipOption}
                  >
                    <Plus size={16} className="mr-2" /> Dodaj kolejną opcję sponsorowania
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1 space-y-6">
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Zdjęcie główne</CardTitle>
                    <CardDescription>
                      Dodaj zdjęcie główne wydarzenia
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-4 file-upload-container pointer-events-auto">
                      {bannerPreview ? (
                        <div className="relative">
                          <img 
                            src={bannerPreview} 
                            alt="Podgląd" 
                            className="mx-auto max-h-48 rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 pointer-events-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBannerImage(null);
                              setBannerPreview(null);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Przeciągnij i upuść lub kliknij, aby przesłać
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Zalecany rozmiar: 1200x600px, max 5MB
                            </p>
                          </div>
                        </>
                      )}
                      <input
                        type="file"
                        id="banner-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleBannerUpload}
                      />
                      {!bannerPreview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('banner-upload')?.click();
                          }}
                          className="mt-2 pointer-events-auto"
                        >
                          <Upload size={16} className="mr-2" /> Wybierz plik
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    className="w-full btn-gradient pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Dodaj wydarzenie
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddEvent;
