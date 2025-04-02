import React, { useState, FormEvent, useRef } from 'react';
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

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };
  
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAudienceChange = (audience: string) => {
    if (selectedAudience.includes(audience)) {
      setSelectedAudience(selectedAudience.filter(a => a !== audience));
    } else {
      setSelectedAudience([...selectedAudience, audience]);
    }
  };
  
  const handleAddSponsorshipOption = () => {
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
  
  const handleRemoveSponsorshipOption = (id: string) => {
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
  
  const handleAddBenefit = (id: string, benefit: string) => {
    setSponsorshipOptions(sponsorshipOptions.map(option => {
      if (option.id === id) {
        return { ...option, benefits: [...option.benefits, benefit] };
      }
      return option;
    }));
  };
  
  const handleRemoveBenefit = (id: string, benefit: string) => {
    setSponsorshipOptions(sponsorshipOptions.map(option => {
      if (option.id === id) {
        return { ...option, benefits: option.benefits.filter(b => b !== benefit) };
      }
      return option;
    }));
  };
  
  const handleSponsorshipNumberChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'priceFrom' | 'priceTo') => {
    const scrollPosition = window.scrollY;
    const value = e.target.value;
    handleSponsorshipOptionChange(id, field, value);
    window.scrollTo(0, scrollPosition);
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !description || !startDate || !city || !voivodeship) {
      toast({
        title: "Błąd formularza",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive",
      });
      return;
    }
    
    const eventData = {
      title,
      category,
      description,
      startDate,
      endDate,
      location: `${city}, ${voivodeship}`,
      detailedLocation: location,
      attendees: parseInt(attendees),
      audience: selectedAudience,
      tags,
      socialMedia: {
        facebook: fbEvent,
        linkedin: linkedinEvent
      },
      sponsorshipOptions,
      banner: bannerImage
    };
    
    console.log('Event data:', eventData);
    
    toast({
      title: "Wydarzenie dodane",
      description: "Twoje wydarzenie zostało pomyślnie dodane",
    });
    
    navigate('/wydarzenia');
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const scrollPosition = window.scrollY;
    setter(e.target.value);
    window.scrollTo(0, scrollPosition);
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
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategoria *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Opis wydarzenia *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Opisz swoje wydarzenie. Im więcej szczegółów podasz, tym większa szansa na znalezienie odpowiednich sponsorów." 
                      className="min-h-[150px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
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
                          className="pl-10" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
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
                          className="pl-10" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate}
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
                          className="pl-10" 
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="voivodeship">Województwo *</Label>
                      <Select value={voivodeship} onValueChange={setVoivodeship} required>
                        <SelectTrigger id="voivodeship">
                          <SelectValue placeholder="Wybierz województwo" />
                        </SelectTrigger>
                        <SelectContent>
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
                      onChange={(e) => setLocation(e.target.value)}
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
                        type="number" 
                        placeholder="Np. 100" 
                        className="pl-10" 
                        value={attendees}
                        onChange={(e) => handleNumberChange(e, setAttendees)}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Grupa docelowa (możesz wybrać kilka)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {audienceTypes.map((audience) => (
                        <div key={audience} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`audience-${audience}`} 
                            checked={selectedAudience.includes(audience)}
                            onCheckedChange={() => handleAudienceChange(audience)}
                          />
                          <label 
                            htmlFor={`audience-${audience}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                            className="ml-2 hover:text-destructive"
                            onClick={() => handleRemoveTag(tag)}
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
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddTag}>
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
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-4">
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
                            className="absolute top-2 right-2"
                            onClick={() => {
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
                          onClick={() => document.getElementById('banner-upload')?.click()}
                          className="mt-2"
                        >
                          <Upload size={16} className="mr-2" /> Wybierz plik
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Button type="submit" className="w-full btn-gradient">
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
