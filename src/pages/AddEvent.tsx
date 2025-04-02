
import { useState } from 'react';
import { Calendar, MapPin, Users, Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';

const AddEvent = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState({ start: '', end: '' });
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('');
  const [attendees, setAttendees] = useState('');
  const [category, setCategory] = useState('');
  const [audienceTag, setAudienceTag] = useState('');
  const [audiences, setAudiences] = useState<string[]>([]);
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  
  // Sponsorship options
  const [sponsorshipOptions, setSponsorshipOptions] = useState<Array<{
    title: string;
    description: string;
    hasPriceRange: boolean;
    priceFrom: string;
    priceTo: string;
  }>>([]);
  const [newOption, setNewOption] = useState({
    title: '',
    description: '',
    hasPriceRange: false,
    priceFrom: '',
    priceTo: ''
  });

  const handleAddAudience = () => {
    if (audienceTag.trim() && !audiences.includes(audienceTag.trim())) {
      setAudiences([...audiences, audienceTag.trim()]);
      setAudienceTag('');
    }
  };

  const handleRemoveAudience = (audienceToRemove: string) => {
    setAudiences(audiences.filter(a => a !== audienceToRemove));
  };

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBanner(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSponsorshipOption = () => {
    if (newOption.title.trim() && newOption.description.trim()) {
      setSponsorshipOptions([...sponsorshipOptions, { ...newOption }]);
      setNewOption({
        title: '',
        description: '',
        hasPriceRange: false,
        priceFrom: '',
        priceTo: ''
      });
    }
  };

  const handleRemoveSponsorshipOption = (index: number) => {
    setSponsorshipOptions(sponsorshipOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tutaj dodajesz logikę walidacji i wysyłania formularza
    
    toast({
      title: "Wydarzenie dodane",
      description: "Twoje wydarzenie zostało pomyślnie utworzone.",
    });
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dodaj nowe wydarzenie</h1>
          <p className="text-muted-foreground">
            Wypełnij poniższy formularz, aby utworzyć nowe wydarzenie
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Podstawowe informacje */}
          <div className="grid grid-cols-1 gap-6 p-6 bg-white rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Podstawowe informacje</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Tytuł wydarzenia *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Np. Bieg Charytatywny Pomagamy Dzieciom"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Opis wydarzenia *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opisz szczegółowo, na czym polega wydarzenie, jaki jest jego cel, program, itd."
                className="min-h-[150px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-start">Data rozpoczęcia *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date-start"
                    type="date"
                    value={date.start}
                    onChange={(e) => setDate({ ...date, start: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-end">Data zakończenia</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date-end"
                    type="date"
                    value={date.end}
                    onChange={(e) => setDate({ ...date, end: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Opcjonalne - wypełnij tylko jeśli wydarzenie trwa więcej niż jeden dzień
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Dokładna lokalizacja *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Np. Park Centralny, ul. Parkowa 1"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Województwo *</Label>
              <Select value={region} onValueChange={setRegion} required>
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="attendees">Przewidywana liczba uczestników *</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="attendees"
                  type="number"
                  min="1"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategoria wydarzenia *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Charytatywne">Charytatywne</SelectItem>
                  <SelectItem value="Kulturalne">Kulturalne</SelectItem>
                  <SelectItem value="Sportowe">Sportowe</SelectItem>
                  <SelectItem value="Ekologiczne">Ekologiczne</SelectItem>
                  <SelectItem value="Studenckie">Studenckie</SelectItem>
                  <SelectItem value="Zdrowotne">Zdrowotne</SelectItem>
                  <SelectItem value="Inne">Inne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Banner */}
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Banner wydarzenia</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-gray-50">
                {bannerPreview ? (
                  <div className="relative w-full">
                    <img 
                      src={bannerPreview} 
                      alt="Preview" 
                      className="w-full h-56 object-cover rounded-lg"
                    />
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => {
                        setBanner(null);
                        setBannerPreview('');
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Przeciągnij i upuść lub kliknij, aby wybrać plik</p>
                    <p className="text-xs text-muted-foreground mb-4">PNG, JPG lub WEBP (maks. 4MB)</p>
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerChange}
                    />
                    <Label 
                      htmlFor="banner" 
                      className="btn-gradient px-4 py-2 rounded-md cursor-pointer"
                    >
                      Wybierz plik
                    </Label>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Zalecany rozmiar: 1200 x 400 pikseli. Banner będzie wyświetlany na górze strony wydarzenia.
              </p>
            </div>
          </div>

          {/* Odbiorcy i tagi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Odbiorcy wydarzenia</h2>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="audience">Dodaj grupę odbiorców</Label>
                <div className="flex">
                  <Input
                    id="audience"
                    value={audienceTag}
                    onChange={(e) => setAudienceTag(e.target.value)}
                    placeholder="Np. Rodziny z dziećmi"
                    className="rounded-r-none"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddAudience}
                    className="rounded-l-none"
                  >
                    Dodaj
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Określ, do kogo skierowane jest Twoje wydarzenie
                </p>
              </div>
              
              {audiences.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {audiences.map((audience, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 py-1.5">
                      {audience}
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleRemoveAudience(audience)}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-white rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Tagi wydarzenia</h2>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="tag">Dodaj tag</Label>
                <div className="flex">
                  <Input
                    id="tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Np. sport"
                    className="rounded-r-none"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    className="rounded-l-none"
                  >
                    Dodaj
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Dodaj tagi, które pomogą sponsorom znaleźć Twoje wydarzenie
                </p>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1.5 bg-gray-100">
                      {tag}
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social media */}
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Media społecznościowe</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Opcjonalnie dodaj linki do mediów społecznościowych związanych z wydarzeniem
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/wydarzenie"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/wydarzenie"
                />
              </div>
            </div>
          </div>

          {/* Możliwości sponsorowania */}
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Możliwości współpracy</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Określ, w jaki sposób sponsorzy mogą wesprzeć Twoje wydarzenie
            </p>
            
            <div className="space-y-6">
              {sponsorshipOptions.map((option, index) => (
                <Card key={index} className="relative">
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="icon"
                    className="absolute top-3 right-3 h-7 w-7"
                    onClick={() => handleRemoveSponsorshipOption(index)}
                  >
                    <X size={14} />
                  </Button>
                  
                  <CardContent className="p-4">
                    <div className="font-semibold mb-1">{option.title}</div>
                    <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                    
                    {option.hasPriceRange && (
                      <div className="text-sm">
                        <span className="font-medium">Budżet:</span> {option.priceFrom} - {option.priceTo} PLN
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              <div className="p-4 border rounded-lg mt-4">
                <h3 className="font-medium mb-4">Dodaj nową opcję współpracy</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="option-title">Tytuł *</Label>
                    <Input
                      id="option-title"
                      value={newOption.title}
                      onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                      placeholder="Np. Partner Główny"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="option-description">Opis *</Label>
                    <Textarea
                      id="option-description"
                      value={newOption.description}
                      onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                      placeholder="Opisz, co otrzyma sponsor w ramach tej opcji współpracy"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="has-price"
                      checked={newOption.hasPriceRange}
                      onChange={(e) => setNewOption({ ...newOption, hasPriceRange: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="has-price" className="font-normal">
                      Określ widełki cenowe (widoczne tylko dla zalogowanych sponsorów)
                    </Label>
                  </div>
                  
                  {newOption.hasPriceRange && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price-from">Od (PLN)</Label>
                        <Input
                          id="price-from"
                          type="number"
                          min="0"
                          value={newOption.priceFrom}
                          onChange={(e) => setNewOption({ ...newOption, priceFrom: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price-to">Do (PLN)</Label>
                        <Input
                          id="price-to"
                          type="number"
                          min="0"
                          value={newOption.priceTo}
                          onChange={(e) => setNewOption({ ...newOption, priceTo: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="button" 
                    onClick={handleAddSponsorshipOption}
                    className="w-full"
                    disabled={!newOption.title || !newOption.description}
                  >
                    <Plus size={16} className="mr-2" /> Dodaj opcję
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Zapisz jako szkic
            </Button>
            <Button type="submit" className="btn-gradient">
              Opublikuj wydarzenie
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddEvent;
